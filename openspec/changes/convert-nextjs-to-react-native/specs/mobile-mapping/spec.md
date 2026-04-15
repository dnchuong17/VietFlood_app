## ADDED Requirements

### Requirement: Interactive map display with multiple overlays

The app SHALL display a zoomable, pannable map with weather and flood data overlays (rain, wind, temperature, clouds, pressure, humidity).

#### Scenario: Map loads with default view
- **WHEN** user navigates to home screen with map
- **THEN** map displays Vietnam region with all enabled overlays visible

#### Scenario: User toggles overlay visibility
- **WHEN** user taps overlay toggle buttons (rain, wind, temp, clouds, pressure, rh)
- **THEN** selected overlay appears/disappears on map without reloading map tiles

#### Scenario: User zooms map
- **WHEN** user performs pinch-zoom gesture on map
- **THEN** map zooms in/out and overlays scale appropriately

### Requirement: Weather data from Windy API

The app SHALL fetch and display real-time weather data (wind, rain, temperature) from Windy API.

#### Scenario: Wind overlay loads
- **WHEN** wind overlay is enabled on map
- **THEN** app fetches wind data from Windy API and displays wind direction/speed as vector field

#### Scenario: Rain overlay loads
- **WHEN** rain overlay is enabled
- **THEN** app fetches precipitation data and displays as heatmap

#### Scenario: Real-time weather updates
- **WHEN** user has map open for extended period
- **THEN** app periodically refreshes weather data (every 15 minutes) without disrupting map interaction

### Requirement: Relief route visualization

The app SHALL display relief operation routes and waypoints on the map.

#### Scenario: Relief routes displayed
- **WHEN** relief workers view relief operations dashboard with map
- **THEN** app loads relief routes from backend and displays as polylines with color coding by status

#### Scenario: Route detail on tap
- **WHEN** user taps on relief route polyline
- **THEN** app displays route details (start/end locations, status, assigned team)

### Requirement: Marker clustering for large datasets

The app SHALL cluster multiple markers (reports, routes) when zoomed out to prevent map clutter.

#### Scenario: Markers cluster at low zoom
- **WHEN** user zooms out on map with many report markers
- **THEN** nearby markers combine into cluster showing count, reducing visual clutter

#### Scenario: Cluster explodes on zoom
- **WHEN** user zooms in on clustered area
- **THEN** cluster breaks apart showing individual markers

### Requirement: User location tracking (optional/future)

The app SHALL request permission and display user's current location on map.

#### Scenario: Location button tapped
- **WHEN** user taps "current location" button
- **THEN** app requests location permission (first time), gets device location, zooms map to current position

#### Scenario: Permission denied
- **WHEN** user denies location permission
- **THEN** app displays message explaining why location is needed for certain features
