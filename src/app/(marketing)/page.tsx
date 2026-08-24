"use client";

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

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import { ArrowRight, ChevronRight, Zap, Users, LayoutTemplate, BarChart3, Globe2, Lock } from "lucide-react";
import { CosmicDustBackground } from "@/components/animations/hero-3d";

// ── Spring presets (textura-inspired physics) ─────────────────────────────
const SPRING_ENTRANCE = { type: "spring", stiffness: 60, damping: 20, mass: 1 } as const;
const SPRING_FAST     = { type: "spring", stiffness: 120, damping: 18, mass: 0.8 } as const;

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
function FlowLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute h-px w-24 bg-gradient-to-r from-[var(--brand)] to-transparent"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: [0, 1, 0.6] }}
      transition={{ duration: 1.5, delay, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
      style={{ transformOrigin: "left center" }}
    />
  );
}

// ── Spotlight / cursor glow ───────────────────────────────────────────────
function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        x: smoothX,
        y: smoothY,
        background: "radial-gradient(circle, rgba(99,91,255,0.07) 0%, transparent 70%)",
      }}
    />
  );
}

// ── Orbital node ring (hero visual) ──────────────────────────────────────
const ORBIT_NODES = [
  { icon: Zap, label: "Automate", angle: 0, color: "#635BFF" },
  { icon: Users, label: "CRM", angle: 72, color: "#06B6D4" },
  { icon: LayoutTemplate, label: "Forms", angle: 144, color: "#22C55E" },
  { icon: BarChart3, label: "Analytics", angle: 216, color: "#F59E0B" },
  { icon: Globe2, label: "Publish", angle: 288, color: "#EC4899" },
];

function OrbitalRing() {
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const rotationDeg = mounted ? tick * 0.1 : 0;

  return (
    <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
      {/* Outer orbit ring */}
      <div className="absolute inset-0 rounded-full border border-[var(--border-strong)] opacity-40" />
      <div className="absolute inset-8 rounded-full border border-dashed border-[var(--border)] opacity-30" />

      {/* Core */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-28 w-28 rounded-full bg-[var(--surface-elevated)] border border-[var(--border-strong)]"
        style={{ boxShadow: "0 0 40px -10px rgba(99,91,255,0.4)" }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-xs font-bold text-[var(--brand)] uppercase tracking-widest">flowra</div>
        <div className="text-[10px] text-[var(--muted)] mt-0.5">AI OS</div>
      </motion.div>

      {/* Orbiting nodes */}
      {ORBIT_NODES.map((node, i) => {
        const angle = ((node.angle + rotationDeg) * Math.PI) / 180;
        const r = 150;
        const cx = Math.cos(angle) * r;
        const cy = Math.sin(angle) * r;

        return (
          <div
            key={node.label}
            className="absolute flex flex-col items-center gap-1"
            suppressHydrationWarning
            style={{
              transform: mounted ? `translate(${cx}px, ${cy}px)` : `translate(${Math.cos((node.angle * Math.PI) / 180) * r}px, ${Math.sin((node.angle * Math.PI) / 180) * r}px)`,
              transition: mounted ? "transform 0.05s linear" : "none",
            }}
          >
            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center text-white border border-white/10"
              style={{
                background: `linear-gradient(135deg, ${node.color}33, ${node.color}11)`,
                boxShadow: `0 0 20px -5px ${node.color}66`,
              }}
            >
              <node.icon className="h-5 w-5" style={{ color: node.color }} />
            </div>
          </div>
        );
      })}

      {/* Connecting lines (pulsing) */}
      {mounted && ORBIT_NODES.map((node, i) => {
        const angle = ((node.angle + rotationDeg) * Math.PI) / 180;
        const r = 135;
        const cx = Math.cos(angle) * r;
        const cy = Math.sin(angle) * r;
        return (
          <svg
            key={`line-${i}`}
            className="absolute inset-0 pointer-events-none"
            width="100%"
            height="100%"
            style={{ overflow: "visible" }}
          >
            <line
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${cx}px)`}
              y2={`calc(50% + ${cy}px)`}
              stroke={node.color}
              strokeWidth="1"
              strokeOpacity={0.2}
            />
          </svg>
        );
      })}
    </div>
  );
}

// ── Feature cards ─────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Zap, title: "Workflow Automation", desc: "Build multi-step automations by describing what you need. Flowra maps and executes the entire logic." },
  { icon: Users, title: "Smart CRM", desc: "Track, segment, and nurture contacts with full interaction history and behavioral scoring." },
  { icon: LayoutTemplate, title: "Dynamic Forms", desc: "Forms that adapt in real-time, connect to workflows, and respond to user inputs intelligently." },
  { icon: BarChart3, title: "Unified Analytics", desc: "A single view across all your pipelines, conversion rates, and operational metrics." },
  { icon: Lock, title: "Enterprise Security", desc: "SOC2 compliant. End-to-end encryption at rest and in transit. Role-based access controls." },
  { icon: Globe2, title: "50+ Integrations", desc: "Connect natively to Salesforce, HubSpot, Slack, Gmail, Stripe, and your internal tools." },
];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      variants={fadeSlide}
      className="group relative rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-8 overflow-hidden cursor-default hover:border-[var(--brand-border)] transition-colors duration-300"
      style={{ willChange: "transform" }}
      whileHover={{ y: -4, transition: SPRING_FAST }}
    >
      {/* Spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(350px circle at ${x}px ${y}px, rgba(99,91,255,0.06), transparent 60%)`,
        }}
      />

      <div className="relative z-10">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand)]/10 border border-[var(--brand-border)] text-[var(--brand)]">
          <feature.icon className="h-5 w-5" />
        </div>
        <h3 className="font-heading text-lg font-bold text-[var(--foreground)] mb-2">{feature.title}</h3>
        <p className="text-[var(--muted)] text-sm leading-relaxed">{feature.desc}</p>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function MarketingPage() {
  const { scrollYProgress } = useScroll();
  const orbitalY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);

  return (
    <main className="relative flex-1 overflow-hidden">
      <CursorGlow />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-0 px-6 pt-32 pb-20 overflow-hidden">

        <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 max-w-7xl mx-auto w-full">

        {/* Left: copy */}
        <div className="flex-1 flex flex-col items-start max-w-xl">
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="w-full"
          >
            {/* Badge */}
            <motion.div
              variants={fadeSlide}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-4 py-2 text-xs font-semibold backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
              <span className="text-[var(--foreground)]">Now in public beta</span>
              <ChevronRight className="h-3 w-3 text-[var(--muted)]" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeSlide}
              className="font-heading text-[clamp(2.75rem,6vw,5rem)] font-black leading-[1.05] tracking-tight text-[var(--foreground)] mb-6"
            >
              Your business,
              <br />
              <span className="text-gradient-brand">on autopilot.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={fadeSlide}
              className="text-lg text-[var(--muted)] leading-relaxed mb-10 max-w-md"
            >
              Flowra is the operating system for modern businesses — connect your tools, automate your processes, and manage your clients from one unified workspace.
            </motion.p>

            {/* CTA row */}
            <motion.div variants={fadeSlide} className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="h-13 px-7 text-base font-semibold shadow-[0_0_24px_-4px_rgba(99,91,255,0.5)]"
                asChild
              >
                <Link href="/dashboard">
                  Start for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-7 text-base border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
                asChild
              >
                <Link href="/contact">Book a demo</Link>
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.p
              variants={fadeSlide}
              className="mt-8 text-xs text-[var(--subtle)] font-medium"
            >
              Trusted by 2,400+ companies · No credit card required
            </motion.p>
          </motion.div>
        </div>

        {/* Right: orbital visual */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          style={{ y: orbitalY }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING_ENTRANCE, delay: 0.3 }}
        >
          <OrbitalRing />
        </motion.div>
        </div>{/* end z-10 wrapper */}
      </section>

      {/* ── METRICS BAR ──────────────────────────────────── */}
      <section className="border-y border-[var(--border-strong)] bg-[var(--surface)]/40 backdrop-blur-sm">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-strong)]"
        >
          {[
            { value: "99.9%", label: "Uptime SLA" },
            { value: "10×", label: "Faster than manual" },
            { value: "Zero code", label: "Required to automate" },
          ].map(m => (
            <motion.div key={m.label} variants={fadeSlide} className="py-4 sm:py-0 sm:px-8">
              <div className="font-heading text-4xl font-black tracking-tight text-[var(--foreground)] mb-1">{m.value}</div>
              <div className="text-sm font-medium text-[var(--muted)] uppercase tracking-widest">{m.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.h2 variants={fadeSlide} className="font-heading text-4xl md:text-5xl font-black tracking-tight text-[var(--foreground)] mb-4">
            Everything your team needs.
          </motion.h2>
          <motion.p variants={fadeSlide} className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            One platform. No stitching tools together. No context-switching.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </motion.div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-28 text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeSlide} className="font-heading text-4xl md:text-6xl font-black tracking-tight text-[var(--foreground)] mb-6">
            Ready to automate <br className="hidden sm:block" />
            <span className="text-gradient-brand">everything?</span>
          </motion.h2>
          <motion.p variants={fadeSlide} className="text-[var(--muted)] text-xl mb-10">
            Join thousands of teams that replaced 5 tools with one Flowra workspace.
          </motion.p>
          <motion.div variants={fadeSlide}>
            <Button
              size="lg"
              className="h-14 px-10 text-lg font-semibold shadow-[0_0_32px_-4px_rgba(99,91,255,0.5)]"
              asChild
            >
              <Link href="/dashboard">
                Get started for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
