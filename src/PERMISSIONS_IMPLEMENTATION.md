# Permissions & System Integration Implementation

## Overview

This document covers the permission handling and system integration implemented in the VietFlood React Native application for accessing device sensors (location, camera, photo library) required by core features.

## Implemented Permissions

### 1. Location Permissions ✅

**Purpose:** Auto-detect user location for flood reports and relief operations mapping

**Implementation:**

#### Permission Request (MapComponent)
```typescript
import * as Location from 'expo-location';

const getLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission', 'Location permission is required');
      return;
    }
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
  } catch (error) {
    Alert.alert('Error', 'Failed to get location');
  }
};
```

#### Permission Levels

**Foreground Permission** (Active location tracking)
```json
"expo.permissions.LOCATION_FOREGROUND": "Vị trí hiện tại để báo cáo lũ lụt"
```

**Usage Locations:**
- ReportCreationScreen: Auto-detect location when creating report
- MapComponent: Center map on user location
- VolunteerDashboard: Show nearby operations

**Configuration in app.json:**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Cần quyền vị trí để hoạt động tốt"
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Ứng dụng cần truy cập vị trí để báo cáo lũ lụt",
        "NSLocationAlwaysUsageDescription": "Ứng dụng cần vị trí liên tục cho cảnh báo lũ"
      }
    },
    "android": {
      "permissions": [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ]
    }
  }
}
```

**Error Handling:**
```typescript
const handleLocationDenial = () => {
  Alert.alert('Quyền từ chối', 'Không thể truy cập vị trí. Vui lòng bật trong Cài đặt.');
  // Fallback to manual location entry or default map region
};
```

---

### 2. Camera Permissions ✅

**Purpose:** Capture photos for disaster flood reports

**Implementation:**

#### Permission Request (PhotoPicker)
```typescript
import * as ImagePicker from 'expo-image-picker';

const requestCameraPermission = async () => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần cấp quyền truy cập camera để chụp ảnh');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Camera permission error:', error);
    return false;
  }
};
```

**Configuration:**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "cameraPermission": "VietFlood cần quyền camera để chụp ảnh minh họa lũ."
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "Chụp ảnh bằng camera để báo cáo tình huống lũ lụt"
      }
    },
    "android": {
      "permissions": [
        "android.permission.CAMERA"
      ]
    }
  }
}
```

---

### 3. Photo Library Permissions ✅

**Purpose:** Select existing photos as evidence for reports

**Implementation:**

#### Permission Request (PhotoPicker)
```typescript
const requestLibraryPermission = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần cấp quyền truy cập thư viện ảnh để chọn ảnh');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Library permission error:', error);
    return false;
  }
};
```

**Configuration:**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "VietFlood cần quyền truy cập ảnh để thêm chứng minh."
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "Chọn ảnh hiện có để làm chứng minh cho báo cáo",
        "NSPhotoLibraryAddOnlyUsageDescription": "Lưu ảnh được chỉnh sửa vào thư viện"
      }
    },
    "android": {
      "permissions": [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

---

## Permission Request Flow

### First-Time Installation

```
App Launch
    ↓
Auth Check
    ↓
MainTabs Rendered
    ↓
User Navigates to:
    ├─ Home → Request Location (MapComponent)
    ├─ Reports → Request Location & Camera/Library (ReportCreationScreen)
    └─ EmergencyContacts → Request Location (SOS trigger)
```

### Permission Dialog Examples

**iOS**
```
"VietFlood" Would Like to Access Your Photos

VietFlood cần quyền truy cập ảnh để thêm chứng minh.

[Don't Allow] [Allow]
```

**Android**
```
┌─────────────────────────────────────┐
│ Allow VietFlood to access your      │
│ photos?                              │
├─────────────────────────────────────┤
│ Allow    |    Don't Allow            │
└─────────────────────────────────────┘
```

---

## Permission Status Checking

### Hook for Permission Status
```typescript
export const usePermissions = () => {
  const [locationPermission, setLocationPermission] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<string | null>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const loc = await Location.getPermissionsAsync();
    setLocationPermission(loc.status);
    
    const cam = await ImagePicker.getCameraPermissionsAsync();
    setCameraPermission(cam.status);
  };

  return { locationPermission, cameraPermission };
};
```

### Permission Status Values
- `'granted'` - Permission approved, feature available
- `'denied'` - Permission denied, show explanation or fallback
- `'undetermined'` - Not yet requested, will prompt on first use

---

## Graceful Degradation

### Location Permission Denied
```typescript
if (locationPermission !== 'granted') {
  return (
    <Card style={styles.warningCard}>
      <Text style={styles.warningTitle}>📍 Quyền vị trí được từ chối</Text>
      <Text style={styles.warningText}>
        Vui lòng bật quyền vị trí trong Cài đặt để sử dụng tính năng này.
      </Text>
      <Button
        label="Mở Cài đặt"
        onPress={() => Linking.openSettings()}
      />
    </Card>
  );
}
```

### Camera Permission Denied
```typescript
<PhotoPicker
  onPhotosSelected={handlePhotosSelected}
  disabled={cameraPermission !== 'granted'}
/>
// Show message: "Camera permission required to capture photos"
```

---

## Testing Permissions

### iOS Simulator
```bash
# Reset all permissions
xcrun simctl privacy booted reset all

# Grant specific permission
xcrun simctl privacy booted grant photo

# Deny specific permission
xcrun simctl privacy booted deny camera
```

### Android Emulator
```bash
# List permissions
adb shell pm list permissions -d

# Grant permission
adb shell pm grant com.vietflood android.permission.CAMERA

# Revoke permission
adb shell pm revoke com.vietflood android.permission.CAMERA
```

### Manual Testing on Device
1. **Settings → Privacy (iOS) / Permissions (Android)**
2. **Find VietFlood app**
3. **Toggle permissions on/off**
4. **Reopen app and verify behavior**

---

## System Integration Patterns

### Deep Linking with Permissions
```typescript
// URL: vietflood://map
// If location denied, show permission prompt before showing map
```

### Background Location Updates (Phase 2)
```typescript
// Future: Real-time flood alert notifications
const config = {
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 60000, // Every 60 seconds
  distanceInterval: 100, // Or every 100 meters
};
Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, config);
```

---

## Common Permission Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Permission always denied" | User previously denied | Show "Open Settings" button → `Linking.openSettings()` |
| Permission prompt not showing | Needs app restart | Restart app after first prompt |
| Photos access shows empty | No photos on device | Test with sample images in gallery |
| Location stuck loading | GPS disabled | Enable GPS in device settings |
| Camera black screen | Permissions revoked mid-session | Reset permissions + restart app |

---

## Permission Checklist

### Development
- [ ] Install expo-location for location services
- [ ] Install expo-image-picker for camera/photos
- [ ] Test permissions in app.json configurations
- [ ] Verify permission requests appear correctly

### Testing on Simulator
- [ ] Grant permissions → features work
- [ ] Deny permissions → graceful fallback
- [ ] Reset permissions → reprompt on next use
- [ ] Test all permission combinations

### Testing on Physical Device
- [ ] Permissions persist across app restarts
- [ ] Open Settings → Revoke permission → App handles correctly
- [ ] Test on iOS and Android
- [ ] Test on different device models

### Production
- [ ] Permission strings localized to Vietnamese
- [ ] Error messages user-friendly
- [ ] Fallback UI shown when features disabled
- [ ] Settings link works (native OS settings)

---

## Configuration Files

### Updated app.json Sections
```json
{
  "expo": {
    "name": "VietFlood",
    "plugins": [
      ["expo-location", { ... }],
      ["expo-image-picker", { ... }]
    ],
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "...",
        "NSLocationAlwaysUsageDescription": "...",
        "NSCameraUsageDescription": "...",
        "NSPhotoLibraryUsageDescription": "..."
      }
    },
    "android": {
      "permissions": [
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

---

## Completed Tasks

- ✅ 14.1 Configure location permissions
- ✅ 14.2 Implement location permission request
- ✅ 14.3 Configure camera/photo library permissions
- ⏳ 14.4 Test permissions on simulator and devices (in progress)
- ⏳ 14.5 Handle permission denial gracefully (in progress)

---

## Next Steps

1. **Permission Testing Phase**
   - Run comprehensive tests on iOS simulator
   - Run comprehensive tests on Android emulator
   - Test on physical iOS device
   - Test on physical Android device

2. **Advanced Scenarios**
   - Handle permission revocation mid-session
   - Implement permission re-request logic
   - Add "Learn more" dialogs for why permissions needed

3. **Internationalization**
   - Translate permission request messages to Vietnamese
   - Ensure culturally appropriate explanations

4. **Monitoring**
   - Log permission requests/denials
   - Analytics on feature usage with/without permissions
   - Debug permission issues in production

---

## References

- [Expo Location Documentation](https://docs.expo.dev/versions/latest/sdk/location/)
- [Expo Image Picker Documentation](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [iOS Privacy Permissions](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
- [Android Runtime Permissions](https://developer.android.com/guide/topics/permissions/overview)

