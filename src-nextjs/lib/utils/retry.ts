/**
 * Retry utility with exponential backoff
 * Used for API calls and other operations that may fail transiently
 */

import { logger } from '@/lib/logging/logger'

export interface RetryOptions {
  maxRetries?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
  shouldRetry?: (error: any) => boolean
  onRetry?: (attempt: number, error: any) => void
}

/**
 * Execute function with retry logic and exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    backoffMultiplier = 2,
    shouldRetry = (error) => {
      // Retry on network errors and server errors (500+)
      if (error?.code === 'ECONNABORTED') return true
      if (error?.code === 'ECONNREFUSED') return true
      if (error?.code === 'ETIMEDOUT') return true
      if (error?.response?.status >= 500) return true
      return false
    },
    onRetry
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
        logger.debug('Retry', `Not retrying: ${error?.message}`)
        throw error
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        logger.warn('Retry', `Max retries reached, giving up`, {
          attempts: attempt + 1,
          error: error?.message
        })
        throw error
      }

      logger.warn('Retry', `Attempt ${attempt + 1} failed, retrying in ${delayMs}ms`, {
        error: error?.message,
        attempt: attempt + 1
      })

      onRetry?.(attempt + 1, error)

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delayMs))

      // Exponential backoff with jitter
      const jitter = Math.random() * 0.1 * delayMs
      delayMs = Math.min(delayMs * backoffMultiplier + jitter, maxDelayMs)
    }
  }

  throw lastError
}

/**
 * Create a retryable async function
 */
export function makeRetryable<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: RetryOptions
): T {
  return (async (...args: any[]) => {
    return withRetry(() => fn(...args), options)
  }) as T
}
