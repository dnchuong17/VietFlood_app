/**
 * API Client with automatic token refresh and retry logic
 * Handles 401 errors by attempting to refresh the access token
 * Retries transient failures with exponential backoff
 */

import {
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
  updateRefreshToken,
  clearAuthTokens,
  isAccessTokenExpiringSoon,
} from "./auth-storage";
import { refreshAccessToken } from "../api/sign-in";
import { withRetry } from "@/lib/utils/retry";
import { logger } from "@/lib/logging/logger";

type RequestOptions = RequestInit & {
  skipAuthRefresh?: boolean;
};

let refreshPromise: Promise<void> | null = null;

/**
 * Refresh access token and update storage
 */
async function doRefreshToken(): Promise<void> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    logger.warn('APIClient', 'No refresh token available');
    clearAuthTokens();
    throw new Error("Không có refresh token. Vui lòng đăng nhập lại.");
  }

  try {
    logger.info('APIClient', 'Refreshing access token');
    const response = await refreshAccessToken(refreshToken);
    updateAccessToken(response.accessToken);

    if (response.refresh_token) {
      updateRefreshToken(response.refresh_token);
    }
    logger.info('APIClient', 'Access token refreshed successfully');
  } catch (error) {
    logger.error('APIClient', 'Failed to refresh token', error as Error);
    clearAuthTokens();
    throw error;
  }
}

async function ensureFreshAccessToken(
  forceRefresh: boolean = false,
): Promise<void> {
  if (refreshPromise) {
    await refreshPromise;
    return;
  }

  const accessToken = getAccessToken();
  if (!accessToken && !forceRefresh) {
    return;
  }

  if (!forceRefresh && !isAccessTokenExpiringSoon()) {
    return;
  }

  refreshPromise = doRefreshToken();

  try {
    await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

/**
 * Make an authenticated API request with automatic token refresh and retry logic
 * @param url The API endpoint URL
 * @param options Fetch options
 * @returns The response object
 */
export async function apiRequest(
  url: string,
  options: RequestOptions = {},
): Promise<Response> {
  const { skipAuthRefresh = false, ...fetchOptions } = options;
  let attempt = 0;
  const maxAttempts = 3;

  const attemptRequest = async (): Promise<Response> => {
    attempt++;

    if (!skipAuthRefresh) {
      try {
        await ensureFreshAccessToken(false);
      } catch (error) {
        logger.warn('APIClient', 'Token refresh failed', { attempt, url });
      }
    }

    // Add authorization header if token exists
    const currentAccessToken = getAccessToken();
    const headers = new Headers(fetchOptions.headers || {});

    if (currentAccessToken) {
      headers.set("Authorization", `Bearer ${currentAccessToken}`);
    }

    logger.debug('APIClient', 'Making request', {
      url,
      method: fetchOptions.method || 'GET',
      attempt,
    });

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && !skipAuthRefresh && attempt === 1) {
      try {
        logger.info('APIClient', 'Received 401, refreshing token');
        await ensureFreshAccessToken(true);

        // Retry the original request with new token
        const newAccessToken = getAccessToken();
        const retryHeaders = new Headers(fetchOptions.headers || {});

        if (newAccessToken) {
          retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);
        }

        return fetch(url, {
          ...fetchOptions,
          headers: retryHeaders,
        });
      } catch (error) {
        logger.error('APIClient', 'Token refresh failed, returning original 401', error as Error);
        return response;
      }
    }

    return response;
  };

  // Retry logic for transient errors (network errors, 5xx)
  const shouldRetry = (error: unknown) => {
    if (error instanceof TypeError && error.message.includes('Network')) {
      return true;
    }
    if (error instanceof Error && (
      error.message.includes('timeout') ||
      error.message.includes('connection')
    )) {
      return true;
    }
    return false;
  };

  try {
    return await withRetry(attemptRequest, {
      maxRetries: 2,
      initialDelayMs: 1000,
      maxDelayMs: 10000,
      backoffMultiplier: 2,
      shouldRetry,
      onRetry: (attempt, delay, error) => {
        logger.warn('APIClient', 'Retrying request', {
          attempt,
          delayMs: delay,
          url,
          error: error instanceof Error ? error.message : String(error),
        });
      },
    });
  } catch (error) {
    logger.error('APIClient', 'Request failed after retries', {
      url,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Convenience function for GET requests with auth
 */
export async function apiGet(
  url: string,
  options: RequestOptions = {},
): Promise<Response> {
  return apiRequest(url, {
    ...options,
    method: "GET",
  });
}

/**
 * Convenience function for POST requests with auth
 */
export async function apiPost(
  url: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<Response> {
  return apiRequest(url, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Convenience function for PUT requests with auth
 */
export async function apiPut(
  url: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<Response> {
  return apiRequest(url, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Convenience function for DELETE requests with auth
 */
export async function apiDelete(
  url: string,
  options: RequestOptions = {},
): Promise<Response> {
  return apiRequest(url, {
    ...options,
    method: "DELETE",
  });
}
