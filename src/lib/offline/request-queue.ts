import { v4 as uuidv4 } from 'uuid';
import { apiClient } from '../api-client';
import { storageUtils } from './storage';
import { QueuedRequest } from './types';

const BACKOFF_DELAYS = [1000, 2000, 4000, 8000, 16000]; // Exponential backoff in ms

/**
 * RequestQueue manages offline request queuing and retry logic
 */
export const requestQueue = {
  /**
   * Add a request to the queue
   */
  async enqueue(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    body?: any,
    priority: 'critical' | 'high' | 'normal' = 'normal'
  ): Promise<string> {
    const request: QueuedRequest = {
      id: uuidv4(),
      method,
      url,
      body,
      priority,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 5,
    };

    await storageUtils.queueRequest(request);
    return request.id;
  },

  /**
   * Process all pending requests
   */
  async processPending(): Promise<{
    successful: number;
    failed: number;
    errors: Record<string, string>;
  }> {
    const requests = await storageUtils.getPendingRequests();

    // Sort by priority: critical > high > normal, then by timestamp
    requests.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, normal: 2 };
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.timestamp - b.timestamp;
    });

    let successful = 0;
    let failed = 0;
    const errors: Record<string, string> = {};

    for (const request of requests) {
      const processed = await this.processRequest(request);
      if (processed) {
        successful++;
        await storageUtils.removeQueuedRequest(request.id);
      } else {
        failed++;
        errors[request.id] = `Failed after ${request.retryCount} retries`;
      }
    }

    // Clear requests older than 24 hours
    await storageUtils.clearExpiredRequests();

    return { successful, failed, errors };
  },

  /**
   * Process a single request with retry logic
   */
  async processRequest(request: QueuedRequest): Promise<boolean> {
    try {
      const response = await apiClient[request.method.toLowerCase() as keyof typeof apiClient](
        request.url,
        request.body
      ) as any;

      if (response.success) {
        console.log(`Successfully processed queued request: ${request.id}`);
        return true;
      }

      // If not successful, check if we should retry
      if (request.retryCount < request.maxRetries) {
        await this.scheduleRetry(request);
        return false;
      }

      // Max retries exceeded
      console.warn(
        `Request ${request.id} failed after ${request.maxRetries} retries`
      );
      return false;
    } catch (error) {
      console.error(`Error processing request ${request.id}:`, error);

      // Schedule retry if under max attempts
      if (request.retryCount < request.maxRetries) {
        await this.scheduleRetry(request);
        return false;
      }

      return false;
    }
  },

  /**
   * Schedule retry with exponential backoff
   */
  async scheduleRetry(request: QueuedRequest): Promise<void> {
    const backoffMs =
      BACKOFF_DELAYS[Math.min(request.retryCount, BACKOFF_DELAYS.length - 1)];
    request.retryCount++;

    // Re-queue with retry count updated
    const syncState = await storageUtils.getSyncState();
    const index = syncState.pendingRequests.findIndex(
      (r) => r.id === request.id
    );
    if (index !== -1) {
      syncState.pendingRequests[index] = request;
      await Promise.resolve(); // Would need actual setSyncState implementation
    }

    console.log(
      `Scheduling retry for request ${request.id} in ${backoffMs}ms`
    );

    // Schedule a retry later
    setTimeout(async () => {
      // Retry when potentially back online
      await this.processRequest(request);
    }, backoffMs);
  },

  /**
   * Get pending request count
   */
  async getPendingCount(): Promise<number> {
    const requests = await storageUtils.getPendingRequests();
    return requests.length;
  },

  /**
   * Clear all pending requests (careful!)
   */
  async clearAll(): Promise<void> {
    const syncState = await storageUtils.getSyncState();
    syncState.pendingRequests = [];
    await Promise.resolve(); // Would need actual setSyncState implementation
  },

  /**
   * Get pending requests (for debugging)
   */
  async getPending(): Promise<QueuedRequest[]> {
    return storageUtils.getPendingRequests();
  },
};

export default requestQueue;
