## 1. Dependencies & Project Setup

- [ ] 1.1 Install MobX-State-Tree (mobx-state-tree ^6.0.0)
- [ ] 1.2 Install date-fns (^4.0.0) and set up date utilities
- [ ] 1.3 Install react-native-keyboard-controller (^1.12.0)
- [ ] 1.4 Install i18n-js (^4.4.0) for internationalization
- [ ] 1.5 Install dependency-cruiser (^16.0.0) and configure rules
- [ ] 1.6 Install Maestro CLI locally for E2E testing
- [ ] 1.7 Verify no TypeScript errors after dependencies: `tsc --noEmit`

## 2. Project Architecture & Folder Structure

- [x] 2.1 Create services/ folder structure (api, storage, location, notifications)
- [x] 2.2 Create models/ folder structure (auth, operations, volunteers, reports)
- [x] 2.3 Create features/ folder with existing features (auth, relief, reports, volunteer, home, profile, emergency)
- [x] 2.4 Create components/design-system folder with base components (Button, Card, Input, etc.)
- [x] 2.5 Migrate existing shared components to components/index.ts with exports
- [x] 2.6 Create libs/hooks folder for custom hooks (useAuth, useOperations, etc.)
- [x] 2.7 Configure path aliases (@services, @models, @features, @components) in tsconfig.json
- [x] 2.8 Update ESLint config with import sorting (imports-sort plugin)

## 3. Dependency Validation Setup

- [x] 3.1 Create .dependency-cruiser.js with architecture rules
- [ ] 3.2 Configure rules: services can't import features/components, models can only import services
- [ ] 3.3 Add dependency-cruiser to CI pipeline (GitHub Actions or similar)
- [ ] 3.4 Run initial analysis to identify violations in existing code: `depdash`
- [ ] 3.5 Document dependency cruiser rules in CONTRIBUTING.md

## 4. CLI Generators Setup

- [x] 4.1 Create templates/ folder for CLI generator templates
- [x] 4.2 Create screen.template.ts with React.FC, hooks, and navigation integration
- [x] 4.3 Create model.template.ts with MST model scaffolding
- [x] 4.4 Create component.template.ts with props interface and exports
- [x] 4.5 Create generator scripts in package.json (generate:screen, generate:model, generate:component)
- [ ] 4.6 Test generators: `npm run generate:model TestModel` creates test model
- [ ] 4.7 Document generator usage with examples in docs/GENERATORS.md

## 5. MST Auth Model & Migration (Phase 1)

- [x] 5.1 Create models/auth/auth.model.ts with MST: user, token, permissions, isLoading, error
- [x] 5.2 Implement auth model actions: login(), register(), logout(), refreshToken(), setUser()
- [x] 5.3 Create auth model persistence layer with AsyncStorage integration
- [x] 5.4 Create useAuth() hook that returns auth model instance with typed properties
- [x] 5.5 Create AuthService wrapping API calls (login, register, verify)
- [ ] 5.6 Update LoginScreen to use new useAuth() hook and MST model
- [ ] 5.7 Update RegisterScreen to use new useAuth() hook
- [ ] 5.8 Add Maestro test: login-flow.yaml - covers input, submit, navigation
- [ ] 5.9 Verify existing auth context still works in parallel (dual pattern OK)
- [ ] 5.10 Update CONTRIBUTING.md with MST auth pattern documentation

## 6. MST Core Operations State (Phase 2)

- [x] 6.1 Create models/relief/operation.model.ts with MST: id, name, status, resources, team members
- [x] 6.2 Create models/relief/resource.model.ts (item type, quantity, assigned to, status)
- [x] 6.3 Create models/relief/teamMember.model.ts (user, role, status, location)
- [x] 6.4 Create relief RootModel combining operations, resources, team hierarchy
- [ ] 6.5 Implement model actions: createOperation(), assignResource(), updateStatus()
- [x] 6.6 Create useOperations() hook exposing operations model
- [ ] 6.7 Migrate ReliefDashboardScreen to use useOperations()
- [ ] 6.8 Migrate OperationDetailScreen to use useOperations()
- [ ] 6.9 Migrate ResourceTrackingView to use useOperations()
- [ ] 6.10 Create Maestro test: join-operation-flow.yaml
- [ ] 6.11 Create Maestro test: assign-resource-flow.yaml

## 7. Design System Components

- [x] 7.1 Create Button component with variants (primary, secondary, destructive) and sizes (sm, md, lg)
- [x] 7.2 Create Card component with proper shadow and spacing using Tailwind
- [x] 7.3 Create Input component (TextInput) with error states and validation feedback
- [ ] 7.4 Create Select/Picker component for dropdowns (StatusPicker variant)
- [ ] 7.5 Create DatePicker component with i18n support using DateTimePicker
- [x] 7.6 Create Stack/Box layout components with responsive spacing
- [x] 7.7 Create SafeAreaWrapper component respecting notches
- [x] 7.8 Create Loading/Spinner component with customizable size
- [ ] 7.9 Refactor existing components to use design system patterns
- [ ] 7.10 Create Storybook setup with stories for all components
- [ ] 7.11 Document component library in docs/COMPONENTS.md with examples

## 8. Styling & Theming

- [x] 8.1 Create theme context with light and dark mode variants
- [x] 8.2 Define design tokens in tailwind.config.js (colors, spacing, typography)
- [ ] 8.3 Add custom color utility extension to NativeWind config
- [x] 8.4 Create DarkModeProvider with AsyncStorage persistence
- [ ] 8.5 Update all screens to use class-based Tailwind styling
- [ ] 8.6 Implement theme switcher in SettingsScreen
- [ ] 8.7 Test dark mode on all screens (audit against DEVICE_TESTING_GUIDE.md)
- [ ] 8.8 Ensure safe area padding respects Tailwind responsive classes

## 9. Navigation Architecture (Phase 3)

- [ ] 9.1 Refactor linking configuration to Ignite pattern in lib/navigation/linking.ts
- [ ] 9.2 Implement deep-link handlers for all major screens (relief:// scheme)
- [ ] 9.3 Create navigation state MST model for stack persistence
- [ ] 9.4 Configure RootNavigator with Ignite-style typed navigation params
- [ ] 9.5 Update navigation props to use React Navigation typing helpers
- [ ] 9.6 Implement bottom tab navigation with badge support
- [ ] 9.7 Add header configuration with dynamic titles
- [ ] 9.8 Create Maestro test: deep-link-navigation.yaml
- [ ] 9.9 Document navigation patterns in docs/NAVIGATION.md

## 10. Animation Patterns

- [x] 10.1 Create animation config file with standard durations and easing (screenPush: 300ms)
- [ ] 10.2 Implement screen transition animations with Reanimated v4
- [ ] 10.3 Implement modal entrance/exit animations
- [ ] 10.4 Implement pan gesture handler for bottom sheet
- [ ] 10.5 Implement swipe-to-dismiss gesture with momentum
- [x] 10.6 Add useReducedMotion hook to respect accessibility settings
- [ ] 10.7 Test animations at 60 FPS using React Native performance profiler
- [ ] 10.8 Document animation patterns with code examples in docs/ANIMATIONS.md

## 11. Internationalization Setup

- [x] 11.1 Create i18n configuration with Expo Localization
- [x] 11.2 Create locale files: locales/en.json, locales/vi.json
- [x] 11.3 Define translation keys for all UI strings (home.*, relief.*, auth.*, common.*)
- [x] 11.4 Implement date/number formatting per locale (DD/MM/YYYY for Vietnamese)
- [ ] 11.5 Add language switcher to SettingsScreen
- [x] 11.6 Create useTranslation() hook wrapper
- [ ] 11.7 Translate all screen titles, buttons, and labels
- [ ] 11.8 Test RTL support with simulated RTL locale
- [ ] 11.9 Document i18n patterns in docs/LOCALIZATION.md

## 12. Error Handling Architecture

- [ ] 12.1 Create ErrorBoundary component at app root level (if not exists)
- [ ] 12.2 Implement API error handler service (network, 401, 5xx handling)
- [ ] 12.3 Create form validation error system with field-level messaging
- [ ] 12.4 Implement async operation error handling (uploads, syncs)
- [ ] 12.5 Add error logging to analytics service for debugging
- [ ] 12.6 Create error recovery utilities (retry logic, exponential backoff)
- [ ] 12.7 Test error scenarios: network down, invalid auth, form validation
- [ ] 12.8 Document error handling patterns in docs/ERROR_HANDLING.md

## 13. Development Tooling & Configuration

- [ ] 13.1 Update ESLint config with TypeScript strict rules (no any types)
- [ ] 13.2 Update Prettier config (print-width: 100) and add pre-commit hook
- [ ] 13.3 Integrate Reactotron with MST plugin for state inspection
- [ ] 13.4 Create .vscode/extensions.json with recommended extensions
- [ ] 13.5 Add .nvmrc with required Node version (20.x.x)
- [ ] 13.6 Configure VS Code debugging with React Native Tools
- [ ] 13.7 Verify TypeScript strict mode: `tsc --noEmit` passes
- [ ] 13.8 Test build pipeline with Expo EAS
- [ ] 13.9 Document dev environment setup in docs/DEVELOPMENT_SETUP.md

## 14. E2E Testing with Maestro (Phase 4)

- [ ] 14.1 Create maestro/ folder with test flows (YAML files)
- [ ] 14.2 Create maestro/config.yaml with app and device configuration
- [ ] 14.3 Create maestro/flows/critical-flows.yaml combining all critical paths
- [ ] 14.4 Implement: Emergency report creation flow
- [ ] 14.5 Implement: Relief operation join flow
- [ ] 14.6 Implement: Resource assignment flow
- [ ] 14.7 Implement: Authentication flow (login/register)
- [ ] 14.8 Add testID attributes to all interactive elements for Maestro selectors
- [ ] 14.9 Configure Maestro in CI pipeline
- [ ] 14.10 Create Maestro test documentation in docs/TESTING_MAESTRO.md

## 15. Analytics State & Remaining Features

- [ ] 15.1 Create models/analytics/analytics.model.ts for tracking data
- [ ] 15.2 Migrate AnalyticsScreen to use useAnalytics() hook
- [ ] 15.3 Create models/profile/user.model.ts for profile data
- [ ] 15.4 Migrate ProfileScreen and SettingsScreen to MST
- [ ] 15.5 Create models/volunteer/volunteer.model.ts
- [ ] 15.6 Migrate VolunteerDashboardScreen to MST
- [ ] 15.7 Create models/reports/report.model.ts
- [ ] 15.8 Migrate ReportCreationScreen to MST
- [ ] 15.9 Remove or deprecate old Context-based state management
- [ ] 15.10 Audit for any remaining context usage and migrate

## 16. Testing & Quality Assurance

- [ ] 16.1 Run full Jest test suite and fix failures
- [ ] 16.2 Run Maestro E2E tests against all flows
- [ ] 16.3 Run dependency-cruiser to verify architecture rules
- [ ] 16.4 Run ESLint and Prettier across all files
- [ ] 16.5 TypeScript strict mode check: `tsc --noEmit` (0 errors required)
- [ ] 16.6 Performance profiling: verify 60 FPS on animations
- [ ] 16.7 Manual device testing following DEVICE_TESTING_GUIDE.md for all screens
- [ ] 16.8 Test dark mode on all screens
- [ ] 16.9 Test all i18n strings for Vietnamese/English
- [ ] 16.10 Security audit: verify no secrets in code, proper token handling

## 17. Documentation & Knowledge Transfer

- [ ] 17.1 Update README.md with new architecture overview
- [ ] 17.2 Create docs/ARCHITECTURE.md explaining services→models→features→components flow
- [ ] 17.3 Create docs/MST_PATTERNS.md with model examples (auth, operations)
- [ ] 17.4 Create docs/COMPONENT_EXAMPLES.md with usage examples
- [ ] 17.5 Create docs/API_INTEGRATION.md for service patterns
- [ ] 17.6 Create docs/TESTING_STRATEGY.md for Jest + Maestro workflow
- [ ] 17.7 Update CONTRIBUTING.md with new development patterns
- [ ] 17.8 Internal code review and documentation feedback
- [ ] 17.9 Record brief architecture walkthrough video/demo
- [ ] 17.10 Create migration checklist for any remaining manual items

## 18. Deployment & Cleanup

- [ ] 18.1 Create release branch (e.g., ignite-update-v2.0.0)
- [ ] 18.2 Verify all CI checks pass: ESLint, TypeScript, Tests, dependency-cruiser
- [ ] 18.3 Tag release and create GitHub release notes
- [ ] 18.4 Deploy to staging build with Expo EAS
- [ ] 18.5 Final QA on staging build: all flows, dark mode, i18n
- [ ] 18.6 Merge to main and deploy to production build
- [ ] 18.7 Monitor error logs for regressions in first 48 hours
- [ ] 18.8 Retrospective: document lessons learned and pain points
- [ ] 18.9 Plan follow-up improvements based on feedback
- [ ] 18.10 Update version in app.json and package.json for next feature release
