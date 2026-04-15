## MODIFIED Requirements

### Requirement: API request authentication with token refresh

The app SHALL attach access tokens to API requests and automatically refresh tokens on 401 responses without interrupting user workflow.

#### Scenario: Authenticated API request succeeds
- **WHEN** app makes API request with valid access token
- **THEN** request includes Authorization header (Bearer token), backend authenticates, and response data is returned

#### Scenario: Access token expired during request
- **WHEN** API returns 401 and access token is expired
- **THEN** app automatically uses refresh token to obtain new access token via `POST /auth/refresh`, retries original request with new token, and returns data

#### Scenario: Refresh token also expired
- **WHEN** refresh token is expired and refresh attempt returns 401
- **THEN** app clears all tokens from secure storage, logs user out, displays login screen, and returns error

#### Scenario: Concurrent requests with expired token
- **WHEN** multiple requests encounter 401 simultaneously
- **THEN** app initiates only one refresh call, queues pending requests, and retries after refresh completes

### Requirement: Token storage location change

The app SHALL migrate token storage from browser localStorage to platform-native secure storage (`expo-secure-store`).

#### Scenario: Tokens stored securely on mobile
- **WHEN** user logs in on mobile app
- **THEN** tokens are stored in iOS Keychain (iOS) or Android Keystore (Android), not in plain-text memory

#### Scenario: Token retrieval from secure storage
- **WHEN** app needs to access token for API request
- **THEN** token is retrieved from secure storage and used in Authorization header

#### Scenario: Backward compatibility (web to mobile migration)
- **WHEN** existing web user opens mobile app for first time
- **THEN** if localStorage tokens exist, migrate them to secure storage; if not, user logs in normally

### Requirement: Error handling with flexible response shapes

The app SHALL handle varying API response formats (data, items, reports, users, result properties) and extract user-friendly error messages.

#### Scenario: Error message extraction
- **WHEN** API returns error response with message as string
- **THEN** app extracts error message and displays to user

#### Scenario: Error message as array
- **WHEN** API returns error with message as array of strings
- **THEN** app joins messages and displays as single error message

#### Scenario: Network error
- **WHEN** network request fails (timeout, connection refused)
- **THEN** app displays "network error" message and offers retry option

### Requirement: Base URL configuration for mobile

The app SHALL use correct backend Base URL (`https://vietflood-app.azurewebsites.net`) and support environment-based configuration.

#### Scenario: API calls use correct domain
- **WHEN** app makes API request
- **THEN** request is sent to `https://vietflood-app.azurewebsites.net` (production) or staging domain (development)

#### Scenario: Environment variable configuration
- **WHEN** app builds with `EXPO_PUBLIC_API_BASE_URL` environment variable
- **THEN** app uses specified API base URL instead of hardcoded value
