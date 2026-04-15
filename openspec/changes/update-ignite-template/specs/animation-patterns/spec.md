## ADDED Requirements

### Requirement: Standardized Screen Transitions
The system SHALL implement consistent Reanimated v4 animations for screen push/pop and modal entrance/exit.

#### Scenario: Screen Push Animation
- **WHEN** user navigates to detail screen
- **THEN** screen slides in from right with fade-in over 300ms

#### Scenario: Screen Pop Animation
- **WHEN** user navigates back
- **THEN** current screen slides out to right while previous screen fades to full opacity

#### Scenario: Modal Entrance
- **WHEN** modal opens
- **THEN** modal slides up from bottom with scaleY animation

#### Scenario: Modal Exit
- **WHEN** user dismisses modal
- **THEN** modal slides down with scaleY animation

### Requirement: Gesture-Based Animations
The system SHALL use pan gestures for interactive animations (bottom sheet drag, swipe to dismiss).

#### Scenario: Bottom Sheet Pan
- **WHEN** user drags bottom sheet upward
- **THEN** sheet follows finger with smooth Reanimated driven animation

#### Scenario: Swipe to Dismiss
- **WHEN** user swipes card horizontally
- **THEN** card follows swipe momentum and dismisses when velocity exceeds threshold

### Requirement: Animation Performance
Animations SHALL run on native thread and be measurable for performance (60 FPS target).

#### Scenario: Native Driver Execution
- **WHEN** animation is triggered
- **THEN** system uses Reanimated native driver (not JS thread) to maintain 60 FPS

#### Scenario: Animation Metrics
- **WHEN** app runs in performance profiler
- **THEN** animations maintain consistent 60 FPS without frame drops

### Requirement: Animation Configuration
The system SHALL expose reusable animation configs (duration, easing) for consistency.

#### Scenario: Preset Animation Timing
- **WHEN** developer imports animation utility
- **THEN** accesses `ANIMATION_TIMING.screenPush` (300ms), `ANIMATION_TIMING.modal` (250ms)

#### Scenario: Custom Easing
- **WHEN** animation requires custom easing
- **THEN** developer uses Reanimated `Easing.bezier()` within standardized configs

### Requirement: Reduced Motion Support
The system SHALL respect device accessibility setting to disable animations for users who request reduced motion.

#### Scenario: Reduced Motion Enabled
- **WHEN** user enables "Reduce Motion" in device accessibility settings
- **THEN** animations run instantly (duration 0ms) instead of animated transitions
