/**
 * Sentry configuration for error tracking and performance monitoring
 * Initialize in app entry point: import initSentry from '@/lib/api/sentry-config'; initSentry()
 */

import * as Sentry from '@sentry/react-native'
import { logger } from '@/lib/logging/logger'

export function initSentry() {
  const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN

  if (!sentryDsn) {
    logger.warn('Sentry', 'EXPO_PUBLIC_SENTRY_DSN not configured, Sentry disabled')
    return
  }

  try {
    Sentry.init({
      dsn: sentryDsn,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.5,
      enableAutoSessionTracking: true,
      sessionSampleRate: 1.0,
      attachStacktrace: true,
      maxBreadcrumbs: 100,

      // Ignore certain errors
      ignoreErrors: [
        // Network errors
        'Network request failed',
        'Network timeout',
        'ECONNABORTED',
        'ECONNREFUSED',
        'ETIMEDOUT',
        // React Native specific
        'Non-serializable object in AsyncStorage detected',
        // Third-party
        'ResizeObserver loop',
        'canvas.contentDocument'
      ],

      // Filter URLs
      denyUrls: [
        // Google Analytics
        /google-analytics\.com/,
        // Facebook
        /connect\.facebook\.net/,
        // Instagram
        /graph\.instagram\.com/
      ],

      beforeSend(event, hint) {
        // Filter out sensitive data
        if (event.request) {
          // Remove auth headers
          delete event.request.headers?.[' Authorization']
        }

        // Filter personal data
        if (event.user) {
          // Keep minimal user info
          const { id, email } = event.user
          event.user = { id, email: email?.split('@')[0] } // Hash email
        }

        return event
      }
    })

    logger.info('Sentry', 'Initialized successfully')
  } catch (err) {
    logger.error('Sentry', 'Failed to initialize', err as Error)
  }
}

/**
 * Capture exception with context
 */
export function captureException(
  error: Error,
  context?: {
    section?: string
    action?: string
    userId?: string
    metadata?: Record<string, any>
  }
) {
  Sentry.withScope(scope => {
    if (context?.section) scope.setTag('section', context.section)
    if (context?.action) scope.setTag('action', context.action)
    if (context?.userId) scope.setUser({ id: context.userId })
    if (context?.metadata) scope.setContext('metadata', context.metadata)

    Sentry.captureException(error)
  })

  logger.error('Sentry', 'Exception captured', error, context)
}

/**
 * Capture message with severity
 */
export function captureMessage(
  message: string,
  level: 'debug' | 'info' | 'warning' | 'error' | 'fatal' = 'info',
  context?: Record<string, any>
) {
  Sentry.captureMessage(message, level)
  logger.info('Sentry', `Message captured: ${message}`, context)
}

/**
 * Add breadcrumb for activity trail
 */
export function addBreadcrumb(
  category: string,
  message: string,
  level: 'debug' | 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    category,
    message,
    level,
    data,
    timestamp: Date.now() / 1000
  })
}

/**
 * Track transaction/operation
 */
export function startTransaction(
  name: string,
  op: string = 'http.client'
): Sentry.Transaction | null {
  try {
    return Sentry.startTransaction({
      name,
      op,
      trimEnd: true
    })
  } catch (err) {
    logger.warn('Sentry', 'Failed to start transaction', { name, op })
    return null
  }
}

export default initSentry
