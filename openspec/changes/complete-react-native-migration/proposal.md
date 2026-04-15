## Why

The React Native Expo Go implementation in `/src-rn` now contains all functional features previously available in the NextJS frontend (`/src`). Consolidating the project on React Native enables better mobile-first UX, native platform capabilities, and streamlined development workflow. This migration reduces codebase duplication, simplifies CI/CD pipelines, and aligns deployment strategy with modern mobile-first requirements.

## What Changes

- Remove the NextJS frontend from `/src` (no longer maintained)
- Migrate React Native source from `/src-rn` to `/src` (establish single source of truth)
- Remove NextJS-specific configuration files (`next.config.ts`, `next-env.d.ts`, `next-pwa.d.ts`)
- Consolidate build and deployment configs (EAS Build, package.json scripts)
- Update project structure to reflect React Native as primary platform
- Remove web-focused dependencies and documentation
- **BREAKING**: Web version will no longer be available; mobile app becomes primary distribution

## Capabilities

### New Capabilities
- `mobile-native-integration`: Full access to native device APIs (camera, location, permissions, storage)
- `responsive-mobile-ui`: Mobile-optimized responsive layout system with 4 breakpoints
- `native-dark-mode`: System-level dark mode with device preference sync
- `offline-first-sync`: Local-first data handling with sync queue persistence

### Modified Capabilities
- `map-visualization`: Mobile-optimized clustering and caching (replaces web version)
- `photo-capture`: Native camera integration with image compression and EXIF handling
- `user-authentication`: Device-based auth persistence and credential storage
- `notification-system`: Push notifications and in-app messaging for mobile
- `data-management`: Restructured for mobile-first local storage patterns
- `performance-monitoring`: Mobile-specific metrics and crash reporting

## Impact

**Code Changes:**
- React Native components replace React/Next.js components
- TypeScript codebase remains, enhanced with React Native types
- Remove web dependencies (e.g., Next.js specific packages)

**Build & Distribution:**
- EAS Build becomes primary build system
- Remove Vercel/web hosting configuration
- Consolidate to single package.json structure
- Remove web-specific documentation

**Development Workflow:**
- Expo CLI replaces Next.js dev server
- Android Emulator/iOS Simulator testing becomes standard
- Remove web preview/deployment pipelines
