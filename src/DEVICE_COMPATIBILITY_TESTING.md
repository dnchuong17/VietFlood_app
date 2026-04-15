# Device Compatibility & Testing Guide

## Overview

This guide provides comprehensive testing procedures for the VietFlood React Native app across iOS and Android devices, screen sizes, orientations, and edge cases. All major features have been implemented and tested for type safety; this guide ensures runtime compatibility across real devices and various configurations.

## Test Environment Setup

### Prerequisites
- iOS Simulator (multiple models: iPhone 11, 12, 13, 14, SE)
- Android Emulator (multiple models: Pixel 3a, 5, 6 Pro, low-end device with 2GB RAM)
- TestFlight account (Apple Developer)
- Google Play Console account (Google Developer)
- Device testing hardware (at least 2 real devices per OS)

### Target Screen Sizes
- **iOS:** iPhone SE, iPhone 11, iPhone 12 Pro Max, iPad Mini, iPad Pro
- **Android:** Phones (4.5", 5", 6.7"), Tablets (7", 10"), Foldable devices (if available)

### App Build & Installation
```bash
# Build development version
npx expo build

# For iOS: Use development build or Expo Go
eas build --platform ios --profile preview

# For Android: Build and test via EAS
eas build --platform android --profile preview
```

## Test Cases

### 1. Screen Size Compatibility

#### 1.1 iOS iPhone SE (small)
**Device Specs:** 4.7" screen, 375x667px  
**Steps:**
1. Install app on iPhone SE or simulator
2. Launch and navigate all screens
3. Expected: No text cutoff, buttons fully accessible
4. Verify: Responsive layout adjusts font sizes and padding
5. Test: Portrait and landscape orientations

**Priority:** P1 | **Platforms:** iOS

#### 1.2 iOS iPhone 14 Pro Max (large)
**Device Specs:** 6.7" screen, 1284x2778px  
**Steps:**
1. Install app on iPhone 14 Pro or simulator
2. Navigate all screens
3. Expected: Content not stretched, proper spacing
4. Verify: Touch targets not too far apart
5. Test: Both orientations

**Priority:** P1 | **Platforms:** iOS

#### 1.3 iPad Mini (tablet)
**Device Specs:** 7.9" screen, 1024x1366px  
**Steps:**
1. Install app on iPad Mini or simulator
2. Test responsive layout (should adapt to tablet view)
3. Expected: Multi-column layouts where applicable
4. Verify: Side-by-side panels, not stacked
5. Test: Split view if available

**Priority:** P2 | **Platforms:** iOS

#### 1.4 Android Pixel 3a (medium)
**Device Specs:** 5.6" screen, 1080x2220px  
**Steps:**
1. Install app on Pixel 3a or emulator
2. Navigate all screens
3. Expected: Consistent layout with iPhone equivalents
4. Verify: No cutoff content
5. Test: Both orientations

**Priority:** P1 | **Platforms:** Android

#### 1.5 Android Pixel 6 Pro (large)
**Device Specs:** 6.7" screen, 1440x3120px  
**Steps:**
1. Install app on Pixel 6 Pro or emulator
2. Test all screens
3. Expected: Proper scaling, no oversized elements
4. Verify: Touch targets properly sized
5. Test: Both orientations

**Priority:** P1 | **Platforms:** Android

#### 1.6 Android Tablet (if available)
**Device Specs:** 10" display  
**Steps:**
1. Install app on Android tablet
2. Test responsive layout
3. Expected: Optimized for tablet (multi-column where applicable)
4. Verify: Content scaling appropriate
5. Test: Both orientations

**Priority:** P2 | **Platforms:** Android

### 2. Orientation & Rotation

#### 2.1 Portrait to Landscape Rotation (All Screens)
**Steps:**
1. Launch app on any screen
2. Rotate device from portrait to landscape
3. Expected: Layout reflows smoothly without black bars
4. Verify: All content remains visible
5. Verify: No layout shifts or overlapping elements
6. Test: Rotate back to portrait

**Priority:** P1 | **Platforms:** iOS, Android

#### 2.2 Landscape to Portrait Rotation (All Screens)
**Steps:**
1. Open app in landscape
2. Rotate to portrait
3. Expected: Smooth transition, no flicker
4. Verify: Content properly repositioned
5. Verify: Modals/tabs align correctly

**Priority:** P1 | **Platforms:** iOS, Android

#### 2.3 Multiple Rotations in succession
**Steps:**
1. Rapid rotate: portrait → landscape → portrait → landscape
2. Expected: Layout responds correctly each time
3. Verify: No memory leaks or jank
4. Verify: State preserved throughout

**Priority:** P2 | **Platforms:** iOS, Android

#### 2.4 Rotation on Maps and Charts
**Steps:**
1. Open map view or report detail with charts
2. Rotate to landscape
3. Expected: Map/chart expands to full width
4. Verify: Zoom level, region maintained
5. Verify: No double-rendering issues

**Priority:** P2 | **Platforms:** iOS, Android

### 3. Notch & Safe Area Handling

#### 3.1 iPhone With Notch
**Devices:** iPhone 12, 13, 14, 14 Pro (Notch or Dynamic Island)  
**Steps:**
1. Launch app on notch device
2. Verify status bar content not hidden
3. Expected: Navigation buttons below notch/Dynamic Island
4. Verify: Modal headers properly positioned
5. Test: Landscape orientation (side notches)

**Priority:** P1 | **Platforms:** iOS

#### 3.2 iPhone with Dynamic Island
**Device:** iPhone 14 Pro  
**Steps:**
1. Install app on iPhone 14 Pro
2. Test all screens with Dynamic Island visible
3. Expected: Content avoids Dynamic Island area
4. Verify: No overlap with interactive elements

**Priority:** P2 | **Platforms:** iOS

#### 3.3 Android Bottom Navigation (gesture area)
**Device:** Any modern Android (≥ Android 9)  
**Steps:**
1. Enable gesture navigation (hide buttons)
2. Test app with no system buttons visible
3. Expected: SafeArea respected
4. Verify: No buttons hidden by gesture area
5. Verify: Swipe-back gesture still works

**Priority:** P2 | **Platforms:** Android

#### 3.4 Android Split Screen / Foldable
**Device:** Foldable device (if available) or emulator  
**Steps:**
1. On foldable, test in folded and unfolded modes
2. Or: Use split-screen view on Android
3. Expected: App works correctly in constrained space
4. Verify: Responsive breakpoints adapt
5. Verify: Map/large content handles resizing

**Priority:** P2 | **Platforms:** Android

### 4. Status Bar & System UI

#### 4.1 Status Bar Content (iOS)
**Steps:**
1. Test on iPhone with various statuses (battery, WiFi, time)
2. Expected: Content readable above status bar
3. Verify: No text overlap with status bar
4. Verify: SafeArea insets applied correctly

**Priority:** P2 | **Platforms:** iOS

#### 4.2 Status Bar Content (Android)
**Steps:**
1. Test on Android with system icons visible
2. Expected: Content not hidden
3. Verify: Proper padding above status bar

**Priority:** P2 | **Platforms:** Android

#### 4.3 Dark Status Bar (Light Background)
**Steps:**
1. Test screens with light backgrounds
2. Verify: Status bar content readable

**Priority:** P2 | **Platforms:** iOS, Android

### 5. Deep Linking

#### 5.1 Deep Link to Auth Screen
**Steps:**
1. From app-free state, open deep link to protected route
2. Expected: Redirect to login screen
3. Verify: No crash, clean redirect

**Priority:** P1 | **Platforms:** iOS, Android

#### 5.2 Deep Link After Authentication
**Steps:**
1. Login successfully
2. Open deep link to protected screen
3. Expected: Navigate to target screen directly
4. Verify: All data loaded correctly

**Priority:** P1 | **Platforms:** iOS, Android

#### 5.3 Deep Link from Notification (if applicable)
**Steps:**
1. Receive push notification
2. Tap notification link
3. Expected: Navigate to relevant screen
4. Verify: Context preserved

**Priority:** P2 | **Platforms:** iOS, Android

### 6. Performance on Low-End Devices

#### 6.1 Android Low-End Device (2GB RAM, older CPU)
**Device:** Device with ≤ 2GB RAM, Android 8-9  
**Steps:**
1. Install app on low-end Android device
2. Monitor memory usage (DevTools or adb)
3. Navigate through all screens
4. Expected: App doesn't crash due to memory pressure
5. Test: Map with 500+ markers (should cluster correctly)
6. Verify: Animations remain smooth (> 30 FPS)
7. Verify: No excessive frame drops

**Priority:** P1 | **Platforms:** Android

#### 6.2 iOS iPhone SE (2020) - Low Performance
**Device:** iPhone SE 2nd gen or simulator  
**Steps:**
1. Test on performance-limited iOS device
2. Navigate screens and monitor performance
3. Expected: Smooth at 60 FPS
4. Verify: No jank on transitions
5. Verify: Map clustering handles gracefully

**Priority:** P2 | **Platforms:** iOS

#### 6.3 Memory Leak Detection (Low-End)
**Steps:**
1. Open and close screens repeatedly (10+ times each)
2. Monitor memory usage
3. Expected: Memory doesn't grow unboundedly
4. Verify: Stable memory after 5-10 cycles
5. Verify: No memory spike > 10MB between cycles

**Priority:** P2 | **Platforms:** iOS, Android

### 7. Network Conditions

#### 7.1 App on 4G Network
**Steps:**
1. Test on 4G/LTE connection
2. API calls should complete normally
3. Expected: No lag or timeout issues
4. Verify: Images load within 2-3 seconds
5. Verify: Map tiles load smoothly

**Priority:** P2 | **Platforms:** iOS, Android

#### 7.2 App on WiFi (Home/Office)
**Steps:**
1. Test on stable WiFi
2. Expected: All features work smoothly
3. Verify: No unnecessary network requests
4. Verify: Polling updates work correctly

**Priority:** P2 | **Platforms:** iOS, Android

#### 7.3 Network Switch (WiFi ↔ Cellular)
**Steps:**
1. Start on WiFi, then disable
2. App switches to cellular automatically
3. Expected: Seamless transition, no crash
4. Verify: Pending requests not duplicated
5. Verify: Auth token still valid

**Priority:** P1 | **Platforms:** iOS, Android

#### 7.4 Offline Mode (No Network)
**Steps:**
1. Disable WiFi and cellular
2. Use app in offline state
3. Expected: Graceful error messages (not crashes)
4. Verify: Can still navigate cached screens
5. Verify: Forms show clear error when submit attempted

**Priority:** P1 | **Platforms:** iOS, Android

### 8. Feature-Specific Tests

#### 8.1 Map Performance - Markers
**Steps:**
1. Load map with 100 markers
2. Expected: Map responsive, can pan/zoom
3. Load 500 markers
4. Expected: Clustering active, no lag
5. Load 1000+ markers
6. Expected: Still usable, clustering required

**Priority:** P1 | **Platforms:** iOS, Android

#### 8.2 Map Overlay Operations
**Steps:**
1. Load map with weather overlay (rain, wind, etc.)
2. Switch overlays 5-10 times rapidly
3. Expected: Smooth switching, no white flashes
4. Verify: Cache working (second load faster)

**Priority:** P2 | **Platforms:** iOS, Android

#### 8.3 Photo Capture & Upload
**Steps:**
1. Open report creation
2. Capture/select photo from gallery
3. Upload to server
4. Expected: Success message, no crashes
5. Test on slow network (should show progress)

**Priority:** P1 | **Platforms:** iOS, Android

#### 8.4 Location Services
**Steps:**
1. Grant location permission
2. Auto-detect location for report
3. Expected: Coordinates accurate (< 30m)
4. Verify: Works in foreground and background
5. Test with location disabled
6. Expected: Graceful error, can enter manually

**Priority:** P1 | **Platforms:** iOS, Android

#### 8.5 Polling Updates (Operations/Comments)
**Steps:**
1. Open operation with real-time updates
2. Verify polling requests every 5-10 seconds
3. Expected: Live indicator shows "Live"
4. Stop network, polling pauses
5. Expected: "Paused" indicator shown
6. Restore network, polling resumes

**Priority:** P2 | **Platforms:** iOS, Android

### 9. Push Notifications (if implemented)

#### 9.1 Receive Notification While App Foreground
**Steps:**
1. App in foreground
2. Send test notification
3. Expected: Notification banner appears
4. Verify: Tap opens correct screen

**Priority:** P2 | **Platforms:** iOS, Android

#### 9.2 Receive Notification While App Background
**Steps:**
1. Send app to background
2. Send notification
3. Expected: Notification appears in notification center
4. Verify: App launches to correct screen on tap

**Priority:** P2 | **Platforms:** iOS, Android

### 10. Edge Cases

#### 10.1 Very Long Text Input
**Steps:**
1. Type 1000+ character text into text field
2. Expected: No crash, text wraps properly
3. Verify: Submit still works

**Priority:** P2 | **Platforms:** iOS, Android

#### 10.2 Rapid Screen Navigation
**Steps:**
1. Rapidly tap navigation buttons (10+ per second for 3 seconds)
2. Expected: No crash, navigation queue handled
3. Verify: App ends on expected screen

**Priority:** P2 | **Platforms:** iOS, Android

#### 10.3 Memory Warning Handling
**Steps:**
1. On iOS: Trigger memory warning (iOS Simulator menu)
2. On Android: Monitor memory, trigger pressure
3. Expected: App gracefully handles warning
4. Verify: No crash

**Priority:** P2 | **Platforms:** iOS, Android

#### 10.4 App Backgrounding/Foregrounding
**Steps:**
1. Open app, navigate to detail screen
2. Press home to background
3. Wait 5-10 seconds
4. Return to app
5. Expected: Screen state preserved
6. Verify: No reload flicker

**Priority:** P1 | **Platforms:** iOS, Android

#### 10.5 App Terminated & Re-launch
**Steps:**
1. While logged in, force-close app
2. Reopen app
3. Expected: Auto-login if token valid
4. Verify: Previous screen restored (or home)
5. Verify: No data loss

**Priority:** P1 | **Platforms:** iOS, Android

## Test Execution Checklist

### iOS Tests
- [ ] 1.1 iPhone SE screen compatibility
- [ ] 1.2 iPhone 14 Pro Max screen
- [ ] 1.3 iPad Mini tablet
- [ ] 2.1 Portrait to landscape rotation
- [ ] 2.2 Landscape to portrait rotation
- [ ] 2.3 Multiple rotations
- [ ] 2.4 Rotation on maps/charts
- [ ] 3.1 iPhone with notch
- [ ] 3.2 iPhone with Dynamic Island
- [ ] 4.1 Status bar content iOS
- [ ] 4.3 Dark status bar
- [ ] 5.1 Deep link to auth
- [ ] 5.2 Deep link after auth
- [ ] 6.2 iPhone SE performance
- [ ] 7.1 4G network
- [ ] 7.2 WiFi network
- [ ] 7.3 Network switch
- [ ] 7.4 Offline mode
- [ ] 8.1 Map performance - markers
- [ ] 8.2 Map overlay operations
- [ ] 8.3 Photo capture & upload
- [ ] 8.4 Location services
- [ ] 8.5 Polling updates
- [ ] 10.4 App backgrounding
- [ ] 10.5 App terminate & relaunch

### Android Tests
- [ ] 1.4 Pixel 3a screen compatibility
- [ ] 1.5 Pixel 6 Pro screen
- [ ] 1.6 Android tablet (optional)
- [ ] 2.1 Portrait to landscape rotation
- [ ] 2.2 Landscape to portrait rotation
- [ ] 2.3 Multiple rotations
- [ ] 2.4 Rotation on maps/charts
- [ ] 3.3 Android bottom navigation
- [ ] 3.4 Split screen / foldable
- [ ] 4.2 Status bar content Android
- [ ] 4.3 Dark status bar
- [ ] 5.1 Deep link to auth
- [ ] 5.2 Deep link after auth
- [ ] 6.1 Low-end device performance (2GB RAM)
- [ ] 6.3 Memory leak detection
- [ ] 7.1 4G network
- [ ] 7.2 WiFi network
- [ ] 7.3 Network switch
- [ ] 7.4 Offline mode
- [ ] 8.1 Map performance - markers
- [ ] 8.2 Map overlay operations
- [ ] 8.3 Photo capture & upload
- [ ] 8.4 Location services
- [ ] 8.5 Polling updates
- [ ] 10.1 Very long text
- [ ] 10.2 Rapid navigation
- [ ] 10.3 Memory warning
- [ ] 10.4 App backgrounding
- [ ] 10.5 App terminate & relaunch

## Performance Benchmarks

### Target Metrics
- **App Startup Time:** < 2 seconds (cold start)
- **Screen Transition:** < 300ms
- **API Response:** < 1 second (on 4G)
- **Map Rendering:** 60 FPS minimum
- **Memory Usage:** < 100MB during normal use
- **Battery Drain:** < 5% per hour (normal usage)

## Known Issues & Workarounds

(To be filled during testing)

## Test Results Summary

| Category | iOS | Android | Status |
|----------|-----|---------|--------|
| Small screens | ⏳ | ⏳ | Pending |
| Large screens | ⏳ | ⏳ | Pending |
| Rotation | ⏳ | ⏳ | Pending |
| Notch/SafeArea | ⏳ | ⏳ | Pending |
| Deep linking | ⏳ | ⏳ | Pending |
| Performance | ⏳ | ⏳ | Pending |
| Network | ⏳ | ⏳ | Pending |
| Features | ⏳ | ⏳ | Pending |
| Edge cases | ⏳ | ⏳ | Pending |

## Sign-Off

**Tested by:** _____________________  
**Date Range:** _____ to _____  
**iOS Versions:** ____________  
**Android Versions:** ____________  
**Devices Tested:** ____________________________________________

**Overall Status:** [ ] PASS  [ ] FAIL  [ ] PARTIAL

**Critical Issues:**
_____________________________________________________________________________

**Minor Issues:**
_____________________________________________________________________________

**Performance Notes:**
_____________________________________________________________________________

---

## Session 13 Completion Status

✅ Comprehensive device compatibility testing guide created
✅ 40+ test cases covering all major device configurations
✅ iOS & Android specific tests included
✅ Performance benchmarks defined
✅ Edge case scenarios documented
✅ Ready for device lab testing phase
