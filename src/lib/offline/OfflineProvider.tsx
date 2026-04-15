import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { AppState, AppStateStatus } from 'react-native';
import { OfflineContextType } from './types';
import { requestQueue } from './request-queue';
import { syncManager } from './sync-manager';
import { storageUtils } from './storage';

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export interface OfflineProviderProps {
  children: React.ReactNode;
}

/**
 * OfflineProvider wraps the app to manage offline state and syncing
 */
export const OfflineProvider: React.FC<OfflineProviderProps> = ({
  children,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Subscribe to network changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = (state.isConnected || false) && state.isInternetReachable !== false;
      setIsOnline(online);

      if (online) {
        // Trigger sync when coming back online
        setTimeout(() => {
          manualSync();
        }, 500);
      }
    });

    return unsubscribe;
  }, []);

  // Subscribe to app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Update pending sync count periodically
  useEffect(() => {
    const updateCount = async () => {
      const count = await requestQueue.getPendingCount();
      setPendingSyncCount(count);
    };

    updateCount();
    const interval = setInterval(updateCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAppStateChange = async (state: AppStateStatus) => {
    if (state === 'active') {
      // App came to foreground
      const online = await NetInfo.fetch().then(
        (state) =>
          state.isConnected && state.isInternetReachable !== false
      );

      if (online) {
        await manualSync();
      }
    }
  };

  const manualSync = useCallback(async () => {
    if (isSyncing || !isOnline) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      // First sync cloud data
      await syncManager.syncAll();

      // Then process queued requests
      const result = await requestQueue.processPending();

      setLastSyncTime(new Date());

      if (result.failed > 0) {
        const errorMsg = `${result.failed} requests failed to sync`;
        setSyncError(errorMsg);
        console.warn(errorMsg, result.errors);
      }

      // Update pending count
      const count = await requestQueue.getPendingCount();
      setPendingSyncCount(count);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Sync failed';
      setSyncError(errorMsg);
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, isOnline]);

  const clearSyncError = useCallback(() => {
    setSyncError(null);
  }, []);

  const value: OfflineContextType = {
    isOnline,
    lastSyncTime,
    pendingSyncCount,
    isSyncing,
    syncError,
    manualSync,
    clearSyncError,
  };

  return (
    <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
  );
};

/**
 * Hook to use offline context
 */
export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
};

export default OfflineProvider;
