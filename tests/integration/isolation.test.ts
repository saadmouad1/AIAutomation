/**
 * TENANT ISOLATION INTEGRATION TESTS
 *
 * These tests use a REAL PostgreSQL database (TEST_DATABASE_URL).
 * They verify that the data access layer correctly enforces tenant boundaries.
 *
 * IMPORTANT: Set TEST_DATABASE_URL in your environment before running.
 * These tests never touch the development or production database.
 */
import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { db } from "../../src/lib/db/client";
import { organizationService } from "../../src/services/organization.service";
import { memberService } from "../../src/services/member.service";
import { AppError } from "../../src/lib/errors/app-error";
import { Role } from "../../src/modules/permissions/roles";
import { getOrganizationMembership } from "../../src/lib/tenant/context";
import bcrypt from "bcryptjs";

const TEST_USERS = {
  userA: { email: "tenant-test-usera@flowra-test.internal", name: "User A" },
  userB: { email: "tenant-test-userb@flowra-test.internal", name: "User B" },
};

let userAId: string;
let userBId: string;
let orgAId: string;
let orgBId: string;

async function cleanupTestData() {
  // Cleanup in correct order respecting FK constraints
  await db.organizationMember.deleteMany({
    where: {
      user: { email: { in: [TEST_USERS.userA.email, TEST_USERS.userB.email] } },
    },
  }).catch(() => {});
  await db.organization.deleteMany({
    where: { slug: { in: ["tenant-test-org-a", "tenant-test-org-b"] } },
  }).catch(() => {});
  await db.user.deleteMany({
    where: { email: { in: [TEST_USERS.userA.email, TEST_USERS.userB.email] } },
  }).catch(() => {});
}

before(async () => {
  const hash = await bcrypt.hash("TestPassword123!", 10);

  await cleanupTestData();

  const uA = await db.user.create({
    data: { email: TEST_USERS.userA.email, name: TEST_USERS.userA.name, passwordHash: hash },
  });
  userAId = uA.id;

  const uB = await db.user.create({
    data: { email: TEST_USERS.userB.email, name: TEST_USERS.userB.name, passwordHash: hash },
  });
  userBId = uB.id;

  const oA = await db.organization.create({
    data: { name: "Tenant Test Org A", slug: "tenant-test-org-a" },
  });
  orgAId = oA.id;
  await db.organizationMember.create({
    data: { userId: userAId, organizationId: orgAId, role: "OWNER" },
  });

  const oB = await db.organization.create({
    data: { name: "Tenant Test Org B", slug: "tenant-test-org-b" },
  });
  orgBId = oB.id;
  await db.organizationMember.create({
    data: { userId: userBId, organizationId: orgBId, role: "OWNER" },
  });
});

after(async () => {
  await cleanupTestData();
});

// ============================================================
// ORGANIZATION LISTING ISOLATION
// ============================================================
describe("Organization listing isolation", () => {
  it("User A can see their own organization", async () => {
    const orgs = await organizationService.listForUser(userAId);
    assert.strictEqual(orgs.some((o: { id: string }) => o.id === orgAId), true);
  });

  it("User A cannot see User B's organization", async () => {
    const orgs = await organizationService.listForUser(userAId);
    assert.strictEqual(orgs.some((o: { id: string }) => o.id === orgBId), false);
  });

  it("User B cannot see User A's organization", async () => {
    const orgs = await organizationService.listForUser(userBId);
    assert.strictEqual(orgs.some((o: { id: string }) => o.id === orgAId), false);
  });
});

// ============================================================
// MEMBER ACCESS ISOLATION
// ============================================================
describe("Member service isolation", () => {
  it("User B cannot be listed via Org A (not a member)", async () => {
    const members = await memberService.listMembers(orgAId);
    assert.strictEqual(members.some((m: { userId: string }) => m.userId === userBId), false);
  });

  it("Removing a non-existent member throws NOT_FOUND", async () => {
    await assert.rejects(
      async () => { await memberService.removeMember(orgAId, userBId); },
      (err: any) => err instanceof AppError && err.statusCode === 404
    );
  });

  it("OWNER role cannot be changed by removeMember", async () => {
    await assert.rejects(
      async () => { await memberService.removeMember(orgAId, userAId); },
      (err: any) => err instanceof AppError && err.statusCode === 403
    );
  });
});

// ============================================================
// RBAC: Role-based actions
// ============================================================
describe("Organization member RBAC at service layer", () => {
  let memberUserId: string;

  before(async () => {
    const hash = await bcrypt.hash("TestPassword123!", 10);
    const email = "rbac-test-member@flowra-test.internal";
    await db.user.deleteMany({ where: { email } }).catch(() => {});
    const m = await db.user.create({
      data: { email, name: "RBAC Member", passwordHash: hash },
    });
    memberUserId = m.id;
    await db.organizationMember.create({
      data: { userId: memberUserId, organizationId: orgAId, role: "MEMBER" },
    });
  });

  after(async () => {
    await db.organizationMember.deleteMany({ where: { userId: memberUserId } }).catch(() => {});
    await db.user.deleteMany({ where: { id: memberUserId } }).catch(() => {});
  });

  it("OWNER can change a MEMBER role to ADMIN", async () => {
    const result = await memberService.changeRole(orgAId, memberUserId, Role.ADMIN);
    assert.strictEqual(result.role, "ADMIN");
  });

  it("Cannot change the OWNER's role to MEMBER", async () => {
    await assert.rejects(
      async () => { await memberService.changeRole(orgAId, userAId, Role.MEMBER); },
      (err: any) => err instanceof AppError && err.statusCode === 403
    );
  });
});

// ============================================================
// CROSS-TENANT ISOLATION: Service layer
// ============================================================
describe("Cross-tenant isolation: service layer", () => {
  it("inviteMember into Org A with User B email adds them to OrgA, not OrgB", async () => {
    // User B is not in Org A at all initially — this is a valid invite scenario
    // We verify the org membership is scoped correctly
    const membersBefore = await memberService.listMembers(orgBId);
    const orgBMemberCount = membersBefore.length;

    // Invite userB into orgA (valid cross-org invite by org owner)
    await memberService.inviteMember(orgAId, TEST_USERS.userB.email, Role.MEMBER);

    // Verify Org B membership count is unchanged
    const membersAfter = await memberService.listMembers(orgBId);
    assert.strictEqual(membersAfter.length, orgBMemberCount);

    // Verify User B is now in Org A
    const orgAMembers = await memberService.listMembers(orgAId);
    assert.strictEqual(orgAMembers.some((m: { userId: string }) => m.userId === userBId), true);

    // Cleanup
    await db.organizationMember.deleteMany({
      where: { userId: userBId, organizationId: orgAId },
    });
  });
});

// ============================================================
// CONTEXT PROTECTION (User & Missing)
// ============================================================
describe("User context and missing tenant context", () => {
  it("Fails safely if tenant context is invalid (User not in Org)", async () => {
    // Attempt to resolve membership for User B in Org A (where User B is not a member)
    const membership = await getOrganizationMembership(userBId, orgAId);
    assert.strictEqual(membership, null);
  });
});
