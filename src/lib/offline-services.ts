import { reportService, operationService } from './services';
import { storageUtils } from './offline/storage';
import { syncManager } from './offline/sync-manager';
import { requestQueue } from './offline/request-queue';
import { Report, ReliefOperation } from '../types/reports';

/**
 * Offline-aware service wrappers with automatic caching and sync queuing
 */
export const offlineReportService = {
  async getReports(): Promise<Report[]> {
    try {
      // Try to fetch from server first
      const reports = await reportService.getReports();
      // Cache for offline access
      await storageUtils.cacheReports(reports);
      return reports;
    } catch (error) {
      console.warn('Failed to fetch reports online, using cache:', error);
      // Fall back to cached data
      return storageUtils.getCachedReports();
    }
  },

  async getReportById(id: string): Promise<Report | null> {
    try {
      // Try to fetch from server
      const report = await reportService.getReportById(id);
      // Update cache
      const reports = await storageUtils.getCachedReports();
      const updated = reports.map((r: any) => r.id === id ? report : r);
      await storageUtils.cacheReports(updated);
      return report;
    } catch (error) {
      console.warn('Failed to fetch report online, using cache:', error);
      // Fall back to cache
      const reports = await storageUtils.getCachedReports();
      return reports.find((r: any) => r.id === id) || null;
    }
  },

  async createReport(data: any): Promise<Report | null> {
    try {
      // Try to create on server
      const report = await reportService.createReport(data);
      // Update cache
      const reports = await storageUtils.getCachedReports();
      reports.push(report);
      await storageUtils.cacheReports(reports);
      return report;
    } catch (error) {
      console.warn('Failed to create report online, queuing for later:', error);
      // Queue for later sync
      const tempId = `temp_${Date.now()}`;
      const report = {
        id: tempId,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Cache the report
      const reports = await storageUtils.getCachedReports();
      reports.push(report);
      await storageUtils.cacheReports(reports);

      // Queue for sync
      await requestQueue.enqueue('POST', '/reports', data, 'high');

      return report;
    }
  },

  async updateReport(id: string, data: any): Promise<Report | null> {
    try {
      // Try to update on server
      const report = await reportService.updateReport(id, data);
      // Update cache
      const reports = await storageUtils.getCachedReports();
      const updated = reports.map((r: any) => r.id === id ? report : r);
      await storageUtils.cacheReports(updated);
      return report;
    } catch (error) {
      console.warn('Failed to update report online, queuing for later:', error);
      // Queue for later sync
      await requestQueue.enqueue('PATCH', `/reports/${id}`, data, 'high');

      // Update cache optimistically
      const reports = await storageUtils.getCachedReports();
      const updated = reports.map((r: any) =>
        r.id === id
          ? {
              ...r,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : r
      );
      await storageUtils.cacheReports(updated);

      return updated.find((r: any) => r.id === id) || null;
    }
  },

  async deleteReport(id: string): Promise<boolean> {
    try {
      // Try to delete on server
      await reportService.deleteReport(id);
      // Update cache
      const reports = await storageUtils.getCachedReports();
      const updated = reports.filter((r: any) => r.id !== id);
      await storageUtils.cacheReports(updated);
      return true;
    } catch (error) {
      console.warn('Failed to delete report online, queuing for later:', error);
      // Queue for later sync
      await requestQueue.enqueue('DELETE', `/reports/${id}`, undefined, 'high');

      // Update cache optimistically
      const reports = await storageUtils.getCachedReports();
      const updated = reports.filter((r: any) => r.id !== id);
      await storageUtils.cacheReports(updated);

      return true;
    }
  },
};

/**
 * Offline-aware operations service
 */
export const offlineOperationService = {
  async getOperations(): Promise<ReliefOperation[]> {
    try {
      // Try to fetch from server first
      const operations = await operationService.getOperations();
      // Cache for offline access
      await storageUtils.cacheOperations(operations);
      return operations;
    } catch (error) {
      console.warn('Failed to fetch operations online, using cache:', error);
      // Fall back to cached data
      return storageUtils.getCachedOperations();
    }
  },

  async getOperationById(id: string): Promise<ReliefOperation | null> {
    try {
      // Try to fetch from server
      const operation = await operationService.getOperationById(id);
      // Update cache
      const operations = await storageUtils.getCachedOperations();
      const updated = operations.map((o: any) => o.id === id ? operation : o);
      await storageUtils.cacheOperations(updated);
      return operation;
    } catch (error) {
      console.warn('Failed to fetch operation online, using cache:', error);
      // Fall back to cache
      const operations = await storageUtils.getCachedOperations();
      return operations.find((o: any) => o.id === id) || null;
    }
  },

  async createOperation(data: any): Promise<ReliefOperation | null> {
    try {
      // Try to create on server
      const operation = await operationService.createOperation(data);
      // Update cache
      const operations = await storageUtils.getCachedOperations();
      operations.push(operation);
      await storageUtils.cacheOperations(operations);
      return operation;
    } catch (error) {
      console.warn('Failed to create operation online, queuing for later:', error);
      // Queue for later sync
      const tempId = `temp_${Date.now()}`;
      const operation = {
        id: tempId,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Cache the operation
      const operations = await storageUtils.getCachedOperations();
      operations.push(operation);
      await storageUtils.cacheOperations(operations);

      // Queue for sync
      await requestQueue.enqueue('POST', '/operations', data, 'critical');

      return operation;
    }
  },

  async updateOperation(id: string, data: any): Promise<ReliefOperation | null> {
    try {
      // Try to update on server
      const operation = await operationService.updateOperation(id, data);
      // Update cache
      const operations = await storageUtils.getCachedOperations();
      const updated = operations.map((o: any) => o.id === id ? operation : o);
      await storageUtils.cacheOperations(updated);
      return operation;
    } catch (error) {
      console.warn('Failed to update operation online, queuing for later:', error);
      // Queue for later sync
      await requestQueue.enqueue('PATCH', `/operations/${id}`, data, 'critical');

      // Update cache optimistically
      const operations = await storageUtils.getCachedOperations();
      const updated = operations.map((o: any) =>
        o.id === id
          ? {
              ...o,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : o
      );
      await storageUtils.cacheOperations(updated);

      return updated.find((o: any) => o.id === id) || null;
    }
  },

  async updateOperationStatus(id: string, status: string): Promise<ReliefOperation | null> {
    try {
      const operation = await operationService.updateOperationStatus(id, status);
      const operations = await storageUtils.getCachedOperations();
      const updated = operations.map((o: any) => o.id === id ? operation : o);
      await storageUtils.cacheOperations(updated);
      return operation;
    } catch (error) {
      console.warn('Failed to update operation status online, queuing for later:', error);
      await requestQueue.enqueue('PATCH', `/operations/${id}`, { status }, 'critical');

      const operations = await storageUtils.getCachedOperations();
      const updated = operations.map((o: any) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      );
      await storageUtils.cacheOperations(updated);

      return updated.find((o: any) => o.id === id) || null;
    }
  },
};

export default {
  reportService: offlineReportService,
  operationService: offlineOperationService,
};
