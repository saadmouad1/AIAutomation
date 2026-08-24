"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = DashboardLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const session_1 = require("@/lib/auth/session");
const sidebar_1 = require("@/components/layout/sidebar");
const top_nav_1 = require("@/components/layout/top-nav");
exports.metadata = {
    title: "Dashboard — Flowra",
    description: "Manage your business automation with Flowra.",
};
async function DashboardLayout({ children }) {
    const session = await (0, session_1.getSession)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]", children: [(0, jsx_runtime_1.jsx)(sidebar_1.Sidebar, { user: session?.user }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-1 flex-col overflow-hidden min-w-0", children: [(0, jsx_runtime_1.jsx)(top_nav_1.TopNav, {}), (0, jsx_runtime_1.jsx)("main", { className: "flex-1 overflow-y-auto p-6 bg-[var(--background)]", children: children })] })] }));
}
