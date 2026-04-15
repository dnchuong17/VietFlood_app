import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, fonts, shadows } from '../../lib/styling';
import { Card } from './Card';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status?: 'active' | 'inactive' | 'on-break';
  joinedDate?: string;
}

interface TeamMemberListProps {
  members: TeamMember[];
  onMemberPress?: (member: TeamMember) => void;
  operationName?: string;
  editable?: boolean;
}

/**
 * TeamMemberList component
 *
 * Displays a list of team members for an operation with details.
 * Supports viewing member information and optional contact actions.
 *
 * @example
 * ```tsx
 * const members: TeamMember[] = [
 *   { id: '1', name: 'Nguyễn A', role: 'Trưởng Nhóm', email: 'a@example.com', status: 'active' }
 * ];
 *
 * <TeamMemberList members={members} operationName="Cứu Hộ A" />
 * ```
 */
export const TeamMemberList: React.FC<TeamMemberListProps> = ({
  members,
  onMemberPress,
  operationName,
  editable = false,
}) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'inactive':
        return colors.gray400;
      case 'on-break':
        return colors.warning;
      default:
        return colors.info;
    }
  };

  const getStatusLabel = (status?: string): string => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      case 'on-break':
        return 'Đang nghỉ';
      default:
        return 'Không xác định';
    }
  };

  const renderMemberAvatar = (member: TeamMember): string => {
    if (member.avatar) return member.avatar.charAt(0).toUpperCase();
    return member.name.charAt(0).toUpperCase();
  };

  const renderMemberItem = ({ item }: { item: TeamMember }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedMember(item);
        setShowDetails(true);
        onMemberPress?.(item);
      }}
    >
      <Card style={styles.memberCard}>
        <View style={styles.memberContent}>
          {/* Avatar */}
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <Text style={styles.avatarText}>{renderMemberAvatar(item)}</Text>
          </View>

          {/* Member Info */}
          <View style={styles.memberInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.memberName}>{item.name}</Text>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              />
            </View>
            <Text style={styles.memberRole}>{item.role}</Text>
            {item.email && (
              <Text style={styles.memberContact} numberOfLines={1}>
                {item.email}
              </Text>
            )}
          </View>

          {/* Arrow */}
          <Text style={styles.arrow}>›</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View>
      {members.length > 0 ? (
        <FlatList
          data={members}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <Card>
          <Text style={styles.emptyText}>Không có thành viên nào</Text>
        </Card>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <Modal
          visible={showDetails}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDetails(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowDetails(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Chi Tiết Thành Viên</Text>
              <View style={{ width: 32 }} />
            </View>

            {/* Modal Content */}
            <View style={styles.modalContent}>
              {/* Member Avatar */}
              <View style={styles.detailsAvatarContainer}>
                <View
                  style={[
                    styles.detailsAvatar,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <Text style={styles.detailsAvatarText}>
                    {renderMemberAvatar(selectedMember)}
                  </Text>
                </View>
              </View>

              {/* Member Info Card */}
              <Card style={styles.detailsCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tên:</Text>
                  <Text style={styles.detailValue}>{selectedMember.name}</Text>
                </View>

                <View style={[styles.detailRow, { marginTop: spacing.md }]}>
                  <Text style={styles.detailLabel}>Chức vụ:</Text>
                  <Text style={styles.detailValue}>{selectedMember.role}</Text>
                </View>

                <View style={[styles.detailRow, { marginTop: spacing.md }]}>
                  <Text style={styles.detailLabel}>Trạng thái:</Text>
                  <View style={styles.statusBadge}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(selectedMember.status) },
                      ]}
                    />
                    <Text style={styles.statusLabel}>
                      {getStatusLabel(selectedMember.status)}
                    </Text>
                  </View>
                </View>

                {selectedMember.email && (
                  <View style={[styles.detailRow, { marginTop: spacing.md }]}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue} numberOfLines={2}>
                      {selectedMember.email}
                    </Text>
                  </View>
                )}

                {selectedMember.phone && (
                  <View style={[styles.detailRow, { marginTop: spacing.md }]}>
                    <Text style={styles.detailLabel}>Điện thoại:</Text>
                    <Text style={styles.detailValue}>{selectedMember.phone}</Text>
                  </View>
                )}

                {selectedMember.joinedDate && (
                  <View style={[styles.detailRow, { marginTop: spacing.md }]}>
                    <Text style={styles.detailLabel}>Ngày tham gia:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedMember.joinedDate).toLocaleDateString(
                        'vi-VN'
                      )}
                    </Text>
                  </View>
                )}
              </Card>

              {editable && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>📞 Gọi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>💬 Nhắn tin</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  memberCard: {
    paddingVertical: spacing.md,
  },
  memberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  memberInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  memberName: {
    fontSize: fonts.sizes.body,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.xs,
  },
  memberRole: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  memberContact: {
    fontSize: 12,
    color: colors.gray600,
  },
  arrow: {
    fontSize: 18,
    color: colors.gray400,
    marginLeft: spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: fonts.sizes.body,
    paddingVertical: spacing.lg,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    fontSize: 24,
    color: colors.gray600,
    width: 32,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  detailsAvatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  detailsAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsAvatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  detailsCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: fonts.sizes.body,
    fontWeight: '600',
    color: colors.text,
    flex: 0.35,
  },
  detailValue: {
    fontSize: fonts.sizes.body,
    color: colors.textSecondary,
    flex: 0.65,
    textAlign: 'right',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.text,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: fonts.sizes.body,
    fontWeight: '600',
  },
});
