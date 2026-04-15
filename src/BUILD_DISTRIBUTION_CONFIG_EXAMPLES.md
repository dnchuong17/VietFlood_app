# Section 15: Build & Distribution Configuration Examples

## File Index

This directory contains all configuration files needed for building and distributing VietFlood React Native app.

### Core Configuration Files

#### 1. app.json - Main App Configuration
```json
{
  "expo": {
    "name": "VietFlood",
    "slug": "vietflood",
    "version": "1.0.0",
    "owner": "vietflood-team",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "icon": "./assets/icon.png",
    "assetBundlePatterns": ["**/*"],
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/YOUR_PROJECT_ID"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.vietfloodapp",
      "buildNumber": "1",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "VietFlood needs your location to detect where you're reporting from.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "VietFlood needs your location for flood monitoring.",
        "NSCameraUsageDescription": "VietFlood needs camera access to capture photos for reports.",
        "NSPhotoLibraryUsageDescription": "VietFlood needs photo library access to select images for reports.",
        "NSMicrophoneUsageDescription": "VietFlood may need microphone access for video reports."
      }
    },
    "android": {
      "package": "com.vietfloodapp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "INTERNET",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_NETWORK_STATE"
      ]
    },
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysPermission": "Allow $(PRODUCT_NAME) to access your location."
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera."
        }
      ],
      "expo-splash-screen"
    ]
  }
}
```

#### 2. eas.json - EAS Build Configuration
```json
{
  "cli": {
    "version": ">= 5.4.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      },
      "ios": {
        "buildType": "archive"
      }
    },
    "staging": {
      "distribution": "internal",
      "android": {
        "buildType": "aab"
      },
      "ios": {
        "buildType": "archive"
      },
      "env": {
        "API_ENDPOINT": "https://staging-api.vietflood.com"
      }
    },
    "production": {
      "distribution": "store",
      "android": {
        "buildType": "aab",
        "gradleCommand": ":app:bundleRelease"
      },
      "ios": {
        "buildType": "archive"
      },
      "env": {
        "API_ENDPOINT": "https://api.vietflood.com"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "1234567890",
        "appleId": "developer@vietflood.com",
        "appleTeamId": "XXXXXXXXXX",
        "appleAppSpecificPassword": "xxxx-xxxx-xxxx-xxxx"
      },
      "android": {
        "serviceAccount": "./certificates/google-play-service-account.json",
        "track": "production"
      }
    },
    "staging": {
      "ios": {
        "testFlightTrack": "internal"
      },
      "android": {
        "serviceAccount": "./certificates/google-play-service-account.json",
        "track": "internal"
      }
    }
  },
  "resourceClass": {
    "ios": "default",
    "android": "default"
  }
}
```

#### 3. package.json - Build Scripts
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "eject": "expo eject",
    "build:dev": "eas build --platform all --profile development",
    "build:preview": "eas build --platform all --profile preview",
    "build:staging": "eas build --platform all --profile staging",
    "build:ios": "eas build --platform ios --profile production",
    "build:android": "eas build --platform android --profile production",
    "build:all": "eas build --platform all --profile production",
    "submit:ios": "eas submit --platform ios --latest",
    "submit:android": "eas submit --platform android --latest",
    "submit:all": "eas submit --platform all --latest"
  }
}
```

---

## Build Environment Files

### iOS Setup

#### Certificates Directory Structure
```
certificates/
├── ios/
│   ├── development/
│   │   ├── ios_development.cer
│   │   └── VietFloodDev.mobileprovision
│   ├── production/
│   │   ├── ios_production.cer
│   │   └── VietFloodDistribution.mobileprovision
│   └── README.md
├── android/
│   ├── vietflood.keystore
│   ├── keystore.properties
│   └── README.md
└── google-play-service-account.json
```

#### keystore.properties (Android)
```properties
# Keystore configuration for Android builds
store.file=vietflood.keystore
store.password=YOUR_STORE_PASSWORD
key.alias=vietflood
key.password=YOUR_KEY_PASSWORD
```

#### .env.production (Environment Variables)
```
EXPO_PUBLIC_API_URL=https://api.vietflood.com
EXPO_PUBLIC_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_EAS_PROJECT_ID=YOUR_EAS_PROJECT_ID
```

#### .env.staging (Staging Environment)
```
EXPO_PUBLIC_API_URL=https://staging-api.vietflood.com
EXPO_PUBLIC_API_KEY=YOUR_STAGING_API_KEY
EXPO_PUBLIC_APP_VERSION=1.0.0-staging
EXPO_PUBLIC_EAS_PROJECT_ID=YOUR_EAS_PROJECT_ID
```

---

## .gitignore (Security)
```
# Build artifacts
*.apk
*.aab
*.ipa
*.ips
build/
dist/

# Dependencies
node_modules/
.expo/
.expo-shared/

# Certificate files
certificates/vietflood.keystore
certificates/google-play-service-account.json
*.cer
*.p12
*.mobileprovision

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

---

## Icon & Splash Asset Requirements

### Icon Files
```
assets/
├── icon.png (1024x1024px minimum)
├── icon-192.png (192x192px)
├── icon-512.png (512x512px)
├── adaptive-icon.png (192x192px - foreground)
└── splash.png (1242x2436px)
```

### Icon Design Guidelines
- **Format:** PNG with transparency
- **Safe Zone:** 10% margin from edges
- **Colors:** RGB or RGBA
- **No Rounded Corners:** iOS handles this
- **Simple Design:** Works at small sizes
- **App Logo:** Center of icon

### Splash Screen Guidelines
- **Format:** PNG
- **Size:** 1242x2436px (iPhone Pro Max)
- **Safe Zone:** 60% of screen center area
- **Components:**
  - App logo/name
  - Tagline (optional)
  - Background color
- **No animated elements**

---

## Secrets Management

### GitHub Actions Secrets
Create these in GitHub Settings > Secrets and variables > Actions:

```
EXPO_TOKEN: xxxx-xxxx-xxxx-xxxx
EAS_PROJECT_ID: your-project-id
APPLE_ID: developer@vietflood.com
APPLE_PASSWORD: app-specific-password
APPLE_TEAM_ID: XXXXXXXXXX
GOOGLE_PLAY_SERVICE_ACCOUNT: {...json...}
```

### Local Environment
```bash
# Set locally for testing
export EXPO_TOKEN="your-token"
export EAS_PROJECT_ID="your-project-id"
export APPLE_ID="your-email@example.com"
export APPLE_PASSWORD="your-app-specific-password"
```

---

## Build Version Numbering

### Version Format: MAJOR.MINOR.PATCH-PRERELEASE+BUILD

**Examples:**
- `1.0.0` - Production release
- `1.0.0-beta.1` - Beta version
- `1.0.0-rc.1` - Release candidate
- `1.0.1` - Patch release
- `1.1.0` - Minor release
- `2.0.0` - Major release

### iOS Build Numbers
- Increment for each build
- Format: 1, 2, 3, ... (sequential)
- Example progression:
  ```
  Version 1.0.0 → Build 1
  Version 1.0.0 → Build 2 (bug fix)
  Version 1.0.1 → Build 3 (patch release)
  Version 1.1.0 → Build 4 (feature release)
  ```

### Android Version Codes
- Increment for each release
- Format: Integer
- Example progression:
  ```
  Version 1.0.0 → Code 1
  Version 1.0.1 → Code 2
  Version 1.1.0 → Code 3
  Version 2.0.0 → Code 4
  ```

---

## Build Commands Quick Reference

### Development Builds
```bash
# Build both platforms for testing
npm run build:dev

# Build only iOS
eas build --platform ios --profile development

# Build only Android
eas build --platform android --profile development
```

### Preview Builds
```bash
# Build for internal testing
npm run build:preview

# Build Android APK for distribution
eas build --platform android --profile preview
```

### Production Builds
```bash
# Build for store submission
npm run build:all

# Build iOS only for App Store
npm run build:ios

# Build Android only for Play Store
npm run build:android
```

### Submission Commands
```bash
# Submit to App Store and Play Store
npm run submit:all

# Submit iOS only
npm run submit:ios

# Submit Android only
npm run submit:android

# Check submission status
eas submit:list
```

---

## Continuous Integration Setup

### GitHub Actions Workflow
Create `.github/workflows/build.yml`:

```yaml
name: Build and Submit

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build:all
      - run: npm run submit:all
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
```

---

## Next Steps

1. ✅ Copy icon/splash to `assets/` folder
2. ✅ Configure `app.json` with your app details
3. ✅ Create `eas.json` with build profiles
4. ✅ Set up certificates (iOS and Android)
5. ✅ Configure environment variables
6. ✅ Test build locally: `npm run build:preview`
7. ✅ Submit to beta tracks (TestFlight, Google Play)
8. ✅ Gather feedback from testers
9. ✅ Submit to production stores

---

**Section 15 Configuration Status:** ✅ Complete

All build and distribution configuration examples provided.
