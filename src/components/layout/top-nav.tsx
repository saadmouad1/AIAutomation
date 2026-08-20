"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Bell, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/* ── Breadcrumb ─────────────────────────────────────── */
function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  const LABELS: Record<string, string> = {
    dashboard: "Overview", contacts: "Contacts", leads: "Leads",
    forms: "Forms", automations: "Automations", settings: "Settings",
    tasks: "Tasks", integrations: "Integrations", help: "Help",
    new: "New",
  };

  return (
    <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
      {parts.map((part, i) => {
        const href = "/" + parts.slice(0, i + 1).join("/");
        const isLast = i === parts.length - 1;
        const label = LABELS[part] ?? part;
        return (
          <React.Fragment key={href}>
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-[var(--subtle)]" />}
            {isLast ? (
              <span className="font-medium text-[var(--foreground)]">{label}</span>
            ) : (
              <Link href={href} className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* ── Theme toggle ──────────────────────────────────── */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-8 w-8" />;

  const THEMES = [
    { value: "light",  icon: Sun,     label: "Light" },
    { value: "dark",   icon: Moon,    label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ] as const;

  const current = THEMES.find(t => t.value === theme) ?? THEMES[2];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle theme">
          <current.icon className="h-4 w-4 text-[var(--muted)]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map(t => (
          <DropdownMenuItem
            key={t.value}
            className={cn("gap-2 cursor-pointer", theme === t.value && "text-[var(--brand)]")}
            onClick={() => setTheme(t.value)}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ── TopNav ─────────────────────────────────────────── */
export function TopNav() {
  return (
    <header className="flex h-[var(--topbar-height,60px)] shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6">
      <Breadcrumbs />
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4 text-[var(--muted)]" />
        </Button>
        <ThemeToggle />
        {/* Avatar */}
        <div className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand)] text-white text-xs font-bold">
          S
        </div>
      </div>
    </header>
  );
}
