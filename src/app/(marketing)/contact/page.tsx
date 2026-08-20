"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, MapPin } from "lucide-react";

const FADE_UP: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } } };
const STAGGER: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="show" variants={STAGGER} className="grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Info */}
        <div>
          <motion.h1 variants={FADE_UP} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Get in touch</motion.h1>
          <motion.p variants={FADE_UP} className="text-lg text-[var(--muted)] mb-12">Whether you have a question about features, pricing, or need a custom enterprise solution, our team is ready to answer all your questions.</motion.p>
          
          <motion.div variants={STAGGER} className="space-y-8">
            <motion.div variants={FADE_UP} className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)]">
                <Mail className="h-5 w-5 text-[var(--brand)]" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Email us</h3>
                <p className="text-sm text-[var(--muted)]">hello@flowra.app</p>
              </div>
            </motion.div>
            <motion.div variants={FADE_UP} className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)]">
                <MessageSquare className="h-5 w-5 text-[var(--brand)]" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Support</h3>
                <p className="text-sm text-[var(--muted)]">Available 24/7 for Enterprise customers.</p>
              </div>
            </motion.div>
            <motion.div variants={FADE_UP} className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)]">
                <MapPin className="h-5 w-5 text-[var(--brand)]" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Office</h3>
                <p className="text-sm text-[var(--muted)]">123 Workflow Way<br/>San Francisco, CA 94105</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Form */}
        <motion.div variants={FADE_UP} className="rounded-3xl border border-[var(--border-strong)] bg-[var(--surface)] p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Send a message</h2>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-[var(--muted)]">First Name</label>
                <Input placeholder="Jane" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-[var(--muted)]">Last Name</label>
                <Input placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-[var(--muted)]">Work Email</label>
              <Input type="email" placeholder="jane@company.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-[var(--muted)]">Message</label>
              <Textarea placeholder="How can we help you?" className="min-h-[120px]" />
            </div>
            <Button size="lg" className="w-full mt-4">Send Message</Button>
          </form>
        </motion.div>

      </motion.div>
    </div>
  );
}
