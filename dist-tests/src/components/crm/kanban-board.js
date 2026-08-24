"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanBoard = KanbanBoard;
const jsx_runtime_1 = require("react/jsx-runtime");
const crm_1 = require("@/lib/mock/crm");
const badge_1 = require("@/components/ui/badge");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const COLUMNS = [
    { status: "NEW", label: "New", color: "bg-surface-elevated border border-surface-border" },
    { status: "CONTACTED", label: "Contacted", color: "bg-surface-elevated border border-surface-border" },
    { status: "QUALIFIED", label: "Qualified", color: "bg-surface-elevated border border-surface-border" },
    { status: "WON", label: "Won", color: "bg-success-bg border border-success/20" },
    { status: "LOST", label: "Lost", color: "bg-error-bg border border-error/20" },
];
const STATUS_BADGE = {
    NEW: { label: "New", class: "bg-surface-border text-text-muted border-surface-border" },
    CONTACTED: { label: "Contacted", class: "bg-brand/10 text-brand border-brand/20" },
    QUALIFIED: { label: "Qualified", class: "bg-warning-bg text-warning border-warning/20" },
    WON: { label: "Won", class: "bg-success-bg text-success border-success/20" },
    LOST: { label: "Lost", class: "bg-error-bg text-error border-error/20" },
};
function LeadCard({ lead }) {
    const contact = crm_1.MOCK_CONTACTS.find((c) => c.id === lead.contactId);
    const badge = STATUS_BADGE[lead.status];
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-4 bg-surface border-surface-border hover:border-brand/40 transition-all cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-2 mb-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-text-primary leading-snug", children: lead.title }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: `text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${badge.class}`, children: badge.label })] }), contact && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 text-xs text-text-muted mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserCircle2, { className: "h-3.5 w-3.5 shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: contact.name }), contact.company && (0, jsx_runtime_1.jsxs)("span", { children: ["\u00B7 ", contact.company] })] })), lead.value != null && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-xs font-semibold text-success", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-3.5 w-3.5" }), (0, jsx_runtime_1.jsx)("span", { children: lead.value.toLocaleString() })] }))] }));
}
function KanbanBoard({ leads }) {
    const columnTotals = (status) => leads.filter(l => l.status === status).reduce((acc, l) => acc + (l.value ?? 0), 0);
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex gap-4 overflow-x-auto pb-6 h-full", children: COLUMNS.map(col => {
            const colLeads = leads.filter(l => l.status === col.status);
            const total = columnTotals(col.status);
            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col w-72 shrink-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3 px-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-semibold text-text-primary", children: col.label }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs bg-surface-elevated text-text-muted px-2 py-0.5 rounded-full border border-surface-border", children: colLeads.length })] }), total > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-text-muted", children: ["$", total.toLocaleString()] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: `flex-1 rounded-xl p-3 space-y-3 min-h-[200px] ${col.color}`, children: [colLeads.map(lead => ((0, jsx_runtime_1.jsx)(LeadCard, { lead: lead }, lead.id))), colLeads.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-20 text-xs text-text-subtle", children: "No leads here" }))] })] }, col.status));
        }) }));
}
