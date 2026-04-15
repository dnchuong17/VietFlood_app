## MODIFIED Requirements

### Requirement: Efficient flood marker clustering
The system SHALL group nearby flood markers into clusters when zoomed out to improve performance and readability.

#### Scenario: View map at regional zoom level
- **WHEN** user views map zoomed out showing entire region
- **THEN** nearby markers are automatically grouped into clusters
- **THEN** cluster icon shows count of contained markers
- **THEN** clusters render and update in under 500ms

#### Scenario: Zoom into cluster
- **WHEN** user zooms into a cluster
- **THEN** cluster expands to show individual markers
- **THEN** animation is smooth and responsive

#### Scenario: View cluster on mobile phone
- **WHEN** user views map on small mobile screen
- **THEN** clustering threshold adapts to screen size
- **THEN** touch targets for markers remain at least 44x44px

### Requirement: Map tile caching with TTL
The system SHALL cache map tiles locally with automatic expiration and refresh.

#### Scenario: Load map tiles
- **WHEN** user first loads map view
- **THEN** map tiles are cached locally
- **THEN** cache persists for 5 minutes (TTL)

#### Scenario: Return to map within cache window
- **WHEN** user leaves map and returns within 5 minutes
- **THEN** cached tiles load instantly
- **THEN** network request is avoided

#### Scenario: Cache expires
- **WHEN** user returns to map after 5+ minutes offline/idle
- **THEN** new tile request is made on next network access
- **THEN** old cached tiles display while new data loads

### Requirement: Mobile-optimized base map
The system SHALL use a base map style optimized for mobile devices and dark mode.

#### Scenario: Map loads in light mode
- **WHEN** map initializes in light theme
- **THEN** base map uses light colors appropriate for mobile
- **THEN** text and features remain legible on small screens

#### Scenario: Map loads in dark mode
- **WHEN** map initializes in dark theme
- **THEN** base map switches to dark color scheme
- **THEN** marker visibility and contrast remain high

### Requirement: Touch-friendly map controls
The system SHALL provide map interaction controls optimized for touch input.

#### Scenario: Pinch to zoom
- **WHEN** user performs pinch gesture on map
- **THEN** map smoothly zooms to pinch position
- **THEN** zoom is responsive without lag

#### Scenario: Two-finger tap to return to center
- **WHEN** user double-taps map area
- **THEN** map zooms in to that location
- **THEN** animation completes in under 300ms

#### Scenario: User location button
- **WHEN** user taps user location button
- **THEN** map centers on current device location
- **THEN** map animates smoothly to new center
