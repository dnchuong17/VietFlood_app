import * as SecureStore from "expo-secure-store"
import { apiClient } from "@lib/api-client"
import { IUser } from "@models/auth/auth.model"

/**
 * AuthService
 * Handles authentication API requests
 */
export class AuthService {
  /**
   * Login with email and password
   */
  static async login(email: string, password: string): Promise<{
    user: IUser
    token: string
    refreshToken: string
    permissions: string[]
  }> {
    try {
      const response = await apiClient.request("/auth/login", {
        method: "POST",
        body: { email, password },
      })

      if (!response.success || !response.data) {
        throw new Error(response.error || "Login failed")
      }

      const { user, access_token, refresh_token, permissions } = response.data

      // Store tokens securely
      await SecureStore.setItemAsync("accessToken", access_token)
      await SecureStore.setItemAsync("refreshToken", refresh_token)

      return {
        user,
        token: access_token,
        refreshToken: refresh_token,
        permissions: permissions || ["volunteer"],
      }
    } catch (error) {
      throw new Error(`Login error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Register new account
   */
  static async register(data: {
    email: string
    password: string
    name: string
  }): Promise<{
    user: IUser
    token: string
    refreshToken: string
    permissions: string[]
  }> {
    try {
      const response = await apiClient.request("/auth/register", {
        method: "POST",
        body: data,
      })

      if (!response.success || !response.data) {
        throw new Error(response.error || "Registration failed")
      }

      const { user, access_token, refresh_token, permissions } = response.data

      // Store tokens securely
      await SecureStore.setItemAsync("accessToken", access_token)
      await SecureStore.setItemAsync("refreshToken", refresh_token)

      return {
        user,
        token: access_token,
        refreshToken: refresh_token,
        permissions: permissions || ["volunteer"],
      }
    } catch (error) {
      throw new Error(`Registration error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Verify and refresh token
   */
  static async verifyToken(): Promise<{
    user: IUser
    token: string
    permissions: string[]
  } | null> {
    try {
      const token = await SecureStore.getItemAsync("accessToken")

      if (!token) {
        return null
      }

      const response = await apiClient.request("/auth/verify", {
        method: "GET",
      })

      if (!response.success || !response.data) {
        // Token invalid, clear stored tokens
        await SecureStore.deleteItemAsync("accessToken")
        await SecureStore.deleteItemAsync("refreshToken")
        return null
      }

      const { user, access_token, permissions } = response.data

      if (access_token !== token) {
        // Token refreshed
        await SecureStore.setItemAsync("accessToken", access_token)
      }

      return {
        user,
        token: access_token,
        permissions: permissions || ["volunteer"],
      }
    } catch (error) {
      // On verification error, tokens are considered invalid
      await SecureStore.deleteItemAsync("accessToken")
      await SecureStore.deleteItemAsync("refreshToken")
      return null
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken")

      if (!refreshToken) {
        return null
      }

      const response = await apiClient.request("/auth/refresh", {
        method: "POST",
        body: { refresh_token: refreshToken },
      })

      if (!response.success || !response.data) {
        // Refresh failed, clear tokens
        await SecureStore.deleteItemAsync("accessToken")
        await SecureStore.deleteItemAsync("refreshToken")
        return null
      }

      const { access_token } = response.data
      await SecureStore.setItemAsync("accessToken", access_token)

      return access_token
    } catch (error) {
      // On refresh error, clear tokens
      await SecureStore.deleteItemAsync("accessToken")
      await SecureStore.deleteItemAsync("refreshToken")
      return null
    }
  }

  /**
   * Logout
   */
  static async logout(): Promise<void> {
    try {
      // Notify backend
      await apiClient.request("/auth/logout", {
        method: "POST",
      })
    } catch (error) {
      console.warn("Logout notification failed:", error)
    } finally {
      // Clear local tokens regardless of backend response
      await SecureStore.deleteItemAsync("accessToken")
      await SecureStore.deleteItemAsync("refreshToken")
    }
  }
}
