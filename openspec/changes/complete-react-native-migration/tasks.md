## 1. Pre-Migration Audit & Validation

- [ ] 1.1 Create feature comparison spreadsheet (NextJS vs React Native)
- [ ] 1.2 Test all core features in React Native (auth, map, reports, photos)
- [ ] 1.3 Verify permission handling on Android and iOS devices
- [ ] 1.4 Validate offline-first functionality with network toggle
- [ ] 1.5 Test dark mode on both light and dark system settings
- [ ] 1.6 Verify responsive layout on 4 breakpoints (xs/sm/md/lg)
- [x] 1.7 Check TypeScript compilation (must be 0 errors)
- [ ] 1.8 Document any feature gaps discovered
- [ ] 1.9 Create git pre-migration backup commit
- [ ] 1.10 Get stakeholder sign-off on migration plan

## 2. File System Migration

- [x] 2.1 Create `s:\Documents\GitHub\VietFlood_app\src-rn-backup` directory
- [x] 2.2 Copy `/src-rn` contents to backup directory
- [x] 2.3 Verify backup contains all files (dev, lib, components, features, types)
- [x] 2.4 Copy all files from `/src-rn` to `/src` destination
- [x] 2.5 Verify `/src` now contains React Native structure
- [x] 2.6 Update `/src/app.tsx` to `/src/app.tsx` (verify exists)
- [x] 2.7 Remove `/src-rn` directory
- [x] 2.8 Verify no broken imports or relative path issues
- [x] 2.9 Commit changes: "feat: migrate src-rn to src (file structure)"

## 3. Configuration File Cleanup

- [x] 3.1 Delete `next.config.ts` from root
- [x] 3.2 Delete `next-env.d.ts` from root
- [x] 3.3 Delete `next-pwa.d.ts` from root
- [x] 3.4 Update `tsconfig.json`:
  - [x] 3.4.1 Remove Next.js-specific compiler options (jsx, allowJs)
  - [x] 3.4.2 Ensure React Native types are targeted
  - [x] 3.4.3 Verify no Next.js path aliases
- [x] 3.5 Delete `.next/` build directory (if exists)
- [x] 3.6 Delete `public/` web assets (keep only manifest.json if needed for PWA)
- [x] 3.7 Commit changes: "chore: remove Next.js configuration files"

## 4. Package.json & Dependency Cleanup

- [x] 4.1 Backup current `package.json`
- [x] 4.2 Remove Next.js dependencies:
  - [x] 4.2.1 Remove `next`
  - [x] 4.2.2 Remove `@next/bundle-analyzer` (if present)
  - [x] 4.2.3 Remove any `next-` prefixed packages
- [x] 4.3 Remove web-specific dependencies:
  - [x] 4.3.1 Remove `react-dom` (if present)
  - [x] 4.3.2 Remove Vercel CLI tools
  - [x] 4.3.3 Remove web-only UI libraries
- [x] 4.4 Update build scripts in `package.json`:
  - [x] 4.4.1 Remove `next dev` script (replace with `expo start`)
  - [x] 4.4.2 Remove `next build` script (use EAS Build)
  - [x] 4.4.3 Update `start` script to `expo start`
  - [x] 4.4.4 Add `android: eas build --platform android`
  - [x] 4.4.5 Add `ios: eas build --platform ios`
- [x] 4.5 Verify Expo and React Native versions are locked
- [ ] 4.6 Run `npm install` to update lock file
- [ ] 4.7 Run `npm dedupe` to consolidate dependencies
- [ ] 4.8 Run `npm audit` and address security issues
- [x] 4.9 Commit changes: "chore: consolidate dependencies (remove web, add React Native)"

## 5. Build System Configuration

- [x] 5.1 Verify `eas.json` exists and is properly configured
- [x] 5.2 Verify `app.json` (Expo config) is present and correct
- [ ] 5.3 Update CI/CD pipeline (GitHub Actions):
  - [ ] 5.3.1 Remove Vercel deployment step
  - [ ] 5.3.2 Remove Next.js build job
  - [ ] 5.3.3 Add EAS Build trigger for Android
  - [ ] 5.3.4 Add EAS Build trigger for iOS (if applicable)
- [ ] 5.4 Update deployment documentation to reference EAS Build
- [ ] 5.5 Test local build: `npm run android` on Android emulator
- [ ] 5.6 Test local build: `npm run ios` on iOS simulator (if on Mac)
- [ ] 5.7 Verify EAS Build credentials are configured
- [x] 5.8 Commit changes: "chore: update build configuration for React Native"

## 6. TypeScript & Code Validation

- [ ] 6.1 Run `npx tsc --noEmit` to check compilation
- [ ] 6.2 Fix any TypeScript errors (target: 0 errors)
- [ ] 6.3 Verify no `any` types in codebase
- [x] 6.4 Check ESLint configuration exists (`eslint.config.mjs`)
- [ ] 6.5 Run `npm run lint` and fix any lint errors
- [ ] 6.6 Run `npm run format` to standardize code style
- [ ] 6.7 Verify all imports resolve correctly
- [ ] 6.8 Check for broken React Native imports (no web APIs)
- [ ] 6.9 Commit changes: "refactor: fix TypeScript and lint errors"

## 7. Documentation Updates

- [ ] 7.1 Archive Next.js documentation to `docs/archived/nextjs/`
- [x] 7.2 Update root `README.md`:
  - [x] 7.2.1 Change title to React Native Expo focus
  - [x] 7.2.2 Remove web deployment section
  - [x] 7.2.3 Update architecture to mobile-first
  - [x] 7.2.4 Remove Vercel references
- [x] 7.3 Update setup instructions in README:
  - [x] 7.3.1 Change from `npm run dev` to `expo start`
  - [x] 7.3.2 Update Android/iOS device setup
  - [x] 7.3.3 Update EAS Build instructions
- [ ] 7.4 Update `DEVELOPER_DOCUMENTATION.md` to remove Next.js sections
- [ ] 7.5 Remove outdated documentation files (`nextjs*.md`, `web*.md`)
- [ ] 7.6 Create `MIGRATION_SUMMARY.md` documenting this change
- [ ] 7.7 Update GitHub repo description if applicable
- [x] 7.8 Commit changes: "docs: consolidate documentation for React Native"

## 8. Offline & Sync Verification

- [ ] 8.1 Test offline data persistence:
  - [ ] 8.1.1 Create report offline
  - [ ] 8.1.2 Verify report is queued locally
  - [ ] 8.1.3 Re-enable network and verify auto-sync
- [ ] 8.2 Test map caching (5-minute TTL)
- [ ] 8.3 Test cached data availability when offline
- [ ] 8.4 Verify sync conflict resolution
- [ ] 8.5 Test cache expiration and refresh
- [ ] 8.6 Verify queued operations survive app restart

## 9. Device Testing

- [ ] 9.1 Test on Android device/emulator:
  - [ ] 9.1.1 Authentication flow
  - [ ] 9.1.2 Map rendering and interaction
  - [ ] 9.1.3 Photo capture with permissions
  - [ ] 9.1.4 Report creation and submission
  - [ ] 9.1.5 Offline functionality
- [ ] 9.2 Test on iOS device/simulator (if available):
  - [ ] 9.2.1 All scenarios from 9.1
  - [ ] 9.2.2 Face ID / Touch ID authentication
- [ ] 9.3 Test on low-end device (e.g., Android Go)
- [ ] 9.4 Test on high-end device (e.g., flagship phone)
- [ ] 9.5 Test tablet view (md/lg breakpoints)
- [ ] 9.6 Test dark mode on both devices
- [ ] 9.7 Verify performance metrics collection
- [ ] 9.8 Document any device-specific issues

## 10. Final Verification & Release

- [ ] 10.1 Run full TypeScript check: `npx tsc --noEmit`
- [ ] 10.2 Run full test suite (if available)
- [ ] 10.3 Verify all features in acceptance criteria
- [ ] 10.4 Check for console warnings and errors
- [ ] 10.5 Performance audit: measure render times, data sync speed
- [ ] 10.6 Security audit: verify no hardcoded secrets
- [ ] 10.7 Create release notes for v1.0.0-react-native-consolidated
- [ ] 10.8 Tag commit: `git tag v1.0.0-react-native-consolidated`
- [ ] 10.9 Update version in `package.json`
- [ ] 10.10 Prepare deployment instructions for team
- [ ] 10.11 Commit final changes: "chore: version bump v1.0.0-react-native-consolidated"

## 11. Post-Migration

- [ ] 11.1 Monitor crash logs for first week
- [ ] 11.2 Collect user feedback on mobile-only transition
- [ ] 11.3 Handle any reported issues or edge cases
- [ ] 11.4 Update onboarding documentation for new developers
- [ ] 11.5 Archive this change when all tasks complete
