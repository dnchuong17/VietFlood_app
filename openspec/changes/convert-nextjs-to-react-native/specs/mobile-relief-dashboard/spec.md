## ADDED Requirements

### Requirement: Relief operations dashboard

The app SHALL display relief operations with status, team assignments, and resource tracking for authorized relief workers.

#### Scenario: Dashboard loads operations list
- **WHEN** relief worker opens relief dashboard
- **THEN** app displays card-based list of active relief operations with status (active, completed, cancelled)

#### Scenario: Operation detail with map
- **WHEN** relief worker taps operation card
- **THEN** app navigates to detail screen showing operation map overlay, team members, assigned routes, and resource status

#### Scenario: Update operation status
- **WHEN** relief worker taps status update button
- **THEN** app displays status picker (active, completed, paused) and sends update to backend

### Requirement: Relief team visibility

The app SHALL show team members assigned to each relief operation.

#### Scenario: Team members list
- **WHEN** relief worker views operation detail
- **THEN** app displays team members with names, contact info (for in-app messaging in phase 2)

#### Scenario: Add team member
- **WHEN** relief coordinator taps "add team member" button
- **THEN** app displays picker to select available relief workers and sends assignment to backend

### Requirement: Resource tracking

The app SHALL track resources (supplies, vehicles, personnel) allocated to relief operations.

#### Scenario: Resource status view
- **WHEN** relief coordinator opens resource tracking section
- **THEN** app displays inventory of available resources and resource allocation to active operations

#### Scenario: Update resource allocation
- **WHEN** coordinator updates quantities
- **THEN** app sends update to backend and reflects allocation changes across operations

### Requirement: Relief route visualization

The app SHALL display assigned relief routes on map with turn-by-turn directions.

#### Scenario: Route on map
- **WHEN** relief worker views route assigned to their team
- **THEN** app displays route as polyline on map with start/end points and waypoints

#### Scenario: Route details modal
- **WHEN** worker taps on route
- **THEN** app displays additional info: distance, estimated time, current progress, and next waypoint

### Requirement: Real-time operation updates

The app SHALL receive and display updates to operations without requiring manual refresh.

#### Scenario: Operation status changed by another user
- **WHEN** another relief worker updates operation status
- **THEN** current user's app updates showing new status and updated timestamp without manual refresh
