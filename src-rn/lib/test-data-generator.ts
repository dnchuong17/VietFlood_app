/**
 * Test Data Generation Utility
 * Generates realistic test data for Phase 9 device testing
 * 
 * Usage:
 * - Run in development environment to pre-populate AsyncStorage
 * - Call functions directly in test setup
 * - Used for performance testing and compatibility validation
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

export type Report = {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  reportType: "flooding" | "infrastructure" | "displacement" | "health" | "other";
  severity: "low" | "medium" | "high" | "critical";
  photos: string[];
  timestamp: number;
  userId: string;
  status: "draft" | "submitted" | "verified" | "resolved";
  createdAt: string;
  updatedAt: string;
  isSynced?: boolean;
};

export type Operation = {
  id: string;
  name: string;
  description: string;
  operationType: "evacuation" | "rescue" | "supply" | "healthcare" | "shelter";
  priority: "low" | "medium" | "high" | "critical";
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  startDate: string;
  endDate?: string;
  status: "planned" | "ongoing" | "completed" | "cancelled";
  managerId: string;
  volunteers: number;
  resources: string[];
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "citizen" | "responder" | "coordinator" | "admin";
  avatar?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  preferences: {
    notifications: boolean;
    language: string;
    theme: "light" | "dark";
  };
  createdAt: string;
  updatedAt: string;
};

/**
 * Generate realistic report data for testing
 */
export const generateTestReports = (count: number = 50): Report[] => {
  const reportTypes: Report["reportType"][] = [
    "flooding",
    "infrastructure",
    "displacement",
    "health",
    "other",
  ];
  const severities: Report["severity"][] = ["low", "medium", "high", "critical"];
  const statuses: Report["status"][] = ["draft", "submitted", "verified", "resolved"];

  // Vietnamese flood-prone locations
  const locations = [
    { lat: 10.7769, lng: 106.7009, address: "District 1, Ho Chi Minh City" },
    { lat: 10.8231, lng: 106.6297, address: "District 7, Ho Chi Minh City" },
    { lat: 16.0544, lng: 108.2022, address: "Da Nang City" },
    { lat: 21.0285, lng: 105.8542, address: "Ba Dinh, Hanoi" },
    { lat: 20.9962, lng: 105.8415, address: "Hoan Kiem, Hanoi" },
    { lat: 9.7604, lng: 106.6763, address: "Can Tho City" },
    { lat: 10.0455, lng: 105.7469, address: "My Tho, Tien Giang" },
    { lat: 10.1815, lng: 104.5207, address: "Soc Trang City" },
  ];

  const reports: Report[] = [];

  for (let i = 0; i < count; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    const createdAt = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    );

    reports.push({
      id: uuidv4(),
      title: `Flooding Report ${i + 1}`,
      description: generateDescription(),
      location: {
        latitude: location.lat + (Math.random() - 0.5) * 0.1,
        longitude: location.lng + (Math.random() - 0.5) * 0.1,
        address: location.address,
      },
      reportType: reportTypes[Math.floor(Math.random() * reportTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      photos: generatePhotoURIs(Math.floor(Math.random() * 4)),
      timestamp: createdAt.getTime(),
      userId: `user-${Math.floor(Math.random() * 10) + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      isSynced: Math.random() > 0.2,
    });
  }

  return reports;
};

/**
 * Generate test operations for relief coordination
 */
export const generateTestOperations = (count: number = 20): Operation[] => {
  const operationTypes: Operation["operationType"][] = [
    "evacuation",
    "rescue",
    "supply",
    "healthcare",
    "shelter",
  ];
  const priorities: Operation["priority"][] = ["low", "medium", "high", "critical"];
  const statuses: Operation["status"][] = ["planned", "ongoing", "completed", "cancelled"];

  const operations: Operation[] = [];

  for (let i = 0; i < count; i++) {
    const startDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const endDate = Math.random() > 0.5
      ? new Date(startDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
      : undefined;

    operations.push({
      id: uuidv4(),
      name: `Operation ${operationTypes[i % operationTypes.length].toUpperCase()} ${i + 1}`,
      description: generateDescription(),
      operationType: operationTypes[Math.floor(Math.random() * operationTypes.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      location: {
        latitude: 10.7769 + (Math.random() - 0.5) * 2,
        longitude: 106.7009 + (Math.random() - 0.5) * 2,
        address: `Location ${i + 1}, Vietnam`,
      },
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      managerId: `manager-${Math.floor(Math.random() * 5) + 1}`,
      volunteers: Math.floor(Math.random() * 200) + 10,
      resources: generateResources(),
      createdAt: startDate.toISOString(),
      updatedAt: endDate?.toISOString() || startDate.toISOString(),
    });
  }

  return operations;
};

/**
 * Generate user profiles for testing
 */
export const generateTestUsers = (count: number = 10): UserProfile[] => {
  const roles: UserProfile["role"][] = ["citizen", "responder", "coordinator", "admin"];

  const users: UserProfile[] = [];

  for (let i = 0; i < count; i++) {
    const createdAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);

    users.push({
      id: `user-${i + 1}`,
      name: `Test User ${i + 1}`,
      email: `testuser${i + 1}@vietflood.dev`,
      phone: `+84${Math.floor(Math.random() * 900000000) + 100000000}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      location: {
        latitude: 10.7769 + (Math.random() - 0.5) * 2,
        longitude: 106.7009 + (Math.random() - 0.5) * 2,
      },
      preferences: {
        notifications: Math.random() > 0.3,
        language: "vi",
        theme: Math.random() > 0.5 ? "light" : "dark",
      },
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });
  }

  return users;
};

/**
 * Populate AsyncStorage with test data
 * Call this in development/debug environment
 */
export const populateTestData = async (options: {
  reports?: number;
  operations?: number;
  users?: number;
  clear?: boolean;
} = {}): Promise<void> => {
  try {
    const { reports = 50, operations = 20, users = 10, clear = false } = options;

    if (clear) {
      await AsyncStorage.clear();
      console.log("[TestData] Cleared AsyncStorage");
    }

    // Generate and store reports
    const testReports = generateTestReports(reports);
    await AsyncStorage.setItem(
      "cached_reports",
      JSON.stringify(testReports)
    );
    console.log(`[TestData] Stored ${reports} test reports`);

    // Generate and store operations
    const testOperations = generateTestOperations(operations);
    await AsyncStorage.setItem(
      "cached_operations",
      JSON.stringify(testOperations)
    );
    console.log(`[TestData] Stored ${operations} test operations`);

    // Generate and store user profiles
    const testUsers = generateTestUsers(users);
    const mainUser = testUsers[0];
    await AsyncStorage.setItem(
      "user_profile",
      JSON.stringify(mainUser)
    );
    console.log(`[TestData] Stored user profile and ${users} total test users`);

    // Store offline sync state
    await AsyncStorage.setItem(
      "offline_sync_state",
      JSON.stringify({
        lastSyncTime: Date.now(),
        queuedRequests: [],
        pendingCount: 0,
      })
    );
    console.log("[TestData] Initialized offline sync state");

  } catch (error) {
    console.error("[TestData] Error populating test data:", error);
    throw error;
  }
};

/**
 * Create stress test data (for performance testing)
 */
export const generateStressTestData = async (options: {
  reportCount?: number;
  operationCount?: number;
  includePhotos?: boolean;
} = {}): Promise<void> => {
  const { reportCount = 500, operationCount = 100, includePhotos = false } = options;

  try {
    console.log(
      `[StressTest] Starting stress test data generation (${reportCount} reports, ${operationCount} operations)`
    );

    // Generate large dataset
    const startTime = Date.now();
    const reports = generateTestReports(reportCount);
    const operations = generateTestOperations(operationCount);

    // Storage size estimation
    const reportsSize = new Blob([JSON.stringify(reports)]).size;
    const operationsSize = new Blob([JSON.stringify(operations)]).size;
    const totalSize = (reportsSize + operationsSize) / 1024 / 1024; // MB

    console.log(
      `[StressTest] Generated data size: ${totalSize.toFixed(2)} MB`
    );

    // Store in batches to avoid blocking
    const batchSize = 50;

    for (let i = 0; i < reports.length; i += batchSize) {
      const batch = reports.slice(i, i + batchSize);
      await AsyncStorage.setItem(
        `batch_reports_${i}`,
        JSON.stringify(batch)
      );
    }

    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize);
      await AsyncStorage.setItem(
        `batch_operations_${i}`,
        JSON.stringify(batch)
      );
    }

    const duration = Date.now() - startTime;
    console.log(
      `[StressTest] Completed in ${duration}ms (${(totalSize / (duration / 1000)).toFixed(2)} MB/s)`
    );

  } catch (error) {
    console.error("[StressTest] Error generating stress test data:", error);
    throw error;
  }
};

/**
 * Clear all test data from AsyncStorage
 */
export const clearTestData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log("[TestData] Cleared all AsyncStorage data");
  } catch (error) {
    console.error("[TestData] Error clearing test data:", error);
    throw error;
  }
};

/**
 * Export test data for analysis
 */
export const exportTestData = async (): Promise<string> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const data: Record<string, any> = {};

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    }

    const json = JSON.stringify(data, null, 2);
    console.log("[TestData] Export size:", new Blob([json]).size / 1024, "KB");
    return json;
  } catch (error) {
    console.error("[TestData] Error exporting test data:", error);
    throw error;
  }
};

// ==================== Helper Functions ====================

/**
 * Generate realistic description text
 */
function generateDescription(): string {
  const descriptions = [
    "Heavy flooding in the area with water levels rising rapidly",
    "Infrastructure damage reported, needs immediate assessment",
    "Residents displaced, seeking temporary shelter",
    "Health concerns reported for vulnerable populations",
    "Road infrastructure compromised, access limited",
    "Multiple reports of water accumulation in residential areas",
    "Urgent need for supplies and medical assistance",
    "Evacuation in progress, coordination needed",
    "Power outages affecting multiple neighborhoods",
    "Water contamination concerns reported",
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

/**
 * Generate mock photo URIs (base64 or placeholders)
 */
function generatePhotoURIs(count: number): string[] {
  const uris: string[] = [];

  for (let i = 0; i < count; i++) {
    // Placeholder URLs pointing to Unsplash for realistic testing
    uris.push(
      `https://images.unsplash.com/photo-${1000000 + Math.random() * 90000000}?w=400&h=400&fit=crop`
    );
  }

  return uris;
}

/**
 * Generate resource list
 */
function generateResources(): string[] {
  const resources = [
    "Food supplies",
    "Water bottles",
    "Medical kits",
    "Blankets",
    "Tents",
    "Generators",
    "Flashlights",
    "First aid",
    "Medications",
    "Batteries",
  ];

  const count = Math.floor(Math.random() * 5) + 2;
  const selected: string[] = [];

  for (let i = 0; i < count; i++) {
    const resource = resources[Math.floor(Math.random() * resources.length)];
    if (!selected.includes(resource)) {
      selected.push(resource);
    }
  }

  return selected;
}

// ==================== Integration Example ====================

/**
 * Example: Call in development environment
 * 
 * Usage in app initialization:
 * 
 * if (__DEV__) {
 *   import { populateTestData } from './test-data-generator';
 *   populateTestData({ reports: 50, operations: 20, users: 10, clear: true })
 *     .catch(error => console.error('Failed to populate test data:', error));
 * }
 */

// ==================== Export Summary ====================

export const testDataGeneratorAPI = {
  generateTestReports,
  generateTestOperations,
  generateTestUsers,
  populateTestData,
  generateStressTestData,
  clearTestData,
  exportTestData,
};

export default testDataGeneratorAPI;
