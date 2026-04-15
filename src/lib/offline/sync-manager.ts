import { apiClient } from '../api-client';
import { storageUtils } from './storage';
import { QueuedRequest, SyncConflict } from './types';
import { Report, ReliefOperation } from '../../types/reports';

/**
 * SyncManager handles conflict resolution and data synchronization
 */
export const syncManager = {
  /**
   * Compare local and server versions and determine resolution strategy
   */
  compareVersions(
    local: any,
    server: any
  ): 'local-wins' | 'server-wins' | 'manual' {
    // If local has newer timestamp, local wins (user's recent changes)
    if (local.updatedAt && server.updatedAt) {
      const localTime = new Date(local.updatedAt).getTime();
      const serverTime = new Date(server.updatedAt).getTime();

      if (localTime > serverTime) {
        return 'local-wins';
      } else if (serverTime > localTime) {
        return 'server-wins';
      }
    }

    // If content is identical, no conflict
    if (JSON.stringify(local) === JSON.stringify(server)) {
      return 'server-wins';
    }

    // Otherwise, manual resolution needed
    return 'manual';
  },

  /**
   * Resolve sync conflict between local and server data
   */
  async resolveSyncConflict(
    entityType: string,
    entityId: string,
    localData: any,
    serverData: any
  ): Promise<any> {
    const strategy = this.compareVersions(localData, serverData);

    // Log conflict for debugging
    console.log(
      `Conflict in ${entityType}/${entityId}: using ${strategy} strategy`
    );

    if (strategy === 'local-wins') {
      return localData;
    } else if (strategy === 'server-wins') {
      return serverData;
    } else {
      // Manual conflict - save for user review
      const syncState = await storageUtils.getSyncState();
      syncState.conflicts.push({
        entityType: entityType as 'report' | 'operation',
        entityId,
        localData,
        serverData,
      });
      await storageUtils.setSyncState(syncState);

      // Return server version by default, user can review later
      return serverData;
    }
  },

  /**
   * Get last modified timestamp for entity
   */
  async getLastModified(
    entityType: string,
    entityId: string
  ): Promise<Date | null> {
    try {
      if (entityType === 'report') {
        const reports = await storageUtils.getCachedReports();
        const report = reports.find((r: any) => r.id === entityId);
        return report?.updatedAt ? new Date(report.updatedAt) : null;
      } else if (entityType === 'operation') {
        const operations = await storageUtils.getCachedOperations();
        const operation = operations.find((o: any) => o.id === entityId);
        return operation?.updatedAt ? new Date(operation.updatedAt) : null;
      }
    } catch (error) {
      console.error('Error getting last modified:', error);
    }

    return null;
  },

  /**
   * Sync reports from server
   */
  async syncReports(): Promise<boolean> {
    try {
      const lastSync = await storageUtils.getLastSyncTime('reports');
      const query = lastSync
        ? `?since=${new Date(lastSync).toISOString()}`
        : '';

      const response = await apiClient.get<Report[]>(`/reports/sync${query}`);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to sync reports');
      }

      // Check for conflicts
      const localReports = await storageUtils.getCachedReports();
      const syncedReports = response.data;

      for (const serverReport of syncedReports) {
        const localReport = localReports.find(
          (r: any) => r.id === serverReport.id
        );

        if (
          localReport &&
          JSON.stringify(localReport) !== JSON.stringify(serverReport)
        ) {
          await this.resolveSyncConflict(
            'report',
            serverReport.id,
            localReport,
            serverReport
          );
        }
      }

      // Cache updated reports
      const allReports = [
        ...syncedReports,
        ...localReports.filter(
          (lr: any) =>
            !syncedReports.find((sr: any) => sr.id === lr.id)
        ),
      ];

      await storageUtils.cacheReports(allReports);
      return true;
    } catch (error) {
      console.error('Error syncing reports:', error);
      return false;
    }
  },

  /**
   * Sync operations from server
   */
  async syncOperations(): Promise<boolean> {
    try {
      const lastSync = await storageUtils.getLastSyncTime('operations');
      const query = lastSync
        ? `?since=${new Date(lastSync).toISOString()}`
        : '';

      const response = await apiClient.get<ReliefOperation[]>(
        `/operations/sync${query}`
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to sync operations');
      }

      // Check for conflicts
      const localOperations = await storageUtils.getCachedOperations();
      const syncedOperations = response.data;

      for (const serverOperation of syncedOperations) {
        const localOperation = localOperations.find(
          (o: any) => o.id === serverOperation.id
        );

        if (
          localOperation &&
          JSON.stringify(localOperation) !== JSON.stringify(serverOperation)
        ) {
          await this.resolveSyncConflict(
            'operation',
            serverOperation.id,
            localOperation,
            serverOperation
          );
        }
      }

      // Cache updated operations
      const allOperations = [
        ...syncedOperations,
        ...localOperations.filter(
          (lo: any) =>
            !syncedOperations.find((so: any) => so.id === lo.id)
        ),
      ];

      await storageUtils.cacheOperations(allOperations);
      return true;
    } catch (error) {
      console.error('Error syncing operations:', error);
      return false;
    }
  },

  /**
   * Sync all data
   */
  async syncAll(): Promise<boolean> {
    try {
      const reportsOk = await this.syncReports();
      const operationsOk = await this.syncOperations();
      return reportsOk && operationsOk;
    } catch (error) {
      console.error('Error syncing all data:', error);
      return false;
    }
  },
};

// Helper to add setSyncState if needed
export async function setSyncState(state: any): Promise<void> {
  const current = await storageUtils.getSyncState();
  Object.assign(current, state);
  await Promise.resolve(); // Placeholder for actual implementation
}

export default syncManager;
