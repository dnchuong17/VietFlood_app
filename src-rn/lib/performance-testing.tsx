/**
 * Performance Testing Utilities
 * Real-time metrics capture for Phase 9 device testing
 * 
 * Purpose: Collect startup time, memory, FPS, and other metrics
 * Usage: Integrate into dev menu or test flows
 */

import React, { useEffect, useState, useRef } from "react";
import { Platform, View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PerformanceMetrics {
  startupTime: number; // ms
  memoryUsageBaseline: number; // MB
  memoryUsagePeak: number; // MB
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  screenRenderTime: Record<string, number>; // ms per screen
  networkRequests: number;
  averageResponseTime: number; // ms
  crashes: number;
  jankFrames: number;
  timestamp: number;
}

// ==================== Global Metrics Storage ====================

class PerformanceMetricsCollector {
  private static instance: PerformanceMetricsCollector;
  private metrics: Partial<PerformanceMetrics> = {};
  private startTime: number = 0;
  private fpsBuffer: number[] = [];
  private networkRequests: number = 0;
  private responseTimes: number[] = [];
  private jankFrameCount: number = 0;

  private constructor() {
    this.startTime = Date.now();
  }

  static getInstance(): PerformanceMetricsCollector {
    if (!PerformanceMetricsCollector.instance) {
      PerformanceMetricsCollector.instance = new PerformanceMetricsCollector();
    }
    return PerformanceMetricsCollector.instance;
  }

  recordStartupTime(): void {
    const now = Date.now();
    this.metrics.startupTime = now - this.startTime;
    console.log(
      `[Perf] Startup time: ${this.metrics.startupTime}ms`
    );
  }

  recordMemory(baseline: number, peak: number): void {
    this.metrics.memoryUsageBaseline = baseline;
    this.metrics.memoryUsagePeak = peak;
    console.log(
      `[Perf] Memory - Baseline: ${baseline}MB, Peak: ${peak}MB`
    );
  }

  recordFPS(fps: number): void {
    this.fpsBuffer.push(fps);

    // Reset buffer every 60 frames
    if (this.fpsBuffer.length >= 60) {
      this.metrics.minFPS = Math.min(...this.fpsBuffer);
      this.metrics.maxFPS = Math.max(...this.fpsBuffer);
      this.metrics.averageFPS =
        this.fpsBuffer.reduce((a, b) => a + b, 0) / this.fpsBuffer.length;

      // Count jank (frames below 50 FPS)
      const jankCount = this.fpsBuffer.filter((f) => f < 50).length;
      this.jankFrameCount += jankCount;

      console.log(
        `[Perf] FPS - Avg: ${this.metrics.averageFPS?.toFixed(1)}, Min: ${this.metrics.minFPS}, Max: ${this.metrics.maxFPS}`
      );
      this.fpsBuffer = [];
    }
  }

  recordScreenRender(screenName: string, time: number): void {
    if (!this.metrics.screenRenderTime) {
      this.metrics.screenRenderTime = {};
    }
    this.metrics.screenRenderTime[screenName] = time;
    console.log(
      `[Perf] Screen render - ${screenName}: ${time}ms`
    );
  }

  recordNetworkRequest(responseTime: number): void {
    this.networkRequests++;
    this.responseTimes.push(responseTime);

    if (this.networkRequests % 10 === 0) {
      this.metrics.networkRequests = this.networkRequests;
      this.metrics.averageResponseTime =
        this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
      console.log(
        `[Perf] Network - ${this.networkRequests} requests, Avg response: ${this.metrics.averageResponseTime?.toFixed(0)}ms`
      );
    }
  }

  recordCrash(): void {
    this.metrics.crashes = (this.metrics.crashes || 0) + 1;
    console.error(`[Perf] Crash recorded. Total crashes: ${this.metrics.crashes}`);
  }

  getMetrics(): PerformanceMetrics {
    return {
      startupTime: this.metrics.startupTime || 0,
      memoryUsageBaseline: this.metrics.memoryUsageBaseline || 0,
      memoryUsagePeak: this.metrics.memoryUsagePeak || 0,
      averageFPS: this.metrics.averageFPS || 0,
      minFPS: this.metrics.minFPS || 0,
      maxFPS: this.metrics.maxFPS || 0,
      screenRenderTime: this.metrics.screenRenderTime || {},
      networkRequests: this.metrics.networkRequests || 0,
      averageResponseTime: this.metrics.averageResponseTime || 0,
      crashes: this.metrics.crashes || 0,
      jankFrames: this.jankFrameCount,
      timestamp: Date.now(),
    };
  }

  async saveMetrics(): Promise<void> {
    const metrics = this.getMetrics();
    try {
      await AsyncStorage.setItem(
        `performance_metrics_${metrics.timestamp}`,
        JSON.stringify(metrics)
      );
      console.log("[Perf] Metrics saved to AsyncStorage");
    } catch (error) {
      console.error("[Perf] Error saving metrics:", error);
    }
  }

  reset(): void {
    this.metrics = {};
    this.fpsBuffer = [];
    this.networkRequests = 0;
    this.responseTimes = [];
    this.jankFrameCount = 0;
    this.startTime = Date.now();
  }
}

// ==================== React Hooks ====================

/**
 * Hook to measure screen render time
 */
export const useScreenRenderTime = (screenName: string): void => {
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();

    return () => {
      const renderTime = Date.now() - startTimeRef.current;
      PerformanceMetricsCollector.getInstance().recordScreenRender(
        screenName,
        renderTime
      );
    };
  }, [screenName]);
};

/**
 * Hook to measure component mount time
 */
export const useComponentMountTime = (componentName: string): void => {
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const mountTime = Date.now() - startTime;
      console.log(`[Perf] Component mounted - ${componentName}: ${mountTime}ms`);
    };
  }, [componentName]);
};

/**
 * Hook to record memory usage
 */
export const useMemoryMonitoring = (): { memory: number | null } => {
  const [memory, setMemory] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Platform.OS === "ios") {
        // iOS memory monitoring (requires native bridge)
        // This is a placeholder - full implementation requires native code
        console.log("[Perf] Memory monitoring on iOS requires native implementation");
      } else {
        // Android memory monitoring via React Native Info
        console.log("[Perf] Memory monitoring on Android supports via native module");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { memory };
};

/**
 * Hook to measure list scroll performance
 */
export const useScrollPerformance = (): {
  isScrolling: boolean;
  fps: number;
} => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [fps, setFps] = useState(60);
  const frameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  useEffect(() => {
    let animationId: number;

    const measureFrame = (): void => {
      const now = performance.now();

      if (frameTimeRef.current !== 0) {
        const frameDelta = now - frameTimeRef.current;
        const currentFPS = Math.round(1000 / frameDelta);
        setFps(currentFPS);

        if (currentFPS < 50) {
          console.warn(`[Perf] Low FPS detected: ${currentFPS}fps`);
        }
      }

      frameTimeRef.current = now;
      animationId = requestAnimationFrame(measureFrame);
    };

    if (isScrolling) {
      animationId = requestAnimationFrame(measureFrame);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isScrolling]);

  return {
    isScrolling,
    fps,
  };
};

// ==================== Performance Display Component ====================

interface PerformanceDisplayProps {
  visible: boolean;
  onClose: () => void;
}

export const PerformanceOverlay: React.FC<PerformanceDisplayProps> = ({
  visible,
  onClose,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const collector = PerformanceMetricsCollector.getInstance();
    setMetrics(collector.getMetrics());

    const interval = setInterval(() => {
      setMetrics(collector.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!visible || !metrics) {
    return null;
  }

  const formatMetric = (value: number, unit: string): string => {
    if (value === 0) return "N/A";
    return `${value.toFixed(1)} ${unit}`;
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Performance Metrics</Text>

        <ScrollView style={styles.content}>
          <MetricRow
            label="Startup Time"
            value={formatMetric(metrics.startupTime, "ms")}
          />
          <MetricRow
            label="Memory (Baseline)"
            value={formatMetric(metrics.memoryUsageBaseline, "MB")}
          />
          <MetricRow
            label="Memory (Peak)"
            value={formatMetric(metrics.memoryUsagePeak, "MB")}
          />
          <MetricRow
            label="Average FPS"
            value={formatMetric(metrics.averageFPS, "fps")}
            status={metrics.averageFPS >= 55 ? "good" : "warning"}
          />
          <MetricRow
            label="Min FPS"
            value={formatMetric(metrics.minFPS, "fps")}
          />
          <MetricRow
            label="Max FPS"
            value={formatMetric(metrics.maxFPS, "fps")}
          />
          <MetricRow
            label="Jank Frames"
            value={String(metrics.jankFrames)}
            status={metrics.jankFrames < 5 ? "good" : "warning"}
          />
          <MetricRow
            label="Network Requests"
            value={String(metrics.networkRequests)}
          />
          <MetricRow
            label="Avg Response Time"
            value={formatMetric(metrics.averageResponseTime, "ms")}
          />
          <MetricRow
            label="Crashes"
            value={String(metrics.crashes)}
            status={metrics.crashes === 0 ? "good" : "error"}
          />

          <Text style={styles.subtitle}>Screen Render Times</Text>
          {Object.entries(metrics.screenRenderTime).map(([screen, time]) => (
            <MetricRow key={screen} label={screen} value={formatMetric(time, "ms")} />
          ))}
        </ScrollView>

        <View style={styles.actions}>
          <Text
            style={styles.button}
            onPress={() => {
              PerformanceMetricsCollector.getInstance().saveMetrics();
              Alert.alert("", "Metrics saved to AsyncStorage");
            }}
          >
            Save Metrics
          </Text>
          <Text
            style={styles.button}
            onPress={() => {
              PerformanceMetricsCollector.getInstance().reset();
              Alert.alert("", "Metrics reset");
            }}
          >
            Reset
          </Text>
          <Text style={styles.button} onPress={onClose}>
            Close
          </Text>
        </View>
      </View>
    </View>
  );
};

interface MetricRowProps {
  label: string;
  value: string;
  status?: "good" | "warning" | "error";
}

const MetricRow: React.FC<MetricRowProps> = ({ label, value, status = "good" }) => {
  const statusColor =
    status === "good" ? "#10b981" : status === "warning" ? "#f59e0b" : "#ef4444";

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: statusColor }]}>{value}</Text>
    </View>
  );
};

// ==================== Export API ====================

export const performanceTestingAPI = {
  getInstance: () => PerformanceMetricsCollector.getInstance(),
  recordStartupTime: () =>
    PerformanceMetricsCollector.getInstance().recordStartupTime(),
  recordMemory: (baseline: number, peak: number) =>
    PerformanceMetricsCollector.getInstance().recordMemory(baseline, peak),
  recordFPS: (fps: number) =>
    PerformanceMetricsCollector.getInstance().recordFPS(fps),
  recordScreenRender: (screenName: string, time: number) =>
    PerformanceMetricsCollector.getInstance().recordScreenRender(screenName, time),
  recordNetworkRequest: (responseTime: number) =>
    PerformanceMetricsCollector.getInstance().recordNetworkRequest(responseTime),
  recordCrash: () => PerformanceMetricsCollector.getInstance().recordCrash(),
  getMetrics: () => PerformanceMetricsCollector.getInstance().getMetrics(),
  saveMetrics: async () =>
    await PerformanceMetricsCollector.getInstance().saveMetrics(),
  reset: () => PerformanceMetricsCollector.getInstance().reset(),
};

// ==================== Styles ====================

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    borderColor: "#4b5563",
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#d1d5db",
    marginTop: 12,
    marginBottom: 8,
  },
  content: {
    maxHeight: "70%",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomColor: "#374151",
    borderBottomWidth: 1,
  },
  label: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "500",
  },
  value: {
    color: "#10b981",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopColor: "#374151",
    borderTopWidth: 1,
  },
  button: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default performanceTestingAPI;
