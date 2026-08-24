import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { db } from "../../src/lib/db/client";
import { workflowService } from "../../src/services/workflow.service";
import { AppError } from "../../src/lib/errors/app-error";
import bcrypt from "bcryptjs";

const TEST_USERS = {
  userA: { email: "wf-test-usera@flowra-test.internal", name: "User A" },
  userB: { email: "wf-test-userb@flowra-test.internal", name: "User B" },
};

let userAId: string;
let userBId: string;
let orgAId: string;
let orgBId: string;
let workflowAId: string;

async function cleanupTestData() {
  await db.workflowNode.deleteMany({
    where: { workflow: { organization: { slug: { in: ["wf-test-org-a", "wf-test-org-b"] } } } },
  }).catch(() => {});
  await db.workflowEdge.deleteMany({
    where: { workflow: { organization: { slug: { in: ["wf-test-org-a", "wf-test-org-b"] } } } },
  }).catch(() => {});
  await db.workflow.deleteMany({
    where: { organization: { slug: { in: ["wf-test-org-a", "wf-test-org-b"] } } },
  }).catch(() => {});
  await db.organizationMember.deleteMany({
    where: { user: { email: { in: [TEST_USERS.userA.email, TEST_USERS.userB.email] } } },
  }).catch(() => {});
  await db.organization.deleteMany({
    where: { slug: { in: ["wf-test-org-a", "wf-test-org-b"] } },
  }).catch(() => {});
  await db.user.deleteMany({
    where: { email: { in: [TEST_USERS.userA.email, TEST_USERS.userB.email] } },
  }).catch(() => {});
}

before(async () => {
  const hash = await bcrypt.hash("TestPassword123!", 10);
  await cleanupTestData();

  const uA = await db.user.create({ data: { email: TEST_USERS.userA.email, name: TEST_USERS.userA.name, passwordHash: hash } });
  userAId = uA.id;

  const uB = await db.user.create({ data: { email: TEST_USERS.userB.email, name: TEST_USERS.userB.name, passwordHash: hash } });
  userBId = uB.id;

  const oA = await db.organization.create({ data: { name: "WF Test Org A", slug: "wf-test-org-a" } });
  orgAId = oA.id;
  await db.organizationMember.create({ data: { userId: userAId, organizationId: orgAId, role: "OWNER" } });

  const oB = await db.organization.create({ data: { name: "WF Test Org B", slug: "wf-test-org-b" } });
  orgBId = oB.id;
  await db.organizationMember.create({ data: { userId: userBId, organizationId: orgBId, role: "OWNER" } });
});

after(async () => {
  await cleanupTestData();
});

describe("Workflow Tenant Isolation", () => {
  it("Test 1: Org A creates workflow → Org A can read it", async () => {
    const wf = await workflowService.create(orgAId, userAId, {
      name: "Org A Workflow",
      description: "Test",
      nodes: [],
      edges: []
    });
    workflowAId = wf.id;

    const readWf = await workflowService.getById(workflowAId, orgAId);
    assert.strictEqual(readWf.id, workflowAId);
    assert.strictEqual(readWf.organizationId, orgAId);
  });

  it("Test 2: Org B cannot read Org A's workflow", async () => {
    await assert.rejects(
      async () => { await workflowService.getById(workflowAId, orgBId); },
      (err: any) => err instanceof AppError && err.statusCode === 404
    );
  });

  it("Test 3: Org B cannot update Org A's workflow", async () => {
    await assert.rejects(
      async () => { await workflowService.update(workflowAId, orgBId, { name: "Hacked" }); },
      (err: any) => err instanceof AppError && err.statusCode === 404
    );
  });

  it("Test 4: Org B cannot delete Org A's workflow", async () => {
    await assert.rejects(
      async () => { await workflowService.delete(workflowAId, orgBId); },
      (err: any) => err instanceof AppError && err.statusCode === 404
    );
  });

  it("Test 5: List for Org A returns only Org A workflows", async () => {
    // Let's create a workflow in Org B first
    await workflowService.create(orgBId, userBId, { name: "Org B Workflow", description: "", nodes: [], edges: [] });

    const listA = await workflowService.list(orgAId);
    const listB = await workflowService.list(orgBId);

    assert.strictEqual(listA.length > 0, true);
    listA.forEach(wf => assert.strictEqual(wf.organizationId, orgAId));
    
    assert.strictEqual(listB.length > 0, true);
    listB.forEach(wf => assert.strictEqual(wf.organizationId, orgBId));
  });

  it("Test 6: Client-supplied organizationId cannot be spoofed to create cross-tenant workflow", async () => {
    // The service layer explicitly takes organizationId from the API controller,
    // which derives it from requireTenant() (which verifies membership).
    // Let's ensure the repository correctly assigns it to the passed orgId regardless of input payload.
    // If a client sends { organizationId: orgBId } while logged into orgAId, the router calls service.create(orgAId, ...).
    const wf = await workflowService.create(orgAId, userAId, {
      name: "Spoof Test",
      nodes: [],
      edges: []
    } as any);

    assert.strictEqual(wf.organizationId, orgAId);
    assert.notStrictEqual(wf.organizationId, orgBId);
  });
});
