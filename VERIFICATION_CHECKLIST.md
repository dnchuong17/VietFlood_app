/**
 * PRODUCTION IMPLEMENTATION VERIFICATION CHECKLIST
 * 
 * Use this checklist to verify all infrastructure is correctly implemented
 * Check off each item as you complete them
 */

# ✅ IMPLEMENTATION VERIFICATION CHECKLIST

## SECTION 1: FILE VERIFICATION (Self-Check)

- [ ] src/lib/logging/logger.ts exists (300+ lines)
- [ ] src/components/common/ErrorBoundary.tsx exists (250+ lines)
- [ ] src/lib/api/sentry-config.ts exists (200+ lines)
- [ ] src/lib/utils/retry.ts exists (150+ lines)
- [ ] src/lib/i18n/index.ts exists (60+ lines)
- [ ] src/lib/i18n/locales/en.json exists (2000+ lines)
- [ ] src/lib/i18n/locales/vi.json exists (2000+ lines)
- [ ] eas.json updated to v8.0.0+ format
- [ ] src/lib/utils/accessibility.ts exists (300+ lines)
- [ ] src/lib/providers/LocalizationProvider.tsx exists
- [ ] src/lib/providers/ErrorHandlerProvider.tsx exists
- [ ] src/lib/hooks/useApi.ts exists (250+ lines)
- [ ] src/lib/middleware/accessibility.tsx exists (300+ lines)
- [ ] src/lib/init.ts exists (60+ lines)
- [ ] src/lib/config.ts exists (200+ lines)
- [ ] INTEGRATION_GUIDE.md exists
- [ ] PRODUCTION_IMPLEMENTATION_SUMMARY.md exists

**Files should exist: 17 total (16 new + 1 verification doc)**

---

## SECTION 2: TYPE CHECKING

Run this command to verify TypeScript compilation:

```bash
npm run type-check
# OR
npx tsc --noEmit
```

Expected result: **0 errors, 0 warnings**

- [ ] No TypeScript errors
- [ ] No "Cannot find module" errors
- [ ] No type incompatibility warnings
- [ ] All imports resolve correctly

---

## SECTION 3: LAYOUT.TSX INTEGRATION

Update src/app/layout.tsx:

- [ ] Import LocalizationProvider
- [ ] Import ErrorHandlerProvider
- [ ] Import initializeApp
- [ ] Import getSentryDSN, logConfigInit
- [ ] Add useEffect hook for initialization
- [ ] Call logConfigInit() in useEffect
- [ ] Call initializeApp() in useEffect
- [ ] Wrap app with ErrorHandlerProvider
- [ ] Wrap app with LocalizationProvider
- [ ] File structure matches INTEGRATION_GUIDE.md example

**Should look like:**
```tsx
<ErrorHandlerProvider sentryDSN={getSentryDSN()}>
  <LocalizationProvider>
    {children}
  </LocalizationProvider>
</ErrorHandlerProvider>
```

---

## SECTION 4: LOGGER TESTING

In browser console, test logging:

```javascript
import { logger } from '@/lib/logging/logger'

logger.debug('Test', 'Debug message')
logger.info('Test', 'Info message')
logger.warn('Test', 'Warning message')
logger.error('Test', 'Error message')
```

- [ ] Debug message appears in console
- [ ] Info message appears in console
- [ ] Warning message appears in console
- [ ] Error message appears in console
- [ ] Each log has category 'Test'
- [ ] Each log has a timestamp

---

## SECTION 5: ERROR BOUNDARY TESTING

Trigger an error to test error boundary:

1. Create a test component that throws:
```tsx
function TestErrorComponent() {
  throw new Error('Test error from component')
}
```

2. Render it in the app

Expected behavior:
- [ ] Error boundary catches the error
- [ ] Fallback UI appears with error message
- [ ] Error details visible in development mode
- [ ] No error boundary errors in console
- [ ] "Try Again" button is clickable
- [ ] onReset callback is called when pressed

---

## SECTION 6: SENTRY CONFIGURATION

Set Sentry DSN in environment:

```bash
# .env.local (development)
NEXT_PUBLIC_SENTRY_DSN=

# .env.staging (staging)
NEXT_PUBLIC_SENTRY_DSN=https://staging-dsn@o0.ingest.sentry.io/0

# .env.production (production)
NEXT_PUBLIC_SENTRY_DSN=https://prod-dsn@o0.ingest.sentry.io/0
```

- [ ] DSN configured for your environment
- [ ] Sentry initializes without errors (check logs)
- [ ] getSentryDSN() returns correct DSN
- [ ] initializeApp logs "Sentry crash reporting initialized"

Test Sentry:
```javascript
import * as Sentry from '@sentry/react-native'
Sentry.captureException(new Error('Test Sentry'))
```

- [ ] Error appears in Sentry dashboard
- [ ] Error includes breadcrumbs
- [ ] Error includes context data

---

## SECTION 7: INTERNATIONALIZATION (i18n)

Test translation system:

1. In a component, use:
```tsx
import { useTranslation } from '@/lib/providers/LocalizationProvider'

export function TestI18n() {
  const { t, language } = useTranslation()
  return <div>{t('common.welcome')}</div>
}
```

- [ ] Translation displays correct English text "Welcome"
- [ ] Language state can be retrieved
- [ ] useTranslation hook works without errors

2. Test language switching:
```tsx
const { setLanguage } = useLocalization()
await setLanguage('vi')
```

- [ ] Language switches to Vietnamese
- [ ] Text updates to Vietnamese
- [ ] Language persists in AsyncStorage

Test fallback:
- [ ] If key missing in Vietnamese, shows English
- [ ] If key missing in both, shows key itself

---

## SECTION 8: API RETRY LOGIC

Test API with retry:

1. Create a failing endpoint or use network throttling
2. Make API call:
```tsx
import { apiGet } from '@/features/auth/lib/api-client'

try {
  const response = await apiGet('/api/test')
} catch (error) {
  console.error('Failed after retries:', error)
}
```

- [ ] On first network error, retry is attempted
- [ ] Logs show retry attempts with delays
- [ ] After 2 retries (3 total attempts), fails
- [ ] Logger shows exponential backoff timing
- [ ] No uncaught promise rejections

Test hook:
```tsx
const { data, loading, error, refetch } = useFetch('/api/data')
```

- [ ] Initial loading state is true
- [ ] Data loads correctly
- [ ] Error state on failure
- [ ] refetch() works

---

## SECTION 9: ACCESSIBILITY VERIFICATION

1. Test accessible components:
```tsx
import { AccessibleButton } from '@/lib/middleware/accessibility'

<AccessibleButton
  label="Submit Form"
  hint="Click to submit"
  onPress={() => handleSubmit()}
>
  Submit
</AccessibleButton>
```

- [ ] Button has aria-label attribute
- [ ] Button has aria-hint attribute
- [ ] Button size is at least 44x44 points
- [ ] Keyboard navigation works (Enter/Space)

2. Test screen reader announcement:
```tsx
import { announceStatusChange } from '@/lib/middleware/accessibility'

announceStatusChange('Operation completed successfully', 'success')
```

- [ ] Message is announced to screen readers (check browser accessibility inspector)

3. Validate components:
```tsx
import { validateAccessibility } from '@/lib/middleware/accessibility'

const isAccessible = validateAccessibility(<MyButton />)
```

- [ ] Returns true for accessible components
- [ ] Logs warnings for inaccessible components (in dev mode)

---

## SECTION 10: CONFIGURATION MANAGEMENT

Test configuration:

```javascript
import { getAppConfig, getConfigValue, buildApiUrl } from '@/lib/config'

// Check current config
const config = getAppConfig()
console.log(config.environment) // 'development' | 'staging' | 'production'
console.log(config.apiBaseUrl)  // Correct for environment

// Build API URL
const endpoint = buildApiUrl('/users')
console.log(endpoint) // Should include base URL

// Validate config
const validation = validateConfig()
console.log(validation.valid) // true
console.log(validation.errors) // Empty array
```

- [ ] getAppConfig() returns correct environment settings
- [ ] API base URL matches expected for environment
- [ ] buildApiUrl() constructs correct full URLs
- [ ] Feature flags are boolean
- [ ] validateConfig() returns valid: true

---

## SECTION 11: PROVIDER TESTING

Verify all providers work together:

1. Nest providers as in INTEGRATION_GUIDE.md
2. Check that:
- [ ] No console errors on app load
- [ ] No "useLocalization must be used within" errors
- [ ] No "ErrorBoundary already exists" warnings
- [ ] All providers initialize without errors
- [ ] initializeApp completes successfully

---

## SECTION 12: BUILD VERIFICATION

Run build commands:

```bash
npm run build
# or
npm run type-check
npm run lint
```

Expected results:
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] No build warnings
- [ ] Build completes successfully
- [ ] Dist folder contains all files

---

## SECTION 13: COMPONENT INTEGRATION

Update components to use new system:

- [ ] Replace console.log with logger calls
- [ ] Replace hardcoded strings with t() calls
- [ ] Use useApi hooks for data fetching
- [ ] Use AccessibleButton/Input for forms
- [ ] Use announceStatusChange for feedback
- [ ] Error boundary wraps top-level pages

Sample component update:
```tsx
import { useTranslation } from '@/lib/providers/LocalizationProvider'
import { logger } from '@/lib/logging/logger'
import { AccessibleButton } from '@/lib/middleware/accessibility'
import { useFetch } from '@/lib/hooks/useApi'

export function MyComponent() {
  const { t } = useTranslation()
  const { data, loading } = useFetch('/api/my-data')

  const handleClick = () => {
    logger.info('MyComponent', 'Button clicked')
  }

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      {loading ? t('common.loading') : data}
      <AccessibleButton
        label={t('common.submit')}
        onPress={handleClick}
      >
        {t('common.submit')}
      </AccessibleButton>
    </div>
  )
}
```

- [ ] Component compiles without errors
- [ ] useTranslation works in component
- [ ] logger doesn't break functionality
- [ ] API call completes and displays data
- [ ] Button is clickable and accessible

---

## SECTION 14: ENVIRONMENT SETUP

Verify all environments:

**Development (.env.local):**
- [ ] NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
- [ ] NODE_ENV=development
- [ ] Log level shows debug messages

**Staging (.env.staging):**
- [ ] NEXT_PUBLIC_API_BASE_URL=https://staging-api.vietflood.app/api
- [ ] NODE_ENV=staging
- [ ] Sentry DSN configured
- [ ] Log level shows info messages

**Production (.env.production):**
- [ ] NEXT_PUBLIC_API_BASE_URL=https://api.vietflood.app/api
- [ ] NODE_ENV=production
- [ ] Sentry DSN configured
- [ ] Log level shows warn messages only

---

## SECTION 15: EAS BUILD VERIFICATION

Update EAS configuration:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to EAS
eas login

# Build for development
eas build --platform ios --profile development

# Build for staging
eas build --platform ios --profile preview

# Build for production
eas build --platform ios --profile production
```

- [ ] All three profiles build successfully
- [ ] Development build works on simulator
- [ ] Preview build works on TestFlight
- [ ] Production build ready for App Store
- [ ] Android builds also work

---

## SECTION 16: PRODUCTION DEPLOYMENT

Final checks before production:

- [ ] All files checked in version control
- [ ] No console errors or warnings
- [ ] All TypeScript types verified
- [ ] Error boundary working
- [ ] Sentry reporting errors
- [ ] i18n showing correct language
- [ ] API retries working
- [ ] Accessibility tests passing
- [ ] Logging shows all important events
- [ ] Feature flags set appropriately
- [ ] API endpoints are correct
- [ ] All environment variables configured
- [ ] No hardcoded development URLs
- [ ] No debug code left in production
- [ ] Performance is acceptable

---

## SECTION 17: MONITORING POST-DEPLOYMENT

After deploying to production:

- [ ] Sentry dashboard shows no spike in errors
- [ ] Logs contain expected trace of user interactions
- [ ] API calls succeeding with expected retry behavior
- [ ] Users can switch language if enabled
- [ ] App doesn't crash on errors
- [ ] Error boundary catches and reports errors
- [ ] Performance acceptable

---

## QUICK REFERENCE CHECKLIST

### Must Do (Critical):
- [ ] Update layout.tsx with providers
- [ ] Configure Sentry DSN
- [ ] Configure API endpoints
- [ ] Test error boundary
- [ ] Test logger system
- [ ] TypeScript check passes

### Should Do (Recommended):
- [ ] Integrate i18n in components
- [ ] Use accessibility components
- [ ] Test on iOS/Android
- [ ] Configure EAS build profiles
- [ ] Test API retry logic

### Nice To Have (Optional):
- [ ] Custom styling for error boundary
- [ ] Additional languages support
- [ ] Custom feature flags
- [ ] Performance monitoring hooks

---

## TROUBLESHOOTING

**Logger not showing:**
→ Check NODE_ENV is set correctly
→ Verify logger level filter
→ Check browser console storage

**Sentry not reporting:**
→ Verify DSN is configured
→ Check network tab for sentry requests
→ Verify error boundary is catching errors

**i18n not working:**
→ Check LocalizationProvider wraps app
→ Verify useTranslation inside provider
→ Check translation keys exist in JSON files

**API not retrying:**
→ Check withRetry is imported
→ Verify error is network type
→ Check retry config in apiRequest

**Accessibility not working:**
→ Check component is wrapped with provider
→ Verify aria-label is set
→ Check minimum touch target size (44x44)

---

## COMPLETION CRITERIA

✅ All 17 sections checked and working
✅ No TypeScript errors
✅ No console errors on app load
✅ Error boundary catches errors
✅ Sentry reports errors
✅ i18n works for EN and VI
✅ API calls retry on failure
✅ Accessibility working
✅ Build succeeds
✅ Tests of each component pass

**WHEN ALL CHECKED: 🟢 READY FOR PRODUCTION**
