/**
 * Offline Testing Guide and Test Scenarios
 * 
 * This document outlines all test scenarios for offline functionality in Phase 8
 */

# Phase 8: Offline & Sync Testing Guide

## Prerequisites for Testing

### Setup Requirements
- Android emulator or iOS simulator with network control capabilities
- Real device (Android/iOS) for bonus testing
- Test account on backend API
- Pre-loaded data or ability to create test data
- ~2 hours for complete testing

### Network Simulation Tools
- **Android Emulator**: Built-in network throttling via extended controls
- **iOS Simulator**: Network link conditioner or Xcode settings
- **Real Device (Android)**: Developer settings → Network throttling
- **Real Device (iOS)**: Settings → Developer → Network throttling (if available)

---

## Test Scenario 1: Complete Offline Mode

### Objective
Verify app loads and functions entirely without internet after first login

### Prerequisites
- [ ] User logged in with cached data
- [ ] At least 3 reports visible in cache
- [ ] At least 2 operations visible (if authorized)

### Test Steps

```
1. Close app completely
2. Enable Airplane Mode (disable all network)
3. Launch app
4. Wait 3 seconds for data load
5. Navigate to each screen:
   - Home: Should show cached stats
   - Reports: Should show cached reports
   - Relief (if available): Should show cached operations
   - Profile: Should show cached user profile
6. Try to create a new report:
   - Fill in all required fields
   - Select location (use last known location or pre-set)
   - Click "Create Report"
7. Observe: Report appears immediately, offline banner shown
8. Try to modify the report (if edit available)
9. Observe: Changes saved locally, offline banner shows "1 pending change"
```

### Success Criteria
- [ ] App fully loads from cache within 2 seconds
- [ ] All cached data displays normally
- [ ] No crash or error messages on any screen
- [ ] Offline banner visible at top of screen
- [ ] Offline banner text: "Offline mode - changes will sync when online"
- [ ] Create report works, shows "Sync when online" confirmation
- [ ] No network requests made (verify via proxy/monitoring tool)
- [ ] All pending changes queued locally
- [ ] App memory: < 50MB overhead

### Expected Behavior
```
Offline Banner State:
- Color: Red background
- Text: "Offline mode - changes will sync when online"
- Sync Button: Shows "Sync" (disabled if offline)
- Pending Count: Shows queued changes

Report Creation:
- Button still active
- Form accepts input
- Location uses last known or cached
- Submit succeeds immediately (optimistic)
- Changes stored in AsyncStorage
```

---

## Test Scenario 2: Intermittent Connectivity

### Objective
Verify app gracefully handles rapid network state changes

### Prerequisites
- [ ] App running on emulator/device with network control
- [ ] Network throttling controls accessible

### Test Steps

```
1. App should be in online mode
2. Enable Airplane Mode (go offline)
3. Wait 2 seconds, observe offline banner appears
4. Disable Airplane Mode (go online)
5. Wait 2 seconds, observe sync process starts
6. Repeat steps 2-5 five (5) times
7. Each toggle, observe UI updates
8. After final toggle online: Wait for sync to complete
```

### Success Criteria
- [ ] Offline banner appears within 1 second of going offline
- [ ] Sync starts within 2 seconds of going online
- [ ] Offline banner updates or disappears on reconnection
- [ ] No duplicate requests sent
- [ ] No error messages shown
- [ ] Data remains consistent through toggle sequence
- [ ] No pending requests from earlier toggles are lost
- [ ] Final sync completes successfully

### Expected Behavior
```
Toggle Sequence Logs (should see these):
Offline → Banner appears (red)
Online → Sync starts, "Syncing... (X pending)"
Offline → Banner "Offline mode..."
Online → Sync resumes
... (repeat)
Online → Sync complete, "Last synced just now"
```

---

## Test Scenario 3: Long Offline Duration (24+ hours)

### Objective
Verify old queued requests expire and system cleans up gracefully

### Prerequisites
- [ ] Test environment can manipulate device time/clock
- [ ] OR can simulate 24hr+ offline through code/mock

### Test Steps

```
## METHOD A: Emulator Clock Manipulation
1. Create 3 reports while online
2. Enable Airplane Mode
3. Open Emulator Settings → Adjust system clock forward 25 hours
4. Create 2 more reports offline
5. Move clock forward to current time +1 hour
6. Disable Airplane Mode, wait for sync
7. Check backend: Should have only the 5 reports

## METHOD B: Mock Testing (Recommended for CI)
1. Modify storageUtils.getSyncState() to return request with old timestamp
2. Call requestQueue.processPending()
3. Verify old requests (>24hr old) are removed from queue
4. Verify newer requests (< 24hr old) are processed
```

### Success Criteria
- [ ] Old requests (> 24 hours) are removed from queue
- [ ] New requests (< 24 hours) are processed normally
- [ ] No duplicate reports on backend
- [ ] No error when processing expired requests
- [ ] Queue size reduces appropriately
- [ ] Log shows "cleared X expired requests"

### Expected Behavior
```
Queue Before Sync: 
- Request from 25 hours ago (for Report A)
- Request from 1 hour ago (for Report B)

clearExpiredRequests() runs:
- Removes 25hr-old request
- Keeps 1hr-old request

processPending() runs:
- Processes Report B successfully
- Report A lost (expired before sync)
```

---

## Test Scenario 4: Sync After Long Offline

### Objective
Verify bulk sync of many queued items when reconnecting

### Prerequisites
- [ ] Network control available
- [ ] Authorization to create reports/operations

### Test Steps

```
1. Start App (online mode)
2. Enable Airplane Mode
3. Create 5 reports offline
4. Create 2 relief operations offline (if authorized)
5. Verify 7 items queued (check pending count badge)
6. Disable Airplane Mode, let sync begin
7. Monitor sync progress (Syncing... X pending)
8. Wait for completion (< 60 seconds target)
9. Verify all 7 items appear on backend
10. Refresh data from server (pull-to-refresh)
11. Verify all 7 items display with server ID (not temp ID)
```

### Success Criteria
- [ ] All 7 requests queued while offline
- [ ] Offline banner shows "7 pending changes"
- [ ] Sync starts automatically on reconnect
- [ ] All 7 sync within 60 seconds on 4G
- [ ] No duplicates created on backend
- [ ] All items assigned server IDs after sync
- [ ] No pending items remain in queue
- [ ] Offline banner disappears (or shows "Last synced X seconds ago")
- [ ] Pull-to-refresh confirms all items on server

### Expected Behavior
```
Offline Phase:
- 5 reports queued with temp IDs (temp_1234567890)
- 2 operations queued with temp IDs
- Local display: "7 pending changes"

Online Phase:
- Sync button activates
- Processes all 7 requests
- Shows "Syncing... 7 pending", "Syncing... 6 pending", etc.
- Completes: "Last synced 2 seconds ago"

Post-Sync:
- All items have real server IDs
- Pull-to-refresh confirms
- Badges match server count
```

---

## Test Scenario 5: Conflict During Sync

### Objective
Verify handling of data conflicts between local and server versions

### Prerequisites
- [ ] Backend API support for conflict scenarios
- [ ] Ability to modify backend data while offline

### Test Steps

```
## METHOD A: Server Modifies Data
1. Create Report A with title "Flood at Market"
2. Enable Airplane Mode
3. Modify Report A offline: title → "Major Flood at Market"
4. Disable Airplane Mode (simulates sync start)
5. MEANWHILE: Backend operation modifies same report: title → "Flood Location - Market"
6. Watch sync process handle conflict
7. Check final state

## METHOD B: Simulated Conflict (No backend needed)
1. Modify sync-manager.ts test
2. Call resolveSyncConflict() with conflicting data
3. Verify correct resolution strategy chosen
4. Verify local timestamp wins or server version used
```

### Success Criteria
- [ ] Conflict is detected (same entity modified locally and on server)
- [ ] Resolution strategy is applied (local timestamp comparison)
- [ ] User notified of conflict (if manual review needed)
- [ ] Final data is consistent (one version wins, not merged)
- [ ] Conflict logged for debugging
- [ ] No data loss in resolution
- [ ] Resolution is deterministic (same inputs = same output)

### Expected Behavior
```
Conflict Detected:
Local: { title: "Major Flood", updatedAt: "2026-04-15T12:00:00Z" }
Server: { title: "Flood Location", updatedAt: "2026-04-15T11:55:00Z" }

Resolution:
- Local timestamp (12:00) is newer than server (11:55)
- LOCAL WINS strategy
- Final title: "Major Flood"

Log Output:
"Conflict in report/abc123: using local-wins strategy"
```

---

## Performance Benchmarks

All tests should verify these performance metrics:

### Sync Performance
- [ ] **Offline first-load**: < 2 seconds from cached data
- [ ] **Sync 10 requests on 4G**: < 10 seconds
- [ ] **Sync 10 requests on 3G**: < 30 seconds
- [ ] **Sync 10 requests on 2G**: < 60 seconds
- [ ] **Exponential backoff**: Retry after 1s, 2s, 4s, 8s, 16s max

### Memory Usage
- [ ] **Offline overhead**: < 50MB additional RAM
- [ ] **Queue with 100 items**: < 2MB storage
- [ ] **Cached reports count**: 100+ without lag
- [ ] **App doesn't crash**: Any size dataset

### Battery Impact
- [ ] **Polling when offline**: Stops immediately, resumes on online
- [ ] **Sync process**: Completes in single burst (not continuous polling)
- [ ] **No background drain**: App backgrounded doesn't use battery

---

## Test Device Matrix

Complete tests on this matrix (minimum):

| Device | OS | Screen Size | Status | Notes |
|--------|----|----|--------|-------|
| Android Emulator | Android 13 | 5.7" | [ ] | Test throttling tools |
| iOS Simulator | iOS 17 | 6.1" | [ ] | Test network settings |
| Real Android | Android 12+ | 5.5-6.5" | [ ] | Use airplane mode |
| Real iOS | iOS 15+ | 5.5-6.5" | [ ] | Use airplane mode |
| Android Tablet | Android 13 | 10" | [ ] | Layout responsive |
| iPad | iOS 17 | 10.5" | [ ] | Layout responsive |

---

## Automated Testing (CI/CD)

These scenarios can be automated:

```typescript
// Test: Scenario 1 - Offline Load
describe('Offline Mode', () => {
  it('should load fromcache when offline', async () => {
    // Setup: Cache data in AsyncStorage
    // Action: Init with offline flag
    // Assert: Data loads < 2s
  });

  it('should queue failed requests', async () => {
    // Setup: Mock API to return errors
    // Action: Try to create report
    // Assert: Request stored in queue
  });
});

// Test: Scenario 5 - Conflicts
describe('Sync Conflicts', ()  => {
  it('should resolve conflicts with timestamp', () => {
    const local = { id: '1', text: 'A', updatedAt: '2026-04-15T12:00Z' };
    const server = { id: '1', text: 'B', updatedAt: '2026-04-15T11:55Z' };
    const result = syncManager.resolveSyncConflict('report', '1', local, server);
    expect(result.text).toBe('A'); // Local wins (newer timestamp)
  });
});
```

---

## Debugging Tips

### Enable Debug Logging
```typescript
// In offline/OfflineProvider.tsx, add:
console.log('=== OFFLINE DEBUG ===');
console.log('isOnline:', isOnline);
console.log('pendingSyncCount:', pendingSyncCount);
console.log('isSyncing:', isSyncing);
console.log('lastSyncTime:', lastSyncTime);
```

### Inspect AsyncStorage
```typescript
// In any component:
import AsyncStorage from '@react-native-async-storage/async-storage';

const debugStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const values = await AsyncStorage.multiGet(keys);
  console.log(values);
};
```

### Monitor Network Requests
- **Android**: Use Charles Proxy or Fiddler
- **iOS**: Use Xcode network debugger
- **Both**: Use Mock API server with logging

### Verify Queue Processing
```typescript
// Check pending requests at any time
const pending = await requestQueue.getPending();
console.log('Pending requests:', pending.length, pending);
```

---

## Troubleshooting Common Issues

### Issue: Sync never completes
**Cause**: Network monitoring not detecting online state  
**Fix**: Verify NetInfo library returns correct state, check device network settings

### Issue: Duplicate requests sent
**Cause**: Queue not deduplicating requests  
**Fix**: Check deduplication logic in requestQueue.enqueue(), verify unique request IDs

### Issue: Data loss after sync
**Cause**: Conflict resolution overwriting local changes  
**Fix**: Verify timestamp comparison in sync-manager.ts, check local data persists

### Issue: High memory usage
**Cause**: Large cache size not being cleaned  
**Fix**: Implement cache size limits, add expiration for old cached data

### Issue: Battery drain
**Cause**: Polling continues while app backgrounded  
**Fix**: Verify polling stops in AppState 'background' event

---

## Sign-Off Checklist

- [ ] All 5 scenarios passed
- [ ] Performance benchmarks met
- [ ] All device types tested
- [ ] No crashes or errors logged
- [ ] Battery and network monitoring confirms efficiency
- [ ] Conflicts resolved without data loss
- [ ] Sync queued items all process successfully
- [ ] Offline UX is intuitive and clear
- [ ] Documentation complete

**Tester**: ________________  
**Date**: ________________  
**Notes**: 

```
[Space for tester notes and observations]
```

---

## Next Steps

After Phase 8 testing complete:
1. File bugs for any failures (with reproduction steps)
2. Implement fixes
3. Re-test failing scenarios
4. Move to Phase 9: Device Testing (on real user devices)
5. Prepare for Phase 10: Release
