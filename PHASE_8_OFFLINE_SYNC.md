# Phase 8: Offline & Sync Verification

**Status**: In Progress  
**Target**: Ensure app functions in offline mode and syncs when reconnected  
**Completed Tasks**: 0/6

## Architecture Overview

The offline-first architecture uses:
- **AsyncStorage** - Local data persistence (reports, operations, user data)
- **Polling Service** - Real-time data synchronization
- **API Client Retry Logic** - Exponential backoff with queue management
- **Network State Monitoring** - Detect connectivity changes

## Tasks to Complete

### 8.1 Offline Data Storage Configuration
**Objective**: Set up AsyncStorage for all critical data without internet

**Implementation Plan**:
```typescript
// Data to persist in AsyncStorage:
- User authentication tokens (secure storage preferred)
- Last sync timestamp for each data type
- Local copy of reports (all user's reports)
- Local copy of operations (visible to user's role)
- User profile information
- Settings and preferences
```

**For each feature**:
- Reports: Store locally, sync on reconnect with `POST /reports/sync` endpoint
- Operations: Cache in storage, verify updates on reconnect
- User profile: Cache, update on reconnect if modified locally
- Settings: Full local storage

**Verification Criteria**:
- [ ] App loads without internet after first successful login
- [ ] All cached data displays normally in offline mode
- [ ] User can create reports offline (queued for sync)
- [ ] All features gracefully degrade with indicator "offline mode"

---

### 8.2 Offline UI Indicators & State Management
**Objective**: Show users when app is in offline mode

**Implementation**:
```typescript
// Create OfflineContext with:
- isOnline: boolean (via NetInfo or @react-native-community/netinfo)
- lastSyncTime: Date | null
- pendingSyncCount: number
- showOfflineIndicator: boolean toggle

// Display offline banner:
- Red banner at top when offline
- Gray banner showing "Last synced: X minutes ago" when online
- SyncNow button to manually trigger sync
```

**Components to Modify**:
- Add OfflineProvider in app.tsx
- Add offline indicator in HomeScreen
- Add contextual warnings in ReportCreationScreen ("Will sync when online")
- Add sync status in SettingsScreen

**Verification Criteria**:
- [ ] Offline banner appears when connectivity lost
- [ ] Banner disappears when connectivity restored
- [ ] Last sync timestamp displays accurately

---

### 8.3 Sync Conflict Resolution
**Objective**: Handle cases where user and server modify same data

**Scenarios to Handle**:
1. User creates report offline, server has conflicting data
   → **Resolution**: Use client timestamp, server wins on conflict
2. User edits existing report offline, operation completes on server
   → **Resolution**: Show "Report already completed" warning
3. Operation status changes offline before server knows
   → **Resolution**: Refresh from server, show "Status has changed" notification

**Implementation**:
```typescript
// Create SyncManager with:
- getLastModified(entityType: string, entityId: string): Date
- compareVersions(local: Entity, server: Entity): ConflictResolution
- resolveSyncConflict(local: Entity, server: Entity): Entity
```

**Verification Criteria**:
- [ ] Sync handles data conflicts gracefully
- [ ] User is notified of conflicts, not silently overwritten
- [ ] Conflict resolution is deterministic and fair
- [ ] No data loss in any scenario

---

### 8.4 Request Queue Management for Offline Actions
**Objective**: Queue and retry API requests that fail due to offline state

**Queue System**:
```typescript
// Create RequestQueue for:
- Storing failed POST/PATCH/DELETE requests
- Retrying with exponential backoff (1s, 2s, 4s, 8s, 16s)
- Deduplicating identical requests
- Persisting queue to AsyncStorage (survive app restart)
- Executing queued requests when online

// Priority levels:
1. Critical: Auth, emergency SOS
2. High: Report creation, operation updates
3. Normal: Profile updates, preference changes
```

**Endpoint Requirements**:
- Need: `POST /sync/batch` endpoint to send multiple queued requests
- Fallback: Individual retry for each request type

**Verification Criteria**:
- [ ] All queued requests retry when connectivity restored
- [ ] Queue survives app restart
- [ ] No duplicate requests sent
- [ ] Requests expire after 24 hours if still pending

---

### 8.5 Real-time Polling During Online Mode
**Objective**: Keep local data synchronized with server

**Current Implementation**: `usePolling` hook already exists
- HomeScreen: Polls every 30s for operations/reports
- ReportDetailScreen: Polls every 15s for comments and updates  
- OperationDetailScreen: Polls every 20s for active operations

**Enhancements**:
- [ ] Reduce polling when not visible (app backgrounded)
- [ ] Stop polling when offline, resume when online
- [ ] Implement exponential backoff on repeated failures
- [ ] Add jitter to prevent thundering herd

**Sync Endpoints to Implement**:
```typescript
GET /reports/sync         // Get updated reports since X timestamp
GET /operations/sync      // Get updated operations since X timestamp
POST /sync/batch          // Send multiple queued requests atomically
```

**Verification Criteria**:
- [ ] Data syncs within 30s when online
- [ ] Polling stops politely when offline
- [ ] No excessive battery drain from polling
- [ ] Server load reasonable with concurrent polling

---

### 8.6 Testing Offline Scenarios
**Objective**: Verify app behavior in various connectivity conditions

**Test Scenarios**:

#### Scenario 1: Complete Offline
- [ ] Close app
- [ ] Disable network (airplane mode)
- [ ] Launch app, verify loads cached data
- [ ] Create 3 reports
- [ ] Try to submit - queued locally
- [ ] Show offline indicator

#### Scenario 2: Intermittent Connectivity
- [ ] Toggle airplane mode 5 times
- [ ] Each time verify "syncing..." appears or disappears  
- [ ] Confirm queued actions process when online
- [ ] No error messages for toggle events

#### Scenario 3: Long Offline Duration (24h+)
- [ ] Go offline
- [ ] Wait 25 hours (or simulate with clock manipulation)
- [ ] Come online
- [ ] Verify old requests are expired/removed
- [ ] New sync attempts clean up old queue

#### Scenario 4: Sync After Long Offline
- [ ] Go offline for 2 hours  
- [ ] Create 5 reports offline
- [ ] Create 3 operations (if authorized)
- [ ] Come online
- [ ] All 8 items sync within 60s
- [ ] No duplicates in system
- [ ] Verify server storage has all items

#### Scenario 5: Conflict During Sync
- [ ] Go offline, create Report A  
- [ ] Enable connectivity
- [ ] WHILE syncing: user sees "newer version exists"
- [ ] User can choose: keep local or use server version

**Test Devices/Conditions**:
- [ ] Android emulator (simulate network toggle)
- [ ] iOS simulator (simulate network toggle)
- [ ] Real Android device (airplane mode on/off)
- [ ] Real iOS device (airplane mode on/off)
- [ ] WiFi on/off transitions
- [ ] 4G to WiFi transitions
- [ ] Slow network (simulated 2G/3G)

**Performance Benchmarks**:
- [ ] Offline first-load time: < 2s
- [ ] Sync 10 pending requests: < 10s on 4G
- [ ] Sync 10 pending requests: < 30s on 3G
- [ ] App memory overhead: < 50MB additional

**Verification Criteria**:
- [ ] Pass all 5 scenarios without errors
- [ ] All benchmarks met
- [ ] No user data loss in any scenario
- [ ] Graceful error handling for all edge cases

---

## Summary Status

| Task | Status | Estimated Effort |
|------|--------|-----------------|
| 8.1 AsyncStorage Setup | 📋 Pending | 2-3 hours |
| 8.2 Offline UI Indicators | 📋 Pending | 1-2 hours |
| 8.3 Sync Conflict Resolution | 📋 Pending | 2-3 hours |
| 8.4 Request Queue Management | 📋 Pending | 3-4 hours |
| 8.5 Real-time Polling | 📋 Pending | 1-2 hours |
| 8.6 Offline Testing | 📋 Pending | 4-6 hours |

**Total Phase 8 Effort**: ~13-20 hours  
**Phase Priority**: Medium (post-MVP, important for production)  
**Can Ship MVP Without**: Yes, but offline support crucial for disaster relief app

---

## Implementation Notes

**Use Existing Infrastructure**:
- RefreshContext (already exists for polling)
- apiClient error handling (already has retry logic)
- AsyncStorage (already integrated)

**New Core Utilities Needed**:
- OfflineContext & OfflineProvider
- SyncManager service
- RequestQueue service
- ConflictResolver utility

**Endpoints to Add to Backend** (if not existing):
- `GET /reports/sync?since=ISO8601_TIMESTAMP`
- `GET /operations/sync?since=ISO8601_TIMESTAMP`
- `POST /sync/batch` - accept array of requests

---

## Next Phase
→ Phase 9: Device Testing (includes offline testing on real devices)  
→ Phase 10: Final Verification & Release
