"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyState = EmptyState;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_1 = require("@/lib/utils");
const button_1 = require("./button");
function EmptyState({ icon: Icon, title, description, action, className }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("flex flex-col items-center justify-center text-center py-16 px-8", "rounded-[var(--radius-xl)] border border-dashed border-[var(--border-strong)]", className), children: [Icon && ((0, jsx_runtime_1.jsx)("div", { className: "flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)] mb-4", children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-6 w-6 text-[var(--brand)]" }) })), (0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-[var(--foreground)] mb-1", children: title }), description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[var(--muted)] max-w-sm leading-relaxed mb-5", children: description })), action && ((0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", asChild: !!action.href, children: action.href ? ((0, jsx_runtime_1.jsx)("a", { href: action.href, children: action.label })) : ((0, jsx_runtime_1.jsx)("button", { onClick: action.onClick, children: action.label })) }))] }));
}
