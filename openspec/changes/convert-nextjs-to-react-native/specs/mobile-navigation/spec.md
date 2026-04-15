## ADDED Requirements

### Requirement: Role-based protected navigation

The app SHALL provide different screen hierarchies based on user authentication status and role. Unauthenticated users access the public stack (login/registration); authenticated users access the protected stack (home, relief dashboard, reports).

#### Scenario: Unauthenticated user sees login screen
- **WHEN** user opens app with no valid auth token in secure storage
- **THEN** app displays public stack with login and registration screens

#### Scenario: Authenticated user sees protected screens
- **WHEN** user opens app with valid auth token in secure storage
- **THEN** app displays protected stack with tab navigation (home, relief, reports)

#### Scenario: User logs out and returns to login
- **WHEN** user logs out from any protected screen
- **THEN** auth token is cleared from secure storage and public stack is displayed

### Requirement: Tab-based navigation for protected routes

The app SHALL provide tab-based navigation for authenticated users with tabs for Home, Relief Dashboard, and Reports.

#### Scenario: User navigates between tabs
- **WHEN** user taps tab icons at bottom of screen
- **THEN** app navigates to corresponding screen without destroying tab state

#### Scenario: Nested navigation within tab
- **WHEN** user navigates to detail screen within a tab (e.g., report details)
- **THEN** back button or swipe gesture returns to tab's list view

### Requirement: Native back button handling

The app SHALL respect native platform back button behavior (Android physical button, iOS swipe gesture).

#### Scenario: Android back button on detail screen
- **WHEN** user presses Android back button on detail screen
- **THEN** app navigates back to previous screen in stack

#### Scenario: iOS swipe-back gesture
- **WHEN** user performs right-swipe gesture on iOS detail screen
- **THEN** app navigates back to previous screen in stack

### Requirement: Deep linking support

The app SHALL support deep links to protected screens for notifications or shared links.

#### Scenario: Deep link to report detail
- **WHEN** app receives deep link like `vietflood://reports/report-id-123`
- **THEN** app navigates to report detail screen with that report ID

#### Scenario: Deep link to unauthenticated user
- **WHEN** unauthenticated user opens deep link
- **THEN** app displays login screen first, then navigates to target screen after authentication
