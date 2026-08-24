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
exports.default = SettingsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const next_themes_1 = require("next-themes");
const theme_provider_1 = require("@/components/providers/theme-provider");
const tabs_1 = require("@/components/ui/tabs");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const switch_1 = require("@/components/ui/switch");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const ACCENTS = [
    { id: "purple", label: "Flowra Purple", color: "#635BFF" },
    { id: "blue", label: "Blue", color: "#4F46E5" },
    { id: "cyan", label: "Cyan", color: "#06B6D4" },
    { id: "green", label: "Green", color: "#22C55E" },
    { id: "orange", label: "Orange", color: "#F59E0B" },
    { id: "rose", label: "Rose", color: "#F43F5E" },
];
function ThemeButton({ value, icon: Icon, label, current }) {
    const { setTheme } = (0, next_themes_1.useTheme)();
    return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setTheme(value), className: (0, utils_1.cn)("flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] border text-sm font-medium transition-all duration-150", current === value
            ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]"
            : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"), children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4" }), label] }));
}
function SettingsPage() {
    const { theme } = (0, next_themes_1.useTheme)();
    const { accent, setAccent } = (0, theme_provider_1.useFlowraTheme)();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-3xl mx-auto space-y-6 animate-fade-up", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-0.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-5 w-5 text-[var(--brand)]" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-[var(--foreground)]", children: "Settings" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[var(--muted)]", children: "Manage your account and workspace preferences" })] }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "appearance", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "appearance", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sun, { className: "h-3.5 w-3.5 mr-1.5" }), "Appearance"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "profile", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-3.5 w-3.5 mr-1.5" }), "Profile"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "organization", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building2, { className: "h-3.5 w-3.5 mr-1.5" }), "Organization"] })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "appearance", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "divide-y divide-[var(--border)]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-5", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-[var(--foreground)] mb-0.5", children: "Theme" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-[var(--muted)] mb-4", children: "Choose how Flowra looks on your device." }), mounted && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2", children: [(0, jsx_runtime_1.jsx)(ThemeButton, { value: "system", icon: lucide_react_1.Monitor, label: "System", current: theme }), (0, jsx_runtime_1.jsx)(ThemeButton, { value: "light", icon: lucide_react_1.Sun, label: "Light", current: theme }), (0, jsx_runtime_1.jsx)(ThemeButton, { value: "dark", icon: lucide_react_1.Moon, label: "Dark", current: theme })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-5", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-[var(--foreground)] mb-0.5", children: "Accent color" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-[var(--muted)] mb-4", children: "Customize the primary color across the interface." }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-3", children: ACCENTS.map(a => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setAccent(a.id), className: (0, utils_1.cn)("flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border text-xs font-medium transition-all duration-150", accent === a.id
                                                    ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]"
                                                    : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"), children: [(0, jsx_runtime_1.jsx)("span", { className: "h-3.5 w-3.5 rounded-full shrink-0", style: { backgroundColor: a.color } }), a.label] }, a.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-5 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-[var(--foreground)]", children: "Email notifications" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-[var(--muted)] mt-0.5", children: "Receive workflow run summaries by email" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { defaultChecked: true })] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "profile", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-5 space-y-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-[var(--foreground)]", children: "Profile information" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-medium text-[var(--foreground)] block mb-1", children: "Full name" }), (0, jsx_runtime_1.jsx)(input_1.Input, { defaultValue: "Saad Mouad" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-medium text-[var(--foreground)] block mb-1", children: "Email" }), (0, jsx_runtime_1.jsx)(input_1.Input, { defaultValue: "saad@flowra.app", type: "email" })] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", children: "Save changes" })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "organization", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "p-5 space-y-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-[var(--foreground)]", children: "Organization details" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-medium text-[var(--foreground)] block mb-1", children: "Organization name" }), (0, jsx_runtime_1.jsx)(input_1.Input, { defaultValue: "My Organization" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-xs font-medium text-[var(--foreground)] block mb-1", children: "Slug" }), (0, jsx_runtime_1.jsx)(input_1.Input, { defaultValue: "my-org" })] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", children: "Save changes" })] }) })] })] }));
}
