import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import DateTimePickerModal from '@react-native-community/datetimepicker';
import { colors, spacing, fonts } from '../lib/styling';

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}

/**
 * DateTimePicker wrapper component
 * 
 * Provides a consistent date/time picker UI across iOS and Android.
 * On iOS, shows a modal with native picker.
 * On Android, shows native picker dialog.
 * 
 * @example
 * ```tsx
 * const [date, setDate] = useState(new Date());
 * 
 * <DateTimePicker
 *   value={date}
 *   onChange={setDate}
 *   mode="date"
 *   label="Birth Date"
 *   placeholder="Select a date"
 * />
 * ```
 */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  mode = 'date',
  placeholder = 'Select date',
  label,
  disabled = false,
  minimumDate,
  maximumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (selectedDate) {
        onChange(selectedDate);
      }
    } else {
      // iOS - keep picker open until user confirms
      if (selectedDate) {
        onChange(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    setShowPicker(false);
  };

  const formatDate = (date: Date): string => {
    if (!date) return placeholder;

    switch (mode) {
      case 'date':
        return date.toLocaleDateString('vi-VN');
      case 'time':
        return date.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        });
      case 'datetime':
        return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString(
          'vi-VN',
          { hour: '2-digit', minute: '2-digit' }
        )}`;
      default:
        return placeholder;
    }
  };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.input, disabled && styles.inputDisabled]}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.inputText,
            !value && styles.placeholder,
            disabled && styles.inputTextDisabled,
          ]}
        >
          {formatDate(value)}
        </Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.cancelButton}>Hủy</Text>
                </TouchableOpacity>
                <Text style={styles.pickerTitle}>
                  {label || 'Chọn ' + (mode === 'date' ? 'ngày' : 'thời gian')}
                </Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.confirmButton}>Xong</Text>
                </TouchableOpacity>
              </View>

              <DateTimePickerModal
                value={value}
                mode={mode}
                display="spinner"
                onChange={handleDateChange}
                textColor={colors.text}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
              />
            </View>
          </SafeAreaView>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePickerModal
            value={value}
            mode={mode}
            display="default"
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: fonts.sizes.body,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgSecondary,
    justifyContent: 'center',
  },
  inputDisabled: {
    backgroundColor: colors.bgTertiary,
    opacity: 0.6,
  },
  inputText: {
    fontSize: fonts.sizes.body,
    color: colors.text,
  },
  inputTextDisabled: {
    color: colors.textSecondary,
  },
  placeholder: {
    color: colors.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: colors.bgPrimary,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: spacing.lg,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerTitle: {
    fontSize: fonts.sizes.body,
    fontWeight: '600',
    color: colors.text,
  },
  cancelButton: {
    fontSize: fonts.sizes.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  confirmButton: {
    fontSize: fonts.sizes.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
