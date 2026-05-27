## Why

VietFlood_mobile currently uses the Ignite starter structure and does not include the production flood-response domain logic that exists in VietFlood_app. Aligning the mobile codebase with VietFlood_app now reduces duplicated development, enables feature parity across platforms, and allows one consistent product roadmap.

## What Changes

- Add a migration layer that ports core feature logic from VietFlood_app into VietFlood_mobile while preserving Ignite app conventions where needed.
- Introduce shared domain modules in VietFlood_mobile for authentication, reports, relief workflows, volunteer workflows, and role-based access behaviors currently implemented in VietFlood_app.
- Integrate app services in VietFlood_mobile for API access, offline-safe data behavior, weather/location support, and feature-level state coordination.
- Align navigation and screen composition in VietFlood_mobile to support protected/public/auth experiences consistent with VietFlood_app user flows.
- Define an incremental migration path that keeps VietFlood_mobile buildable during rollout, with compatibility wrappers for existing Ignite components.

## Capabilities

### New Capabilities
- `mobile-logic-alignment`: Port and structure VietFlood_app business logic modules inside VietFlood_mobile with equivalent behaviors.
- `mobile-feature-parity`: Deliver functional parity for key flood-response features (auth, reports, relief, volunteer, profile/home workflows) in the mobile app.
- `mobile-service-integration`: Connect VietFlood_mobile features to service, offline, and role-based logic adapted from VietFlood_app.

### Modified Capabilities
- None.

## Impact

- Affected code: VietFlood_mobile app architecture, navigation, feature modules, service layer, and state management.
- Affected systems: API integration surfaces and offline data behavior in mobile runtime.
- Dependencies: Existing VietFlood_mobile Ignite setup, Expo/React Native ecosystem, and VietFlood_app domain logic as migration source.
- Risk areas: Regression during phased migration, duplicated logic during transition, and inconsistencies in access-control behavior if parity rules are incomplete.
