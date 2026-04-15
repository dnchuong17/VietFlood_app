## Context

**Current State:**
- `/src`: NextJS web application (React, Next.js 15, TypeScript)
- `/src-rn`: React Native Expo 55 mobile application (React Native 0.84, TypeScript)
- Both implementations contain the complete feature set required for VietFlood
- Build pipelines: Next.js config (Vercel), EAS Build config for React Native
- Dependencies: Separate dependency trees, duplicated logic across frameworks

**Project Maturity:**
- React Native implementation complete through Session 5 (88/143 tasks = 61%)
- All core features implemented: auth, map, reports, permissions, offline-sync
- TypeScript compilation: 0 errors in both codebases
- Testing infrastructure: Device testing guides exist for React Native

**Stakeholders:**
- Mobile users: Benefit from native app distribution and device features
- Development team: Consolidated codebase simplifies maintenance
- CI/CD: Single build pipeline instead of parallel web/mobile

## Goals / Non-Goals

**Goals:**
- Establish React Native Expo as the sole platform in the project
- Remove all NextJS dependencies and configurations
- Relocate `/src-rn` to `/src` as the primary source tree
- Migrate build configuration (EAS Build as primary, remove Next.js config)
- Consolidate package.json scripts to React Native-only workflows
- Maintain all feature parity from the original NextJS implementation
- Preserve TypeScript type safety, zero compilation errors
- Remove or archive all web-focused documentation

**Non-Goals:**
- Web version support (breaking change - web will not be available)
- Backwards compatibility with existing Next.js infrastructure
- Dual-platform deployment (React Native only)
- Gradual migration window (full cutover)

## Decisions

| Decision | Choice | Rationale | Alternatives |
|----------|--------|-----------|--------------|
| **Directory Structure** | Move `/src-rn` → `/src`; keep `/src-rn` structure internally | React Native becomes primary; `/src` is standard convention | Keep both in parallel (increases maintenance) |
| **Component Patterns** | Retain React Native components + React Navigation | Proven architecture; 0 build errors; matches Expo best practices | Refactor to new component system (risk + time) |
| **Styling System** | Keep NativeWind 4.2 + Tailwind CSS | Already optimized; responsive hooks implemented | Switch to other styling libraries (no benefit) |
| **State Management** | Retain React Context + custom hooks | Lightweight, sufficient for app scope; avoids Redux complexity | Add Redux/Zustand (over-engineering) |
| **Build System** | EAS Build as primary; remove Next.js config | Native app distribution; CodePush support available | Keep Next.js for web (contradicts migration goal) |
| **TypeScript Strictness** | Maintain 0 errors, strict mode enabled | Existing codebase already adheres; preserve quality | Relax rules (introduces debt) |

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Feature Gap Discovery** | Unfound features in NextJS could break React Native | Run parallel testing on both versions; feature-by-feature audit before cutover; automated test suite |
| **Lost Web Analytics** | Existing web metrics unavailable | Export analytics before deprecation; recalibrate mobile metrics baseline |
| **User Disruption** | Existing web users lose access | Communicate migration timeline; provide app download link; offer in-app migration guide |
| **Build Pipeline Breakage** | Vercel/Next.js CI/CD becomes unusable | Document removal steps; update CI/CD configs; test final build before cutover |
| **Dependency Hell** | Conflicting transitive dependencies from both stacks | Run `npm audit` after cleanup; resolve conflicts incrementally |
| **Missing Device Features** | React Native may not support all web features | Maintain feature list; document platform limitations; provide fallback UX |

**Trade-offs Accepted:**
- Web platform removed entirely (acceptable per proposal)
- Vercel infrastructure becomes unused (cost savings)
- iOS/Android configuration complexity (acceptable for native features)

## Migration Plan

**Phase 1: Validation & Audit (Pre-Migration)**
1. Audit NextJS features against React Native implementation
2. Validate all core scenarios on device/simulator
3. Document any gaps between implementations
4. Create rollback snapshots of both `/src` and `/src-rn`

**Phase 2: File System Migration**
1. Backup entire project: `git commit --all -m "Pre-migration backup"`
2. Copy `/src-rn` → `/src` (complete structure)
3. Remove `/src-rn` directory
4. Verify directory structure integrity

**Phase 3: Configuration Cleanup**
1. Remove NextJS config files:
   - `next.config.ts`
   - `next-env.d.ts`
   - `next-pwa.d.ts`
   - Next.js specific entries in `tsconfig.json`
   - Next.js specific scripts from `package.json`
2. Consolidate `package.json`:
   - Remove web dependencies (next, vercel, etc.)
   - Keep only React Native/Expo dependencies
   - Update build/dev scripts to Expo-only commands
   - Clean dependency tree: `npm install && npm dedupe`
3. Archive web-specific docs to `/docs/archived/nextjs-web/`

**Phase 4: Build System Migration**
1. Verify EAS Build configuration in `eas.json`
2. Update CI/CD pipeline (GitHub Actions):
   - Remove Next.js deployment to Vercel
   - Update to EAS Build triggers
   - Add device testing pipeline (optional)
3. Test build on both Android and iOS via EAS

**Phase 5: Documentation & Cutover**
1. Update project README: mobile-only focus
2. Remove web-focused docs; consolidate to `/docs`
3. Run full test suite on emulator/device
4. Commit and tag: `v1.0.0-react-native-consolidated`

**Rollback Strategy:**
If critical issues found:
1. Revert to pre-migration commit
2. Isolate missing features
3. Implement fixes in React Native
4. Re-attempt migration

## Open Questions

1. **Analytics & Monitoring**: What analytics platform is currently tracking web usage? Should metrics be preserved or reset for mobile baseline?
2. **User Migration Path**: Are existing web users notified about the mobile-only shift? Should there be a transition period with deprecation warnings?
3. **Feature Parity Confidence**: Has every NextJS feature been tested on React Native? Are there edge cases to verify?
4. **CI/CD Environment**: What is the current Vercel/GitHub Actions configuration? Need detailed runbooks for each removal step.
5. **Compliance & Testing**: Are there accessibility standards (WCAG) that web version met but mobile version doesn't need to support?
