/**
 * PRODUCTION INFRASTRUCTURE - QUICK INDEX
 * 
 * Fast reference guide to find the file you need
 * All 16 production files created in this implementation
 */

## 📋 QUICK FILE INDEX

### 🔴 CRITICAL (Must Have)
════════════════════════════════════════════════════════════

1. **src/lib/logging/logger.ts** - Centralized logging
   - Use for: Debug tracking, error logging
   - Import: `import { logger } from '@/lib/logging/logger'`
   - Call: `logger.info('Category', 'Message', data)`

2. **src/components/common/ErrorBoundary.tsx** - Error recovery UI
   - Use for: App root wrapper
   - Import: Auto-wrapped by ErrorHandlerProvider
   - Wrap: Around entire app in layout.tsx

3. **src/lib/api/sentry-config.ts** - Crash reporting setup
   - Use for: Production error visibility
   - Call: `initSentry(dsn)` in app initialization
   - Import: Auto-called by ErrorHandlerProvider

### 🟡 HIGH PRIORITY (Setup Required)
════════════════════════════════════════════════════════════

4. **src/lib/providers/LocalizationProvider.tsx** - i18n context
   - Use for: Language switching, translations
   - Import: `import { useTranslation } from '@/lib/providers/LocalizationProvider'`
   - Wrap: Around app in layout.tsx
   - Call: `const { t } = useTranslation(); t('key')`

5. **src/lib/providers/ErrorHandlerProvider.tsx** - Global error setup
   - Use for: Global error handlers
   - Wrap: Around app in layout.tsx (before LocalizationProvider)
   - Call: `initializeApp()` in useEffect

6. **src/lib/config.ts** - Environment configuration
   - Use for: API URLs, feature flags, settings
   - Import: `import { getAppConfig, buildApiUrl } from '@/lib/config'`
   - Call: `buildApiUrl('/api/endpoint')`

### 🟢 FUNCTIONAL (Ready to Use)
════════════════════════════════════════════════════════════

7. **src/lib/utils/retry.ts** - Retry with exponential backoff
   - Use for: Wrapping async functions
   - Import: `import { withRetry } from '@/lib/utils/retry'`
   - Call: `await withRetry(asyncFunc, { maxRetries: 3 })`

8. **src/lib/utils/accessibility.ts** - WCAG utilities
   - Use for: Accessible components
   - Import: `import { AccessibleButton } from '@/lib/utils/accessibility'`
   - Use: `<AccessibleButton label="Text" onPress={fn} />`

9. **src/lib/hooks/useApi.ts** - Common API hooks
   - Use for: Data fetching patterns
   - Import: `import { useFetch, usePolling } from '@/lib/hooks/useApi'`
   - Call: `const { data, loading } = useFetch('/api/endpoint')`

10. **src/lib/i18n/index.ts** - i18n configuration
    - Use for: Language functions
    - Import: Auto-imported by hooks
    - Call: `t('key')` in components

### 📝 LOCALIZATION (Ready to Use)
════════════════════════════════════════════════════════════

11. **src/lib/i18n/locales/en.json** - English translations (2000+ lines)
    - Covers: Auth, navigation, home, reports, relief, profile, settings, errors
    - Modified by: Replace with your actual strings
    - Used by: t() function in components

12. **src/lib/i18n/locales/vi.json** - Vietnamese translations (2000+ lines)
    - Covers: Same as en.json, all translated
    - Modified by: Add as alternate language
    - Used by: t() function when language is 'vi'

### 🏗️ MIDDLEWARE & UTILITIES
════════════════════════════════════════════════════════════

13. **src/lib/middleware/accessibility.tsx** - a11y components & HOCs
    - Use for: Accessible UI components
    - Export: AccessibleButton, AccessibleInput, withAccessibility
    - Import: `import { withAccessibility } from '@/lib/middleware/accessibility'`

14. **src/lib/init.ts** - App initialization
    - Use for: Setup infrastructure on app start
    - Import: `import { initializeApp } from '@/lib/init'`
    - Call: `await initializeApp({ sentryDSN, enableLogging: true })`

### ⚙️ BUILD & CONFIGURATION
════════════════════════════════════════════════════════════

15. **eas.json** - EAS build configuration (UPDATED)
    - Use for: Building iOS/Android with EAS
    - Modified: Updated from v5.0.0 to v8.0.0+
    - Profiles: development, preview, production
    - Run: `eas build --platform ios --profile production`

### 📚 DOCUMENTATION
════════════════════════════════════════════════════════════

16. **INTEGRATION_GUIDE.md** - Setup instructions
    - Read: How to integrate in layout.tsx
    - Contains: Example code, usage patterns, init flow

17. **PRODUCTION_IMPLEMENTATION_SUMMARY.md** - Full overview
    - Read: Complete description of all files
    - Contains: Features, metrics, next steps

18. **VERIFICATION_CHECKLIST.md** - Testing guide
    - Use: Verify everything works
    - Contains: 17 sections with step-by-step checks

---

## 🚀 GETTING STARTED (5 Minutes)

### Step 1: Update layout.tsx (Most Important)
```tsx
import { LocalizationProvider } from '@/lib/providers/LocalizationProvider'
import { ErrorHandlerProvider } from '@/lib/providers/ErrorHandlerProvider'
import { initializeApp } from '@/lib/init'
import { getSentryDSN } from '@/lib/config'

export default function RootLayout({ children }) {
  useEffect(() => {
    initializeApp({ sentryDSN: getSentryDSN() })
  }, [])

  return (
    <ErrorHandlerProvider sentryDSN={getSentryDSN()}>
      <LocalizationProvider>
        {children}
      </LocalizationProvider>
    </ErrorHandlerProvider>
  )
}
```

### Step 2: Update a Component
```tsx
import { useTranslation } from '@/lib/providers/LocalizationProvider'
import { logger } from '@/lib/logging/logger'

export function MyComponent() {
  const { t } = useTranslation()

  const handleClick = () => {
    logger.info('MyComponent', 'Clicked')
  }

  return (
    <button onClick={handleClick}>
      {t('common.click_me')}
    </button>
  )
}
```

### Step 3: Test
```bash
npm run build    # Check TypeScript
npm start        # Run app
```

---

## 📊 FILE ORGANIZATION

```
src/lib/
├── logging/
│   └── logger.ts (300 lines)
├── i18n/
│   ├── index.ts
│   └── locales/
│       ├── en.json
│       └── vi.json
├── api/
│   └── sentry-config.ts
├── utils/
│   ├── retry.ts
│   └── accessibility.ts
├── providers/
│   ├── LocalizationProvider.tsx
│   └── ErrorHandlerProvider.tsx
├── hooks/
│   └── useApi.ts
├── middleware/
│   └── accessibility.tsx
├── init.ts
└── config.ts

src/components/
└── common/
    └── ErrorBoundary.tsx

src/features/auth/lib/
└── api-client.ts (UPDATED)

Root/
├── eas.json (UPDATED)
├── INTEGRATION_GUIDE.md
├── PRODUCTION_IMPLEMENTATION_SUMMARY.md
└── VERIFICATION_CHECKLIST.md
```

---

## 🔑 KEY FUNCTIONS BY USE CASE

### "I need to log something"
```javascript
import { logger } from '@/lib/logging/logger'
logger.info('Category', 'Message', optionalData)
```

### "I need to translate text"
```javascript
import { useTranslation } from '@/lib/providers/LocalizationProvider'
const { t } = useTranslation()
const text = t('common.welcome')
```

### "I need to fetch data"
```javascript
import { useFetch } from '@/lib/hooks/useApi'
const { data, loading, error } = useFetch('/api/users')
```

### "I need to poll data"
```javascript
import { usePolling } from '@/lib/hooks/useApi'
const { data } = usePolling('/api/status', { interval: 5000 })
```

### "I need an accessible button"
```javascript
import { AccessibleButton } from '@/lib/middleware/accessibility'
<AccessibleButton label="Submit" onPress={handleSubmit}>
  Submit
</AccessibleButton>
```

### "I need API base URL"
```javascript
import { buildApiUrl } from '@/lib/config'
const url = buildApiUrl('/users')
```

### "I need to initialize app"
```javascript
import { initializeApp } from '@/lib/init'
await initializeApp({ sentryDSN: '...' })
```

### "I need to wrap with error boundary"
```javascript
import { ErrorHandlerProvider } from '@/lib/providers/ErrorHandlerProvider'
<ErrorHandlerProvider>
  <MyApp />
</ErrorHandlerProvider>
```

---

## ✅ PRIORITY IMPLEMENTATION ORDER

1. **ABSOLUTELY FIRST** (Required for app to work):
   - Update layout.tsx with providers
   - Set NODE_ENV and API URLs in .env

2. **RIGHT AFTER**:
   - Replace console.log with logger
   - Replace hardcoded strings with t()
   - Wrap components with AccessibleButton

3. **AFTERWARDS**:
   - Integrate useApi hooks
   - Test error boundary
   - Configure Sentry DSN

4. **OPTIONAL**:
   - Add more accessibility patterns
   - Configure feature flags
   - Setup EAS builds

---

## 🆘 NEED HELP?

| Problem | Solution | File |
|---------|----------|------|
| errors not showing | Verify ErrorBoundary wraps app | ErrorBoundary.tsx |
| translations not working | Check LocalizationProvider wraps app | LocalizationProvider.tsx |
| logger not working | Check logger is imported correctly | logger.ts |
| API not retrying | Verify apiRequest uses withRetry | api-client.ts |
| accessibility not working | Check AccessibleButton has label | accessibility.tsx |
| config not loading | Verify getAppConfig is called | config.ts |
| app won't start | Check initializeApp is called | init.ts |

---

## 📞 REFERENCE LINKS

- View full setup: INTEGRATION_GUIDE.md
- View complete overview: PRODUCTION_IMPLEMENTATION_SUMMARY.md
- Run verification: VERIFICATION_CHECKLIST.md
- See all functions: Each file has JSDoc comments

---

**NEXT**: Open INTEGRATION_GUIDE.md to get started!
**THEN**: Follow VERIFICATION_CHECKLIST.md section by section
**FINALLY**: Deploy with eas.json profiles

Status: 🟢 READY TO INTEGRATE
Target: 5 minutes to get started
Complexity: Medium (Update layout.tsx + use functions)
