"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatCard = StatCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_1 = require("@/lib/utils");
const lucide_react_1 = require("lucide-react");
function StatCard({ title, value, trend, icon: Icon, className }) {
    const positive = trend && trend.value > 0;
    const negative = trend && trend.value < 0;
    const neutral = trend && trend.value === 0;
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] p-5", "hover:border-[var(--border-strong)] transition-all duration-150", className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium text-[var(--muted)] uppercase tracking-wide", children: title }), Icon && ((0, jsx_runtime_1.jsx)("div", { className: "flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-light)]", children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4 text-[var(--brand)]" }) }))] }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-[var(--foreground)] tabular-nums", children: value }), trend && ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("flex items-center gap-1 mt-2 text-xs font-medium", positive && "text-[var(--success)]", negative && "text-[var(--error)]", neutral && "text-[var(--muted)]"), children: [positive && (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-3 w-3" }), negative && (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "h-3 w-3" }), neutral && (0, jsx_runtime_1.jsx)(lucide_react_1.Minus, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsxs)("span", { children: [positive && "+", trend.value, "%", trend.label ? ` ${trend.label}` : " this week"] })] }))] }));
}
