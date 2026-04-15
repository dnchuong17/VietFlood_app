## ADDED Requirements

### Requirement: Tailwind-like utility styling system

The app SHALL support utility-based styling similar to Tailwind CSS using NativeWind, eliminating manual StyleSheet definitions for common spacing, sizing, and layout patterns.

#### Scenario: Component uses flex utilities
- **WHEN** component applies `className="flex flex-row gap-4"` via NativeWind
- **THEN** component renders with flex layout, row direction, and 16pt gap between children

#### Scenario: Component uses padding utilities
- **WHEN** component applies `className="p-4 px-2"`
- **THEN** component renders with 16pt padding on all sides, overridden to 8pt on horizontal

#### Scenario: Component uses responsive utilities
- **WHEN** component applies `className="w-full md:w-1/2"` resizing happens
- **THEN** component renders full width on small screens, half-width on larger screens

### Requirement: Color system with CSS variables

The app SHALL inherit color scheme from Tailwind theme with CSS variables (slate-based theme matching Next.js design).

#### Scenario: Text color applied
- **WHEN** component uses `className="text-slate-900"`
- **THEN** text renders in dark slate color (matching Next.js design)

#### Scenario: Background color applied
- **WHEN** component uses `className="bg-slate-100"`
- **THEN** background renders in light slate (matching Next.js design)

### Requirement: Border and shadow styling

The app SHALL support border radius, borders, and elevation/shadow properties via utilities.

#### Scenario: Rounded corners
- **WHEN** component applies `className="rounded-lg"`
- **THEN** component renders with 8pt border radius

#### Scenario: Shadow on cards
- **WHEN** card component applies `className="shadow-lg"`
- **THEN** card renders with elevated shadow (iOS shadowColor/Offset, Android elevation)

### Requirement: Dark mode support

The app SHALL support switching between light and dark color schemes via theme context.

#### Scenario: Dark mode toggle
- **WHEN** user toggles dark mode in app settings
- **THEN** all components re-render with dark color scheme utilities

#### Scenario: System preference respected
- **WHEN** app launches for first time
- **THEN** theme matches device system appearance (iOS/Android preference)
