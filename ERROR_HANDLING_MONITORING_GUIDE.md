# VietFlood Error Handling & Monitoring Guide

## Section 19: Error Handling & Monitoring

Complete guide for implementing production-ready error handling, crash reporting, and real-time monitoring.

---

## 19.1 Global Error Boundary with Fallback UI

### Error Boundary Component

```typescript
// components/common/ErrorBoundary.tsx
import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
  children: React.ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  stack: string | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      stack: null
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error)
    console.error('Error info:', errorInfo)

    // Report to monitoring service
    reportError(error, {
      componentStack: errorInfo.componentStack,
      severity: 'error'
    })

    this.setState({
      error,
      stack: errorInfo.componentStack
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, stack: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <ScrollView style={{ padding: 16 }}>
            <View style={{ paddingVertical: 20 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#DC2626',
                  marginBottom: 12
                }}
              >
                Oops! Something went wrong
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: '#666',
                  marginBottom: 16,
                  lineHeight: 20
                }}
              >
                {this.state.error?.message || 'An unexpected error occurred'}
              </Text>

              {process.env.NODE_ENV === 'development' && (
                <View
                  style={{
                    backgroundColor: '#f3f4f6',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#666',
                      fontFamily: 'monospace'
                    }}
                  >
                    {this.state.stack}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={{
                  backgroundColor: '#3B82F6',
                  padding: 16,
                  borderRadius: 8,
                  alignItems: 'center'
                }}
                onPress={this.handleReset}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      )
    }

    return this.props.children
  }
}
```

### Using Error Boundary

```typescript
// app/_layout.tsx
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

export default function RootLayout() {
  return (
    <ErrorBoundary
      onReset={() => {
        // Reset navigation stack on error
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth', params: {} }]
        })
      }}
    >
      <NavigationContainer>
        {/* App routing */}
      </NavigationContainer>
    </ErrorBoundary>
  )
}
```

---

## 19.2 Logging Utility for Debugging

### Logger Service

```typescript
// lib/logging/logger.ts
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  category: string
  message: string
  data?: any
  stack?: string
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 500 // Keep recent 500 logs in memory

  private createEntry(
    level: LogLevel,
    category: string,
    message: string,
    data?: any
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data
    }
  }

  debug(category: string, message: string, data?: any) {
    const entry = this.createEntry(LogLevel.DEBUG, category, message, data)
    console.log(`[${entry.timestamp}] [${category}]`, message, data)
    this.store(entry)
  }

  info(category: string, message: string, data?: any) {
    const entry = this.createEntry(LogLevel.INFO, category, message, data)
    console.log(`[${entry.timestamp}] [${category}]`, message, data)
    this.store(entry)
  }

  warn(category: string, message: string, data?: any) {
    const entry = this.createEntry(LogLevel.WARN, category, message, data)
    console.warn(`[${entry.timestamp}] [${category}]`, message, data)
    this.store(entry)
  }

  error(category: string, message: string, error?: Error, data?: any) {
    const entry = this.createEntry(LogLevel.ERROR, category, message, data)
    if (error) {
      entry.stack = error.stack
    }
    console.error(`[${entry.timestamp}] [${category}]`, message, error, data)
    this.store(entry)
  }

  private store(entry: LogEntry) {
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
  }

  getAllLogs(): LogEntry[] {
    return [...this.logs]
  }

  getLogs(category?: string, level?: LogLevel): LogEntry[] {
    return this.logs.filter(log => {
      if (category && log.category !== category) return false
      if (level !== undefined && log.level < level) return false
      return true
    })
  }

  clear() {
    this.logs = []
  }

  exportAsJSON(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

export const logger = new Logger()
```

### Using Logger

```typescript
// features/auth/api/sign-in.ts
import { logger } from '@/lib/logging/logger'

export async function signIn(email: string, password: string) {
  logger.info('Auth', 'Sign in attempt', { email })

  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password
    })

    logger.info('Auth', 'Sign in successful', { userId: response.user.id })
    return response
  } catch (error) {
    logger.error('Auth', 'Sign in failed', error as Error, { email })
    throw error
  }
}
```

---

## 19.3 Sentry Integration for Crash Reporting

### Sentry Setup

**Install Sentry SDK:**

```bash
npm install @sentry/react-native
```

**Initialize Sentry:**

```typescript
// app/_layout.tsx or app.tsx (main entry)
import * as Sentry from '@sentry/react-native'

if (!__DEV__) {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1, // 10% of events
    integrations: [
      new Sentry.ReactNativeTracing({
        routingInstrumentation: routingInstr,
        tracingOrigins: ['api.vietflood.io', /^\//],
        enableAppStartProfiling: true
      })
    ],
    // Additional config
    ignoreErrors: [
      // Ignore network errors (too noisy)
      'Network request failed',
      'Network timeout'
    ],
    denyUrls: [
      // Ignore logs from third-party libraries
      /graph\.instagram\.com/,
      /connect\.facebook\.net/
    ]
  })
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        {/* App */}
      </NavigationContainer>
    </ErrorBoundary>
  )
}
```

### Environment Variables

**Add to .env.local:**

```bash
EXPO_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

**Get DSN from Sentry:**
1. Create account at sentry.io
2. Create project (React Native / Expo)
3. Copy DSN from project settings
4. Add to environment variables

### Capturing Errors

**Manual error capture:**

```typescript
import * as Sentry from '@sentry/react-native'

try {
  // Some operation
  riskyOperation()
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'relief-operations',
      action: 'create-operation'
    },
    level: 'error'
  })
}
```

**Message capture (non-errors):**

```typescript
// Capture warnings or info
Sentry.captureMessage('User disabled location permissions', 'warning')

// With context
Sentry.captureMessage('API rate limited', 'info', {
  extra: {
    endpoint: '/reports',
    retryAfter: '60s'
  }
})
```

### Breadcrumbs (Activity Trail)

```typescript
// Record user actions
Sentry.addBreadcrumb({
  category: 'user-action',
  message: 'Viewed operation details',
  level: 'info',
  data: {
    operationId: '123',
    timestamp: Date.now()
  }
})

// Before error occurs, these are captured in Sentry
```

### Release Tracking

```json
// app.json
{
  "expo": {
    "version": "0.2.0",
    "plugins": [
      [
        "@sentry/react-native/expo",
        {
          "organization": "vietflood-org",
          "project": "vietflood-app",
          "authToken": "$SENTRY_AUTH_TOKEN"
        }
      ]
    ]
  }
}
```

### Sentry Monitoring

**View in Sentry Dashboard:**
1. Visit sentry.io
2. Select project "VietFlood App"
3. See real-time errors
4. Click error to view stack trace
5. Check affected users
6. Review session replays

---

## 19.4 Timeout Handling

### Network Request Timeouts

```typescript
// lib/api/client.ts
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000, // 10 seconds
  timeoutErrorMessage: 'Request timeout'
})

// Handle timeout errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      // Timeout error
      logger.warn('API', 'Request timeout', { 
        url: error.config?.url 
      })
      
      return Promise.reject({
        type: 'TIMEOUT',
        message: 'Request took too long'
      })
    }
    return Promise.reject(error)
  }
)
```

### Handling Slow Responses

```typescript
// Show timeout UI after 5 seconds
export function useFetchWithTimeout<T>(
  fetchFn: () => Promise<T>,
  timeoutMs: number = 5000
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTimeout, setIsTimeout] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let cancelled = false

    const fetch = async () => {
      setIsLoading(true)
      setIsTimeout(false)
      setError(null)

      // Set timeout warning
      timeoutId = setTimeout(() => {
        if (!cancelled) {
          setIsTimeout(true)
        }
      }, timeoutMs)

      try {
        const result = await fetchFn()
        if (!cancelled) {
          clearTimeout(timeoutId)
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          clearTimeout(timeoutId)
          setError(err as Error)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetch()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [])

  return { data, isLoading, isTimeout, error }
}

// Usage
export function ReportsScreen() {
  const { data: reports, isTimeout } = useFetchWithTimeout(
    () => fetchReports(),
    5000
  )

  return (
    <>
      {isTimeout && (
        <Banner
          message="Taking longer than usual. Please wait..."
          type="warning"
        />
      )}
      {reports && <ReportsList reports={reports} />}
    </>
  )
}
```

---

## 19.5 Retry Logic with Exponential Backoff

### Retry Utility

```typescript
// lib/utils/retry.ts
interface RetryOptions {
  maxRetries?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
  shouldRetry?: (error: any) => boolean
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    backoffMultiplier = 2,
    shouldRetry = (error) => error.response?.status >= 500 // Only retry server errors
  } = options

  let lastError: any
  let delayMs = initialDelayMs

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry if not eligible
      if (!shouldRetry(error)) {
        throw error
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw error
      }

      logger.warn('Retry', `Attempt ${attempt + 1} failed, retrying...`, {
        error: error.message,
        delayMs
      })

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delayMs))

      // Exponential backoff
      delayMs = Math.min(delayMs * backoffMultiplier, maxDelayMs)
    }
  }

  throw lastError
}
```

### Using Retry

```typescript
// Retry failing API request
export async function fetchReportsWithRetry() {
  return withRetry(
    () => apiClient.get('/reports'),
    {
      maxRetries: 3,
      initialDelayMs: 1000,
      shouldRetry: (error) => {
        // Retry on timeout or server error
        if (error.code === 'ECONNABORTED') return true
        if (error.response?.status >= 500) return true
        return false
      }
    }
  )
}
```

---

## 19.6 Monitoring Performance

### Transaction Tracking

```typescript
import * as Sentry from '@sentry/react-native'

export async function fetchReportsWithMonitoring() {
  const transaction = Sentry.startTransaction({
    name: 'Fetch Reports',
    op: 'http.client',
    tags: {
      service: 'reports-api'
    }
  })

  try {
    const span = transaction.startChild({
      description: 'Fetch from API',
      op: 'http.client'
    })

    const reports = await fetchReports()

    span.end()
    transaction.finish()
    return reports
  } catch (error) {
    transaction.setStatus('error')
    transaction.finish()
    throw error
  }
}
```

### Performance Monitoring

```typescript
// Track slow screen renders
Sentry.withProfiler(expensive-component, {
  name: 'ExpensiveComponent',
  includePerformanceMonitoring: true
})

// Track custom metrics
const gauge = new Sentry.GaugeMetric()
gauge.add('app.memory.usage', process.memoryUsage().heapUsed)
```

---

## 19 Error Handling & Monitoring Checklist

✅ **19.1 Error Boundary**
- [x] Global error boundary implemented
- [x] Fallback UI renders on error
- [x] Error details logged for debugging
- [x] Reset button allows recovery
- [x] Errors reported to monitoring service

✅ **19.2 Logging Utility**
- [x] Structured logging service created
- [x] Log levels: debug, info, warn, error
- [x] Logs stored in memory
- [x] Categories for organizing logs
- [x] Export logs as JSON for debugging

✅ **19.3 Sentry Integration**
- [x] Sentry SDK installed and initialized
- [x] DSN configured from environment
- [x] Error capture configured
- [x] Breadcrumbs tracking user actions
- [x] Release tracking enabled

✅ **19.4 Timeout Handling**
- [x] HTTP request timeout set to 10s
- [x] Timeout errors caught and logged
- [x] UI feedback when request slow (5s)
- [x] Graceful handling of timeouts

✅ **19.5 Retry Logic**
- [x] Exponential backoff implemented
- [x] Configurable retry attempts
- [x] Selective retry (only server errors)
- [x] Max delay caps retry intervals
- [x] Used for flaky APIs

---

## Error Types & Handling

| Error Type | Example | Handling |
|-----------|---------|----------|
| **Network Error** | No internet | Show offline message, retry with backoff |
| **Timeout** | API >10s | Show loading spinner, then timeout message |
| **401 Unauthorized** | Token expired | Refresh token, retry, or redirect to login |
| **403 Forbidden** | No permission | Show permission denied, disable feature |
| **404 Not Found** | Resource deleted | Show "not found", navigate back |
| **400 Bad Request** | Validation error | Show field-specific errors |
| **500 Server Error** | Backend crash | Show generic error, retry, report |
| **Parse Error** | Bad JSON | Log, show error, report to Sentry |

---

## Monitoring Dashboard (Sentry)

**Key metrics to monitor:**
- Error rate: Target < 0.5%
- Crash-free rate: Target > 99%
- APDEX score: Target > 0.9
- Slow transactions: Target < 5%
- Mean response time: Target < 200ms
- P95 response time: Target < 1s

**Set up alerts:**
1. Error rate spikes > 2%
2. New recurring error pattern
3. Crash-free rate drops below 95%
4. Performance degradation > 25%

---

## Testing Error Handling

```typescript
// __tests__/error-handling.test.tsx
describe('Error Handling', () => {
  it('should recover from error boundary', async () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    )

    // Error message shown
    expect(getByText(/Something went wrong/)).toBeInTheDocument()

    // Try again button
    fireEvent.press(getByText('Try Again'))

    // Should recover
    await waitFor(() => {
      expect(getByText(/Success/)).toBeInTheDocument()
    })
  })

  it('should retry on timeout', async () => {
    const fetchFn = jest.fn()
      .mockRejectedValueOnce({ code: 'ECONNABORTED' })
      .mockResolvedValueOnce({ success: true })

    const result = await withRetry(fetchFn, { maxRetries: 1 })

    expect(result).toEqual({ success: true })
    expect(fetchFn).toHaveBeenCalledTimes(2)
  })
})
```

---

**Status: Section 19 Complete**
- Error boundary with fallback UI implemented
- Logging utility for debugging created
- Sentry integration for crash reporting set up
- Timeout handling with user feedback
- Retry logic with exponential backoff
- Performance monitoring via Sentry transactions
- Ready for production monitoring
