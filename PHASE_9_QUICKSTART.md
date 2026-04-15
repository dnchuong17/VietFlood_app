# Phase 9: Quick Start Guide

**Get Started with Device Testing in 15 Minutes**

---

## Before You Start

✅ Have these ready:
- Test account: `testuser@vietflood.dev` / `TestPassword123!`
- 50+ GB disk space (for emulator images)
- Node.js 18+ installed
- Xcode (macOS) or Android Studio (all platforms)

---

## Step 1: Install Emulators (5 min)

### iOS Simulator (macOS only)
```bash
# Already included with Xcode Command Line Tools
# Just create devices via Xcode Device Manager or:
xcrun simctl create "iPhone 14" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-14 \
  com.apple.CoreSimulator.SimRuntime.iOS-17-4
```

**Quick reference:**
- See full instructions: [PHASE_9_EMULATOR_SETUP.md](./PHASE_9_EMULATOR_SETUP.md#ios-emulator-setup)

### Android Emulator (All Platforms)
```bash
# Install via Android Studio SDK Manager
# Or command line:
sdkmanager "system-images;android-34;google_apis;x86_64"

# Create device
avdmanager create avd -n "Pixel6_Android14" \
  -k "system-images;android-34;google_apis;x86_64" \
  -d "Pixel 6"
```

**Quick reference:**
- See full instructions: [PHASE_9_EMULATOR_SETUP.md](./PHASE_9_EMULATOR_SETUP.md#android-emulator-setup)

---

## Step 2: Start App (5 min)

```bash
# Clone/pull latest code
git pull origin main

# Install dependencies
npm install

# Start iOS simulator with app
npm run ios

# OR start Android emulator with app
npm run android
```

**Tip**: App will auto-install on emulator

---

## Step 3: Load Test Data (3 min)

Option A: **Via Dev Menu** (if available)
```
1. Shake device (or press ⌘D on iOS, ⌘M on Android)
2. Look for "Generate Test Data" option
3. Tap to populate with 50 reports, 20 operations
```

Option B: **Via Code** (direct)
```typescript
import { populateTestData } from './test-data-generator';
await populateTestData({ reports: 50, operations: 20 });
```

Option C: **For Stress Testing**
```typescript
import { generateStressTestData } from './test-data-generator';
await generateStressTestData({ reportCount: 500 });
```

---

## Step 4: Start Testing (2 min)

### Open Testing Checklist
👉 [PHASE_9_DEVICE_TESTING_CHECKLIST.md](./PHASE_9_DEVICE_TESTING_CHECKLIST.md)

Fill out during testing to track:
- Device compatibility ✓/✗
- Screen sizes ✓/✗
- Offline mode ✓/✗
- Performance metrics
- Crashes/issues

### Follow Day-by-Day Plan
👉 [PHASE_9_EXECUTION_GUIDE.md](./PHASE_9_EXECUTION_GUIDE.md)

Structured 7-day testing schedule with specific tests for each phase.

---

## Performance Monitoring

### In Development
```typescript
import { performanceTestingAPI } from './performance-testing';

// Record startup time (automatic)
performanceTestingAPI.recordStartupTime();

// Record memory
performanceTestingAPI.recordMemory(150, 200); // baseline, peak

// Record FPS during scroll
performanceTestingAPI.recordFPS(60);

// Save to AsyncStorage when done
await performanceTestingAPI.saveMetrics();
```

### View Live Metrics
```
1. Open Performance Overlay (dev menu or UI component)
2. Watch real-time:
   - Startup time
   - Memory usage (baseline / peak)
   - FPS / jank frames
   - Network requests
   - Crashes
```

---

## Simulate Offline/Network Conditions

### iOS Simulator
```bash
# Disable WiFi
Simulator → Device → Toggle WiFi

# Simulate slow network
# Download Network Link Conditioner from Apple
# Run → Select Profile (3G, Edge, etc.)
```

### Android Emulator
```bash
# Toggle airplane mode
adb shell settings put global airplane_mode_on 1
adb shell settings put global airplane_mode_on 0

# Simulate latency
adb shell tc qdisc add dev lo root netem delay 100ms

# Remove latency
adb shell tc qdisc del dev lo root

# View network profile
adb emu geo fix 10.7769 106.7009  # Set fake GPS location
```

---

## Key Testing Scenarios

| Scenario | Time | Result |
|----------|------|--------|
| **Screen Compatibility** | 30 min | Tap each screen, verify text/buttons OK |
| **Version Compatibility** | 30 min | Test on iOS 15, 16, 17, 18 (Android 12-14) |
| **Permissions** | 20 min | Test camera, location, photos, notifications |
| **Offline Mode** | 15 min | Create report offline, verify sync on reconnect |
| **Performance** | 20 min | Measure startup/scroll/memory with profilers |
| **Load Test** | 15 min | 500 reports in cache, verify app still responsive |
| **Network Resilience** | 15 min | Toggle offline 5x, verify no data loss |

**Total**: ~2.5 hours per device type (iOS + Android)

---

## Logging & Debugging

### View Real-Time Logs

iOS Simulator:
```bash
log stream --predicate 'process == "VietFlood"'
```

Android Emulator:
```bash
adb logcat | grep vietflood
```

Metro Console (React Native):
```bash
# Shown in terminal where `npm run ios/android` was executed
# Look for [Perf] logs from performance tracking
```

### Export Metrics for Analysis
```typescript
import { performanceTestingAPI } from './performance-testing';

const metrics = performanceTestingAPI.getMetrics();
console.log(metrics); // View in console

// Save to file for post-session analysis
await performanceTestingAPI.saveMetrics();
```

---

## Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| **App crashes on launch** | Clear cache: `npm run ios` (rebuild) |
| **Simulator won't boot** | `xcrun simctl erase all` (reset) |
| **Emulator frozen** | Kill: `adb kill-server`, restart |
| **Network doesn't work** | Check System Preferences → Network |
| **Keyboard locked** | Toggle: Ctrl+K (Windows) / Cmd+K (Mac) |
| **Low performance** | Reduce screen resolution, close other apps |

See detailed troubleshooting: [PHASE_9_EMULATOR_SETUP.md](./PHASE_9_EMULATOR_SETUP.md#troubleshooting)

---

## Sign-Off Checklist

When all tests completed:
- [ ] All device configurations tested (4+ iOS, 4+ Android)
- [ ] No critical bugs found (or documented)
- [ ] Performance metrics within targets (~3s startup, 60 FPS scroll)
- [ ] Offline mode verified working
- [ ] Cross-platform consistency checked
- [ ] Metrics saved to AsyncStorage

**Then proceed to**: [Phase 10 - Release Verification](./PHASE_10_RELEASE_CHECKLIST.md)

---

## Documentation Reference

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [PHASE_9_EMULATOR_SETUP.md](./PHASE_9_EMULATOR_SETUP.md) | In-depth emulator config | 15 min |
| [PHASE_9_EXECUTION_GUIDE.md](./PHASE_9_EXECUTION_GUIDE.md) | 7-day test plan | 20 min |
| [PHASE_9_DEVICE_TESTING_CHECKLIST.md](./PHASE_9_DEVICE_TESTING_CHECKLIST.md) | Fillable test checklist | Use during testing |
| [API_REFERENCE.md](./API_REFERENCE.md) | Backend API endpoints | Reference as needed |

---

## Team Coordination

**Recommended Setup** (for 2-3 QA testers):
- **Tester 1**: iOS devices (iPhone SE, 14, 14 Pro Max)
- **Tester 2**: Android devices (Pixel 4, 6, Tablet)
- **Tester 3**: Cross-platform review, performance analysis

**Timeline**: 5-7 days total (parallel testing accelerates timeline)

---

## Success Criteria

✅ **Phase 9 Complete When**:
- All 8 device configurations tested
- 0 critical bugs remaining
- Performance targets met (startup < 3s, scroll 60 FPS)
- Offline mode verified
- All tests documented in checklist
- QA team sign-off received

---

**Ready to begin?** → Start with [Step 1](#step-1-install-emulators-5-min)

**For detailed info**: → See [PHASE_9_EXECUTION_GUIDE.md](./PHASE_9_EXECUTION_GUIDE.md)
