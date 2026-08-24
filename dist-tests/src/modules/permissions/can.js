"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.can = can;
const roles_1 = require("./roles");
const PERMISSIONS = {
    "org:update": roles_1.ROLE_HIERARCHY[roles_1.Role.ADMIN],
    "org:delete": roles_1.ROLE_HIERARCHY[roles_1.Role.OWNER],
    "member:invite": roles_1.ROLE_HIERARCHY[roles_1.Role.ADMIN],
    "member:remove": roles_1.ROLE_HIERARCHY[roles_1.Role.ADMIN],
    "member:changeRole": roles_1.ROLE_HIERARCHY[roles_1.Role.OWNER],
};
function can(userRole, action) {
    const userLevel = roles_1.ROLE_HIERARCHY[userRole];
    const requiredLevel = PERMISSIONS[action];
    if (userLevel === undefined || requiredLevel === undefined) {
        return false;
    }
    return userLevel >= requiredLevel;
}
