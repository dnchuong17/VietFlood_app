import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useOffline } from './OfflineProvider';

export interface OfflineIndicatorProps {
  position?: 'top' | 'bottom';
  showOnline?: boolean;
}

/**
 * OfflineIndicator shows current network and sync status
 */
export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  position = 'top',
  showOnline = false,
}) => {
  const {
    isOnline,
    lastSyncTime,
    pendingSyncCount,
    isSyncing,
    syncError,
    manualSync,
    clearSyncError,
  } = useOffline();

  const shouldShow = !isOnline || pendingSyncCount > 0 || syncError;

  if (!shouldShow && !showOnline) {
    return null;
  }

  const getStatusText = (): string | null => {
    if (syncError) {
      return `Sync error: ${syncError}`;
    }
    if (!isOnline) {
      return 'Offline mode - changes will sync when online';
    }
    if (isSyncing) {
      return `Syncing... (${pendingSyncCount} pending)`;
    }
    if (pendingSyncCount > 0) {
      return `${pendingSyncCount} pending ${pendingSyncCount === 1 ? 'change' : 'changes'}`;
    }
    if (lastSyncTime && showOnline) {
      const diffMs = Date.now() - lastSyncTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) {
        return 'Synced just now';
      }
      return `Last synced ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    }
    return null;
  };

  const getBackgroundColor = (): string => {
    if (syncError) return '#dc2626'; // Red
    if (!isOnline) return '#dc2626'; // Red
    if (pendingSyncCount > 0) return '#f59e0b'; // Amber
    if (showOnline) return '#10b981'; // Green
    return 'transparent';
  };

  const statusText = getStatusText();
  if (!statusText && !showOnline) {
    return null;
  }

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        backgroundColor: getBackgroundColor(),
        [position]: 0,
      },
    ],
    [getBackgroundColor(), position]
  );

  return (
    <View style={containerStyle}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          {isSyncing && <ActivityIndicator size="small" color="white" />}
          <Text
            style={[
              styles.text,
              isSyncing && { marginLeft: 8 },
            ]}
            numberOfLines={1}
          >
            {statusText}
          </Text>
        </View>

        {(pendingSyncCount > 0 || syncError) && !isSyncing && (
          <Pressable
            style={styles.button}
            onPress={() => {
              clearSyncError();
              if (isOnline) {
                manualSync();
              }
            }}
          >
            <Text style={styles.buttonText}>
              {syncError ? 'Retry' : 'Sync'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OfflineIndicator;
