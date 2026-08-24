"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_HIERARCHY = exports.Role = void 0;
var Role;
(function (Role) {
    Role["OWNER"] = "OWNER";
    Role["ADMIN"] = "ADMIN";
    Role["MEMBER"] = "MEMBER";
})(Role || (exports.Role = Role = {}));
exports.ROLE_HIERARCHY = {
    [Role.OWNER]: 3,
    [Role.ADMIN]: 2,
    [Role.MEMBER]: 1,
};
