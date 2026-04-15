import AsyncStorage from "@react-native-async-storage/async-storage"
import { onSnapshot } from "mobx-state-tree"
import { IAuthStore } from "./auth.model"

const AUTH_STORAGE_KEY = "@vietflood_auth_state"

/**
 * AuthPersistence
 * Handles persistence of auth state to AsyncStorage
 */
export class AuthPersistence {
  /**
   * Save auth state to storage
   */
  static async save(authStore: IAuthStore): Promise<void> {
    try {
      const snapshot = JSON.stringify(authStore)
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, snapshot)
    } catch (error) {
      console.error("Failed to save auth state:", error)
    }
  }

  /**
   * Load auth state from storage
   */
  static async load(): Promise<any | null> {
    try {
      const snapshot = await AsyncStorage.getItem(AUTH_STORAGE_KEY)
      return snapshot ? JSON.parse(snapshot) : null
    } catch (error) {
      console.error("Failed to load auth state:", error)
      return null
    }
  }

  /**
   * Clear auth state from storage
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY)
    } catch (error) {
      console.error("Failed to clear auth state:", error)
    }
  }

  /**
   * Setup auto-save on state changes
   */
  static setupAutoSave(authStore: IAuthStore): void {
    onSnapshot(authStore, async (snapshot) => {
      await this.save(authStore)
    })
  }
}
