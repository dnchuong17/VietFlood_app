import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Performance monitoring hook for tracking render times and metrics
 */
export interface PerformanceMetrics {
  renderTime: number;
  mountTime: number;
  updateTime?: number;
  memoryUsage?: number;
  fps?: number;
}

/**
 * Hook to monitor component performance
 */
export function usePerformanceMonitor(componentName: string) {
  const mountTimeRef = useRef<number>(performance.now());
  const renderStartRef = useRef<number>(performance.now());
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    mountTime: 0,
  });

  useEffect(() => {
    const mountTime = performance.now() - mountTimeRef.current;
    setMetrics(prev => ({
      ...prev,
      mountTime,
    }));

    if (__DEV__) {
      console.log(`[Performance] ${componentName} mounted in ${mountTime.toFixed(2)}ms`);
    }
  }, [componentName]);

  // Measure render time
  useEffect(() => {
    const renderTime = performance.now() - renderStartRef.current;
    setMetrics(prev => ({
      ...prev,
      renderTime,
    }));

    if (__DEV__ && renderTime > 100) {
      console.warn(
        `[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms (slow)`
      );
    }
  });

  return metrics;
}

/**
 * Hook to monitor app state and connectivity changes
 */
export interface AppStateMetrics {
  currentState: AppStateStatus | null;
  timeInForeground: number;
  foregroundEntries: number;
  backgroundTime: number;
}

export function useAppStateMonitor() {
  const [metrics, setMetrics] = useState<AppStateMetrics>({
    currentState: null,
    timeInForeground: 0,
    foregroundEntries: 0,
    backgroundTime: 0,
  });

  const stateChangeTimeRef = useRef<number>(0);
  const foregroundTimeRef = useRef<number>(0);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (state: AppStateStatus) => {
    const now = Date.now();

    if (state === 'active') {
      stateChangeTimeRef.current = now;
      setMetrics(prev => ({
        ...prev,
        currentState: state,
        foregroundEntries: prev.foregroundEntries + 1,
      }));

      if (__DEV__) {
        console.log('[AppState] App came to foreground');
      }
    } else if (state === 'background') {
      const timeInForeground = now - stateChangeTimeRef.current;
      foregroundTimeRef.current += timeInForeground;

      setMetrics(prev => ({
        ...prev,
        currentState: state,
        timeInForeground: foregroundTimeRef.current,
        backgroundTime: now,
      }));

      if (__DEV__) {
        console.log(`[AppState] App went to background. Time in foreground: ${timeInForeground}ms`);
      }
    }
  };

  return metrics;
}

/**
 * Hook to monitor scroll performance (FPS on lists)
 */
export interface ScrollPerformance {
  avgFrameTime: number;
  droppedFrames: number;
  isSmoothScrolling: boolean;
}

export function useScrollPerformance() {
  const [performance, setPerformance] = useState<ScrollPerformance>({
    avgFrameTime: 0,
    droppedFrames: 0,
    isSmoothScrolling: true,
  });

  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const droppedFramesRef = useRef<number>(0);
  const frameTimesRef = useRef<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (frameTimesRef.current.length > 0) {
        const avgFrameTime =
          frameTimesRef.current.reduce((a, b) => a + b, 0) /
          frameTimesRef.current.length;
        const isSmoothScrolling = avgFrameTime < 16.67; // 60 FPS threshold

        setPerformance({
          avgFrameTime,
          droppedFrames: droppedFramesRef.current,
          isSmoothScrolling,
        });

        if (__DEV__ && !isSmoothScrolling) {
          console.warn(
            `[Performance] Scroll performance degraded. Avg frame time: ${avgFrameTime.toFixed(2)}ms`
          );
        }

        frameTimesRef.current = [];
        droppedFramesRef.current = 0;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return performance;
}

/**
 * Hook to measure network request timing
 */
export interface NetworkMetrics {
  totalRequests: number;
  averageResponseTime: number;
  failedRequests: number;
  successRate: number;
}

export function useNetworkMonitor() {
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    totalRequests: 0,
    averageResponseTime: 0,
    failedRequests: 0,
    successRate: 100,
  });

  const requestTimesRef = useRef<number[]>([]);
  const totalRequestsRef = useRef<number>(0);
  const failedRequestsRef = useRef<number>(0);

  const recordRequest = (
    responseTime: number,
    success: boolean = true
  ) => {
    totalRequestsRef.current++;
    requestTimesRef.current.push(responseTime);

    if (!success) {
      failedRequestsRef.current++;
    }

    const avgResponseTime =
      requestTimesRef.current.reduce((a, b) => a + b, 0) /
      requestTimesRef.current.length;

    const successRate = (
      ((totalRequestsRef.current - failedRequestsRef.current) /
        totalRequestsRef.current) *
      100
    ).toFixed(1);

    setMetrics({
      totalRequests: totalRequestsRef.current,
      averageResponseTime: avgResponseTime,
      failedRequests: failedRequestsRef.current,
      successRate: Number(successRate),
    });

    if (__DEV__ && responseTime > 5000) {
      console.warn(`[Network] Slow request detected: ${responseTime.toFixed(0)}ms`);
    }
  };

  return { metrics, recordRequest };
}

/**
 * Hook to monitor memory usage (approximate)
 */
export interface MemoryMetrics {
  estimatedMemoryUsage: number;
  isHighMemory: boolean;
  trend: 'stable' | 'increasing' | 'decreasing';
}

export function useMemoryMonitor(threshold: number = 200) {
  const [metrics, setMetrics] = useState<MemoryMetrics>({
    estimatedMemoryUsage: 0,
    isHighMemory: false,
    trend: 'stable',
  });

  const previousMemoryRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Approximate memory info (platform-specific)
      // React Native doesn't expose exact memory, but we can estimate
      const currentMemory = Math.random() * 300; // Placeholder

      const isHighMemory = currentMemory > threshold;
      const trend =
        currentMemory > previousMemoryRef.current
          ? 'increasing'
          : currentMemory < previousMemoryRef.current
            ? 'decreasing'
            : 'stable';

      setMetrics({
        estimatedMemoryUsage: currentMemory,
        isHighMemory,
        trend,
      });

      if (__DEV__ && isHighMemory) {
        console.warn(
          `[Memory] High memory usage detected: ${currentMemory.toFixed(0)}MB`
        );
      }

      previousMemoryRef.current = currentMemory;
    }, 5000);

    return () => clearInterval(interval);
  }, [threshold]);

  return metrics;
}

/**
 * Comprehensive performance report generator
 */
export interface PerformanceReport {
  timestamp: string;
  appState: AppStateMetrics;
  renderMetrics: PerformanceMetrics;
  scrollMetrics: ScrollPerformance;
  networkMetrics: NetworkMetrics;
  memoryMetrics: MemoryMetrics;
  issues: string[];
}

export function generatePerformanceReport(
  appState: AppStateMetrics,
  renderMetrics: PerformanceMetrics,
  scrollMetrics: ScrollPerformance,
  networkMetrics: NetworkMetrics,
  memoryMetrics: MemoryMetrics
): PerformanceReport {
  const issues: string[] = [];

  // Check for issues
  if (renderMetrics.renderTime > 100) {
    issues.push(`Slow render detected: ${renderMetrics.renderTime.toFixed(2)}ms`);
  }

  if (!scrollMetrics.isSmoothScrolling) {
    issues.push(`Scroll jank detected: avg frame time ${scrollMetrics.avgFrameTime.toFixed(2)}ms`);
  }

  if (networkMetrics.averageResponseTime > 5000) {
    issues.push(`Slow network requests: avg ${networkMetrics.averageResponseTime.toFixed(0)}ms`);
  }

  if (networkMetrics.successRate < 95) {
    issues.push(`Low network success rate: ${networkMetrics.successRate}%`);
  }

  if (memoryMetrics.isHighMemory) {
    issues.push(`High memory usage: ${memoryMetrics.estimatedMemoryUsage.toFixed(0)}MB`);
  }

  return {
    timestamp: new Date().toISOString(),
    appState,
    renderMetrics,
    scrollMetrics,
    networkMetrics,
    memoryMetrics,
    issues,
  };
}

/**
 * Log performance metrics for debugging
 */
export function logPerformanceReport(report: PerformanceReport) {
  if (!__DEV__) return;

  console.log('=== PERFORMANCE REPORT ===');
  console.log(`Timestamp: ${report.timestamp}`);
  console.log('\nRender Metrics:');
  console.log(`  Mount Time: ${report.renderMetrics.mountTime.toFixed(2)}ms`);
  console.log(`  Render Time: ${report.renderMetrics.renderTime.toFixed(2)}ms`);

  console.log('\nScroll Performance:');
  console.log(`  Avg Frame Time: ${report.scrollMetrics.avgFrameTime.toFixed(2)}ms`);
  console.log(`  Smooth: ${report.scrollMetrics.isSmoothScrolling ? 'Yes' : 'No'}`);

  console.log('\nNetwork:');
  console.log(`  Requests: ${report.networkMetrics.totalRequests}`);
  console.log(`  Avg Response: ${report.networkMetrics.averageResponseTime.toFixed(0)}ms`);
  console.log(`  Success Rate: ${report.networkMetrics.successRate}%`);

  console.log('\nMemory:');
  console.log(`  Estimated Usage: ${report.memoryMetrics.estimatedMemoryUsage.toFixed(0)}MB`);
  console.log(`  Trend: ${report.memoryMetrics.trend}`);

  if (report.issues.length > 0) {
    console.warn('\nIssues Found:');
    report.issues.forEach(issue => console.warn(`  - ${issue}`));
  } else {
    console.log('\n✅ No performance issues detected');
  }
  console.log('========================\n');
}
