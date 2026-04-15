## ADDED Requirements

### Requirement: Maestro Test Setup
The system SHALL integrate Maestro as the E2E testing framework for mobile user workflows with CI/CD integration.

#### Scenario: Run Maestro Locally
- **WHEN** developer runs `maestro test my-flow.yaml`
- **THEN** Maestro executes the flow against running app simulator

#### Scenario: CI Pipeline Integration
- **WHEN** code is pushed to main branch
- **THEN** CI runs Maestro tests against released build APK/IPA

### Requirement: Critical Flow Tests
The system SHALL define Maestro flows for critical user paths: emergency reporting, relief operation dashboard, resource assignment.

#### Scenario: Emergency Report Creation Flow
- **WHEN** user navigates to Create Report and fills form
- **THEN** Maestro test validates each step: field focus, input entry, form submission

#### Scenario: Relief Operation Join
- **WHEN** volunteer joins relief operation
- **THEN** test verifies UI updates, confirmation dialog appears, operation now shows in dashboard

#### Scenario: Resource Assignment
- **WHEN** coordinator assigns resource to team member
- **THEN** Maestro confirms assignment, real-time update received, team view refreshes

### Requirement: Test Stabilization
Tests SHALL use `testID` attributes and explicit waits to avoid flakiness related to animation timing.

#### Scenario: Wait for Element
- **WHEN** Maestro looks for element
- **THEN** uses `{id: 'testID'}` selector rather than text matching when possible

#### Scenario: Animation Completion
- **WHEN** screen transition completes
- **THEN** test uses explicit wait before next action to account for animation duration

### Requirement: Maestro Reporting
The system SHALL generate test reports showing pass/fail results with video recordings of failures.

#### Scenario: Test Report Generation
- **WHEN** Maestro tests complete
- **THEN** system generates HTML report with summary, individual test results, and video artifacts

#### Scenario: Failure Video
- **WHEN** test fails
- **THEN** video recording captures exact moment of failure for debugging
