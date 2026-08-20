import { Role, ROLE_HIERARCHY } from "./roles";

export type Action =
  | "org:update"
  | "org:delete"
  | "member:invite"
  | "member:remove"
  | "member:changeRole";

type PermissionMatrix = Record<Action, number>;

const PERMISSIONS: PermissionMatrix = {
  "org:update": ROLE_HIERARCHY[Role.ADMIN],
  "org:delete": ROLE_HIERARCHY[Role.OWNER],
  "member:invite": ROLE_HIERARCHY[Role.ADMIN],
  "member:remove": ROLE_HIERARCHY[Role.ADMIN],
  "member:changeRole": ROLE_HIERARCHY[Role.OWNER],
};

export function can(userRole: Role, action: Action): boolean {
  const userLevel = ROLE_HIERARCHY[userRole];
  const requiredLevel = PERMISSIONS[action];

  if (userLevel === undefined || requiredLevel === undefined) {
    return false;
  }

  return userLevel >= requiredLevel;
}
