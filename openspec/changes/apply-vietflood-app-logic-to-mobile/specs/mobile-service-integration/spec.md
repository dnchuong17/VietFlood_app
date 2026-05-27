## ADDED Requirements

### Requirement: Mobile features SHALL use standardized service contracts
VietFlood_mobile MUST route API access, offline data operations, weather/location data retrieval, and RBAC checks through shared service contracts used by migrated features.

#### Scenario: Feature uses shared API and offline contracts
- **WHEN** a migrated feature performs network-backed data operations
- **THEN** it uses shared service interfaces for remote requests and offline-safe persistence behavior

#### Scenario: Feature evaluates permissions through shared RBAC logic
- **WHEN** a migrated feature renders role-restricted actions
- **THEN** authorization decisions are made through common RBAC services and guard utilities

### Requirement: Service integration SHALL maintain consistent failure handling
VietFlood_mobile MUST provide consistent error and fallback behavior for service failures so users receive predictable outcomes across migrated workflows.

#### Scenario: API failure in migrated workflow
- **WHEN** a service request fails due to network or backend errors
- **THEN** the feature reports the failure through the shared error path and preserves recoverable user state

#### Scenario: Offline mode fallback
- **WHEN** the device is offline during a migrated workflow
- **THEN** the feature applies shared offline fallback rules and communicates the pending or cached state to the user
