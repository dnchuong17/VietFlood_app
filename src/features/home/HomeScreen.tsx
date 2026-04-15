import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, fonts, shadows, layouts } from '../../lib/styling';
import { useResponsiveLayout } from '../../lib/useResponsiveLayout';
import { Card, Loading } from '../../components';

export function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [showRainOverlay, setShowRainOverlay] = useState(false);
  const [showWindOverlay, setShowWindOverlay] = useState(false);
  const [showTempOverlay, setShowTempOverlay] = useState(false);
  const [stats, setStats] = useState({
    activeOperations: 0,
    reportsToday: 0,
    volunteerCount: 0,
    affectedAreas: 0,
  });
  const [usersStats, setUsersStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    newThisWeek: 0,
  });

  const { isTablet, isSmallPhone } = useResponsiveLayout();

  useEffect(() => {
    // Fetch home stats from API
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // TODO: Call API to fetch stats
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        activeOperations: 5,
        reportsToday: 23,
        volunteerCount: 142,
        affectedAreas: 8,
      });
      setUsersStats({
        totalUsers: 1250,
        activeToday: 487,
        newThisWeek: 62,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Trang Chủ</Text>
        <Text style={styles.subtitle}>Cập nhật thời gian thực</Text>
      </View>

      {/* Stats Grid - Responsive */}
      <View style={isTablet ? { ...styles.statsGrid, ...styles.statsGridTablet } : styles.statsGrid}>
        <Card style={isTablet ? { ...styles.statCard, flex: 0.48 } : styles.statCard}>
          <Text style={styles.statValue}>{stats.activeOperations}</Text>
          <Text style={styles.statLabel}>Hoạt Động Cứu Trợ</Text>
        </Card>
        <Card style={isTablet ? { ...styles.statCard, flex: 0.48 } : styles.statCard}>
          <Text style={styles.statValue}>{stats.reportsToday}</Text>
          <Text style={styles.statLabel}>Báo Cáo Hôm Nay</Text>
        </Card>
      </View>

      <View style={isTablet ? { ...styles.statsGrid, ...styles.statsGridTablet } : styles.statsGrid}>
        <Card style={isTablet ? { ...styles.statCard, flex: 0.48 } : styles.statCard}>
          <Text style={styles.statValue}>{stats.volunteerCount}</Text>
          <Text style={styles.statLabel}>Tình Nguyện Viên</Text>
        </Card>
        <Card style={isTablet ? { ...styles.statCard, flex: 0.48 } : styles.statCard}>
          <Text style={styles.statValue}>{stats.affectedAreas}</Text>
          <Text style={styles.statLabel}>Khu Vực Bị Ảnh Hưởng</Text>
        </Card>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hành Động Nhanh</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📝 Tạo Báo Cáo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📍 Xem Bản Đồ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>👥 Xem Hoạt Động</Text>
        </TouchableOpacity>
      </View>

      {/* Weather Overlay Toggle Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bộ Lọc Bản Đồ Thời Tiết</Text>
        <View style={[styles.overlayButtonsContainer, isSmallPhone && styles.overlayButtonsColumn]}>
          <TouchableOpacity
            style={[styles.overlayButton, showRainOverlay && styles.overlayButtonActive]}
            onPress={() => setShowRainOverlay(!showRainOverlay)}
          >
            <Text style={styles.overlayButtonText}>🌧️ Mưa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.overlayButton, showWindOverlay && styles.overlayButtonActive]}
            onPress={() => setShowWindOverlay(!showWindOverlay)}
          >
            <Text style={styles.overlayButtonText}>💨 Gió</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.overlayButton, showTempOverlay && styles.overlayButtonActive]}
            onPress={() => setShowTempOverlay(!showTempOverlay)}
          >
            <Text style={styles.overlayButtonText}>🌡️ Nhiệt Độ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Users Overview Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tổng Quan Người Dùng</Text>
        <Card style={[styles.usersCard, isTablet && styles.usersCardTablet]}>
          <View style={isTablet ? layouts.rowBetween : {}}>
            <View style={[styles.usersStatItem, !isTablet && styles.usersStatItemStacked]}>
              <Text style={styles.usersStatValue}>{usersStats.totalUsers}</Text>
              <Text style={styles.usersStatLabel}>Tổng Số Người Dùng</Text>
            </View>
            <View style={[styles.usersStatItem, !isTablet && styles.usersStatItemStacked]}>
              <Text style={[styles.usersStatValue, { color: colors.success }]}>
                {usersStats.activeToday}
              </Text>
              <Text style={styles.usersStatLabel}>Hoạt Động Hôm Nay</Text>
            </View>
            <View style={[styles.usersStatItem, !isTablet && styles.usersStatItemStacked]}>
              <Text style={[styles.usersStatValue, { color: colors.info }]}>
                {usersStats.newThisWeek}
              </Text>
              <Text style={styles.usersStatLabel}>Mới Tuần Này</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Weather Alerts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cảnh báo Thời Tiết</Text>
        <Card style={styles.alertCard}>
          <Text style={styles.alertTitle}>⚠️ Cảnh báo Mưa Lớn</Text>
          <Text style={styles.alertText}>Dự kiến mưa lớn trong 6 giờ tới tại khu vực TP.HCM</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray100,
  },
  statsGrid: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  statsGridTablet: {
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    ...shadows.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray600,
    textAlign: 'center',
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray900,
  },
  overlayButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  overlayButtonsColumn: {
    flexDirection: 'column',
  },
  overlayButton: {
    flex: 1,
    backgroundColor: colors.gray100,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  overlayButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  overlayButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray700,
  },
  usersCard: {
    padding: spacing.lg,
    ...shadows.md,
  },
  usersCardTablet: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  usersStatItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  usersStatItemStacked: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  usersStatValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  usersStatLabel: {
    fontSize: 12,
    color: colors.gray600,
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: colors.warningLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    padding: spacing.md,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d97706',
    marginBottom: spacing.xs,
  },
  alertText: {
    fontSize: 12,
    color: '#b45309',
  },
});
