import AsyncStorage from '@react-native-async-storage/async-storage';
import { SyncState, QueuedRequest, StorageKeys } from './types';

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  AUTH_TOKENS: 'auth_tokens',
  LAST_SYNC: 'last_sync_time',
  SYNC_STATE: 'sync_state',
  OFFLINE_QUEUE: 'offline_queue',
  REPORTS: 'reports',
  OPERATIONS: 'operations',
  SETTINGS: 'user_settings',
} as const;

/**
 * Storage utilities for offline-first data persistence
 */
export const storageUtils = {
  /**
   * Get last sync timestamp for entity type
   */
  async getLastSyncTime(entityType: string): Promise<number | null> {
    try {
      const syncState = await this.getSyncState();
      return syncState.lastSyncTimestamp[entityType] || null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  },

  /**
   * Update last sync timestamp
   */
  async setLastSyncTime(entityType: string, timestamp: number): Promise<void> {
    try {
      const syncState = await this.getSyncState();
      syncState.lastSyncTimestamp[entityType] = timestamp;
      await AsyncStorage.setItem(
        STORAGE_KEYS.SYNC_STATE,
        JSON.stringify(syncState)
      );
    } catch (error) {
      console.error('Error setting last sync time:', error);
    }
  },

  /**
   * Get sync state (last sync times, pending requests, conflicts)
   */
  async getSyncState(): Promise<SyncState> {
    try {
      const state = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_STATE);
      if (state) {
        return JSON.parse(state) as SyncState;
      }
      return {
        lastSyncTimestamp: {},
        pendingRequests: [],
        conflicts: [],
      };
    } catch (error) {
      console.error('Error getting sync state:', error);
      return {
        lastSyncTimestamp: {},
        pendingRequests: [],
        conflicts: [],
      };
    }
  },

  /**
   * Add request to offline queue
   */
  async queueRequest(request: QueuedRequest): Promise<void> {
    try {
      const syncState = await this.getSyncState();
      syncState.pendingRequests.push(request);
      await AsyncStorage.setItem(
        STORAGE_KEYS.SYNC_STATE,
        JSON.stringify(syncState)
      );
    } catch (error) {
      console.error('Error queueing request:', error);
    }
  },

  /**
   * Get all pending requests
   */
  async getPendingRequests(): Promise<QueuedRequest[]> {
    try {
      const syncState = await this.getSyncState();
      return syncState.pendingRequests;
    } catch (error) {
      console.error('Error getting pending requests:', error);
      return [];
    }
  },

  /**
   * Remove request from queue
   */
  async removeQueuedRequest(requestId: string): Promise<void> {
    try {
      const syncState = await this.getSyncState();
      syncState.pendingRequests = syncState.pendingRequests.filter(
        (r) => r.id !== requestId
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.SYNC_STATE,
        JSON.stringify(syncState)
      );
    } catch (error) {
      console.error('Error removing queued request:', error);
    }
  },

  /**
   * Clear expired requests (older than 24 hours)
   */
  async clearExpiredRequests(): Promise<void> {
    try {
      const syncState = await this.getSyncState();
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;

      syncState.pendingRequests = syncState.pendingRequests.filter(
        (r) => now - r.timestamp < oneDayMs
      );

      await AsyncStorage.setItem(
        STORAGE_KEYS.SYNC_STATE,
        JSON.stringify(syncState)
      );
    } catch (error) {
      console.error('Error clearing expired requests:', error);
    }
  },

  /**
   * Store reports locally
   */
  async cacheReports(reports: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.REPORTS,
        JSON.stringify(reports)
      );
      await this.setLastSyncTime('reports', Date.now());
    } catch (error) {
      console.error('Error caching reports:', error);
    }
  },

  /**
   * Get cached reports
   */
  async getCachedReports(): Promise<any[]> {
    try {
      const reports = await AsyncStorage.getItem(STORAGE_KEYS.REPORTS);
      return reports ? JSON.parse(reports) : [];
    } catch (error) {
      console.error('Error getting cached reports:', error);
      return [];
    }
  },

  /**
   * Store operations locally
   */
  async cacheOperations(operations: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.OPERATIONS,
        JSON.stringify(operations)
      );
      await this.setLastSyncTime('operations', Date.now());
    } catch (error) {
      console.error('Error caching operations:', error);
    }
  },

  /**
   * Get cached operations
   */
  async getCachedOperations(): Promise<any[]> {
    try {
      const operations = await AsyncStorage.getItem(STORAGE_KEYS.OPERATIONS);
      return operations ? JSON.parse(operations) : [];
    } catch (error) {
      console.error('Error getting cached operations:', error);
      return [];
    }
  },

  /**
   * Store user profile locally
   */
  async cacheUserProfile(profile: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error('Error caching user profile:', error);
    }
  },

  /**
   * Get cached user profile
   */
  async getCachedUserProfile(): Promise<any | null> {
    try {
      const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting cached user profile:', error);
      return null;
    }
  },

  /**
   * Store user settings
   */
  async cacheSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error caching settings:', error);
    }
  },

  /**
   * Get cached settings
   */
  async getCachedSettings(): Promise<any | null> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Error getting cached settings:', error);
      return null;
    }
  },

  /**
   * Set sync state
   */
  async setSyncState(state: SyncState): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SYNC_STATE,
        JSON.stringify(state)
      );
    } catch (error) {
      console.error('Error setting sync state:', error);
    }
  },

  /**
   * Clear all offline data
   */
  async clearAll(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await Promise.all(keys.map(key => AsyncStorage.removeItem(key)));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export default storageUtils;
