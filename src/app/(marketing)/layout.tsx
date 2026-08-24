"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CosmicDustBackground } from "@/components/animations/hero-3d";
import { Globe } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function MarketingHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  
  // To avoid hydration mismatch on theme icons
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
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
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/features" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Features</Link>
          <Link href="/automations" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Automations</Link>
          <Link href="/pricing" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Pricing</Link>
          <Link href="/about" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">About Us</Link>
          <Link href="/contact" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {mounted && (
            <div className="flex items-center gap-1 border-r border-[var(--border)] pr-3 mr-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-[var(--muted)] hover:text-[var(--foreground)]"
                    title="Change Language"
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>العربية</DropdownMenuItem>
                  <DropdownMenuItem>Español</DropdownMenuItem>
                  <DropdownMenuItem>Français</DropdownMenuItem>
                  <DropdownMenuItem>Deutsch</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex rounded-full">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild className="rounded-full shadow-[0_0_12px_rgba(99,91,255,0.25)]">
            <Link href="/register">Start free trial</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function MarketingFooter() {
  return (
    <footer className="relative bg-[var(--surface-elevated)] border-t border-[var(--border-strong)] pt-20 pb-10 overflow-hidden">
      {/* Subtle brand glow in footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--brand)]/5 blur-[100px] rounded-[100%] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6 hover:opacity-90 transition-opacity">
              <Logo />
            </Link>
            <p className="text-[var(--muted)] text-sm max-w-sm leading-relaxed mb-6">
              Flowra connects your business tools, understands your workflows, and turns repetitive work into automation — without the complexity.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--foreground)] mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li><Link href="/features" className="hover:text-[var(--brand)] transition-colors">Features</Link></li>
              <li><Link href="/automations" className="hover:text-[var(--brand)] transition-colors">Automation Products</Link></li>
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
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Cosmic Dust background restricted to marketing pages */}
      <CosmicDustBackground className="fixed inset-0 z-[-1] opacity-60" />
      {/* Subtle vignette */}
      <div
        className="fixed inset-0 z-[0] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, rgba(3,5,9,0.7) 100%)",
        }}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <MarketingHeader />
        <main className="flex-1">
          {children}
        </main>
        <MarketingFooter />
      </div>
    </div>
  );
}
