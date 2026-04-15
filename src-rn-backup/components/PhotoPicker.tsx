import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing } from '../../lib/styling';

export interface PickedImage {
  uri: string;
  name: string;
  type: string;
  size: number;
}

interface PhotoPickerProps {
  onPhotosSelected: (photos: PickedImage[]) => void;
  maxPhotos?: number;
  disabled?: boolean;
}

export function PhotoPicker({
  onPhotosSelected,
  maxPhotos = 5,
  disabled = false,
}: PhotoPickerProps) {
  const [loading, setLoading] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Cần cấp quyền truy cập camera để chụp ảnh');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  };

  const requestLibraryPermission = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Cần cấp quyền truy cập thư viện ảnh để chọn ảnh');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Library permission error:', error);
      return false;
    }
  };

  const pickFromCamera = async () => {
    if (!await requestCameraPermission()) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const photo: PickedImage = {
          uri: asset.uri,
          name: asset.filename || `photo_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: asset.width * asset.height,
        };
        onPhotosSelected([photo]);
      }
    } catch (error) {
      console.error('Camera error:', error);
      alert('Lỗi khi chụp ảnh');
    } finally {
      setLoading(false);
    }
  };

  const pickFromLibrary = async () => {
    if (!await requestLibraryPermission()) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultiple: maxPhotos > 1,
        selectionLimit: maxPhotos,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const photos: PickedImage[] = result.assets.map((asset, index) => ({
          uri: asset.uri,
          name: asset.filename || `photo_${Date.now()}_${index}.jpg`,
          type: 'image/jpeg',
          size: asset.width * asset.height,
        }));
        onPhotosSelected(photos);
      }
    } catch (error) {
      console.error('Library error:', error);
      alert('Lỗi khi chọn ảnh');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Đang tải ảnh...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.cameraButton, disabled && styles.disabled]}
        onPress={pickFromCamera}
        disabled={disabled}
      >
        <Text style={styles.buttonIcon}>📷</Text>
        <Text style={styles.buttonText}>Chụp ảnh</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.galleryButton, disabled && styles.disabled]}
        onPress={pickFromLibrary}
        disabled={disabled}
      >
        <Text style={styles.buttonIcon}>🖼️</Text>
        <Text style={styles.buttonText}>Chọn từ thư viện</Text>
      </TouchableOpacity>
    </View>
  );
}

interface PhotoGalleryProps {
  photos: PickedImage[];
  onRemove: (index: number) => void;
  editable?: boolean;
}

export function PhotoGallery({ photos, onRemove, editable = true }: PhotoGalleryProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <View style={styles.galleryContainer}>
      <Text style={styles.galleryTitle}>Ảnh ({photos.length})</Text>
      <View style={styles.photoGrid}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoItem}>
            <Image
              source={{ uri: photo.uri }}
              style={styles.photo}
            />
            {editable && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(index)}
              >
                <Text style={styles.removeIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  cameraButton: {
    backgroundColor: colors.primaryLight,
  },
  galleryButton: {
    backgroundColor: colors.infoLight,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    fontSize: 24,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray900,
  },
  loadingContainer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 13,
    color: colors.gray600,
  },
  galleryContainer: {
    marginVertical: spacing.md,
  },
  galleryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  photoItem: {
    position: 'relative',
    width: '48%',
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    backgroundColor: colors.gray200,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
