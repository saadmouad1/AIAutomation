"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function MarketingHeader() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
      scrolled ? "bg-[var(--surface)]/80 backdrop-blur-md border-[var(--border)] shadow-sm py-3" : "bg-transparent border-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image src="/brand/favicon.jpg" alt="Flowra Icon" width={32} height={32} className="rounded-lg shadow-sm" />
          <Image src="/brand/flowra-logo.jpg" alt="Flowra Logo" width={100} height={24} className="object-contain dark:invert" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/features" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Features</Link>
          <Link href="/pricing" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Pricing</Link>
          <Link href="/about" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">About Us</Link>
          <Link href="/contact" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Start free trial</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function MarketingFooter() {
  return (
    <footer className="bg-[var(--surface-elevated)] border-t border-[var(--border)] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src="/brand/favicon.jpg" alt="Flowra Icon" width={32} height={32} className="rounded-lg shadow-sm" />
              <Image src="/brand/flowra-logo.jpg" alt="Flowra Logo" width={100} height={24} className="object-contain dark:invert" />
            </Link>
            <p className="text-[var(--muted)] text-sm max-w-sm leading-relaxed mb-6">
              Flowra connects your business tools, understands your workflows, and turns repetitive work into automation — without the complexity.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--foreground)] mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li><Link href="/features" className="hover:text-[var(--brand)] transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-[var(--brand)] transition-colors">Pricing</Link></li>
              <li><Link href="/changelog" className="hover:text-[var(--brand)] transition-colors">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--foreground)] mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li><Link href="/about" className="hover:text-[var(--brand)] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--brand)] transition-colors">Contact</Link></li>
              <li><Link href="/legal" className="hover:text-[var(--brand)] transition-colors">Privacy & Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--muted)]">
          <p>© {new Date().getFullYear()} Flowra Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Twitter</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <MarketingHeader />
      <main className="flex-1">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
