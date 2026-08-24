"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationCard = AutomationCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const status_indicator_1 = require("@/components/ui/status-indicator");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
function AutomationCard({ workflow }) {
    const statusMap = {
        ACTIVE: "active",
        PAUSED: "paused",
        DRAFT: "draft",
    };
    const updatedAt = new Date(workflow.updatedAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "group flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 hover:border-[var(--border-strong)] transition-all duration-150", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-light)]", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Webhook, { className: "h-4 w-4 text-[var(--brand)]" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: `/dashboard/automations/${workflow.id}`, className: "text-sm font-semibold text-[var(--foreground)] hover:text-[var(--brand)] transition-colors truncate block", children: workflow.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-[var(--muted)] truncate", children: workflow.description ?? "No description" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "hidden md:flex items-center gap-6 text-xs text-[var(--muted)] shrink-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-[var(--foreground)]", children: workflow._count.nodes }), (0, jsx_runtime_1.jsx)("p", { children: "nodes" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("p", { className: "font-semibold text-[var(--foreground)]", children: ["v", workflow.version] }), (0, jsx_runtime_1.jsx)("p", { children: "version" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-[var(--foreground)]", children: updatedAt }), (0, jsx_runtime_1.jsx)("p", { children: "updated" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 shrink-0", children: [(0, jsx_runtime_1.jsx)(status_indicator_1.StatusIndicator, { status: statusMap[workflow.status] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon_sm", "aria-label": "Open workflow", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "h-3.5 w-3.5" }) })] })] }));
}
