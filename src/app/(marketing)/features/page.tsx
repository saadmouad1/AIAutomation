"use client";

import { motion } from "framer-motion";
import { Webhook, Filter, Zap, LayoutTemplate, Layers, Lock, Plug, Clock, Settings2 } from "lucide-react";

const BIG_FEATURES = [
  {
    icon: Webhook, title: "Visual Automation Engine", 
    desc: "Build complex workflows by just dragging and dropping blocks. No coding required. Connect apps, add conditions, and let Flowra handle the rest."
  },
  {
    icon: Filter, title: "Smart Logic & Routing", 
    desc: "Route leads to the right sales rep based on company size, or send different email sequences based on user behavior. Branching logic made easy."
  },
  {
    icon: Zap, title: "Natural Language Builder", 
    desc: "Just tell Flowra what you want to automate in plain English. 'When someone fills out my form, add them to Mailchimp and send me a Slack message.' Flowra builds it instantly."
  },
];

const GRID_FEATURES = [
  { icon: LayoutTemplate, title: "Pre-built Templates", desc: "Start fast with our library of industry-standard automation templates." },
  { icon: Layers, title: "Multi-step Workflows", desc: "String together as many actions and apps as you need in a single flow." },
  { icon: Lock, title: "Enterprise Security", desc: "Your data is encrypted at rest and in transit with SOC2 compliance." },
  { icon: Plug, title: "50+ Integrations", desc: "Connects natively with HubSpot, Salesforce, Slack, Gmail, and more." },
  { icon: Clock, title: "Real-time Execution", desc: "Workflows trigger instantly. No polling delays or batching waits." },
  { icon: Settings2, title: "Granular Control", desc: "Pause, resume, and inspect the history of every single workflow run." },
];

const FADE_UP: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } } };
const STAGGER: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };

export default function FeaturesPage() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="show" variants={STAGGER} className="text-center max-w-3xl mx-auto mb-20">
        <motion.h1 variants={FADE_UP} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Powerful features, zero complexity</motion.h1>
        <motion.p variants={FADE_UP} className="text-lg text-[var(--muted)]">Everything you need to automate your business processes, all in one unified platform.</motion.p>
      </motion.div>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={STAGGER} className="space-y-24 mb-24">
        {BIG_FEATURES.map((feat, i) => (
          <motion.div key={feat.title} variants={FADE_UP} className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-light)] mb-6">
                <feat.icon className="h-6 w-6 text-[var(--brand)]" />
              </div>
              <h2 className="text-3xl font-bold mb-4">{feat.title}</h2>
              <p className="text-lg text-[var(--muted)] leading-relaxed">{feat.desc}</p>
            </div>
            <div className="flex-1 w-full aspect-video rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border-strong)] flex items-center justify-center p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand)]/10 to-transparent" />
              <p className="text-[var(--subtle)] text-sm font-medium">Interactive Demo Visualization</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={STAGGER} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GRID_FEATURES.map(feat => (
          <motion.div key={feat.title} variants={FADE_UP} className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--brand-border)] transition-colors">
            <feat.icon className="h-6 w-6 text-[var(--brand)] mb-4" />
            <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
