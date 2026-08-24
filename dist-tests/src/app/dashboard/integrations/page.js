"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = exports.dynamic = void 0;
exports.default = IntegrationsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const session_1 = require("@/lib/auth/session");
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const glass_card_1 = require("@/components/ui/glass-card");
const button_1 = require("@/components/ui/button");
exports.dynamic = "force-dynamic";
exports.metadata = {
    title: "Integrations — Flowra",
    description: "Connect Flowra to your favorite tools.",
};
async function IntegrationsPage() {
    const session = await (0, session_1.getSession)();
    if (!session?.user?.id)
        (0, navigation_1.redirect)("/login");
    // Read environment variables securely on the server to determine integration status
    const hasTwilio = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_SMS_FROM);
    const hasWhatsApp = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM);
    const hasGroq = !!process.env.GROQ_API_KEY;
    const integrations = [
        {
            id: "twilio",
            name: "Twilio SMS",
            description: "Send and receive SMS messages globally.",
            icon: lucide_react_1.PhoneCall,
            color: "#F22F46",
            status: hasTwilio ? "connected" : "requires_setup",
        },
        {
            id: "whatsapp",
            name: "WhatsApp Business",
            description: "Automate conversations on the world's most popular messaging app.",
            icon: lucide_react_1.MessageSquare,
            color: "#25D366",
            status: hasWhatsApp ? "connected" : "requires_setup",
        },
        {
            id: "groq",
            name: "Groq AI",
            description: "Ultra-fast AI models for lead qualification, support, and content generation.",
            icon: lucide_react_1.Sparkles,
            color: "#F55036",
            status: hasGroq ? "connected" : "requires_setup",
        },
        {
            id: "webhooks",
            name: "Webhooks",
            description: "Connect to any platform that supports outgoing HTTP webhooks.",
            icon: lucide_react_1.Webhook,
            color: "#635BFF",
            status: "available", // Always available via the built-in HTTP request / webhook triggers
        },
        {
            id: "shopify",
            name: "Shopify",
            description: "Trigger automations on new orders, abandoned carts, and more.",
            icon: lucide_react_1.ShoppingBag,
            color: "#96BF48",
            status: "coming_soon",
        }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto space-y-10 animate-fade-up pb-20", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-start gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-strong)]", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plug, { className: "h-6 w-6 text-[var(--foreground)]" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-[var(--foreground)] tracking-tight", children: "Integrations" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[var(--muted)] mt-1.5 text-lg max-w-2xl", children: "Connect Flowra to your favorite tools. Integrations are configured securely at the platform level." })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: integrations.map(integration => ((0, jsx_runtime_1.jsxs)(glass_card_1.GlassCard, { className: "flex flex-col h-full overflow-hidden hover:border-[var(--brand-border)] transition-colors p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-12 w-12 rounded-xl flex items-center justify-center border border-[var(--border)] shadow-sm bg-[var(--surface-elevated)]", children: (0, jsx_runtime_1.jsx)(integration.icon, { className: "h-6 w-6", style: { color: integration.color } }) }), (0, jsx_runtime_1.jsx)("span", { className: `text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border ${integration.status === 'connected' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        integration.status === 'available' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                            integration.status === 'requires_setup' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]'}`, children: integration.status.replace("_", " ") })] }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-[var(--foreground)] tracking-tight mb-2", children: integration.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[var(--muted)] mb-6 flex-1", children: integration.description }), (0, jsx_runtime_1.jsx)("div", { className: "mt-auto", children: integration.status === "connected" || integration.status === "available" ? ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", className: "w-full text-green-500 border-green-500/20 hover:bg-green-500/10 pointer-events-none", children: "Ready to Use" })) : integration.status === "coming_soon" ? ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", className: "w-full", disabled: true, children: "Coming Soon" })) : ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", className: "w-full", children: "Configure Settings" })) })] }, integration.id))) })] }));
}
