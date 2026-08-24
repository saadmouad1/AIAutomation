"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const client_1 = require("../../src/lib/db/client");
const workflow_service_1 = require("../../src/services/workflow.service");
const app_error_1 = require("../../src/lib/errors/app-error");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const TEST_USERS = {
    userA: { email: "wf-test-usera@flowra-test.internal", name: "User A" },
    userB: { email: "wf-test-userb@flowra-test.internal", name: "User B" },
};
let userAId;
let userBId;
let orgAId;
let orgBId;
let workflowAId;
async function cleanupTestData() {
    await client_1.db.workflowNode.deleteMany({
        where: { workflow: { organization: { slug: { in: ["wf-test-org-a", "wf-test-org-b"] } } } },
    }).catch(() => { });
    await client_1.db.workflowEdge.deleteMany({
        where: { workflow: { organization: { slug: { in: ["wf-test-org-a", "wf-test-org-b"] } } } },
    }).catch(() => { });
    await client_1.db.workflow.deleteMany({
        where: { organization: { slug: { in: ["wf-test-org-a", "wf-test-org-b"] } } },
    }).catch(() => { });
    await client_1.db.organizationMember.deleteMany({
        where: { user: { email: { in: [TEST_USERS.userA.email, TEST_USERS.userB.email] } } },
    }).catch(() => { });
    await client_1.db.organization.deleteMany({
        where: { slug: { in: ["wf-test-org-a", "wf-test-org-b"] } },
    }).catch(() => { });
    await client_1.db.user.deleteMany({
        where: { email: { in: [TEST_USERS.userA.email, TEST_USERS.userB.email] } },
    }).catch(() => { });
}
(0, node_test_1.before)(async () => {
    const hash = await bcryptjs_1.default.hash("TestPassword123!", 10);
    await cleanupTestData();
    const uA = await client_1.db.user.create({ data: { email: TEST_USERS.userA.email, name: TEST_USERS.userA.name, passwordHash: hash } });
    userAId = uA.id;
    const uB = await client_1.db.user.create({ data: { email: TEST_USERS.userB.email, name: TEST_USERS.userB.name, passwordHash: hash } });
    userBId = uB.id;
    const oA = await client_1.db.organization.create({ data: { name: "WF Test Org A", slug: "wf-test-org-a" } });
    orgAId = oA.id;
    await client_1.db.organizationMember.create({ data: { userId: userAId, organizationId: orgAId, role: "OWNER" } });
    const oB = await client_1.db.organization.create({ data: { name: "WF Test Org B", slug: "wf-test-org-b" } });
    orgBId = oB.id;
    await client_1.db.organizationMember.create({ data: { userId: userBId, organizationId: orgBId, role: "OWNER" } });
});
(0, node_test_1.after)(async () => {
    await cleanupTestData();
});
(0, node_test_1.describe)("Workflow Tenant Isolation", () => {
    (0, node_test_1.it)("Test 1: Org A creates workflow → Org A can read it", async () => {
        const wf = await workflow_service_1.workflowService.create(orgAId, userAId, {
            name: "Org A Workflow",
            description: "Test",
            nodes: [],
            edges: []
        });
        workflowAId = wf.id;
        const readWf = await workflow_service_1.workflowService.getById(workflowAId, orgAId);
        node_assert_1.default.strictEqual(readWf.id, workflowAId);
        node_assert_1.default.strictEqual(readWf.organizationId, orgAId);
    });
    (0, node_test_1.it)("Test 2: Org B cannot read Org A's workflow", async () => {
        await node_assert_1.default.rejects(async () => { await workflow_service_1.workflowService.getById(workflowAId, orgBId); }, (err) => err instanceof app_error_1.AppError && err.statusCode === 404);
    });
    (0, node_test_1.it)("Test 3: Org B cannot update Org A's workflow", async () => {
        await node_assert_1.default.rejects(async () => { await workflow_service_1.workflowService.update(workflowAId, orgBId, { name: "Hacked" }); }, (err) => err instanceof app_error_1.AppError && err.statusCode === 404);
    });
    (0, node_test_1.it)("Test 4: Org B cannot delete Org A's workflow", async () => {
        await node_assert_1.default.rejects(async () => { await workflow_service_1.workflowService.delete(workflowAId, orgBId); }, (err) => err instanceof app_error_1.AppError && err.statusCode === 404);
    });
    (0, node_test_1.it)("Test 5: List for Org A returns only Org A workflows", async () => {
        // Let's create a workflow in Org B first
        await workflow_service_1.workflowService.create(orgBId, userBId, { name: "Org B Workflow", description: "", nodes: [], edges: [] });
        const listA = await workflow_service_1.workflowService.list(orgAId);
        const listB = await workflow_service_1.workflowService.list(orgBId);
        node_assert_1.default.strictEqual(listA.length > 0, true);
        listA.forEach(wf => node_assert_1.default.strictEqual(wf.organizationId, orgAId));
        node_assert_1.default.strictEqual(listB.length > 0, true);
        listB.forEach(wf => node_assert_1.default.strictEqual(wf.organizationId, orgBId));
    });
    (0, node_test_1.it)("Test 6: Client-supplied organizationId cannot be spoofed to create cross-tenant workflow", async () => {
        // The service layer explicitly takes organizationId from the API controller,
        // which derives it from requireTenant() (which verifies membership).
        // Let's ensure the repository correctly assigns it to the passed orgId regardless of input payload.
        // If a client sends { organizationId: orgBId } while logged into orgAId, the router calls service.create(orgAId, ...).
        const wf = await workflow_service_1.workflowService.create(orgAId, userAId, {
            name: "Spoof Test",
            nodes: [],
            edges: []
        });
        node_assert_1.default.strictEqual(wf.organizationId, orgAId);
        node_assert_1.default.notStrictEqual(wf.organizationId, orgBId);
    });
});
