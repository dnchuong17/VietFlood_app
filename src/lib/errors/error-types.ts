/**
 * Error Types and Constants
 * Standardized error codes and types for the application
 */

export enum ErrorCode {
  // Network Errors
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  CONNECTION_FAILED = "CONNECTION_FAILED",

  // Auth Errors
  AUTH_FAILED = "AUTH_FAILED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",

  // Validation Errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",

  // Resource Errors
  NOT_FOUND = "NOT_FOUND",
  RESOURCE_CONFLICT = "RESOURCE_CONFLICT",
  RESOURCE_DELETED = "RESOURCE_DELETED",

  // Server Errors
  SERVER_ERROR = "SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  RATE_LIMITED = "RATE_LIMITED",

  // Unknown Error
  UNKNOWN = "UNKNOWN_ERROR",
}

/**
 * AppError class - standardized error type for the application
 */
export class AppError extends Error {
  code: ErrorCode
  statusCode?: number
  originalError?: Error
  retryable?: boolean
  userMessage?: string

  constructor(
    code: ErrorCode,
    message: string,
    options?: {
      statusCode?: number
      originalError?: Error
      retryable?: boolean
      userMessage?: string
    }
  ) {
    super(message)
    this.name = "AppError"
    this.code = code
    this.statusCode = options?.statusCode
    this.originalError = options?.originalError
    this.retryable = options?.retryable ?? isRetryable(code)
    this.userMessage = options?.userMessage ?? getDefaultUserMessage(code)

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

/**
 * Create a standardized app error
 */
export function createError(
  code: ErrorCode,
  message: string,
  options?: {
    statusCode?: number
    originalError?: Error
    retryable?: boolean
    userMessage?: string
  }
): AppError {
  return new AppError(code, message, options)
}

/**
 * Check if an error is retryable
 */
export function isRetryable(code: ErrorCode): boolean {
  const retryableCodes = [
    ErrorCode.NETWORK_ERROR,
    ErrorCode.TIMEOUT_ERROR,
    ErrorCode.CONNECTION_FAILED,
    ErrorCode.SERVER_ERROR,
    ErrorCode.SERVICE_UNAVAILABLE,
    ErrorCode.RATE_LIMITED,
  ]
  return retryableCodes.includes(code)
}

/**
 * Get user-friendly error message
 */
export function getDefaultUserMessage(code: ErrorCode): string {
  const messages: Record<ErrorCode, string> = {
    [ErrorCode.NETWORK_ERROR]: "Network connection failed. Please try again.",
    [ErrorCode.TIMEOUT_ERROR]: "Request timed out. Please try again.",
    [ErrorCode.CONNECTION_FAILED]: "Could not connect to server. Please try again.",
    [ErrorCode.AUTH_FAILED]: "Authentication failed. Please try again.",
    [ErrorCode.INVALID_CREDENTIALS]: "Invalid email or password.",
    [ErrorCode.TOKEN_EXPIRED]: "Your session has expired. Please log in again.",
    [ErrorCode.UNAUTHORIZED]: "You are not authorized to perform this action.",
    [ErrorCode.FORBIDDEN]: "Access denied.",
    [ErrorCode.VALIDATION_ERROR]: "Please check your input and try again.",
    [ErrorCode.INVALID_INPUT]: "Invalid input provided.",
    [ErrorCode.MISSING_REQUIRED_FIELD]: "Please fill in all required fields.",
    [ErrorCode.NOT_FOUND]: "Resource not found.",
    [ErrorCode.RESOURCE_CONFLICT]: "This resource already exists.",
    [ErrorCode.RESOURCE_DELETED]: "This resource has been deleted.",
    [ErrorCode.SERVER_ERROR]: "Server error. Please try again later.",
    [ErrorCode.SERVICE_UNAVAILABLE]: "Service is temporarily unavailable. Please try again later.",
    [ErrorCode.RATE_LIMITED]: "Too many requests. Please try again later.",
    [ErrorCode.UNKNOWN]: "An unknown error occurred. Please try again.",
  }
  return messages[code] || messages[ErrorCode.UNKNOWN]
}

/**
 * Parse error from API response
 */
export function parseApiError(error: any): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error?.response?.status) {
    const status = error.response.status
    const data = error.response.data

    if (status === 400) {
      return createError(ErrorCode.VALIDATION_ERROR, data?.message || "Invalid request", {
        statusCode: status,
        originalError: error,
      })
    }

    if (status === 401) {
      return createError(ErrorCode.TOKEN_EXPIRED, "Token expired", {
        statusCode: status,
        originalError: error,
        retryable: true,
      })
    }

    if (status === 403) {
      return createError(ErrorCode.FORBIDDEN, "Forbidden", {
        statusCode: status,
        originalError: error,
      })
    }

    if (status === 404) {
      return createError(ErrorCode.NOT_FOUND, "Resource not found", {
        statusCode: status,
        originalError: error,
      })
    }

    if (status === 409) {
      return createError(ErrorCode.RESOURCE_CONFLICT, data?.message || "Resource conflict", {
        statusCode: status,
        originalError: error,
      })
    }

    if (status >= 500) {
      return createError(ErrorCode.SERVER_ERROR, data?.message || "Server error", {
        statusCode: status,
        originalError: error,
        retryable: true,
      })
    }
  }

  if (error?.message?.includes("Network") || error?.message?.includes("ECONNREFUSED")) {
    return createError(ErrorCode.NETWORK_ERROR, error.message, {
      originalError: error,
      retryable: true,
    })
  }

  if (error?.message?.includes("timeout") || error?.message?.includes("Timeout")) {
    return createError(ErrorCode.TIMEOUT_ERROR, error.message, {
      originalError: error,
      retryable: true,
    })
  }

  return createError(ErrorCode.UNKNOWN, error?.message || "Unknown error", {
    originalError: error instanceof Error ? error : undefined,
  })
}

export default {
  createError,
  parseApiError,
  isRetryable,
  getDefaultUserMessage,
  ErrorCode,
}
