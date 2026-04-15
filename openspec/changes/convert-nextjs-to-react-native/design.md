## Context

**Current State**: VietFlood is a Next.js web application with React 19, TypeScript, and Tailwind CSS. It features:
- Multiple protected routes for authenticated users (relief operations management, home dashboard)
- Public routes for login, registration, and reports
- Leaflet-based mapping for flood/weather visualization
- Context API for state management
- Token-based authentication with automatic refresh
- REST API backend at `vietflood-app.azurewebsites.net`

**Problem**: Web-only deployment limits accessibility during flood emergencies when mobile access is critical. Relief teams and affected residents need native mobile apps for on-the-ground functionality (offline capability potential, push notifications, location services).

**Constraints**:
- Backend API must remain unchanged (shared across web/mobile clients)
- Existing authentication token logic must be preserved
- Must support iOS and Android simultaneously (React Native + Expo best approach)
- Team familiar with React; minimal Expo experience expected
- Development environment: Windows, macOS, Linux compatible solutions

**Stakeholders**: Disaster relief team (primary users), developers, backend API maintainers

## Goals / Non-Goals

**Goals:**
- Convert all web screens to React Native components running on Expo
- Maintain feature parity with Next.js web app (auth, reports, relief dashboard, mapping)
- Enable native iOS/Android deployment via Expo/EAS
- Keep authentication and API integration logic intact
- Support real-time map data (weather overlays, relief routes)
- Enable rapid iteration with Expo Go during development

**Non-Goals:**
- Offline-first syncing (implement in phase 2)
- Push notifications (implement in phase 2)
- Advanced geolocation tracking (phase 2)
- Native modules or custom Swift/Kotlin code (stay within Expo ecosystem)
- Feature additions beyond web parity
- Replacement/rewrite of backend API

## Decisions

### 1. **Navigation Framework: React Navigation over Expo Router**
**Decision**: Use `@react-navigation/*` (stack, bottom-tabs, drawer navigators) instead of Expo Router alone.

**Rationale**:
- React Navigation provides proven, native navigation patterns (iOS swipe-back, Android back button handling)
- Greater flexibility for complex route hierarchies (protected routes, nested navigators)
- Better support for tab-based UIs needed for relief dashboard and home screens
- Cleaner migration from Next.js file-based routing to screen-based navigation

**Alternative Considered**: Expo Router (newer, file-based) — *rejected* because: immature for complex protected route patterns, tab navigation less intuitive, team more experienced with React Navigation patterns.

### 2. **Styling: NativeWind over HandCrafted StyleSheet**
**Decision**: Use `nativewind` (Tailwind-like utilities for React Native) to minimize styling refactoring.

**Rationale**:
- Developers already fluent in Tailwind CSS utilities (`flex`, `gap-4`, `rounded-lg`)
- Reduces cognitive overhead vs. learning inline `StyleSheet.create()` patterns
- Faster migration with minimal rewriting of component styles
- Automated class-to-style compilation

**Alternative Considered**: Pure `StyleSheet.create({})` — *rejected* because: higher migration effort, larger style object boilerplate, less familiar syntax to team.

### 3. **Mapping: react-native-maps over MapBox GL**
**Decision**: Use `react-native-maps` with Google Maps (Android) and Apple Maps (iOS).

**Rationale**:
- Simpler Expo integration (available via `expo-maps` or `react-native-maps`)
- Sufficient for flood visualization and relief route display (overlays, markers, polylines)
- Lower cost than MapBox GL for tier of functionality needed
- Good community support and documentation

**Alternative Considered**: MapBox GL — *rejected* because: higher licensing costs, excessive features for current scope, Expo integration more complex.

### 4. **Storage: AsyncStorage + expo-secure-store for Auth Tokens**
**Decision**: Use `expo-secure-store` for sensitive tokens (access/refresh), `AsyncStorage` for non-sensitive user preferences.

**Rationale**:
- `expo-secure-store` wraps platform-native security (iOS Keychain, Android Keystore)
- Prevents token exposure vs. plain AsyncStorage
- API client already has token refresh logic; only storage layer changes
- Expo-managed solution avoids custom native module dependencies

**Alternative Considered**: 
- Plain AsyncStorage for all — *rejected* because: security risk for auth tokens.
- Redux Persist — *rejected* because: overkill for current state size, adds complexity.

### 5. **State Management: Keep Context API + useReducer**
**Decision**: Retain existing Context API and useReducer patterns; no migration to Redux/Zustand.

**Rationale**:
- Context API works identically in React Native
- Existing `HomeDisplayProvider` (map overlay state) requires zero changes
- Team familiar with current patterns
- State complexity does not justify Redux migration

**Alternative Considered**: Migrate to Zustand — *rejected* because: premature optimization, no performance issues observed, adds migration work.

### 6. **Build & Distribution: Expo + EAS Build**
**Decision**: Use Expo CLI for local development, EAS (Expo Application Services) for production builds.

**Rationale**:
- EAS handles iOS/Android compilation without local Xcode/Android Studio setup
- Fast iteration: `expo start` for Expo Go testing during development
- Simplified CI/CD integration for automated builds and releases
- No need to manage build certificates for team

**Alternative Considered**: Bare React Native + Xcode/Android Studio — *rejected* because: steeper learning curve, complex build setup, slower iteration.

### 7. **Navigation Routing Architecture**
**Decision**: Implement a role-based protected route pattern mirroring Next.js structure:
- **Public Stack**: Login & Registration screens
- **Auth Stack**: Protected screens (Home, Relief Dashboard, Reports) requiring valid tokens
- **Fallback**: Redirect unauthenticated users to login

**Rationale**:
- Mirrors existing Next.js `(auth)`, `(protected)`, `(public)` folder organization
- Clear separation of authenticated vs. public content
- On-demand route switching based on token validity

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **Loss of Web Accessibility** — Mobile app does not serve web users | Maintain Next.js codebase in parallel repository; coordinate backend API. Plan dual-platform support long-term. |
| **Mapping Performance on Low-End Devices** — Leaflet features may stutter on Android 6-7 | react-native-maps is more lightweight; test on real devices early. Implement marker clustering for large datasets. |
| **Touchscreen UX Issues** — Components sized for mouse/keyboard may feel cramped on mobile | Design mobile-first from the start; use spacing (gap, padding) suitable for touch targets (min 44x44 pt). Conduct usability testing. |
| **Token Refresh Edge Cases** — Network failures during token refresh could cause hard logouts | Implement retry logic in API client; cache refresh token requests to avoid duplicate calls. Add offline queue if needed (phase 2). |
| **EAS Build Quotas** — Free tier has usage limits for iOS/Android builds | Monitor build consumption; upgrade to paid plan if needed. Consider caching builds or on-demand releases. |
| **Team Onboarding** — Developers unfamiliar with Expo/React Native ecosystem | Invest in documentation, pair programming, and Expo training early. Use opinionated project structure. |

## Migration Plan

### Phase 1: Foundation (Weeks 1-2)
1. Set up Expo project scaffold with TypeScript and EAS config
2. Implement React Navigation routing structure (public/protected stacks)
3. Migrate auth module: update storage layer to use `expo-secure-store`
4. Verify API client authentication still works with backend

### Phase 2: Core UI (Weeks 3-4)
1. Migrate auth screens (login, registration) to React Native
2. Migrate home dashboard (basic layout, stats display)
3. Set up NativeWind styling system; convert sample components
4. Test on Expo Go for iOS + Android

### Phase 3: Feature Screens (Weeks 5-6)
1. Migrate relief operations management dashboard
2. Migrate reports creation and history views
3. Implement mobile-specific forms (better touch targets, mobile keyboards)

### Phase 4: Mapping & Advanced Features (Weeks 7-8)
1. Migrate map component to react-native-maps
2. Integrate weather overlays (wind, rain, temperature)
3. Test offline map caching (if applicable)

### Phase 5: Polish & Testing (Weeks 9-10)
1. Performance optimization on low-end devices
2. Cross-platform testing (iOS Simulator, Android Emulator, real devices)
3. Usability testing with relief team
4. App store submission preparation (TestFlight, Google Play)

### Rollback Strategy
- Maintain Next.js codebase in production; mobile app released in parallel
- If critical issues discovered, roll back to Next.js-only deployment
- Backend API remains unchanged; easy coordination with both frontends

## Open Questions

1. **Offline Support**: Should the mobile app cache reports/routes for offline viewing? (Deferred to phase 2)
2. **Push Notifications**: Required for real-time alerts about new flood reports? (Deferred to phase 2)
3. **Location Services**: Should app request location permissions for automatic geotagging of reports? (Deferred to phase 2)
4. **App Store Deployment**: Will organization handle Apple Developer account + Google Play Store setup, or delegate to team?
5. **Monitoring & Crash Reporting**: Should we integrate Sentry or Bugsnag for production error tracking?
