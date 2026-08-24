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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandMenu = CommandMenu;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cmdk_1 = require("cmdk");
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const next_themes_1 = require("next-themes");
const utils_1 = require("@/lib/utils");
const COMMANDS = [
    { group: "Navigate", icon: lucide_react_1.LayoutDashboard, label: "Go to Dashboard", href: "/dashboard" },
    { group: "Navigate", icon: lucide_react_1.Webhook, label: "Go to Automations", href: "/dashboard/automations" },
    { group: "Navigate", icon: lucide_react_1.Users, label: "Go to Contacts", href: "/dashboard/contacts" },
    { group: "Navigate", icon: lucide_react_1.TrendingUp, label: "Go to Leads", href: "/dashboard/leads" },
    { group: "Navigate", icon: lucide_react_1.FileText, label: "Go to Forms", href: "/dashboard/forms" },
    { group: "Navigate", icon: lucide_react_1.Settings, label: "Go to Settings", href: "/dashboard/settings" },
    { group: "Create", icon: lucide_react_1.Plus, label: "Create workflow", href: "/dashboard/automations/new" },
    { group: "Create", icon: lucide_react_1.Plus, label: "Create form", href: "/dashboard/forms/new" },
];
function CommandMenu({ open, onOpenChange }) {
    const router = (0, navigation_1.useRouter)();
    const { setTheme } = (0, next_themes_1.useTheme)();
    const [search, setSearch] = React.useState("");
    // Close on Escape — handled by Dialog; reset search on open
    React.useEffect(() => {
        if (open)
            setSearch("");
    }, [open]);
    function runCommand(fn) {
        onOpenChange(false);
        fn();
    }
    if (!open)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-[20vh]", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: () => onOpenChange(false) }), (0, jsx_runtime_1.jsx)("div", { className: "relative w-full max-w-lg animate-scale-in", children: (0, jsx_runtime_1.jsxs)(cmdk_1.Command, { className: (0, utils_1.cn)("rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)]", "bg-[var(--surface-elevated)] border border-[var(--border-strong)]"), shouldFilter: true, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-4 w-4 text-[var(--muted)] shrink-0" }), (0, jsx_runtime_1.jsx)(cmdk_1.Command.Input, { value: search, onValueChange: setSearch, placeholder: "Search or type a command...", className: "flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none" }), (0, jsx_runtime_1.jsx)("kbd", { className: "hidden sm:flex h-5 items-center rounded-[4px] border border-[var(--border-strong)] px-1.5 text-[10px] text-[var(--muted)] font-mono", children: "ESC" })] }), (0, jsx_runtime_1.jsxs)(cmdk_1.Command.List, { className: "max-h-72 overflow-y-auto p-2", children: [(0, jsx_runtime_1.jsx)(cmdk_1.Command.Empty, { className: "py-8 text-center text-sm text-[var(--muted)]", children: "No results found." }), ["Navigate", "Create"].map((group) => ((0, jsx_runtime_1.jsx)(cmdk_1.Command.Group, { heading: group, className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--muted)]", children: COMMANDS.filter((c) => c.group === group).map((cmd) => ((0, jsx_runtime_1.jsxs)(cmdk_1.Command.Item, { value: cmd.label, onSelect: () => runCommand(() => router.push(cmd.href)), className: (0, utils_1.cn)("flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-[var(--foreground)] cursor-pointer", "hover:bg-[var(--surface-overlay)] aria-selected:bg-[var(--brand-light)] aria-selected:text-[var(--brand)]", "transition-colors duration-100"), children: [(0, jsx_runtime_1.jsx)(cmd.icon, { className: "h-4 w-4 text-[var(--muted)]" }), cmd.label] }, cmd.href))) }, group))), (0, jsx_runtime_1.jsx)(cmdk_1.Command.Group, { heading: "Theme", className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--muted)]", children: [
                                        { label: "Dark mode", icon: lucide_react_1.Moon, value: "dark" },
                                        { label: "Light mode", icon: lucide_react_1.Sun, value: "light" },
                                        { label: "System mode", icon: lucide_react_1.Monitor, value: "system" },
                                    ].map((t) => ((0, jsx_runtime_1.jsxs)(cmdk_1.Command.Item, { value: `theme ${t.label}`, onSelect: () => runCommand(() => setTheme(t.value)), className: (0, utils_1.cn)("flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-[var(--foreground)] cursor-pointer", "hover:bg-[var(--surface-overlay)] aria-selected:bg-[var(--brand-light)] aria-selected:text-[var(--brand)]", "transition-colors duration-100"), children: [(0, jsx_runtime_1.jsx)(t.icon, { className: "h-4 w-4 text-[var(--muted)]" }), t.label] }, t.value))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 px-4 py-2.5 border-t border-[var(--border)] text-[10px] text-[var(--subtle)]", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u2191\u2193 navigate" }), (0, jsx_runtime_1.jsx)("span", { children: "\u21B5 select" }), (0, jsx_runtime_1.jsx)("span", { children: "ESC close" })] })] }) })] }));
}
