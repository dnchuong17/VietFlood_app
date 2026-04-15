import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors, spacing } from '../../lib/styling';
import { Card, Loading, Button } from '../../components';
import { useAuth } from '../../features/auth/useAuth';

interface VolunteerShift {
  id: string;
  operationName: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  role: string;
  team?: string;
}

interface AvailableOperation {
  id: string;
  name: string;
  date: Date;
  location: string;
  volunteers_needed: number;
  volunteers_current: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export function VolunteerDashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'scheduled' | 'available'>('scheduled');

  const [myShifts, setMyShifts] = useState<VolunteerShift[]>([
    {
      id: '1',
      operationName: 'Sơ tán dân cư Quận Đống Đa',
      date: new Date(Date.now() + 86400000), // Tomorrow
      startTime: '08:00',
      endTime: '12:00',
      location: 'Quận Đống Đa, Hà Nội',
      status: 'confirmed',
      role: 'Logistics Coordinator',
      team: 'Team Alpha',
    },
    {
      id: '2',
      operationName: 'Phân phát hỗ trợ lũ',
      date: new Date(Date.now() + 2 * 86400000), // 2 days from now
      startTime: '09:00',
      endTime: '17:00',
      location: 'Quận Hoàn Kiếm, Hà Nội',
      status: 'pending',
      role: 'Relief Worker',
    },
    {
      id: '3',
      operationName: 'Đánh giá thiệt hại',
      date: new Date(Date.now() - 86400000), // Yesterday
      startTime: '07:00',
      endTime: '15:00',
      location: 'Quận Ba Đình, Hà Nội',
      status: 'completed',
      role: 'Assessment Team',
      team: 'Team Beta',
    },
  ]);

  const [availableOperations, setAvailableOperations] = useState<AvailableOperation[]>([
    {
      id: '1',
      name: 'Tìm kiếm và cứu nạn',
      date: new Date(Date.now() + 3 * 86400000),
      location: 'Quận Long Biên, Hà Nội',
      volunteers_needed: 10,
      volunteers_current: 6,
      severity: 'critical',
      description: 'Cần 10 tối nguyện viên để tham gia tìm kiếm người mất tích',
    },
    {
      id: '2',
      name: 'Cung cấp nước sạch',
      date: new Date(Date.now() + 4 * 86400000),
      location: 'Quận Thanh Trì, Hà Nội',
      volunteers_needed: 8,
      volunteers_current: 3,
      severity: 'high',
      description: 'Phân phát nước sạch cho khu vực bị ngập',
    },
    {
      id: '3',
      name: 'Dọn vệ sinh môi trường',
      date: new Date(Date.now() + 5 * 86400000),
      location: 'Quận Hai Bà Trưng, Hà Nội',
      volunteers_needed: 15,
      volunteers_current: 5,
      severity: 'medium',
      description: 'Giúp dọn vệ sinh sau trận lũ',
    },
  ]);

  const handleJoinOperation = (operationId: string) => {
    // Handle joining operation
    alert(`Bạn đã đăng ký hoạt động ${operationId}`);
  };

  const handleCancelShift = (shiftId: string) => {
    alert('Bạn chắc chắn muốn hủy ca làm việc này không?');
  };

  const getSeverityColor = (severity: AvailableOperation['severity']) => {
    switch (severity) {
      case 'critical':
        return colors.danger;
      case 'high':
        return colors.warning;
      case 'medium':
        return colors.primary;
      case 'low':
        return colors.success;
    }
  };

  const getSeverityLabel = (severity: AvailableOperation['severity']) => {
    switch (severity) {
      case 'critical':
        return 'Khẩn cấp';
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
    }
  };

  const getStatusColor = (status: VolunteerShift['status']) => {
    switch (status) {
      case 'confirmed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'completed':
        return colors.primary;
      case 'cancelled':
        return colors.gray500;
    }
  };

  const getStatusLabel = (status: VolunteerShift['status']) => {
    switch (status) {
      case 'confirmed':
        return '✅ Xác nhận';
      case 'pending':
        return '⏳ Chờ xác nhận';
      case 'completed':
        return '✔️ Hoàn thành';
      case 'cancelled':
        return '❌ Hủy';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderShift = ({ item }: { item: VolunteerShift }) => (
    <Card style={styles.shiftCard}>
      <View style={styles.shiftHeader}>
        <View style={styles.shiftTitleContainer}>
          <Text style={styles.operationName}>{item.operationName}</Text>
          <Text
            style={[
              styles.statusBadge,
              { backgroundColor: getSeverityColor(item.status as any) },
            ]}
          >
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.shiftDetails}>
        <Text style={styles.detailLabel}>📅 {formatDate(item.date)}</Text>
        <Text style={styles.detailLabel}>
          🕒 {item.startTime} - {item.endTime}
        </Text>
        <Text style={styles.detailLabel}>📍 {item.location}</Text>
        {item.team && <Text style={styles.detailLabel}>👥 {item.team}</Text>}
        <Text style={styles.roleLabel}>Vai trò: {item.role}</Text>
      </View>

      {item.status === 'pending' && (
        <View style={styles.shiftActions}>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Chấp nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleCancelShift(item.id)}
          >
            <Text style={styles.rejectButtonText}>Từ chối</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );

  const renderAvailableOperation = ({ item }: { item: AvailableOperation }) => (
    <Card style={styles.operationCard}>
      <View style={styles.operationHeader}>
        <View style={styles.operationTitleContainer}>
          <Text style={styles.operationTitle}>{item.name}</Text>
          <Text
            style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor(item.severity) },
            ]}
          >
            {getSeverityLabel(item.severity)}
          </Text>
        </View>
      </View>

      <Text style={styles.operationDescription}>{item.description}</Text>

      <View style={styles.operationDetails}>
        <Text style={styles.detailLabel}>📍 {item.location}</Text>
        <Text style={styles.detailLabel}>📅 {formatDate(item.date)}</Text>
      </View>

      <View style={styles.volunteerInfo}>
        <View style={styles.volunteerBar}>
          <View
            style={[
              styles.volunteerBarFilled,
              {
                width: `${(item.volunteers_current / item.volunteers_needed) * 100}%`,
                backgroundColor: getSeverityColor(item.severity),
              },
            ]}
          />
        </View>
        <Text style={styles.volunteerCount}>
          {item.volunteers_current}/{item.volunteers_needed} tình nguyện viên
        </Text>
      </View>

      <Button
        label="Đăng ký ngay"
        variant="primary"
        onPress={() => handleJoinOperation(item.id)}
        style={styles.joinButton}
      />
    </Card>
  );

  const confirmedCount = myShifts.filter((s) => s.status === 'confirmed').length;
  const upcomingShifts = myShifts.filter(
    (s) => s.date > new Date() && s.status !== 'cancelled'
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Dashboard Tình Nguyện Viên</Text>
        <Text style={styles.subtitle}>Chào {user?.name || 'bạn'},</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{confirmedCount}</Text>
          <Text style={styles.statLabel}>Ca xác nhận</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{upcomingShifts.length}</Text>
          <Text style={styles.statLabel}>Sắp tới</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {myShifts.filter((s) => s.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Hoàn thành</Text>
        </Card>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'scheduled' && styles.tabActive]}
          onPress={() => setActiveTab('scheduled')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'scheduled' && styles.tabTextActive,
            ]}
          >
            Lịch của bạn ({myShifts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.tabActive]}
          onPress={() => setActiveTab('available')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'available' && styles.tabTextActive,
            ]}
          >
            Hiện có ({availableOperations.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {activeTab === 'scheduled' ? (
          <FlatList
            data={myShifts}
            renderItem={renderShift}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyText}>
                  Bạn chưa đăng ký ca làm việc nào
                </Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={availableOperations}
            renderItem={renderAvailableOperation}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>✨</Text>
                <Text style={styles.emptyText}>
                  Không có hoạt động khả dụng
                </Text>
              </View>
            }
          />
        )}
      </ScrollView>
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray600,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray600,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    paddingHorizontal: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray600,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
  },
  shiftCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  shiftHeader: {
    marginBottom: spacing.md,
  },
  shiftTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  operationName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray900,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  shiftDetails: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.gray700,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  roleLabel: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
    marginTop: spacing.sm,
  },
  shiftActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.success,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray200,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: colors.gray700,
    fontWeight: '600',
    fontSize: 13,
  },
  operationCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  operationHeader: {
    marginBottom: spacing.md,
  },
  operationTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  operationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray900,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  operationDescription: {
    fontSize: 13,
    color: colors.gray600,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  operationDetails: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  volunteerInfo: {
    marginBottom: spacing.md,
  },
  volunteerBar: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  volunteerBarFilled: {
    height: '100%',
  },
  volunteerCount: {
    fontSize: 12,
    color: colors.gray600,
    fontWeight: '500',
  },
  joinButton: {
    marginTop: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg * 2,
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
