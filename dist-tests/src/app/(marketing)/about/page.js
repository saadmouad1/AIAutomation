"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AboutPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const logo_1 = require("@/components/brand/logo");
const FADE_UP = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } } };
const STAGGER = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
function AboutPage() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "pt-32 pb-24 px-6 max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: "hidden", animate: "show", variants: STAGGER, className: "text-center mb-16", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.h1, { variants: FADE_UP, className: "text-4xl md:text-5xl font-bold tracking-tight mb-6", children: "We believe work should flow" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { variants: FADE_UP, className: "text-lg text-[var(--muted)]", children: "Our mission is to eliminate repetitive tasks so people can focus on creative, meaningful work." })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: "hidden", animate: "show", variants: STAGGER, className: "space-y-12 text-lg text-[var(--muted)] leading-relaxed", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { variants: FADE_UP, children: "We started Flowra because we were tired of seeing brilliant teams bogged down by manual data entry, forgotten follow-ups, and disconnected tools. Software was supposed to make our lives easier, but instead, we found ourselves acting as the glue between a dozen different apps." }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { variants: FADE_UP, children: "We built Flowra to be the central nervous system for modern businesses. A place where your forms, contacts, and workflows live together in harmony." }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { variants: FADE_UP, className: "py-12 flex justify-center", children: (0, jsx_runtime_1.jsx)(logo_1.Logo, {}) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { variants: FADE_UP, children: "Today, thousands of companies rely on Flowra to handle millions of tasks every week. We're proud to give them their time back." })] })] }));
}
