# EAS Build & Distribution Quick Reference

## Quick Command Reference

### Initial Setup
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS in project (one-time)
eas build:configure
```

### Development Builds (for simulators/emulators)

#### iOS Simulator
```bash
# Build development client for iOS Simulator
eas build --platform ios --profile development

# Run in simulator
xcrun simctl install booted path/to/app.app
xcrun simctl launch booted com.vietflood.app
```

#### Android Emulator
```bash
# Build development APK
eas build --platform android --profile development

# Install on running emulator
adb install path/to/app.apk

# Launch
adb shell am start -n com.vietflood.app/com.vietflood.app.MainActivity
```

### Physical Device Builds (for testing)

#### Android - Development APK
```bash
# Build APK for physical device
eas build --platform android --profile development

# Get download link from build output
# Share link with testers or install via adb
adb install vietflood-development.apk
```

#### iOS - Preview Build (via TestFlight)
```bash
# Build and auto-submit to TestFlight
eas build --platform ios --profile preview --auto-submit

# Testers get email with TestFlight link
# Or manually invite: App Store Connect → TestFlight → Internal Testing
```

### Production Builds (for release)

#### Android - Production AAB
```bash
# Build Android App Bundle (for Play Store)
eas build --platform android --profile production

# Output:  vietflood-production.aab
# Upload to Google Play Console
```

#### iOS - Production IPA
```bash
# Build for App Store
eas build --platform ios --profile production

# Auto-submit to App Store Connect
eas build --platform ios --profile production --auto-submit
```

---

## eas.json Template

```json
{
  "cli": {
    "version": ">= 8.0.0"
  },
  "build": {
    "development": {
      "android": {
        "buildType": "apk",
        "development": true,
        "node": "20.11.0"
      },
      "ios": {
        "distribution": "internal",
        "node": "20.11.0"
      }
    },
    "preview": {
      "android": {
        "buildType": "apk",
        "node": "20.11.0"
      },
      "ios": {
        "distribution": "internal",
        "provisioning": true,
        "node": "20.11.0"
      }
    },
    "production": {
      "android": {
        "buildType": "aab",
        "releaseChannel": "production",
        "node": "20.11.0",
        "keystore": {
          "keystorePath": "./vietflood-release.keystore",
          "keystorePassword": "$KEYSTORE_PASSWORD",
          "keyAlias": "vietflood-key",
          "keyPassword": "$KEY_PASSWORD"
        }
      },
      "ios": {
        "distribution": "app-store",
        "provisioning": true,
        "node": "20.11.0"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "ascProvider": "$iOS_ASC_PROVIDER",
        "appleId": "$APPLE_ID",
        "appleIdPassword": "$APPLE_ID_PASSWORD"
      },
      "android": {
        "serviceAccount": "./google-play-service-account.json"
      }
    }
  }
}
```

---

## Credential Management

### Setting Environment Variables

#### Bash/Zsh (.bash_profile or .zshrc)
```bash
export KEYSTORE_PASSWORD="your-keystore-password"
export KEY_PASSWORD="your-key-password"
export APPLE_ID="your-apple-id@example.com"
export APPLE_ID_PASSWORD="your-app-specific-password"
export iOS_ASC_PROVIDER="your-team-id"
```

#### Using .env.local (Git-ignored)
```bash
# Create .env.local
KEYSTORE_PASSWORD=your-keystore-password
KEY_PASSWORD=your-key-password

# Source before building
source .env.local
eas build --platform android
```

#### Using EAS Secrets (Recommended)
```bash
# Set secrets in EAS registry
eas secret:create --scope android --name KEYSTORE_PASSWORD --value "your-password"
eas secret:create --scope android --name KEY_PASSWORD --value "your-password"
eas secret:create --scope ios --name APPLE_ID --value "your-id@example.com"
eas secret:create --scope ios --name APPLE_ID_PASSWORD --value "app-specific-password"

# View secrets
eas secret:list --scope android

# Delete secret
eas secret:delete --scope android --name KEYSTORE_PASSWORD
```

---

## Build Status & Monitoring

### Check Build Status
```bash
# List recent builds
eas build:list

# Check specific build status
eas build:view <build-id>

# Download build artifacts
eas build:download <build-id>
```

### View Build Logs
```bash
# Tail live logs during build
eas build --platform ios --logs

# Or view after build
eas build:view <build-id> --logs
```

---

## Version Management

### Incrementing Versions

**app.json:**
```json
{
  "expo": {
    "version": "0.2.0",
    "android": {
      "versionCode": 2
    },
    "ios": {
      "buildNumber": "2"
    }
  }
}
```

**Convention:**
- Major.Minor.Patch (e.g., 1.0.0, 0.2.0, 1.2.3)
- Android versionCode: Increments by 1 each build (1, 2, 3...)
- iOS buildNumber: String matching version or incrementing

```bash
# Increment before building
# 0.1.0 → 0.2.0 → 1.0.0

# Automated script (increment patch):
npm run version:bump
# Then: npm run build:android
```

---

## TestFlight Workflow

### Automatic TestFlight Submission
```bash
# Build and auto-submit for iOS
eas build --platform ios --profile preview --auto-submit

# Wait for processing (~30 min total):
# - Build: 15-20 min
# - Processing in TestFlight: 10-15 min
# - Email testers: 5 min
```

### Manual TestFlight Management

1. **App Store Connect → TestFlight**
2. **Internal Testing:**
   - Invite team members (employees)
   - Max 100 testers
   - Build available immediately upon upload

3. **External Testing (optional):**
   - Create test group
   - Invite external testers
   - Requires Apple review (~24 hrs)
   - Unlimited external testers once approved

4. **Adding Testers:**
   ```bash
   # Automated via eas.json (create testers.txt file)
   # Then: eas submit --platform ios --testers testers.txt
   ```

### Monitoring TestFlight
- Check crash logs: TestFlight → Crashes
- View usage analytics: TestFlight → Sessions
- Read tester feedback: TestFlight → Feedback

---

## Google Play Internal Testing Workflow

### Build & Upload
```bash
# Build production AAB
eas build --platform android --profile production

# Download AAB file
eas build:download <build-id>

# Upload to Play Console (web UI)
# Or via eas submit (if configured)
eas submit --platform android
```

### Managing Testers

**Play Console → Release → Internal testing:**

1. **Create testing group:**
   - Name: "Development Team" or "Beta Testers"
   - Add email addresses
   - Copy opt-in link

2. **Share link with testers:**
   ```
   https://play.google.com/apps/testers/...
   ```

3. **Tester experience:**
   - Click link on Android device
   - Install VietFlood app
   - Automatic updates when new builds released

### Version Progression

**Tracks in Google Play:**
1. Internal testing (max 50,000 testers, for employees)
2. Closed testing (specific group of beta testers)
3. Open testing (public beta)
4. Production (public release)

**Moving between tracks:**
```bash
# Build for internal testing
eas build --platform android --profile development

# Once stable, move same build to Closed Testing (Play Console UI)
# Testers in Closed Testing track get upgrade

# Release to Production (Play Console UI)
# All users get update
```

---

## Submission to App Store / Play Store

### iOS App Store Submission

```bash
# Prerequisites:
# - Build created and processed in TestFlight
# - Screenshots uploaded in App Store Connect
# - App information complete
# - Privacy policy URL set

# Build and auto-submit
eas build --platform ios --profile production --auto-submit

# Or manually:
eas submit --platform ios

# Wait for review (~1-3 days)
# Once approved, click "Release" to launch
```

### Google Play Store Submission

```bash
# Prerequisites:
# - AAB uploaded to internal testing
# - App tested by testers (minimum 20 testers recommended)
# - Store listing complete with screenshots
# - Privacy policy URL set

# Build production AAB
eas build --platform android --profile production

# Upload via Play Console
eas submit --platform android

# Or manually upload via Play Console UI

# Click "Review" → "Publish"
# Typically live within 2-4 hours
```

---

## Troubleshooting

### Build Fails Immediately

**Check:**
```bash
# Validate eas.json syntax
eas build:inspect --platform ios

# Check app.json
npx expo check

# Verify dependencies installed
npm ls expo-build-properties
```

### Build Times Out

**Solutions:**
- Increase timeout: EAS default is ~1 hour
- Check network connection
- Try building locally: `eas build --local`
- Check EAS status: https://status.expo.io

### Signing Errors

**Android keystore issues:**
```bash
# Verify keystore
keytool -list -v -keystore ./vietflood-release.keystore \
  -storepass $KEYSTORE_PASSWORD

# Check credentials
echo $KEYSTORE_PASSWORD
echo $KEY_PASSWORD
```

**iOS certificate issues:**
```bash
# Check Keychain
security find-identity -v -p codesigning

# Re-configure signing
eas build:configure
```

### App Won't Install on Device

**Android:**
```bash
# Check if already installed
adb shell pm list packages | grep vietflood

# Uninstall first
adb uninstall com.vietflood.app

# Then install
adb install app.apk
```

**iOS (TestFlight):**
- Ensure correct Apple ID on device
- Check iOS version matches requirement
- Delete and reinstall TestFlight app

---

## Performance Tips

### Reduce Build Times
- Use `buildType: "apk"` for development (faster than AAB)
- Disable optimization for development
- Use local builds for iteration: `eas build --local`

### Reduce App Size
- Remove unused dependencies
- Enable ProGuard/R8 for Android
- Tree-shake unused code
- Compress images before bundling

### Optimize for First Load
- Lazy-load feature screens
- Code split at route boundaries
- Preload critical data on app start
- Cache API responses

---

## Checklists

### Before Each Build
- [ ] Version incremented (app.json, android.versionCode, ios.buildNumber)
- [ ] All changes committed to git
- [ ] Credentials environment variables set
- [ ] Run lint: `npm run lint`
- [ ] Run tests: `npm run test`
- [ ] No TypeScript errors: `npm run type-check`

### Before TestFlight/Play Store Release
- [ ] Changelog/release notes prepared
- [ ] At least 10 testers in group
- [ ] Tested on minimum 2 devices (iPhone + Android)
- [ ] No critical bugs from previous tester feedback
- [ ] Screenshots reviewed and correct

### Before Production Release
- [ ] Minimum 100 download/installs in testing
- [ ] Minimum 1-2 days of tester usage (find crashes)
- [ ] All critical bugs fixed
- [ ] App Store listing complete with icons
- [ ] Privacy policy linked
- [ ] Terms of service linked (if applicable)

---

## Resources

- **EAS Documentation:** https://docs.expo.dev/eas/
- **App Store Connect:** https://appstoreconnect.apple.com
- **Google Play Console:** https://play.google.com/console
- **Expo CLI Reference:** https://docs.expo.dev/more/expo-cli/
- **TestFlight Guide:** https://help.apple.com/app-store-connect/#/dev8b997bee1
- **Google Play Testing Guide:** https://support.google.com/googleplay/android-developer/answer/3131213

---

**For detailed implementation, refer to BUILD_AND_DISTRIBUTION_SETUP.md**
