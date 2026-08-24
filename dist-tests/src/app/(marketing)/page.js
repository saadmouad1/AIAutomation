"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MarketingPage;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Home / Marketing Page
 * ─────────────────────────────────────────────────────────────
 * Animation philosophy (textura-style):
 *   - Every motion has physical weight: stiffness + damping, not duration.
 *   - Reveals are staggered from a shared parent, never per-element timeouts.
 *   - Parallax is scroll-progress-mapped, not a timer.
 *   - No decorative keyframes. Only purposeful motion.
 * ─────────────────────────────────────────────────────────────
 */
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
// ── Spring presets (textura-inspired physics) ─────────────────────────────
const SPRING_ENTRANCE = { type: "spring", stiffness: 60, damping: 20, mass: 1 };
const SPRING_FAST = { type: "spring", stiffness: 120, damping: 18, mass: 0.8 };
// ── Stagger container ─────────────────────────────────────────────────────
const staggerContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const fadeSlide = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: SPRING_ENTRANCE },
};
// ── Animated connecting lines (live data flow visualization) ──────────────
function FlowLine({ delay = 0 }) {
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute h-px w-24 bg-gradient-to-r from-[var(--brand)] to-transparent", initial: { scaleX: 0, opacity: 0 }, animate: { scaleX: 1, opacity: [0, 1, 0.6] }, transition: { duration: 1.5, delay, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }, style: { transformOrigin: "left center" } }));
}
// ── Spotlight / cursor glow ───────────────────────────────────────────────
function CursorGlow() {
    const x = (0, framer_motion_1.useMotionValue)(0);
    const y = (0, framer_motion_1.useMotionValue)(0);
    const smoothX = (0, framer_motion_1.useSpring)(x, { stiffness: 80, damping: 20 });
    const smoothY = (0, framer_motion_1.useSpring)(y, { stiffness: 80, damping: 20 });
    (0, react_1.useEffect)(() => {
        const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, [x, y]);
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "pointer-events-none fixed top-0 left-0 z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full", style: {
            x: smoothX,
            y: smoothY,
            background: "radial-gradient(circle, rgba(99,91,255,0.07) 0%, transparent 70%)",
        } }));
}
// ── Orbital node ring (hero visual) ──────────────────────────────────────
const ORBIT_NODES = [
    { icon: lucide_react_1.Zap, label: "Automate", angle: 0, color: "#635BFF" },
    { icon: lucide_react_1.Users, label: "CRM", angle: 72, color: "#06B6D4" },
    { icon: lucide_react_1.LayoutTemplate, label: "Forms", angle: 144, color: "#22C55E" },
    { icon: lucide_react_1.BarChart3, label: "Analytics", angle: 216, color: "#F59E0B" },
    { icon: lucide_react_1.Globe2, label: "Publish", angle: 288, color: "#EC4899" },
];
function OrbitalRing() {
    const [tick, setTick] = (0, react_1.useState)(0);
    const [mounted, setMounted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setMounted(true);
        const id = setInterval(() => setTick(t => t + 1), 50);
        return () => clearInterval(id);
    }, []);
    const rotationDeg = mounted ? tick * 0.1 : 0;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 rounded-full border border-[var(--border-strong)] opacity-40" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-8 rounded-full border border-dashed border-[var(--border)] opacity-30" }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "relative z-10 flex flex-col items-center justify-center h-28 w-28 rounded-full bg-[var(--surface-elevated)] border border-[var(--border-strong)]", style: { boxShadow: "0 0 40px -10px rgba(99,91,255,0.4)" }, animate: { scale: [1, 1.03, 1] }, transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }, children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs font-bold text-[var(--brand)] uppercase tracking-widest", children: "flowra" }), (0, jsx_runtime_1.jsx)("div", { className: "text-[10px] text-[var(--muted)] mt-0.5", children: "AI OS" })] }), ORBIT_NODES.map((node, i) => {
                const angle = ((node.angle + rotationDeg) * Math.PI) / 180;
                const r = 150;
                const cx = Math.cos(angle) * r;
                const cy = Math.sin(angle) * r;
                return ((0, jsx_runtime_1.jsx)("div", { className: "absolute flex flex-col items-center gap-1", suppressHydrationWarning: true, style: {
                        transform: mounted ? `translate(${cx}px, ${cy}px)` : `translate(${Math.cos((node.angle * Math.PI) / 180) * r}px, ${Math.sin((node.angle * Math.PI) / 180) * r}px)`,
                        transition: mounted ? "transform 0.05s linear" : "none",
                    }, children: (0, jsx_runtime_1.jsx)("div", { className: "h-11 w-11 rounded-xl flex items-center justify-center text-white border border-white/10", style: {
                            background: `linear-gradient(135deg, ${node.color}33, ${node.color}11)`,
                            boxShadow: `0 0 20px -5px ${node.color}66`,
                        }, children: (0, jsx_runtime_1.jsx)(node.icon, { className: "h-5 w-5", style: { color: node.color } }) }) }, node.label));
            }), mounted && ORBIT_NODES.map((node, i) => {
                const angle = ((node.angle + rotationDeg) * Math.PI) / 180;
                const r = 135;
                const cx = Math.cos(angle) * r;
                const cy = Math.sin(angle) * r;
                return ((0, jsx_runtime_1.jsx)("svg", { className: "absolute inset-0 pointer-events-none", width: "100%", height: "100%", style: { overflow: "visible" }, children: (0, jsx_runtime_1.jsx)("line", { x1: "50%", y1: "50%", x2: `calc(50% + ${cx}px)`, y2: `calc(50% + ${cy}px)`, stroke: node.color, strokeWidth: "1", strokeOpacity: 0.2 }) }, `line-${i}`));
            })] }));
}
// ── Feature cards ─────────────────────────────────────────────────────────
const FEATURES = [
    { icon: lucide_react_1.Zap, title: "Workflow Automation", desc: "Build multi-step automations by describing what you need. Flowra maps and executes the entire logic." },
    { icon: lucide_react_1.Users, title: "Smart CRM", desc: "Track, segment, and nurture contacts with full interaction history and behavioral scoring." },
    { icon: lucide_react_1.LayoutTemplate, title: "Dynamic Forms", desc: "Forms that adapt in real-time, connect to workflows, and respond to user inputs intelligently." },
    { icon: lucide_react_1.BarChart3, title: "Unified Analytics", desc: "A single view across all your pipelines, conversion rates, and operational metrics." },
    { icon: lucide_react_1.Lock, title: "Enterprise Security", desc: "SOC2 compliant. End-to-end encryption at rest and in transit. Role-based access controls." },
    { icon: lucide_react_1.Globe2, title: "50+ Integrations", desc: "Connect natively to Salesforce, HubSpot, Slack, Gmail, Stripe, and your internal tools." },
];
function FeatureCard({ feature, index }) {
    const ref = (0, react_1.useRef)(null);
    const x = (0, framer_motion_1.useMotionValue)(0);
    const y = (0, framer_motion_1.useMotionValue)(0);
    const handleMouse = (e) => {
        if (!ref.current)
            return;
        const rect = ref.current.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
    };
    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { ref: ref, onMouseMove: handleMouse, variants: fadeSlide, className: "group relative rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-8 overflow-hidden cursor-default hover:border-[var(--brand-border)] transition-colors duration-300", style: { willChange: "transform" }, whileHover: { y: -4, transition: SPRING_FAST }, children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", style: {
                    background: `radial-gradient(350px circle at ${x}px ${y}px, rgba(99,91,255,0.06), transparent 60%)`,
                } }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand)]/10 border border-[var(--brand-border)] text-[var(--brand)]", children: (0, jsx_runtime_1.jsx)(feature.icon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "font-heading text-lg font-bold text-[var(--foreground)] mb-2", children: feature.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-[var(--muted)] text-sm leading-relaxed", children: feature.desc })] })] }));
}
// ── Page ──────────────────────────────────────────────────────────────────
function MarketingPage() {
    const { scrollYProgress } = (0, framer_motion_1.useScroll)();
    const orbitalY = (0, framer_motion_1.useTransform)(scrollYProgress, [0, 0.4], [0, -80]);
    return ((0, jsx_runtime_1.jsxs)("main", { className: "relative flex-1 overflow-hidden", children: [(0, jsx_runtime_1.jsx)(CursorGlow, {}), (0, jsx_runtime_1.jsx)("section", { className: "relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-0 px-6 pt-32 pb-20 overflow-hidden", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 max-w-7xl mx-auto w-full", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex flex-col items-start max-w-xl", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: "hidden", animate: "show", variants: staggerContainer, className: "w-full", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { variants: fadeSlide, className: "mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-4 py-2 text-xs font-semibold backdrop-blur-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-[var(--brand)] animate-pulse" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[var(--foreground)]", children: "Now in public beta" }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-3 w-3 text-[var(--muted)]" })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.h1, { variants: fadeSlide, className: "font-heading text-[clamp(2.75rem,6vw,5rem)] font-black leading-[1.05] tracking-tight text-[var(--foreground)] mb-6", children: ["Your business,", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("span", { className: "text-gradient-brand", children: "on autopilot." })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { variants: fadeSlide, className: "text-lg text-[var(--muted)] leading-relaxed mb-10 max-w-md", children: "Flowra is the operating system for modern businesses \u2014 connect your tools, automate your processes, and manage your clients from one unified workspace." }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { variants: fadeSlide, className: "flex flex-col sm:flex-row gap-3", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { size: "lg", className: "h-13 px-7 text-base font-semibold shadow-[0_0_24px_-4px_rgba(99,91,255,0.5)]", asChild: true, children: (0, jsx_runtime_1.jsxs)(link_1.default, { href: "/dashboard", children: ["Start for free", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "ml-2 h-4 w-4" })] }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "lg", variant: "outline", className: "h-13 px-7 text-base border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]", asChild: true, children: (0, jsx_runtime_1.jsx)(link_1.default, { href: "/contact", children: "Book a demo" }) })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { variants: fadeSlide, className: "mt-8 text-xs text-[var(--subtle)] font-medium", children: "Trusted by 2,400+ companies \u00B7 No credit card required" })] }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "flex-1 flex items-center justify-center", style: { y: orbitalY }, initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { ...SPRING_ENTRANCE, delay: 0.3 }, children: (0, jsx_runtime_1.jsx)(OrbitalRing, {}) })] }) }), (0, jsx_runtime_1.jsx)("section", { className: "border-y border-[var(--border-strong)] bg-[var(--surface)]/40 backdrop-blur-sm", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-80px" }, variants: staggerContainer, className: "max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-strong)]", children: [
                        { value: "99.9%", label: "Uptime SLA" },
                        { value: "10×", label: "Faster than manual" },
                        { value: "Zero code", label: "Required to automate" },
                    ].map(m => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { variants: fadeSlide, className: "py-4 sm:py-0 sm:px-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-heading text-4xl font-black tracking-tight text-[var(--foreground)] mb-1", children: m.value }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-[var(--muted)] uppercase tracking-widest", children: m.label })] }, m.label))) }) }), (0, jsx_runtime_1.jsxs)("section", { className: "max-w-7xl mx-auto px-6 py-28", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-100px" }, variants: staggerContainer, className: "text-center mb-20", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.h2, { variants: fadeSlide, className: "font-heading text-4xl md:text-5xl font-black tracking-tight text-[var(--foreground)] mb-4", children: "Everything your team needs." }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { variants: fadeSlide, className: "text-[var(--muted)] text-lg max-w-2xl mx-auto", children: "One platform. No stitching tools together. No context-switching." })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-80px" }, variants: staggerContainer, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: FEATURES.map((feature, i) => ((0, jsx_runtime_1.jsx)(FeatureCard, { feature: feature, index: i }, feature.title))) })] }), (0, jsx_runtime_1.jsx)("section", { className: "max-w-4xl mx-auto px-6 py-28 text-center", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-80px" }, variants: staggerContainer, children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.h2, { variants: fadeSlide, className: "font-heading text-4xl md:text-6xl font-black tracking-tight text-[var(--foreground)] mb-6", children: ["Ready to automate ", (0, jsx_runtime_1.jsx)("br", { className: "hidden sm:block" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gradient-brand", children: "everything?" })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { variants: fadeSlide, className: "text-[var(--muted)] text-xl mb-10", children: "Join thousands of teams that replaced 5 tools with one Flowra workspace." }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { variants: fadeSlide, children: (0, jsx_runtime_1.jsx)(button_1.Button, { size: "lg", className: "h-14 px-10 text-lg font-semibold shadow-[0_0_32px_-4px_rgba(99,91,255,0.5)]", asChild: true, children: (0, jsx_runtime_1.jsxs)(link_1.default, { href: "/dashboard", children: ["Get started for free", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "ml-2 h-5 w-5" })] }) }) })] }) })] }));
}
