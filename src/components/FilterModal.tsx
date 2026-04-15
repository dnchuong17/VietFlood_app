import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, shadows } from '../lib/styling';
import { Button } from './Button';

interface FilterOptions {
  status?: string[];
  type?: string[];
  severity?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
}

interface FilterModalProps {
  visible: boolean;
  onApply: (filters: FilterOptions) => void;
  onReset: () => void;
  onCancel: () => void;
}

const statusOptions = ['draft', 'submitted', 'approved', 'rejected'];
const typeOptions = ['flood_damage', 'evacuation', 'resource_request', 'other'];
const severityOptions = ['low', 'medium', 'high', 'critical'];

export function FilterModal({
  visible,
  onApply,
  onReset,
  onCancel,
}: FilterModalProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);

  const toggleOption = (
    value: string,
    selected: string[],
    setter: (items: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setter(selected.filter((item) => item !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const handleApply = () => {
    onApply({
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      type: selectedTypes.length > 0 ? selectedTypes : undefined,
      severity: selectedSeverities.length > 0 ? selectedSeverities : undefined,
    });
    onCancel();
  };

  const handleReset = () => {
    setSelectedStatuses([]);
    setSelectedTypes([]);
    setSelectedSeverities([]);
    onReset();
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Lọc Báo Cáo</Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Status Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trạng Thái</Text>
            <View style={styles.optionsGrid}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.optionButton,
                    selectedStatuses.includes(status)
                      ? styles.optionButtonSelected
                      : {},
                  ]}
                  onPress={() =>
                    toggleOption(status, selectedStatuses, setSelectedStatuses)
                  }
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedStatuses.includes(status)
                        ? styles.optionButtonTextSelected
                        : {},
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Type Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Loại Báo Cáo</Text>
            <View style={styles.optionsGrid}>
              {typeOptions.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionButton,
                    selectedTypes.includes(type)
                      ? styles.optionButtonSelected
                      : {},
                  ]}
                  onPress={() =>
                    toggleOption(type, selectedTypes, setSelectedTypes)
                  }
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedTypes.includes(type)
                        ? styles.optionButtonTextSelected
                        : {},
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Severity Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mức Độ</Text>
            <View style={styles.optionsGrid}>
              {severityOptions.map((severity) => (
                <TouchableOpacity
                  key={severity}
                  style={[
                    styles.optionButton,
                    selectedSeverities.includes(severity)
                      ? styles.optionButtonSelected
                      : {},
                  ]}
                  onPress={() =>
                    toggleOption(
                      severity,
                      selectedSeverities,
                      setSelectedSeverities
                    )
                  }
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedSeverities.includes(severity)
                        ? styles.optionButtonTextSelected
                        : {},
                    ]}
                  >
                    {severity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label="Xóa Bộ Lọc"
            variant="secondary"
            onPress={handleReset}
            style={styles.button}
          />
          <Button
            label="Áp Dụng"
            variant="primary"
            onPress={handleApply}
            style={styles.button}
          />
        </View>
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
  closeButton: {
    fontSize: 24,
    color: colors.gray900,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray900,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  section: {
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray100,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionButtonText: {
    fontSize: 12,
    color: colors.gray700,
    fontWeight: '500',
  },
  optionButtonTextSelected: {
    color: colors.white,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  button: {
    flex: 1,
  },
});
