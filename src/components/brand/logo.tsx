"use client";

import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  withText?: boolean;
}

/**
 * FLOWRA Mark
 * ────────────────────────────────────────────────────────
 * Concept: "Many inputs, one unified output" — the core
 * metaphor of a workflow automation platform. Two data streams
 * converge into a single directed beam. Abstract, tech-forward,
 * non-letterform. Brand color marks the output (the "value created").
 *
 * Built to work at all sizes: sidebar (32×32 with text),
 * favicon (32×32 icon-only), og-image (scaled up).
 */
export function Logo({ className = "", withText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex-shrink-0 h-8 w-8">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Input stream A */}
          <motion.path
            d="M3 10 C9 10 12 16 16 16"
            stroke="var(--foreground)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Input stream B */}
          <motion.path
            d="M3 22 C9 22 12 16 16 16"
            stroke="var(--foreground)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Unified output — brand accent */}
          <motion.path
            d="M16 16 L27 16"
            stroke="var(--brand)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Arrowhead */}
          <motion.path
            d="M23.5 12.5 L27 16 L23.5 19.5"
            stroke="var(--brand)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </div>

      {withText && (
        <span
          aria-label="Flowra"
          className="font-heading font-bold text-[var(--foreground)] leading-none"
          style={{
            fontSize: "1.15rem",
            letterSpacing: "-0.04em",
          }}
        >
          flowra
        </span>
      )}
    </div>
  );
}
