# VietFlood React Native - Expo Conversion

This directory contains the React Native implementation of the VietFlood application using Expo, enabling cross-platform deployment to iOS and Android.

## 📁 Project Structure

```
src-rn/
├── app.tsx                          # Main app entry point
├── app/(auth)/                      # Auth flows (login, register)
├── app/(protected)/                 # Protected screens (requires authentication)
│   ├── (relief)/                    # Relief management features
│   └── (user)/                      # User-facing features
├── app/(public)/                    # Public screens
├── components/                      # Reusable UI components
│   ├── Button.tsx                   # Button component (primary, secondary, danger)
│   ├── Card.tsx                     # Card container with shadow
│   ├── TextInput.tsx                # Styled text input with validation
│   ├── SafeAreaWrapper.tsx          # Safe area wrapper for notches/status bars
│   ├── Loading.tsx                  # Loading spinner
│   ├── ErrorBoundary.tsx            # Error boundary for error handling
│   └── index.ts                     # Component exports
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   └── hooks/
│   │       └── useAuth.tsx          # Auth context & provider
│   ├── home/
│   │   └── HomeScreen.tsx           # Home dashboard
│   ├── reports/
│   │   └── ReportsScreen.tsx        # Reports listing & management
│   ├── relief/
│   │   └── ReliefDashboardScreen.tsx # Relief operations management
│   └── profile/
│       └── ProfileScreen.tsx        # User profile
├── lib/
│   ├── api-client.ts                # HTTP client with auth token injection
│   ├── rbac.ts                      # Role-based access control
│   ├── services.ts                  # API service layer
│   ├── styling.ts                   # Design tokens & utilities
│   └── navigation/
│       ├── RootNavigator.tsx        # Root navigation setup
│       └── linking.ts               # Deep linking config
└── types/
    ├── auth.ts                      # Auth types
    └── reports.ts                   # Reports & operations types
```

## ✅ Implementation Status

### ✓ Completed
- **Project Setup & Dependencies** (1.1-1.7)
  - Expo project initialized
  - Core packages installed
  - app.json & eas.json configured
  - Environment variables set up
  - Folder structure created

- **Authentication System** (2.1-2.6)
  - useAuth context hook with login/logout/refresh
  - Token storage via expo-secure-store
  - API client wrapper with automatic token injection
  - Role-based access control (RBAC)

- **Navigation Architecture** (3.1-3.7)
  - React Navigation stack & tab setup
  - Public vs Protected navigation flows
  - Deep linking configuration
  - Role-based route guards

- **Authentication UI Screens** (4.1-4.6)
  - Login screen with form validation
  - Registration screen with password strength validation
  - Error handling and loading states

- **Core Component Library** (11.1-11.6)
  - Reusable Button component (variants: primary, secondary, danger)
  - Card component with shadow styling
  - TextInput wrapper with validation
  - SafeArea wrapper for notches
  - Loading spinner
  - ErrorBoundary for error handling

- **Feature Screens**
  - Home Dashboard (stats, quick actions, weather alerts)
  - Reports Manager (list, filter, create)
  - Relief Dashboard (operations management)
  - Profile Screen (user info, settings, logout)

- **API Client & Services**
  - HTTP client with timeout handling
  - Automatic auth token injection
  - Report service (CRUD operations)
  - Relief operation service (CRUD operations)

- **Design System**
  - Color tokens
  - Spacing scale
  - Typography scale
  - Shadow utilities
  - Responsive utilities

### 🚧 In Progress / To Do

- **Sections 5: Styling System** - NativeWind setup, dark mode theme
- **Sections 6-7: Home Dashboard & Maps** - Map component integration, Windy API integration
- **Sections 8-10: Features** - Complete report creation, relief operations CRUD
- **Sections 12-14: Modals, Permissions** - Modal components, location/camera permissions
- **Sections 15: Build & Distribution** - App icons, signing, TestFlight/Play Store
- **Sections 16-20: Documentation, Performance, Testing** - Complete test suite, optimization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator or Xcode
- Android Emulator or Android Studio

### Installation

```bash
# Install dependencies
npm install

# Install Expo CLI globally
npm install -g expo-cli

# For React Native setup
npx expo doctor
```

### Development Server

```bash
# Start Expo development server
npx expo start

# Run on iOS Simulator
npx expo run:ios

# Run on Android Emulator
npx expo run:android

# Run with Expo Go app (fastest for testing)
npx expo start --scheme vietflood
```

## 🔐 Authentication Flow

1. User opens app
2. `useAuth()` hook checks secure storage for tokens
3. If tokens exist and valid, restore session automatically
4. If no tokens, show Login/Register screens
5. On login, store accessToken & refreshToken securely
6. API calls automatically inject Bearer token
7. On token expiry (401), auto-refresh using refreshToken
8. On refresh failure, logout and return to login
9. Deep links restore navigation from stored state

## 📦 Key Dependencies

- **react-native** - Core framework
- **expo** - Development & build tooling
- **@react-navigation/native** - Routing & navigation
- **@react-native-async-storage/async-storage** - Persistent preferences storage
- **expo-secure-store** - Secure token storage
- **expo-font** - Custom font loading
- **expo-image** - Image component
- **react-native-maps** - Map rendering
- **nativewind** - Tailwind CSS for React Native (optional)

## 🎨 Styling Approach

Using React Native `StyleSheet` API with design tokens for consistency:

```typescript
// Design tokens
colors.primary = '#3b82f6'
spacing.md = 16
borderRadius.md = 8

// Usage
const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  }
})
```

## 🔗 API Integration

All API calls go through the `apiClient` wrapper which:

1. Automatically adds `Authorization: Bearer {token}` header
2. Handles request timeouts (default 30s)
3. Catches errors and returns consistent response format
4. Auto-refreshes expired tokens

Example:
```typescript
const response = await apiClient.post('/reports', reportData)
if (response.success) {
  // Use response.data
} else {
  // Handle response.error
}
```

## 🧪 Testing

Unit tests for:
- Auth context & token refresh logic
- RBAC permission checking
- Form validation
- API error handling

E2E tests for:
- Complete authentication flow
- Report creation flow
- Relief operations workflow
- Navigation between screens

## 📱 Platform-Specific Setup

### iOS
- Add location/camera permissions to `Info.plist` (handled in app.json)
- Create provisioning profile for TestFlight
- Configure app signing certificates

### Android
- Add permissions to `AndroidManifest.xml` (handled in app.json)
- Create keystore for release signing
- Configure Google Play Store credentials

## 🐛 Debugging

```bash
# View console logs
npx expo start --localhost

# Connect debugger
npx expo start --dev-client

# Clear Metro cache
npx expo start -c

# Reset node_modules
rm -rf node_modules && npm install
```

## 📚 Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [React Navigation Docs](https://reactnavigation.org)
- [Design System](./src-rn/lib/styling.ts)

## 🔄 Next Steps

1. Install missing Expo packages: `npx expo prebuild`
2. Complete map component integration with react-native-maps
3. Add photo capture with Expo Camera
4. Implement location services with expo-location
5. Set up CI/CD with EAS Build
6. Add end-to-end tests
7. Prepare for TestFlight/Play Store submission

## 📝 Notes

- All timestamps use ISO 8601 format
- Location uses GPS coordinates (latitude/longitude)
- Role-based features are feature-flagged in navigation
- OAuth integration can be added later with expo-auth-session
- Push notifications setup available with expo-notifications

---

**Last Updated**: April 15, 2026  
**Status**: Foundation Complete - Ready for Feature Implementation
