import { types } from "mobx-state-tree"
import { OperationModel } from "./operation.model"

/**
 * ReliefRootModel
 * Root model combining all relief operation state
 */
export const ReliefRootModel = types
  .model("ReliefRoot", {
    operations: types.array(OperationModel),
    currentOperationId: types.maybeNull(types.string),
    isLoading: types.optional(types.boolean, false),
    error: types.optional(types.maybeNull(types.string), null),
    lastSync: types.maybeNull(types.string),
  })
  .views((self) => ({
    get currentOperation() {
      if (!self.currentOperationId) return null
      return self.operations.find((op) => op.id === self.currentOperationId) || null
    },
    get activeOperations() {
      return self.operations.filter((op) => op.status === "active" || op.status === "planning")
    },
    operationById(id: string) {
      return self.operations.find((op) => op.id === id) || null
    },
  }))
  .actions((self) => ({
    setLoading(loading: boolean) {
      self.isLoading = loading
    },
    setError(error: string | null) {
      self.error = error
    },
    setCurrentOperation(operationId: string | null) {
      self.currentOperationId = operationId
    },
    addOperation(operation: typeof OperationModel.Type) {
      self.operations.push(operation)
    },
    removeOperation(operationId: string) {
      const index = self.operations.findIndex((op) => op.id === operationId)
      if (index >= 0) {
        self.operations.splice(index, 1)
        if (self.currentOperationId === operationId) {
          self.currentOperationId = null
        }
      }
    },
    updateOperation(operationId: string, updates: Partial<typeof OperationModel.Type>) {
      const operation = self.operations.find((op) => op.id === operationId)
      if (operation) {
        Object.assign(operation, updates)
        operation.updatedAt = new Date().toISOString()
      }
    },
    createOperation(operation: typeof OperationModel.Type) {
      self.operations.push(operation)
      self.currentOperationId = operation.id
      return operation
    },
    syncOperations(operations: Array<typeof OperationModel.Type>) {
      self.operations.replace(operations)
      self.lastSync = new Date().toISOString()
    },
    clear() {
      self.operations.clear()
      self.currentOperationId = null
      self.error = null
      self.lastSync = null
    },
  }))

export type IReliefRoot = typeof ReliefRootModel.Type
