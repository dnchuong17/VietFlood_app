import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, shadows } from '../lib/styling';

interface StatusOption {
  label: string;
  value: string;
  color?: string;
}

interface StatusPickerProps {
  visible: boolean;
  title?: string;
  options: StatusOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onCancel: () => void;
}

export function StatusPicker({
  visible,
  title = 'Chọn Trạng Thái',
  options,
  selectedValue,
  onSelect,
  onCancel,
}: StatusPickerProps) {
  const renderOption = ({ item }: { item: StatusOption }) => (
    <TouchableOpacity
      style={[
        styles.option,
        selectedValue === item.value ? styles.optionSelected : {},
      ]}
      onPress={() => {
        onSelect(item.value);
        onCancel();
      }}
    >
      <View
        style={[
          styles.indicator,
          { backgroundColor: item.color || colors.gray400 },
        ]}
      />
      <Text
        style={[
          styles.optionText,
          selectedValue === item.value ? styles.optionTextSelected : {},
        ]}
      >
        {item.label}
      </Text>
      {selectedValue === item.value && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.skipText}>Đóng</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={{ width: 50 }} />
        </View>

        <FlatList
          data={options}
          renderItem={renderOption}
          keyExtractor={(item) => item.value}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray900,
  },
  skipText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.gray50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: colors.gray900,
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
  checkmark: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
