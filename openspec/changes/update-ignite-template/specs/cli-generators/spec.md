## ADDED Requirements

### Requirement: Screen Generator
The system SHALL provide a CLI command to generate new screen scaffolds with file structure, navigation integration, and TypeScript boilerplate.

#### Scenario: Generate Relief Screen
- **WHEN** developer runs `npm run generate:screen ReliefOperations --folder relief`
- **THEN** system creates ReliefOperationsScreen.tsx, hooks placeholder, and integration in navigation

#### Scenario: Generated Component Structure
- **WHEN** screen is generated
- **THEN** file includes proper TypeScript types, React.FC wrapper, and navigation props typed correctly

### Requirement: Model Generator
The system SHALL provide a CLI command to scaffold MST models with initial properties, actions, and default state.

#### Scenario: Generate Operation Model
- **WHEN** developer runs `npm run generate:model Operation`
- **THEN** system creates operation.ts with MST model types, sample actions (create, update), and exports

#### Scenario: Model with Relationships
- **WHEN** model has relationships (e.g., Operation has multiple Resources)
- **THEN** generator scaffolds proper MST references and array handling

### Requirement: Component Generator
The system SHALL auto-generate reusable component boilerplate with proper prop typing, test file, and storybook entry.

#### Scenario: Functional Component Creation
- **WHEN** developer runs `npm run generate:component OperationCard`
- **THEN** system creates OperationCard.tsx with destructured props, TypeScript interface, and export

#### Scenario: Component with Variants
- **WHEN** generator includes `--variants`
- **THEN** generated component includes variant prop and usage examples

### Requirement: Naming Consistency
The CLI generators SHALL enforce Ignite-compatible naming conventions (PascalCase components, camelCase functions, kebab-case files).

#### Scenario: Auto-Corrected Naming
- **WHEN** developer provides mixed-case name `reliefAPI`
- **THEN** generator converts to camelCase for functions and creates relief-api.ts filename
