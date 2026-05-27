## ADDED Requirements

### Requirement: Mobile modules SHALL align with VietFlood_app domain boundaries
VietFlood_mobile MUST organize migrated business logic into feature modules that map to VietFlood_app domain boundaries and expose stable interfaces for use by screens and navigators.

#### Scenario: Feature module scaffold is created for migration
- **WHEN** a domain from VietFlood_app is selected for migration
- **THEN** VietFlood_mobile provides a corresponding feature module with domain entry points and typed interfaces

#### Scenario: Screens consume domain interfaces instead of embedded business logic
- **WHEN** a migrated screen is rendered in VietFlood_mobile
- **THEN** business decisions are executed through feature module interfaces rather than inline screen logic

### Requirement: Migration adapters SHALL preserve app operability during transition
VietFlood_mobile MUST provide adapter layers that allow existing Ignite-oriented screen and navigation structures to call migrated feature modules without requiring a full rewrite before release.

#### Scenario: Legacy route uses migrated logic through adapter
- **WHEN** an existing route has not been fully replaced
- **THEN** it accesses migrated domain behavior through an adapter contract compatible with the current route structure

#### Scenario: Unmigrated features remain functional
- **WHEN** only a subset of feature modules has been migrated
- **THEN** unmigrated features continue operating with existing logic and do not block app startup
