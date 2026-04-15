import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { ReliefOperation } from '../../types/reports';
import { operationService } from '../../lib/services';
import { colors, spacing, shadows } from '../../lib/styling';
import { Card, Button, ConfirmDialog } from '../../components';
import { TeamMemberList, TeamMember } from './TeamMemberList';
import { ResourceTrackingView } from './ResourceTrackingView';
import { useRoleBasedAccess } from '../../lib/rbac';

export function OperationDetailScreen({ route, navigation }: any) {
  const { operationId } = route.params;
  const [operation, setOperation] = useState<ReliefOperation | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const { canAccess } = useRoleBasedAccess();

  useEffect(() => {
    loadOperation();
  }, [operationId]);

  const loadOperation = async () => {
    setLoading(true);
    try {
      const data = await operationService.getOperationById(operationId);
      setOperation(data);
    } catch (error) {
      console.error('Failed to load operation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!operation) return;
    setUpdating(true);
    try {
      const updated = await operationService.updateOperationStatus(
        operation.id,
        newStatus
      );
      setOperation(updated);
      Alert.alert('Success', 'Operation status updated');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!operation) {
    return (
      <View style={styles.centerContainer}>
        <Text>Operation not found</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Title & Status */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{operation.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(operation.status) },
                ]}
              >
                <Text style={styles.statusText}>{operation.status}</Text>
              </View>
            </View>
            {canAccess(['relief_worker', 'admin']) && (
              <Button
                label="Thay Đổi Trạng Thái"
                variant="secondary"
                onPress={() => setShowStatusDialog(true)}
                style={styles.updateButton}
              />
            )}
          </View>

          {/* Description */}
          <Card>
            <Text style={styles.description}>{operation.description}</Text>
          </Card>

          {/* Meta Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông Tin Hoạt Động</Text>
            <Card>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Người dẫn đầu:</Text>
                <Text style={styles.metaValue}>{operation.teamLead}</Text>
              </View>
              <View style={[styles.metaRow, { marginTop: spacing.md }]}>
                <Text style={styles.metaLabel}>Vị trí:</Text>
                <Text style={styles.metaValue}>
                  {operation.location.province || 'Unknown'}
                </Text>
              </View>
              <View style={[styles.metaRow, { marginTop: spacing.md }]}>
                <Text style={styles.metaLabel}>Ngày bắt đầu:</Text>
                <Text style={styles.metaValue}>
                  {new Date(operation.startDate).toLocaleDateString('vi-VN')}
                </Text>
              </View>
              {operation.endDate && (
                <View style={[styles.metaRow, { marginTop: spacing.md }]}>
                  <Text style={styles.metaLabel}>Ngày kết thúc:</Text>
                  <Text style={styles.metaValue}>
                    {new Date(operation.endDate).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              )}
            </Card>
          </View>

          {/* Volunteers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Tình Nguyện Viên ({operation.volunteers.length})
            </Text>
            <TeamMemberList
              members={operation.volunteers.map((name, index) => ({
                id: `volunteer-${index}`,
                name,
                role: 'Tình Nguyện Viên',
                status: 'active',
              } as TeamMember))}
              operationName={operation.name}
            />
          </View>

          {/* Resources */}
          <View style={styles.section}>
            <ResourceTrackingView resources={operation.resources} />
          </View>
        </View>
      </ScrollView>

      {/* Status Update Dialog */}
      {showStatusDialog && (
        <StatusUpdateDialog
          operation={operation}
          onSelect={handleStatusUpdate}
          onClose={() => setShowStatusDialog(false)}
          isUpdating={updating}
        />
      )}
    </SafeAreaView>
  );
}

function StatusUpdateDialog({
  operation,
  onSelect,
  onClose,
  isUpdating,
}: {
  operation: ReliefOperation;
  onSelect: (status: string) => void;
  onClose: () => void;
  isUpdating: boolean;
}) {
  return (
    <View style={styles.dialogOverlay}>
      <Card style={styles.dialog}>
        <Text style={styles.dialogTitle}>Chọn Trạng Thái Mới</Text>
        {['planned', 'active', 'paused', 'completed', 'cancelled'].map((status) => (
          <TouchableOpacity
            key={status}
            style={styles.dialogOption}
            onPress={() => onSelect(status)}
            disabled={isUpdating}
          >
            <Text
              style={[
                styles.dialogOptionText,
                operation.status === status ? styles.dialogOptionTextActive : {},
              ]}
            >
              {status === 'planned' && '📋 Kế hoạch'}
              {status === 'active' && '🚀 Đang diễn ra'}
              {status === 'paused' && '⏸️ Tạm dừng'}
              {status === 'completed' && '✅ Hoàn thành'}
              {status === 'cancelled' && '❌ Hủy bỏ'}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={onClose} disabled={isUpdating} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Đóng</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  content: {
    padding: spacing.md,
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray900,
    marginRight: spacing.md,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  updateButton: {
    width: '100%',
  },
  description: {
    fontSize: 14,
    color: colors.gray700,
    lineHeight: 20,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray600,
  },
  metaValue: {
    fontSize: 13,
    color: colors.gray900,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 13,
    color: colors.gray500,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  dialogOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  dialog: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  dialogOption: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  dialogOptionText: {
    fontSize: 14,
    color: colors.gray700,
  },
  dialogOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.gray600,
    fontSize: 14,
    fontWeight: '600',
  },
});
