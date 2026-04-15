import React, { createContext, useContext, useEffect, useState } from "react"
import { AuthStoreModel, IAuthStore } from "@models/auth/auth.model"
import { AuthPersistence } from "@models/auth/auth.persistence"
import { AuthService } from "@services/auth/auth.service"

/**
 * AuthContext
 * Global context for authentication state
 */
const AuthContext = createContext<IAuthStore | null>(null)

/**
 * AuthProvider
 * Provides MST auth store to entire app
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authStore, setAuthStore] = useState<IAuthStore | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Initialize auth store from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Load persisted state
        const persistedState = await AuthPersistence.load()

        // Create store instance
        const store = AuthStoreModel.create(persistedState || {})

        // Setup auto-save
        AuthPersistence.setupAutoSave(store)

        setAuthStore(store)
      } catch (error) {
        console.error("Failed to initialize auth:", error)
        // Create empty store on error
        const store = AuthStoreModel.create({})
        AuthPersistence.setupAutoSave(store)
        setAuthStore(store)
      } finally {
        setIsInitializing(false)
      }
    }

    initAuth()
  }, [])

  if (isInitializing || !authStore) {
    return null // Or return a loading screen
  }

  return <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
}

/**
 * useAuth hook
 * Returns the auth store combined with service methods
 */
export const useAuth = () => {
  const authStore = useContext(AuthContext)
  if (!authStore) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return {
    // Store state
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    token: authStore.token,
    refreshTokenValue: authStore.refreshToken,
    permissions: authStore.permissions,

    // Store views
    isAdmin: authStore.isAdmin,
    isCoordinator: authStore.isCoordinator,
    isVolunteer: authStore.isVolunteer,

    // Service methods
    async login(email: string, password: string) {
      authStore.setLoading(true)
      authStore.setError(null)
      try {
        const result = await AuthService.login(email, password)
        authStore.loginSuccess(result.user, result.token, result.refreshToken, result.permissions)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed"
        authStore.loginFailure(message)
        throw error
      }
    },

    async register(email: string, password: string, name: string) {
      authStore.setLoading(true)
      authStore.setError(null)
      try {
        const result = await AuthService.register({ email, password, name })
        authStore.loginSuccess(result.user, result.token, result.refreshToken, result.permissions)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Registration failed"
        authStore.loginFailure(message)
        throw error
      }
    },

    async logout() {
      authStore.logout()
    },

    async refreshAccessToken() {
      if (!authStore.refreshToken) {
        throw new Error("No refresh token available")
      }
      authStore.setLoading(true)
      try {
        const newToken = await AuthService.refreshToken()
        if (!newToken) {
          throw new Error("Token refresh failed")
        }
        authStore.setTokens(newToken, authStore.refreshToken)
      } catch (error) {
        authStore.logout()
        throw error
      } finally {
        authStore.setLoading(false)
      }
    },

    clearError() {
      authStore.clearError()
    },

    // Raw store for advanced usage
    _store: authStore,
  }
}

/**
 * useAuthState hook
 * Returns formatted auth state with helpful properties
 */
export const useAuthState = () => {
  const auth = useAuth()
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    isAdmin: auth.isAdmin,
    isCoordinator: auth.isCoordinator,
  }
}
