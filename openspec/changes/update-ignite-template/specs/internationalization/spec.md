## ADDED Requirements

### Requirement: Multi-Language Support
The system SHALL support multiple languages via i18n-js with Expo Localization for device-level locale detection.

#### Scenario: Device Language Detection
- **WHEN** app launches
- **THEN** system reads device locale and loads corresponding language file

#### Scenario: Manual Language Switch
- **WHEN** user selects language in settings
- **THEN** app persists preference and reloads UI with selected language

#### Scenario: Fallback Language
- **WHEN** device locale not supported
- **THEN** system falls back to English (en) as default

### Requirement: Vietnamese & English Localization
The system SHALL provide complete translations for Vietnamese and English with proper naming conventions.

#### Scenario: Vietnamese Monthly Report
- **WHEN** app is set to Vietnamese
- **THEN** month names (Tháng 1, Tháng 2, etc.) display correctly

#### Scenario: English Navigation Labels
- **WHEN** app is set to English
- **THEN** navigation labels and screen titles appear in English

### Requirement: Right-to-Left (RTL) Support
The system SHALL support RTL languages with proper flex direction and text alignment handling.

#### Scenario: RTL Layout Direction
- **WHEN** RTL language is activated
- **THEN** layout direction reverses automatically (flex direction, text alignment, margins)

#### Scenario: RTL Text Rendering
- **WHEN** RTL text is displayed
- **THEN** text renders right-aligned with proper character ordering

### Requirement: String Key Organization
Translations SHALL be organized by feature with consistent key naming (dot notation).

#### Scenario: Translation Key Structure
- **WHEN** developer needs translation for home screen title
- **THEN** uses key `home.screen.title` to access structure `translation.home.screen.title`

#### Scenario: Component Translation
- **WHEN** Button component needs label
- **THEN** translates `common.button.submit` to fetch generic button labels

### Requirement: Date & Number Localization
The system SHALL format dates and numbers according to locale (e.g., DD/MM/YYYY for Vietnam, MM/DD/YYYY for US).

#### Scenario: Vietnamese Date Format
- **WHEN** displaying date in Vietnamese locale
- **THEN** date appears as DD/MM/YYYY (e.g., 15/04/2026)

#### Scenario: Number Formatting
- **WHEN** displaying number in Vietnamese locale
- **THEN** thousand separator is period: 1.000 instead of 1,000
