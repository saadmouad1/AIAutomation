"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = LeadsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const crm_1 = require("../../../lib/mock/crm");
const kanban_board_1 = require("../../../components/crm/kanban-board");
const lucide_react_1 = require("lucide-react");
exports.metadata = {
    title: "Leads Pipeline — AURIVO",
    description: "Track and manage your leads pipeline in AURIVO.",
};
async function LeadsPage() {
    const leads = await (0, crm_1.getMockLeads)();
    const totalValue = leads.reduce((acc, l) => acc + (l.value ?? 0), 0);
    const wonLeads = leads.filter((l) => l.status === "WON");
    const wonValue = wonLeads.reduce((acc, l) => acc + (l.value ?? 0), 0);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-6 h-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between shrink-0", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-5 w-5 text-brand" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-text-primary", children: "Leads Pipeline" })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-text-muted", children: [leads.length, " lead", leads.length !== 1 ? "s" : "", " tracked across all stages"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-text-muted text-xs mb-0.5", children: "Total Pipeline" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 font-semibold text-text-primary", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-4 w-4 text-brand" }), totalValue.toLocaleString()] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-text-muted text-xs mb-0.5", children: "Won" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 font-semibold text-success", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-4 w-4" }), wonValue.toLocaleString()] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-hidden", children: (0, jsx_runtime_1.jsx)(kanban_board_1.KanbanBoard, { leads: leads }) })] }));
}
