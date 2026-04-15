import { useEffect, useRef, useState, useCallback } from 'react';

interface PollingConfig {
  intervalMs?: number;
  maxRetries?: number;
  debounceMs?: number;
  autoStart?: boolean;
}

interface PollingState {
  isPolling: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

/**
 * usePolling Hook
 *
 * Provides polling functionality for real-time data updates.
 * Automatically handles retry logic, debouncing, and cleanup.
 *
 * @example
 * ```typescript
 * const { isPolling, error } = usePolling(
 *   async () => {
 *     const data = await operationService.getOperations();
 *     setOperations(data);
 *   },
 *   { intervalMs: 5000 }
 * );
 * ```
 */
export function usePolling(
  callback: () => Promise<void>,
  config: PollingConfig = {}
) {
  const {
    intervalMs = 5000,
    maxRetries = 3,
    debounceMs = 500,
    autoStart = true,
  } = config;

  const [state, setState] = useState<PollingState>({
    isPolling: false,
    error: null,
    lastUpdated: null,
  });

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const poll = useCallback(async () => {
    try {
      await callback();
      retryCountRef.current = 0; // Reset retries on success
      setState((prev) => ({
        ...prev,
        error: null,
        lastUpdated: new Date(),
      }));
    } catch (error) {
      retryCountRef.current += 1;
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error(String(error)),
      }));

      // Stop polling if max retries exceeded
      if (retryCountRef.current >= maxRetries) {
        stopPolling();
      }
    }
  }, [callback, maxRetries]);

  const startPolling = useCallback(() => {
    setState((prev) => ({ ...prev, isPolling: true }));

    // Clear existing polling
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    // Initial call
    poll();

    // Set up polling interval
    pollingRef.current = setInterval(poll, intervalMs);
  }, [poll, intervalMs]);

  const stopPolling = useCallback(() => {
    setState((prev) => ({ ...prev, isPolling: false }));
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const debouncedStart = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(startPolling, debounceMs);
  }, [startPolling, debounceMs]);

  // Auto-start polling if enabled
  useEffect(() => {
    if (autoStart) {
      startPolling();
    }
    return () => {
      stopPolling();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [autoStart, startPolling, stopPolling]);

  return {
    ...state,
    startPolling,
    stopPolling,
    debouncedStart,
  };
}

/**
 * useOperationPolling Hook
 *
 * Specialized polling hook for relief operations.
 * Automatically polls for operation updates at set intervals.
 *
 * @example
 * ```typescript
 * const { isPolling, error, operations } = useOperationPolling(operationId);
 * ```
 */
export function useOperationPolling(
  operationId: string,
  intervalMs: number = 5000
) {
  const [operations, setOperations] = useState<any[]>([]);

  const fetchOperationUpdates = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/operations/${operationId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOperations((prev) => [data]);
      }
    } catch (error) {
      console.error('Failed to fetch operation updates:', error);
    }
  }, [operationId]);

  const polling = usePolling(fetchOperationUpdates, {
    intervalMs,
    maxRetries: 5,
  });

  return {
    ...polling,
    operations: operations[0] || null,
  };
}

/**
 * useOperationsListPolling Hook
 *
 * Polls for updates to a list of relief operations.
 *
 * @example
 * ```typescript
 * const { operations, isPolling } = useOperationsListPolling();
 * ```
 */
export function useOperationsListPolling(intervalMs: number = 10000) {
  const [operations, setOperations] = useState<any[]>([]);

  const fetchOperationsUpdates = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/operations`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOperations(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch operations list:', error);
    }
  }, []);

  const polling = usePolling(fetchOperationsUpdates, {
    intervalMs,
    maxRetries: 5,
  });

  return {
    ...polling,
    operations,
  };
}

/**
 * useLiveOperationStatus Hook
 *
 * Real-time status updates for a specific operation.
 * Useful for displaying live status changes in UI.
 *
 * @example
 * ```typescript
 * const { status, volunteers, resources } = useLiveOperationStatus(operationId);
 * ```
 */
export function useLiveOperationStatus(operationId: string) {
  const [operation, setOperation] = useState<any>(null);

  const fetchOperationStatus = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/operations/${operationId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOperation(data);
      }
    } catch (error) {
      console.error('Failed to fetch operation status:', error);
    }
  }, [operationId]);

  const polling = usePolling(fetchOperationStatus, {
    intervalMs: 5000,
    maxRetries: 5,
  });

  return {
    ...polling,
    status: operation?.status,
    volunteers: operation?.volunteers || [],
    resources: operation?.resources || [],
    operation,
  };
}

/**
 * createPollingService
 *
 * Factory function to create a reusable polling service
 * for any data source.
 *
 * @example
 * ```typescript
 * const reportService = createPollingService(
 *   async () => fetch('/api/reports').then(r => r.json())
 * );
 *
 * reportService.start();
 * const reports = reportService.getData();
 * reportService.stop();
 * ```
 */
export function createPollingService<T>(
  fetcher: () => Promise<T>,
  onError?: (error: Error) => void
) {
  let data: T | null = null;
  let isPolling = false;
  let pollInterval: NodeJS.Timeout | null = null;

  const updateData = async () => {
    try {
      data = await fetcher();
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    }
  };

  return {
    start: (intervalMs: number = 5000) => {
      if (isPolling) return;
      isPolling = true;
      updateData();
      pollInterval = setInterval(updateData, intervalMs);
    },

    stop: () => {
      isPolling = false;
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    },

    getData: () => data,

    isActive: () => isPolling,

    update: () => updateData(),
  };
}
