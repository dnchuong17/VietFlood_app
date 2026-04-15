## ADDED Requirements

### Requirement: User login with token storage

The app SHALL authenticate users with email/password, receive access and refresh tokens, and securely store them.

#### Scenario: Successful login
- **WHEN** user enters valid email and password and taps login button
- **THEN** app sends POST request to backend auth endpoint, receives access+refresh tokens, stores in secure storage, and navigates to home screen

#### Scenario: Invalid credentials
- **WHEN** user enters invalid email or password and taps login
- **THEN** app displays error message and remains on login screen

#### Scenario: Network error during login
- **WHEN** network is unavailable during login request
- **THEN** app displays network error message and retry button remains available

### Requirement: User registration

The app SHALL allow new users to register with email, password, and profile information.

#### Scenario: Successful registration
- **WHEN** user fills registration form (email, password, name, location) and taps register
- **THEN** app sends POST request to backend, creates account, automatically logs user in, stores tokens, and navigates to home

#### Scenario: Email already exists
- **WHEN** user enters email that already has an account
- **THEN** app displays "email already registered" error and remains on registration screen

#### Scenario: Form validation
- **WHEN** user enters invalid email format or mismatched passwords
- **THEN** app displays validation error and prevents form submission

### Requirement: Automatic token refresh

The app SHALL refresh expired access tokens using refresh token without forcing user to re-login.

#### Scenario: Token expires during API call
- **WHEN** API request returns 401 (unauthorized) due to expired access token
- **THEN** app automatically uses refresh token to get new access token, retries original request, and continues

#### Scenario: Refresh token also expired
- **WHEN** refresh token is also expired and refresh attempt fails
- **THEN** app clears all tokens, logs user out, and displays login screen

#### Scenario: Concurrent requests with expired token
- **WHEN** multiple API requests encounter expired token simultaneously
- **THEN** app initiates only one token refresh request and queues other requests

### Requirement: Profile view and edit

The app SHALL display user profile information and allow updates.

#### Scenario: View profile
- **WHEN** user navigates to profile screen
- **THEN** app displays current user name, email, role, location, and phone number

#### Scenario: Update profile
- **WHEN** user edits profile fields and taps save
- **THEN** app sends PATCH request to backend with updated data, token refreshes if needed, and displays success message

### Requirement: Logout

The app SHALL clear authentication tokens and return user to login screen when logging out.

#### Scenario: User taps logout
- **WHEN** user taps logout button in settings or profile screen
- **THEN** app clears access & refresh tokens from secure storage and displays public stack (login/registration)

#### Scenario: Logout on app background
- **WHEN** user leaves app for significant time and app may have been force-closed
- **THEN** on next app open, if tokens expired, user returns to login screen

### Requirement: Role-based access control

The app SHALL enforce screen access based on user role (relief worker, reporter, admin).

#### Scenario: Relief worker accesses relief dashboard
- **WHEN** relief worker (role: RELIEF_ADMIN or RELIEF_WORKER) navigates to relief dashboard
- **THEN** app displays dashboard with relief operations data

#### Scenario: Reporter cannot access relief dashboard
- **WHEN** reporter user (role: REPORTER) attempts to access relief dashboard
- **THEN** app prevents navigation and displays "access denied" message or hides tab

#### Scenario: Role persists in user profile
- **WHEN** user fetches their profile from backend
- **THEN** app stores role in auth context and uses for permission checks
