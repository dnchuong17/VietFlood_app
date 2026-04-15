/**
 * Environment and Configuration Management
 * Centralizes all environment variables and configuration
 */

import { Platform } from 'react-native'

type Environment = 'development' | 'staging' | 'production'

interface AppConfig {
  environment: Environment
  isDevelopment: boolean
  isProduction: boolean
  isStaging: boolean
  apiBaseUrl: string
  sentryDSN: string
  apiTimeout: number
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  enableMockApi: boolean
  platform: typeof Platform.OS
  version: string
  versionCode: number
}

const ENVIRONMENT: Environment = (process.env.NODE_ENV || 'development') as Environment

/**
 * Get environment-specific configuration
 */
function getConfig(): AppConfig {
  const baseConfig: Partial<AppConfig> = {
    environment: ENVIRONMENT,
    isDevelopment: ENVIRONMENT === 'development',
    isProduction: ENVIRONMENT === 'production',
    isStaging: ENVIRONMENT === 'staging',
    platform: Platform.OS,
    version: '1.0.0',
    versionCode: 1,
  }

  const envConfigs: Record<Environment, Partial<AppConfig>> = {
    development: {
      apiBaseUrl: 'http://localhost:3000/api',
      sentryDSN: '',
      apiTimeout: 10000,
      logLevel: 'debug',
      enableMockApi: false,
    },
    staging: {
      apiBaseUrl: 'https://staging-api.vietflood.app/api',
      sentryDSN: 'https://examplePublicKey@o0.ingest.sentry.io/0',
      apiTimeout: 15000,
      logLevel: 'info',
      enableMockApi: false,
    },
    production: {
      apiBaseUrl: 'https://api.vietflood.app/api',
      sentryDSN: 'https://examplePublicKey@o0.ingest.sentry.io/0',
      apiTimeout: 30000,
      logLevel: 'warn',
      enableMockApi: false,
    },
  }

  return {
    ...baseConfig,
    ...envConfigs[ENVIRONMENT],
  } as AppConfig
}

/**
 * Singleton config instance
 */
let config: AppConfig | null = null

/**
 * Get app configuration
 */
export function getAppConfig(): AppConfig {
  if (!config) {
    config = getConfig()
  }
  return config
}

/**
 * Get specific config value
 */
export function getConfigValue<K extends keyof AppConfig>(key: K): AppConfig[K] {
  return getAppConfig()[key]
}

/**
 * Environment-aware logger for config
 */
export function logConfigInit(): void {
  const cfg = getAppConfig()
  const safeConfig = {
    environment: cfg.environment,
    apiBaseUrl: cfg.apiBaseUrl,
    platform: cfg.platform,
    version: cfg.version,
    logLevel: cfg.logLevel,
    isDevelopment: cfg.isDevelopment,
    isProduction: cfg.isProduction,
  }
  console.log('[AppConfig] Initialized:', JSON.stringify(safeConfig, null, 2))
}

/**
 * API endpoint builder
 * Constructs full API URLs with base configuration
 */
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getConfigValue('apiBaseUrl')
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
}

/**
 * Get API timeout for requests
 */
export function getApiTimeout(): number {
  return getConfigValue('apiTimeout')
}

/**
 * Check if API mocking is enabled
 */
export function isMockApiEnabled(): boolean {
  return getConfigValue('enableMockApi')
}

/**
 * Feature flags configuration
 * Easily enable/disable features per environment
 */
export const featureFlags = {
  enableAdvancedReporting: !ENVIRONMENT.includes('development'),
  enableExperimentalUI: ENVIRONMENT === 'development',
  enablePerformanceMonitoring: ENVIRONMENT !== 'development',
  enableDetailedErrorMessages: ENVIRONMENT === 'development',
  enableBetaFeatures: ENVIRONMENT === 'staging',
}

/**
 * Get Sentry DSN for error reporting
 */
export function getSentryDSN(): string {
  const dsn = getConfigValue('sentryDSN')
  if (!dsn) {
    console.warn('[Config] Sentry DSN not configured, error reporting disabled')
  }
  return dsn
}

/**
 * Get minimum log level for current environment
 */
export function getMinLogLevel(): 'debug' | 'info' | 'warn' | 'error' {
  return getConfigValue('logLevel')
}

/**
 * Validate configuration
 * Run at startup to ensure all required values are set
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const cfg = getAppConfig()

  if (!cfg.apiBaseUrl) {
    errors.push('API base URL not configured')
  }

  if (cfg.isProduction && !cfg.sentryDSN) {
    errors.push('Sentry DSN required for production')
  }

  if (!cfg.version) {
    errors.push('App version not set')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Print configuration status (useful for debugging)
 */
export function printConfigStatus(): void {
  const cfg = getAppConfig()
  const validation = validateConfig()

  console.log('================== APP CONFIG ==================')
  console.log(`Environment: ${cfg.environment}`)
  console.log(`API Base URL: ${cfg.apiBaseUrl}`)
  console.log(`Version: ${cfg.version}`)
  console.log(`Platform: ${cfg.platform}`)
  console.log(`Log Level: ${cfg.logLevel}`)
  console.log(`Sentry Enabled: ${!!cfg.sentryDSN}`)
  console.log(`Config Valid: ${validation.valid}`)
  if (validation.errors.length > 0) {
    console.warn('Config Errors:')
    validation.errors.forEach((err) => console.warn(`  - ${err}`))
  }
  console.log('==============================================')
}
