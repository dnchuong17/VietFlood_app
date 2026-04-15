/**
 * Custom hooks for API operations with retry and polling
 * Provides convenient patterns for common API tasks
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { withRetry } from '@/lib/utils/retry'
import { logger } from '@/lib/logging/logger'

interface UseFetchOptions {
  retryCount?: number
  retryDelay?: number
  onError?: (error: Error) => void
  onSuccess?: (data: any) => void
}

interface UsePollingOptions extends UseFetchOptions {
  interval: number
  enabled?: boolean
}

/**
 * Hook for fetching data with automatic retry
 * @param url URL to fetch from
 * @param options Fetch options and retry configuration
 */
export function useFetch<T>(
  url: string | null,
  options: UseFetchOptions = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { retryCount = 3, retryDelay = 1000, onError, onSuccess } = options

  const fetchData = useCallback(async () => {
    if (!url) return

    try {
      setLoading(true)
      setError(null)

      const fetcher = async () => {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        return response.json()
      }

      const result = await withRetry(fetcher, {
        maxRetries: retryCount,
        initialDelayMs: retryDelay,
        onRetry: (attempt, delay) => {
          logger.warn('useFetch', 'Retrying fetch', { url, attempt, delayMs: delay })
        },
      })

      setData(result)
      onSuccess?.(result)
      logger.info('useFetch', 'Fetch successful', { url })
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onError?.(error)
      logger.error('useFetch', 'Fetch failed', error, { url })
    } finally {
      setLoading(false)
    }
  }, [url, retryCount, retryDelay, onError, onSuccess])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

/**
 * Hook for polling data at regular intervals
 * @param url URL to fetch from
 * @param options Polling configuration and retry options
 */
export function usePolling<T>(
  url: string | null,
  options: UsePollingOptions
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const {
    interval,
    enabled = true,
    retryCount = 2,
    retryDelay = 500,
    onError,
    onSuccess,
  } = options

  const poll = useCallback(async () => {
    if (!url || !enabled) return

    try {
      setLoading(true)

      const fetcher = async () => {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        return response.json()
      }

      const result = await withRetry(fetcher, {
        maxRetries: retryCount,
        initialDelayMs: retryDelay,
      })

      setData(result)
      setError(null)
      onSuccess?.(result)
      logger.debug('usePolling', 'Poll successful', { url })
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onError?.(error)
      logger.warn('usePolling', 'Poll failed', error, { url })
    } finally {
      setLoading(false)
    }
  }, [url, enabled, retryCount, retryDelay, onError, onSuccess])

  useEffect(() => {
    if (!enabled || !url) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Poll immediately
    poll()

    // Set up polling interval
    intervalRef.current = setInterval(poll, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [url, interval, enabled, poll])

  return { data, loading, error, refetch: poll }
}

/**
 * Hook for debounced API calls
 * Useful for search or auto-save scenarios
 */
export function useDebouncedFetch<T>(
  fetcher: () => Promise<T>,
  delay: number = 500
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedFetch = useCallback(() => {
    setLoading(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await fetcher()
        setData(result)
        setError(null)
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        logger.error('useDebouncedFetch', 'Fetch failed', error)
      } finally {
        setLoading(false)
      }
    }, delay)
  }, [fetcher, delay])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { data, loading, error, fetch: debouncedFetch }
}

/**
 * Hook for paginated data fetching
 */
export function usePaginatedFetch<T>(
  baseUrl: string,
  pageSize: number = 10,
  options: UseFetchOptions = {}
) {
  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { retryCount = 2, retryDelay = 500, onError } = options

  const fetchPage = useCallback(
    async (pageNum: number) => {
      try {
        setLoading(true)
        setError(null)

        const url = `${baseUrl}?page=${pageNum}&pageSize=${pageSize}`

        const fetcher = async () => {
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          return response.json()
        }

        const result = await withRetry(fetcher, {
          maxRetries: retryCount,
          initialDelayMs: retryDelay,
        })

        setData(Array.isArray(result.data) ? result.data : [])
        setTotalPages(result.totalPages || 1)
        setPage(pageNum)
        logger.info('usePaginatedFetch', 'Page loaded', { page: pageNum, url })
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        onError?.(error)
        logger.error('usePaginatedFetch', 'Failed to fetch page', error)
      } finally {
        setLoading(false)
      }
    },
    [baseUrl, pageSize, retryCount, retryDelay, onError]
  )

  useEffect(() => {
    fetchPage(1)
  }, [fetchPage])

  const nextPage = () => {
    if (page < totalPages) {
      fetchPage(page + 1)
    }
  }

  const prevPage = () => {
    if (page > 1) {
      fetchPage(page - 1)
    }
  }

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      fetchPage(pageNum)
    }
  }

  return {
    data,
    page,
    totalPages,
    loading,
    error,
    nextPage,
    prevPage,
    goToPage,
  }
}
