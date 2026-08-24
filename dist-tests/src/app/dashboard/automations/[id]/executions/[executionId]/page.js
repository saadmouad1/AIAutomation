"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = void 0;
exports.generateMetadata = generateMetadata;
exports.default = ExecutionDetailPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const session_1 = require("@/lib/auth/session");
const navigation_1 = require("next/navigation");
const organization_repository_1 = require("@/repositories/organization.repository");
const workflow_service_1 = require("@/services/workflow.service");
const workflow_execution_service_1 = require("@/services/workflow-execution.service");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const status_indicator_1 = require("@/components/ui/status-indicator");
exports.dynamic = "force-dynamic";
async function generateMetadata({ params }) {
    const { executionId } = await params;
    return { title: `Execution ${executionId.split('-')[0]} — Flowra` };
}
const nodeIcons = {
    START: lucide_react_1.Play,
    END: lucide_react_1.CheckSquare,
    LOG: lucide_react_1.Terminal,
    SET_VALUE: lucide_react_1.Variable,
    TRANSFORM: lucide_react_1.Type,
    CONDITION: lucide_react_1.Split,
    HTTP_REQUEST: lucide_react_1.Globe,
    AI_GENERATE: lucide_react_1.Sparkles,
};
async function ExecutionDetailPage({ params }) {
    const { id, executionId } = await params;
    const session = await (0, session_1.getSession)();
    if (!session?.user?.id)
        (0, navigation_1.redirect)("/login");
    const orgs = await (0, organization_repository_1.listUserOrganizations)(session.user.id);
    if (orgs.length === 0)
        (0, navigation_1.redirect)("/dashboard");
    const orgId = orgs[0].id;
    let workflow;
    let execution;
    try {
        workflow = await workflow_service_1.workflowService.getById(id, orgId);
        execution = await workflow_execution_service_1.WorkflowExecutionService.getExecution(orgId, executionId, session.user.id);
    }
    catch {
        (0, navigation_1.notFound)();
    }
    const getStatusType = (status) => {
        switch (status) {
            case "SUCCESS": return "active";
            case "FAILED": return "error";
            case "RUNNING": return "pending";
            case "PENDING": return "pending";
            default: return "draft";
        }
    };
    const startedAt = execution.startedAt ? new Date(execution.startedAt) : new Date();
    const completedAt = execution.completedAt ? new Date(execution.completedAt) : null;
    const duration = completedAt ? Math.max(0, completedAt.getTime() - startedAt.getTime()) : null;
    // We need to render the execution timeline based on the nodes that were executed.
    // execution.nodeResults is a Record<nodeId, { status, startedAt, completedAt, error, output }>
    // We can also extract the sequence if possible, or just sort them by startedAt.
    const nodeResultsArray = Object.entries(execution.nodeResults || {}).map(([nodeId, result]) => {
        // Find the original node to get its type and name
        const definition = execution.definition;
        const originalNode = definition?.nodes?.find((n) => n.id === nodeId);
        return {
            nodeId,
            type: originalNode?.type || "UNKNOWN",
            title: originalNode?.data?.title || originalNode?.type || "Unknown Node",
            ...result,
            startedAtTime: new Date(result.startedAt).getTime()
        };
    }).sort((a, b) => a.startedAtTime - b.startedAtTime);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto space-y-8 animate-fade-up", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: `/dashboard/automations/${id}`, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon_sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-4 w-4" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-1", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl font-bold text-text-primary", children: "Execution Detail" }), (0, jsx_runtime_1.jsx)(status_indicator_1.StatusIndicator, { status: getStatusType(execution.status) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-text-muted flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Workflow: ", workflow.name] }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "text-[10px]", children: ["v", execution.workflowVersion] }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono text-xs", children: execution.id })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-surface p-4 rounded-xl border border-surface-border", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-text-muted mb-1 uppercase tracking-wider", children: "Started" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-text-primary", children: startedAt.toLocaleString() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-surface p-4 rounded-xl border border-surface-border", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-text-muted mb-1 uppercase tracking-wider", children: "Completed" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-text-primary", children: completedAt ? completedAt.toLocaleString() : "-" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-surface p-4 rounded-xl border border-surface-border", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-text-muted mb-1 uppercase tracking-wider", children: "Duration" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-text-primary", children: duration !== null ? `${duration}ms` : "-" })] })] }), execution.error && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-error/10 border border-error/20 p-4 rounded-xl", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-sm font-semibold text-error flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4" }), " Execution Failed"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-error/90 mt-1", children: execution.error })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-bold text-text-primary mb-4", children: "Execution Timeline" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: nodeResultsArray.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center p-8 border border-dashed border-surface-border rounded-xl", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-text-muted", children: "No nodes executed." }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-border before:to-transparent", children: nodeResultsArray.map((result, index) => {
                                const Icon = nodeIcons[result.type] || lucide_react_1.Play;
                                const nodeDuration = result.completedAt ? Math.max(0, new Date(result.completedAt).getTime() - result.startedAtTime) : 0;
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-surface-elevated text-text-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10", children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-surface-border bg-surface shadow-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-sm text-text-primary", children: result.title }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-medium text-text-muted uppercase tracking-wider", children: result.type })] }), result.status === "SUCCESS" && (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "h-4 w-4 text-success" }), result.status === "FAILED" && (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4 text-error" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-4 text-xs text-text-muted mt-2", children: (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-3 w-3" }), " ", nodeDuration, "ms"] }) }), result.error && ((0, jsx_runtime_1.jsx)("div", { className: "mt-3 p-2 bg-error/10 text-error text-xs rounded border border-error/20", children: result.error }))] })] }, result.nodeId));
                            }) })) })] })] }));
}
