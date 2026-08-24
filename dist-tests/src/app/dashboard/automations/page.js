"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = exports.metadata = void 0;
exports.default = AutomationsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const session_1 = require("@/lib/auth/session");
const navigation_1 = require("next/navigation");
const organization_repository_1 = require("@/repositories/organization.repository");
const workflow_service_1 = require("@/services/workflow.service");
const automation_card_1 = require("@/components/automations/automation-card");
const empty_state_1 = require("@/components/ui/empty-state");
const button_1 = require("@/components/ui/button");
const stat_card_1 = require("@/components/ui/stat-card");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
exports.metadata = { title: "Automations — Flowra" };
exports.dynamic = "force-dynamic";
async function AutomationsPage() {
    const session = await (0, session_1.getSession)();
    if (!session?.user?.id)
        (0, navigation_1.redirect)("/login");
    // Resolve the user's primary organization
    const orgs = await (0, organization_repository_1.listUserOrganizations)(session.user.id);
    if (orgs.length === 0)
        (0, navigation_1.redirect)("/dashboard");
    const orgId = orgs[0].id;
    const workflows = (await workflow_service_1.workflowService.list(orgId));
    const active = workflows.filter((w) => w.status === "ACTIVE").length;
    const draft = workflows.filter((w) => w.status === "DRAFT").length;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-5xl mx-auto space-y-6 animate-fade-up", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-0.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Webhook, { className: "h-5 w-5 text-[var(--brand)]" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-[var(--foreground)]", children: "Automations" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[var(--muted)]", children: "Workflows that run your business" })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { asChild: true, children: (0, jsx_runtime_1.jsxs)(link_1.default, { href: `/dashboard/automations/new?orgId=${orgId}`, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }), " New workflow"] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsx)(stat_card_1.StatCard, { title: "Active", value: active, icon: lucide_react_1.Zap }), (0, jsx_runtime_1.jsx)(stat_card_1.StatCard, { title: "Draft", value: draft, icon: lucide_react_1.Webhook }), (0, jsx_runtime_1.jsx)(stat_card_1.StatCard, { title: "Total", value: workflows.length, icon: lucide_react_1.Webhook })] }), workflows.length === 0 ? ((0, jsx_runtime_1.jsx)(empty_state_1.EmptyState, { icon: lucide_react_1.Webhook, title: "No workflows yet", description: "Create your first workflow and let Flowra handle the repetitive work.", action: { label: "Create workflow", href: `/dashboard/automations/new?orgId=${orgId}` } })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: workflows.map((wf) => ((0, jsx_runtime_1.jsx)(automation_card_1.AutomationCard, { workflow: wf }, wf.id))) }))] }));
}
