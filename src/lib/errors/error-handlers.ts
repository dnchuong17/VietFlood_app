import { AppError, ErrorCode, parseApiError, createError } from "./error-types"

/**
 * Retry logic for handling retriable errors
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number
    delay?: number
    backoff?: number
  }
): Promise<T> {
  const maxRetries = options?.maxRetries ?? 3
  const delay = options?.delay ?? 1000
  const backoff = options?.backoff ?? 1.5

  let lastError: Error | null = null
  let currentDelay = delay

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      const appError = error instanceof AppError ? error : parseApiError(error)

      // If not retryable, throw immediately
      if (!appError.retryable) {
        throw appError
      }

      // If this was the last attempt, throw
      if (attempt === maxRetries - 1) {
        throw appError
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, currentDelay))
      currentDelay *= backoff
    }
  }

  throw lastError || createError(ErrorCode.UNKNOWN, "Max retries exceeded")
}

/**
 * Handle API errors with logging
 */
export function handleApiError(error: any): AppError {
  const appError = parseApiError(error)

  // Log error for monitoring
  console.error(`[${appError.code}] ${appError.message}`, {
    originalError: appError.originalError,
    statusCode: appError.statusCode,
  })

  return appError
}

/**
 * Format error for display
 */
export function formatErrorMessage(error: any): string {
  if (error instanceof AppError) {
    return error.userMessage || error.message
  }

  if (typeof error === "string") {
    return error
  }

  if (error?.message) {
    return error.message
  }

  return "An unknown error occurred"
}

/**
 * Safe async operation wrapper
 */
export async function trySafe<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<T | typeof fallback> {
  try {
    return await fn()
  } catch (error) {
    console.error("Safe operation failed:", error)
    return fallback
  }
}

export default {
  withRetry,
  handleApiError,
  formatErrorMessage,
  trySafe,
}
