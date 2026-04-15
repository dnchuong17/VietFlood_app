import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Resource } from '../../types/reports';
import { colors, spacing, fonts, shadows } from '../../lib/styling';
import { Card } from '../../components';

interface ResourceTrackingViewProps {
  resources: Resource[];
  onResourcePress?: (resource: Resource) => void;
  loading?: boolean;
  viewMode?: 'grid' | 'list';
}

interface ResourceAllocation {
  total: number;
  available: number;
  inUse: number;
  depleted: number;
  byType: Record<string, { total: number; available: number; inUse: number }>;
}

/**
 * ResourceTrackingView component
 *
 * Displays resource allocation summary and tracking for relief operations.
 * Shows aggregated statistics and individual resource items with status.
 *
 * @example
 * ```tsx
 * const resources: Resource[] = [
 *   { id: '1', type: 'medical_supplies', quantity: 100, unit: 'packs', status: 'available' }
 * ];
 *
 * <ResourceTrackingView resources={resources} viewMode="list" />
 * ```
 */
export const ResourceTrackingView: React.FC<ResourceTrackingViewProps> = ({
  resources,
  onResourcePress,
  loading = false,
  viewMode = 'list',
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Calculate allocation statistics
  const allocation: ResourceAllocation = useMemo(() => {
    const result: ResourceAllocation = {
      total: 0,
      available: 0,
      inUse: 0,
      depleted: 0,
      byType: {},
    };

    resources.forEach((resource) => {
      result.total += resource.quantity;

      if (resource.status === 'available') result.available += resource.quantity;
      if (resource.status === 'in_use') result.inUse += resource.quantity;
      if (resource.status === 'depleted') result.depleted += resource.quantity;

      // Group by type
      if (!result.byType[resource.type]) {
        result.byType[resource.type] = { total: 0, available: 0, inUse: 0 };
      }
      result.byType[resource.type].total += resource.quantity;
      if (resource.status === 'available')
        result.byType[resource.type].available += resource.quantity;
      if (resource.status === 'in_use')
        result.byType[resource.type].inUse += resource.quantity;
    });

    return result;
  }, [resources]);

  // Filter resources by selected type
  const filteredResources = selectedType
    ? resources.filter((r) => r.type === selectedType)
    : resources;

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'available':
        return colors.success;
      case 'in_use':
        return colors.warning;
      case 'depleted':
        return colors.danger;
      default:
        return colors.gray400;
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'available':
        return 'Sẵn Sàng';
      case 'in_use':
        return 'Đang Sử Dụng';
      case 'depleted':
        return 'Hết';
      default:
        return 'Không Xác Định';
    }
  };

  const getResourceTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      medical_supplies: '📋 Vật Tư Y Tế',
      food: '🍱 Thực Phẩm',
      water: '💧 Nước',
      equipment: '🔧 Thiết Bị',
      shelter: '⛺ Nơi Trú Ẩn',
      blankets: '🛏️ Chăn',
      other: '📦 Khác',
    };
    return labels[type] || `📦 ${type}`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Allocation Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Tóm Tắt Tài Nguyên</Text>
        <View style={styles.summaryGrid}>
          <SummaryCard
            label="Tổng Cộng"
            value={allocation.total.toString()}
            backgroundColor={colors.primaryLight}
            textColor={colors.primary}
          />
          <SummaryCard
            label="Sẵn Sàng"
            value={allocation.available.toString()}
            backgroundColor={colors.successLight}
            textColor={colors.success}
          />
          <SummaryCard
            label="Đang Sử Dụng"
            value={allocation.inUse.toString()}
            backgroundColor={colors.warningLight}
            textColor={colors.warning}
          />
          <SummaryCard
            label="Hết"
            value={allocation.depleted.toString()}
            backgroundColor={colors.dangerLight}
            textColor={colors.danger}
          />
        </View>
      </View>

      {/* Resource Type Filter */}
      <View style={styles.filterSection}>
        <ScrollableFilter
          types={Object.keys(allocation.byType)}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          getTypeLabel={getResourceTypeLabel}
        />
      </View>

      {/* Resources List */}
      <View style={styles.resourcesSection}>
        <Text style={styles.resourcesTitle}>
          Tài Nguyên ({filteredResources.length})
        </Text>

        {filteredResources.length > 0 ? (
          <FlatList
            data={filteredResources}
            renderItem={({ item }) => (
              <ResourceItem
                resource={item}
                onPress={() => onResourcePress?.(item)}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
                getTypeLabel={getResourceTypeLabel}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Card>
            <Text style={styles.emptyText}>Không có tài nguyên nào</Text>
          </Card>
        )}
      </View>

      {/* Utilization Progress */}
      {allocation.total > 0 && (
        <View style={styles.utilizationSection}>
          <Text style={styles.utilizationTitle}>Mức Sử Dụng</Text>
          <Card style={styles.utilizationCard}>
            <UtilizationBar
              label="Sẵn Sàng"
              percentage={(allocation.available / allocation.total) * 100}
              color={colors.success}
            />
            <View style={styles.utilizationSpacer} />
            <UtilizationBar
              label="Đang Sử Dụng"
              percentage={(allocation.inUse / allocation.total) * 100}
              color={colors.warning}
            />
            <View style={styles.utilizationSpacer} />
            <UtilizationBar
              label="Hết"
              percentage={(allocation.depleted / allocation.total) * 100}
              color={colors.danger}
            />
          </Card>
        </View>
      )}
    </View>
  );
};

interface SummaryCardProps {
  label: string;
  value: string;
  backgroundColor: string;
  textColor: string;
}

function SummaryCard({
  label,
  value,
  backgroundColor,
  textColor,
}: SummaryCardProps) {
  return (
    <View
      style={[styles.summaryCard, { backgroundColor }]}
    >
      <Text style={[styles.summaryValue, { color: textColor }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color: textColor }]}>{label}</Text>
    </View>
  );
}

interface ScrollableFilterProps {
  types: string[];
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
  getTypeLabel: (type: string) => string;
}

function ScrollableFilter({
  types,
  selectedType,
  onSelectType,
  getTypeLabel,
}: ScrollableFilterProps) {
  return (
    <View style={styles.filterContent}>
      <TouchableOpacity
        onPress={() => onSelectType(null)}
        style={[
          styles.filterButton,
          selectedType === null && styles.filterButtonActive,
        ]}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedType === null && styles.filterButtonTextActive,
          ]}
        >
          Tất Cả
        </Text>
      </TouchableOpacity>

      {types.map((type) => (
        <TouchableOpacity
          key={type}
          onPress={() => onSelectType(type)}
          style={[
            styles.filterButton,
            selectedType === type && styles.filterButtonActive,
          ]}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedType === type && styles.filterButtonTextActive,
            ]}
          >
            {getTypeLabel(type)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

interface ResourceItemProps {
  resource: Resource;
  onPress: () => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  getTypeLabel: (type: string) => string;
}

function ResourceItem({
  resource,
  onPress,
  getStatusColor,
  getStatusLabel,
  getTypeLabel,
}: ResourceItemProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.resourceCard}>
        <View style={styles.resourceHeader}>
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceType}>{getTypeLabel(resource.type)}</Text>
            <Text style={styles.resourceQuantity}>
              {resource.quantity} {resource.unit}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(resource.status) },
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {getStatusLabel(resource.status)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

interface UtilizationBarProps {
  label: string;
  percentage: number;
  color: string;
}

function UtilizationBar({ label, percentage, color }: UtilizationBarProps) {
  return (
    <View>
      <View style={styles.utilizationLabelRow}>
        <Text style={styles.utilizationLabel}>{label}</Text>
        <Text style={styles.utilizationPercentage}>{percentage.toFixed(1)}%</Text>
      </View>
      <View style={styles.utilizationBarBg}>
        <View
          style={[
            styles.utilizationBarFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summarySection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  summaryCard: {
    flex: 0.48,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  filterSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterButton: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: colors.gray600,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  resourcesSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  resourcesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  resourceCard: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resourceInfo: {
    flex: 1,
  },
  resourceType: {
    fontSize: fonts.sizes.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  resourceQuantity: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: spacing.md,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: fonts.sizes.body,
    paddingVertical: spacing.lg,
  },
  utilizationSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  utilizationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  utilizationCard: {
    padding: spacing.md,
  },
  utilizationLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  utilizationLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  utilizationPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  utilizationBarBg: {
    height: 8,
    backgroundColor: colors.gray100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  utilizationBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  utilizationSpacer: {
    height: spacing.md,
  },
});
