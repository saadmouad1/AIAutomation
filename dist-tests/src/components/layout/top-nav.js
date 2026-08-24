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
exports.TopNav = TopNav;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
const next_themes_1 = require("next-themes");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const button_1 = require("@/components/ui/button");
/* ── Breadcrumb ─────────────────────────────────────── */
function Breadcrumbs() {
    const pathname = (0, navigation_1.usePathname)();
    const parts = pathname.split("/").filter(Boolean);
    const LABELS = {
        dashboard: "Overview", contacts: "Contacts", leads: "Leads",
        forms: "Forms", automations: "Automations", settings: "Settings",
        tasks: "Tasks", integrations: "Integrations", help: "Help",
        new: "New",
    };
    return ((0, jsx_runtime_1.jsx)("nav", { className: "flex items-center gap-1 text-sm", "aria-label": "Breadcrumb", children: parts.map((part, i) => {
            const href = "/" + parts.slice(0, i + 1).join("/");
            const isLast = i === parts.length - 1;
            const label = LABELS[part] ?? part;
            return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [i > 0 && (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-3.5 w-3.5 text-[var(--subtle)]" }), isLast ? ((0, jsx_runtime_1.jsx)("span", { className: "font-medium text-[var(--foreground)]", children: label })) : ((0, jsx_runtime_1.jsx)(link_1.default, { href: href, className: "text-[var(--muted)] hover:text-[var(--foreground)] transition-colors", children: label }))] }, href));
        }) }));
}
/* ── Theme toggle ──────────────────────────────────── */
function ThemeToggle() {
    const { theme, setTheme } = (0, next_themes_1.useTheme)();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    if (!mounted)
        return (0, jsx_runtime_1.jsx)("div", { className: "h-8 w-8" });
    const THEMES = [
        { value: "light", icon: lucide_react_1.Sun, label: "Light" },
        { value: "dark", icon: lucide_react_1.Moon, label: "Dark" },
        { value: "system", icon: lucide_react_1.Monitor, label: "System" },
    ];
    const current = THEMES.find(t => t.value === theme) ?? THEMES[2];
    return ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", "aria-label": "Toggle theme", children: (0, jsx_runtime_1.jsx)(current.icon, { className: "h-4 w-4 text-[var(--muted)]" }) }) }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { align: "end", className: "w-36", children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuLabel, { children: "Theme" }), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuSeparator, {}), THEMES.map(t => ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { className: (0, utils_1.cn)("gap-2 cursor-pointer", theme === t.value && "text-[var(--brand)]"), onClick: () => setTheme(t.value), children: [(0, jsx_runtime_1.jsx)(t.icon, { className: "h-4 w-4" }), t.label] }, t.value)))] })] }));
}
/* ── TopNav ─────────────────────────────────────────── */
function TopNav() {
    return ((0, jsx_runtime_1.jsxs)("header", { className: "flex h-[var(--topbar-height,60px)] shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6", children: [(0, jsx_runtime_1.jsx)(Breadcrumbs, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", "aria-label": "Notifications", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "h-4 w-4 text-[var(--muted)]" }) }), (0, jsx_runtime_1.jsx)(ThemeToggle, {}), (0, jsx_runtime_1.jsx)("div", { className: "ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand)] text-white text-xs font-bold", children: "S" })] })] }));
}
