import test from "node:test";
import assert from "node:assert";
import { db } from "../../src/lib/db/client";
import { WorkflowExecutionService } from "../../src/services/workflow-execution.service";
import { workflowService } from "../../src/services/workflow.service";

let orgAId: string;
let orgBId: string;
let userAId: string;
let userBId: string;
let workflowAId: string;

async function setupTestData() {
  const orgA = await db.organization.create({
    data: { name: "Exec Org A", slug: `exec-org-a-${Date.now()}` },
  });
  orgAId = orgA.id;

  const orgB = await db.organization.create({
    data: { name: "Exec Org B", slug: `exec-org-b-${Date.now()}` },
  });
  orgBId = orgB.id;

  const userA = await db.user.create({
    data: { email: `exec.usera.${Date.now()}@example.com`, name: "User A" },
  });
  userAId = userA.id;

  const userB = await db.user.create({
    data: { email: `exec.userb.${Date.now()}@example.com`, name: "User B" },
  });
  userBId = userB.id;

  await db.organizationMember.create({
    data: { organizationId: orgAId, userId: userAId, role: "OWNER" },
  });

  await db.organizationMember.create({
    data: { organizationId: orgBId, userId: userBId, role: "OWNER" },
  });

  // Create a basic START -> LOG -> END workflow for Org A
  const workflowA = await workflowService.create(orgAId, userAId, {
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
  await db.workflowExecution.deleteMany({
    where: { organizationId: { in: [orgAId, orgBId] } }
  });
  await db.workflowNode.deleteMany({
    where: { workflowId: workflowAId }
  });
  await db.workflowEdge.deleteMany({
    where: { workflowId: workflowAId }
  });
  await db.workflow.deleteMany({
    where: { id: workflowAId }
  });
  await db.organizationMember.deleteMany({
    where: { organizationId: { in: [orgAId, orgBId] } }
  });
  await db.organization.deleteMany({
    where: { id: { in: [orgAId, orgBId] } }
  });
  await db.user.deleteMany({
    where: { id: { in: [userAId, userBId] } }
  });
}

test("Workflow Execution Engine", async (t) => {
  await setupTestData();
  let executionIdA: string;

  t.after(cleanupTestData);

  await t.test("TEST 1: Organization A can execute its workflow", async () => {
    const execution = await WorkflowExecutionService.startExecution(orgAId, workflowAId, userAId, { test: true });
    assert.ok(execution.id);
    assert.strictEqual(execution.status, "SUCCESS");
    executionIdA = execution.id;
  });

  await t.test("TEST 2: Organization B cannot execute Organization A workflow", async () => {
    await assert.rejects(
      WorkflowExecutionService.startExecution(orgBId, workflowAId, userBId),
      /Workflow not found/
    );
  });

  await t.test("TEST 3: Organization B cannot read Organization A execution", async () => {
    await assert.rejects(
      WorkflowExecutionService.getExecution(orgBId, executionIdA, userBId),
      /EXECUTION_NOT_FOUND/
    );
  });

  await t.test("TEST 4: Organization A can read its execution", async () => {
    const execution = await WorkflowExecutionService.getExecution(orgAId, executionIdA, userAId);
    assert.strictEqual(execution.id, executionIdA);
  });

  await t.test("TEST 5: START -> LOG -> END executes successfully", async () => {
    const execution = await WorkflowExecutionService.getExecution(orgAId, executionIdA, userAId);
    assert.strictEqual(execution.status, "SUCCESS");
    assert.ok(execution.nodeResults);
    
    const results = execution.nodeResults as Record<string, any>;
    assert.strictEqual(results["node-1"].success, true);
    assert.strictEqual(results["node-2"].success, true);
    assert.strictEqual(results["node-3"].success, true);
  });

  await t.test("TEST 6: Malformed workflow fails safely", async () => {
    const badWorkflow = await workflowService.create(orgAId, userAId, {
      name: "Bad Workflow",
      nodes: [], // Empty nodes
      edges: [],
    });
    
    await assert.rejects(
      WorkflowExecutionService.startExecution(orgAId, badWorkflow.id, userAId),
      /INVALID_WORKFLOW/
    );
  });

  await t.test("TEST 7: Circular workflow fails with CYCLE_DETECTED", async () => {
    const cycleWorkflow = await workflowService.create(orgAId, userAId, {
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

    const execution = await WorkflowExecutionService.startExecution(orgAId, cycleWorkflow.id, userAId);
    assert.strictEqual(execution.status, "FAILED");
    assert.ok(execution.error?.includes("CYCLE_DETECTED"));
  });

  await t.test("TEST 8: Workflow exceeding 50 steps fails with MAX_STEPS_EXCEEDED", async () => {
    // Construct a long linear workflow to hit the 50 step limit
    const nodes = [{ id: "node-0", type: "START", position: { x: 0, y: 0 }, data: {} }];
    const edges = [];
    
    for (let i = 1; i <= 51; i++) {
      nodes.push({ id: `node-${i}`, type: "LOG", position: { x: 0, y: i * 10 }, data: {} });
      edges.push({ id: `edge-${i}`, source: `node-${i-1}`, target: `node-${i}` });
    }

    const maxStepsWorkflow = await workflowService.create(orgAId, userAId, {
      name: "Max Steps Workflow",
      nodes,
      edges,
    });

    const execution = await WorkflowExecutionService.startExecution(orgAId, maxStepsWorkflow.id, userAId);
    assert.strictEqual(execution.status, "FAILED");
    assert.ok(execution.error?.includes("MAX_STEPS_EXCEEDED"));
  });

  await t.test("TEST 9: Execution stores workflowVersion", async () => {
    const execution = await WorkflowExecutionService.getExecution(orgAId, executionIdA, userAId);
    assert.strictEqual(execution.workflowVersion, 1);
  });

  await t.test("TEST 10: Execution stores immutable definition snapshot", async () => {
    const execution = await WorkflowExecutionService.getExecution(orgAId, executionIdA, userAId);
    const def = execution.definition as any;
    assert.ok(def.nodes);
    assert.ok(def.edges);
    assert.strictEqual(def.nodes.length, 3);
  });

  await t.test("TEST 11: Changing the source workflow after execution creation does not change execution.definition", async () => {
    // Modify the workflow
    await workflowService.update(workflowAId, orgAId, {
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
    const execution = await WorkflowExecutionService.getExecution(orgAId, executionIdA, userAId);
    const def = execution.definition as any;
    
    // Original execution must still have 3 nodes, not 4
    assert.strictEqual(def.nodes.length, 3);
    assert.strictEqual(execution.workflowVersion, 1); // Version shouldn't change for old execution
    
    // DB version should be 2 now
    const workflow = await workflowService.getById(workflowAId, orgAId);
    assert.strictEqual(workflow?.version, 2);
  });

  await t.test("TEST 12: Client-supplied organizationId cannot bypass tenant isolation", async () => {
    // User B tries to inject Org A's ID into the URL params, but their session only resolves to User B
    // In startExecution, the service checks membership for the provided orgId and user ID.
    // If User B provides orgAId, OrganizationService.getMembership(orgAId, userBId) will return null.
    await assert.rejects(
      WorkflowExecutionService.startExecution(orgAId, workflowAId, userBId),
      /FORBIDDEN/
    );
  });
});
