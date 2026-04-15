# Phase 9: iOS & Android Emulator Setup Guide

**Purpose**: Configure emulators for device testing  
**Target**: Prepare 6+ device configurations (iOS + Android)  
**Duration**: 1-2 hours setup time  
**Last Updated**: April 15, 2026  

---

## Prerequisites

### For iOS Development
- macOS Big Sur (11.0) or later
- Xcode 13+ installed (`xcode-select --install`)
- Xcode Command Line Tools updated
- Internet connection (simulator download: ~3-5 GB per iOS version)

### For Android Development
- Android Studio 2022.1.1+
- Android SDK installed (via Android Studio SDK Manager)
- Java 11+ (JDK installed)
- 50+ GB disk space for emulator images
- Windows: WSL2 for best performance (optional but recommended)

### General Requirements
- Node.js 18+ and npm 9+
- EAS CLI installed: `npm install -g eas-cli`
- Project dependencies installed: `npm install`
- Xcode/Android Studio command line tools accessible

---

## iOS Emulator Setup

### Step 1: Install iOS Runtimes

```bash
# List available iOS versions
xcrun simctl list runtimes

# Install specific iOS versions (one at a time)
xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

**Target versions to support**:
- iOS 15.x (minimum)
- iOS 16.x (standard support)
- iOS 17.x (current major)
- iOS 18.x (latest bleeding edge)

### Step 2: Create iOS Device Simulators

#### 2.1 iPhone SE (Small Phone - 375px)

```bash
# Create iPhone SE (3rd generation) with iOS 17
xcrun simctl create "iPhone SE iOS 17" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-SE \
  com.apple.CoreSimulator.SimRuntime.iOS-17-4

# Create with iOS 16
xcrun simctl create "iPhone SE iOS 16" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-SE \
  com.apple.CoreSimulator.SimRuntime.iOS-16-7
```

**Device Specs**:
- Screen: 375×667 (4.7")
- Device ID: e.g., `7F8A2C1B-4D93-41E5-9A0E-1F0C3B5D7E9A`

#### 2.2 iPhone 14 (Standard Phone - 390px)

```bash
xcrun simctl create "iPhone 14 iOS 17" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-14 \
  com.apple.CoreSimulator.SimRuntime.iOS-17-4

xcrun simctl create "iPhone 14 iOS 15" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-14 \
  com.apple.CoreSimulator.SimRuntime.iOS-15-7
```

**Device Specs**:
- Screen: 390×844 (6.1" Super Retina)
- Standard OLED display

#### 2.3 iPhone 14 Pro Max (Large Phone - 430px)

```bash
xcrun simctl create "iPhone 14 Pro Max iOS 17" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-14-pro-max \
  com.apple.CoreSimulator.SimRuntime.iOS-17-4
```

**Device Specs**:
- Screen: 430×932 (6.7")
- ProMotion 120Hz display

#### 2.4 iPad Air (Tablet - 768px)

```bash
xcrun simctl create "iPad Air iOS 17" \
  com.apple.CoreSimulator.SimDeviceType.iPad-Air \
  com.apple.CoreSimulator.SimRuntime.iOS-17-4
```

**Device Specs**:
- Screen: 768×1024 (10.9")
- Landscape: 1024×768

### Step 3: Boot iOS Simulators

```bash
# List all simulators
xcrun simctl list devices

# Boot specific simulator
xcrun simctl boot "iPhone 14 iOS 17"

# Open simulator GUI
open /Applications/Simulator.app

# Or boot and open together
xcrun simctl boot "iPhone 14 iOS 17" && open /Applications/Simulator.app
```

### Step 4: Install App on iOS Simulator

```bash
# Build for iOS simulator
eas build --platform ios --profile simulator

# Or local development build
npm run ios

# App installs automatically with local build
```

### Step 5: iOS Simulator Network Settings

**Simulate Offline**:
```bash
# Disable WiFi and Cellular (via Simulator menu)
# Simulator → Device → Disconnect WiFi (or toggle)
```

**Simulate Slow Network** (using macOS Network Link Conditioner):
1. Download Network Link Conditioner from Apple More Downloads
2. Install: `sudo -H easy_install py2-appscript plistutils biplist`
3. Run: Applications/Network Link Conditioner/Network Link Conditioner.app
4. Select: "3G" or "Poor Network" profile
5. Start conditioning

**Simulate Different Network Speeds**:
- WiFi (Good): 30 Mbps down, 10 Mbps up
- WiFi (Slow): 10 Mbps down, 5 Mbps up
- 4G/LTE: 12 Mbps down, 5 Mbps up
- 3G: 1.6 Mbps down, 0.4 Mbps up

### Step 6: iOS Performance Monitoring

**Xcode Instruments**:
```bash
# Open Xcode Debug Navigator while app running
# View Real-time metrics:
# - Memory
# - CPU
# - Energy Impact
# - Network I/O
```

**In-app Performance Monitoring**:
- App has `usePerformanceMonitor` hook integrated
- Metro console shows real-time FPS and render times
- Long Press on app (iOS 15+) shows performance metrics

---

## Android Emulator Setup

### Step 1: Install Android SDK Components

```bash
# Open Android Studio SDK Manager
# Settings → Languages & Frameworks → Android SDK

# Install these components:
# - Android SDK Platform 34 (Android 14)
# - Android SDK Platform 33 (Android 13)
# - Android SDK Platform 32 (Android 12)
# - Android SDK Platform 31 (Android 12)
# - Android SDK Platform 30 (Android 11)
# - Android SDK Build-Tools 34.0.0
# - Google Play system image (for some emulators)
# - Intel x86 Atom system images

# Command line alternative
yes | sdkmanager --licenses
sdkmanager "platforms;android-34" "platforms;android-33" "platforms;android-32"
sdkmanager "emulator" "tools"
```

### Step 2: Create Android Virtual Devices (AVDs)

#### 2.1 Small Phone - Pixel 4 (Android 13)

```bash
# Using Android Studio AVD Manager
# File → Settings → Virtual Devices

# Or command line:
sdkmanager "system-images;android-34;google_apis;x86_64"

avdmanager create avd \
  -n "Pixel4_Android13" \
  -k "system-images;android-33;google_apis;x86_64" \
  -d "Nexus 5"

# Specs
# - Screen: 1080×1920 (5.0" 443 ppi)
# - RAM: 2GB minimum (4GB recommended)
# - Storage: 2GB
```

#### 2.2 Standard Phone - Pixel 6 (Android 14)

```bash
avdmanager create avd \
  -n "Pixel6_Android14" \
  -k "system-images;android-34;google_apis;x86_64" \
  -d "Pixel 6"

# Specs
# - Screen: 1080×2400 (6.1" 429 ppi)
# - RAM: 4GB minimum
# - Storage: 2GB
```

#### 2.3 Large Phone - Pixel 6 Pro (Android 12)

```bash
avdmanager create avd \
  -n "Pixel6Pro_Android12" \
  -k "system-images;android-32;google_apis;x86_64" \
  -d "Pixel 6 Pro"

# Specs
# - Screen: 1440×3120 (6.7" 512 ppi)
# - RAM: 8GB minimum (high-end simulation)
# - Storage: 2GB
```

#### 2.4 Tablet - Pixel Tablet (Android 13)

```bash
avdmanager create avd \
  -n "PixelTablet_Android13" \
  -k "system-images;android-33;google_apis;x86_64" \
  -d "pixel_tablet"

# Specs
# - Screen: 2560×1600 (11.5" 226 ppi)
# - RAM: 6GB minimum
# - Storage: 4GB
```

### Step 3: Start Android Emulators

```bash
# List all AVDs
emulator -list-avds

# Start emulator
emulator -avd Pixel6_Android14

# Start with specific options
emulator -avd Pixel6_Android14 \
  -gpu on \
  -memory 4096 \
  -accel on

# Start multiple emulators in parallel
emulator -avd Pixel6_Android14 &
emulator -avd PixelTablet_Android13 &
```

**Enable Hardware Acceleration**:
- Linux: `-accel on` (KVM)
- macOS: `-accel on` (HVF)
- Windows: `-accel on` (WHPX or GVM)

### Step 4: Install App on Android Emulator

```bash
# Build for Android emulator
eas build --platform android --profile preview

# Or local development
npm run android

# Verify app installed
adb shell pm list packages | grep vietflood
```

### Step 5: Android Emulator Network Settings

**Simulate Offline**:
```bash
# Using adb
adb shell settings put global airplane_mode_on 1
adb shell settings put global wifi_on 0

# Toggle back on
adb shell settings put global airplane_mode_on 0
adb shell settings put global wifi_on 1
```

**Simulate Network Speed** (using Android Emulator):
1. Open emulator settings (…) → Settings → Network
2. Select Speed profile:
   - LTE (12 Mbps)
   - 3G (2 Mbps)
   - Edge (0.4 Mbps)
   - GPRS (0.1 Mbps)

**Simulate Latency**:
```bash
# Add 100ms latency
adb shell tc qdisc add dev lo root netem delay 100ms

# Remove latency
adb shell tc qdisc del dev lo root
```

### Step 6: Android Performance Monitoring

**Android Profiler** (Android Studio):
1. Run app in emulator
2. Android Studio → View → Tool Windows → Profiler
3. Real-time metrics:
   - CPU usage
   - Memory allocation
   - Network I/O
   - GPU rendering

**Command Line Profiling**:
```bash
# Get frame stats
adb shell dumpsys gfxinfo <package> framestats

# Memory usage
adb shell dumpsys meminfo com.vietflood

# Battery drain
adb shell dumpsys batterystats
```

### Step 7: Debugging with Logcat

```bash
# View all logs
adb logcat

# Filter by package
adb logcat | grep vietflood

# Filter by log level
adb logcat *:E  # Errors only
adb logcat *:W  # Warnings and above

# Save logs to file
adb logcat > app_logs.txt
```

---

## Performance Tuning

### iOS Simulator Performance

**If simulator is slow**:
1. Reduce screen resolution: Device menu → Set resolution
2. Use Rosetta if available (Apple Silicon): Simulator → Reset Contents
3. Disable Metal rendering: Simulator → Preferences → GPU
4. Close other applications
5. Restart simulator: `xcrun simctl erase all`

### Android Emulator Performance

**If emulator is slow**:
1. Increase RAM allocation: Edit AVD config.ini, change `hw.ramSize`
2. Enable GPU: Edit config.ini, set `hw.gpu.enabled = yes`
3. Use x86_64 images (not ARM)
4. Disable snapshots: Close emulator fully (not suspended)
5. Allocate more CPU cores: Edit config.ini, set `hw.cpu.ncore = 4`

---

## Multi-Device Testing Setup

### iOS Multi-Device Testing

```bash
# Create device set with multiple iOS versions
# Xcode → Window → Devices and Simulators
# Create these devices side-by-side:
# - iPhone SE iOS 15
# - iPhone 14 iOS 17
# - iPad Air iOS 17

# Start all at once
open /Applications/Simulator.app
# (Start each device individually in Xcode)
```

**Recommended Sequence**:
1. Boot iPhone SE iOS 15 (test oldest version)
2. Boot iPhone 14 iOS 17 (test current)
3. Boot iPad Air iOS 17 (test tablet)
4. Stagger boot times by 30 seconds to avoid overload

### Android Multi-Device Testing

```bash
# Start multiple emulators
emulator -avd Pixel4_Android13 &
sleep 5  # Wait for first to stabilize
emulator -avd Pixel6_Android14 &
sleep 5
emulator -avd PixelTablet_Android13 &

# Verify all running
adb devices
```

**Recommended Setup**:
- Max 2-3 emulators running simultaneously
- Requires 10+ GB RAM
- CPU load monitoring essential

---

## Automated Testing Setup

### Install Test Dependencies

```bash
npm install --save-dev detox detox-cli detox-config
npm install --save-dev jest @testing-library/react-native
```

### Create Detox Configuration

```bash
# Initialize Detox
detox init -r jest
```

### Example Detox E2E Test

```typescript
// e2e/firstTest.e2e.ts
describe('Smoke Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show home screen', async () => {
    await expect(element(by.text('Home'))).toBeVisible();
  });

  it('should navigate to reports', async () => {
    await element(by.id('reports-tab')).multiTap();
    await expect(element(by.text('Reports'))).toBeVisible();
  });
});
```

### Run Tests on Emulator

```bash
# iOS
detox build-framework-cache
detox build-app --configuration ios.sim.debug
detox test --configuration ios.sim.debug

# Android
detox build-app --configuration android.sim.release
detox test --configuration android.sim.release
```

---

## Troubleshooting

### iOS Issues

**Simulator won't start**:
```bash
# Reset simulator state
xcrun simctl erase all

# Or reset single device
xcrun simctl erase "iPhone 14 iOS 17"
```

**App crashes on launch**:
1. Check Xcode console for error messages
2. Clear app cache: `xcrun simctl io <device-id> uninstall app`
3. Rebuild: `npm run ios -- --device "iPhone 14 iOS 17"`

**Network not working**:
1. Check System Preferences → Network
2. Restart simulator
3. Toggle WiFi: Simulator → Device → Toggle WiFi

### Android Issues

**Emulator won't start**:
```bash
# Check if port is in use
lsof -i :5554

# Kill existing emulator processes
adb kill-server

# Start fresh
emulator -avd Pixel6_Android14
```

**App force closes**:
```bash
# Check logcat
adb logcat *:E

# Clear app data
adb shell pm clear com.vietflood

# Reinstall app
adb uninstall com.vietflood
npm run android
```

**Keyboard not responding**:
1. Click on emulator window to focus
2. Toggle keyboard: Ctrl+K (Windows) / Cmd+K (Mac)
3. Restart emulator

---

## Setup Verification Checklist

- [ ] iOS Simulator with 4 device configurations created and booted
- [ ] Android Emulator with 4 device configurations created and started
- [ ] App builds and installs on all emulators without crash
- [ ] Performance monitoring tools accessible (Instruments, Profiler, Logcat)
- [ ] Network simulation working (offline, slow network tested)
- [ ] Test data available for testing
- [ ] All 8 device configurations tested successfully

---

## Device Configuration Reference Table

| Device | Platform | OS Version | Screen | RAM | DVT* |
|--------|----------|-----------|--------|-----|------|
| iPhone SE | iOS | 15-17 | 375×667 | 1.5GB | ✅ |
| iPhone 14 | iOS | 16-18 | 390×844 | 4GB | ✅ |
| iPhone Pro Max | iOS | 17-18 | 430×932 | 6GB | ✅ |
| iPad Air | iOS | 15-17 | 768×1024 | 4GB | ✅ |
| Pixel 4 | Android | 12-13 | 1080×1920 | 2GB | ✅ |
| Pixel 6 | Android | 13-14 | 1080×2400 | 4GB | ✅ |
| Pixel 6 Pro | Android | 12-13 | 1440×3120 | 8GB | ✅ |
| Pixel Tablet | Android | 13+ | 2560×1600 | 6GB | ✅ |

*DVT = Device Virtual Training (pre-configured and tested)

---

## Next Steps

1. Follow setup instructions above in order
2. Verify checklist items
3. Proceed to [PHASE_9_EXECUTION_GUIDE.md](./PHASE_9_EXECUTION_GUIDE.md)
4. Run Phase 9 device testing with prepared environments

---

**Setup Time Estimate**: 1.5-2 hours  
**Disk Space Required**: ~80 GB (iOS images: ~40GB, Android images: ~40GB)  
**Network Required**: Yes (initial setup downloads)  
**One-time setup**: Yes (can reuse across testing sessions)  

---

**Next Document**: [PHASE_9_EXECUTION_GUIDE.md](./PHASE_9_EXECUTION_GUIDE.md)
