## ADDED Requirements

### Requirement: Create flood report with rich details

The app SHALL allow users to submit flood reports with photos, location, severity, and description.

#### Scenario: User starts new report
- **WHEN** user taps "create report" button
- **THEN** app opens form with fields for description, severity, location, and photo upload

#### Scenario: Add photo to report
- **WHEN** user taps camera button in report form
- **THEN** app opens camera or photo library, user selects image, and photo is attached to report

#### Scenario: Submit report with location
- **WHEN** user taps submit with device location enabled
- **THEN** app sends POST request with report data including auto-detected GPS coordinates

#### Scenario: Offline report saving (future)
- **WHEN** user submits report without network
- **THEN** app queues report locally for sending when network returns

### Requirement: View report history

The app SHALL display user's submitted reports with filtering and search capabilities.

#### Scenario: Report list loads
- **WHEN** user navigates to reports screen
- **THEN** app displays list of user's reports sorted by most recent first

#### Scenario: Filter reports by status
- **WHEN** user taps filter button
- **THEN** app displays status filter options (pending, verified, closed) and filters list

#### Scenario: Search reports
- **WHEN** user enters search term in search box
- **THEN** app filters reports by matching description or location name

### Requirement: Report detail view

The app SHALL display full report details including photos, comments, and status.

#### Scenario: Tap report in list
- **WHEN** user taps report in history list
- **THEN** app navigates to detail screen showing full report, photos, comments, and status

#### Scenario: Status updates
- **WHEN** relief staff comments on or updates report status
- **THEN** detail screen reflects status change and new comments appear

### Requirement: Mobile-friendly form inputs

The app SHALL provide touch-optimized form fields suitable for mobile data entry.

#### Scenario: Text input shows mobile keyboard
- **WHEN** user taps text description field
- **THEN** app displays mobile keyboard with appropriate input type (text, numeric, etc.)

#### Scenario: Severity selector
- **WHEN** user selects severity level
- **THEN** app displays radio buttons or picker suitable for touch (not dropdown)

#### Scenario: Date/time picker
- **WHEN** user selects date/time of flood
- **THEN** app displays mobile date/time picker (OS-native, not HTML date input)
