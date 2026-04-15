import { types } from "mobx-state-tree"

/**
 * UserModel
 * Represents authenticated user data
 */
export const UserModel = types.model("User", {
  id: types.identifier,
  email: types.string,
  name: types.string,
  phone: types.optional(types.string, ""),
  avatar: types.optional(types.string, ""),
  role: types.optional(types.string, "volunteer"),
})

export type IUser = typeof UserModel.Type

/**
 * AuthStoreModel
 * MST model for authentication state management
 * Manages user identity, tokens, permissions, and session
 */
export const AuthStoreModel = types
  .model("AuthStore", {
    user: types.maybeNull(UserModel),
    token: types.optional(types.string, ""),
    refreshToken: types.optional(types.string, ""),
    isLoading: types.optional(types.boolean, false),
    error: types.optional(types.maybeNull(types.string), null),
    isAuthenticated: types.optional(types.boolean, false),
    permissions: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    // View helpers
    get isAdmin() {
      return self.permissions.includes("admin")
    },
    get isCoordinator() {
      return self.permissions.includes("coordinator")
    },
    get isVolunteer() {
      return self.user?.role === "volunteer"
    },
  }))
  .actions((self) => ({
    // Action: Set user
    setUser(user: IUser | null) {
      self.user = user
    },

    // Action: Set authentication state
    setAuthenticated(authenticated: boolean) {
      self.isAuthenticated = authenticated
    },

    // Action: Set tokens
    setTokens(token: string, refreshToken: string) {
      self.token = token
      self.refreshToken = refreshToken
    },

    // Action: Set loading state
    setLoading(loading: boolean) {
      self.isLoading = loading
    },

    // Action: Set error
    setError(error: string | null) {
      self.error = error
    },

    // Action: Set permissions
    setPermissions(permissions: string[]) {
      self.permissions.replace(permissions)
    },

    // Action: Login success
    loginSuccess(user: IUser, token: string, refreshToken: string, permissions: string[]) {
      self.user = user
      self.token = token
      self.refreshToken = refreshToken
      self.isAuthenticated = true
      self.permissions.replace(permissions.length > 0 ? permissions : ["volunteer"])
      self.isLoading = false
      self.error = null
    },

    // Action: Login failure
    loginFailure(error: string) {
      self.user = null
      self.token = ""
      self.refreshToken = ""
      self.isAuthenticated = false
      self.permissions.clear()
      self.isLoading = false
      self.error = error
    },

    // Action: Logout
    logout() {
      self.user = null
      self.token = ""
      self.refreshToken = ""
      self.isAuthenticated = false
      self.permissions.clear()
      self.isLoading = false
      self.error = null
    },

    // Action: Clear error
    clearError() {
      self.error = null
    },
  }))

export type IAuthStore = typeof AuthStoreModel.Type
