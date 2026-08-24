"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badgeVariants = void 0;
exports.Badge = Badge;
const jsx_runtime_1 = require("react/jsx-runtime");
const class_variance_authority_1 = require("class-variance-authority");
const utils_1 = require("@/lib/utils");
const badgeVariants = (0, class_variance_authority_1.cva)("inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-0.5 text-xs font-medium border transition-colors", {
    variants: {
        variant: {
            default: "bg-[var(--surface-elevated)] text-[var(--foreground)] border-[var(--border-strong)]",
            brand: "bg-[var(--brand-light)] text-[var(--brand)] border-[var(--brand-border)]",
            success: "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success-bg)]",
            warning: "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning-bg)]",
            error: "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error-bg)]",
            info: "bg-[var(--info-bg)] text-[var(--info)] border-[var(--info-bg)]",
            outline: "bg-transparent text-[var(--muted)] border-[var(--border-strong)]",
        },
    },
    defaultVariants: { variant: "default" },
});
exports.badgeVariants = badgeVariants;
function Badge({ className, variant, ...props }) {
    return (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)(badgeVariants({ variant }), className), ...props });
}
