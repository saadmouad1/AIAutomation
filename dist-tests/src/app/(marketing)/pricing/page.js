"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PricingPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const link_1 = __importDefault(require("next/link"));
const TIERS = [
    {
        name: "Starter",
        price: "$29",
        description: "Perfect for solopreneurs getting started with automation.",
        features: ["Up to 5 active workflows", "1,000 runs per month", "Basic integrations", "Email support", "Standard templates"],
        popular: false,
    },
    {
        name: "Professional",
        price: "$99",
        description: "For growing teams that need more power and scale.",
        features: ["Unlimited workflows", "10,000 runs per month", "Premium integrations", "Priority support", "Custom branding", "Team collaboration"],
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Advanced security and support for large organizations.",
        features: ["Unlimited everything", "Dedicated success manager", "SSO & Advanced Security", "Custom contracts & SLAs", "Onboarding support"],
        popular: false,
    },
];
const FADE_UP = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } } };
const STAGGER = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
function PricingPage() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "pt-32 pb-24 px-6 max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: "hidden", animate: "show", variants: STAGGER, className: "text-center max-w-3xl mx-auto mb-16", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.h1, { variants: FADE_UP, className: "text-4xl md:text-5xl font-bold tracking-tight mb-6", children: "Simple, transparent pricing" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { variants: FADE_UP, className: "text-lg text-[var(--muted)]", children: "Choose the plan that fits your business. Scale as you grow." })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: "hidden", animate: "show", variants: STAGGER, className: "grid grid-cols-1 md:grid-cols-3 gap-8 items-start", children: TIERS.map((tier) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { variants: FADE_UP, className: `relative rounded-3xl p-8 border ${tier.popular ? "border-[var(--brand)] shadow-[var(--shadow-brand)] bg-[var(--surface)]" : "border-[var(--border-strong)] bg-[var(--surface-elevated)]"}`, children: [tier.popular && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-[var(--brand)] text-white text-xs font-bold uppercase tracking-wider rounded-full", children: "Most Popular" })), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold mb-2", children: tier.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[var(--muted)] mb-6 h-10", children: tier.description }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-4xl font-bold", children: tier.price }), tier.price !== "Custom" && (0, jsx_runtime_1.jsx)("span", { className: "text-[var(--muted)] font-medium", children: "/month" })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: tier.popular ? "primary" : "secondary", className: "w-full mb-8", size: "lg", asChild: true, children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/register", children: tier.price === "Custom" ? "Contact Sales" : "Get Started" }) }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-4", children: tier.features.map(f => ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-3 text-sm font-medium", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "h-5 w-5 text-[var(--brand)] shrink-0" }), (0, jsx_runtime_1.jsx)("span", { children: f })] }, f))) })] }, tier.name))) })] }));
}
