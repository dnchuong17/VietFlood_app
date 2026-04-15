import { types } from "mobx-state-tree"

/**
 * {{pascalCase name}}Model
 *
 * MST model for {{name}} state management.
 * Provides type-safe, immutable state and actions.
 */
export const {{pascalCase name}}Model = types
  .model("{{pascalCase name}}")
  .props({
    // TODO: Add properties
    id: types.identifier,
    isLoading: types.optional(types.boolean, false),
    error: types.optional(types.maybeNull(types.string), null),
  })
  .views((self) => ({
    // TODO: Add computed values
  }))
  .actions((self) => ({
    // TODO: Add actions
    setLoading(isLoading: boolean) {
      self.isLoading = isLoading
    },
    setError(error: string | null) {
      self.error = error
    },
  }))

export type I{{pascalCase name}} = typeof {{pascalCase name}}Model.Type
