"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

const FADE_UP: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } } };
const STAGGER: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };

export default function PricingPage() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="show" variants={STAGGER} className="text-center max-w-3xl mx-auto mb-16">
        <motion.h1 variants={FADE_UP} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Simple, transparent pricing</motion.h1>
        <motion.p variants={FADE_UP} className="text-lg text-[var(--muted)]">Choose the plan that fits your business. Scale as you grow.</motion.p>
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={STAGGER} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {TIERS.map((tier) => (
          <motion.div key={tier.name} variants={FADE_UP} className={`relative rounded-3xl p-8 border ${tier.popular ? "border-[var(--brand)] shadow-[var(--shadow-brand)] bg-[var(--surface)]" : "border-[var(--border-strong)] bg-[var(--surface-elevated)]"}`}>
            {tier.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-[var(--brand)] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
            <p className="text-sm text-[var(--muted)] mb-6 h-10">{tier.description}</p>
            <div className="mb-8">
              <span className="text-4xl font-bold">{tier.price}</span>
              {tier.price !== "Custom" && <span className="text-[var(--muted)] font-medium">/month</span>}
            </div>
            <Button variant={tier.popular ? "primary" : "secondary"} className="w-full mb-8" size="lg" asChild>
              <Link href="/register">{tier.price === "Custom" ? "Contact Sales" : "Get Started"}</Link>
            </Button>
            <ul className="space-y-4">
              {tier.features.map(f => (
                <li key={f} className="flex items-start gap-3 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-[var(--brand)] shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
