"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = hasPermission;
exports.isHigherOrEqualRole = isHigherOrEqualRole;
const ROLE_PERMISSIONS = {
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
function hasPermission(role, permission) {
    return ROLE_PERMISSIONS[role].includes(permission);
}
function isHigherOrEqualRole(roleToEvaluate, roleToCompareAgainst) {
    const hierarchy = {
        OWNER: 3,
        ADMIN: 2,
        MEMBER: 1
    };
    return hierarchy[roleToEvaluate] >= hierarchy[roleToCompareAgainst];
}
