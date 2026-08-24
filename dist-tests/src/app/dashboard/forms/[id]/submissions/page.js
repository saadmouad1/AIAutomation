"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMetadata = generateMetadata;
exports.default = SubmissionsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const forms_1 = require("@/lib/mock/forms");
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const empty_state_1 = require("@/components/ui/empty-state");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
async function generateMetadata({ params }) {
    const { id } = await params;
    const form = await (0, forms_1.getMockForm)(id);
    return { title: form ? `${form.title} · Submissions — Flowra` : "Not Found" };
}
async function SubmissionsPage({ params }) {
    const { id } = await params;
    const [form, submissions] = await Promise.all([(0, forms_1.getMockForm)(id), (0, forms_1.getMockSubmissions)(id)]);
    if (!form)
        (0, navigation_1.notFound)();
    const headers = form.fields.map(f => f.label);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-5xl mx-auto space-y-6 animate-fade-up", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: `/dashboard/forms/${form.id}`, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon_sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-4 w-4" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-xl font-bold text-[var(--foreground)]", children: [form.title, " \u2014 Responses"] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-[var(--muted)]", children: [submissions.length, " submission", submissions.length !== 1 ? "s" : ""] })] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "secondary", size: "sm", children: "Export CSV" })] }), submissions.length === 0 ? ((0, jsx_runtime_1.jsx)(empty_state_1.EmptyState, { icon: lucide_react_1.Inbox, title: "No submissions yet", description: "Once people submit this form, their responses will appear here." })) : ((0, jsx_runtime_1.jsx)("div", { className: "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full text-sm", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-[var(--border)] bg-[var(--surface-elevated)]", children: [(0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide", children: "#" }), headers.map(h => ((0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide", children: h }, h))), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide", children: "Submitted" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-[var(--border)]", children: submissions.map((sub, i) => ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-[var(--surface-elevated)] transition-colors", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 text-[var(--muted)]", children: i + 1 }), headers.map(h => ((0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 text-[var(--foreground)] max-w-[200px] truncate", children: sub.data[h] ?? "—" }, h))), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 text-[var(--muted)] whitespace-nowrap", children: new Date(sub.createdAt).toLocaleDateString() })] }, sub.id))) })] }) }))] }));
}
