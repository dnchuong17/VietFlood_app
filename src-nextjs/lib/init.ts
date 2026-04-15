/**
 * App Initialization Module
 * Initializes all core infrastructure: logging, error handling, Sentry, i18n
 * Call initializeApp() at the very start of your app
 */

import { initSentry } from '@/lib/api/sentry-config'
import { logger } from '@/lib/logging/logger'
import { getCurrentLanguage } from '@/lib/i18n'

let initialized = false

/**
 * Initialize all app infrastructure
 * Should be called once at app startup, before rendering components
 */
export async function initializeApp(options?: {
  sentryDSN?: string
  enableLogging?: boolean
  environment?: 'development' | 'staging' | 'production'
}): Promise<void> {
  if (initialized) {
    logger.warn('AppInit', 'App already initialized, skipping')
    return
  }

  try {
    logger.info('AppInit', 'Starting app initialization')

    const environment = options?.environment || process.env.NODE_ENV || 'development'
    const enableLogging = options?.enableLogging !== false

    // 1. Verify logging is working
    logger.info('AppInit', 'Logging system initialized', { environment, enableLogging })

    // 2. Initialize Sentry for crash reporting
    if (options?.sentryDSN) {
      try {
        initSentry(options.sentryDSN)
        logger.info('AppInit', 'Sentry crash reporting initialized')
      } catch (err) {
        logger.error('AppInit', 'Failed to initialize Sentry', err as Error)
      }
    } else {
      logger.warn('AppInit', 'Sentry DSN not provided, crash reporting disabled')
    }

    // 3. Initialize localization
    try {
      const language = await getCurrentLanguage()
      logger.info('AppInit', 'Localization initialized', { language })
    } catch (err) {
      logger.error('AppInit', 'Failed to initialize localization', err as Error)
    }

    // 4. Verify app state
    logger.info('AppInit', 'App initialization complete', {
      environment,
      timestamp: new Date().toISOString(),
    })

    initialized = true
  } catch (err) {
    logger.error('AppInit', 'Fatal error during app initialization', err as Error)
    throw err
  }
}

/**
 * Get app initialization status
 */
export function isAppInitialized(): boolean {
  return initialized
}

/**
 * Get current app logger
 * Same as importing logger directly, but verifies app is initialized
 */
export function getAppLogger() {
  if (!initialized) {
    throw new Error('App not initialized. Call initializeApp() first.')
  }
  return logger
}

/**
 * Reset app state (useful for testing or logout scenarios)
 */
export function resetApp(): void {
  logger.info('AppInit', 'Resetting app')
  initialized = false
}
