"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Webhook, Users, FileText, Zap, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: Webhook, title: "Workflow automation", description: "Build powerful workflows that run automatically. Trigger on form submissions, contact updates, or schedules." },
  { icon: Users,   title: "Contact management", description: "Track leads, contacts, and deal stages in one place. Know where every customer is in your pipeline." },
  { icon: FileText, title: "Smart forms", description: "Create beautiful forms that capture data and trigger workflows automatically — no extra setup needed." },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Describe what you need", desc: "Write in plain language. Tell Flowra what should happen and when." },
  { step: "2", title: "Review your workflow",   desc: "Flowra generates the workflow. Review it, tweak it, make it yours." },
  { step: "3", title: "Let it run",             desc: "Activate and walk away. Flowra handles the repetitive work." },
];

const SOCIAL_PROOF = ["No setup complexity", "Works out of the box", "Replaces 4+ tools", "Saves hours every week"];

// Framer Motion variants
const FADE_UP: any = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
};

const STAGGER: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-32 pb-24 text-center max-w-6xl mx-auto">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-96 w-96 rounded-full bg-[var(--brand)]/15 blur-[100px] pointer-events-none" />
        </div>
        
        <motion.div variants={STAGGER} initial="hidden" animate="show" className="max-w-4xl mx-auto">
          <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--brand-border)] bg-[var(--brand-light)] text-xs font-semibold text-[var(--brand)] mb-8 shadow-sm">
            <Zap className="h-3.5 w-3.5" /> Business automation, made simple
          </motion.div>
          
          <motion.h1 variants={FADE_UP} className="text-5xl sm:text-6xl md:text-7xl font-bold text-[var(--foreground)] leading-[1.1] tracking-tight mb-6">
            Tell us how you work.<br />
            <span className="text-[var(--brand)] inline-block mt-2">We&apos;ll automate the rest.</span>
          </motion.h1>
          
          <motion.p variants={FADE_UP} className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Flowra connects your business tools, understands your workflows, and turns repetitive work into automation — without the complexity.
          </motion.p>
          
          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" asChild className="w-full sm:w-auto shadow-[var(--shadow-brand)] text-base h-14 px-8">
              <Link href="/register">Start free trial <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
            <Button variant="secondary" size="xl" asChild className="w-full sm:w-auto border-[var(--border-strong)] text-base h-14 px-8">
              <Link href="/dashboard">See how it works</Link>
            </Button>
          </motion.div>
          
          <motion.div variants={FADE_UP} className="flex items-center justify-center gap-6 mt-12 flex-wrap">
            {SOCIAL_PROOF.map(p => (
              <div key={p} className="flex items-center gap-2 text-sm font-medium text-[var(--subtle)]">
                <CheckCircle className="h-4 w-4 text-[var(--success)]" />
                {p}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24 max-w-6xl mx-auto border-t border-[var(--border)] relative">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={STAGGER} className="text-center mb-16">
          <motion.h2 variants={FADE_UP} className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4 tracking-tight">Everything you need to automate</motion.h2>
          <motion.p variants={FADE_UP} className="text-lg text-[var(--muted)] max-w-xl mx-auto">One platform to capture, organize, and automate your business processes.</motion.p>
        </motion.div>
        
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={STAGGER} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map(f => (
            <motion.div key={f.title} variants={FADE_UP} className="group rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-8 hover:border-[var(--brand-border)] hover:bg-[var(--surface)] transition-all duration-300 hover:shadow-[var(--shadow-lg)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-light)] mb-6 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="h-6 w-6 text-[var(--brand)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-3">{f.title}</h3>
              <p className="text-[var(--muted)] leading-relaxed text-sm">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-24 bg-[var(--surface-elevated)] border-y border-[var(--border)]">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={STAGGER} className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2 variants={FADE_UP} className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4 tracking-tight">How Flowra works</motion.h2>
          <motion.p variants={FADE_UP} className="text-lg text-[var(--muted)]">Complex technology that feels simple.</motion.p>
        </motion.div>
        
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={STAGGER} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div key={i} variants={FADE_UP} className="text-center relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand)] text-white text-lg font-bold mx-auto mb-6 shadow-[var(--shadow-brand)]">
                {step.step}
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">{step.title}</h3>
              <p className="text-[var(--muted)] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-[var(--brand-border)] to-transparent z-0" />
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-32 text-center max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={STAGGER}>
          <motion.h2 variants={FADE_UP} className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6 tracking-tight">Ready to make work flow?</motion.h2>
          <motion.p variants={FADE_UP} className="text-xl text-[var(--muted)] mb-10 max-w-xl mx-auto">Start free. No credit card needed. Cancel anytime.</motion.p>
          <motion.div variants={FADE_UP}>
            <Button size="xl" asChild className="shadow-[var(--shadow-lg)] h-14 px-10 text-base">
              <Link href="/register">Get started for free <ArrowRight className="h-5 w-5 ml-2" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
