"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const node_assert_1 = __importDefault(require("node:assert"));
const client_1 = require("../../src/lib/db/client");
const workflow_execution_service_1 = require("../../src/services/workflow-execution.service");
const workflow_service_1 = require("../../src/services/workflow.service");
let orgAId;
let orgBId;
let userAId;
let userBId;
let workflowAId;
async function setupTestData() {
    const orgA = await client_1.db.organization.create({
        data: { name: "Exec Org A", slug: `exec-org-a-${Date.now()}` },
    });
    orgAId = orgA.id;
    const orgB = await client_1.db.organization.create({
        data: { name: "Exec Org B", slug: `exec-org-b-${Date.now()}` },
    });
    orgBId = orgB.id;
    const userA = await client_1.db.user.create({
        data: { email: `exec.usera.${Date.now()}@example.com`, name: "User A" },
    });
    userAId = userA.id;
    const userB = await client_1.db.user.create({
        data: { email: `exec.userb.${Date.now()}@example.com`, name: "User B" },
    });
    userBId = userB.id;
    await client_1.db.organizationMember.create({
        data: { organizationId: orgAId, userId: userAId, role: "OWNER" },
    });
    await client_1.db.organizationMember.create({
        data: { organizationId: orgBId, userId: userBId, role: "OWNER" },
    });
    // Create a basic START -> LOG -> END workflow for Org A
    const workflowA = await workflow_service_1.workflowService.create(orgAId, userAId, {
        name: "Test Exec Workflow",
        nodes: [
            { id: "node-1", type: "START", position: { x: 0, y: 0 }, data: {} },
            { id: "node-2", type: "LOG", position: { x: 0, y: 100 }, data: { msg: "Hello" } },
            { id: "node-3", type: "END", position: { x: 0, y: 200 }, data: {} },
        ],
        edges: [
            { id: "edge-1", source: "node-1", target: "node-2" },
            { id: "edge-2", source: "node-2", target: "node-3" },
        ],
    });
    workflowAId = workflowA.id;
}
async function cleanupTestData() {
    await client_1.db.workflowExecution.deleteMany({
        where: { organizationId: { in: [orgAId, orgBId] } }
    });
    await client_1.db.workflowNode.deleteMany({
        where: { workflowId: workflowAId }
    });
    await client_1.db.workflowEdge.deleteMany({
        where: { workflowId: workflowAId }
    });
    await client_1.db.workflow.deleteMany({
        where: { id: workflowAId }
    });
    await client_1.db.organizationMember.deleteMany({
        where: { organizationId: { in: [orgAId, orgBId] } }
    });
    await client_1.db.organization.deleteMany({
        where: { id: { in: [orgAId, orgBId] } }
    });
    await client_1.db.user.deleteMany({
        where: { id: { in: [userAId, userBId] } }
    });
}
(0, node_test_1.default)("Workflow Execution Engine", async (t) => {
    await setupTestData();
    let executionIdA;
    t.after(cleanupTestData);
    await t.test("TEST 1: Organization A can execute its workflow", async () => {
        const execution = await workflow_execution_service_1.WorkflowExecutionService.startExecution(orgAId, workflowAId, userAId, { test: true });
        node_assert_1.default.ok(execution.id);
        node_assert_1.default.strictEqual(execution.status, "SUCCESS");
        executionIdA = execution.id;
    });
    await t.test("TEST 2: Organization B cannot execute Organization A workflow", async () => {
        await node_assert_1.default.rejects(workflow_execution_service_1.WorkflowExecutionService.startExecution(orgBId, workflowAId, userBId), /Workflow not found/);
    });
    await t.test("TEST 3: Organization B cannot read Organization A execution", async () => {
        await node_assert_1.default.rejects(workflow_execution_service_1.WorkflowExecutionService.getExecution(orgBId, executionIdA, userBId), /EXECUTION_NOT_FOUND/);
    });
    await t.test("TEST 4: Organization A can read its execution", async () => {
        const execution = await workflow_execution_service_1.WorkflowExecutionService.getExecution(orgAId, executionIdA, userAId);
        node_assert_1.default.strictEqual(execution.id, executionIdA);
    });
    await t.test("TEST 5: START -> LOG -> END executes successfully", async () => {
        const execution = await workflow_execution_service_1.WorkflowExecutionService.getExecution(orgAId, executionIdA, userAId);
        node_assert_1.default.strictEqual(execution.status, "SUCCESS");
        node_assert_1.default.ok(execution.nodeResults);
        const results = execution.nodeResults;
        node_assert_1.default.strictEqual(results["node-1"].success, true);
        node_assert_1.default.strictEqual(results["node-2"].success, true);
        node_assert_1.default.strictEqual(results["node-3"].success, true);
    });
    await t.test("TEST 6: Malformed workflow fails safely", async () => {
        const badWorkflow = await workflow_service_1.workflowService.create(orgAId, userAId, {
            name: "Bad Workflow",
            nodes: [], // Empty nodes
            edges: [],
        });
        await node_assert_1.default.rejects(workflow_execution_service_1.WorkflowExecutionService.startExecution(orgAId, badWorkflow.id, userAId), /INVALID_WORKFLOW/);
    });
    await t.test("TEST 7: Circular workflow fails with CYCLE_DETECTED", async () => {
        const cycleWorkflow = await workflow_service_1.workflowService.create(orgAId, userAId, {
            name: "Cycle Workflow",
            nodes: [
                { id: "node-1", type: "START", position: { x: 0, y: 0 }, data: {} },
                { id: "node-2", type: "LOG", position: { x: 0, y: 100 }, data: {} },
            ],
            edges: [
                { id: "edge-1", source: "node-1", target: "node-2" },
                { id: "edge-2", source: "node-2", target: "node-1" }, // Circular
            ],
        });
        const execution = await workflow_execution_service_1.WorkflowExecutionService.startExecution(orgAId, cycleWorkflow.id, userAId);
        node_assert_1.default.strictEqual(execution.status, "FAILED");
        node_assert_1.default.ok(execution.error?.includes("CYCLE_DETECTED"));
    });
    await t.test("TEST 8: Workflow exceeding 50 steps fails with MAX_STEPS_EXCEEDED", async () => {
        // Construct a long linear workflow to hit the 50 step limit
        const nodes = [{ id: "node-0", type: "START", position: { x: 0, y: 0 }, data: {} }];
        const edges = [];
        for (let i = 1; i <= 51; i++) {
            nodes.push({ id: `node-${i}`, type: "LOG", position: { x: 0, y: i * 10 }, data: {} });
            edges.push({ id: `edge-${i}`, source: `node-${i - 1}`, target: `node-${i}` });
        }
        const maxStepsWorkflow = await workflow_service_1.workflowService.create(orgAId, userAId, {
            name: "Max Steps Workflow",
            nodes,
            edges,
        });
        const execution = await workflow_execution_service_1.WorkflowExecutionService.startExecution(orgAId, maxStepsWorkflow.id, userAId);
        node_assert_1.default.strictEqual(execution.status, "FAILED");
        node_assert_1.default.ok(execution.error?.includes("MAX_STEPS_EXCEEDED"));
    });
    await t.test("TEST 9: Execution stores workflowVersion", async () => {
        const execution = await workflow_execution_service_1.WorkflowExecutionService.getExecution(orgAId, executionIdA, userAId);
        node_assert_1.default.strictEqual(execution.workflowVersion, 1);
    });
    await t.test("TEST 10: Execution stores immutable definition snapshot", async () => {
        const execution = await workflow_execution_service_1.WorkflowExecutionService.getExecution(orgAId, executionIdA, userAId);
        const def = execution.definition;
        node_assert_1.default.ok(def.nodes);
        node_assert_1.default.ok(def.edges);
        node_assert_1.default.strictEqual(def.nodes.length, 3);
    });
    await t.test("TEST 11: Changing the source workflow after execution creation does not change execution.definition", async () => {
        // Modify the workflow
        await workflow_service_1.workflowService.update(workflowAId, orgAId, {
            nodes: [
                { id: "node-1", type: "START", position: { x: 0, y: 0 }, data: {} },
                { id: "node-2", type: "LOG", position: { x: 0, y: 100 }, data: {} },
                { id: "node-2-1", type: "LOG", position: { x: 0, y: 150 }, data: {} }, // Added new node
                { id: "node-3", type: "END", position: { x: 0, y: 200 }, data: {} },
            ],
            edges: [
                { id: "edge-1", source: "node-1", target: "node-2" },
                { id: "edge-2", source: "node-2", target: "node-2-1" },
                { id: "edge-3", source: "node-2-1", target: "node-3" },
            ],
        });
        // Check execution definition again
        const execution = await workflow_execution_service_1.WorkflowExecutionService.getExecution(orgAId, executionIdA, userAId);
        const def = execution.definition;
        // Original execution must still have 3 nodes, not 4
        node_assert_1.default.strictEqual(def.nodes.length, 3);
        node_assert_1.default.strictEqual(execution.workflowVersion, 1); // Version shouldn't change for old execution
        // DB version should be 2 now
        const workflow = await workflow_service_1.workflowService.getById(workflowAId, orgAId);
        node_assert_1.default.strictEqual(workflow?.version, 2);
    });
    await t.test("TEST 12: Client-supplied organizationId cannot bypass tenant isolation", async () => {
        // User B tries to inject Org A's ID into the URL params, but their session only resolves to User B
        // In startExecution, the service checks membership for the provided orgId and user ID.
        // If User B provides orgAId, OrganizationService.getMembership(orgAId, userBId) will return null.
        await node_assert_1.default.rejects(workflow_execution_service_1.WorkflowExecutionService.startExecution(orgAId, workflowAId, userBId), /FORBIDDEN/);
    });
});
