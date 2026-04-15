## ADDED Requirements

### Requirement: MST Model Architecture
The system SHALL use MobX-State-Tree models for all client-side application state, providing type-safe, immutable snapshots and predictable state mutations.

#### Scenario: Auth Model Creation
- **WHEN** the app initializes
- **THEN** the auth model loads token from secure storage and restores session state

#### Scenario: Operation Model Updates
- **WHEN** relief operation details change
- **THEN** the operation model applies changes immutably and notifies subscribers

#### Scenario: Model Snapshots
- **WHEN** persisting app state
- **THEN** the system calls `getSnapshot()` to serialize all models to JSON

### Requirement: Model-Based Hooks
The system SHALL expose MST models through custom hooks (e.g., `useAuth()`, `useOperations()`) that provide type-safe access to model state and actions.

#### Scenario: Type-Safe Hook Usage
- **WHEN** a component imports `useAuth()`
- **THEN** TypeScript provides full type hints for auth properties and methods

#### Scenario: Hook Subscription
- **WHEN** model state changes
- **THEN** hooks automatically re-render dependent components

### Requirement: Phased Migration from Context
The system SHALL support parallel Context API and MST patterns during migration, with explicit markers indicating which features use which pattern.

#### Scenario: Context Feature Compatibility
- **WHEN** a feature still uses Context API
- **THEN** the code includes a `// TODO: Migrate to MST` comment identifying the transition

#### Scenario: MST-First Features
- **WHEN** new features are created
- **THEN** they use MST models exclusively, not Context

### Requirement: Authentication Model
The auth MST model SHALL manage user identity, tokens, permissions, and session state with automatic persistence.

#### Scenario: Login Success
- **WHEN** user successfully authenticates
- **THEN** auth model stores token and user profile; session persists across app restart

#### Scenario: Token Refresh
- **WHEN** token expires
- **THEN** auth model automatically refreshes token using stored credentials

#### Scenario: Logout
- **WHEN** user logs out
- **THEN** auth model clears all session data and emits logout event to reset UI
