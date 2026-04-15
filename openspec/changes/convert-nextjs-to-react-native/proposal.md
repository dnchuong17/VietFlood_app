## Why

VietFlood is currently a Next.js web application. Converting to React Native with Expo enables cross-platform mobile deployment (iOS/Android), significantly expanding user reach for disaster relief operations where mobile access is critical. Mobile-first functionality improves on-the-ground accessibility for relief teams and residents during flood emergencies when desktop access may be unavailable.

## What Changes

- **Navigation**: Replace Next.js file-based routing (`page.tsx`, `layout.tsx`) with React Navigation and Expo Router
- **Styling**: Remove all Tailwind CSS (`className="..."`) and replace with React Native StyleSheet or NativeWind
- **Components**: Convert all HTML primitives (`<div>`, `<span>`, `<button>`, `<input>`) to React Native primitives (`<View>`, `<Text>`, `<TouchableOpacity>`, `<TextInput>`)
- **Mapping**: Replace Leaflet + react-leaflet with react-native-maps for mobile map rendering
- **Data Fetching**: Migrate from Next.js server components to client-side React hooks with async/await
- **Asset Management**: Replace `next/image` with `expo-image`, replace `next/font` with `expo-font`
- **Environment**: Replace `process.env.NEXT_PUBLIC_*` with `process.env.EXPO_PUBLIC_*`
- **State Management**: Keep Context API + useReducer (compatible with React Native)
- **Authentication**: Keep token-based API authentication logic; migrate storage from localStorage to AsyncStorage
- **PWA Features**: **BREAKING** - Remove next-pwa Progressive Web App support (not applicable to native apps)
- **API Routes**: **BREAKING** - Remove `/api/` routes; backend separation remains (`vietflood-app.azurewebsites.net`)

## Capabilities

### New Capabilities

- `mobile-navigation`: React Navigation stack-based navigation for iOS and Android with native navigation patterns
- `react-native-styling`: Portable StyleSheet-based component styling system (replacing Tailwind CSS)
- `mobile-mapping`: Interactive map component using react-native-maps with location services and overlays
- `mobile-auth-flow`: Complete authentication flow optimized for mobile (login, registration, token refresh, profile management)
- `mobile-reports`: Report creation and history viewing adapted for mobile forms and touch interactions
- `mobile-relief-dashboard`: Relief operations management dashboard responsive to mobile screens
- `mobile-home-dashboard`: Home screen with weather stats and flood alerts using mobile-native design patterns
- `expo-asset-loading`: Font and image loading via Expo APIs (`expo-font`, `expo-image`)
- `async-storage`: Secure token and preference storage using `@react-native-async-storage/async-storage` and `expo-secure-store`
- `mobile-permissions`: Location and camera permission handling for features requiring device access

### Modified Capabilities

- `api-client`: Existing API client logic remains; storage migration from localStorage to AsyncStorage
- `auth-state-sync`: External store sync mechanism remains; platform-specific storage layer changes

## Impact

**Frontend Code**:
- `src/app/` - Complete restructure of routing and layouts for React Navigation
- `src/components/` - Convert all HTML elements to React Native primitives
- `src/features/` - Update all feature components and pages for mobile paradigm
- `src/lib/` - Adapt utilities for React Native environment

**Dependencies**:
- Remove: `next`, `next-pwa`, `react-dom`, `next/image`, `next/navigation`, `leaflet`, `react-leaflet`
- Add: `expo`, `react-native`, `@react-navigation/*`, `react-native-maps`, `expo-router`, `@react-native-async-storage/async-storage`, `expo-font`, `expo-image`, `expo-secure-store`, `nativewind` or manual StyleSheet

**Backend**:
- No changes to backend API (`vietflood-app.azurewebsites.net`)
- Existing auth endpoints and relief/report APIs remain compatible

**Build & Deployment**:
- Remove: Next.js build pipeline, Webpack config optimizations
- Add: Expo build pipeline, EAS (Expo Application Services) for iOS/Android builds
- New: App.json configuration for Expo metadata (app name, version, icons, permissions)

**Development Workflow**:
- Local development: `expo start` instead of `next dev`
- Testing: iOS Simulator/Android Emulator or Expo Go for rapid iteration
- Deployment: EAS CLI for building and distributing iOS/Android app binaries
