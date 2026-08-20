"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Webhook, Users, TrendingUp, FileText,
  Settings, HelpCircle, Plug, CheckSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandMenu } from "@/components/ui/command-menu";

/* ── Nav structure ─────────────────────────────────── */
const NAV_MAIN = [
  { name: "Overview",     href: "/dashboard",                icon: LayoutDashboard },
  { name: "Automations",  href: "/dashboard/automations",    icon: Webhook },
  { name: "Leads",        href: "/dashboard/leads",          icon: TrendingUp },
  { name: "Forms",        href: "/dashboard/forms",          icon: FileText },
  { name: "Contacts",     href: "/dashboard/contacts",       icon: Users },
  { name: "Tasks",        href: "/dashboard/tasks",          icon: CheckSquare },
  { name: "Integrations", href: "/dashboard/integrations",   icon: Plug },
];

const NAV_BOTTOM = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help",     href: "/dashboard/help",     icon: HelpCircle },
];

import Image from "next/image";

/* ── Logo mark ─────────────────────────────────────── */
function FlowraLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-5 select-none hover:opacity-90 transition-opacity">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden shrink-0 shadow-[0_2px_10px_var(--shadow-sm)]">
        <Image src="/brand/favicon.jpg" alt="Flowra Icon" width={32} height={32} className="object-cover" />
      </div>
      <div className="flex flex-col">
        <Image src="/brand/flowra-logo.jpg" alt="Flowra Logo" width={100} height={24} className="object-contain -ml-1 dark:invert" />
      </div>
    </Link>
  );
}

function NavItem({ item, active }: { item: { name: string; href: string; icon: React.ElementType }; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-all duration-150",
        active
          ? "bg-[var(--brand-light)] text-[var(--brand)]"
          : "text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
      )}
    >
      <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-[var(--brand)]" : "text-[var(--muted)] group-hover:text-[var(--foreground)]")} />
      {item.name}
    </Link>
  );
}

/* ── Sidebar ────────────────────────────────────────── */
export function Sidebar() {
  const pathname = usePathname();
  const [cmdOpen, setCmdOpen] = React.useState(false);

  // Ctrl+K shortcut
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <>
      <aside className="flex h-full w-[var(--sidebar-width,256px)] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
        {/* Logo */}
        <FlowraLogo />

        {/* Search / Command trigger */}
        <div className="px-3 mb-2">
          <button
            onClick={() => setCmdOpen(true)}
            className="flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--muted)] bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all duration-150"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
            <span className="flex-1 text-left text-xs">Search...</span>
            <kbd className="hidden sm:flex h-4 items-center rounded border border-[var(--border-strong)] px-1 text-[9px] font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
          {NAV_MAIN.map((item) => (
            <NavItem key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-[var(--border)] my-2" />

        {/* Bottom nav */}
        <nav className="px-3 pb-2 space-y-0.5">
          {NAV_BOTTOM.map((item) => (
            <NavItem key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </nav>

        {/* User profile stub */}
        <div className="mx-3 mb-3 flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 bg-[var(--surface-elevated)] border border-[var(--border)]">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-white text-xs font-bold">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--foreground)] truncate">Saad Mouad</p>
            <p className="text-[10px] text-[var(--muted)] truncate">saad@flowra.app</p>
          </div>
        </div>
      </aside>

      <CommandMenu open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}
