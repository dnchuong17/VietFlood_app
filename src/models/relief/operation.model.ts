import { types } from "mobx-state-tree"
import { ResourceModel } from "./resource.model"
import { TeamMemberModel } from "./team-member.model"

/**
 * OperationModel
 * Represents a relief operation
 */
export const OperationModel = types
  .model("Operation", {
    id: types.identifier,
    name: types.string,
    description: types.optional(types.string, ""),
    status: types.enumeration("status", ["planning", "active", "paused", "completed", "cancelled"]),
    location: types.model({
      lat: types.number,
      lng: types.number,
      name: types.string,
    }),
    startDate: types.string,
    endDate: types.maybeNull(types.string),
    priority: types.enumeration("priority", ["low", "medium", "high", "urgent"]),
    coordinatorId: types.string,
    resources: types.array(ResourceModel),
    teamMembers: types.array(TeamMemberModel),
    isLoading: types.optional(types.boolean, false),
    error: types.optional(types.maybeNull(types.string), null),
    createdAt: types.string,
    updatedAt: types.string,
  })
  .views((self) => ({
    get resourceCount() {
      return self.resources.length
    },
    get teamCount() {
      return self.teamMembers.length
    },
    get activeMembers() {
      return self.teamMembers.filter((m) => m.status === "active").length
    },
    get availableResources() {
      return self.resources.filter((r) => r.status === "available").length
    },
    isCoordinator(userId: string) {
      return self.coordinatorId === userId
    },
  }))
  .actions((self) => ({
    setLoading(loading: boolean) {
      self.isLoading = loading
    },
    setError(error: string | null) {
      self.error = error
    },
    updateStatus(status: typeof self.status) {
      self.status = status
      self.updatedAt = new Date().toISOString()
    },
    addResource(resource: typeof ResourceModel.Type) {
      self.resources.push(resource)
    },
    removeResource(resourceId: string) {
      const index = self.resources.findIndex((r) => r.id === resourceId)
      if (index >= 0) {
        self.resources.splice(index, 1)
      }
    },
    updateResource(resourceId: string, updates: Partial<typeof ResourceModel.Type>) {
      const resource = self.resources.find((r) => r.id === resourceId)
      if (resource) {
        Object.assign(resource, updates)
        resource.updatedAt = new Date().toISOString()
      }
    },
    addTeamMember(member: typeof TeamMemberModel.Type) {
      self.teamMembers.push(member)
    },
    removeTeamMember(memberId: string) {
      const index = self.teamMembers.findIndex((m) => m.id === memberId)
      if (index >= 0) {
        self.teamMembers.splice(index, 1)
      }
    },
    updateTeamMember(memberId: string, updates: Partial<typeof TeamMemberModel.Type>) {
      const member = self.teamMembers.find((m) => m.id === memberId)
      if (member) {
        Object.assign(member, updates)
        member.updatedAt = new Date().toISOString()
      }
    },
  }))

export type IOperation = typeof OperationModel.Type
