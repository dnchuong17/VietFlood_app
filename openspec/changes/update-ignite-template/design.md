## Context

VietFlood has reached 60% completion with a solid React Native foundation (RN 0.84, Expo 55, React Navigation 7, TypeScript). The project uses Context API for state management and has a basic component structure. Ignite represents 9+ years of battle-tested patterns from Infinite Red and the React Native community. The goal is to modernize the architecture while preserving existing domain logic and complting the remaining 40% of features more efficiently.

**Current State:**
- Custom context-based state management (home, auth, user states)
- Manual screen scaffolding patterns
- Basic component library without formalized theming
- Jest testing only; no E2E testing framework
- Limited CLI tooling for consistency

**Stakeholders:**
- Development team (needs clearer patterns and generators)
- Code maintainers (needs predictable architecture)
- QA/Testing (needs E2E framework)
- Future contributors (needs industry-standard practices)

## Goals / Non-Goals

**Goals:**

- Establish Ignite-aligned architecture that reduces cognitive load on new contributors
- Introduce MobX-State-Tree for type-safe, predictable state management with minimal boilerplate
- Create CLI generators for screens, models, and components to ensure consistency
- Implement Maestro E2E testing framework for critical user workflows (emergency reporting, relief operations)
- Migrate existing Context-based state to MST models in phases (auth first, then operations)
- Improve code quality with dependency-cruiser and standardized ESLint/Prettier configuration
- Add i18n support (Expo Localization) for potential multi-language expansion and RTL support
- Establish consistent Reanimated animation patterns for common transitions and gestures

**Non-Goals:**

- Complete rewrite of existing components (preserve working code, refactor incrementally)
- Build custom design tokens (use NativeWind effectively with Tailwind)
- Replace React Navigation (keep v7 navigation structure, enhance deep-linking)
- Implement server-side rendering or web-specific features (mobile-first)
- Multi-team scaling infrastructure (focused on single team efficiency)

## Decisions

### 1. State Management Migration Strategy

**Decision:** Migrate to MobX-State-Tree (MST) in phases: auth → core operations → analytics

**Rationale:** MST provides strong typing, immutability patterns, and snapshots that align with RN best practices. Phased migration reduces risk and allows parallel work on features.

**Alternatives Considered:**
- **Zustand**: Simpler but fewer types benefits; MST still better for complex domain models (relief operations, resource tracking)
- **Redux**: More boilerplate; MST is leaner while equally powerful
- **TanStack Query**: Excellent for server state but doesn't cover client-side app state

### 2. Folder Structure Alignment

**Decision:** Reorganize src/ to: `services/` → `models/` → `features/` → `components/` hierarchy per Ignite patterns

**Rationale:** Separates concerns: Infrastructure (services) → Domain (models) → UI (features) → Reusable (components). Matches Ignite convention, easier to scale.

**Alternatives Considered:**
- **Feature-first structure**: Works but complicates shared services and models across features
- **Flat structure**: Current approach; harder to navigate as project grows

### 3. CLI Generator Framework

**Decision:** Use Ignite's ERN (Emotion React Native) generator patterns to scaffold models, screens, and components

**Rationale:** Reduces manual scaffolding errors, ensures naming consistency, accelerates feature development

**Alternatives Considered:**
- **Manual patterns**: No consistency; time-consuming for new screens
- **Yeoman generators**: Possible but Ignite pattern is proven in production

### 4. Component Library & Design Tokens

**Decision:** Adopt Ignite's DDS (Design System) components pattern with NativeWind + custom design tokens in Tailwind config

**Rationale:** NativeWind already in use; DDS components reduce duplication and ensure accessibility. Design tokens centralize theming.

**Alternatives Considered:**
- **External component library**: Added dependency; Ignite's custom approach works better for custom designs
- **Styled Components**: Higher runtime cost; Tailwind + NativeWind more performant on RN

### 5. E2E Testing Framework

**Decision:** Integrate Maestro (alongside Jest) for mobile-specific E2E testing of critical flows

**Rationale:** Jest handles unit/component tests; Maestro excels at user workflows (filling forms, navigation, permissions). Maestro is CI/CD-friendly and device-farm compatible.

**Alternatives Considered:**
- **Detox**: More powerful but heavier setup; Maestro sufficient for current needs
- **Appium**: Overly complex for RN; Maestro better integrated

### 6. Dependency Graph Validation

**Decision:** Add dependency-cruiser to enforce architecture rules (services can't import features, etc.)

**Rationale:** As the codebase scales, accidental circular dependencies or layer violations are common. dependency-cruiser catches these in CI.

**Alternatives Considered:**
- **ESLint plugins**: Limited to file paths; dependency-cruiser handles full dependency trees
- **Manual code review**: Doesn't scale; automation is essential

### 7. Localization Strategy

**Decision:** Use Expo Localization + i18n-js for multi-language support with RTL-ready structure

**Rationale:** Ignite's proven i18n approach; Expo Localization handles device locale detection; RTL support built in for regional expansion.

**Alternatives Considered:**
- **react-i18next**: Overkill; i18n-js simpler and lighter weight for RN
- **Custom locale system**: Possible but less battle-tested

### 8. Animation Patterns

**Decision:** Establish Reanimated v4 patterns for common transitions (screen push, bottom sheet) and gestures

**Rationale:** Already in dependencies; Ignite's patterns are proven. Rejects ad-hoc animations.

**Alternatives Considered:**
- **LayoutAnimation**: Uses native thread; doesn't support complex gestures
- **No standardization**: Current code has mixed animation approaches

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **MST learning curve** | Developers unfamiliar with model-based state | Provide MST examples in docs; start with auth model |
| **Phased migration creates dual patterns** | Temporary inconsistency (Context + MST) | Document explicitly which features use which; remove pattern after migration |
| **Dependency-cruiser breakage** | CI might fail on existing violations | Run with relaxed rules initially; enforce in PR review process |
| **Breaking navigation changes** | Existing deep-links may fail during migration | Maintain old deep-link format alongside new one for backward compatibility |
| **Maestro maintenance** | Maestro tests can be fragile if UI labels change | Prioritize `testID` attributes; keep tests stable |
| **Increased bundle size** | MST + generators + i18n add ~80KB | Mitigated by better tree-shaking; async chunk loading where possible |
| **Interruption during migration** | Switching contexts mid-development slows velocity | Phase work clearly; dedicate sprint to completev MST auth migration |

## Migration Plan

### Phase 1: Setup & Scaffolding (Week 1)
1. Install MST, date-fns, react-native-keyboard-controller, i18n-js, dependency-cruiser
2. Create services/ → models/ → features/ folder structure
3. Configure ESLint with import sorting, dependency-cruiser rules
4. Create generator templates for screens/models/components

### Phase 2: Auth State Migration (Week 2–3)
1. Create MST auth model (user, token, permissions)
2. Replace useAuth hook with MST-based hook
3. Update LoginScreen, RegisterScreen to use new model
4. Add Maestro tests for login flow

### Phase 3: Core Operations State (Week 4–5)
1. Create MST models: relief operations, resource tracking, team members
2. Migrate ReliefDashboardScreen, OperationDetailScreen to MST
3. Add Maestro tests for operation workflows

### Phase 4: CLI Generators & Docs (Week 6)
1. Create npm script generators for screens/models
2. Document new patterns in CONTRIBUTING.md
3. Migrate analytics and profile features to MST

### Phase 5: E2E Testing & Polish (Week 7–8)
1. Add Maestro tests for critical flows: create report, join relief operation, assign resource
2. Run dependency-cruiser in CI
3. Add i18n placeholders for future localization

### Rollback Strategy
- MST models are JSON-serializable (use `getSnapshot()`)
- Keep Context layer in parallel during Phase 2–3
- Tag releases; revert to previous if critical issues discovered

## Open Questions

1. **i18n Rollout**: Should we enable locale switching in Phase 5 or defer to later release?
2. **Component Library**: Any existing color palette or design tokens to preserve from current implementation?
3. **Deep-linking**: What depth of deep-link support is required? (e.g., nested operations, specific report views)
4. **MST DevTools**: Should we integrate Reactotron + MST plugin for debugging in development builds?
5. **Code splitting**: Should we lazy-load models for non-critical features (analytics)?
