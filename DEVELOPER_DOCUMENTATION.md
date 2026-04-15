# VietFlood Project Documentation & Setup Guides

## Section 16: Documentation & Knowledge Transfer

Complete documentation package for VietFlood React Native app, including project structure, architecture decisions, setup guides, and video workflow.

---

## 16.1 Project Structure & File Organization

### Directory Tree Overview

```
VietFlood_app/
├── src/
│   ├── app/                           # Expo Router root directory
│   │   ├── _layout.tsx               # Root layout wrapper
│   │   ├── index.tsx                 # Initial route (splash/auth redirect)
│   │   ├── globals.css               # Global styles (NativeWind)
│   │   ├── (auth)/                   # Authentication routes group
│   │   │   ├── _layout.tsx           # Auth stack layout
│   │   │   ├── dang-nhap/page.tsx    # Login screen
│   │   │   ├── dang-ky/page.tsx      # Registration screen
│   │   │   └── mo-khoa/page.tsx      # Password reset screen
│   │   ├── (protected)/              # Role-protected routes
│   │   │   ├── _layout.tsx           # Tab navigator layout
│   │   │   ├── (relief)/             # Relief coordinator section
│   │   │   │   ├── _layout.tsx       # Relief stack layout
│   │   │   │   ├── quan-ly/page.tsx  # Relief dashboard
│   │   │   │   └── chi-tiet.tsx      # Operation details
│   │   │   ├── (user)/               # User volunteer section
│   │   │   │   ├── _layout.tsx       # User stack layout
│   │   │   │   ├── trang-chu/page.tsx# Home dashboard
│   │   │   │   ├── bao-cao/page.tsx  # Reports listing
│   │   │   │   ├── tao-bao-cao.tsx   # Create report
│   │   │   │   └── ten-khoan.tsx     # Profile settings
│   │   │   └── (admin)/              # Admin section (if applicable)
│   │   └── (public)/                 # Public routes (about, info)
│   │       ├── _layout.tsx           # Public stack layout
│   │       ├── bao-cao/page.tsx      # Public report viewing
│   │       └── thong-tin/page.tsx    # About & info
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── common/                   # Generally used components
│   │   │   ├── Button.tsx            # Custom button component
│   │   │   ├── Card.tsx              # Card container component
│   │   │   ├── TextInput.tsx         # Styled text input
│   │   │   ├── SafeArea.tsx          # NotchArea wrapper
│   │   │   ├── Spinner.tsx           # Loading spinner
│   │   │   ├── ErrorBoundary.tsx     # Error fallback
│   │   │   └── Modal.tsx             # Base modal component
│   │   ├── feedback/                 # User feedback components
│   │   │   ├── Alert.tsx             # Alert message
│   │   │   ├── Toast.tsx             # Toast notifications
│   │   │   └── global-alert-provider.tsx # Alert context
│   │   ├── navigation/               # Navigation components
│   │   │   ├── TabNavigator.tsx      # Bottom tab navigator
│   │   │   ├── StackNavigator.tsx    # Stack navigator wrapper
│   │   │   ├── RoleGate.tsx          # Role-based gate
│   │   │   └── LinkingConfiguration.tsx # Deep linking setup
│   │   ├── map/                      # Map components
│   │   │   ├── MapView.tsx           # Google/Apple Maps wrapper
│   │   │   ├── Markers.tsx           # Custom map markers
│   │   │   ├── Overlays.tsx          # Weather overlays
│   │   │   └── MapController.tsx     # Map state manager
│   │   └── modals/                   # Modal dialogs
│   │       ├── ConfirmDialog.tsx     # Confirmation modal
│   │       ├── ActionSheet.tsx       # Bottom action sheet
│   │       └── DatePicker.tsx        # Date/time picker
│   │
│   ├── features/                     # Feature modules (vertically sliced)
│   │   ├── auth/                     # Authentication feature
│   │   │   ├── api/
│   │   │   │   ├── sign-in.ts        # Login API handler
│   │   │   │   ├── sign-up.ts        # Registration API handler
│   │   │   │   └── refresh-token.ts  # Token refresh handler
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx     # Login form component
│   │   │   │   ├── RegisterForm.tsx  # Registration form
│   │   │   │   ├── ProfileView.tsx   # Profile display
│   │   │   │   └── RoleSessionGate.tsx # Role checker
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts        # Auth context hook
│   │   │   │   ├── useAuthPersist.ts # Auth persistence
│   │   │   │   └── usePermissions.ts # Permission checker
│   │   │   ├── lib/
│   │   │   │   ├── api-client.ts     # API request handler
│   │   │   │   └── auth-storage.ts   # Secure token storage
│   │   │   └── types/
│   │   │       ├── auth.ts           # Auth interfaces
│   │   │       └── user.ts           # User type definitions
│   │   │
│   │   ├── home/                     # Home dashboard feature
│   │   │   ├── api/
│   │   │   │   └── fetch-home-data.ts
│   │   │   ├── components/
│   │   │   │   ├── HomeMapView.tsx   # Map section
│   │   │   │   ├── WeatherStats.tsx  # Weather display
│   │   │   │   ├── QuickActions.tsx  # Action buttons
│   │   │   │   └── UserStats.tsx     # User overview
│   │   │   ├── state/
│   │   │   │   └── home-display-state.tsx # Home state provider
│   │   │   └── types/
│   │   │       └── home.ts           # Home data types
│   │   │
│   │   ├── reports/                  # Reports feature
│   │   │   ├── api/
│   │   │   │   ├── create-report.ts  # Report submission
│   │   │   │   ├── fetch-reports.ts  # List reports
│   │   │   │   └── comment.ts        # Comment API
│   │   │   ├── components/
│   │   │   │   ├── ReportForm.tsx    # Report creation form
│   │   │   │   ├── ReportList.tsx    # Reports list view
│   │   │   │   ├── ReportDetail.tsx  # Single report view
│   │   │   │   └── CommentSection.tsx# Comments display
│   │   │   ├── hooks/
│   │   │   │   └── useReportPolling.ts # Real-time updates
│   │   │   └── types/
│   │   │       ├── report.ts         # Report interface
│   │   │       └── comment.ts        # Comment interface
│   │   │
│   │   ├── relief/                   # Relief operations feature
│   │   │   ├── api/
│   │   │   │   ├── operations.ts     # Operations API
│   │   │   │   ├── team.ts           # Team member API
│   │   │   │   └── resources.ts      # Resource tracking API
│   │   │   ├── components/
│   │   │   │   ├── OperationsList.tsx# Operations list
│   │   │   │   ├── OperationDetail.tsx # Single operation
│   │   │   │   ├── TeamMemberList.tsx# Team display
│   │   │   │   ├── ResourceTracking.tsx # Resources view
│   │   │   │   └── RouteMap.tsx      # Route visualization
│   │   │   ├── hooks/
│   │   │   │   └── useOperationPolling.ts # Real-time ops
│   │   │   └── types/
│   │   │       ├── operation.ts      # Operation interface
│   │   │       ├── team.ts           # Team member types
│   │   │       └── resource.ts       # Resource types
│   │   │
│   │   └── map/                      # Map & weather feature
│   │       ├── api/
│   │       │   └── windy-api.ts      # Windy weather API
│   │       ├── components/
│   │       │   ├── WindyOverlay.tsx  # Weather overlay
│   │       │   ├── MarkerCluster.tsx # Marker clustering
│   │       │   └── MapControls.tsx   # Map control buttons
│   │       └── types/
│   │           └── map.ts            # Map data types
│   │
│   ├── lib/                          # Shared utilities & services
│   │   ├── api/
│   │   │   ├── client.ts             # Axios/fetch setup
│   │   │   ├── endpoints.ts          # API route constants
│   │   │   ├── interceptors.ts       # Request/response interceptors
│   │   │   └── error-handler.ts      # Error parsing utilities
│   │   ├── navigation/
│   │   │   ├── linking.ts            # Deep link config
│   │   │   └── RootNavigator.tsx     # Main navigation
│   │   ├── storage/
│   │   │   ├── secure-storage.ts     # Token storage wrapper
│   │   │   └── local-storage.ts      # AsyncStorage wrapper
│   │   ├── styles/
│   │   │   ├── theme.ts              # Theme constants
│   │   │   ├── colors.ts             # Color palette
│   │   │   ├── typography.ts         # Font sizes/weights
│   │   │   └── spacing.ts            # Spacing scale
│   │   ├── utils/
│   │   │   ├── validators.ts         # Form validators
│   │   │   ├── formatters.ts         # Data formatters
│   │   │   ├── permissions.ts        # Permission helpers
│   │   │   └── helpers.ts            # General utilities
│   │   └── hooks/
│   │       ├── usePolling.ts         # Generic polling hook
│   │       ├── useReportPolling.ts   # Report polling hook
│   │       ├── useOperationPolling.ts # Operation polling hook
│   │       ├── useLocation.ts        # Location services
│   │       ├── useCamera.ts          # Camera access
│   │       └── useTheme.ts           # Theme management
│   │
│   └── types/                        # Global TypeScript types
│       ├── index.ts                  # Export all types
│       ├── api.ts                    # API response/request types
│       ├── navigation.ts             # Navigation param types
│       ├── data.ts                   # Domain model types
│       └── status.ts                 # Status enum types
│
├── assets/                          # Images, icons, fonts
│   ├── icons/
│   │   ├── app-icon.svg
│   │   ├── ios/                     # iOS icon set
│   │   └── android/                 # Android icon set
│   ├── splash/
│   │   ├── splash-light.png
│   │   ├── splash-dark.png
│   │   └── splash-tablet.png
│   ├── fonts/
│   │   ├── Poppins-Regular.ttf
│   │   ├── Poppins-Medium.ttf
│   │   └── Poppins-Bold.ttf
│   └── images/
│       ├── home-banner.png
│       ├── relief-icon.png
│       └── map-marker.png
│
├── __tests__/                       # Test files (mirrors src structure)
│   ├── components/
│   ├── features/
│   └── lib/
│
├── app.json                         # Expo app configuration
├── app-icon.png                     # Icon (1024×1024)
├── eas.json                         # EAS Build configuration
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind CSS config
├── postcss.config.mjs               # PostCSS config
├── .env.example                     # Environment variables template
├── .env.local                       # Environment variables (git-ignored)
├── package.json                     # Dependencies & scripts
├── DOCUMENTATION.md                 # This file
├── SETUP_GUIDE.md                   # Developer setup
├── API_DOCUMENTATION.md             # API endpoints reference
├── ARCHITECTURE.md                  # Architecture decisions
└── README.md                        # Project overview

```

### Architecture Patterns

#### Feature-Based Organization
- Each feature is self-contained (api, components, hooks, types)
- Minimizes cross-feature dependencies
- Easier to maintain and test
- Easy to move feature to separate package

#### Vertical Slicing
1. **Route** (page.tsx) → Entry point for feature
2. **Component** (User-facing UI)
3. **Hook** (State & logic)
4. **API** (Backend communication)
5. **Types** (TypeScript interfaces)

Example flow: `dang-nhap/page.tsx` → `LoginForm.tsx` → `useAuth()` → `sign-in.ts` → API

#### Layer Responsibilities

| Layer | Responsibility | Examples |
|-------|---|---|
| **Routes (pages)** | Screen entry point, route params | dang-nhap/page.tsx, trang-chu/page.tsx |
| **Components** | UI rendering, event handlers | LoginForm.tsx, Button.tsx, Card.tsx |
| **Hooks** | State management, side effects | useAuth(), usePolling(), useLocation() |
| **API** | Backend communication | sign-in.ts, fetch-reports.ts |
| **Types** | Data structure definitions | auth.ts, report.ts, user.ts |
| **Lib** | Shared utilities | api-client.ts, validators.ts, helpers.ts |

---

## 16.2 Authentication Flow & Token Refresh

### High-Level Authentication Flow

```
User Input
    ↓
LoginForm.tsx (component)
    ↓
useAuth() hook
    |-- Validates input
    |-- Calls sign-in API
    |-- Stores tokens securely
    |-- Updates auth context
    ↓
Navigation updates
    |-- If authenticated: Protected screens
    |-- If not: Auth screens
```

### Token Refresh Mechanism

**Problem:** Access tokens expire after ~1 hour. Refresh tokens last ~7 days.

**Solution:** Automatic refresh on 401 response

```typescript
// lib/api/interceptors.ts
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Call refresh endpoint
      const { accessToken } = await POST /auth/refresh
      
      // Update stored token
      await secureStorage.set('accessToken', accessToken)
      
      // Retry original request
      return apiClient(originalRequest)
    }
    return Promise.reject(error)
  }
)
```

### Session Persistence

**On app start:**
1. Check AsyncStorage for auth state
2. If token exists, validate with API
3. If valid, restore auth context
4. If expired, attempt refresh
5. If refresh fails, clear session → auth screens

```typescript
// features/auth/hooks/useAuthPersist.ts
export function useAuthPersist() {
  useEffect(() => {
    const restoreAuth = async () => {
      const token = await secureStorage.get('accessToken')
      if (token) {
        const user = await validateToken() // HEAD /auth/me
        if (user) {
          setAuthContext({ user, token })
        } else {
          await clearAuth()
        }
      }
    }
    restoreAuth()
  }, [])
}
```

---

## 16.3 Navigation Architecture & Routing

### Route Structure

```
VietFlood/
├── (auth)
│   ├── dang-nhap           # Login screen
│   ├── dang-ky             # Registration
│   └── mo-khoa             # Password reset
├── (protected)
│   ├── (relief)
│   │   ├── quan-ly         # Relief dashboard
│   │   └── [operationId]   # Operation detail
│   ├── (user)
│   │   ├── trang-chu       # Home dashboard
│   │   ├── bao-cao         # Reports list
│   │   ├── tao-bao-cao     # Create report
│   │   └── profile         # User profile
│   └── (admin)             # Admin only
└── (public)
    ├── bao-cao             # Public report view
    └── thong-tin           # About & info
```

### Route Transitions

```
App Start
├─ No token → (auth) screens
├─ Token exists → Validate
│   ├─ Valid → Check role
│   │   ├─ Coordinator → (protected)/(relief)
│   │   ├─ Volunteer → (protected)/(user)
│   │   └─ Admin → (protected)/(admin)
│   └─ Invalid → (auth) screens
└─ Network error → Retry with exponential backoff
```

### Deep Linking

**App can be opened via links:**

```
vietflood://operation/123          → Relief operation detail
vietflood://report/456             → Report detail
vietflood://settings               → Settings screen
https://vietflood.io/operation/123 → Fallback if app not installed
```

**Implementation:**
```typescript
// lib/navigation/linking.ts
const linking: LinkingOptions = {
  prefixes: ['vietflood://', 'https://vietflood.io'],
  config: {
    screens: {
      Home: 'trang-chu',
      'Relief/Detail': 'operation/:id',
      'Reports/Detail': 'report/:id',
      // ...
    }
  }
}
```

---

## 16.4 API Client Usage & Error Handling

### Axios Client Setup

```typescript
// lib/api/client.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor: Add auth token
apiClient.interceptors.request.use(
  async config => {
    const token = await secureStorage.get('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)

// Response interceptor: Handle 401, retry
apiClient.interceptors.response.use(
  response => response.data,
  async error => handleApiError(error)
)

export { apiClient }
```

### API Endpoint Usage

```typescript
// features/reports/api/fetch-reports.ts
import { apiClient } from '@/lib/api/client'

export async function fetchReports(filters?: ReportFilters) {
  try {
    const reports = await apiClient.get('/reports', {
      params: filters
    })
    return reports
  } catch (error) {
    throw new ApiError(
      error.response?.status,
      error.response?.data?.message
    )
  }
}
```

### Error Handling Pattern

**Error Types:**

| Error | Handling |
|-------|----------|
| **NetworkError** | Retry with exponential backoff, show offline message |
| **401 Unauthorized** | Refresh token, retry request, or redirect to login |
| **403 Forbidden** | Show permission error, disable feature |
| **400 Bad Request** | Show validation error from API, highlight input |
| **500 Server Error** | Show generic error, retry button, report to Sentry |
| **Timeout** | Show timeout message, allow retry |

**Implementation:**
```typescript
// lib/api/error-handler.ts
export async function handleApiError(error) {
  const status = error.response?.status
  const message = error.response?.data?.message
  
  if (status === 401) {
    // Token expired, refresh
    await refreshAuth()
  } else if (status === 403) {
    // Permission denied
    return new PermissionError(message)
  } else if (status === 400) {
    // Validation error
    return new ValidationError(message)
  } else if (status >= 500) {
    // Server error, report to Sentry
    Sentry.captureException(error)
  }
}
```

---

## 16.5 Developer Setup Guide (Detailed)

### Prerequisites

**Required Software:**
- Node.js 18+ (or 20 LTS recommended)
- npm 9+ or yarn 3+
- Git
- Expo CLI: `npm install -g eas-cli expo-cli`

**On macOS (for iOS development):**
- Xcode 14+ with Command Line Tools
- Cocoapods: `sudo gem install cocoapods`

**Development Tools (Optional):**
- VS Code with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier code formatter
  - ESLint linter
- Android Studio (for Android Emulator)
- iOS Simulator (included with Xcode)
- Flipper (for debugging)

### Installation Steps

#### 1. Clone Repository
```bash
git clone https://github.com/vietflood/vietflood-app.git
cd VietFlood_app
```

#### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

#### 3. Install EAS & Configure
```bash
npm install -g eas-cli

# Login with Expo account (create if needed at expo.dev)
eas login

# Configure EAS for project
eas build:configure
```

#### 4. Set Environment Variables
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local with:
EXPO_PUBLIC_API_BASE_URL=https://api.vietflood.io
EXPO_PUBLIC_API_TIMEOUT=10000
# Other variables as needed
```

#### 5. Verify Setup
```bash
# Check dependencies
npm ls expo expo-router react-native

# Type check
npm run type-check

# Lint
npm run lint
```

### Running App Locally

#### iOS Simulator (macOS)
```bash
# Boot simulator
open -a Simulator

# Start dev app
npm run ios
# or
expo start --ios
```

#### Android Emulator
```bash
# Start emulator (must be running before this)
# Via Android Studio: Tools → AVD Manager → Run

# Start dev app
npm run android
# or
expo start --android
```

#### Expo Go (Quick Testing)
```bash
# Start dev server
npm start

# Scan QR code with Expo Go app (iOS/Android)
# App launches in Go app automatically
```

#### Physical Device (via Expo Go)
```bash
npm start

# On your device:
# 1. Install Expo Go app from app store
# 2. Open app and scan QR code
# 3. App will launch
```

### Development Workflow

**Typical session:**
```bash
# Terminal 1: Start dev server
npm start

# Terminal 2 (optional): Watch tests
npm run test:watch

# Terminal 3 (optional): Type checking
npm run type-check:watch
```

**Making Changes:**
1. Edit file (e.g., src/features/auth/components/LoginForm.tsx)
2. Save file (Ctrl+S or Cmd+S)
3. Dev app hot-reloads automatically
4. Check console for errors

**Common Commands:**
```bash
# Build APK for testing
eas build --platform android --profile development

# Build IPA via Xcode
npm run ios:build

# Clear cache
npm run clean

# Full reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 16.6 Video Tutorial: Local Development Workflow (Reference)

### Video Outline (~15 minutes)

**Part 1: Initial Setup (3 min)**
- Clone repository
- Install dependencies
- Create .env.local file
- Run first time setup check

**Part 2: Start Development Server (2 min)**
- Open VS Code with project
- Run `npm start`
- Show Expo QR code
- Explain Metro bundler

**Part 3: Running on Simulator (3 min)**
- Launch iOS Simulator / Android Emulator
- Run `npm run ios` / `npm run android`
- Show hot reload in action
- Explain Metro bundler output

**Part 4: Running on Device (3 min)**
- Install Expo Go on physical device
- Run `npm start`
- Scan QR code with device
- Explain network requirements
- Show app launching

**Part 5: Making Changes (2 min)**
- Show LoginForm.tsx file
- Edit form label
- Save file and watch hot reload
- Verify change in app
- Show error boundary in action

**Part 6: Debugging (2 min)**
- Open dev menu (Cmd+D or Ctrl+M)
- Show React DevTools
- Show console logs
- Show performance profiler

### Video Recording Tips

- **Resolution:** 1080p minimum
- **Screen Recording Software:** 
  - macOS: Built-in Screen Record (Cmd+Shift+5)
  - Windows: OBS Studio or ScreenFlow
- **Codecs:** H.264 video, AAC audio
- **Frame Rate:** 30 fps
- **Duration:** ~15 min total

### Post-Processing

- Add intro with project name and duration
- Add captions for key steps
- Add background music (royalty-free)
- Export to MP4, upload to YouTube

---

## 16 Documentation Checklist

✅ **16.1 Project Structure**
- [x] Directory tree created
- [x] Architecture patterns documented
- [x] Layer responsibilities defined
- [x] File organization explained

✅ **16.2 Authentication Flow**
- [x] High-level auth flow diagrammed
- [x] Token refresh mechanism explained
- [x] Session persistence documented
- [x] Code examples provided

✅ **16.3 Navigation Architecture**
- [x] Route structure documented
- [x] Route transitions explained
- [x] Deep linking configured
- [x] Navigation params typed

✅ **16.4 API Client & Error Handling**
- [x] Axios client setup documented
- [x] Interceptors explained
- [x] Error handling patterns defined
- [x] API endpoints usage examples

✅ **16.5 Developer Setup Guide**
- [x] Prerequisites listed
- [x] Installation steps detailed
- [x] Environment variables configured
- [x] Development workflow documented
- [x] Common commands listed

✅ **16.6 Video Tutorial**
- [x] Outline created
- [x] Recording tips provided
- [x] Post-processing guide included

---

## Next Steps for Developers

1. **First Time Contributors:**
   - Read this documentation
   - Follow setup guide
   - Run app on simulator
   - Make small change and verify hot reload

2. **Feature Development:**
   - Follow feature-based organization pattern
   - Create feature folder with api/components/hooks/types subdirs
   - Write TypeScript with full type coverage
   - Test changes on iOS and Android

3. **Deployment:**
   - Follow BUILD_AND_DISTRIBUTION_SETUP.md
   - Use TestFlight for iOS beta
   - Use Google Play internal testing for Android beta

4. **Additional Resources:**
   - [Expo Documentation](https://docs.expo.dev)
   - [React Native Docs](https://reactnative.dev)
   - [React Navigation](https://reactnavigation.org)
   - [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Status: Section 16.1-16.6 Complete**
- All documentation sections created
- Ready for developer onboarding
- Setup guides production-ready
