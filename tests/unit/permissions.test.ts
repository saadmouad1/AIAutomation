import { describe, it } from "node:test";
import assert from "node:assert";
import { hasPermission, isHigherOrEqualRole, type Role, type Permission } from "../../src/lib/tenant/permissions";

describe("RBAC: hasPermission", () => {
  it("OWNER has all permissions", () => {
    const allPermissions: Permission[] = [
      "org:read", "org:update", "org:delete",
      "member:read", "member:invite", "member:remove", "member:updateRole",
      "settings:read", "settings:update"
    ];
    allPermissions.forEach((perm) => {
      assert.strictEqual(hasPermission("OWNER", perm), true);
    });
  });

  it("ADMIN cannot delete org or update member roles", () => {
    assert.strictEqual(hasPermission("ADMIN", "org:delete"), false);
    assert.strictEqual(hasPermission("ADMIN", "member:updateRole"), false);
  });

  it("ADMIN can invite and remove members", () => {
    assert.strictEqual(hasPermission("ADMIN", "member:invite"), true);
    assert.strictEqual(hasPermission("ADMIN", "member:remove"), true);
  });

  it("MEMBER can only read", () => {
    assert.strictEqual(hasPermission("MEMBER", "org:read"), true);
    assert.strictEqual(hasPermission("MEMBER", "member:read"), true);
    assert.strictEqual(hasPermission("MEMBER", "org:update"), false);
    assert.strictEqual(hasPermission("MEMBER", "org:delete"), false);
    assert.strictEqual(hasPermission("MEMBER", "member:invite"), false);
    assert.strictEqual(hasPermission("MEMBER", "member:remove"), false);
    assert.strictEqual(hasPermission("MEMBER", "member:updateRole"), false);
    assert.strictEqual(hasPermission("MEMBER", "settings:update"), false);
  });
});

describe("RBAC: role hierarchy (isHigherOrEqualRole)", () => {
  it("OWNER >= OWNER", () => {
    assert.strictEqual(isHigherOrEqualRole("OWNER", "OWNER"), true);
  });

  it("OWNER >= ADMIN", () => {
    assert.strictEqual(isHigherOrEqualRole("OWNER", "ADMIN"), true);
  });

  it("OWNER >= MEMBER", () => {
    assert.strictEqual(isHigherOrEqualRole("OWNER", "MEMBER"), true);
  });

  it("ADMIN >= MEMBER", () => {
    assert.strictEqual(isHigherOrEqualRole("ADMIN", "MEMBER"), true);
  });

  it("ADMIN < OWNER", () => {
    assert.strictEqual(isHigherOrEqualRole("ADMIN", "OWNER"), false);
  });

  it("MEMBER < ADMIN", () => {
    assert.strictEqual(isHigherOrEqualRole("MEMBER", "ADMIN"), false);
  });

  it("MEMBER < OWNER", () => {
    assert.strictEqual(isHigherOrEqualRole("MEMBER", "OWNER"), false);
  });
});
