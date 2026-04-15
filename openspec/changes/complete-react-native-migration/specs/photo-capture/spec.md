## MODIFIED Requirements

### Requirement: Native camera capture
The system SHALL provide native camera interface for capturing photos of flood events.

#### Scenario: Launch camera
- **WHEN** user taps "Capture Photo" in report creation
- **THEN** native camera interface opens
- **THEN** camera permission request appears if not granted

#### Scenario: Capture photo
- **WHEN** user frames subject and taps capture button
- **THEN** photo is captured with device camera
- **THEN** preview appears before confirming

#### Scenario: Camera not available
- **WHEN** device has no camera
- **THEN** system gracefully disables camera option
- **THEN** photo picker alternative is available

### Requirement: Photo preview and confirmation
The system SHALL display captured photo for review before attachment.

#### Scenario: Review captured photo
- **WHEN** photo is captured
- **THEN** full-screen preview is displayed
- **THEN** user can accept or retake

#### Scenario: Retake photo
- **WHEN** user taps "Retake" on preview
- **THEN** camera view returns for another attempt
- **THEN** previously captured photo is discarded

### Requirement: Image optimization and compression
The system SHALL compress captured photos for efficient storage and upload.

#### Scenario: Compress photo before upload
- **WHEN** user confirms photo capture
- **THEN** photo is compressed to max 2MB without visible quality loss
- **THEN** EXIF metadata is preserved for geolocation

#### Scenario: Handle high-resolution photos
- **WHEN** device captures photo at 12+ megapixel
- **THEN** photo is intelligently scaled down
- **THEN** compression maintains 85% JPG quality

### Requirement: Geolocation tagging
The system SHALL automatically tag captured photos with GPS coordinates.

#### Scenario: Auto-tag photo location
- **WHEN** user captures photo with location permission granted
- **THEN** photo EXIF metadata includes GPS coordinates
- **THEN** coordinates match current device location

#### Scenario: Location permission denied
- **WHEN** user captures photo without location permission
- **THEN** photo is still captured without geotag
- **THEN** user can manually indicate location in form

### Requirement: Photo gallery access
The system SHALL allow users to select existing photos from device library.

#### Scenario: Browse photo library
- **WHEN** user taps "Choose from Gallery"
- **THEN** device photo library picker opens
- **THEN** user can browse and select photo

#### Scenario: Import selected photo
- **WHEN** user selects photo from library
- **THEN** selected photo is shown preview
- **THEN** photo can be attached to report
