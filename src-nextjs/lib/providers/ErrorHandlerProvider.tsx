/**
 * Error handling provider
 * Sets up global error handlers, Sentry, and logging
 */

import React, { useEffect } from 'react'
import { Platform, Alert } from 'react-native'
import { initSentry } from '@/lib/api/sentry-config'
import { logger } from '@/lib/logging/logger'
import ErrorBoundary from '@/components/common/ErrorBoundary'

interface ErrorHandlerProviderProps {
  children: React.ReactNode
  sentryDSN?: string
}

/**
 * Error handler provider component
 * Wrap your app with this to enable global error handling
 */
export function ErrorHandlerProvider({ children, sentryDSN }: ErrorHandlerProviderProps) {
  useEffect(() => {
    setupGlobalErrorHandlers(sentryDSN)
  }, [sentryDSN])

  const handleErrorReset = () => {
    logger.info('ErrorHandling', 'Error boundary reset triggered')
    // Reset app state if needed
  }

  return (
    <ErrorBoundary onReset={handleErrorReset}>
      {children}
    </ErrorBoundary>
  )
}

/**
 * Setup global error handlers
 * Handle unhandled promise rejections and React errors
 */
function setupGlobalErrorHandlers(sentryDSN?: string) {
  // Initialize Sentry if DSN is provided
  if (sentryDSN) {
    try {
      initSentry(sentryDSN)
      logger.info('ErrorHandling', 'Sentry initialized')
    } catch (err) {
      logger.error('ErrorHandling', 'Failed to initialize Sentry', err as Error)
    }
  }

  // Handle unhandled promise rejections
  if (Platform.OS === 'web') {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      logger.error('UnhandledRejection', 'Unhandled promise rejection', error)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  } else {
    // React Native: Set up global error handler
    const originalErrorHandler = ErrorUtils.getGlobalHandler?.()

    const handleGlobalError = (error: Error, isFatal: boolean) => {
      logger.error('GlobalError', `${isFatal ? 'Fatal' : 'Non-fatal'} error`, error)

      if (isFatal) {
        Alert.alert(
          'Application Error',
          'An unexpected error occurred. Please restart the app.',
          [{ text: 'OK' }]
        )
      }

      // Call original handler
      originalErrorHandler?.(error, isFatal)
    }

    if (ErrorUtils.setGlobalHandler) {
      ErrorUtils.setGlobalHandler(handleGlobalError)
    }
  }
}

/**
 * Async error boundary for catching errors in async functions
 * Wrap async operations with this HOC
 */
export function withAsyncErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R | null> {
  return async (...args: T) => {
    try {
      return await fn(...args)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      logger.error('AsyncError', 'Async operation failed', err)
      throw err
    }
  }
}

/**
 * Global error logger helper
 * Use in catch blocks to standardize error logging
 */
export function logError(
  context: string,
  error: unknown,
  additionalData?: Record<string, any>
) {
  const err = error instanceof Error ? error : new Error(String(error))
  logger.error(context, err.message, { ...additionalData, stack: err.stack })
}
