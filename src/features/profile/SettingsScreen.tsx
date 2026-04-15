import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, shadows } from '../../lib/styling';
import { Card, Button } from '../../components';
import { useTheme } from '../../lib/theme/ThemeContext';

export function SettingsScreen({ navigation }: any) {
  const { isDark, themeMode, setThemeMode } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);

  const handleThemeChange = async (mode: 'light' | 'dark' | 'auto') => {
    await setThemeMode(mode);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Cài Đặt</Text>
        </View>

        <View style={styles.content}>
          {/* Appearance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 Giao Diện</Text>
            <Card>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Chế độ hiển thị</Text>
              </View>
              <View style={styles.themeButtons}>
                {['light', 'dark', 'auto'].map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      styles.themeButton,
                      themeMode === mode ? styles.themeButtonActive : {},
                    ]}
                    onPress={() => handleThemeChange(mode as any)}
                  >
                    <Text
                      style={[
                        styles.themeButtonText,
                        themeMode === mode ? styles.themeButtonTextActive : {},
                      ]}
                    >
                      {mode === 'light' && '☀️ Sáng'}
                      {mode === 'dark' && '🌙 Tối'}
                      {mode === 'auto' && '⚙️ Tự động'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔔 Thông Báo</Text>
            <Card>
              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingLabel}>Bật thông báo</Text>
                  <Text style={styles.settingDescription}>
                    Nhận cảnh báo về lũ lụt và hoạt động cứu trợ
                  </Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                  thumbColor={notifications ? colors.primary : colors.gray400}
                />
              </View>
            </Card>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Vị Trí</Text>
            <Card>
              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingLabel}>Theo dõi vị trí</Text>
                  <Text style={styles.settingDescription}>
                    Cho phép truy cập vị trí của bạn
                  </Text>
                </View>
                <Switch
                  value={locationTracking}
                  onValueChange={setLocationTracking}
                  trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                  thumbColor={locationTracking ? colors.primary : colors.gray400}
                />
              </View>
            </Card>
          </View>

          {/* Language */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌐 Ngôn Ngữ</Text>
            <Card>
              <TouchableOpacity style={styles.settingRow}>
                <Text style={styles.settingLabel}>Ngôn ngữ hiởu nhiều</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <View style={styles.languageInfo}>
                <Text style={styles.languageLabel}>Ngôn ngữ hiện tại</Text>
                <Text style={styles.languageValue}>🇻🇳 Tiếng Việt</Text>
              </View>
            </Card>
          </View>

          {/* Data */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💾 Dữ Liệu</Text>
            <Card>
              <TouchableOpacity style={styles.settingRow}>
                <Text style={styles.settingLabel}>Xóa bộ nhớ cache</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.settingRow}>
                <Text style={styles.settingLabel}>Xuất dữ liệu</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </Card>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ Về Ứng Dụng</Text>
            <Card>
              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>Phiên bản:</Text>
                <Text style={styles.aboutValue}>1.0.0</Text>
              </View>
              <View style={[styles.aboutRow, { marginTop: spacing.md }]}>
                <Text style={styles.aboutLabel}>Xây dựng:</Text>
                <Text style={styles.aboutValue}>2026.04.15</Text>
              </View>
              <View style={[styles.aboutRow, { marginTop: spacing.md }]}>
                <TouchableOpacity>
                  <Text style={styles.link}>Chính sách bảo mật</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.aboutRow, { marginTop: spacing.md }]}>
                <TouchableOpacity>
                  <Text style={styles.link}>Điều khoản sử dụng</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Button
              label="Xóa Tài Khoản"
              variant="danger"
              onPress={() => {
                // Handle account deletion
              }}
            />
          </View>
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray900,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  themeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  themeButtonText: {
    fontSize: 12,
    color: colors.gray700,
    fontWeight: '500',
  },
  themeButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
  },
  languageInfo: {
    paddingVertical: spacing.md,
  },
  languageLabel: {
    fontSize: 12,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  languageValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray900,
  },
  chevron: {
    fontSize: 18,
    color: colors.gray400,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray600,
  },
  aboutValue: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray900,
  },
  link: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
});
