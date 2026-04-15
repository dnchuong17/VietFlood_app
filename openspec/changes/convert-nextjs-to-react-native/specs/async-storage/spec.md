## ADDED Requirements

### Requirement: Secure token storage

The app SHALL store access and refresh tokens in platform-native secure storage (iOS Keychain, Android Keystore).

#### Scenario: Token saved after login
- **WHEN** user logs in successfully and receives tokens
- **THEN** app stores access token and refresh token in secure storage using `expo-secure-store`

#### Scenario: Token retrieved on app startup
- **WHEN** user opens app after previous session
- **THEN** app retrieves stored tokens from secure storage without exposing to memory initially

#### Scenario: Token cleared on logout
- **WHEN** user logs out
- **THEN** app deletes stored tokens from secure storage and clears auth state

### Requirement: User preference persistence

The app SHALL store non-sensitive user preferences (theme, overlay visibility) in async storage.

#### Scenario: Dark mode preference saved
- **WHEN** user enables dark mode in settings
- **THEN** app saves preference to AsyncStorage and restores on next app launch

#### Scenario: Map overlay preferences saved
- **WHEN** user toggles overlay visibility (rain, wind, etc.)
- **THEN** app saves which overlays are enabled and restores same state on home screen load

#### Scenario: Language preference saved
- **WHEN** user changes app language
- **THEN** app saves preference and applies language to all screens on next launch

### Requirement: Cache management

The app SHALL implement cache expiration and cleanup to manage storage.

#### Scenario: Cache expires after timeout
- **WHEN** cached data (weather, operations list) is older than cache TTL (15 minutes)
- **THEN** app discards cached data and fetches fresh from backend

#### Scenario: Storage limit respected
- **WHEN** cached data exceeds device storage limits
- **THEN** app clears oldest cached items first (LRU cache eviction)

### Requirement: Offline state tracking

The app SHALL persist flag indicating last known connectivity state.

#### Scenario: App goes offline
- **WHEN** device network becomes unavailable
- **THEN** app stores offline state and disables real-time updates

#### Scenario: App comes online
- **WHEN** device reconnects to network
- **THEN** app detects online state, clears offline flag, and syncs any queued changes

### Requirement: Migration from localStorage

The app SHALL migrate any existing localStorage data from web version to mobile storage systems.

#### Scenario: First app launch from web cached data
- **WHEN** user opens mobile app for first time
- **THEN** app checks for web localStorage data and migrates eligible data to AsyncStorage/secure-store

#### Scenario: No web data exists
- **WHEN** fresh mobile install with no prior web usage
- **THEN** app initializes storage with defaults and proceeds normally
