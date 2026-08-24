"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * TENANT ISOLATION INTEGRATION TESTS
 *
 * These tests use a REAL PostgreSQL database (TEST_DATABASE_URL).
 * They verify that the data access layer correctly enforces tenant boundaries.
 *
 * IMPORTANT: Set TEST_DATABASE_URL in your environment before running.
 * These tests never touch the development or production database.
 */
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const client_1 = require("../../src/lib/db/client");
const organization_service_1 = require("../../src/services/organization.service");
const member_service_1 = require("../../src/services/member.service");
const app_error_1 = require("../../src/lib/errors/app-error");
const roles_1 = require("../../src/modules/permissions/roles");
const context_1 = require("../../src/lib/tenant/context");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const TEST_USERS = {
    userA: { email: "tenant-test-usera@flowra-test.internal", name: "User A" },
    userB: { email: "tenant-test-userb@flowra-test.internal", name: "User B" },
};
let userAId;
let userBId;
let orgAId;
let orgBId;
async function cleanupTestData() {
    // Cleanup in correct order respecting FK constraints
    await client_1.db.organizationMember.deleteMany({
        where: {
            user: { email: { in: [TEST_USERS.userA.email, TEST_USERS.userB.email] } },
        },
    }).catch(() => { });
    await client_1.db.organization.deleteMany({
        where: { slug: { in: ["tenant-test-org-a", "tenant-test-org-b"] } },
    }).catch(() => { });
    await client_1.db.user.deleteMany({
        where: { email: { in: [TEST_USERS.userA.email, TEST_USERS.userB.email] } },
    }).catch(() => { });
}
(0, node_test_1.before)(async () => {
    const hash = await bcryptjs_1.default.hash("TestPassword123!", 10);
    await cleanupTestData();
    const uA = await client_1.db.user.create({
        data: { email: TEST_USERS.userA.email, name: TEST_USERS.userA.name, passwordHash: hash },
    });
    userAId = uA.id;
    const uB = await client_1.db.user.create({
        data: { email: TEST_USERS.userB.email, name: TEST_USERS.userB.name, passwordHash: hash },
    });
    userBId = uB.id;
    const oA = await client_1.db.organization.create({
        data: { name: "Tenant Test Org A", slug: "tenant-test-org-a" },
    });
    orgAId = oA.id;
    await client_1.db.organizationMember.create({
        data: { userId: userAId, organizationId: orgAId, role: "OWNER" },
    });
    const oB = await client_1.db.organization.create({
        data: { name: "Tenant Test Org B", slug: "tenant-test-org-b" },
    });
    orgBId = oB.id;
    await client_1.db.organizationMember.create({
        data: { userId: userBId, organizationId: orgBId, role: "OWNER" },
    });
});
(0, node_test_1.after)(async () => {
    await cleanupTestData();
});
// ============================================================
// ORGANIZATION LISTING ISOLATION
// ============================================================
(0, node_test_1.describe)("Organization listing isolation", () => {
    (0, node_test_1.it)("User A can see their own organization", async () => {
        const orgs = await organization_service_1.organizationService.listForUser(userAId);
        node_assert_1.default.strictEqual(orgs.some((o) => o.id === orgAId), true);
    });
    (0, node_test_1.it)("User A cannot see User B's organization", async () => {
        const orgs = await organization_service_1.organizationService.listForUser(userAId);
        node_assert_1.default.strictEqual(orgs.some((o) => o.id === orgBId), false);
    });
    (0, node_test_1.it)("User B cannot see User A's organization", async () => {
        const orgs = await organization_service_1.organizationService.listForUser(userBId);
        node_assert_1.default.strictEqual(orgs.some((o) => o.id === orgAId), false);
    });
});
// ============================================================
// MEMBER ACCESS ISOLATION
// ============================================================
(0, node_test_1.describe)("Member service isolation", () => {
    (0, node_test_1.it)("User B cannot be listed via Org A (not a member)", async () => {
        const members = await member_service_1.memberService.listMembers(orgAId);
        node_assert_1.default.strictEqual(members.some((m) => m.userId === userBId), false);
    });
    (0, node_test_1.it)("Removing a non-existent member throws NOT_FOUND", async () => {
        await node_assert_1.default.rejects(async () => { await member_service_1.memberService.removeMember(orgAId, userBId); }, (err) => err instanceof app_error_1.AppError && err.statusCode === 404);
    });
    (0, node_test_1.it)("OWNER role cannot be changed by removeMember", async () => {
        await node_assert_1.default.rejects(async () => { await member_service_1.memberService.removeMember(orgAId, userAId); }, (err) => err instanceof app_error_1.AppError && err.statusCode === 403);
    });
});
// ============================================================
// RBAC: Role-based actions
// ============================================================
(0, node_test_1.describe)("Organization member RBAC at service layer", () => {
    let memberUserId;
    (0, node_test_1.before)(async () => {
        const hash = await bcryptjs_1.default.hash("TestPassword123!", 10);
        const email = "rbac-test-member@flowra-test.internal";
        await client_1.db.user.deleteMany({ where: { email } }).catch(() => { });
        const m = await client_1.db.user.create({
            data: { email, name: "RBAC Member", passwordHash: hash },
        });
        memberUserId = m.id;
        await client_1.db.organizationMember.create({
            data: { userId: memberUserId, organizationId: orgAId, role: "MEMBER" },
        });
    });
    (0, node_test_1.after)(async () => {
        await client_1.db.organizationMember.deleteMany({ where: { userId: memberUserId } }).catch(() => { });
        await client_1.db.user.deleteMany({ where: { id: memberUserId } }).catch(() => { });
    });
    (0, node_test_1.it)("OWNER can change a MEMBER role to ADMIN", async () => {
        const result = await member_service_1.memberService.changeRole(orgAId, memberUserId, roles_1.Role.ADMIN);
        node_assert_1.default.strictEqual(result.role, "ADMIN");
    });
    (0, node_test_1.it)("Cannot change the OWNER's role to MEMBER", async () => {
        await node_assert_1.default.rejects(async () => { await member_service_1.memberService.changeRole(orgAId, userAId, roles_1.Role.MEMBER); }, (err) => err instanceof app_error_1.AppError && err.statusCode === 403);
    });
});
// ============================================================
// CROSS-TENANT ISOLATION: Service layer
// ============================================================
(0, node_test_1.describe)("Cross-tenant isolation: service layer", () => {
    (0, node_test_1.it)("inviteMember into Org A with User B email adds them to OrgA, not OrgB", async () => {
        // User B is not in Org A at all initially — this is a valid invite scenario
        // We verify the org membership is scoped correctly
        const membersBefore = await member_service_1.memberService.listMembers(orgBId);
        const orgBMemberCount = membersBefore.length;
        // Invite userB into orgA (valid cross-org invite by org owner)
        await member_service_1.memberService.inviteMember(orgAId, TEST_USERS.userB.email, roles_1.Role.MEMBER);
        // Verify Org B membership count is unchanged
        const membersAfter = await member_service_1.memberService.listMembers(orgBId);
        node_assert_1.default.strictEqual(membersAfter.length, orgBMemberCount);
        // Verify User B is now in Org A
        const orgAMembers = await member_service_1.memberService.listMembers(orgAId);
        node_assert_1.default.strictEqual(orgAMembers.some((m) => m.userId === userBId), true);
        // Cleanup
        await client_1.db.organizationMember.deleteMany({
            where: { userId: userBId, organizationId: orgAId },
        });
    });
});
// ============================================================
// CONTEXT PROTECTION (User & Missing)
// ============================================================
(0, node_test_1.describe)("User context and missing tenant context", () => {
    (0, node_test_1.it)("Fails safely if tenant context is invalid (User not in Org)", async () => {
        // Attempt to resolve membership for User B in Org A (where User B is not a member)
        const membership = await (0, context_1.getOrganizationMembership)(userBId, orgAId);
        node_assert_1.default.strictEqual(membership, null);
    });
});
