import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { colors, spacing } from '../../lib/styling';
import { Card, Loading } from '../../components';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'flood_alert' | 'operation_update' | 'report_status' | 'volunteer_request';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export function NotificationsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: '🚨 Cảnh báo lũ lụt',
      message: 'Mực nước sông Hồng tăng nhanh tại khu vực Hàng Ngoài, hãy sơ tán ngay',
      type: 'flood_alert',
      timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      read: false,
      actionUrl: '/map',
    },
    {
      id: '2',
      title: '✅ Báo cáo được duyệt',
      message: 'Báo cáo lũ lụt của bạn tại Quận Hoàn Kiếm đã được duyệt',
      type: 'report_status',
      timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      read: true,
    },
    {
      id: '3',
      title: '🤝 Yêu cầu tình nguyện viên',
      message: 'Hoạt động cứu trợ ở Quận Ba Đình cần 5 tình nguyện viên',
      type: 'volunteer_request',
      timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      read: false,
    },
    {
      id: '4',
      title: '📋 Cập nhật hoạt động',
      message: 'Hoạt động cứu trợ "Sơ tán dân cư Quận Đống Đa" đã được hoàn thành',
      type: 'operation_update',
      timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
      read: true,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'flood_alert':
        return '🚨';
      case 'operation_update':
        return '📋';
      case 'report_status':
        return '✅';
      case 'volunteer_request':
        return '🤝';
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'flood_alert':
        return colors.danger;
      case 'operation_update':
        return colors.primary;
      case 'report_status':
        return colors.success;
      case 'volunteer_request':
        return colors.warning;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa mới';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => handleMarkAsRead(item.id)}
      activeOpacity={0.7}
    >
      <Card style={item.read ? styles.notificationCard : { ...styles.notificationCard, ...styles.unreadCard }}>
        <View style={styles.notificationContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{getTypeIcon(item.type)}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={item.read ? styles.notificationTitle : { ...styles.notificationTitle, ...styles.unreadTitle }}>
              {item.title}
            </Text>
            <Text style={styles.message} numberOfLines={2}>
              {item.message}
            </Text>
            <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
          </View>
          {!item.read && (
            <View
              style={[
                styles.unreadIndicator,
                { backgroundColor: getTypeColor(item.type) },
              ]}
            />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Loading />
      </SafeAreaView>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Thông Báo</Text>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            style={styles.markAllButton}
          >
            <Text style={styles.markAllText}>Đánh dấu tất cả là đã đọc</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === 'all' && styles.filterTabTextActive,
            ]}
          >
            Tất cả ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'unread' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('unread')}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === 'unread' && styles.filterTabTextActive,
            ]}
          >
            Chưa đọc ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          style={styles.list}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>
            {filter === 'unread'
              ? 'Không có thông báo chưa đọc'
              : 'Không có thông báo nào'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerTop: {
    marginBottom: spacing.md,
  },
  backButton: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray900,
  },
  markAllButton: {
    paddingVertical: spacing.sm,
  },
  markAllText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterTabActive: {
    borderBottomColor: colors.primary,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray600,
  },
  filterTabTextActive: {
    color: colors.primary,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  notificationCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  unreadCard: {
    backgroundColor: colors.primaryLight,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  message: {
    fontSize: 13,
    color: colors.gray600,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  timestamp: {
    fontSize: 12,
    color: colors.gray500,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
  },
});
