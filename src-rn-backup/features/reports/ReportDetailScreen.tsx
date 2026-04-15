import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Report } from '../../types/reports';
import { reportService } from '../../lib/services';
import { colors, spacing, shadows } from '../../lib/styling';
import { Card } from '../../components';

export function ReportDetailScreen({ route, navigation }: any) {
  const { reportId } = route.params;
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await reportService.getReportById(reportId);
      setReport(data);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.centerContainer}>
        <Text>Report not found</Text>
      </View>
    );
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
        return colors.success;
      case 'rejected':
        return colors.danger;
      case 'submitted':
        return colors.info;
      default:
        return colors.gray400;
    }
  };

  const getSeverityIcon = (severity?: string): string => {
    switch (severity) {
      case 'low':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'high':
        return '🔴';
      case 'critical':
        return '⚫';
      default:
        return '';
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
              <Text style={styles.title}>{report.title}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(report.status) },
                ]}
              >
                <Text style={styles.statusText}>{report.status}</Text>
              </View>
            </View>
            <Text style={styles.date}>
              {new Date(report.createdAt).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Meta Information */}
          <Card>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Loại:</Text>
              <Text style={styles.metaValue}>{report.type}</Text>
            </View>
            <View style={[styles.metaRow, { marginTop: spacing.md }]}>
              <Text style={styles.metaLabel}>Mức Độ:</Text>
              <Text style={styles.metaValue}>
                {getSeverityIcon(report.severity)} {report.severity || 'N/A'}
              </Text>
            </View>
            <View style={[styles.metaRow, { marginTop: spacing.md }]}>
              <Text style={styles.metaLabel}>Vị Trí:</Text>
              <Text style={styles.metaValue}>
                {report.location.province || 'Unknown'}, {report.location.address}
              </Text>
            </View>
          </Card>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô Tả Chi Tiết</Text>
            <Card>
              <Text style={styles.description}>{report.description}</Text>
            </Card>
          </View>

          {/* Photos */}
          {report.photos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Hình Ảnh ({report.photos.length})
              </Text>
              {report.photos.map((photo) => (
                <Card key={photo.id} style={styles.photoCard}>
                  <Text style={styles.photoCaption}>📷 {photo.caption}</Text>
                  <Text style={styles.photoUrl}>{photo.url}</Text>
                </Card>
              ))}
            </View>
          )}

          {/* Coordinates */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tọa độ</Text>
            <Card>
              <Text style={styles.coordinateText}>
                📍 {report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)}
              </Text>
            </Card>
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
  date: {
    fontSize: 12,
    color: colors.gray500,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 14,
    color: colors.gray700,
    lineHeight: 20,
  },
  photoCard: {
    marginBottom: spacing.md,
  },
  photoCaption: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  photoUrl: {
    fontSize: 11,
    color: colors.gray500,
  },
  coordinateText: {
    fontSize: 13,
    color: colors.gray900,
    fontWeight: '500',
  },
});
