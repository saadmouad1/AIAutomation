"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowStepCard = WorkflowStepCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_1 = require("@/lib/utils");
const lucide_react_1 = require("lucide-react");
const STEP_STYLES = {
    trigger: { bg: "bg-[var(--brand-light)]", border: "border-[var(--brand-border)]", text: "text-[var(--brand)]", icon: lucide_react_1.Zap },
    action: { bg: "bg-[var(--surface-elevated)]", border: "border-[var(--border-strong)]", text: "text-[var(--foreground)]", icon: lucide_react_1.CheckCircle2 },
    condition: { bg: "bg-[var(--warning-bg)]", border: "border-[var(--warning)]/30", text: "text-[var(--warning)]", icon: lucide_react_1.GitFork },
};
function WorkflowStepCard({ step, isLast }) {
    const style = STEP_STYLES[step.type];
    const Icon = style.icon;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("w-full max-w-sm rounded-[var(--radius-lg)] border p-4 flex items-center gap-3", style.bg, style.border), children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)]", style.bg, style.border, "border"), children: (0, jsx_runtime_1.jsx)(Icon, { className: (0, utils_1.cn)("h-4 w-4", style.text) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: (0, utils_1.cn)("text-sm font-semibold leading-tight", style.text), children: step.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-[var(--muted)] mt-0.5 truncate", children: step.description })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] shrink-0", children: step.type })] }), !isLast && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center my-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-px h-3 bg-[var(--border-strong)]" }), (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowDown, { className: "h-3 w-3 text-[var(--subtle)]" }), (0, jsx_runtime_1.jsx)("div", { className: "w-px h-3 bg-[var(--border-strong)]" })] }))] }));
}
