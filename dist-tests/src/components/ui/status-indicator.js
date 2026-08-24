"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusIndicator = StatusIndicator;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_1 = require("@/lib/utils");
const STATUS_STYLES = {
    active: { dot: "bg-[var(--success)]", label: "Active", text: "text-[var(--success)]" },
    paused: { dot: "bg-[var(--warning)]", label: "Paused", text: "text-[var(--warning)]" },
    error: { dot: "bg-[var(--error)]", label: "Error", text: "text-[var(--error)]" },
    pending: { dot: "bg-[var(--info)]", label: "Pending", text: "text-[var(--info)]" },
    draft: { dot: "bg-[var(--muted)]", label: "Draft", text: "text-[var(--muted)]" },
};
function StatusIndicator({ status, showLabel = true, className }) {
    const s = STATUS_STYLES[status];
    return ((0, jsx_runtime_1.jsxs)("span", { className: (0, utils_1.cn)("inline-flex items-center gap-1.5", className), children: [(0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("h-1.5 w-1.5 rounded-full shrink-0", s.dot, status === "active" && "animate-pulse shadow-[0_0_6px_var(--success)]") }), showLabel && (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("text-xs font-medium", s.text), children: s.label })] }));
}
