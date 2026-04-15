## ADDED Requirements

### Requirement: Design Token System
The system SHALL define centralized design tokens (colors, spacing, typography) in Tailwind config for consistency.

#### Scenario: Token-Based Colors
- **WHEN** component uses `className="bg-primary"`
- **THEN** color resolves from design token system (e.g., primary: #007AFF)

#### Scenario: Dark Mode Tokens
- **WHEN** dark mode is active
- **THEN** color tokens automatically resolve to dark variants (e.g., primary: #0A84FF)

#### Scenario: Responsive Spacing
- **WHEN** component uses `className="px-4 md:px-6"`
- **THEN** spacing applies base spacing on mobile, increased spacing on larger screens

### Requirement: NativeWind Integration
The system SHALL extend NativeWind with custom style utilities while maintaining Tailwind compatibility.

#### Scenario: Custom Utilities
- **WHEN** component uses `className="safe-top"`
- **THEN** custom utility applies safe area-aware top padding

#### Scenario: Type-Safe Classes
- **WHEN** developer uses className
- **THEN** TypeScript provides autocomplete for all available Tailwind + custom classes (with types)

### Requirement: Component Styling Patterns
Components SHALL use Tailwind classes with variant composition for consistency.

#### Scenario: Component Variants
- **WHEN** Button component receives `variant="primary"`
- **THEN** component applies predefined variant class composition from Tailwind

#### Scenario: Conditional Styling
- **WHEN** component is disabled
- **THEN** opacity and cursor styles automatically apply via Tailwind state classes

### Requirement: Dynamic Theming
The system SHALL support switching between light and dark themes without page reload.

#### Scenario: Theme Switch
- **WHEN** user toggles dark mode in settings
- **THEN** app updates root theme class and all components re-render with new colors

#### Scenario: Theme Persistence
- **WHEN** theme is changed
- **THEN** preference persists to device storage and applies on next launch

### Requirement: Responsive Design System
The system SHALL define standardized breakpoints and responsive utilities for multi-device support.

#### Scenario: Mobile Layout
- **WHEN** screen width is xs (375px)
- **THEN** layout uses single column, large touch targets

#### Scenario: Tablet Layout
- **WHEN** screen width is md (768px)
- **THEN** layout uses multi-column grid with sidebar navigation
