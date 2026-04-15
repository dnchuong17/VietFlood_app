import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import * as Location from 'expo-location';
import { colors, spacing, shadows } from '../../lib/styling';
import { OfflineIndicator } from '../../lib/offline';
import { Card, Button, TextInput } from '../../components';
import { PhotoPicker, PhotoGallery, PickedImage } from '../../components/PhotoPicker';
import { offlineReportService } from '../../lib/offline-services';
import { CreateReportRequest } from '../../types/reports';

export function ReportCreationScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'flood_damage' as const,
    severity: 'medium' as const,
  });
  const [photos, setPhotos] = useState<PickedImage[]>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const getLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission', 'Location permission is required');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      // Reverse geocode to get address
      const geocoded = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocoded.length > 0) {
        const { city, region } = geocoded[0];
        setLocation((prev) => ({
          ...prev!,
          address: `${city}, ${region}`,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
      console.error(error);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !location) {
      Alert.alert('Validation', 'Please fill in all fields and set location');
      return;
    }

    setLoading(true);
    try {
      const reportData: CreateReportRequest = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
        },
        severity: formData.severity,
        photos: photos.map(p => ({
          uri: p.uri,
          name: p.name,
          type: p.type,
        })),
      };

      await offlineReportService.createReport(reportData);
      Alert.alert('Success', 'Report created successfully. It will sync when online.');
      navigation?.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotosSelected = (selectedPhotos: PickedImage[]) => {
    setPhotos([...photos, ...selectedPhotos]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Tạo Báo Cáo</Text>
        </View>

        <View style={styles.content}>
          {/* Title */}
          <TextInput
            label="Tiêu Đề *"
            placeholder="Vd: Lũ lụt ở khu phố A"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            editable={!loading}
            style={styles.input}
          />

          {/* Description */}
          <TextInput
            label="Mô Tả Chi Tiết *"
            placeholder="Mô tả tình huống, thiệt hại..."
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            editable={!loading}
            multiline
            numberOfLines={5}
            style={[styles.input, styles.textArea]}
          />

          {/* Type */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Loại Báo Cáo *</Text>
            <View style={styles.typeButtons}>
              {['flood_damage', 'evacuation', 'resource_request'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    formData.type === type ? styles.typeButtonActive : {},
                  ]}
                  onPress={() => setFormData({ ...formData, type: type as any })}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      formData.type === type ? styles.typeButtonTextActive : {},
                    ]}
                  >
                    {type === 'flood_damage' && '💧 Lũ lụt'}
                    {type === 'evacuation' && '🚨 Sơ tán'}
                    {type === 'resource_request' && '📦 Tài nguyên'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Severity */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Mức Độ *</Text>
            <View style={styles.severityButtons}>
              {['low', 'medium', 'high', 'critical'].map((severity) => (
                <TouchableOpacity
                  key={severity}
                  style={[
                    styles.severityButton,
                    formData.severity === severity
                      ? styles.severityButtonActive
                      : {},
                  ]}
                  onPress={() => setFormData({ ...formData, severity: severity as any })}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.severityButtonText,
                      formData.severity === severity
                        ? styles.severityButtonTextActive
                        : {},
                    ]}
                  >
                    {severity === 'low' && '🟢 Thấp'}
                    {severity === 'medium' && '🟡 Trung bình'}
                    {severity === 'high' && '🔴 Cao'}
                    {severity === 'critical' && '⚫ Nghiêm trọng'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Vị Trí *</Text>
            <Card
              style={location ? { ...styles.locationCard, ...styles.locationCardSet } : styles.locationCard}
            >
              {location ? (
                <>
                  <Text style={styles.locationText}>
                    📍 {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                  </Text>
                  <TouchableOpacity
                    onPress={getLocation}
                    disabled={loading && locationLoading}
                    style={styles.changeLocationButton}
                  >
                    <Text style={styles.changeLocationButtonText}>
                      {locationLoading ? 'Đang cập nhật...' : 'Cập nhật vị trí'}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={getLocation}
                  disabled={loading || locationLoading}
                >
                  {locationLoading ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <Text style={styles.getLocationText}>
                      📍 Nhấn để lấy vị trí hiện tại
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </Card>
          </View>

          {/* Photos */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Ảnh Minh Họa</Text>
            <Text style={styles.labelDescription}>
              Thêm tối đa 5 ảnh để chứng minh thông tin báo cáo
            </Text>
            <Card>
              <PhotoPicker
                onPhotosSelected={handlePhotosSelected}
                maxPhotos={5 - photos.length}
                disabled={loading || photos.length >= 5}
              />
            </Card>
            <PhotoGallery
              photos={photos}
              onRemove={handleRemovePhoto}
              editable={!loading}
            />
          </View>

          {/* Submit Button */}
          <Button
            label={loading ? 'Đang tạo...' : 'Tạo Báo Cáo'}
            variant="primary"
            onPress={handleSubmit}
            disabled={loading}
            loading={loading}
            style={styles.submitButton}
          />
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
  input: {
    marginBottom: spacing.md,
  },
  textArea: {
    textAlignVertical: 'top',
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  labelDescription: {
    fontSize: 12,
    color: colors.gray600,
    marginTop: -spacing.md,
    marginBottom: spacing.md,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  typeButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 12,
    color: colors.gray700,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  severityButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  severityButton: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  severityButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  severityButtonText: {
    fontSize: 12,
    color: colors.gray700,
    fontWeight: '500',
  },
  severityButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  locationCard: {
    paddingVertical: spacing.md,
  },
  locationCardSet: {
    backgroundColor: colors.gray50,
  },
  locationText: {
    fontSize: 14,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  getLocationText: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  changeLocationButton: {
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  changeLocationButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
