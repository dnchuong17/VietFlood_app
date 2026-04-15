import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../auth/hooks/useAuth';
import { colors, spacing, fonts, shadows } from '../../lib/styling';
import { Card, Button, TextInput } from '../../components';

export function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState(user?.phone || '');
  const [editError, setEditError] = useState<string | null>(null);

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      setEditError('Vui lòng nhập tên');
      return;
    }

    setIsSaving(true);
    setEditError(null);

    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) {
        throw new Error('No access token');
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/profile`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: editedName,
            phone: editedPhone,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Cập nhật thất bại');
      }

      const updatedUser = await response.json();

      // Update stored user data
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      Alert.alert('Thành Công', 'Cập nhật hồ sơ thành công', [
        {
          text: 'OK',
          onPress: () => {
            setIsEditing(false);
          },
        },
      ]);
    } catch (error: any) {
      setEditError(error.message || 'Lỗi cập nhật hồ sơ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(user?.name || '');
    setEditedPhone(user?.phone || '');
    setEditError(null);
  };

  const handleLogout = async () => {
    Alert.alert('Đăng Xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng Xuất',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation?.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <View style={styles.rolesBadge}>
              {user.roles.map((role) => (
                <Text key={role} style={styles.roleBadge}>
                  {role}
                </Text>
              ))}
            </View>
          </View>
        </View>
        {!isEditing && (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editButtonHeader}>✎</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Edit Form or View Mode */}
      {isEditing ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chỉnh Sửa Hồ Sơ</Text>
          {editError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{editError}</Text>
            </View>
          )}
          <Card style={styles.editCard}>
            <TextInput
              label="Tên"
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Nhập tên của bạn"
              style={{ marginBottom: spacing.md }}
            />
            <TextInput
              label="Số Điện Thoại"
              value={editedPhone}
              onChangeText={setEditedPhone}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              style={{ marginBottom: spacing.lg }}
            />
            <View style={styles.buttonGroup}>
              <Button
                label="Lưu"
                onPress={handleSaveProfile}
                disabled={isSaving}
                style={{ flex: 1 }}
              />
              <View style={{ width: spacing.sm }} />
              <Button
                label="Hủy"
                variant="secondary"
                onPress={handleCancel}
                disabled={isSaving}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        </View>
      ) : (
        <>
          {/* Account Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông Tin Tài Khoản</Text>
            <Card style={styles.infoCard}>
              <InfoRow label="ID" value={user.id} />
              <Divider />
              <InfoRow
                label="Điện Thoại"
                value={user.phone || 'Chưa cập nhật'}
              />
              <Divider />
              <InfoRow
                label="Ngày Tạo"
                value={new Date(user.createdAt).toLocaleDateString('vi-VN')}
              />
              <Divider />
              <InfoRow
                label="Cập Nhật"
                value={new Date(user.updatedAt).toLocaleDateString('vi-VN')}
              />
            </Card>
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tùy Chọn</Text>
            <TouchableOpacity style={styles.actionRow}>
              <Text style={styles.actionRowText}>⚙️ Cài Đặt</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionRow}>
              <Text style={styles.actionRowText}>🔔 Thông Báo</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionRow}>
              <Text style={styles.actionRowText}>💬 Phản Hồi</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionRow}>
              <Text style={styles.actionRowText}>ℹ️ Về Ứng Dụng</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <View style={styles.section}>
            <Button
              label="Đăng Xuất"
              variant="danger"
              onPress={handleLogout}
              style={{ width: '100%' }}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
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
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  editButtonHeader: {
    fontSize: 24,
    color: colors.white,
    marginLeft: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.gray100,
    marginBottom: spacing.sm,
  },
  rolesBadge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  roleBadge: {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  infoCard: {
    paddingVertical: spacing.md,
  },
  editCard: {
    padding: spacing.md,
  },
  errorContainer: {
    backgroundColor: colors.dangerLight,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: fonts.sizes.body,
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.gray600,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray900,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
    ...shadows.sm,
  },
  actionRowText: {
    fontSize: 14,
    color: colors.gray900,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 18,
    color: colors.gray400,
  },
});
