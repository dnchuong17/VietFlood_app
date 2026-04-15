import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors, spacing } from '../../lib/styling';
import { Card } from '../../components';

interface StatItem {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendPercent?: number;
}

const windowWidth = Dimensions.get('window').width;

export function AnalyticsScreen({ navigation }: any) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Mock data for stats
  const stats = {
    reports: {
      total: 1247,
      approved: 1089,
      pending: 89,
      rejected: 69,
      trend: 'up',
      trendPercent: 12,
    },
    operations: {
      active: 23,
      completed: 156,
      volunteers: 2843,
      coverage: '94%',
      trend: 'up',
      trendPercent: 8,
    },
    impact: {
      peopleAffected: '45,230',
      areasCovered: 28,
      resourcesDistributed: '892 tons',
      timeSaved: '2,340 hours',
    },
  };

  const getChartData = () => {
    // Simulated chart data for flood reports by week
    if (timeRange === 'week') {
      return [
        { day: 'T2', value: 45 },
        { day: 'T3', value: 52 },
        { day: 'T4', value: 38 },
        { day: 'T5', value: 61 },
        { day: 'T6', value: 55 },
        { day: 'T7', value: 48 },
        { day: 'CN', value: 42 },
      ];
    } else if (timeRange === 'month') {
      return [
        { day: 'Tuần 1', value: 280 },
        { day: 'Tuần 2', value: 320 },
        { day: 'Tuần 3', value: 290 },
        { day: 'Tuần 4', value: 360 },
      ];
    } else {
      return [
        { day: 'T1', value: 1200 },
        { day: 'T2', value: 1450 },
        { day: 'T3', value: 1380 },
        { day: 'T4', value: 1620 },
      ];
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map((d) => Number(d.value)));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Thống Kê & Phân Tích</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {(['week', 'month', 'year'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.timeButton, timeRange === range && styles.timeButtonActive]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeButtonText,
                  timeRange === range && styles.timeButtonTextActive,
                ]}
              >
                {range === 'week' && 'Tuần'}
                {range === 'month' && 'Tháng'}
                {range === 'year' && 'Năm'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reports Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Báo Cáo Lũ Lụt</Text>
          <Card style={styles.chartCard}>
            <View style={styles.chart}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.chartColumn}>
                  <View style={styles.chartBar}>
                    <View
                      style={[
                        styles.chartBarFilled,
                        {
                          height: `${(Number(item.value) / maxValue) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartStats}>
              <View style={styles.chartStatItem}>
                <Text style={styles.chartStatLabel}>Trung bình</Text>
                <Text style={styles.chartStatValue}>
                  {Math.round(
                    chartData.reduce((sum, d) => sum + Number(d.value), 0) / chartData.length
                  )}
                </Text>
              </View>
              <View style={styles.chartStatItem}>
                <Text style={styles.chartStatLabel}>Cao nhất</Text>
                <Text style={styles.chartStatValue}>{maxValue}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Reports Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Tổng Quan Báo Cáo</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.reports.total}</Text>
              <Text style={styles.statLabel}>Tổng báo cáo</Text>
              <View style={styles.trendBadge}>
                <Text style={styles.trendIcon}>📈</Text>
                <Text style={styles.trendText}>+{stats.reports.trendPercent}%</Text>
              </View>
            </Card>
            <Card style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.success }]}>
                {stats.reports.approved}
              </Text>
              <Text style={styles.statLabel}>Đã duyệt</Text>
            </Card>
            <Card style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>
                {stats.reports.pending}
              </Text>
              <Text style={styles.statLabel}>Chờ duyệt</Text>
            </Card>
            <Card style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.danger }]}>
                {stats.reports.rejected}
              </Text>
              <Text style={styles.statLabel}>Bị từ chối</Text>
            </Card>
          </View>
        </View>

        {/* Operations Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 Hoạt Động Cứu Trợ</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {stats.operations.active}
              </Text>
              <Text style={styles.statLabel}>Hoạt động</Text>
            </Card>
            <Card style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.success }]}>
                {stats.operations.completed}
              </Text>
              <Text style={styles.statLabel}>Hoàn thành</Text>
            </Card>
            <Card style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {stats.operations.volunteers}
              </Text>
              <Text style={styles.statLabel}>Tình nguyện viên</Text>
            </Card>
            <Card style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.success }]}>
                {stats.operations.coverage}
              </Text>
              <Text style={styles.statLabel}>Phủ sóng</Text>
            </Card>
          </View>
        </View>

        {/* Impact Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💪 Tác Động</Text>
          <Card style={styles.impactCard}>
            <View style={styles.impactRow}>
              <View>
                <Text style={styles.impactIcon}>👥</Text>
              </View>
              <View style={styles.impactContent}>
                <Text style={styles.impactLabel}>Người bị ảnh hưởng</Text>
                <Text style={styles.impactValue}>{stats.impact.peopleAffected}</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.impactCard}>
            <View style={styles.impactRow}>
              <View>
                <Text style={styles.impactIcon}>🗺️</Text>
              </View>
              <View style={styles.impactContent}>
                <Text style={styles.impactLabel}>Khu vực được phủ sóng</Text>
                <Text style={styles.impactValue}>{stats.impact.areasCovered} khu vực</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.impactCard}>
            <View style={styles.impactRow}>
              <View>
                <Text style={styles.impactIcon}>📦</Text>
              </View>
              <View style={styles.impactContent}>
                <Text style={styles.impactLabel}>Hỗ trợ phân phát</Text>
                <Text style={styles.impactValue}>{stats.impact.resourcesDistributed}</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.impactCard}>
            <View style={styles.impactRow}>
              <View>
                <Text style={styles.impactIcon}>⏱️</Text>
              </View>
              <View style={styles.impactContent}>
                <Text style={styles.impactLabel}>Thời gian tiết kiệm</Text>
                <Text style={styles.impactValue}>{stats.impact.timeSaved}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Today's Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Điểm Nổi Bật Hôm Nay</Text>
          <Card>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightIcon}>🎯</Text>
              <View style={styles.highlightContent}>
                <Text style={styles.highlightTitle}>25 báo cáo mới</Text>
                <Text style={styles.highlightDescription}>Từ các khu vực lũ lụt</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.highlightItem}>
              <Text style={styles.highlightIcon}>✅</Text>
              <View style={styles.highlightContent}>
                <Text style={styles.highlightTitle}>5 hoạt động hoàn thành</Text>
                <Text style={styles.highlightDescription}>
                  Hỗ trợ 3,200 người dân
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.highlightItem}>
              <Text style={styles.highlightIcon}>👥</Text>
              <View style={styles.highlightContent}>
                <Text style={styles.highlightTitle}>150 tình nguyện viên mới</Text>
                <Text style={styles.highlightDescription}>Đang chờ phân công</Text>
              </View>
            </View>
          </Card>
        </View>
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
  },
  content: {
    padding: spacing.md,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  timeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeButtonText: {
    fontSize: 13,
    color: colors.gray700,
    fontWeight: '500',
  },
  timeButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  chartCard: {
    padding: spacing.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    marginBottom: spacing.lg,
    gap: 4,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartBar: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray100,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartBarFilled: {
    width: '100%',
    backgroundColor: colors.primary,
  },
  chartLabel: {
    fontSize: 11,
    color: colors.gray600,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  chartStatItem: {
    alignItems: 'center',
  },
  chartStatLabel: {
    fontSize: 12,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  chartStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statBox: {
    width: (windowWidth - spacing.md * 3) / 2,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  trendBadge: {
    flexDirection: 'row',
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    alignItems: 'center',
    gap: spacing.xs,
  },
  trendIcon: {
    fontSize: 12,
  },
  trendText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '600',
  },
  impactCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  impactIcon: {
    fontSize: 28,
  },
  impactContent: {
    flex: 1,
  },
  impactLabel: {
    fontSize: 12,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  impactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  highlightIcon: {
    fontSize: 24,
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  highlightDescription: {
    fontSize: 12,
    color: colors.gray600,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
  },
});
