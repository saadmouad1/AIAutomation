"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FeaturesPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const interactive_workflow_demo_1 = require("@/components/animations/interactive-workflow-demo");
const react_1 = require("react");
// Mini Typing Animation Component
function AIChatDemo() {
    const [text, setText] = (0, react_1.useState)("");
    const fullText = "When a new lead fills the contact form, route them to the enterprise team if company size > 1000, otherwise send to general sales.";
    (0, react_1.useEffect)(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i <= fullText.length) {
                setText(fullText.substring(0, i));
                i++;
            }
            else {
                clearInterval(interval);
            }
        }, 40);
        return () => clearInterval(interval);
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-lg mx-auto bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl shadow-2xl overflow-hidden font-sans", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-[var(--border)] bg-[var(--surface-overlay)] flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-full bg-[var(--brand)]/10 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-4 h-4 text-[var(--brand)]" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs font-semibold text-[var(--foreground)]", children: "Flowra AI" }), (0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-[var(--muted)]", children: "Describe your workflow" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 h-32", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-[var(--foreground)] leading-relaxed", children: [text, (0, jsx_runtime_1.jsx)("span", { className: "inline-block w-1 h-4 ml-1 bg-[var(--brand)] animate-pulse" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-[var(--surface-elevated)] border-t border-[var(--border)] flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-2 rounded-full bg-[var(--border-strong)]" }), (0, jsx_runtime_1.jsx)("div", { className: "w-10 h-2 rounded-full bg-[var(--border-strong)]" })] }), (0, jsx_runtime_1.jsx)("div", { className: "px-3 py-1.5 rounded-md bg-[var(--brand)] text-white text-xs font-semibold", children: "Generate" })] })] }));
}
// Mini Routing Animation Component
function RoutingDemo() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-lg mx-auto h-64 relative flex items-center justify-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)] flex items-center justify-center z-10 shadow-lg", children: (0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "w-4 h-4 text-blue-500" }) }) }), (0, jsx_runtime_1.jsxs)("svg", { className: "absolute inset-0 w-full h-full pointer-events-none z-0", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.path, { d: "M 80 128 L 200 128 L 200 64 L 320 64", stroke: "var(--brand)", strokeWidth: "2", strokeDasharray: "5,5", fill: "none", animate: { strokeDashoffset: [0, -20] }, transition: { duration: 0.5, repeat: Infinity, ease: "linear" } }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.path, { d: "M 80 128 L 200 128 L 200 192 L 320 192", stroke: "var(--muted)", strokeWidth: "2", strokeDasharray: "5,5", fill: "none", animate: { strokeDashoffset: [0, -20] }, transition: { duration: 0.5, repeat: Infinity, ease: "linear" } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute right-4 top-10 w-48 bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl p-3 shadow-lg flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 rounded-full bg-[var(--brand)] animate-ping" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs font-bold text-[var(--foreground)]", children: "Enterprise Team" }), (0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-[var(--muted)]", children: "Size > 1000" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute right-4 bottom-10 w-48 bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl p-3 shadow-lg flex items-center gap-3 opacity-50", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 rounded-full bg-[var(--muted)]" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs font-bold text-[var(--foreground)]", children: "General Sales" }), (0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-[var(--muted)]", children: "Default route" })] })] })] }));
}
const BIG_FEATURES = [
    {
        icon: lucide_react_1.Webhook, title: "Visual Automation Engine",
        desc: "Build complex workflows by just dragging and dropping blocks. No coding required. Connect apps, add conditions, and let Flowra handle the rest.",
        visual: (0, jsx_runtime_1.jsx)(interactive_workflow_demo_1.InteractiveWorkflowDemo, {})
    },
    {
        icon: lucide_react_1.Filter, title: "Smart Logic & Routing",
        desc: "Route leads to the right sales rep based on company size, or send different email sequences based on user behavior. Branching logic made easy.",
        visual: (0, jsx_runtime_1.jsx)(RoutingDemo, {})
    },
    {
        icon: lucide_react_1.Zap, title: "Natural Language Builder",
        desc: "Just tell Flowra what you want to automate in plain English. 'When someone fills out my form, add them to Mailchimp and send me a Slack message.' Flowra builds it instantly.",
        visual: (0, jsx_runtime_1.jsx)(AIChatDemo, {})
    },
];
const GRID_FEATURES = [
    { icon: lucide_react_1.LayoutTemplate, title: "Pre-built Templates", desc: "Start fast with our library of industry-standard automation templates." },
    { icon: lucide_react_1.Layers, title: "Multi-step Workflows", desc: "String together as many actions and apps as you need in a single flow." },
    { icon: lucide_react_1.Lock, title: "Enterprise Security", desc: "Your data is encrypted at rest and in transit with SOC2 compliance." },
    { icon: lucide_react_1.Plug, title: "50+ Integrations", desc: "Connects natively with HubSpot, Salesforce, Slack, Gmail, and more." },
    { icon: lucide_react_1.Clock, title: "Real-time Execution", desc: "Workflows trigger instantly. No polling delays or batching waits." },
    { icon: lucide_react_1.Settings2, title: "Granular Control", desc: "Pause, resume, and inspect the history of every single workflow run." },
];
const FADE_UP = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } } };
const STAGGER = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
function FeaturesPage() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "pt-32 pb-24 px-6 max-w-7xl mx-auto overflow-hidden", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: "hidden", animate: "show", variants: STAGGER, className: "text-center max-w-3xl mx-auto mb-20", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.h1, { variants: FADE_UP, className: "text-4xl md:text-6xl font-black font-heading tracking-tighter mb-6", children: ["Powerful features,", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("span", { className: "text-gradient-brand", children: "zero complexity" })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { variants: FADE_UP, className: "text-lg md:text-xl text-[var(--muted)] font-medium", children: "Everything you need to automate your business processes, all in one unified platform." })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: "hidden", whileInView: "show", viewport: { once: true }, variants: STAGGER, className: "space-y-32 mb-32", children: BIG_FEATURES.map((feat, i) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { variants: FADE_UP, className: `flex flex-col lg:flex-row items-center gap-12 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 max-w-xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand)]/10 mb-6 border border-[var(--brand)]/20 shadow-[0_0_15px_rgba(99,91,255,0.15)]", children: (0, jsx_runtime_1.jsx)(feat.icon, { className: "h-6 w-6 text-[var(--brand)]" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-3xl md:text-4xl font-bold font-heading mb-4", children: feat.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-[var(--muted)] leading-relaxed", children: feat.desc })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 w-full relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-[var(--brand)]/20 to-transparent blur-3xl opacity-30 -z-10 rounded-full" }), (0, jsx_runtime_1.jsx)("div", { className: "relative w-full rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border-strong)] p-2 shadow-2xl glass-panel", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-[var(--background)] rounded-2xl overflow-hidden relative border border-[var(--border)] p-4 sm:p-8 flex items-center justify-center min-h-[350px]", children: feat.visual }) })] })] }, feat.title))) }), (0, jsx_runtime_1.jsxs)("div", { className: "relative py-24 mb-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-[var(--brand)]/5 rounded-[3rem] -z-10" }), (0, jsx_runtime_1.jsx)("div", { className: "text-center mb-16", children: (0, jsx_runtime_1.jsx)("h2", { className: "text-3xl md:text-4xl font-bold font-heading mb-4", children: "Plus everything else you expect" }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: "hidden", whileInView: "show", viewport: { once: true }, variants: STAGGER, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6", children: GRID_FEATURES.map(feat => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { variants: FADE_UP, className: "spotlight-card p-8 group cursor-default", children: (0, jsx_runtime_1.jsxs)("div", { className: "spotlight-content", children: [(0, jsx_runtime_1.jsx)(feat.icon, { className: "h-6 w-6 text-[var(--brand)] mb-4 group-hover:scale-110 transition-transform" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold mb-2 text-[var(--foreground)]", children: feat.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-[var(--muted)] leading-relaxed", children: feat.desc })] }) }, feat.title))) })] })] }));
}
