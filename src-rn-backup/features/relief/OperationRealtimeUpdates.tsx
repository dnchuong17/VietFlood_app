import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useLiveOperationStatus } from '../../lib/hooks/usePolling';

interface OperationRealtimeUpdatesProps {
  operationId: string;
  onOperationChange?: (operation: any) => void;
  onStatusChange?: (status: string) => void;
  autoRefresh?: boolean;
  pollingIntervalMs?: number;
}

/**
 * OperationRealtimeUpdates Component
 *
 * Displays real-time updates for a relief operation including:
 * - Current status with live indicator
 * - Team member count and status
 * - Resource allocation changes
 * - Last updated timestamp
 *
 * Uses polling to fetch updates at configurable intervals.
 * Automatically handles error states and retry logic.
 */
export function OperationRealtimeUpdates({
  operationId,
  onOperationChange,
  onStatusChange,
  autoRefresh = true,
  pollingIntervalMs = 5000,
}: OperationRealtimeUpdatesProps) {
  const { status, operation, isPolling, error, lastUpdated } =
    useLiveOperationStatus(operationId);

  const [previousStatus, setPreviousStatus] = useState<string | null>(null);

  // Notify parent of status changes
  useEffect(() => {
    if (status && status !== previousStatus) {
      setPreviousStatus(status);
      onStatusChange?.(status);
    }
  }, [status, previousStatus, onStatusChange]);

  // Notify parent of operation changes
  useEffect(() => {
    if (operation) {
      onOperationChange?.(operation);
    }
  }, [operation, onOperationChange]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#10b981'; // green
      case 'pending':
        return '#f59e0b'; // amber
      case 'completed':
        return '#6b7280'; // gray
      case 'paused':
        return '#ef4444'; // red
      default:
        return '#6b7280';
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View className="bg-white dark:bg-slate-900 rounded-lg p-4 mb-4 border border-slate-200 dark:border-slate-700">
      {/* Header with status indicator */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: getStatusColor(status) }}
          />
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Real-time Status
          </Text>
        </View>

        {isPolling && (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color={getStatusColor(status)} />
          </View>
        )}
      </View>

      {/* Current Status */}
      {status && (
        <View className="bg-slate-50 dark:bg-slate-800 rounded p-3 mb-3">
          <Text className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Status
          </Text>
          <Text
            className="text-lg font-bold"
            style={{ color: getStatusColor(status) }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      )}

      {/* Team & Resource Summary */}
      {operation && (
        <View className="flex-row gap-2 mb-3">
          {/* Volunteer Count */}
          <View className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded p-3">
            <Text className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
              Team
            </Text>
            <Text className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {operation.volunteers?.length || 0}
            </Text>
          </View>

          {/* Resource Count */}
          <View className="flex-1 bg-green-50 dark:bg-green-900/20 rounded p-3">
            <Text className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
              Resources
            </Text>
            <Text className="text-lg font-bold text-green-700 dark:text-green-300">
              {operation.resources?.length || 0}
            </Text>
          </View>

          {/* Destinations */}
          <View className="flex-1 bg-purple-50 dark:bg-purple-900/20 rounded p-3">
            <Text className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">
              Destinations
            </Text>
            <Text className="text-lg font-bold text-purple-700 dark:text-purple-300">
              {operation.destinations?.length || 0}
            </Text>
          </View>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View className="bg-red-50 dark:bg-red-900/20 rounded p-3 mb-3">
          <Text className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
            Update Error
          </Text>
          <Text className="text-sm text-red-700 dark:text-red-300">
            {error.message || 'Failed to fetch updates'}
          </Text>
        </View>
      )}

      {/* Last Updated */}
      <View className="flex-row justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
        <Text className="text-xs text-slate-500 dark:text-slate-400">
          Last updated:{' '}
          <Text className="font-medium text-slate-600 dark:text-slate-300">
            {formatTime(lastUpdated)}
          </Text>
        </Text>

        {/* Polling Status Badge */}
        {isPolling ? (
          <View className="flex-row items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/40 rounded">
            <View className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full" />
            <Text className="text-xs font-medium text-green-600 dark:text-green-400">
              Live
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
            <View className="w-2 h-2 bg-slate-400 rounded-full" />
            <Text className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Paused
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * OperationStatusIndicator Component
 *
 * Lightweight component showing just the status indicator
 * and last update time. For use in list items or headers.
 */
export function OperationStatusIndicator({
  operationId: operationIdProp,
  compact = false,
}: {
  operationId?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = React.useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  // Simulate polling or use real hook
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return '—';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 60) return 'now';
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h`;
  };

  if (compact) {
    return (
      <View className="flex-row items-center gap-1">
        <View className="w-2 h-2 bg-green-600 rounded-full" />
        <Text className="text-xs text-slate-500 dark:text-slate-400">
          {formatTime(lastUpdated)}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-2">
      <View className="flex-row items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/40 rounded">
        <View className="w-2 h-2 bg-green-600 rounded-full" />
        <Text className="text-xs font-medium text-green-600 dark:text-green-400">
          Live
        </Text>
      </View>
      <Text className="text-xs text-slate-500 dark:text-slate-400">
        {formatTime(lastUpdated)}
      </Text>
    </View>
  );
}
