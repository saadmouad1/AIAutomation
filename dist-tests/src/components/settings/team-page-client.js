"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamPageClient = TeamPageClient;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const utils_1 = require("@/lib/utils");
const ROLE_CONFIG = {
    OWNER: { label: "Owner", icon: lucide_react_1.Crown, color: "text-amber-500" },
    ADMIN: { label: "Admin", icon: lucide_react_1.Shield, color: "text-blue-500" },
    MEMBER: { label: "Member", icon: lucide_react_1.User, color: "text-[var(--muted)]" },
};
function RoleBadge({ role }) {
    const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.MEMBER;
    const Icon = config.icon;
    return ((0, jsx_runtime_1.jsxs)("span", { className: (0, utils_1.cn)("flex items-center gap-1 text-xs font-medium", config.color), children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-3.5 w-3.5" }), config.label] }));
}
function MemberAvatar({ user }) {
    const initials = (user.name ?? user.email ?? "?")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return ((0, jsx_runtime_1.jsx)("div", { className: "h-9 w-9 rounded-full bg-[var(--brand-light)] border border-[var(--brand)]/20 flex items-center justify-center text-xs font-semibold text-[var(--brand)] flex-shrink-0", children: initials }));
}
function TeamPageClient({ currentUserId, currentUserRole, organization, members, }) {
    const canManage = currentUserRole === "OWNER" || currentUserRole === "ADMIN";
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-3xl mx-auto space-y-6 animate-fade-up", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-0.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-5 w-5 text-[var(--brand)]" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-[var(--foreground)]", children: "Team" })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-[var(--muted)]", children: ["Manage members of ", (0, jsx_runtime_1.jsx)("strong", { children: organization.name })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "divide-y divide-[var(--border)]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "px-5 py-3 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-semibold text-[var(--muted)] uppercase tracking-wider", children: [members.length, " member", members.length !== 1 ? "s" : ""] }), canManage && ((0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: "outline", className: "gap-1.5 text-xs", disabled: true, title: "Email invitations \u2014 coming soon", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserPlus, { className: "h-3.5 w-3.5" }), "Invite member", (0, jsx_runtime_1.jsx)("span", { className: "ml-1 text-[10px] opacity-60", children: "(coming soon)" })] }))] }), members.map((member) => {
                        const isCurrentUser = member.userId === currentUserId;
                        return ((0, jsx_runtime_1.jsxs)("div", { className: "px-5 py-4 flex items-center gap-4 hover:bg-[var(--surface-hover)] transition-colors", children: [(0, jsx_runtime_1.jsx)(MemberAvatar, { user: member.user }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-[var(--foreground)] truncate", children: member.user.name ?? "(No name)" }), isCurrentUser && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-[10px] py-0 px-1.5", children: "You" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-xs text-[var(--muted)] mt-0.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-3 w-3" }), member.user.email] })] }), (0, jsx_runtime_1.jsx)(RoleBadge, { role: member.role })] }, member.userId));
                    })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm text-[var(--muted)] space-y-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-[var(--foreground)]", children: "Member management" }), (0, jsx_runtime_1.jsx)("p", { children: "Role changes and email-based invitations will be available in the next release. For now, members can be added programmatically via the API." })] })] }));
}
