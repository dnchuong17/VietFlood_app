import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, shadows } from '../lib/styling';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Xác Nhận',
  cancelText = 'Hủy',
  isDangerous = false,
  isDestructive = false,
}: ConfirmDialogProps) {
  const isConfirmDestructive = isDangerous || isDestructive;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={isConfirmDestructive ? { ...styles.confirmButton, ...styles.confirmButtonDanger } : styles.confirmButton}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  dialogContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
    ...shadows.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  message: {
    fontSize: 14,
    color: colors.gray600,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.gray200,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.gray900,
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDanger: {
    backgroundColor: colors.danger,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
