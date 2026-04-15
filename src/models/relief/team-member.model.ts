import { types } from "mobx-state-tree"

/**
 * TeamMemberModel
 * Represents a member of a relief operation team
 */
export const TeamMemberModel = types.model("TeamMember", {
  id: types.identifier,
  userId: types.string,
  name: types.string,
  role: types.enumeration("role", ["coordinator", "volunteer", "observer"]),
  status: types.enumeration("status", ["active", "offline", "departed"]),
  operationId: types.string,
  location: types.maybeNull(
    types.model({
      latitude: types.number,
      longitude: types.number,
      accuracy: types.maybeNull(types.number),
      timestamp: types.number,
    })
  ),
  phone: types.maybeNull(types.string),
  joinedAt: types.string,
  updatedAt: types.string,
})

export type ITeamMember = typeof TeamMemberModel.Type
