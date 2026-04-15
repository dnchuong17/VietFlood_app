# Device Testing Guide - Section 13

**Status:** 🚀 Ready for Testing | **Session:** 4 (April 15, 2026)  
**Purpose:** Comprehensive testing framework for iOS Simulator, Android Emulator, and physical devices

---

## 1. Simulator & Emulator Setup

### iOS Simulator Setup

```bash
# Prerequisites
- macOS with Xcode installed
- Xcode Command Line Tools

# Start fresh simulator
xcrun simctl erase all

# Launch simulator
open -a Simulator

# Start development server with iOS support
cd s:\Documents\GitHub\VietFlood_app
npx expo run:ios

# Or if already running:
npx expo start
# Then press 'i' in terminal
```

**Recommended Devices:**
- iPhone 14 Pro (latest)
- iPhone 12 (standard)
- iPhone SE (small screen testing)

### Android Emulator Setup

```bash
# Prerequisites
- Android Studio installed
- Android SDK tools in PATH

# Start emulator
emulator -avd Pixel_5 &

# Start development server with Android support
cd s:\Documents\GitHub\VietFlood_app
npx expo run:android

# Or if already running:
npx expo start
# Then press 'a' in terminal
```

**Recommended Devices:**
- Pixel 5 (5" standard)
- Pixel 6 Pro (6.7" large)
- Nexus 5X (5" small)

---

## 2. Pre-Testing Checklist

Before running any tests:

- [ ] npm dependencies installed (`npm install`)
- [ ] No TypeScript compilation errors (`npm run lint`)
- [ ] Simulator/emulator running and healthy
- [ ] Clear app cache if needed (`npx expo start --clear`)
- [ ] Network connection stable
- [ ] Sufficient storage on test device

---

## 3. Feature Testing Matrix

### Section 1-4: Authentication & Navigation (30 min)

**3.1 Login Flow**
- [ ] Navigate to Login screen
- [ ] Enter valid credentials (test@example.com / password123)
- [ ] Token persists after close/reopen
- [ ] Invalid credentials show error
- [ ] Loading spinner displays on submit
- [ ] Keyboard disappears after submit

**3.2 Registration Flow**
- [ ] Navigate to Register screen
- [ ] Form fields validate (email format, password strength)
- [ ] Submit creates user successfully
- [ ] Redirect to login screen
- [ ] Can login with new credentials

**3.3 Navigation**
- [ ] Tab navigation works (Home, Reports, Profile)
- [ ] Stack navigation stacks screens (no accidental resets)
- [ ] Back button works on both iOS and Android
- [ ] Deep linking (if configured) works
- [ ] Role-based access control works (relief users access relief tab)

**3.4 Dark Mode Toggle**
- [ ] Settings screen has dark/light toggle
- [ ] Toggle persists after app restart
- [ ] Colors update across all screens
- [ ] Text is readable in both modes
- [ ] Images have proper contrast

---

### Section 5: Styling & Responsive Layout (20 min)

**5.1 Responsive Design**
- [ ] Layouts stack vertically on small phones
- [ ] Layouts side-by-side on tablets (if available)
- [ ] Text readability on all sizes
- [ ] Buttons/touches have adequate padding
- [ ] No horizontal scrolling needed
- [ ] Orientation change (landscape) works smoothly

**5.2 Spacing & Typography**
- [ ] Headers are prominent (h1/h2)
- [ ] Body text is readable (14px min)
- [ ] Sections have clear spacing
- [ ] Cards have proper shadows
- [ ] Icons align properly with text

**5.3 Color & Contrast**
- [ ] Primary color is blue (#3b82f6)
- [ ] Semantic colors correct (red = danger, green = success)
- [ ] Dark mode contrast passes WCAG AA standard
- [ ] Icons visible in both light/dark modes

---

### Section 6: Home Dashboard (15 min)

**6.1 Dashboard Loads**
- [ ] Home screen loads without errors
- [ ] Statistics display (active ops, reports, volunteers)
- [ ] Weather alerts show
- [ ] Layout responsive to screen size

**6.2 Overlay Buttons**
- [ ] Rain button toggles (visual feedback)
- [ ] Wind button toggles
- [ ] Temperature button toggles
- [ ] Buttons show active state (color change)
- [ ] On small screens, buttons stack vertically

**6.3 Users Overview**
- [ ] Users stats card displays
- [ ] Numbers update if API call succeeds
- [ ] Responsive on tablet (items in row)
- [ ] Responsive on phone (items stacked)

**6.4 Quick Actions**
- [ ] "Create Report" button tapable
- [ ] "View Map" button tapable
- [ ] "View Operations" button tapable
- [ ] Buttons navigate correctly (check logs)

---

### Section 7: Map Component (20 min)

**7.1 Map Renders**
- [ ] Map displays without crashing
- [ ] Current location shows (blue dot)
- [ ] Accuracy circle visible around location
- [ ] Markers display if available

**7.2 Interactions**
- [ ] Zoom in/out works (pinch or buttons)
- [ ] Pan/drag map works
- [ ] Tap marker shows popup/callout
- [ ] Smooth animations (300ms animations)

**7.3 Weather Overlays**
- [ ] Toggle rain overlay (appears on map)
- [ ] Toggle wind overlay
- [ ] Toggle temperature overlay
- [ ] Overlays have correct colors
- [ ] Legend displays overlay meanings

**7.4 Performance**
- [ ] Map with 10 markers: fast
- [ ] Map with 100 markers: smooth (30+ fps)
- [ ] Map with clustering: no crashes
- [ ] Pan/zoom remains smooth

**7.5 Dark Mode**
- [ ] Map tiles appear dark (not bright)
- [ ] Text visible in dark mode
- [ ] Overlay colors still visible

---

### Section 8: Reports Feature (25 min)

**8.1 Report Creation**
- [ ] Navigate to report creation
- [ ] Fill report form (title, description)
- [ ] Select location (GPS auto-fill works)
- [ ] Severity selector works

**8.2 Photo Capture**
- [ ] Camera button opens camera
- [ ] Take photo works
- [ ] Gallery button opens gallery
- [ ] Select photo from gallery works
- [ ] Photos appear in gallery preview
- [ ] Delete photo from gallery works
- [ ] Max 5 photos enforced

**8.3 Report Submission**
- [ ] Loading spinner shows on submit
- [ ] Success message displays
- [ ] Report appears in report list
- [ ] Photo persists with report

**8.4 Report List**
- [ ] Reports display in list
- [ ] Scrolling works smoothly
- [ ] Search/filter if implemented
- [ ] Tap report shows detail

**8.5 Permissions**
- [ ] Camera permission requested
- [ ] Location permission requested
- [ ] Photo library permission requested
- [ ] Permission denial handled gracefully
- [ ] Prompts appear only once

---

### Section 9-11: Relief, Profile, Components (15 min)

**9.1 Relief Dashboard**
- [ ] Relief operations list displays
- [ ] Operations show status indicators
- [ ] Tap operation shows detail
- [ ] Role-gated access works

**9.2 Profile Screen**
- [ ] User info displays
- [ ] Avatar/profile pic shows
- [ ] Edit button clickable (if implemented)
- [ ] Logout button works
- [ ] Auth token cleared after logout

**9.3 Settings Screen**
- [ ] Dark/light toggle works
- [ ] Notifications toggle works
- [ ] Language selector works (if available)
- [ ] Settings persist

**9.4 Component Library**
- [ ] Buttons (primary, secondary, danger)
- [ ] Cards (shadow visible)
- [ ] TextInput (keyboard opens/closes)
- [ ] Loading spinner animates
- [ ] Modals display correctly

---

## 4. Performance Benchmarks

### Frame Rate Tests

Use React Native profiler or watch for drops:

```bash
# Enable frame rate monitor
Press 'd' in Expo terminal, then:
- Performance Monitor / Perf Monitor
- Watch FPS counter
```

**Target Metrics:**
| Screen | Target FPS | Test Action |
|--------|-----------|------------|
| Navigation | 60 FPS | Tap tabs |
| Map scrolling | 60 FPS | Pan map |
| Map with 100 markers | 30+ FPS | Zoom in/out |
| List scrolling | 60 FPS | Scroll reports |
| Dark mode toggle | < 300ms | Switch theme |

---

### Memory Tests

**Target Metrics:**
| Scenario | Max Memory | Notes |
|----------|-----------|-------|
| App startup | < 100 MB | First render |
| After 5 min use | < 150 MB | Normal usage |
| With 100 markers | < 200 MB | Map with data |
| After 20 min use | < 250 MB | Extended session |

---

### Network Tests

**Simulate Poor Connectivity:**

iOS:
```
Simulator → Features → Location → Conditions
→ Network Link Conditioner
```

Android:
```
Dev Tools → Network Throttling
Select: Slow (3G, LTE)
```

**Tests:**
- [ ] App handles slow network gracefully
- [ ] Loading spinners display
- [ ] Timeout after 30 seconds
- [ ] Retry button appears
- [ ] No crashes on network error

---

## 5. Platform-Specific Tests

### iOS-Specific

- [ ] Notch handled (Safe Area)
- [ ] Status bar visible
- [ ] Swipe back navigation works
- [ ] Pull-to-refresh works (if implemented)
- [ ] Landscape mode works
- [ ] Portrait mode works
- [ ] Face ID / Touch ID ready (auth)
- [ ] Haptic feedback works (if used)

### Android-Specific

- [ ] Back button works (physical or soft)
- [ ] Navigation bar theme matches app
- [ ] Status bar icons visible
- [ ] Landscape mode works
- [ ] Portrait mode works
- [ ] Biometric auth ready (if used)
- [ ] Floating action button if used
- [ ] No crashes with hardware keyboard

---

## 6. Accessibility Testing

- [ ] Tap targets ≥ 48dp (large enough)
- [ ] Color contrast ≥ 4.5:1 (WCAG AA)
- [ ] Text size readable (14px+ body)
- [ ] Screen reader compatible (VoiceOver/TalkBack)
- [ ] Icons have labels
- [ ] Form inputs labeled
- [ ] Error messages for form validation

---

## 7. Edge Case Testing

### Network Scenarios

```bash
# Test with no internet
iOS: Settings > Wifi > Disconnect
Android: Settings > Network > Airplane Mode

Tests:
- [ ] Graceful degradation
- [ ] Offline cache works
- [ ] Reconnect triggers refresh
```

### Permission Scenarios

```
Test all permission combinations:
- [ ] All permissions granted
- [ ] All permissions denied
- [ ] Some permissions granted
- [ ] User changes permissions mid-session
```

### Memory Pressure

```bash
# Simulate low memory (iOS)
Simulator > Devices > Manage Devices
> Edit > Memory: 512MB

Tests:
- [ ] App doesn't crash
- [ ] Performance acceptable
- [ ] No memory leaks
```

---

## 8. Bug Report Template

When you find an issue, report it with this format:

```
## Bug: [Brief title]

**Device:** iPhone 14 Pro / Pixel 5 / Simulator
**OS Version:** iOS 16.4 / Android 13
**App Version:** 0.1.0
**Screen:** [Which screen]

**Steps to Reproduce:**
1. Navigate to X
2. Tap Y
3. Observe Z

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Logs:**
[Any error messages from console]

**Screenshots/Video:**
[Attach if possible]

**Severity:** 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low
```

---

## 9. Testing Schedule

### Phase 1: Smoke Testing (1 hour)
Focus on core flows not crashing:
- Authentication
- Navigation
- Home screen
- Report creation
- Map display

### Phase 2: Feature Testing (2 hours)
Detailed testing of each section:
- All screens load
- All buttons work
- Dark mode works
- Responsive layouts work

### Phase 3: Performance Testing (1 hour)
Benchmark metrics:
- Frame rates
- Memory usage
- Network handling
- Large data sets

### Phase 4: Edge Cases (1 hour)
Boundary conditions:
- Poor network
- No permissions
- Low memory
- Screen rotation
- App backgrounding

---

## 10. Test Devices Recommended

### iOS
- iPhone SE (5.4", small screen baseline)
- iPhone 13 (6.1", standard)
- iPhone 14 Pro Max (6.7", large)

### Android
- Galaxy A12 (6.5", budget device)
- Pixel 5 (6", mid-range)
- Galaxy S23 Ultra (6.8", flagship)

### Minimum Test Requirements
- iPhone (any modern version)
- Android (API 26+)
- Both portrait and landscape

---

## 11. Simulator Troubleshooting

### Issue: Simulator won't start

```bash
# Restart simulator
xcrun simctl shutdown all
xcrun simctl erase all
open -a Simulator

# Or for Android:
emulator -wipe-data -avd Pixel_5
```

### Issue: App crashes on startup

```bash
# Clear cache
npx expo start --clear

# Check logs
npx expo logs

# Rebuild from scratch
rm -rf node_modules
npm install
npx expo start --clear
```

### Issue: Network issues in simulator

```bash
# Restart networking
macOS: System Preferences > Network > Advanced
Android: Settings > About phone > Reset network settings
```

---

## 12. Success Criteria

The app is **ready for beta** when:

✅ **Stability**
- No crashes in core user flows
- Handles permission denial gracefully
- Survives background/foreground cycling

✅ **Performance**
- Navigation: 60 FPS
- Map: 30+ FPS with 100 markers
- Startup: < 3 seconds
- Memory: < 250 MB after 20 min use

✅ **Features**
- All 12 sections functional
- Responsive on all tested screen sizes
- Dark mode working throughout
- Permissions handled correctly

✅ **UX**
- No layout breaks
- Text readable on all screen sizes
- Buttons easily tappable
- Loading states clear

✅ **Code Quality**
- 0 TypeScript errors
- No console errors
- Proper error handling
- Logs clean

---

## 13. Next Steps After Testing

✅ **If tests pass:**
1. Document any minor issues in GitHub
2. Move to Section 15: Build & Distribution
3. Create app icons and splash screens
4. Configure signing for iOS/Android
5. Build beta versions

🔴 **If tests fail:**
1. File bug reports using template above
2. Fix highest-severity issues first
3. Re-test the fixed features
4. Iterate until success criteria met

---

## Quick Reference: Testing Commands

```bash
# Start dev server
npx expo start

# Test on iOS
npx expo run:ios

# Test on Android
npx expo run:android

# Check for errors
npm run lint

# View logs
npx expo logs

# Clear cache
npx expo start --clear

# Clean install
rm -rf node_modules && npm install

# Type check
npm run type-check
```

---

*Device Testing Guide | VietFlood React Native*  
*Session 4 | April 15, 2026*  
*Ready for comprehensive testing across iOS, Android platforms*
