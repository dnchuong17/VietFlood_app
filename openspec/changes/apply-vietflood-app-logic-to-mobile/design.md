## Context

VietFlood_mobile is currently based on Ignite defaults and does not mirror the domain-first organization used by VietFlood_app. The migration must preserve mobile stability while introducing production behaviors for flood-response workflows, including authentication, role-based views, report handling, relief operations, and volunteer support. The migration spans navigation, state coordination, service boundaries, and offline handling, so the design must support phased delivery.

## Goals / Non-Goals

**Goals:**
- Establish a reusable module structure in VietFlood_mobile that maps clearly to VietFlood_app feature logic.
- Enable phased adoption so old and new flows can coexist while migration is in progress.
- Maintain equivalent business behavior for priority user journeys across auth, reporting, relief, and volunteer flows.
- Centralize service integration patterns for API, offline storage, and role/permission checks.

**Non-Goals:**
- Rewriting every UI component to visually match VietFlood_app.
- Immediate one-shot migration of all features in a single release.
- Introducing a new backend API contract as part of this change.

## Decisions

1. Introduce a feature-aligned module map inside VietFlood_mobile.
- Decision: Create feature modules aligned to VietFlood_app domains (auth, reports, relief, volunteer, profile/home) and expose stable interfaces per module.
- Rationale: Reduces translation overhead between projects and keeps behavior parity traceable.
- Alternative considered: Keep Ignite screen-first structure only and copy logic ad hoc; rejected because it increases duplication and regression risk.

2. Use an adapter layer between migrated logic and Ignite-era screens/navigation.
- Decision: Add compatibility wrappers so existing screens can call migrated domain services incrementally.
- Rationale: Allows phased rollout without breaking the current app shell.
- Alternative considered: Replace navigation and screen stack in one large cutover; rejected due to high release risk.

3. Standardize service contracts before feature-by-feature migration.
- Decision: Define mobile service interfaces for API, offline data, weather/location, and RBAC checks before moving dependent flows.
- Rationale: Prevents each feature from implementing its own transport and state assumptions.
- Alternative considered: Let each feature migrate with its own service logic and refactor later; rejected due to long-term inconsistency.

4. Migrate by vertical slices with parity checks.
- Decision: Move one end-to-end capability at a time (domain logic + routing + state + screen integration), then validate parity.
- Rationale: Keeps defects isolated and simplifies rollback.
- Alternative considered: Migrate all domain logic first and integrate UI later; rejected because behavior validation becomes delayed and harder.

## Risks / Trade-offs

- [Risk] Divergent behavior between migrated and legacy flows during transition. -> Mitigation: Gate migrated routes behind module-level toggles and test parity scenarios per slice.
- [Risk] Temporary duplication of code across old and new modules. -> Mitigation: Track replacement ownership in tasks and remove legacy paths after parity sign-off.
- [Risk] RBAC and offline behavior may be inconsistently applied by feature teams. -> Mitigation: Enforce shared service contracts and common guard utilities used by all migrated features.
- [Risk] Increased short-term complexity in navigation integration. -> Mitigation: Keep adapter boundaries explicit and document route ownership.

## Migration Plan

1. Define shared service and guard interfaces in VietFlood_mobile that mirror VietFlood_app behavior contracts.
2. Introduce feature module skeletons and adapter bridges for existing Ignite screens.
3. Migrate priority vertical slices (auth first, then reports/relief, then volunteer/profile-home) with parity tests after each slice.
4. Switch default routing to migrated flows for validated slices and keep rollback toggles for one release cycle.
5. Remove legacy adapters and redundant logic once all parity criteria are met.

## Open Questions

- Which specific VietFlood_app features are mandatory for the first mobile parity milestone versus later phases?
- Should rollout toggles be runtime-configurable or compile-time flags for release management?
- What minimum offline guarantee is required per feature (read-only cache, queued writes, or both) during phase one?
