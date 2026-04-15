/**
 * Types for offline-first functionality
 */

export interface OfflineContextType {
  isOnline: boolean;
  lastSyncTime: Date | null;
  pendingSyncCount: number;
  isSyncing: boolean;
  syncError: string | null;
  manualSync: () => Promise<void>;
  clearSyncError: () => void;
}

export interface QueuedRequest {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  body?: any;
  headers?: Record<string, string>;
  priority: 'critical' | 'high' | 'normal';
  timestamp: number; // When request was queued
  retryCount: number;
  maxRetries: number;
}

export interface SyncConflict {
  entityType: 'report' | 'operation';
  entityId: string;
  localData: any;
  serverData: any;
  resolvedData?: any;
}

export interface SyncState {
  lastSyncTimestamp: Record<string, number>; // entityType -> timestamp
  pendingRequests: QueuedRequest[];
  conflicts: SyncConflict[];
}

export interface StorageKeys {
  USER_PROFILE: 'user_profile';
  AUTH_TOKENS: 'auth_tokens';
  LAST_SYNC: 'last_sync_time';
  SYNC_STATE: 'sync_state';
  OFFLINE_QUEUE: 'offline_queue';
  REPORTS: 'reports';
  OPERATIONS: 'operations';
  SETTINGS: 'user_settings';
}
