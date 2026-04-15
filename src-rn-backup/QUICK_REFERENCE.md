# VietFlood React Native - Quick Reference

## 🚀 Quick Start

### Installation
```bash
cd src-rn
npm install
npx expo start
```

### Run on Simulator/Emulator
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

---

## 📁 Project Structure

```
src-rn/
├── app.tsx                          # Root container with providers
├── features/
│   ├── auth/                        # Authentication screens & hooks
│   ├── home/                        # Dashboard & stats
│   ├── reports/                     # Report creation, list, detail
│   ├── relief/                      # Relief operations
│   ├── profile/                     # User profile, settings, notifications
│   ├── volunteer/                   # Volunteer dashboard
│   ├── analytics/                   # Analytics & statistics
│   ├── emergency/                   # Emergency contacts
│   └── map/                         # Map component
├── components/                      # Reusable UI components
│   ├── Button.tsx                   # Variant buttons
│   ├── Card.tsx                     # Card container
│   ├── TextInput.tsx                # Form input
│   ├── PhotoPicker.tsx              # 📸 NEW: Photo capture
│   ├── ConfirmDialog.tsx            # Modal dialog
│   ├── FilterModal.tsx              # Filter UI
│   └── ...
├── lib/
│   ├── theme/                       # Dark mode context
│   ├── navigation/                  # React Navigation setup
│   ├── api-client.ts                # HTTP client with token injection
│   ├── services.ts                  # API service methods
│   ├── rbac.ts                      # Role-based access control
│   └── styling.ts                   # Design tokens
├── types/                           # TypeScript interfaces
├── REACT_NATIVE_SETUP.md            # Setup documentation
├── SESSION_3_SUMMARY.md             # This session summary
└── ...
```

---

## 🔐 Authentication

### Login
```typescript
import { useAuth } from '../features/auth';

function LoginScreen() {
  const { login } = useAuth();
  
  const handleLogin = async () => {
    await login(email, password);
    // Token automatically stored & injected in API calls
  };
}
```

### Protected Screens
```typescript
import { useRoleBasedAccess } from '../lib/rbac';

function ReliefDashboard() {
  const { canAccess } = useRoleBasedAccess();
  
  if (!canAccess(['relief_worker', 'admin'])) {
    return <Text>Access Denied</Text>;
  }
  
  return <DashboardContent />;
}
```

---

## 🎨 Styling & Theme

### Using Design Tokens
```typescript
import { colors, spacing, borderRadius } from '../lib/styling';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: spacing.md,        // 16px
  },
  button: {
    borderRadius: borderRadius.lg,  // 12px
  },
});
```

### Dark Mode
```typescript
import { useTheme } from '../lib/theme/ThemeContext';

function MyComponent() {
  const { isDark, themeMode, setThemeMode } = useTheme();
  
  // Component automatically uses theme colors
  return (
    <View style={{ 
      backgroundColor: isDark ? colors.gray900 : colors.white 
    }} />
  );
}
```

---

## 📸 Photo Capture (NEW)

### Using PhotoPicker
```typescript
import { PhotoPicker, PhotoGallery, PickedImage } from '../components';

function ReportForm() {
  const [photos, setPhotos] = useState<PickedImage[]>([]);
  
  const handlePhotosSelected = (newPhotos: PickedImage[]) => {
    setPhotos([...photos, ...newPhotos]);
  };
  
  return (
    <>
      <PhotoPicker
        onPhotosSelected={handlePhotosSelected}
        maxPhotos={5 - photos.length}
        disabled={photos.length >= 5}
      />
      <PhotoGallery
        photos={photos}
        onRemove={(index) => setPhotos(photos.filter((_, i) => i !== index))}
      />
    </>
  );
}
```

---

## 📍 Location & Permissions

### Request Location Permission
```typescript
import * as Location from 'expo-location';

const requestLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === 'granted') {
    const location = await Location.getCurrentPositionAsync();
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  }
};
```

### Request Camera Permission
```typescript
import * as ImagePicker from 'expo-image-picker';

const requestCamera = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status === 'granted') {
    // Launch camera
    const result = await ImagePicker.launchCameraAsync();
  }
};
```

---

## 🛣️ Navigation

### Navigate to Screen
```typescript
function ReportListScreen({ navigation }) {
  return (
    <Button
      onPress={() => navigation.navigate('ReportCreation')}
      label="Create Report"
    />
  );
}
```

### Screen Stack
```
RootNavigator
├── PublicStack (no token)
│   ├── Login
│   └── Register
└── ProtectedStack (with token)
    ├── MainTabs
    │   ├── Home
    │   ├── Reports
    │   ├── Relief (role-gated)
    │   └── Profile
    └── Other Screens (stacked over tabs)
        ├── ReportCreation
        ├── ReportDetail
        ├── OperationDetail
        ├── Settings
        ├── Notifications
        ├── Analytics
        ├── EmergencyContacts
        └── VolunteerDashboard
```

---

## 🧩 Component Library

### Button
```typescript
<Button
  label="Submit"
  variant="primary"        // primary | secondary | danger
  onPress={() => {}}
  loading={false}
  disabled={false}
/>
```

### Card
```typescript
<Card style={styles.card}>
  <Text>Content</Text>
</Card>
```

### TextInput
```typescript
<TextInput
  label="Email"
  placeholder="Enter email"
  value={email}
  onChangeText={setEmail}
  multiline={false}
  numberOfLines={1}
/>
```

### Modal Dialog
```typescript
<ConfirmDialog
  title="Confirm Action"
  message="Are you sure?"
  onConfirm={() => {}}
  onCancel={() => {}}
  confirmText="Yes"
  cancelText="No"
  isDestructive={false}
/>
```

---

## 📡 API Calls

### Using API Client
```typescript
import { apiClient } from '../lib/api-client';

// GET
const reports = await apiClient.get('/reports');

// POST
const newReport = await apiClient.post('/reports', data);

// PATCH
const updated = await apiClient.patch(`/reports/${id}`, updates);

// DELETE
await apiClient.delete(`/reports/${id}`);

// Token automatically injected & refreshed on 401
```

### Using Services
```typescript
import { reportService } from '../lib/services';

const reports = await reportService.getReports();
const report = await reportService.createReport(data);
const updated = await reportService.updateReport(id, data);
```

---

## 🧪 Common Patterns

### Form Validation
```typescript
const isEmailValid = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isPasswordStrong = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[0-9]/.test(password);
};
```

### Error Handling
```typescript
try {
  await apiClient.post('/endpoint', data);
} catch (error: any) {
  if (error.status === 401) {
    // Unauthorized - token expired
  } else if (error.status === 400) {
    // Validation error
    Alert.alert('Error', error.message);
  } else {
    // Network or server error
    Alert.alert('Error', 'Something went wrong');
  }
}
```

### Loading States
```typescript
const [loading, setLoading] = useState(false);

const handle = async () => {
  setLoading(true);
  try {
    // Do async work
  } finally {
    setLoading(false);
  }
};

// Show during loading
{loading && <Loading />}
```

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Token not persisting | ExpoSecureStore not async | Await token operations |
| Photos not showing | Permission denied | Check iOS Info.plist, Android manifest |
| Location stuck | GPS disabled | Enable in device settings |
| Build fails | Pod dependencies | `cd ios && pod install` |
| Black screen | Navigation error | Check consoles for error logs |

---

## 🧬 Type Definitions Reference

### Auth
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
```

### Reports
```typescript
interface Report {
  id: string;
  type: 'flood_damage' | 'evacuation' | 'resource_request';
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  location: Location;
  photos: Photo[];
}

interface CreateReportRequest {
  title: string;
  description: string;
  type: ReportType;
  severity: string;
  location: Location;
  photos: Array<{ uri: string; name: string; type: string }>;
}
```

### Operations
```typescript
interface ReliefOperation {
  id: string;
  name: string;
  status: 'planned' | 'active' | 'completed';
  location: Location;
  volunteers: number;
  resources: Resource[];
}
```

---

## 🔍 Debugging Tips

### Enable Debug Logging
```typescript
// Add to api-client.ts
const API_DEBUG = true;

if (API_DEBUG) {
  console.log('[API]', method, url, data);
}
```

### React DevTools
```bash
pip install react-devtools
react-devtools
```

### Expo Go App
```bash
# QR code scanner in Expo Go for local dev
npx expo start --localhost
```

### Network Inspector
```
VS Code "Debugger for Chrome" extension
→ Connect to Metro debugger
→ Use Redux DevTools protocol
```

---

## 📚 Documentation

- **Setup Guide**: [REACT_NATIVE_SETUP.md](REACT_NATIVE_SETUP.md)
- **Extended Features**: [EXTENDED_FEATURES_SUMMARY.md](EXTENDED_FEATURES_SUMMARY.md)
- **Photo Capture**: [PHOTO_CAPTURE_IMPLEMENTATION.md](PHOTO_CAPTURE_IMPLEMENTATION.md)
- **Permissions**: [PERMISSIONS_IMPLEMENTATION.md](PERMISSIONS_IMPLEMENTATION.md)
- **Session Summary**: [SESSION_3_SUMMARY.md](SESSION_3_SUMMARY.md)
- **Status Dashboard**: [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)

---

## 🎯 Development Workflow

```bash
# 1. Start development server
npx expo start

# 2. Choose platform
# Press 'i' for iOS or 'a' for Android

# 3. Make code changes
# (Auto-reload on save)

# 4. Debug
# Press 'd' for debugger menu

# 5. Run tests
npm run lint           # TypeScript check
npm run type-check     # Full type checking
```

---

## 📞 Support Resources

- **Expo Documentation**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **React Navigation**: https://reactnavigation.org
- **TypeScript Handbook**: https://www.typescriptlang.org

---

*Quick Reference v1.0 - April 15, 2026*
