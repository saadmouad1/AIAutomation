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
exports.default = MarketingLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const link_1 = __importDefault(require("next/link"));
const logo_1 = require("@/components/brand/logo");
const button_1 = require("@/components/ui/button");
const utils_1 = require("@/lib/utils");
const hero_3d_1 = require("@/components/animations/hero-3d");
const lucide_react_1 = require("lucide-react");
const next_themes_1 = require("next-themes");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
function MarketingHeader() {
    const [scrolled, setScrolled] = React.useState(false);
    const { resolvedTheme, setTheme } = (0, next_themes_1.useTheme)();
    // To avoid hydration mismatch on theme icons
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return ((0, jsx_runtime_1.jsx)("header", { className: (0, utils_1.cn)("fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b", scrolled ? "bg-[var(--surface)]/80 backdrop-blur-md border-[var(--border)] shadow-sm py-3" : "bg-transparent border-transparent py-5"), children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto px-6 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/", className: "hover:opacity-90 transition-opacity", children: (0, jsx_runtime_1.jsx)(logo_1.Logo, {}) }), (0, jsx_runtime_1.jsxs)("nav", { className: "hidden md:flex items-center gap-8 text-sm font-medium", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/features", className: "text-[var(--muted)] hover:text-[var(--foreground)] transition-colors", children: "Features" }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/pricing", className: "text-[var(--muted)] hover:text-[var(--foreground)] transition-colors", children: "Pricing" }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/about", className: "text-[var(--muted)] hover:text-[var(--foreground)] transition-colors", children: "About Us" }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/contact", className: "text-[var(--muted)] hover:text-[var(--foreground)] transition-colors", children: "Contact" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [mounted && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1 border-r border-[var(--border)] pr-3 mr-1", children: (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", className: "h-8 w-8 rounded-full text-[var(--muted)] hover:text-[var(--foreground)]", title: "Change Language", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "h-4 w-4" }) }) }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { align: "end", children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuItem, { children: "English" }), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuItem, { children: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" }), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuItem, { children: "Espa\u00F1ol" }), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuItem, { children: "Fran\u00E7ais" }), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuItem, { children: "Deutsch" })] })] }) })), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", asChild: true, className: "hidden sm:inline-flex rounded-full", children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/login", children: "Sign in" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", asChild: true, className: "rounded-full shadow-[0_0_12px_rgba(99,91,255,0.25)]", children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/register", children: "Start free trial" }) })] })] }) }));
}
function MarketingFooter() {
    return ((0, jsx_runtime_1.jsxs)("footer", { className: "relative bg-[var(--surface-elevated)] border-t border-[var(--border-strong)] pt-20 pb-10 overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--brand)]/5 blur-[100px] rounded-[100%] pointer-events-none" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10 max-w-7xl mx-auto px-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-12 mb-16", children: [(0, jsx_runtime_1.jsxs)("div", { className: "col-span-1 md:col-span-2", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/", className: "inline-block mb-6 hover:opacity-90 transition-opacity", children: (0, jsx_runtime_1.jsx)(logo_1.Logo, {}) }), (0, jsx_runtime_1.jsx)("p", { className: "text-[var(--muted)] text-sm max-w-sm leading-relaxed mb-6", children: "Flowra connects your business tools, understands your workflows, and turns repetitive work into automation \u2014 without the complexity." })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-[var(--foreground)] mb-4", children: "Product" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-3 text-sm text-[var(--muted)]", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/features", className: "hover:text-[var(--brand)] transition-colors", children: "Features" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/pricing", className: "hover:text-[var(--brand)] transition-colors", children: "Pricing" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/changelog", className: "hover:text-[var(--brand)] transition-colors", children: "Changelog" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-[var(--foreground)] mb-4", children: "Company" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-3 text-sm text-[var(--muted)]", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/about", className: "hover:text-[var(--brand)] transition-colors", children: "About Us" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/contact", className: "hover:text-[var(--brand)] transition-colors", children: "Contact" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/legal", className: "hover:text-[var(--brand)] transition-colors", children: "Privacy & Terms" }) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t border-[var(--border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--muted)]", children: [(0, jsx_runtime_1.jsxs)("p", { children: ["\u00A9 ", new Date().getFullYear(), " Flowra Inc. All rights reserved."] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("a", { href: "#", className: "hover:text-[var(--foreground)] transition-colors", children: "Twitter" }), (0, jsx_runtime_1.jsx)("a", { href: "#", className: "hover:text-[var(--foreground)] transition-colors", children: "LinkedIn" }), (0, jsx_runtime_1.jsx)("a", { href: "#", className: "hover:text-[var(--foreground)] transition-colors", children: "GitHub" })] })] })] })] }));
}
function MarketingLayout({ children }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen flex flex-col bg-transparent", children: [(0, jsx_runtime_1.jsx)(hero_3d_1.CosmicDustBackground, { className: "fixed inset-0 z-[-1] opacity-60" }), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-[0] pointer-events-none", style: {
                    background: "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, rgba(3,5,9,0.7) 100%)",
                } }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10 flex flex-col min-h-screen", children: [(0, jsx_runtime_1.jsx)(MarketingHeader, {}), (0, jsx_runtime_1.jsx)("main", { className: "flex-1", children: children }), (0, jsx_runtime_1.jsx)(MarketingFooter, {})] })] }));
}
