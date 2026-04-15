# Phase 9: Device Testing - Practical Checklist

**Objective**: Comprehensive testing on real and simulated devices  
**Duration**: 5-7 days across iOS, Android, tablets, and various screen sizes  
**Target**: Zero critical bugs, <3s startup, 60 FPS scrolling, <200MB idle memory  

---

## Setup Instructions

### Before Testing
- [ ] Devices fully charged
- [ ] Latest app build installed
- [ ] Test account created with sample data
- [ ] Network connectivity verified
- [ ] VPN disabled (if applicable)
- [ ] Performance monitoring enabled (dev mode)

### Test Account Credentials
```
Email: testuser@vietflood.dev
Password: TestPassword123!
Role: citizen (citizen testing); admin (full testing)
```

---

## CATEGORY 1: Device Screen Compatibility

### 1.1 iPhone SE / Small Phones (375px)
**Devices**: iPhone SE, iPhone XS, Pixel 4  
**Target OS**: iOS 17+, Android 13+

- [ ] App launches without crash
- [ ] All screens load (Home, Reports, Profile visible)
- [ ] Text is readable (no cutoff)
- [ ] Buttons are tappable (44pt+ minimum)
- [ ] No horizontal scrolling needed on main screens
- [ ] Modal dialogs fit without cutting off buttons
- [ ] Bottom navigation bar visible and functional
- [ ] Keyboard doesn't hide input fields
- [ ] Notch (if present) doesn't cover content
- [ ] Landscape orientation works (rotation test)

**Performance Target**:
- Launch time: < 3 seconds
- Memory: < 150MB idle
- No jank during rotation

**Pass/Fail**: ☐ PASS  ☐ FAIL
**Issues Found**: ___________________

---

### 1.2 Standard Phones (375-430px)
**Devices**: iPhone 12/13/14, Pixel 5/6, Samsung S21, Moto G50  
**Target OS**: iOS 15+, Android 12+

- [ ] App optimized for this size
- [ ] All buttons and text positioned correctly
- [ ] Map has proper controls (zoom, locate)
- [ ] Report form has good spacing
- [ ] Operation list scrolls smoothly
- [ ] Bottom tabs accessible without scrolling
- [ ] Safe area properly respected
- [ ] No visual overlaps or clipping
- [ ] Pull-to-refresh works
- [ ] Swipe gestures responsive

**Performance Target**:
- Launch time: < 2.5 seconds
- List scrolling: 60 FPS
- Memory: < 180MB idle

**Pass/Fail**: ☐ PASS  ☐ FAIL
**Issues Found**: ___________________

---

### 1.3 Large Phones (430px+)
**Devices**: iPhone 14 Pro Max, iPhone 15 Pro Max, Galaxy S22 Ultra  
**Target OS**: iOS 17+, Android 13+

- [ ] Content properly centered (no huge margins)
- [ ] Two-column layouts work (if available)
- [ ] Map takes advantage of screen size
- [ ] List items sized appropriately
- [ ] No wasted white space
- [ ] Large buttons still tappable
- [ ] Gestures responsive at edges
- [ ] Camera/photo picker visible
- [ ] Modal dialogs properly sized
- [ ] Landscape mode works well

**Performance Target**:
- Launch time: < 3 seconds
- Rendering: smooth without stuttering
- Memory: < 200MB idle

**Pass/Fail**: ☐ PASS  ☐ FAIL
**Issues Found**: ___________________

---

### 1.4 Tablets (768px+)
**Devices**: iPad (7th gen+), iPad Air, iPad Pro  
**Target OS**: iPadOS 15+

- [ ] App doesn't just scale phone UI
- [ ] Consider tablet-optimized layout (if implemented)
- [ ] Navigation works in landscape
- [ ] Split-screen mode (if supported) functions
- [ ] Keyboard/mouse input recognized
- [ ] All features accessible
- [ ] Safe area includes notch/home indicator
- [ ] Performance good with large resolution
- [ ] Maps have appropriate zoom level
- [ ] Modals properly centered

**Performance Target**:
- Launch time: < 3 seconds
- Rendering: smooth at high resolution
- Memory: < 200MB idle

**Pass/Fail**: ☐ PASS  ☐ FAIL
**Issues Found**: ___________________

---

### 1.5 Notched/Punch-hole Devices
**Devices**: iPhone 11-15 (notch), Galaxy S21+ (hole punch), OnePlus (notch)

- [ ] Content not hidden behind notch
- [ ] StatusBar readable (time, battery, signal)
- [ ] SafeAreaView properly applied
- [ ] Top navigation not cut off
- [ ] Header properly positioned around notch
- [ ] Tabs at bottom not affected by home indicator
- [ ] All buttons clickable (not behind notch)
- [ ] No visual overlap with notch/hole
- [ ] Portrait and landscape OK
- [ ] Multiple notch styles tested (if available)

**Pass/Fail**: ☐ PASS  ☐ FAIL
**Issues Found**: ___________________

---

## CATEGORY 2: iOS Specific Testing

### 2.1 iOS Version Compatibility

**iOS 15** (Minimum Supported)
- [ ] App installs
- [ ] Core features work
- [ ] No native feature issues
- [ ] Performance acceptable
- **Device Used**: ________________
- **Pass/Fail**: ☐ PASS  ☐ FAIL

**iOS 16** (Standard)
- [ ] App fully functional
- [ ] No warnings or crashes
- [ ] Performance good
- **Device Used**: ________________
- **Pass/Fail**: ☐ PASS  ☐ FAIL

**iOS 17** (Latest Standard)
- [ ] All features work
- [ ] No compatibility issues
- [ ] Performance optimized
- **Device Used**: ________________
- **Pass/Fail**: ☐ PASS  ☐ FAIL

**iOS 18** (Bleeding edge)
- [ ] App compatible
- [ ] New OS features don't break app
- **Device Used**: ________________
- **Pass/Fail**: ☐ PASS  ☐ FAIL

---

### 2.2 iOS Permissions & Features

**Location Services**:
- [ ] Permission prompt appears
- [ ] "Allow Once" works
- [ ] "Allow While Using App" works
- [ ] "Never Allow" blocks location
- [ ] Location accuracy ~20m

**Camera**:
- [ ] Permission prompt appears
- [ ] Camera launches on first use
- [ ] Photo captured successfully
- [ ] Photos persist after app closes
- [ ] Gallery shows captured photo

**Photos Library**:
- [ ] Library permission request shows
- [ ] Photos can be selected
- [ ] Albums display correctly
- [ ] Large images handle gracefully
- [ ] Videos don't crash app

**Notifications**:
- [ ] Permission request appears
- [ ] Notifications can be enabled
- [ ] Notifications deliver properly
- [ ] Tapping notification navigates correctly
- [ ] Badge count updates

**Keychain**:
- [ ] Login tokens stored securely
- [ ] Tokens persist across app restarts
- [ ] Logout clears tokens
- [ ] No sensitive data in UserDefaults

**Pass/Fail**: ☐ PASS  ☐ FAIL
**Issues Found**: ___________________

---

### 2.3 iOS Performance (Xcode Instruments)

**Startup Time**: _____ seconds (Target: < 3s)

**Memory**:
- Initial: _____ MB
- After scroll: _____ MB
- Check for leaks: ☐ No leaks found

**CPU**:
- Idle: _____ %
- Scrolling: _____ % (Target: < 80%)
- Maps interaction: _____ %

**Pass/Fail**: ☐ PASS  ☐ FAIL

---

## CATEGORY 3: Android Specific Testing

### 3.1 Android Version Compatibility

**Android 12** (API 31 - standard)
- [ ] App fully functional
- [ ] No crashes
- **Device Used**: ________________
- **Pass/Fail**: ☐ PASS  ☐ FAIL

**Android 13** (API 33 - current)
- [ ] All features work
- [ ] Modern permissions respected
- **Device Used**: ________________
- **Pass/Fail**: ☐ PASS  ☐ FAIL

**Android 14** (API 34 - latest)
- [ ] Compatible with latest
- [ ] No deprecated API usage
- **Device Used**: ________________
- **Pass/Fail**: ☐ PASS  ☐ FAIL

**Android 11 (API 30 - older)**
- [ ] App still functional
- [ ] No crashes
- **Device Used**: ________________
- **Pass/Fail**: ☐ PASS  ☐ FAIL

---

### 3.2 Android OEM Variants

**Samsung**:
- [ ] App works on One UI
- [ ] Samsung-specific features don't crash
- [ ] Performance good
- **Device Model**: ________________
- **Pass/Fail**: ☐ PASS  ☐ FAIL

**Google Pixel**:
- [ ] Works on stock Android
- [ ] Google Features work
- **Device Model**: ________________
- **Pass/Fail**: ☐ PASS  ☐ FAIL

**Other** (Motorola, OnePlus, etc):
- [ ] No OEM-specific crashes
- [ ] App performant
- **Device/Brand**: ________________
- **Pass/Fail**: ☐ PASS  ☐ FAIL

---

### 3.3 Android Permissions

**Location**:
- [ ] Permission dialog appears
- [ ] "Allow all time" option works
- [ ] "Allow while using app" works
- [ ] "Don't allow" denies location
- [ ] Accuracy tested: ~20m

**Camera**:
- [ ] Permission request shows
- [ ] Camera opens immediately
- [ ] Photos save correctly
- [ ] Permission can be revoked

**Photos/Media**:
- [ ] Gallery picker works
- [ ] Multiple photo selection (if supported)
- [ ] Images upload without crash
- [ ] Video selection (if supported) works

**Notifications**:
- [ ] Notification permission dialog appears
- [ ] Notifications deliver when enabled
- [ ] Notification channels working
- [ ] Badge counts visible

**Sensors** (Gyro, Accelerometer):
- [ ] Device rotation detected
- [ ] Layout responds to rotation
- [ ] No crashes on orientation change

**Pass/Fail**: ☐ PASS  ☐ FAIL
**Issues Found**: ___________________

---

### 3.4 Android Performance (Android Studio Profiler)

**Startup Time**: _____ seconds (Target: < 3s)

**Memory**:
- Initial: _____ MB
- After heavy use: _____ MB
- Target: < 200MB idle

**CPU**:
- Idle: _____ %
- List scrolling: _____ % (Target: 60 FPS)
- Map interaction: _____ %

**Battery Drain** (15 min usage):
- Drain: _____ % (Target: < 5%)

**Pass/Fail**: ☐ PASS  ☐ FAIL

---

## CATEGORY 4: Functional Testing

### 4.1 Authentication Flow

**Sign Up**:
- [ ] Form displays all fields
- [ ] Email validation works
- [ ] Password requirements shown
- [ ] Submit button functional
- [ ] Account creation succeeds
- [ ] Auto-login works
- [ ] Profile data populated

**Login**:
- [ ] Login form displays
- [ ] Valid credentials work
- [ ] Invalid credentials rejected
- [ ] Error message clear
- [ ] Token stored securely
- [ ] Persistent login works (app restart)

**Logout**:
- [ ] Logout button accessible
- [ ] Confirmation dialog appears
- [ ] Logout completes
- [ ] Redirects to login screen
- [ ] Tokens cleared
- [ ] No data remains cached

**Pass/Fail**: ☐ PASS  ☐ FAIL
**Issues Found**: ___________________

---

### 4.2 Report Creation Flow

**Form Filling**:
- [ ] All input fields work
- [ ] Location can be set
- [ ] Photos can be added
- [ ] Form validation works
- [ ] Error messages helpful

**Photo Upload**:
- [ ] Camera capture works
- [ ] Gallery picker works
- [ ] Multiple photos can be added
- [ ] Photo preview shows
- [ ] Photo removal works
- [ ] Large files handle gracefully

**Submission**:
- [ ] Submit button works while online
- [ ] Loading indicator appears
- [ ] Success confirmation shows
- [ ] Report appears in list
- [ ] Submit works while offline (queued)

**Pass/Fail**: ☐ PASS  ☐ FAIL
**Issues Found**: ___________________

---

### 4.3 Map Functionality

**Loading**:
- [ ] Map loads within 3 seconds
- [ ] Initial region set correctly
- [ ] No blank tiles

**Interaction**:
- [ ] Zoom in/out works smoothly
- [ ] Pan works in all directions
- [ ] Double-tap zoom works
- [ ] Pinch zoom works
- [ ] Touch responsive

**Markers**:
- [ ] Markers display correctly
- [ ] Marker clustering works (many markers)
- [ ] Marker info window appears
- [ ] Marker taps navigate correct

**Performance**:
- [ ] Smooth at 60 FPS
- [ ] No jank during zoom
- [ ] Memory doesn't spike
- [ ] Can display 1000+ markers

**Pass/Fail**: ☐ PASS  ☐ FAIL
**Issues Found**: ___________________

---

### 4.4 Offline Mode

**Going Offline**:
- [ ] Offline banner appears
- [ ] Offline indicator shows correctly
- [ ] All data still loads from cache
- [ ] UI remains responsive

**User Actions Offline**:
- [ ] Can create report (queued)
- [ ] Changes reflected immediately
- [ ] Pending count shown correctly
- [ ] Can navigate freely

**Going Online**:
- [ ] Orange/amber offline banner changes
- [ ] Sync begins automatically
- [ ] Pending items sync
- [ ] No duplicates created

**Pass/Fail**: ☐ PASS  ☐ FAIL
**Issues Found**: ___________________

---

### 4.5 Network Resilience

**Connection Switching**:
- [ ] WiFi to 4G: works smoothly
- [ ] 4G to WiFi: works smoothly
- [ ] Airplane mode toggle: 5x (no crashes)
- [ ] No duplicate requests

**Slow Network**:
- [ ] App doesn't freeze
- [ ] Loading indicators show
- [ ] Operation eventually succeeds
- [ ] Can retry if timeout

**Connection Loss**:
- [ ] Request queued gracefully
- [ ] Error message not shown
- [ ] Marked as pending
- [ ] Syncs when reconnected

**Pass/Fail**: ☐ PASS  ☐ FAIL
**Issues Found**: ___________________

---

## CATEGORY 5: Performance & Stability

### 5.1 Startup Performance

**Cold Start** (first launch):
- Time: _____ seconds (Target: < 3s)
- No crashes: ☐ Yes

**Warm Start** (app backgrounded, resumed):
- Time: _____ seconds (Target: < 1.5s)
- Data intact: ☐ Yes

**After Restart** (app fully closed, reopened):
- Time: _____ seconds (Target: < 3s)
- Logged in: ☐ Yes (if persistent)

---

### 5.2 Memory Management

**Baseline**:
- App idle memory: _____ MB (Target: < 150MB)

**After Operations**:
- Create 10 reports: _____ MB
- View 100-item list: _____ MB
- Interact with maps: _____ MB
- No memory leaks: ☐ Yes

**Maximum Tested**:
- Worst case memory: _____ MB (Target: < 250MB)
- App still responsive: ☐ Yes

---

### 5.3 Stability Testing

**Crash Tests**:
- [ ] Create report (cycle 5x): No crashes
- [ ] Switch screens (cycle 5x): No crashes
- [ ] Rotate device (cycle 5x): No crashes
- [ ] Toggle offline (cycle 5x): No crashes
- [ ] Rapid button taps: No crashes
- [ ] Large data sets (500 items): No crashes

**Edge Cases**:
- [ ] Empty lists display correctly
- [ ] Very long text displays correctly
- [ ] Special characters in input OK
- [ ] Rapid location changes OK
- [ ] Permissions revoked mid-action OK

**Pass/Fail**: ☐ PASS  ☐ FAIL
**Crash Reports**: ___________________

---

### 5.4 Resource Cleanup

**After Logout**:
- [ ] All timers cleaned up
- [ ] Listeners removed
- [ ] Cache cleared (unless persistent)
- [ ] Network requests cancelled
- [ ] Memory released

**After Navigation**:
- [ ] Previous screen cleaned up
- [ ] Listeners removed
- [ ] Subscriptions cancelled
- [ ] Memory freed

**Pass/Fail**: ☐ PASS  ☐ FAIL

---

## CATEGORY 6: QA Sign-Off

### Overall Assessment

| Category | Status | Notes |
|----------|--------|-------|
| Screen Compatibility | ☐ PASS ☐ FAIL | |
| iOS Testing | ☐ PASS ☐ FAIL | |
| Android Testing | ☐ PASS ☐ FAIL | |
| Functional Features | ☐ PASS ☐ FAIL | |
| Performance | ☐ PASS ☐ FAIL | |
| Stability | ☐ PASS ☐ FAIL | |

### Critical Issues Found

```
[List any blocking/critical issues discovered]


```

### Non-Critical Issues Found

```
[List minor issues, visual glitches, etc.]


```

### Devices Tested

```
iOS:
- _________________________ (iOS version)
- _________________________ (iOS version)

Android:
- _________________________ (Android version)
- _________________________ (Android version)

Tablets:
- _________________________ (OS version)
```

### Performance Summary

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Startup Time | < 3s | _____ | ☐ ✅ ☐ ❌ |
| Memory Idle | < 150MB | _____ | ☐ ✅ ☐ ❌ |
| Scroll FPS | 60 FPS | _____ | ☐ ✅ ☐ ❌ |
| Network Success | > 95% | _____ | ☐ ✅ ☐ ❌ |
| Crash-Free | 100% | _____ | ☐ ✅ ☐ ❌ |

### Recommendation

**Ready for Beta**: ☐ YES ☐ NO

**If NO, reason**:
```


```

---

## Sign-Off

**QA Tester**: _____________________  
**Date**: _____________________  
**Duration**: _____ days  
**Total Devices Tested**: _____ devices  
**Overall Result**: ☐ PASS ☐ FAIL  

**Notes**:
```


```

---

**Next Phase**: Phase 10 - Final Verification & Release  
**Date to Start**: ___________________
