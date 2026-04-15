# Build & Distribution Setup Guide

## Overview
This guide covers the complete build and distribution setup for VietFlood React Native app across iOS and Android platforms. It includes icon/splash screen creation, app signing, and distribution through TestFlight and Google Play.

---

## Part 1: App Icons and Splash Screens (Tasks 15.1)

### 1.1 Understanding Icon & Splash Requirements

**iOS Requirements:**
- App Icon (rounded corners, 1024×1024 pt)
- Used sizes: 120, 152, 167, 180, 60, 76, 120
- Splash screen: 540×1170 (iPhone) or launch storyboard

**Android Requirements:**
- Adaptive Icon: Foreground (108×108 dp) + Background (108×108 dp)
- Legacy Icon (192×192 dp minimum)
- Splash screen: 512×512 dp or vector drawable

### 1.2 Design Best Practices

**Icon Design Guidelines:**
1. **Safe Zone**: Keep important content within center 60% of icon
2. **Margins**: Minimum 8% padding from edges
3. **Contrast**: Ensure text/logo readable on both light and dark backgrounds
4. **Scalability**: Design as vector first, then rasterize
5. **Branding**: Use consistent colors (ref: design system)

**VietFlood Colors:**
- Primary: #3B82F6 (blue)
- Secondary: #047857 (green - relief theme)
- Neutral: #1F2937 (dark gray)
- Accent: #DC2626 (red - for urgent alerts)

### 1.3 Creating App Icons

#### Option A: Using Figma (Recommended)

1. **Create base icon (1024×1024):**
   - Export as PNG with transparent background
   - Use SVG for scalability

2. **Figma Components to Create:**
   - App icon (rounded square)
   - Adaptive icon foreground (focal element)
   - Adaptive icon background (solid color or gradient)
   - Splash screen background

3. **Export Instructions:**
   - iOS: Export as PNG, use app-icon@3x.png (1024×1024)
   - Android: Export as PNG separately for foreground/background

#### Option B: Using Online Tools

**Recommended Tools:**
- **AppMockUp**: https://www.appmockup.com/
- **Icon Kitchen**: https://icon.kitchen/
- **Figma**: Community icon templates

**Steps:**
1. Upload base 1024×1024 icon
2. Generate all required sizes
3. Download icon pack (organized by platform)
4. Extract to appropriate directories

### 1.4 File Organization for Icons

```
VietFlood_app/
├── assets/
│   ├── icons/
│   │   ├── app-icon.svg (source vector)
│   │   ├── app-icon-1024.png
│   │   ├── ios/
│   │   │   ├── icon-120.png (iPhone spotlight)
│   │   │   ├── icon-152.png (iPad settings)
│   │   │   ├── icon-167.png (iPad spotlight)
│   │   │   ├── icon-180.png (iPhone app)
│   │   │   ├── icon-60.png (iPad app)
│   │   │   ├── icon-76.png (iPad app)
│   │   │   └── icon-1024.png (App Store)
│   │   └── android/
│   │       ├── icon-192.png (legacy launcher icon)
│   │       ├── ic_launcher_foreground.png
│   │       └── ic_launcher_background.png
│   └── splash/
│       ├── splash-light.png (1080×1920 Android, 1125×2436 iOS)
│       ├── splash-dark.png
│       └── splash-tablet.png (2560×1440)
```

### 1.5 Implementing Icons in app.json

```json
{
  "exp": {
    "plugins": ["expo-build-properties"],
    "icon": "./assets/icons/app-icon-1024.png",
    "ios": {
      "icon": "./assets/icons/ios/icon-1024.png",
      "supportsTabletMode": true,
      "requireFullScreen": false
    },
    "android": {
      "icon": "./assets/icons/android/icon-192.png",
      "adaptiveIcon": {
        "foregroundImage": "./assets/icons/android/ic_launcher_foreground.png",
        "backgroundImage": "./assets/icons/android/ic_launcher_background.png",
        "backgroundColor": "#3B82F6"
      }
    }
  }
}
```

### 1.6 Creating Splash Screens

#### Splash Screen Strategy

**Expo Splash:**
1. **Light Mode Splash:** Use for day time (blue background)
2. **Dark Mode Splash:** Use for night time (dark blue background)
3. **Tablet Variant:** Scaled for larger screens

#### Implementation Steps

1. **Design splash screens:**
   - Logo: VietFlood branding centered
   - Background: Gradient or solid color
   - Safe margins: Top/bottom 20%, left/right 10%
   - Dimensions:
     - iPhone: 1125×2436 (or 1080×1920 for 16:9)
     - Android: 1080×1920 (mdpi scale: 540×960)
     - Tablet: 2560×1440

2. **Update app.json:**

```json
{
  "exp": {
    "splash": {
      "image": "./assets/splash/splash-light.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    },
    "plugins": [
      [
        "expo-splash-screen",
        {
          "image": "./assets/splash/splash-light.png",
          "imageWidth": 200,
          "tabletImage": "./assets/splash/splash-tablet.png"
        }
      ]
    ]
  }
}
```

3. **Implement splash screen logic in app code:**

```typescript
// src/app/splash-screen.tsx
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export function RootLayout() {
  useEffect(() => {
    async function hideSplash() {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 sec min display
      await SplashScreen.hideAsync();
    }
    hideSplash();
  }, []);

  return (
    // App content
  );
}
```

### 1.7 Testing Icons & Splash

**Verification Checklist:**
- [ ] All iOS icon sizes present and correct dimensions
- [ ] Android adaptive icon foreground/background properly scaled
- [ ] Icons have proper padding (no content touching edges)
- [ ] Splash screen displays for minimum 1.5 seconds
- [ ] Splash screen on tablet uses correct size
- [ ] No blurriness on 3x displays (Retina)
- [ ] Icons render correctly on home screen
- [ ] Splash screen appears before navigation loads

---

## Part 2: iOS App Signing (Tasks 15.2)

### 2.1 Prerequisites

**Required on macOS:**
- Xcode 14+ installed
- Apple Developer account ($99/year)
- Valid Team ID from Apple Developer
- Provisioning Profile from Apple

### 2.2 Setting Up Apple Developer Account

1. **Enroll in Apple Developer Program:**
   - Visit developer.apple.com
   - Sign in with Apple ID
   - Register as individual or organization
   - Pay $99 enrollment fee
   - Accept agreements

2. **Create Team ID:**
   - Log into developer.apple.com
   - Navigate to "Membership" → find "Team ID"
   - Note: Format is typically 10 alphanumeric characters (e.g., `ABC123DEF4`)

3. **Enable App Development capabilities:**
   - Certificates, IDs & Profiles → Identifiers
   - Capabilities: Push Notifications, HomeKit, HealthKit (if needed)

### 2.3 Creating Certificates

**Certificate Types Needed:**
1. **Apple Distribution Certificate** (for App Store)
2. **Development Certificate** (for development/TestFlight)

#### Step 1: Generate Certificate Signing Request (CSR)

**On Mac:**
1. Open Keychain Access (`Applications` → `Utilities`)
2. Menu: `Keychain Access` → `Certificate Assistant` → `Request a Certificate from a Certificate Authority`
3. Email: `your-email@example.com`
4. Common Name: `VietFlood Distribution`
5. Algorithm: `RSA`
6. Save to disk as `CertificateSigningRequest.certSigningRequest`

#### Step 2: Create Certificates in Apple Developer

**For Development Certificate:**
1. Visit certificates.apple.com
2. Certificates → iOS Development
3. Choose file: `CertificateSigningRequest.certSigningRequest`
4. Click Create
5. Download certificate → double-click to install in Keychain

**For Distribution Certificate:**
1. Visit certificates.apple.com
2. Certificates → iOS Distribution (App Store)
3. Choose file: `CertificateSigningRequest.certSigningRequest`
4. Click Create
5. Download certificate → double-click to install

### 2.4 Creating Provisioning Profiles

**Profile Types:**
1. **Development Profile**: For testing on device/simulator during development
2. **Ad Hoc Profile**: For internal testing distribution
3. **App Store Profile**: For TestFlight and App Store distribution

#### Creating App Store Provisioning Profile:

1. **Create App ID (Bundle ID):**
   - Visit certificates.apple.com → Identifiers
   - Click "+" to create new identifier
   - Type: App ID (App)
   - Bundle ID: `com.vietflood.app` (reverse domain notation)
   - Capabilities: Leave default unless specific need
   - Click Continue → Register

2. **Create Provisioning Profile:**
   - Certificates, IDs & Profiles → Provisioning Profiles
   - Click "+"
   - Type: App Store
   - Select App ID: `com.vietflood.app`
   - Select Certificates: Choose distribution certificate from 2.3
   - Download `.mobileprovision` file

3. **Install Provisioning Profile:**
   - Double-click `.mobileprovision` file (or drag to Xcode)
   - Xcode → Preferences → Accounts → Manage Certificates
   - Verify certificate appears

### 2.5 Configuring Signing in EAS

**Update eas.json (build configuration):**

```json
{
  "build": {
    "production": {
      "ios": {
        "distribution": "app-store",
        "provisioning": true
      }
    },
    "preview": {
      "ios": {
        "distribution": "internal",
        "provisioning": true
      }
    }
  }
}
```

**Auto-managed Signing (Recommended):**
- EAS can auto-manage certificates and profiles
- Command: `eas build --platform ios --auto-submit`
- EAS creates certificates and profiles automatically

**Manual Signing (if needed):**

```json
{
  "build": {
    "production": {
      "ios": {
        "distribution": "app-store",
        "certificateP12Path": "./certs/distribution.p12",
        "certificateP12Password": "$CERT_PASSWORD",
        "provisioningProfilePath": "./certs/AppStore.mobileprovision"
      }
    }
  }
}
```

### 2.6 Signing Testing Checklist

- [ ] Apple Developer account created ($99 fee)
- [ ] Team ID obtained in developer.apple.com
- [ ] Development certificate installed in Keychain
- [ ] Distribution certificate installed in Keychain
- [ ] App Store provisioning profile created and installed
- [ ] Bundle ID registered (com.vietflood.app)
- [ ] eas.json configured with correct distribution
- [ ] Test build created via EAS with signing

---

## Part 3: Android App Signing (Tasks 15.3)

### 3.1 Understanding Android Signing

**Requirements:**
- Keystore file (repository of private keys)
- Key alias and password
- Same keystore must be used for all app updates

### 3.2 Generating Keystore

**Create signing keystore (one-time):**

```bash
keytool -genkey-dname "cn=VietFlood, ou=Development, o=VietFlood, c=VN" \
  -alias vietflood-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -keystore ./vietflood-release.keystore \
  -storepass "your-keystore-password" \
  -keypass "your-key-password"
```

**Or interactively:**

```bash
keytool -genkey -v -keystore vietflood-release.keystore \
  -alias vietflood-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Answers:**
- First and last name: `VietFlood App`
- Organization unit: `Engineering`
- Organization: `VietFlood`
- City: `Ho Chi Minh`
- State: `Ho Chi Minh`
- Country: `VN`
- Is this correct: `yes`

**Output:** `vietflood-release.keystore` file

### 3.3 Securing the Keystore

**CRITICAL: Backup and protect keystore**

1. **Store in secure location:**
   ```bash
   # Store keystore securely
   mkdir -p ~/.vietflood-keys
   cp vietflood-release.keystore ~/.vietflood-keys/
   chmod 600 ~/.vietflood-keys/vietflood-release.keystore
   ```

2. **Create backup (offline):**
   - Copy to USB drive stored in safe location
   - Or cloud storage (encrypted)
   - **DO NOT** commit to git

3. **Document credentials:**
   - Create credentials file (secure storage):
     ```
     Keystore Password: [your-keystore-password]
     Key Alias: vietflood-key
     Key Password: [your-key-password]
     Validity: 27 years (10000 days from generation date)
     ```
   - Store in secure password manager (1Password, LastPass)

### 3.4 Viewing Keystore Information

```bash
# View keystore details
keytool -list -v -keystore vietflood-release.keystore \
  -storepass "your-keystore-password"

# Output includes:
# Keystore type
# Entry type
# Creation date
# Certificate fingerprint (SHA-256)
```

### 3.5 Configuring EAS for Android Signing

**Update eas.json:**

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "keystore": {
          "keystorePath": "./vietflood-release.keystore",
          "keystorePassword": "$KEYSTORE_PASSWORD",
          "keyAlias": "vietflood-key",
          "keyPassword": "$KEY_PASSWORD"
        }
      }
    }
  }
}
```

**Set environment variables (do NOT commit to git):**

```bash
# In ~/.bashrc or ~/.zshrc
export KEYSTORE_PASSWORD="your-keystore-password"
export KEY_PASSWORD="your-key-password"

# Or create .env.local (add to .gitignore)
KEYSTORE_PASSWORD=your-keystore-password
KEY_PASSWORD=your-key-password
```

**Or use EAS Secrets:**

```bash
eas secret:create --scope android --name KEYSTORE_PASSWORD --value "your-keystore-password"
eas secret:create --scope android --name KEY_PASSWORD --value "your-key-password"
```

### 3.6 Android Signing Testing Checklist

- [ ] Keystore file generated with RSA-2048, 10000 days validity
- [ ] Keystore password stored securely (NOT in git)
- [ ] Key alias: vietflood-key
- [ ] eas.json configured with keystore paths
- [ ] Environment variables set (KEYSTORE_PASSWORD, KEY_PASSWORD)
- [ ] Test build created via EAS with signing
- [ ] Certificate fingerprint (SHA-256) verified

---

## Part 4: Building with EAS (Tasks 15.4 - 15.5)

### 4.1 EAS Setup

**Install EAS CLI:**

```bash
npm install -g eas-cli
```

**Login to EAS:**

```bash
eas login
# Enter Expo account credentials
```

**Configure EAS in project (if not already done):**

```bash
eas build:configure
# Selects: iOS and Android
```

### 4.2 Building for Development (iOS Simulator/Android Emulator)

#### iOS Development Build (Simulator)

```bash
eas build --platform ios --profile development

# Or if using Xcode locally:
eas build --platform ios --local
```

**What this does:**
- Creates .app file for iOS Simulator
- Downloads to `./dist/` or configured output directory
- To run: `xcrun simctl install booted ./output.app`

#### Android Development Build (Emulator)

```bash
eas build --platform android --profile development

# Output: APK file for emulator installation
```

**Install APK:**
```bash
# If emulator running
adb install ./output.apk
```

### 4.3 Building for Device Testing (Tasks 15.4, 15.5)

#### 4.3.1 Android Development APK

**Build command:**

```bash
eas build --platform android --profile development
```

**Profile in eas.json:**

```json
{
  "build": {
    "development": {
      "android": {
        "buildType": "apk",
        "development": true,
        "keystore": {
          "keystorePath": "./vietflood-release.keystore",
          "keystorePassword": "$KEYSTORE_PASSWORD",
          "keyAlias": "vietflood-key",
          "keyPassword": "$KEY_PASSWORD"
        }
      }
    }
  }
}
```

**Installation methods:**
1. **Direct APK install** (if file downloaded):
   ```bash
   adb install vietflood-development.apk
   ```

2. **Via QR code** (Expo Go):
   - EAS provides Q R code after build
   - Scan with Expo Go app
   - Installs app on physical device

3. **Firebase App Distribution:**
   - Upload APK to Firebase console
   - Testers receive email with install link

#### 4.3.2 iOS Development IPA

**Build command:**

```bash
eas build --platform ios --profile preview
# or
eas build --platform ios --profile development
```

**Profile in eas.json:**

```json
{
  "build": {
    "preview": {
      "ios": {
        "distribution": "internal",
        "provisioning": true
      }
    }
  }
}
```

**Installation methods:**
1. **TestFlight** (temporary):
   - Use --auto-submit flag to send to TestFlight
   - Testers receive email with install link
   ```bash
   eas build --platform ios --profile preview --auto-submit
   ```

2. **Simulator:**
   - Download .app file
   - Run in Xcode simulator

### 4.4 Build Optimization

**Reduce build times:**

```json
{
  "build": {
    "production": {
      "ios": {
        "distribution": "app-store",
        "node": "20.11.0",
        "ios": {
          "buildConfiguration": "Release"
        }
      },
      "android": {
        "buildType": "aab",
        "gradleLogLevel": "error"
      }
    }
  },
  "cli": {
    "version": ">= 8.0.0"
  }
}
```

---

## Part 5: TestFlight Setup (Tasks 15.6)

### 5.1 TestFlight Overview

**What is TestFlight?**
- Apple's official beta testing platform
- Allows up to 100 internal testers (employees)
- Unlimited external testers
- 90 day expiration for beta builds
- Free to use

### 5.2 Setting Up TestFlight

#### Step 1: Create App in App Store Connect

1. Visit [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Menu: "My Apps"
3. Click "+" → "New App"
4. Fill details:
   - Platform: iOS
   - Name: VietFlood
   - Primary Language: English
   - Bundle ID: com.vietflood.app
   - SKU: vietflood-001 (any unique string)

#### Step 2: Configure App Information

1. **App Information:**
   - Category: Utilities (or choose most relevant)
   - Subtitle: Real-time relief operation coordination
   - Privacy Policy: https://vietflood.io/privacy
   - Support URL: https://vietflood.io/support

2. **Screenshots:**
   - Minimum 1 screenshot per device size
   - Sizes: iPhone (1170×2532), iPad (2048×2732)
   - Content: Best screens showing app usage

3. **Description:**
   ```
   VietFlood helps relief organizations coordinate disaster response
   with real-time operation tracking, weather data overlays, and
   seamless team communication.
   
   Features:
   - Real-time operation tracking
   - Weather data integration
   - Report submission and tracking
   - Team collaboration tools
   ```

#### Step 3: Create TestFlight Builds

**Build in EAS with auto-submit:**

```bash
eas build --platform ios --profile preview --auto-submit
```

**Or manually submit to TestFlight:**

```bash
# After build completes
eas build:submit --platform ios --path ./build.ipa
```

#### Step 4: Add TestFlight Testers

**Internal Testers** (up to 100, employees/team):
1. App Store Connect → Users and Access → Manage → Internal Testing
2. Invite internal testers (enter email addresses)
3. Testers receive email link
4. Testers install via TestFlight app on iPhone/iPad

**External Testers** (unlimited, public):
1. App Store Connect → TestFlight → External Testing
2. Create "Test Group" (e.g., "Beta Testers")
3. Add email addresses
4. Send review request to Apple (usually approved in 24 hrs)
5. Once approved, testers receive email with public link

### 5.3 TestFlight Workflow

**Build sequence:**
1. Increment version in app.json: `"version": "0.2.0"`
2. Update build number in eas.json: `"buildNumber": "2"`
3. Commit changes
4. Build and submit:
   ```bash
   eas build --platform ios --profile preview --auto-submit
   ```
5. Wait for build completion (~15-30 min)
6. TestFlight processes build (~30 min)
7. Testers receive email notification
8. Testers install via TestFlight app

### 5.4 Managing TestFlight Builds

**View recent builds:**
1. App Store Connect → TestFlight
2. See build upload history
3. Check test session data (crashes, usage)

**Removing expired builds:**
- Builds expire after 90 days
- Auto-delete old builds to save space
- Option in App Store Connect settings

**Feedback handling:**
- Testers submit feedback via TestFlight app
- Review in App Store Connect → TestFlight → Feedback
- Use to prioritize fixes for next build

---

## Part 6: Google Play Internal Testing (Tasks 15.7)

### 6.1 Google Play Console Setup

**Prerequisites:**
- Google account
- Development/company account recommended
- $25 one-time registration fee
- Payment method (credit/debit card)

#### Step 1: Create Google Play Developer Account

1. Visit [play.google.com/console](https://play.google.com/console)
2. Click "Create account"
3. Continue with your Google account (or create new)
4. Fill in developer account details:
   - Display name: VietFlood Team
   - City: Ho Chi Minh City
   - Phone: Your number
   - Email: team@vietflood.io
5. Accept agreements and pay $25

### 6.2 Creating App on Google Play

1. **Play Console → All apps → Create app**
   - App name: VietFlood
   - Default language: English
   - App or game: App
   - Free or paid: Free
   - Agree to declarations

2. **Store listing → About your app:**
   - Description (max 4000 chars):
     ```
     VietFlood is a mobile app for disaster relief coordination.
     
     Features:
     - Real-time operation tracking with live map
     - Weather data integration (wind, rain, temperature)
     - Report submission with photos and GPS coordinates
     - Team communication and resource management
     - Permission-based role access (admin, coordinator, volunteer)
     ```
   
   - Category: Utilities
   - Content rating: Standard (not for kids)

3. **Graphics (all required for production):**
   - App icon: 512×512 PNG
   - Feature graphic: 1024×500 PNG
   - Screenshots (min 2): 1080×1920 (phone) or 7680×4320 (tablet)
   - Video: Optional 30-sec YouTube link

4. **Release → Internal testing:**
   - This is where we start for beta

### 6.3 Setting Up Internal Testing Track

#### Step 1: Create Internal Testing Release

1. **Play Console → Release → Internal testing**
2. Click "Create new release"
3. Upload AAB (Android App Bundle):
   ```bash
   # Build production AAB
   eas build --platform android --profile production
   ```

#### Step 2: Configure App Signing

**Google Play App Signing (Recommended):**
- Google handles code signing
- Provides safety backup
- Required for most new apps

**Manual signing in eas.json:**

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "aab",
        "releaseChannel": "production",
        "keystore": {
          "keystorePath": "./vietflood-release.keystore",
          "keystorePassword": "$KEYSTORE_PASSWORD",
          "keyAlias": "vietflood-key",
          "keyPassword": "$KEY_PASSWORD"
        }
      }
    }
  }
}
```

#### Step 3: Add Internal Testers

1. **Play Console → Release → Internal testing**
2. Scroll to "Manage testers" section
3. Create testing group (e.g., "Development Team")
4. Add email addresses:
   - Testers must use these Google account emails
   - Minimum 1 test account
5. Copy opt-in link
6. Send to testers

#### Step 4: Install App from Link

**Tester experience:**
1. Receive email with opt-in link
2. Click link → "Test on Google Play"
3. Open link on Android device with same Google account
4. Click "Install" button
5. App appears in Play Store as available to install

### 6.4 Workflow for Internal Testing Builds

**Build sequence:**
1. Update version: `"versionCode": 2` in app.json
2. Increment `"version": "0.2.0"`
3. Build AAB:
   ```bash
   eas build --platform android --profile production
   ```
4. Upload to Play Console (manual or eas submit)
5. Add release notes:
   ```
   Build 2 (v0.2.0):
   - Fixed bug: Real-time updates not persisting
   - Added: Comment notifications
   - Improved: Map marker clustering performance
   ```
6. Submit for review (internal testing bypasses review)
7. Testers see update in Play Store immediately

### 6.5 Internal Testing to Beta (Optional)

**Upgrade to Open Testing (limited beta):**

1. Internal testing → 50,000 max testers
2. Usually internal only, then recruit beta group
3. Create "Beta track" in Play Console
4. Same process: upload, add testers, copy link

**Then to Production:**

1. "Closed testing" = specific testers only
2. "Open testing" = public beta link
3. "Production" = full release on Play Store

---

## Part 7: Implementation Checklist

### App Icons & Splash (15.1)
- [ ] 1024×1024 base icon designed with VietFlood branding
- [ ] iOS icons created (60, 76, 120, 152, 167, 180 sizes)
- [ ] Android adaptive icon (foreground + background)
- [ ] Splash screens created (light and dark variants)
- [ ] Icons placed in `assets/icons/` directory
- [ ] Splash images placed in `assets/splash/` directory
- [ ] app.json updated with icon/splash references
- [ ] Tested on simulator/emulator
- [ ] Icons render correctly without blurriness
- [ ] Splash screen displays for 1.5+ seconds

### iOS Signing (15.2)
- [ ] Apple Developer account created ($99)
- [ ] Team ID obtained from developer.apple.com
- [ ] CSR generated from Keychain Access
- [ ] Development certificate created and installed
- [ ] Distribution certificate created and installed
- [ ] App ID registered (com.vietflood.app)
- [ ] App Store provisioning profile created
- [ ] eas.json configured with iOS signing
- [ ] Test build created with signing
- [ ] Build unsigned/signed correctly

### Android Signing (15.3)
- [ ] Keystore generated (RSA-2048, 10000 days)
- [ ] Keystore backed up to secure location
- [ ] Keystore NOT committed to git
- [ ] KEYSTORE_PASSWORD set in environment/secrets
- [ ] KEY_PASSWORD set in environment/secrets
- [ ] eas.json configured with keystore settings
- [ ] Test build created with signing
- [ ] Certificate fingerprint (SHA-256) verified

### Development APK (15.4)
- [ ] eas.json has "development" profile for Android
- [ ] Development build created via EAS
- [ ] APK downloaded and tested on physical device
- [ ] App installs and launches correctly
- [ ] Signing verified (Settings → About → App info)

### Development IPA (15.5)
- [ ] eas.json has "preview" profile for iOS
- [ ] Development build created via EAS
- [ ] IPA tested on simulator via Xcode
- [ ] Or submitted to TestFlight for device testing
- [ ] Provisioning profile loaded correctly
- [ ] App launches without signing errors

### TestFlight Setup (15.6)
- [ ] App created in App Store Connect
- [ ] App information (name, category, privacy policy) filled
- [ ] 1 screenshot uploaded per device size
- [ ] Description and keywords added
- [ ] Internal testing build submitted
- [ ] Build processed successfully (wait ~30 min)
- [ ] Internal testers added (email addresses)
- [ ] Testers receive email invitation
- [ ] Testers can install via TestFlight app
- [ ] App installs and runs on physical iPhone/iPad

### Google Play Internal Testing (15.7)
- [ ] Google Play Developer account created ($25)
- [ ] App created in Google Play Console
- [ ] App information (name, category) filled
- [ ] Production AAB built via EAS
- [ ] AAB uploaded to Play Console (internal testing track)
- [ ] Internal testers added
- [ ] Testers receive opt-in link via email
- [ ] Testers can install via Google Play
- [ ] App installs and runs on physical Android device

---

## Part 8: Troubleshooting

### Icon & Splash Issues

**Issue: Icon blurry on Retina display**
- Ensure PNG is at least 3x resolution (1024×1024 minimum)
- Check DPI settings (should be 72 DPI)
- Use @3x suffix convention

**Issue: Splash screen not appearing**
- app.json missing splash configuration
- Image path incorrect
- Image dimensions wrong for device

### Signing Issues

**Issue: "Certificate not found"**
- Ensure certificate installed in Keychain (macOS)
- Verify correct Team ID in eas.json
- Re-run `eas build:configure`

**Issue: "Provisioning profile invalid"**
- Check Bundle ID matches registered ID
- Certificate not included in provisioning profile
- Re-download provisioning profile

**Issue: "Keystore password incorrect"**
- Verify KEYSTORE_PASSWORD environment variable
- Check no extra spaces in password
- Ensure keystorePath points to correct file

### EAS Build Issues

**Issue: Build fails with "Device support not found"**
- Update Xcode: `xcode-select --install`
- Delete DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData/*`

**Issue: "APK not signed"**
- Verify keystore and credentials in eas.json
- Check credentials files have correct permissions
- Re-create keystore from scratch

### TestFlight Issues

**Issue: Testers not receiving emails**
- Check email address accepted in Apple ID
- Verify tester accepted invitation
- Resend invitation link

**Issue: Build stuck in "Processing"**
- Refresh page (sometimes UI out of sync)
- Wait longer (up to 60 min)
- Re-submit build if unresolved 1+ hour

### Google Play Issues

**Issue: "Upload failed: APK invalid"**
- Ensure buildType: "aab" (not "apk" for Play Store)
- Check versionCode incremented from previous
- Verify signing certificate matches

**Issue: Testers see "Not available"**
- Ensure tester using correct Google account
- Verify tester added to testing group
- Check testing track has active build

---

## Next Steps

1. **Complete Section 15:**
   - [ ] Create icons & splash (15.1)
   - [ ] Configure iOS signing (15.2)
   - [ ] Configure Android signing (15.3)
   - [ ] Build development APK (15.4)
   - [ ] Build development IPA (15.5)
   - [ ] Set up TestFlight (15.6)
   - [ ] Set up Google Play testing (15.7)

2. **Section 16: Documentation**
   - Create developer setup guide
   - Document navigation architecture
   - Create API documentation
   - Record video tutorial

3. **Section 17: Performance**
   - Profile app startup
   - Optimize heavy screens
   - Test on low-end devices

4. **Section 18-20:**
   - Add accessibility features
   - Implement error monitoring
   - Final QA and polish

---

**Status: Section 15 Implementation Guide Complete**
- 7 tasks covered (15.1-15.7)
- Ready for implementation
- All commands and workflows documented
