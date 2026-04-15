## ADDED Requirements

### Requirement: System dark mode detection
The system SHALL detect and respond to the device's system-level dark mode preference.

#### Scenario: Device set to dark mode
- **WHEN** device system settings are set to dark mode
- **THEN** app automatically displays dark theme
- **THEN** color scheme uses light text on dark backgrounds

#### Scenario: Device set to light mode
- **WHEN** device system settings are set to light mode
- **THEN** app automatically displays light theme
- **THEN** color scheme uses dark text on light backgrounds

#### Scenario: System theme changes while app is running
- **WHEN** user changes system dark mode setting
- **THEN** app detects the change
- **THEN** interface updates immediately without restart

### Requirement: Persistent dark mode preference
The system SHALL allow users to override system preference and persist their choice.

#### Scenario: User toggles dark mode override
- **WHEN** user enables dark mode override in settings
- **THEN** app enters dark mode regardless of system setting
- **THEN** preference is saved to local storage

#### Scenario: User disables dark mode override
- **WHEN** user disables dark mode override
- **THEN** app returns to following system preference
- **THEN** change persists across app restarts

### Requirement: Consistent color palette in dark mode
The system SHALL maintain appropriate contrast and readability across all screens in dark mode.

#### Scenario: View dark mode text readability
- **WHEN** user views any screen in dark mode
- **THEN** text has sufficient contrast to meet WCAG AA standards
- **THEN** all UI elements are clearly distinguishable

#### Scenario: Dark mode in map view
- **WHEN** user views map in dark mode
- **THEN** map tiles display dark theme appropriate colors
- **THEN** map overlays (markers, clustering) remain visible

### Requirement: Status bar and navigation bar styling
The system SHALL adapt status bar and navigation bar appearance based on theme.

#### Scenario: Dark mode with dark status bar
- **WHEN** app displays in dark mode
- **THEN** status bar content (time, battery) is light-colored
- **THEN** navigation bar styling complements dark theme

#### Scenario: Light mode with light status bar
- **WHEN** app displays in light mode
- **THEN** status bar content is dark-colored
- **THEN** navigation bar styling complements light theme
