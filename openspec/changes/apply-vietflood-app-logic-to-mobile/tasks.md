## 1. Migration Foundations

- [x] 1.1 Inventory VietFlood_app feature logic and map each auth, reports, relief, volunteer, and profile/home behavior to a target module location in VietFlood_mobile
- [x] 1.2 Create VietFlood_mobile feature module scaffolds and typed public interfaces aligned to the mapped domain boundaries
- [x] 1.3 Define shared service contracts for API access, offline operations, weather/location retrieval, and RBAC evaluation
- [x] 1.4 Implement adapter interfaces so existing Ignite-oriented routes/screens can call migrated modules without full route rewrites

## 2. Service and Guard Integration

- [x] 2.1 Implement shared API and persistence service implementations behind the new contracts in VietFlood_mobile
- [x] 2.2 Add common RBAC guard utilities and integrate them into protected route decisions
- [x] 2.3 Add shared error-handling pathways for network and backend failures across migrated features
- [x] 2.4 Implement offline fallback rules (cache or pending state handling) and surface consistent user-facing status states

## 3. Vertical Slice Migration

- [x] 3.1 Migrate authentication workflows (sign-in, role-based entry, protected route access) to the new module architecture
- [x] 3.2 Migrate reports workflows to shared services and parity-aligned feature logic
- [x] 3.3 Migrate relief workflows and integrate role-aware actions using shared guards
- [x] 3.4 Migrate volunteer plus profile/home workflows and wire them to standardized module interfaces

## 4. Rollout, Parity Validation, and Cleanup

- [x] 4.1 Add capability-level rollout toggles to enable migrated features independently
- [x] 4.2 Validate parity scenarios for each migrated capability against VietFlood_app behavior and document pass criteria
- [x] 4.3 Validate rollback behavior so any migrated capability can revert to legacy flow without app-wide impact
- [x] 4.4 Remove redundant legacy logic and adapters for capabilities that pass parity and stability gates
