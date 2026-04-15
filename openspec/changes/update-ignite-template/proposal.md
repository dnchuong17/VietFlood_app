## Why

VietFlood is a React Native/Expo project with similar foundational tech as Ignite (RN 0.84, Expo 55, React Navigation 7, TypeScript 5), but lacks Ignite's proven architectural patterns and best practices. By adopting Ignite's approach, we can establish industry-standard conventions, improve code maintainability, standardize testing practices, and leverage battle-tested component library patterns that Infinite Red has refined over 9+ years.

## What Changes

- **State Management**: Introduce MobX-State-Tree (MST) for predictable, typed state management instead of context-only approach
- **Project Structure**: Align with Ignite's proven folder organization (services, models, components) and naming conventions
- **Component Library**: Adopt Ignite's custom component library patterns with proper theming, accessibility, and testing
- **CLI Tooling**: Integrate Ignite's generator patterns for scaffolding screens, models, and components consistently
- **Code Quality**: Add dependency-cruiser for dependency graph validation and improve ESLint config with import sorting
- **Testing**: Establish Maestro E2E testing framework alongside Jest for mobile-focused UI automation
- **Animations**: Adopt Ignite's Reanimated 4 patterns for consistent animation approach
- **Date Handling**: Use date-fns (v4) instead of custom date utilities for standardization
- **Keyboard Management**: Integrate react-native-keyboard-controller for better keyboard UX patterns
- **Localization**: Add Expo Localization support for i18n (including RTL) based on Ignite's approach

## Capabilities

### New Capabilities

- `state-tree-models`: MobX-State-Tree models for app state (auth, relief operations, reports, volunteer data)
- `cli-generators`: Project generators for screens, models, and components following Ignite patterns
- `component-library`: Standardized DDS (Design System) components with theming and accessibility
- `maestro-e2e-testing`: End-to-end testing framework for critical user flows
- `dependency-validation`: Dependency-cruiser integration for architecture enforcement
- `internationalization`: i18n support with Expo Localization (multi-language, RTL-ready)
- `animation-patterns`: Reanimated v4 patterns for consistent animation implementation

### Modified Capabilities

- `navigation`: Restructure to follow Ignite's linking and deep-linking patterns
- `styling`: Integrate Ignite's approach to NativeWind with custom design tokens
- `error-handling`: Adopt Ignite's error boundary and error recovery patterns
- `development-tooling`: Upgrade ESLint, Prettier, and debugging setup per Ignite standards

## Impact

- **Code Organization**: Restructure src/ to follow services→models→screens→components hierarchy
- **Dependencies**: Add MST (~30KB), date-fns (~13KB), react-native-keyboard-controller, dependency-cruiser
- **Breaking Changes**: 
  - **BREAKING**: Navigation deep-linking setup will change
  - **BREAKING**: Context-based state will migrate to MST models (phased migration possible)
- **Developer Experience**: Improved scaffolding, clearer patterns, better IDE support through MST typing
- **Testing**: New E2E testing workflows with Maestro
- **Build Size**: Minor increase from new patterns but offset by better code organization and tree-shaking potential
- **Team Alignment**: Developers familiar with Ignite can contribute immediately; consistent with industry standards
