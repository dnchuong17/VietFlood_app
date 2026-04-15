# Phase 9: Device Testing Execution Guide

**Objective**: Execute comprehensive device testing across iOS and Android  
**Duration**: 5-7 days (2-3 parallel test cycles)  
**Success Criteria**: All device configurations pass compatibility and performance tests  
**Date**: April 16-22, 2026  

---

## Pre-Execution Checklist

Before starting Phase 9 device testing:

- [ ] All team members have read PHASE_9_DEVICE_TESTING_CHECKLIST.md
- [ ] Emulators/simulators set up per PHASE_9_EMULATOR_SETUP.md
- [ ] Test account credentials available and verified
- [ ] Test data loaded in all emulators (via test-data-generator.ts)
- [ ] Performance monitoring tools installed (Xcode Instruments, Android Profiler)
- [ ] Network simulation tools available (Network Link Conditioner, adb)
- [ ] Logging configured (Xcode console, logcat, metro console)
- [ ] Risk assessment signed off
- [ ] Test dates/times coordinated with team

---

## Phase 9 Structure

**Total Time Budget**:
- iOS Testing: 2-3 days (4 device configurations)
- Android Testing: 2-3 days (4 device configurations)
- Cross-platform Review: 1 day
- Issue Triage: 1 day

**Parallel Testing**:
- Can test 2-3 iOS devices simultaneously in simulators
- Can test 2 Android devices simultaneously in emulators
- Enable faster completion with coordinated team effort

---

## Day 1: iOS Testing Phase

### Phase 1A: iOS Setup & Baseline (Morning)

**Duration**: 1.5 hours

**Tasks**:
1. Start all iOS simulators (4 devices)
   ```bash
   xcrun simctl boot "iPhone SE iOS 17"
   xcrun simctl boot "iPhone 14 iOS 17"
   xcrun simctl boot "iPhone 14 Pro Max iOS 17"
   xcrun simctl boot "iPad Air iOS 17"
   # Open Simulator.app to see all devices
   ```

2. Verify app installs on each
   ```bash
   npm run ios -- --device "iPhone SE iOS 17"
   # Repeat for each device
   ```

3. Load test data on each simulator
   ```bash
   # From app dev menu or directly:
   import { populateTestData } from './test-data-generator';
   await populateTestData({ reports: 50, operations: 20 });
   ```

4. **Document baseline**:
   - Startup time (cold start): _____ seconds
   - Memory usage baseline: _____ MB
   - No crashes observed: ☐ Yes ☐ No

---

### Phase 1B: iOS Screen Compatibility Testing (Afternoon)

**Device**: iPhone SE (small phone)  
**Duration**: 30 minutes

**Tests**:
1. App launches without crash (log in)
2. Navigate to each screen:
   - Home → ☐ Pass / ☐ Fail
   - Reports → ☐ Pass / ☐ Fail
   - Map → ☐ Pass / ☐ Fail
   - Operations → ☐ Pass / ☐ Fail
   - Profile → ☐ Pass / ☐ Fail
   - Settings → ☐ Pass / ☐ Fail

3. Check for text cutoff, button accessibility, safe area violations
   - Xcode Console Issues: ☐ None ☐ Minor ☐ Major

4. Test rotation (landscape orientation)
   - Layout adapts correctly: ☐ Yes ☐ No
   - No crashes: ☐ Yes ☐ No

5. Performance during startup
   - Startup time: _____ seconds (target < 3s)
   - FPS smooth: ☐ Yes ☐ Jank observed

---

**Device**: iPhone 14 (standard phone)  
**Duration**: 30 minutes

Repeat tests from iPhone SE above, verify same flows work properly.

---

**Device**: iPhone 14 Pro Max (large phone)  
**Duration**: 30 minutes

Repeat tests, verify large screen uses space efficiently (no excessive margins).

---

**Device**: iPad Air (tablet)  
**Duration**: 30 minutes

1. App launches on tablet
2. Navigation works all screens
3. Layout optimized for tablet size: ☐ Yes ☐ No (if tablet layout exists)
4. Landscape orientation works well: ☐ Yes ☐ No
5. Performance acceptable: ☐ Yes ☐ No

**Recorded Issues (Day 1 AM/PM)**:
```


```

---

## Day 2: iOS Advanced Testing

### Phase 2A: iOS Version Compatibility (Morning)

**Device**: iPhone 14 (all iOS versions)  
**Duration**: 1 hour

1. Boot iPhone 14 iOS 15
   - App installs: ☐ Pass ☐ Fail
   - Core features work: ☐ Pass ☐ Fail
   - No crashes: ☐ Pass ☐ Fail

2. Boot iPhone 14 iOS 16
   - Repeat tests above

3. Boot iPhone 14 iOS 17
   - Repeat tests above

4. Boot iPhone 14 iOS 18 (if available)
   - Repeat tests above

**Assessment**: 
- Minimum iOS version supported (iOS 15): ☐ Confirmed
- Latest iOS version compatible: ☐ Confirmed

---

### Phase 2B: iOS Permissions & Features (Afternoon)

**Duration**: 1.5 hours

**Location Services**:
```
Test on: iPhone 14
- Permission prompt appears: ☐ Yes ☐ No
- "Allow Once" option works: ☐ Yes ☐ No
- "Allow While Using App" works: ☐ Yes ☐ No
- "Never Allow" blocks access: ☐ Yes ☐ No
```

**Camera**:
```
- Permission prompt appears: ☐ Yes ☐ No
- Camera launches: ☐ Yes ☐ No
- Photo capture works: ☐ Yes ☐ No
- Photo saved: ☐ Yes ☐ No
- Permission revocation works: ☐ Yes ☐ No
```

**Photos Library**:
```
- Library permission prompt: ☐ Yes ☐ No
- Photo selection works: ☐ Yes ☐ No
- Multiple photo selection: ☐ Works ☐ N/A
- Large files handled: ☐ Yes ☐ No
```

**Notifications**:
```
- Permission request appears: ☐ Yes ☐ No
- Notifications enable: ☐ Yes ☐ No
- Badge count updates: ☐ Yes ☐ No
```

---

### Phase 2C: iOS Performance Profiling (Throughout Day 2)

**Using Xcode Instruments**:

1. Attach profiler to running app:
   ```
   Xcode → Debug → Gauges (or Window → Metrics)
   ```

2. Record 5-minute session while:
   - Scrolling report list (10x)
   - Map zoom interactions (10x)
   - Creating a report (1x)

3. **Metrics Captured**:
   - CPU: _____ % (target ≤ 80% average)
   - Memory: _____ MB (target ≤ 200MB)
   - Energy Impact: _____ (low/medium/high)
   - Frame drops: _____ (target 0-2%)

4. **Analysis**:
   - Memory leaks detected: ☐ None ☐ Minor ☐ Major
   - FPS consistent (60fps): ☐ Yes ☐ Dropped frames
   - No significant hangs: ☐ Confirmed

---

## Day 3: Android Testing Phase

### Phase 3A: Android Setup & Baseline (Morning)

**Duration**: 1.5 hours

**Tasks**:
1. Start all Android emulators
   ```bash
   emulator -avd Pixel4_Android13 &
   sleep 5
   emulator -avd Pixel6_Android14 &
   sleep 5
   emulator -avd PixelTablet_Android13 &
   ```

2. Verify app installs on each
   ```bash
   npm run android
   # Verify appears on each emulator
   adb devices  # See all running devices
   ```

3. Load test data
   ```bash
   # Through app dev menu or code
   await populateTestData({ reports: 50, operations: 20 });
   ```

4. **Document baseline**:
   - Startup time: _____ seconds
   - Memory: _____ MB
   - No crashes: ☐ Yes ☐ No

---

### Phase 3B: Android Screen Compatibility Testing (Afternoon)

**Device**: Pixel 4 (small phone - 1080×1920)  
**Duration**: 30 minutes

1. App launches: ☐ Pass ☐ Fail (Check logcat for errors)
2. Navigate all screens:
   - Home → ☐ Pass ☐ Fail
   - Reports → ☐ Pass ☐ Fail
   - Map →☐ Pass ☐ Fail
   - Operations → ☐ Pass ☐ Fail
   - Profile → ☐ Pass ☐ Fail

3. Check layout:
   - Text readable: ☐ Yes ☐ No
   - No text cutoff: ☐ Yes ☐ No
   - Buttons tappable (48dp min): ☐ Yes ☐ No
   - Safe area respected: ☐ Yes ☐ No

4. Rotation test:
   - Portrait works: ☐ Yes ☐ No
   - Landscape works: ☐ Yes ☐ No
   - No crashes: ☐ Yes ☐ No

5. Performance:
   - Startup time: _____ seconds (target < 3s)
   - Scroll/FPS smooth: ☐ Yes ☐ Jank

---

**Device**: Pixel 6 (standard - 1080×2400)  
**Duration**: 30 minutes

Repeat tests from Pixel 4.

---

**Device**: Pixel Tablet (tablet - 2560×1600)  
**Duration**: 30 minutes

1. App launches on tablet: ☐ Yes ☐ No
2. All screens accessible: ☐ Yes ☐ No
3. Tablet-optimized layout (if exists): ☐ Yes/N/A
4. Landscape works well: ☐ Yes ☐ No
5. Performance acceptable: ☐ Yes ☐ No

**Recorded Issues (Day 3 AM/PM)**:
```


```

---

## Day 4: Android Advanced Testing

### Phase 4A: Android Version Compatibility (Morning)

**Device**: Pixel 6 (all Android versions)  
**Duration**: 1 hour

1. Boot Android 12 emulator
   - App installs: ☐ Pass ☐ Fail
   - Core features work: ☐ Pass ☐ Fail
   - Check logcat: `adb logcat | grep vietflood`

2. Boot Android 13 emulator
   - Repeat tests

3. Boot Android 14 emulator
   - Repeat tests

**Assessment**:
- Minimum Android version (API 31): ☐ Confirmed
- Latest Android version (API 34+): ☐ Confirmed

---

### Phase 4B: Android Permissions & Features (Afternoon)

**Location**:
```
Test on: Pixel 6
- Permission dialog appears: ☐ Yes ☐ No
- Allow all time: ☐ yes ☐ No
- Allow while using: ☐ Yes ☐ No
- Accuracy ~20m: ☐ Confirmed
```

**Camera**:
```
- Permission request: ☐ Yes ☐ No
- Camera opens: ☐ Yes ☐ No
- Photo captures: ☐ Yes ☐ No
- Photos save: ☐ Yes ☐ No
```

**Photos/Gallery**:
```
- Gallery picker works: ☐ Yes ☐ No
- Multiple selection: ☐ Works ☐ N/A
- Large images OK: ☐ Yes ☐ No
```

**Notifications**:
```
- Notification permission: ☐ Yes ☐ No
- Notifications deliver: ☐ Yes ☐ No
- Badge counts shown: ☐ Yes ☐ No
```

---

### Phase 4C: Android Performance Profiling (Throughout Day 4)

**Using Android Profiler**:

1. Open Android Studio → View → Tool Windows → Profiler
2. Select running app
3. Record 5-minute session:

**Memory Tab**:
   - Baseline: _____ MB
   - Peak during operations: _____ MB
   - No major leaks: ☐ Confirmed
   - Garbage collection working: ☐ Yes ☐ No

**CPU Tab**:
   - Average: _____ % (target < 60%)
   - Peak: _____ % (target < 80%)
   - Smooth scrolling: ☐ Yes ☐ Frame drops

**Network Tab**:
   - Total sent: _____ MB
   - Total received: _____ MB
   - No excessive requests: ☐ Confirmed

**Energy Profiler** (if available):
   - Energy rating: _____ (low/medium/high)
   - Battery drain acceptable: ☐ Yes ☐ No

---

## Day 5: Offline & Network Resilience Testing

### Phase 5A: Offline Mode Testing (Morning)

**Device**: iPhone 14 (iOS) + Pixel 6 (Android)  
**Duration**: 1.5 hours

**iOS - Simulate Offline**:
```bash
# Simulator → Device → Toggle WiFi
# OR use Network Link Conditioner for more control
```

**Android - Simulate Offline**:
```bash
# Settings → Network & Internet → Airplane mode ON
# OR adb shell settings put global airplane_mode_on 1
```

**Tests**:

1. **Offline Banner**:
   - Appears immediately: ☐ Yes ☐ No
   - Red/orange color: ☐ Yes ☐ No
   - "Offline" text visible: ☐ Yes ☐ No

2. **Data Access Offline**:
   - Home shows cached data: ☐ Yes ☐ No
   - Reports load from cache: ☐ Yes ☐ No
   - Map shows cached markers: ☐ Yes ☐ No

3. **Create Report Offline**:
   - Form works: ☐ Yes ☐ No
   - Submit queued (not error): ☐ Yes ☐ No
   - Marked as pending: ☐ Yes ☐ No
   - Pending count shown: ☐ Yes ☐ No

4. **Going Online**:
   - Banner changes (syncing): ☐ Yes ☐ No
   - Sync starts automatically: ☐ Yes ☐ No
   - Pending items sync: ☐ Yes ☐ No
   - No duplicates: ☐ Confirmed

---

### Phase 5B: Network Switching (Afternoon)

**Duration**: 1 hour

**Switch WiFi → Cellular → WiFi**:
```
- iOS: Settings → WiFi toggle (Simulator)
- Android: Airplane mode for simpler testing
```

Tests:
1. Toggle airplane mode 5 times: ☐ No crashes
2. Switch networks smoothly: ☐ Yes ☐ Lag
3. Pending operations preserved: ☐ Yes ☐ Lost
4. Sync resumes correctly: ☐ Yes ☐ Failed

**Recorded Issues (Day 5)**:
```


```

---

## Day 6: End-to-End Testing

### Phase 6A: Complete User Flows (Morning)

**Device**: iPhone 14 + Pixel 6 (parallel testing)  
**Duration**: 1.5 hours

**Flow 1: Report Creation**:
```
1. Login with test account
2. Navigate to Create Report
3. Fill form:
   - Title: "Test Report 1"
   - Description: "Testing end-to-end"
   - Attach 2 photos
   - Set location on map
   - Set severity to "High"
4. Submit report
5. Verify appears in list
6. Navigate back
7. List still shows new report

Pass/Fail: ☐ PASS ☐ FAIL
```

**Flow 2: Map Interaction**:
```
1. Open Map screen
2. Find own location: ☐ Works ☐ Fail
3. Zoom in/out 5x: ☐ Smooth ☐ Jank
4. Pan in all directions: ☐ Works ☐ Fail
5. Tap markers: ☐ Info appears ☐ Fail
6. Double-tap zoom: ☐ Works ☐ Fail

Pass/Fail: ☐ PASS ☐ FAIL
```

**Flow 3: Report Viewing**:
```
1. Open Reports list
2. Scroll through 10 items: ☐ 60 FPS ☐ Jank
3. Tap report detail
4. Photos display: ☐ Yes ☐ No
5. Location shows on map: ☐ Yes ☐ No
6. Scroll through details: ☐ Smooth ☐ Jank

Pass/Fail: ☐ PASS ☐ FAIL
```

---

### Phase 6B: Performance Under Load (Afternoon)

**Duration**: 1 hour

**Scenario**: 500 reports in cache

```bash
# Use stress test data generator
import { generateStressTestData } from './test-data-generator';
await generateStressTestData({ reportCount: 500 });
```

Tests:

1. **App Startup**:
   - Time: _____ seconds (target < 5s with large dataset)
   - No crashes: ☐ Yes ☐ No
   - Memory: _____ MB

2. **List Scrolling**:
   - Scroll to end (500 items): ☐ Completes ☐ Hangs
   - FPS during scroll: _____ (target 50+)
   - No frame drops: ☐ Yes ☐ Jank

3. **Search Performance**:
   - Filter by text: ☐ Responsive ☐ Lag
   - Sort by date: ☐ Quick ☐ Slow

**Recorded Issues (Day 6)**:
```


```

---

## Day 7: Cross-Platform Review & Sign-Off

### Phase 7A: Consistency Review (Morning)

**Duration**: 1 hour

Compare behavior across iOS and Android:

| Feature | iOS Result | Android Result | Consistent? |
|---------|-----------|----------------|-------------|
| Login flow | | | ☐ Yes ☐ No |
| Home screen layout | | | ☐ Yes ☐ No |
| Map interaction | | | ☐ Yes ☐ No |
| Report creation | | | ☐ Yes ☐ No |
| Offline behavior | | | ☐ Yes ☐ No |
| Text display | | | ☐ Yes ☐ No |
| Performance (startup) | | | ☐ Yes ☐ No |
| Memory usage | | | ☐ Yes ☐ No |

**Notes**:
```


```

---

### Phase 7B: Issue Triage (Afternoon)

**Duration**: 1-2 hours

1. **Sort Issues by Severity**:
   - ☐ **Critical** (app crashes, data loss, security): Count _____
   - ☐ **High** (broken features, major layout issues): Count _____
   - ☐ **Medium** (visual glitches, minor UX issues): Count _____
   - ☐ **Low** (cosmetic, nice-to-have): Count _____

2. **Critical Issues Found**:
```
[List any blocking issues]


```

3. **Recommendation**:
   - ☐ **READY for production** (0 critical, < 3 high)
   - ☐ **NEEDS FIXES** (1-2 critical or 3+ high - see issues above)
   - ☐ **NOT READY** (3+ critical issues)

---

## Overall Phase 9 Sign-Off

### Testing Summary

| Category | iOS | Android | Status |
|----------|-----|---------|--------|
| Screen Compatibility | ✓/✗ | ✓/✗ | ☐ PASS ☐ FAIL |
| Version Compatibility | ✓/✗ | ✓/✗ | ☐ PASS ☐ FAIL |
| Permissions | ✓/✗ | ✓/✗ | ☐ PASS ☐ FAIL |
| Performance | ✓/✗ | ✓/✗ | ☐ PASS ☐ FAIL |
| Offline Mode | ✓/✗ | ✓/✗ | ☐ PASS ☐ FAIL |
| Network Resilience | ✓/✗ | ✓/✗ | ☐ PASS ☐ FAIL |
| Functional Flows | ✓/✗ | ✓/✗ | ☐ PASS ☐ FAIL |
| Load Testing | ✓/✗ | ✓/✗ | ☐ PASS ☐ FAIL |
| Overall | | | ☐ PASS ☐ FAIL |

### Performance Metrics Summary

| Metric | Target | Achieved | Status |
|--------|--------|----------|--------|
| Cold Startup | < 3s | _____ | ☐ ✅ ☐ ❌ |
| Memory Idle | < 150MB | _____ | ☐ ✅ ☐ ❌ |
| Memory Peak | < 250MB | _____ | ☐ ✅ ☐ ❌ |
| Scroll FPS | 60 FPS | _____ | ☐ ✅ ☐ ❌ |
| Map FPS | 60 FPS | _____ | ☐ ✅ ☐ ❌ |
| Crash-Free | 100% | _____ | ☐ ✅ ☐ ❌ |

### Final Phase 9 Assessment

**Phase 9 Status**: ☐ **COMPLETE** ☐ **NEEDS REWORK**

**Recommendation for Phase 10**:
- ☐ Proceed to Phase 10 (Release Verification)
- ☐ Fix critical issues first (estimate: _____ days)
- ☐ Additional testing needed

**QA Team Sign-Off**:
- Lead QA Tester: _____________________
- Date: _____________________
- Duration: _____ days (actual vs 7 planned)
- Devices Tested: _____ configurations
- Total Test Cases: _____ completed

**Notes**:
```


```

---

## Next Phase

**Phase 10: Final Verification & Release** starts after Phase 9 completion.

See [PHASE_10_RELEASE_CHECKLIST.md](./PHASE_10_RELEASE_CHECKLIST.md) for next steps.

---

**Document Version**: 1.0  
**Last Updated**: April 15, 2026  
**Status**: Ready for execution  
