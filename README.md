# VietFlood Mobile App

A React Native mobile application for real-time flood disaster monitoring and relief coordination in Vietnam.

## Platform

**Mobile-First**: iOS and Android via React Native and Expo

- **Framework**: React Native 0.84
- **Expo**: 55.x
- **Navigation**: React Navigation 7.x
- **Styling**: NativeWind 4 + Tailwind CSS
- **Build**: EAS Build (Expo Application Services)
- **State Management**: React Context API + Custom Hooks

## Features

### Core Capabilities
- **User Authentication**: Secure login with device-based session persistence
- **Map Visualization**: Real-time flood monitoring with interactive map, clustering, and caching  
- **Photo Capture**: Native camera integration with EXIF geolocation tagging
- **Disaster Reports**: Create, submit, and manage flood event reports
- **Offline-First Sync**: Local data persistence with automatic synchronization
- **Push Notifications**: Real-time alerts for flood events and system updates
- **Dark Mode**: System-level dark mode detection and persistence
- **Responsive Design**: Mobile-optimized layouts for phones (375px+) and tablets

### Platform Features
- Native device APIs: Camera, location, permissions, secure storage
- Performance monitoring: Crash reporting and analytics
- Device-specific optimizations: Battery efficiency, network optimization

## Project Structure

```
VietFlood_app/
├── src/                          # React Native source code
│   ├── app.tsx                  # App entry point and router setup
│   ├── app/                     # Expo Router screens
│   ├── components/              # Reusable React Native components
│   ├── features/                # Feature modules (auth, reports, map, etc.)
│   ├── lib/                     # Shared utilities and services
│   │   ├── styling.ts           # App colors, spacing, fonts
│   │   ├── api/                 # API client configuration
│   │   ├── hooks/               # Custom React hooks
│   │   ├── theme/               # Theme/dark mode context
│   │   └── i18n/                # Internationalization
│   └── types/                   # TypeScript type definitions
├── app.json                     # Expo app configuration
├── eas.json                     # EAS Build configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── package.json                 # Dependencies and npm scripts
└── README.md                    # This file
```

## Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Android emulator/device OR iOS simulator/device

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# For Android
npm run android

# For iOS (macOS only)
npm run ios
```

### Development Scripts

```bash
npm run dev              # Start Expo development server
npm run android          # Build for Android (EAS Build)
npm run ios              # Build for iOS (EAS Build)
npm run lint             # Run ESLint checks
```

## Architecture

### Responsive Layout System
The app uses 4 responsive breakpoints:
- **xs**: 375px (small phones)
- **sm**: 414px (regular phones)
- **md**: 768px (tablets portrait)
- **lg**: 1024px (tablets landscape)

### Dark Mode Implementation
- Automatic detection of system dark mode preference
- User override option in settings
- Context-based theme switching with AsyncStorage persistence
- All screens support both light and dark themes

### Offline-First Architecture
- Local data caching using AsyncStorage and SQLite
- Operation queue for offline actions (reports, submissions)
- 5-minute TTL for map tile caching
- Automatic sync when network returns
- Conflict resolution for concurrent changes

### Map Visualization
- Grid-based clustering with O(n) performance
- 5-minute tile cache TTL
- Touch-optimized interactions (pinch zoom, double-tap)
- Safe area and notch handling
- Device location integration

## Building & Distribution

### Development Build
```bash
npm run dev
```
Starts Expo development server with hot reload.

### Production Build via EAS

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

View build status: https://expo.dev/accounts/your-account/projects/vietflood/builds

### Configuration Files
- **eas.json**: EAS Build and submit configuration for Android/iOS
- **app.json**: Expo app metadata, routing, and permissions
- **tsconfig.json**: TypeScript compiler options (React Native target)

## TypeScript

The project is fully typed with TypeScript:
- **Target**: TypeScript 5+
- **Strict Mode**: Enabled (no implicit `any`)
- **React Native Types**: @types/react-native included

Type check without building:
```bash
npx tsc --noEmit
```

## State Management

### React Context + Custom Hooks Pattern
- `ThemeContext`: Dark mode state and persistence
- `useResponsiveLayout()`: 4 responsive layout hooks
- Feature-specific context providers for auth, data sync, etc.

### Data Persistence
- User preferences: AsyncStorage
- Authentication tokens: Secure storage (Keychain/Keystore)
- Reports and sync queue: Local database

## Testing

The app includes testing infrastructure for:
- **Device Testing**: Real device and emulator compatibility
- **Responsive Design**: 4 breakpoint testing guide available
- **Performance**: Metrics collection and monitoring

See `src/DEVICE_TESTING_GUIDE.md` for comprehensive testing procedures.

## Documentation

Comprehensive guides available in `/src`:
- `PROJECT_STATUS.md` - Current project status and completion tracking
- `DEVICE_TESTING_GUIDE.md` - Cross-device testing procedures
- `STYLING_SYSTEM_GUIDE.md` - Design system and component library
- `SESSION_5_FINAL_COMPLETE_SUMMARY.md` - Latest implementation summary

## Migration from NextJS

The project was previously implemented with both NextJS (web) and React Native. As of this version:
- ✅ React Native is the primary platform
- ✅ All features migrated from web version
- ✅ NextJS web version archived (available in `src-nextjs/` if needed)
- ✅ Project structure consolidated on mobile-first design

For details on the migration, see `openspec/changes/complete-react-native-migration/`.

## Performance Optimization

### Key Optimizations
- Grid-based clustering for maps: O(n) instead of O(n²)
- 5-minute cache TTL for map tiles
- Incremental data sync (only changes transferred)
- Image compression for photo capture
- Memory-efficient animation framework (Reanimated)

### Monitoring
- Real-time crash reporting
- Performance metrics collection
- Battery and network usage tracking
- Device-specific performance baselines

## Security

### Authentication
- JWT token-based authentication
- Device secure storage (Keychain/Keystore)
- Automatic session timeout on background
- Device fingerprinting support

### Data Privacy
- Local-first data model
- Encrypted storage for sensitive data
- HTTPS for all API communication
- Permission-based access control

## Support

For issues or questions:
1. Check `src/PROJECT_STATUS.md` for known issues
2. Review device testing guide for compatibility
3. Check implementation status documentation
4. Report issues through project issue tracker

## License

Proprietary - VietFlood Project

---

**Last Updated**: April 2026  
**Status**: React Native mobile-first consolidation complete
