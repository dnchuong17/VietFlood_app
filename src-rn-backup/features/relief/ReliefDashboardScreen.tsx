import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ReliefOperation } from '../../types/reports';
import { operationService } from '../../lib/services';
import { colors, spacing, fonts, shadows } from '../../lib/styling';
import { Card, Button } from '../../components';
import { useRoleBasedAccess } from '../../lib/rbac';

export function ReliefDashboardScreen({ navigation }: any) {
  const [operations, setOperations] = useState<ReliefOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const { canAccess } = useRoleBasedAccess();

  useEffect(() => {
    if (canAccess(['relief_worker', 'admin'])) {
      loadOperations();
    }
  }, []);

  const loadOperations = async () => {
    setLoading(true);
    try {
      const data = await operationService.getOperations();
      setOperations(data);
    } catch (error) {
      console.error('Failed to load operations:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOperationCard = ({ item }: { item: ReliefOperation }) => (
    <TouchableOpacity
      style={styles.operationCard}
      onPress={() => navigation?.navigate('OperationDetail', { operationId: item.id })}
    >
      <View style={styles.operationHeader}>
        <Text style={styles.operationName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.operationDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.operationFooter}>
        <Text style={styles.footerText}>👥 {item.volunteers.length} tình nguyện viên</Text>
        <Text style={styles.footerText}>📦 {item.resources.length} tài nguyên</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Quản Lý Cứu Trợ</Text>
        {canAccess(['relief_worker', 'admin']) && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation?.navigate('CreateOperation')}
          >
            <Text style={styles.createButtonText}>+ Tạo Hoạt Động</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Hoạt Động Đang Diễn Ra</Text>
          <Text style={styles.statValue}>
            {operations.filter(o => o.status === 'active').length}
          </Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Tổng Tình Nguyện Viên</Text>
          <Text style={styles.statValue}>
            {operations.reduce((sum, o) => sum + o.volunteers.length, 0)}
          </Text>
        </Card>
      </View>

      {/* Operations List */}
      <FlatList
        data={operations}
        renderItem={renderOperationCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có hoạt động cứu trợ nào</Text>
          </View>
        }
      />
    </View>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return colors.success;
    case 'completed':
      return colors.info;
    case 'planned':
      return colors.warning;
    case 'cancelled':
      return colors.danger;
    default:
      return colors.gray400;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray900,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  operationCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  operationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  operationName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  operationDescription: {
    fontSize: 13,
    color: colors.gray600,
    marginBottom: spacing.sm,
  },
  operationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
    color: colors.gray500,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray500,
  },
});
