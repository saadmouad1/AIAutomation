"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = exports.dynamic = void 0;
exports.default = ExecutionsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const session_1 = require("@/lib/auth/session");
const navigation_1 = require("next/navigation");
const organization_repository_1 = require("@/repositories/organization.repository");
const db_1 = require("@/lib/db");
const glass_card_1 = require("@/components/ui/glass-card");
const lucide_react_1 = require("lucide-react");
const date_fns_1 = require("date-fns");
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
exports.dynamic = "force-dynamic";
exports.metadata = {
    title: "Executions — Flowra",
    description: "View the execution history of all your automations.",
};
async function ExecutionsPage() {
    const session = await (0, session_1.getSession)();
    if (!session?.user?.id)
        (0, navigation_1.redirect)("/login");
    const orgs = await (0, organization_repository_1.listUserOrganizations)(session.user.id);
    if (orgs.length === 0)
        (0, navigation_1.redirect)("/dashboard");
    const orgId = orgs[0].id;
    const executions = await db_1.db.workflowExecution.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
            workflow: { select: { name: true, id: true } }
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto space-y-8 animate-fade-up pb-20", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-start gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-strong)]", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MonitorPlay, { className: "h-6 w-6 text-[var(--foreground)]" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-[var(--foreground)] tracking-tight", children: "Executions" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[var(--muted)] mt-1.5 text-lg max-w-2xl", children: "A real-time log of everything happening across your automation products." })] })] }), (0, jsx_runtime_1.jsx)(glass_card_1.GlassCard, { className: "p-0 overflow-hidden shadow-sm", children: (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full text-left text-sm", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-[var(--surface-elevated)] text-[var(--muted)] border-b border-[var(--border)]", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "font-medium px-6 py-4", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "font-medium px-6 py-4", children: "Automation" }), (0, jsx_runtime_1.jsx)("th", { className: "font-medium px-6 py-4", children: "Trigger" }), (0, jsx_runtime_1.jsx)("th", { className: "font-medium px-6 py-4", children: "Started" }), (0, jsx_runtime_1.jsx)("th", { className: "font-medium px-6 py-4", children: "Duration" }), (0, jsx_runtime_1.jsx)("th", { className: "font-medium px-6 py-4 text-right", children: "Details" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-[var(--border)] bg-[var(--surface)]", children: executions.length > 0 ? (executions.map((exec) => {
                                    const wfData = exec.definition;
                                    // Look for start node to find trigger info (very simplistic for UI purposes)
                                    const startNode = Array.isArray(wfData?.nodes) ? wfData.nodes.find((n) => n.type === "START") : null;
                                    const triggerName = startNode?.data?.label || "Webhook";
                                    return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-[var(--surface-elevated)]/50 transition-colors", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsx)("span", { className: `inline-flex items-center justify-center text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${exec.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                        exec.status === 'FAILED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                            exec.status === 'RUNNING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 animate-pulse' :
                                                                'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`, children: exec.status }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 font-medium text-[var(--foreground)]", children: exec.workflow?.name || "Deleted Automation" }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-[var(--muted)]", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Webhook, { className: "h-3.5 w-3.5" }), triggerName] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-[var(--muted)]", children: exec.startedAt ? ((0, jsx_runtime_1.jsx)("div", { title: (0, date_fns_1.format)(exec.startedAt, "PPpp"), children: (0, date_fns_1.formatDistanceToNow)(exec.startedAt, { addSuffix: true }) })) : "—" }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-[var(--muted)]", children: exec.completedAt && exec.startedAt ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-3 w-3" }), (exec.completedAt.getTime() - exec.startedAt.getTime()), "ms"] })) : "—" }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-right", children: exec.workflow?.id ? ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "text-xs", asChild: true, children: (0, jsx_runtime_1.jsx)(link_1.default, { href: `/dashboard/automations/${exec.workflow.id}?tab=history`, children: "View" }) })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-[var(--subtle)]", children: "N/A" })) })] }, exec.id));
                                })) : ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsxs)("td", { colSpan: 6, className: "px-6 py-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-elevated)] mb-4", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckSquare, { className: "h-6 w-6 text-[var(--muted)]" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-[var(--foreground)] font-medium mb-1", children: "No executions yet." }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[var(--muted)]", children: "Activate an automation to start seeing history here." })] }) })) })] }) }) })] }));
}
