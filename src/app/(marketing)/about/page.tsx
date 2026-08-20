"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const FADE_UP: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } } };
const STAGGER: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <motion.div initial="hidden" animate="show" variants={STAGGER} className="text-center mb-16">
        <motion.h1 variants={FADE_UP} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">We believe work should flow</motion.h1>
        <motion.p variants={FADE_UP} className="text-lg text-[var(--muted)]">Our mission is to eliminate repetitive tasks so people can focus on creative, meaningful work.</motion.p>
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={STAGGER} className="space-y-12 text-lg text-[var(--muted)] leading-relaxed">
        <motion.p variants={FADE_UP}>
          We started Flowra because we were tired of seeing brilliant teams bogged down by manual data entry, forgotten follow-ups, and disconnected tools. Software was supposed to make our lives easier, but instead, we found ourselves acting as the glue between a dozen different apps.
        </motion.p>
        <motion.p variants={FADE_UP}>
          We built Flowra to be the central nervous system for modern businesses. A place where your forms, contacts, and workflows live together in harmony. 
        </motion.p>
        <motion.div variants={FADE_UP} className="py-12 flex justify-center">
          <Image src="/brand/flowra-logo.jpg" alt="Flowra" width={200} height={48} className="opacity-80 dark:invert" />
        </motion.div>
        <motion.p variants={FADE_UP}>
          Today, thousands of companies rely on Flowra to handle millions of tasks every week. We're proud to give them their time back.
        </motion.p>
      </motion.div>
    </div>
  );
}
