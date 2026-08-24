"use client";

import { motion } from "framer-motion";
import { Webhook, Filter, Zap, LayoutTemplate, Layers, Lock, Plug, Clock, Settings2, ArrowRight } from "lucide-react";
import { InteractiveWorkflowDemo } from "@/components/animations/interactive-workflow-demo";
import { useEffect, useState } from "react";

// Mini Typing Animation Component
function AIChatDemo() {
  const [text, setText] = useState("");
  const fullText = "When a new lead fills the contact form, route them to the enterprise team if company size > 1000, otherwise send to general sales.";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.substring(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl shadow-2xl overflow-hidden font-sans">
      <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-overlay)] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--brand)]/10 flex items-center justify-center">
          <Zap className="w-4 h-4 text-[var(--brand)]" />
        </div>
        <div>
          <div className="text-xs font-semibold text-[var(--foreground)]">Flowra AI</div>
          <div className="text-[10px] text-[var(--muted)]">Describe your workflow</div>
        </div>
      </div>
      <div className="p-6 h-32">
        <p className="text-sm text-[var(--foreground)] leading-relaxed">
          {text}
          <span className="inline-block w-1 h-4 ml-1 bg-[var(--brand)] animate-pulse" />
        </p>
      </div>
      <div className="p-4 bg-[var(--surface-elevated)] border-t border-[var(--border)] flex justify-between items-center">
        <div className="flex gap-2">
          <div className="w-16 h-2 rounded-full bg-[var(--border-strong)]" />
          <div className="w-10 h-2 rounded-full bg-[var(--border-strong)]" />
        </div>
        <div className="px-3 py-1.5 rounded-md bg-[var(--brand)] text-white text-xs font-semibold">Generate</div>
      </div>
    </div>
  );
}

// Mini Routing Animation Component
function RoutingDemo() {
  return (
    <div className="w-full max-w-lg mx-auto h-64 relative flex items-center justify-center">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)] flex items-center justify-center z-10 shadow-lg">
        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center"><Filter className="w-4 h-4 text-blue-500" /></div>
      </div>
      
      {/* Animated Paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <motion.path
          d="M 80 128 L 200 128 L 200 64 L 320 64"
          stroke="var(--brand)"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 80 128 L 200 128 L 200 192 L 320 192"
          stroke="var(--muted)"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      
      <div className="absolute right-4 top-10 w-48 bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl p-3 shadow-lg flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[var(--brand)] animate-ping" />
        <div>
          <div className="text-xs font-bold text-[var(--foreground)]">Enterprise Team</div>
          <div className="text-[10px] text-[var(--muted)]">Size &gt; 1000</div>
        </div>
      </div>

      <div className="absolute right-4 bottom-10 w-48 bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl p-3 shadow-lg flex items-center gap-3 opacity-50">
        <div className="w-2 h-2 rounded-full bg-[var(--muted)]" />
        <div>
          <div className="text-xs font-bold text-[var(--foreground)]">General Sales</div>
          <div className="text-[10px] text-[var(--muted)]">Default route</div>
        </div>
      </div>
    </div>
  );
}

const BIG_FEATURES = [
  {
    icon: Webhook, title: "Visual Automation Engine", 
    desc: "Build complex workflows by just dragging and dropping blocks. No coding required. Connect apps, add conditions, and let Flowra handle the rest.",
    visual: <InteractiveWorkflowDemo />
  },
  {
    icon: Filter, title: "Smart Logic & Routing", 
    desc: "Route leads to the right sales rep based on company size, or send different email sequences based on user behavior. Branching logic made easy.",
    visual: <RoutingDemo />
  },
  {
    icon: Zap, title: "Natural Language Builder", 
    desc: "Just tell Flowra what you want to automate in plain English. 'When someone fills out my form, add them to Mailchimp and send me a Slack message.' Flowra builds it instantly.",
    visual: <AIChatDemo />
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
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <motion.div initial="hidden" animate="show" variants={STAGGER} className="text-center max-w-3xl mx-auto mb-20">
        <motion.h1 variants={FADE_UP} className="text-4xl md:text-6xl font-black font-heading tracking-tighter mb-6">Powerful features,<br/><span className="text-gradient-brand">zero complexity</span></motion.h1>
        <motion.p variants={FADE_UP} className="text-lg md:text-xl text-[var(--muted)] font-medium">Everything you need to automate your business processes, all in one unified platform.</motion.p>
      </motion.div>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={STAGGER} className="space-y-32 mb-32">
        {BIG_FEATURES.map((feat, i) => (
          <motion.div key={feat.title} variants={FADE_UP} className={`flex flex-col lg:flex-row items-center gap-12 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
            <div className="flex-1 max-w-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand)]/10 mb-6 border border-[var(--brand)]/20 shadow-[0_0_15px_rgba(99,91,255,0.15)]">
                <feat.icon className="h-6 w-6 text-[var(--brand)]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">{feat.title}</h2>
              <p className="text-lg text-[var(--muted)] leading-relaxed">{feat.desc}</p>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand)]/20 to-transparent blur-3xl opacity-30 -z-10 rounded-full" />
              <div className="relative w-full rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border-strong)] p-2 shadow-2xl glass-panel">
                <div className="w-full bg-[var(--background)] rounded-2xl overflow-hidden relative border border-[var(--border)] p-4 sm:p-8 flex items-center justify-center min-h-[350px]">
                  {feat.visual}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="relative py-24 mb-12">
        <div className="absolute inset-0 bg-[var(--brand)]/5 rounded-[3rem] -z-10" />
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Plus everything else you expect</h2>
        </div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={STAGGER} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
          {GRID_FEATURES.map(feat => (
            <motion.div key={feat.title} variants={FADE_UP} className="spotlight-card p-8 group cursor-default">
              <div className="spotlight-content">
                <feat.icon className="h-6 w-6 text-[var(--brand)] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2 text-[var(--foreground)]">{feat.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
