"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const permissions_1 = require("../../src/lib/tenant/permissions");
(0, node_test_1.describe)("RBAC: hasPermission", () => {
    (0, node_test_1.it)("OWNER has all permissions", () => {
        const allPermissions = [
            "org:read", "org:update", "org:delete",
            "member:read", "member:invite", "member:remove", "member:updateRole",
            "settings:read", "settings:update"
        ];
        allPermissions.forEach((perm) => {
            node_assert_1.default.strictEqual((0, permissions_1.hasPermission)("OWNER", perm), true);
        });
    });
    (0, node_test_1.it)("ADMIN cannot delete org or update member roles", () => {
        node_assert_1.default.strictEqual((0, permissions_1.hasPermission)("ADMIN", "org:delete"), false);
        node_assert_1.default.strictEqual((0, permissions_1.hasPermission)("ADMIN", "member:updateRole"), false);
    });
    (0, node_test_1.it)("ADMIN can invite and remove members", () => {
        node_assert_1.default.strictEqual((0, permissions_1.hasPermission)("ADMIN", "member:invite"), true);
        node_assert_1.default.strictEqual((0, permissions_1.hasPermission)("ADMIN", "member:remove"), true);
    });
    (0, node_test_1.it)("MEMBER can only read", () => {
        node_assert_1.default.strictEqual((0, permissions_1.hasPermission)("MEMBER", "org:read"), true);
        node_assert_1.default.strictEqual((0, permissions_1.hasPermission)("MEMBER", "member:read"), true);
        node_assert_1.default.strictEqual((0, permissions_1.hasPermission)("MEMBER", "org:update"), false);
        node_assert_1.default.strictEqual((0, permissions_1.hasPermission)("MEMBER", "org:delete"), false);
        node_assert_1.default.strictEqual((0, permissions_1.hasPermission)("MEMBER", "member:invite"), false);
        node_assert_1.default.strictEqual((0, permissions_1.hasPermission)("MEMBER", "member:remove"), false);
        node_assert_1.default.strictEqual((0, permissions_1.hasPermission)("MEMBER", "member:updateRole"), false);
        node_assert_1.default.strictEqual((0, permissions_1.hasPermission)("MEMBER", "settings:update"), false);
    });
});
(0, node_test_1.describe)("RBAC: role hierarchy (isHigherOrEqualRole)", () => {
    (0, node_test_1.it)("OWNER >= OWNER", () => {
        node_assert_1.default.strictEqual((0, permissions_1.isHigherOrEqualRole)("OWNER", "OWNER"), true);
    });
    (0, node_test_1.it)("OWNER >= ADMIN", () => {
        node_assert_1.default.strictEqual((0, permissions_1.isHigherOrEqualRole)("OWNER", "ADMIN"), true);
    });
    (0, node_test_1.it)("OWNER >= MEMBER", () => {
        node_assert_1.default.strictEqual((0, permissions_1.isHigherOrEqualRole)("OWNER", "MEMBER"), true);
    });
    (0, node_test_1.it)("ADMIN >= MEMBER", () => {
        node_assert_1.default.strictEqual((0, permissions_1.isHigherOrEqualRole)("ADMIN", "MEMBER"), true);
    });
    (0, node_test_1.it)("ADMIN < OWNER", () => {
        node_assert_1.default.strictEqual((0, permissions_1.isHigherOrEqualRole)("ADMIN", "OWNER"), false);
    });
    (0, node_test_1.it)("MEMBER < ADMIN", () => {
        node_assert_1.default.strictEqual((0, permissions_1.isHigherOrEqualRole)("MEMBER", "ADMIN"), false);
    });
    (0, node_test_1.it)("MEMBER < OWNER", () => {
        node_assert_1.default.strictEqual((0, permissions_1.isHigherOrEqualRole)("MEMBER", "OWNER"), false);
    });
});
