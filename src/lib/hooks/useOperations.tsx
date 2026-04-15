import React, { createContext, useContext, useState } from "react"
import { ReliefRootModel, IReliefRoot } from "@models/relief/relief-root.model"

/**
 * ReliefContext
 * Global context for relief operations state
 */
const ReliefContext = createContext<IReliefRoot | null>(null)

/**
 * ReliefProvider
 * Provides MST relief store to entire app
 */
export const ReliefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reliefStore] = useState<IReliefRoot>(() => {
    return ReliefRootModel.create({
      operations: [],
      currentOperationId: null,
      isLoading: false,
      error: null,
      lastSync: null,
    })
  })

  return (
    <ReliefContext.Provider value={reliefStore}>{children}</ReliefContext.Provider>
  )
}

/**
 * useOperations hook
 * Returns the relief store for accessing and modifying relief operations state
 */
export const useOperations = (): IReliefRoot => {
  const context = useContext(ReliefContext)
  if (!context) {
    throw new Error("useOperations must be used within ReliefProvider")
  }
  return context
}

/**
 * useCurrentOperation hook
 * Returns the currently selected relief operation
 */
export const useCurrentOperation = () => {
  const relief = useOperations()
  return relief.currentOperation
}

/**
 * useActiveOperations hook
 * Returns list of active and planning operations
 */
export const useActiveOperations = () => {
  const relief = useOperations()
  return relief.activeOperations
}
