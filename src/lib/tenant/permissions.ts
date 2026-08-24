export type Role = "OWNER" | "ADMIN" | "MEMBER";

export type Permission = 
  | "org:read"
  | "org:update"
  | "org:delete"
  | "member:read"
  | "member:invite"
  | "member:remove"
  | "member:updateRole"
  | "settings:read"
  | "settings:update"
  | "workflow:read"
  | "workflow:create"
  | "workflow:update"
  | "workflow:delete"
  | "workflow:execute";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: [
    "org:read", "org:update", "org:delete",
    "member:read", "member:invite", "member:remove", "member:updateRole",
    "settings:read", "settings:update",
    "workflow:read", "workflow:create", "workflow:update", "workflow:delete", "workflow:execute",
  ],
  ADMIN: [
    "org:read", "org:update",
    "member:read", "member:invite", "member:remove",
    "settings:read", "settings:update",
    "workflow:read", "workflow:create", "workflow:update", "workflow:delete", "workflow:execute",
  ],
  MEMBER: [
    "org:read",
    "member:read",
    "workflow:read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function isHigherOrEqualRole(roleToEvaluate: Role, roleToCompareAgainst: Role): boolean {
  const hierarchy: Record<Role, number> = {
    OWNER: 3,
    ADMIN: 2,
    MEMBER: 1
  };

  return hierarchy[roleToEvaluate] >= hierarchy[roleToCompareAgainst];
}
