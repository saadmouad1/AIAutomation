"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = void 0;
exports.generateMetadata = generateMetadata;
exports.default = AutomationDetailPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const session_1 = require("@/lib/auth/session");
const navigation_1 = require("next/navigation");
const organization_repository_1 = require("@/repositories/organization.repository");
const workflow_service_1 = require("@/services/workflow.service");
const workflow_canvas_1 = require("@/components/automations/workflow-canvas");
const status_indicator_1 = require("@/components/ui/status-indicator");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const workflow_status_controls_1 = require("@/components/automations/workflow-status-controls");
const webhook_url_card_1 = require("@/components/automations/webhook-url-card");
const execution_history_1 = require("@/components/automations/execution-history");
const tabs_1 = require("@/components/ui/tabs");
exports.dynamic = "force-dynamic";
async function generateMetadata({ params }) {
    const { id } = await params;
    return { title: `Workflow ${id} — Flowra` };
}
async function AutomationDetailPage({ params }) {
    const { id } = await params;
    const session = await (0, session_1.getSession)();
    if (!session?.user?.id)
        (0, navigation_1.redirect)("/login");
    const orgs = await (0, organization_repository_1.listUserOrganizations)(session.user.id);
    if (orgs.length === 0)
        (0, navigation_1.redirect)("/dashboard");
    const orgId = orgs[0].id;
    let workflow;
    try {
        workflow = await workflow_service_1.workflowService.getById(id, orgId);
    }
    catch {
        (0, navigation_1.notFound)();
    }
    const statusMap = {
        ACTIVE: "active",
        PAUSED: "paused",
        DRAFT: "draft",
    };
    // Reconstruct React Flow nodes from DB records
    const initialNodes = workflow.nodes.map((n) => ({
        id: n.nodeId,
        type: n.type,
        position: { x: n.positionX, y: n.positionY },
        data: n.data,
    }));
    // Reconstruct React Flow edges from DB records
    const initialEdges = workflow.edges.map((e) => ({
        id: e.edgeId,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? undefined,
        targetHandle: e.targetHandle ?? undefined,
        animated: true,
        style: { stroke: "rgba(99,91,255,0.5)", strokeWidth: 2 },
    }));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "mx-auto space-y-6 animate-fade-up max-w-[1400px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/dashboard/automations", children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon_sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-4 w-4" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-1", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl font-bold text-text-primary", children: workflow.name }), (0, jsx_runtime_1.jsx)(status_indicator_1.StatusIndicator, { status: statusMap[workflow.status] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "text-[10px]", children: ["v", workflow.version] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-text-muted", children: workflow.description ?? "No description" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mt-2 text-xs text-text-muted", children: [(0, jsx_runtime_1.jsxs)("span", { children: [workflow.nodes.length, " nodes"] }), (0, jsx_runtime_1.jsxs)("span", { children: [workflow.edges.length, " edges"] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Updated ", new Date(workflow.updatedAt).toLocaleDateString()] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 shrink-0", children: [(0, jsx_runtime_1.jsx)(workflow_status_controls_1.WorkflowStatusControls, { orgId: orgId, workflowId: workflow.id, currentStatus: workflow.status }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings2, { className: "h-4 w-4" }) })] })] }), (0, jsx_runtime_1.jsx)(webhook_url_card_1.WebhookUrlCard, { workflowId: workflow.id, isActive: workflow.status === "ACTIVE" }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "builder", className: "w-full", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "builder", children: "Builder" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "history", children: "Execution History" })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsContent, { value: "builder", className: "mt-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "hidden lg:block", children: (0, jsx_runtime_1.jsx)(workflow_canvas_1.WorkflowCanvas, { workflowId: workflow.id, orgId: orgId, initialNodes: initialNodes, initialEdges: initialEdges }) }), (0, jsx_runtime_1.jsx)("div", { className: "lg:hidden p-8 border border-dashed border-surface-border rounded-xl text-center", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-text-muted", children: "Workflow Builder is optimized for desktop. Please open this page on a larger screen to build and edit workflows." }) })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "history", className: "mt-4", children: (0, jsx_runtime_1.jsx)(execution_history_1.ExecutionHistory, { orgId: orgId, workflowId: workflow.id }) })] })] }));
}
