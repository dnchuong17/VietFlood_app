import { useAuth } from '../features/auth/hooks/useAuth';

export type UserRole = 'user' | 'relief_worker' | 'admin' | 'moderator';

type RolePermissions = {
  [key in UserRole]: string[];
};

const rolePermissions: RolePermissions = {
  user: ['view_reports', 'create_report', 'view_home'],
  relief_worker: ['view_reports', 'create_report', 'view_home', 'view_relief_dashboard', 'manage_operations'],
  admin: ['*'], // all permissions
  moderator: ['view_reports', 'approve_reports', 'view_home', 'moderate_content'],
};

export function hasRole(userRoles: UserRole[], requiredRoles: UserRole[]): boolean {
  return requiredRoles.some(role => userRoles.includes(role));
}

export function hasPermission(userRoles: UserRole[], permission: string): boolean {
  return userRoles.some(role => {
    const permissions = rolePermissions[role];
    return permissions.includes('*') || permissions.includes(permission);
  });
}

export function useRoleBasedAccess() {
  const { user } = useAuth();

  const can = (permission: string): boolean => {
    if (!user?.roles) return false;
    return hasPermission(user.roles, permission);
  };

  const canAccess = (requiredRoles: UserRole[]): boolean => {
    if (!user?.roles) return false;
    return hasRole(user.roles, requiredRoles);
  };

  return { can, canAccess, userRoles: user?.roles || [] };
}
