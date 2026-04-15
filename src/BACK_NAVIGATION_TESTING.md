# Back Navigation Testing Guide

## Overview

This guide provides comprehensive testing procedures for back button and swipe-back navigation across iOS and Android platforms. All navigation components have been implemented with proper back button handling for the back gestures.

## Test Environment Setup

### Prerequisites
- iOS Simulator (iPhone 14 Pro recommended)
- Android Emulator (Pixel 6 Pro/Pixel 7 recommended, API 31+)
- React Native debugger or Flipper installed
- Device testing on actual iOS & Android devices (recommended)

### Installation
```bash
# Install dependencies
npm install

# Start Expo developer server
npx expo start

# For iOS Simulator
# Press 'i' in CLI or manually run:
xcrun simctl openurl booted exp://your-local-ip:8081

# For Android Emulator
# Press 'a' in CLI or manually run:
adb shell am start -a android.intent.action.VIEW -d exp://your-local-ip:8081 com.android.chrome
```

## Test Cases

### 1. Authentication Navigation
**Section:** Auth Screens (Sections 3, 4)

#### 1.1 Login → Back to Auth Screen
**Steps:**
1. Start app and land on auth screen (login/register option)
2. Tap "Login" button
3. Press native back button or swipe back (iOS)
4. Expected: Return to auth landing screen
5. Verify: All state cleared, form inputs reset

**Priority:** P1 | **Platforms:** iOS, Android

#### 1.2 Register → Back to Auth Screen  
**Steps:**
1. Start app and land on auth screen
2. Tap "Register" button
3. Press native back button or swipe back (iOS)
4. Expected: Return to auth landing screen
5. Verify: No form data persists

**Priority:** P1 | **Platforms:** iOS, Android

#### 1.3 Recovery → Back to Login
**Steps:**
1. Navigate to password recovery flow
2. Press back button
3. Expected: Return to login screen
4. Verify: Recovery state cleared

**Priority:** P2 | **Platforms:** iOS, Android

### 2. Protected Route Navigation
**Section:** Navigation Architecture (Section 3)

#### 2.1 Deep Link → Back Through Auth
**Steps:**
1. App in deep-link protected route without auth
2. Redirected to login
3. Press back button
4. Expected: Should navigate to appropriate screen or app home
5. Verify: Auth redirect maintained

**Priority:** P1 | **Platforms:** iOS, Android

#### 2.2 Multi-Level Back Through Screens
**Steps:**
1. Login successfully
2. Navigate: Home → Report Details → Report History
3. Press back 3 times
4. Expected: Return to Home each time, then app minimizes/closes
5. Verify: State preserved at each level

**Priority:** P2 | **Platforms:** iOS, Android

### 3. Home Tab Navigation
**Section:** Home Dashboard (Section 6)

#### 3.1 Tab Switching → Back Button Behavior
**Steps:**
1. Open app (Home tab active)
2. Tap different tab (Relief, Reports, etc.)
3. Press back button
4. Expected: Return to Home tab, not exit app
5. Verify: Tab switches back correctly

**Priority:** P1 | **Platforms:** iOS, Android

#### 3.2 Modal → Back From Modal
**Steps:**
1. On any tab, open a modal (e.g., create action modal)
2. Press back button or tap overlay
3. Expected: Modal dismisses, tab view returns
4. Verify: Modal state not saved

**Priority:** P2 | **Platforms:** iOS, Android

### 4. Relief Operations Navigation
**Section:** Relief Dashboard (Section 9)

#### 4.1 Operations List → Detail → Back
**Steps:**
1. Navigate to Relief Operations List
2. Tap operation card
3. Navigate to detailed view
4. Press back button
5. Expected: Return to operations list with scroll position maintained
6. Verify: List state preserved

**Priority:** P1 | **Platforms:** iOS, Android

#### 4.2 Operation Detail → Resource View → Back
**Steps:**
1. Open operation details
2. Scroll to resources section
3. Tap resource card
4. Press back button (if expanded modal)
5. Expected: Modal dismisses or navigation reverses
6. Verify: Operation detail state preserved

**Priority:** P2 | **Platforms:** iOS, Android

#### 4.3 Operation Detail → Map View → Back
**Steps:**
1. Open operation details
2. Tap map overlay
3. Enter full map view
4. Press back button
5. Expected: Return to operation details
6. Verify: Map zoom level and region preserved

**Priority:** P2 | **Platforms:** iOS, Android

### 5. Report Navigation
**Section:** Reports Feature (Section 8)

#### 5.1 Reports List → Create Form → Back
**Steps:**
1. Navigate to Reports tab
2. Tap "Create Report" button
3. Fill some form fields
4. Press back button
5. Expected: Return to reports list with form discarded
6. Verify: Confirmation dialog (optional) or direct dismiss

**Priority:** P1 | **Platforms:** iOS, Android

#### 5.2 Reports List → Report Detail → Back
**Steps:**
1. Navigate to Reports List
2. Tap existing report
3. Enter detail/view screen
4. Press back button
5. Expected: Return to reports list
6. Verify: List pagination/filtering maintained

**Priority:** P1 | **Platforms:** iOS, Android

#### 5.3 Report Detail → Timeline → Back
**Steps:**
1. Open report details
2. Scroll to timeline section
3. Tap timeline event (if expandable)
4. Press back button
5. Expected: Return to report details
6. Verify: Report data unchanged

**Priority:** P2 | **Platforms:** iOS, Android

### 6. Profile Navigation
**Section:** Profile & Settings (Section 10)

#### 6.1 Home → Profile → Edit → Back
**Steps:**
1. On Home tab, tap profile icon/settings
2. Navigate to profile screen
3. Tap "Edit Profile" button
4. Press back button without saving
5. Expected: Return to profile view (not edited)
6. Verify: Edit form changes discarded

**Priority:** P1 | **Platforms:** iOS, Android

#### 6.2 Profile Edit → Back With Unsaved Changes
**Steps:**
1. Navigate to profile edit
2. Change name/phone fields
3. Press back button
4. Expected: Show confirmation dialog (optional)
5. Verify: Changes discarded or saved based on user action

**Priority:** P2 | **Platforms:** iOS, Android

#### 6.3 Settings → Theme/Language Change → Back
**Steps:**
1. Open settings
2. Change theme (dark/light)
3. Change language
4. Press back button
5. Expected: Return to profile/home with settings applied
6. Verify: Settings persisted to AsyncStorage

**Priority:** P2 | **Platforms:** iOS, Android

### 7. Map & Location Navigation
**Section:** Map Component (Section 7)

#### 7.1 Map Full Screen → Back
**Steps:**
1. Open map view (home map, operation map, report location)
2. Expand to full screen if available
3. Press back button
4. Expected: Return to previous screen or contract map
5. Verify: Map state (zoom, region) preserved

**Priority:** P2 | **Platforms:** iOS, Android

#### 7.2 Location Search → Back
**Steps:**
1. Open location search interface
2. Enter search term
3. Press back button
4. Expected: Return to map with search cleared
5. Verify: Previous location visible

**Priority:** P2 | **Platforms:** iOS, Android

### 8. iOS-Specific: Swipe Back Gesture
**Section:** Navigation Architecture (Section 3)
**Platforms:** iOS only

#### 8.1 Swipe-Back Gesture on Auth Screens
**Steps:**
1. Navigate to login screen
2. Perform right-edge swipe gesture
3. Expected: Smoothly animate back to prev screen
4. Verify: Gesture handler responsive

**Priority:** P1 | **Platforms:** iOS

#### 8.2 Swipe-Back on Protected Routes
**Steps:**
1. Navigate through 2-3 protected screens
2. Swipe back from right edge
3. Expected: Graceful animation and return
4. Verify: No flashing or animation jank

**Priority:** P1 | **Platforms:** iOS

#### 8.3 Swipe-Back Disabled on Tab Screens (if applicable)
**Steps:**
1. On tab-based navigation
2. Attempt swipe-back gesture
3. Expected: Gesture either disabled or switches tab
4. Verify: Expected behavior based on design

**Priority:** P2 | **Platforms:** iOS

### 9. Android-Specific: Back Button Behavior
**Section:** Navigation Architecture (Section 3)
**Platforms:** Android only

#### 9.1 Physical Back Button Navigation
**Steps:**
1. Navigate through multiple screens
2. Press Android physical back button repeatedly
3. Expected: Navigate backwards through stack
4. Verify: Each press goes back one level

**Priority:** P1 | **Platforms:** Android

#### 9.2 Back Button on Stack Root
**Steps:**
1. Navigate to first screen
2. Press back button
3. Expected: Exit app or handle gracefully
4. Verify: App minimizes/closes per Android UX

**Priority:** P1 | **Platforms:** Android

#### 9.3 Back Button with Modal Open
**Steps:**
1. Open modal dialog
2. Press back button
3. Expected: Dismiss modal first
4. Verify: Navigation stack unaffected

**Priority:** P2 | **Platforms:** Android

#### 9.4 Back Button After Hardware Keyboard
**Steps:**
1. Open text input (keyboard visible)
2. Press back button
3. Expected: First dismiss keyboard, then navigate
4. Verify: Two-step behavior correct

**Priority:** P2 | **Platforms:** Android

### 10. Edge Cases & Error Handling
**Section:** Navigation Error Handling

#### 10.1 Back During Network Request
**Steps:**
1. Trigger navigation requiring API call
2. Press back during loading
3. Expected: Navigate back without waiting for response
4. Verify: Request cancelled/ignored gracefully

**Priority:** P2 | **Platforms:** iOS, Android

#### 10.2 Back During Image/File Upload
**Steps:**
1. Start uploading image/file
2. Press back button
3. Expected: Confirm cancellation or complete gracefully
4. Verify: No partial uploads or data corruption

**Priority:** P2 | **Platforms:** iOS, Android

#### 10.3 Back with Pending Form Submission
**Steps:**
1. Submit form (button disabled during submit)
2. Before completion, press back
3. Expected: Back blocked or wait for completion
4. Verify: Two-step validation working

**Priority:** P2 | **Platforms:** iOS, Android

#### 10.4 Back with Multiple Modals Stacked
**Steps:**
1. Open Modal A
2. From Modal A, open Modal B
3. Press back once
4. Expected: B dismisses, A remains
5. Press back again
6. Expected: A dismisses
7. Verify: Stack handling correct

**Priority:** P2 | **Platforms:** iOS, Android

## Test Execution Checklist

### iOS Testing Checklist
- [ ] 1.1 Login back navigation
- [ ] 1.2 Register back navigation
- [ ] 1.3 Recovery back navigation
- [ ] 2.1 Deep link auth back
- [ ] 2.2 Multi-level back
- [ ] 3.1 Tab switching back
- [ ] 3.2 Modal back dismiss
- [ ] 4.1 Operations list detail back
- [ ] 4.2 Operation detail resource back
- [ ] 4.3 Operation detail map back
- [ ] 5.1 Reports create form back
- [ ] 5.2 Reports detail back
- [ ] 5.3 Report timeline back
- [ ] 6.1 Profile edit back
- [ ] 6.2 Profile unsaved changes back
- [ ] 6.3 Settings back with changes
- [ ] 7.1 Map full screen back
- [ ] 7.2 Location search back
- [ ] 8.1 Swipe-back auth screens
- [ ] 8.2 Swipe-back protected routes
- [ ] 8.3 Swipe-back tab screens
- [ ] 10.1 Back during network
- [ ] 10.2 Back during upload
- [ ] 10.3 Back during form submit
- [ ] 10.4 Multiple modals back

### Android Testing Checklist
- [ ] 1.1 Login back navigation
- [ ] 1.2 Register back navigation
- [ ] 1.3 Recovery back navigation
- [ ] 2.1 Deep link auth back
- [ ] 2.2 Multi-level back
- [ ] 3.1 Tab switching back
- [ ] 3.2 Modal back dismiss
- [ ] 4.1 Operations list detail back
- [ ] 4.2 Operation detail resource back
- [ ] 4.3 Operation detail map back
- [ ] 5.1 Reports create form back
- [ ] 5.2 Reports detail back
- [ ] 5.3 Report timeline back
- [ ] 6.1 Profile edit back
- [ ] 6.2 Profile unsaved changes back
- [ ] 6.3 Settings back with changes
- [ ] 7.1 Map full screen back
- [ ] 7.2 Location search back
- [ ] 9.1 Physical back button
- [ ] 9.2 Back button stack root
- [ ] 9.3 Back with modal open
- [ ] 9.4 Back after keyboard
- [ ] 10.1 Back during network
- [ ] 10.2 Back during upload
- [ ] 10.3 Back during form submit
- [ ] 10.4 Multiple modals back

## Test Results Summary

### iOS Results
| Test Case | Status | Notes | Date |
|-----------|--------|-------|------|
| 1.1 | ✅ PASS | Smooth transition | [Date] |
| 1.2 | ✅ PASS | Form properly reset | [Date] |
| ... | ... | ... | ... |

### Android Results
| Test Case | Status | Notes | Date |
|-----------|--------|-------|------|
| 1.1 | ✅ PASS | Both button and gesture | [Date] |
| 1.2 | ✅ PASS | Form cleared correctly | [Date] |
| ... | ... | ... | ... |

## Performance Metrics

### Navigation Timing
- Back animation duration: < 300ms recommended
- Navigation transition: < 500ms recommended
- State restoration: < 100ms recommended

### Memory
- No memory leaks during repeated back navigation
- All listeners/timers properly cleaned up
- Event handlers detached on screen unmount

## Known Issues & Workarounds

(To be filled during testing)

## Sign-Off

**Tested by:** _____________________
**Date:** _____________________
**Device/Emulator:** _____________________
**Expo Version:** _____________________
**Status:** [ ] PASS  [ ] FAIL  [ ] PARTIAL

**Notes:**
_____________________________________________________________________________
_____________________________________________________________________________

## Continuation

This testing can be marked complete once:
1. ✅ All iOS test cases passed
2. ✅ All Android test cases passed
3. ✅ No critical back navigation issues identified
4. ✅ Performance metrics within acceptable range
5. ✅ Edge cases handled gracefully
