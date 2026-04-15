import { types } from "mobx-state-tree"

/**
 * ResourceModel
 * Represents a relief resource (supplies, equipment, etc.)
 */
export const ResourceModel = types.model("Resource", {
  id: types.identifier,
  name: types.string,
  type: types.string, // e.g., "food", "water", "medical", "shelter"
  quantity: types.number,
  unit: types.string, // e.g., "boxes", "gallons", "units"
  assignedTo: types.maybeNull(types.string), // User ID
  status: types.enumeration("status", ["available", "allocated", "delivered", "damaged"]),
  operationId: types.string,
  createdAt: types.string,
  updatedAt: types.string,
})

export type IResource = typeof ResourceModel.Type
