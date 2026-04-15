# Authentication Flow Testing Guide

## Overview

This guide provides comprehensive testing procedures for the complete authentication flow including login, registration, token refresh, and logout. All auth flows have been implemented with proper error handling, validation, and secure token storage.

## Test Environment Setup

### Prerequisites
- React Native 0.84 with Expo 55 installed
- iOS Simulator and/or Android Emulator
- Postman or similar API testing tool (optional)
- Device testing on real iOS & Android devices (recommended)

### API Endpoints Used
- `POST /auth/sign-in` - User login
- `POST /auth/sign-up` - User registration
- `POST /auth/refresh-token` - Token refresh
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `PATCH /auth/profile` - Update user profile

### Secure Storage
- Token stored in Expo Secure Store
- AsyncStorage for non-sensitive user preferences

## Test Cases

### 1. Registration Flow

#### 1.1 Successful Registration
**Steps:**
1. Launch app on auth screen
2. Tap "Register" button
3. Enter valid email: `test-user-${timestamp}@example.com`
4. Enter password: `SecurePass123!@`
5. Enter phone (optional): `0123456789`
6. Tap "Sign Up" button
7. Expected: Show loading indicator, then redirect to home after success
8. Verify: User logged in, token stored securely, profile data displayed

**Priority:** P1 | **Platforms:** iOS, Android

#### 1.2 Registration - Email Already Exists
**Steps:**
1. Register with email
2. Logout
3. Attempt registration with same email
4. Expected: Show error "Email already registered"
5. Verify: No duplicate account created

**Priority:** P1 | **Platforms:** iOS, Android

#### 1.3 Registration - Invalid Email Format
**Steps:**
1. Enter invalid email: `not-an-email`
2. Enter password: `SecurePass123!@`
3. Tap "Sign Up"
4. Expected: Show validation error "Invalid email format"
5. Verify: Button disabled or form shows error state

**Priority:** P1 | **Platforms:** iOS, Android

#### 1.4 Registration - Weak Password
**Steps:**
1. Enter email: `test@example.com`
2. Enter weak password: `weak`
3. Expected: Show validation error immediately or on submit
4. Verify: Password strength requirements enforced

**Priority:** P1 | **Platforms:** iOS, Android

#### 1.5 Registration - Missing Required Fields
**Steps:**
1. Leave email or password empty
2. Attempt to submit
3. Expected: Show validation errors on empty fields
4. Verify: Submit button disabled if fields incomplete

**Priority:** P1 | **Platforms:** iOS, Android

#### 1.6 Registration - Network Error Handling
**Steps:**
1. Simulate network error (disable WiFi/mobile)
2. Attempt registration
3. Expected: Show network error message
4. Verify: User can retry or go back

**Priority:** P2 | **Platforms:** iOS, Android

#### 1.7 Registration - Timeout Handling
**Steps:**
1. Register with network latency
2. No response for 30+ seconds  
3. Expected: Show timeout error with retry option
4. Verify: Graceful error state, no hanging

**Priority:** P2 | **Platforms:** iOS, Android

#### 1.8 Registration - Phone Number Validation (Optional)
**Steps:**
1. Enter valid Vietnamese phone (0901234567 or +84901234567)
2. Expected: Phone validated and stored
3. Verify: Format preserved correctly

**Priority:** P2 | **Platforms:** iOS, Android

### 2. Login Flow

#### 2.1 Successful Login
**Steps:**
1. Launch app on auth screen
2. Go to login screen
3. Enter registered email
4. Enter correct password
5. Tap "Login" button
6. Expected: Show loading, redirect to home after success
7. Verify: Token stored, user profile data loaded

**Priority:** P1 | **Platforms:** iOS, Android

#### 2.2 Login - Wrong Password
**Steps:**
1. Enter registered email
2. Enter incorrect password
3. Tap "Login"
4. Expected: Show error "Invalid email or password"
5. Verify: No token stored, user not logged in

**Priority:** P1 | **Platforms:** iOS, Android

#### 2.3 Login - Non-existent Email
**Steps:**
1. Enter non-registered email
2. Enter any password
3. Tap "Login"
4. Expected: Show error "Invalid email or password" (generic for security)
5. Verify: User not logged in

**Priority:** P1 | **Platforms:** iOS, Android

#### 2.4 Login - Invalid Email Format
**Steps:**
1. Enter invalid email format
2. Expected: Show validation error before API call
3. Verify: Submit call not made with invalid email

**Priority:** P1 | **Platforms:** iOS, Android

#### 2.5 Login - Empty Credentials
**Steps:**
1. Leave email or password empty
2. Try to submit
3. Expected: Show validation errors
4. Verify: Submit button disabled

**Priority:** P1 | **Platforms:** iOS, Android

#### 2.6 Login - Multiple Attempts (Brute Force Protection)
**Steps:**
1. Attempt login 5+ times with wrong password
2. Expected: Account might be temporarily locked or rate-limited
3. Verify: Security measures in place (if implemented)

**Priority:** P2 | **Platforms:** iOS, Android

#### 2.7 Login - Remember Me (if implemented)
**Steps:**
1. Login with "Remember Me" checked
2. Close app
3. Reopen app
4. Expected: Auto-logged in if token valid
5. Verify: User not redirected to login

**Priority:** P2 | **Platforms:** iOS, Android

#### 2.8 Login - Network Error
**Steps:**
1. Disable network
2. Attempt login
3. Expected: Show network error with retry option
4. Verify: Can retry after network restored

**Priority:** P2 | **Platforms:** iOS, Android

### 3. Token Refresh Flow

#### 3.1 Automatic Token Refresh
**Steps:**
1. Login successfully
2. Simulate token about to expire (mock time or wait)
3. Make API call (e.g., fetch operations)
4. Expected: Auto-refresh token silently before API call
5. Verify: No user interruption, call succeeds

**Priority:** P1 | **Platforms:** iOS, Android

#### 3.2 Token Refresh - Expired Refresh Token
**Steps:**
1. Login successfully
2. Wait for refresh token to expire (or mock it)
3. Make API call that triggers refresh
4. Expected: Show "Session expired" error
5. Verify: Redirect to login screen
6. Verify: User must re-authenticate

**Priority:** P1 | **Platforms:** iOS, Android

#### 3.3 Token Refresh - Network Error During Refresh
**Steps:**
1. Trigger token refresh
2. Disable network during refresh
3. Expected: Show network error or retry after recovery
4. Verify: Not stuck in error state

**Priority:** P2 | **Platforms:** iOS, Android

#### 3.4 Token Exchange (OAuth if implemented)
**Steps:**
1. If OAuth supported, test token exchange flow
2. Expected: Proper token exchange from provider
3. Verify: Token stored securely in local storage

**Priority:** P2 | **Platforms:** iOS, Android

#### 3.5 Multiple Requests with Token Refresh
**Steps:**
1. Login
2. Make multiple simultaneous API requests
3. Trigger token refresh mid-requests
4. Expected: All requests wait/retry with new token
5. Verify: No race conditions or duplicate refreshes

**Priority:** P2 | **Platforms:** iOS, Android

### 4. Logout Flow

#### 4.1 Logout Success
**Steps:**
1. Login successfully
2. Tap "Logout" button (usually in profile/settings)
3. Expected: User logged out, redirected to login screen
4. Verify: Token cleared from secure storage
5. Verify: User data cleared from context

**Priority:** P1 | **Platforms:** iOS, Android

#### 4.2 Logout - Network Error
**Steps:**
1. Login successfully
2. Disable network
3. Tap "Logout"
4. Expected: Show error or continue with local cleanup
5. Verify: User session cleared locally even if API fails

**Priority:** P2 | **Platforms:** iOS, Android

#### 4.3 Logout - Prevent Navigation After Logout
**Steps:**
1. Logout and return to login
2. Use back button
3. Expected: Cannot navigate back to protected screens
4. Verify: Navigation stack properly cleared

**Priority:** P1 | **Platforms:** iOS, Android

#### 4.4 Logout from Background
**Steps:**
1. Login, navigate to different screen
2. Go to settings and logout
3. Expected: Return to login properly
4. Verify: All screens properly reset

**Priority:** P2 | **Platforms:** iOS, Android

#### 4.5 Logout - API Call After Logout
**Steps:**
1. Login and get token
2. Logout
3. Try to manually call API with old token
4. Expected: Request fails (401 Unauthorized)
5. Verify: Token properly invalidated

**Priority:** P2 | **Platforms:** iOS, Android

### 5. Session Persistence

#### 5.1 App Restart - Token Valid
**Steps:**
1. Login successfully
2. Close app completely
3. Reopen app
4. Expected: App checks token, auto-logs in if valid
5. Verify: User sees home screen, not login

**Priority:** P1 | **Platforms:** iOS, Android

#### 5.2 App Restart - Token Expired
**Steps:**
1. Login successfully
2. Wait for token to expire (or simulate)
3. Close and reopen app
4. Expected: App detects expired token, shows login
5. Verify: Clean redirect to auth screen

**Priority:** P1 | **Platforms:** iOS, Android

#### 5.3 App Restart - No Token
**Steps:**
1. Fresh install or after clearing app data
2. Open app
3. Expected: Show login/register screen
4. Verify: No crash or error state

**Priority:** P1 | **Platforms:** iOS, Android

#### 5.4 Session Hydration - Profile Data
**Steps:**
1. Login successfully
2. Verify profile data loaded (name, email, role)
3. Close app
4. Reopen app
5. Expected: Profile data still available
6. Verify: No unnecessary API call to fetch profile

**Priority:** P2 | **Platforms:** iOS, Android

### 6. Profile Operations

#### 6.1 Fetch Profile - Authenticated
**Steps:**
1. Login successfully
2. Navigate to profile screen
3. Expected: Profile data displayed (name, email, phone, role)
4. Verify: Data from authenticated GET /auth/profile endpoint

**Priority:** P1 | **Platforms:** iOS, Android

#### 6.2 Update Profile - Name Only
**Steps:**
1. On profile edit screen
2. Change name field
3. Tap "Save"
4. Expected: Show loading, then success message
5. Verify: Profile updated in API and UI

**Priority:** P1 | **Platforms:** iOS, Android

#### 6.3 Update Profile - Phone Only
**Steps:**
1. On profile edit screen
2. Change phone field
3. Tap "Save"
4. Expected: Profile updated
5. Verify: Phone format validated and saved

**Priority:** P1 | **Platforms:** iOS, Android

#### 6.4 Update Profile - Multiple Fields
**Steps:**
1. Change name AND phone
2. Tap "Save"
3. Expected: Both fields updated together
4. Verify: Single PATCH request sent

**Priority:** P2 | **Platforms:** iOS, Android

#### 6.5 Update Profile - Token Expired
**Steps:**
1. Trigger profile update
2. Token expires during update
3. Expected: Auto-refresh token and retry
4. Verify: Update succeeds after refresh

**Priority:** P2 | **Platforms:** iOS, Android

#### 6.6 Update Profile - Validation Error
**Steps:**
1. Enter invalid data (e.g., name too short)
2. Expected: Show validation error
3. Verify: API not called with invalid data

**Priority:** P2 | **Platforms:** iOS, Android

### 7. Role-Based Access

#### 7.1 Login as Regular User
**Steps:**
1. Register/Login as user without relief worker role
2. Navigate to Relief Dashboard
3. Expected: Access denied or redirected
4. Verify: Role check working

**Priority:** P1 | **Platforms:** iOS, Android

#### 7.2 Login as Relief Worker
**Steps:**
1. Login as user with relief worker role
2. Navigate to Relief Dashboard
3. Expected: Can access operations list and details
4. Verify: Role-based access control working

**Priority:** P1 | **Platforms:** iOS, Android

#### 7.3 Role Change - App Restart Needed
**Steps:**
1. Login as user
2. Admin changes user role to relief worker
3. Without logout, try to access relief dashboard
4. Expected: Might need logout/login to see changes
5. Verify: Behavior documented and consistent

**Priority:** P2 | **Platforms:** iOS, Android

### 8. Error Handling & Recovery

#### 8.1 API Error 400 - Bad Request
**Steps:**
1. Send malformed request (intentionally)
2. Expected: Show user-friendly error message
3. Verify: Technical details not exposed

**Priority:** P2 | **Platforms:** iOS, Android

#### 8.2 API Error 401 - Unauthorized
**Steps:**
1. Use expired/invalid token
2. Make API call
3. Expected: Redirect to login
4. Verify: Token cleared

**Priority:** P1 | **Platforms:** iOS, Android

#### 8.3 API Error 403 - Forbidden
**Steps:**
1. Try to access resource without permission
2. Expected: Show "Access Denied" error
3. Verify: Not redirected to login (auth ok, just forbidden)

**Priority:** P2 | **Platforms:** iOS, Android

#### 8.4 API Error 500 - Server Error
**Steps:**
1. Server returns 500 error
2. Expected: Show generic error message
3. Verify: User can retry

**Priority:** P2 | **Platforms:** iOS, Android

#### 8.5 Connection Timeout
**Steps:**
1. No internet or very slow connection
2. Timeout waiting for response
3. Expected: Show timeout error
4. Verify: User can retry or cancel

**Priority:** P2 | **Platforms:** iOS, Android

### 9. Security

#### 9.1 Token Storage Security (Secure Store)
**Steps:**
1. Login and store token
2. Open device settings/files
3. Expected: Token not visible in plain text
4. Verify: Using secure keychain/secure storage

**Priority:** P1 | **Platforms:** iOS, Android

#### 9.2 Sensitive Data Not Logged
**Steps:**
1. Login successfully
2. Check app logs/console
3. Expected: Password/token not logged
4. Verify: Security best practices followed

**Priority:** P1 | **Platforms:** iOS, Android

#### 9.3 Password Transmitted Over HTTPS
**Steps:**
1. Monitor network requests
2. Login request made
3. Expected: Connection encrypted (HTTPS)
4. Verify: URL starts with https://

**Priority:** P1 | **Platforms:** iOS, Android

#### 9.4 Token Not Sent in URL
**Steps:**
1. Monitor API requests
2. Token should be in headers, not URL
3. Expected: Authorization header used
4. Verify: Token in `Authorization: Bearer {token}`

**Priority:** P1 | **Platforms:** iOS, Android

#### 9.5 CORS Handling
**Steps:**
1. If cross-origin requests made
2. Expected: Proper CORS headers in responses
3. Verify: No security warnings

**Priority:** P2 | **Platforms:** iOS, Android

## Test Data

### Valid Test Accounts
```
Email: test@example.com
Password: SecurePass123!@

Email: relief-worker@example.com
Password: SecurePass123!@
Role: relief_worker
```

### Invalid Test Data
```
Email: invalid-email
Password: weak
Phone: not-a-phone
```

## Test Execution Checklist

### Registration Tests
- [ ] 1.1 Successful registration
- [ ] 1.2 Email already exists
- [ ] 1.3 Invalid email format
- [ ] 1.4 Weak password
- [ ] 1.5 Missing required fields
- [ ] 1.6 Network error
- [ ] 1.7 Timeout handling
- [ ] 1.8 Phone number validation

### Login Tests
- [ ] 2.1 Successful login
- [ ] 2.2 Wrong password
- [ ] 2.3 Non-existent email
- [ ] 2.4 Invalid email format
- [ ] 2.5 Empty credentials
- [ ] 2.6 Multiple attempts
- [ ] 2.7 Remember me
- [ ] 2.8 Network error

### Token Refresh Tests
- [ ] 3.1 Automatic token refresh
- [ ] 3.2 Expired refresh token
- [ ] 3.3 Network error during refresh
- [ ] 3.4 Token exchange
- [ ] 3.5 Multiple requests with refresh

### Logout Tests
- [ ] 4.1 Logout success
- [ ] 4.2 Logout network error
- [ ] 4.3 Prevent navigation after logout
- [ ] 4.4 Logout from background
- [ ] 4.5 API call after logout

### Session Persistence Tests
- [ ] 5.1 App restart - token valid
- [ ] 5.2 App restart - token expired
- [ ] 5.3 App restart - no token
- [ ] 5.4 Session hydration - profile data

### Profile Operations Tests
- [ ] 6.1 Fetch profile - authenticated
- [ ] 6.2 Update profile - name only
- [ ] 6.3 Update profile - phone only
- [ ] 6.4 Update profile - multiple fields
- [ ] 6.5 Update profile - token expired
- [ ] 6.6 Update profile - validation error

### Role-Based Access Tests
- [ ] 7.1 Login as regular user
- [ ] 7.2 Login as relief worker
- [ ] 7.3 Role change

### Error Handling Tests
- [ ] 8.1 API error 400
- [ ] 8.2 API error 401
- [ ] 8.3 API error 403
- [ ] 8.4 API error 500
- [ ] 8.5 Connection timeout

### Security Tests
- [ ] 9.1 Token storage security
- [ ] 9.2 Sensitive data not logged
- [ ] 9.3 HTTPS encryption
- [ ] 9.4 Token in headers
- [ ] 9.5 CORS handling

## Results

### Test Summary
| Category | Total | Passed | Failed | Status |
|----------|-------|--------|--------|--------|
| Registration | 8 | 0 | 0 | ⏳ Pending |
| Login | 8 | 0 | 0 | ⏳ Pending |
| Token Refresh | 5 | 0 | 0 | ⏳ Pending |
| Logout | 5 | 0 | 0 | ⏳ Pending |
| Session | 4 | 0 | 0 | ⏳ Pending |
| Profile | 6 | 0 | 0 | ⏳ Pending |
| Role-Based | 3 | 0 | 0 | ⏳ Pending |
| Error Handling | 5 | 0 | 0 | ⏳ Pending |
| Security | 5 | 0 | 0 | ⏳ Pending |
| **TOTAL** | **49** | **0** | **0** | **⏳ Pending** |

### Sign-Off

**Tested by:** _____________________
**Date:** _____________________
**Platform:** iOS / Android (Circle one or both)
**Overall Status:** [ ] PASS  [ ] FAIL  [ ] PARTIAL

**Critical Issues Found:**
_____________________________________________________________________________

**Minor Issues Found:**
_____________________________________________________________________________

**Notes:**
_____________________________________________________________________________

## Task Status: 4.7
✅ Comprehensive auth flow testing guide created and documented
✅ All auth flows covering: registration, login, token refresh, logout
✅ 49 test cases covering happy path, error paths, security, and edge cases
✅ Clear pass/fail criteria for each test case
✅ Ready for execution on iOS and Android platforms
