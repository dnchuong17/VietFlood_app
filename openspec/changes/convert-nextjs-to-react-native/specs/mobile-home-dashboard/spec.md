## ADDED Requirements

### Requirement: Home dashboard with map and weather

The app SHALL display home screen with interactive map, weather statistics, and quick-access tools.

#### Scenario: Home screen loads
- **WHEN** authenticated user navigates to home tab
- **THEN** app displays map as primary content with weather overlays and stats panel below

#### Scenario: Weather stats visible
- **WHEN** home screen displays
- **THEN** app shows current weather conditions (temperature, wind speed, precipitation) from Windy API

#### Scenario: Active reports indicator
- **WHEN** user opens home screen
- **THEN** app displays count of active/unverified reports in region and notification badge

### Requirement: Quick-access tools panel

The app SHALL provide buttons for common actions on home screen.

#### Scenario: Tools visible
- **WHEN** home screen displays
- **THEN** app shows buttons for: create report, view my reports, relief dashboard (if authorized), and settings

#### Scenario: Create report from home
- **WHEN** user taps "create report" button
- **THEN** app navigates to report creation form

### Requirement: Users overview statistics

The app SHALL display summary of relief operations and reporting activity.

#### Scenario: Overview statistics shown
- **WHEN** home screen displays stats panel
- **THEN** app shows: active relief operations count, reports submitted today, team members online, recent updates

#### Scenario: Tap statistic for detail
- **WHEN** user taps on statistic card
- **THEN** app navigates to detail view (e.g., ops list, recent reports)

### Requirement: Dynamic overlay toggle

The app SHALL allow users to toggle weather overlay layers from home screen.

#### Scenario: Overlay controls visible
- **WHEN** user opens home map
- **THEN** app displays overlay toggle buttons for: rain, wind, temperature, clouds, pressure, humidity

#### Scenario: Toggle rain overlay
- **WHEN** user taps rain toggle button
- **THEN** rain overlay appears/disappears on map and toggle state is saved for next session

### Requirement: Responsive layout for various screen sizes

The app SHALL adapt layout for phones (small) and tablets (large).

#### Scenario: Landscape orientation on phone
- **WHEN** user rotates phone to landscape
- **THEN** map expands and stats panel repositions below or to side

#### Scenario: Tablet layout
- **WHEN** app runs on tablet
- **THEN** map and stats display side-by-side with optimal spacing

### Requirement: Accessibility features

The app SHALL support screen readers and high contrast for accessibility.

#### Scenario: Screen reader reads controls
- **WHEN** user enables system screen reader
- **THEN** app announces button purposes and current stats

#### Scenario: High contrast mode
- **WHEN** user enables system high contrast setting
- **THEN** map overlays and UI elements use higher contrast colors
