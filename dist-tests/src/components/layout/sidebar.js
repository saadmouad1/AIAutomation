"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = Sidebar;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const command_menu_1 = require("@/components/ui/command-menu");
const logo_1 = require("@/components/brand/logo");
/* ── Nav structure ─────────────────────────────────── */
const NAV_MAIN = [
    { name: "Overview", href: "/dashboard", icon: lucide_react_1.LayoutDashboard },
    { name: "Automations", href: "/dashboard/automations", icon: lucide_react_1.Webhook },
    { name: "Templates", href: "/dashboard/templates", icon: lucide_react_1.Zap },
    { name: "Executions", href: "/dashboard/executions", icon: lucide_react_1.CheckSquare },
    { name: "Integrations", href: "/dashboard/integrations", icon: lucide_react_1.Plug },
];
const NAV_BOTTOM = [
    { name: "Settings", href: "/dashboard/settings", icon: lucide_react_1.Settings },
    { name: "Help", href: "/dashboard/help", icon: lucide_react_1.HelpCircle },
];
function NavItem({ item, active }) {
    return ((0, jsx_runtime_1.jsxs)(link_1.default, { href: item.href, className: (0, utils_1.cn)("group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-all duration-150", active
            ? "bg-[var(--brand-light)] text-[var(--brand)]"
            : "text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"), children: [(0, jsx_runtime_1.jsx)(item.icon, { className: (0, utils_1.cn)("h-4 w-4 shrink-0 transition-colors", active ? "text-[var(--brand)]" : "text-[var(--muted)] group-hover:text-[var(--foreground)]") }), item.name] }));
}
/* ── Sidebar ────────────────────────────────────────── */
function Sidebar({ user }) {
    const pathname = (0, navigation_1.usePathname)();
    const [cmdOpen, setCmdOpen] = React.useState(false);
    // Ctrl+K shortcut
    React.useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCmdOpen(true);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);
    function isActive(href) {
        if (href === "/dashboard")
            return pathname === "/dashboard";
        return pathname.startsWith(href);
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("aside", { className: "flex h-full w-[var(--sidebar-width,256px)] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/dashboard", className: "px-4 py-5 mb-1 block hover:opacity-90 transition-opacity", children: (0, jsx_runtime_1.jsx)(logo_1.Logo, {}) }), (0, jsx_runtime_1.jsx)("div", { className: "px-3 mb-2", children: (0, jsx_runtime_1.jsxs)("button", { onClick: () => setCmdOpen(true), className: "flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--muted)] bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all duration-150", children: [(0, jsx_runtime_1.jsx)("svg", { className: "h-3.5 w-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" }) }), (0, jsx_runtime_1.jsx)("span", { className: "flex-1 text-left text-xs", children: "Search..." }), (0, jsx_runtime_1.jsx)("kbd", { className: "hidden sm:flex h-4 items-center rounded border border-[var(--border-strong)] px-1 text-[9px] font-mono", children: "\u2318K" })] }) }), (0, jsx_runtime_1.jsx)("nav", { className: "flex-1 px-3 py-1 space-y-0.5 overflow-y-auto", children: NAV_MAIN.map((item) => ((0, jsx_runtime_1.jsx)(NavItem, { item: item, active: isActive(item.href) }, item.href))) }), (0, jsx_runtime_1.jsx)("div", { className: "mx-4 border-t border-[var(--border)] my-2" }), (0, jsx_runtime_1.jsx)("nav", { className: "px-3 pb-2 space-y-0.5", children: NAV_BOTTOM.map((item) => ((0, jsx_runtime_1.jsx)(NavItem, { item: item, active: isActive(item.href) }, item.href))) }), (0, jsx_runtime_1.jsxs)("div", { className: "mx-3 mb-3 flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 bg-[var(--surface-elevated)] border border-[var(--border)]", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-white text-xs font-bold uppercase", children: user?.name?.[0] || user?.email?.[0] || "U" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium text-[var(--foreground)] truncate", children: user?.name || "User" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-[var(--muted)] truncate", children: user?.email || "" })] })] })] }), (0, jsx_runtime_1.jsx)(command_menu_1.CommandMenu, { open: cmdOpen, onOpenChange: setCmdOpen })] }));
}
