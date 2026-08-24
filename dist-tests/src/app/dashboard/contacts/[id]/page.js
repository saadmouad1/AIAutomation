"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMetadata = generateMetadata;
exports.default = ContactDetailPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
const crm_1 = require("../../../../lib/mock/crm");
const badge_1 = require("../../../../components/ui/badge");
const card_1 = require("../../../../components/ui/card");
const lucide_react_1 = require("lucide-react");
const ACTIVITY_ICON = {
    NOTE: lucide_react_1.StickyNote,
    EMAIL: lucide_react_1.Mail,
    CALL: lucide_react_1.PhoneCall,
    MEETING: lucide_react_1.CalendarDays,
};
const STATUS_BADGE = {
    NEW: { label: "New", class: "bg-surface-border text-text-muted" },
    CONTACTED: { label: "Contacted", class: "bg-brand/10 text-brand" },
    QUALIFIED: { label: "Qualified", class: "bg-warning-bg text-warning" },
    WON: { label: "Won", class: "bg-success-bg text-success" },
    LOST: { label: "Lost", class: "bg-error-bg text-error" },
};
async function generateMetadata({ params }) {
    const { id } = await params;
    const contact = await (0, crm_1.getMockContact)(id);
    return {
        title: contact ? `${contact.name} — AURIVO` : "Contact Not Found",
    };
}
async function ContactDetailPage({ params, }) {
    const { id } = await params;
    const [contact, leads, activities] = await Promise.all([
        (0, crm_1.getMockContact)(id),
        (0, crm_1.getMockContactLeads)(id),
        (0, crm_1.getMockContactActivities)(id),
    ]);
    if (!contact)
        (0, navigation_1.notFound)();
    const initials = contact.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-8 max-w-5xl", children: [(0, jsx_runtime_1.jsxs)(link_1.default, { href: "/dashboard/contacts", className: "inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-4 w-4" }), "Back to Contacts"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand text-xl font-bold border border-brand/20", children: initials }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-text-primary", children: contact.name }), contact.company && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 mt-1 text-sm text-text-muted", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building2, { className: "h-3.5 w-3.5" }), (0, jsx_runtime_1.jsx)("span", { children: contact.company })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-1 flex flex-col gap-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-5 bg-surface border-surface-border space-y-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-text-primary", children: "Contact Details" }), contact.email && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2.5 text-sm text-text-muted", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-4 w-4 shrink-0 text-brand/60" }), (0, jsx_runtime_1.jsx)("span", { children: contact.email })] })), contact.phone && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2.5 text-sm text-text-muted", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-4 w-4 shrink-0 text-brand/60" }), (0, jsx_runtime_1.jsx)("span", { children: contact.phone })] })), contact.company && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2.5 text-sm text-text-muted", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building2, { className: "h-4 w-4 shrink-0 text-brand/60" }), (0, jsx_runtime_1.jsx)("span", { children: contact.company })] }))] }), leads.length > 0 && ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-5 bg-surface border-surface-border space-y-3", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-text-primary", children: "Deals" }), leads.map((lead) => {
                                        const badge = STATUS_BADGE[lead.status];
                                        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-text-primary", children: lead.title }), lead.value != null && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-0.5 text-xs text-success mt-0.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-3 w-3" }), lead.value.toLocaleString()] }))] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: `text-[10px] px-2 py-0.5 rounded-full border-0 shrink-0 ${badge.class}`, children: badge.label })] }, lead.id));
                                    })] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-2", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-5 bg-surface border-surface-border", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-text-primary mb-4", children: "Activity" }), activities.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-text-muted text-center py-8", children: "No activity recorded yet." })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: activities.map((act) => {
                                        const Icon = ACTIVITY_ICON[act.type] ?? lucide_react_1.StickyNote;
                                        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated border border-surface-border text-text-muted", children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-text-primary", children: act.content }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-text-subtle mt-0.5", children: [act.type.charAt(0) + act.type.slice(1).toLowerCase(), " \u00B7", " ", new Date(act.createdAt).toLocaleDateString("en-US", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                })] })] })] }, act.id));
                                    }) }))] }) })] })] }));
}
