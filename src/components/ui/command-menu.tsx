"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Webhook, Users, TrendingUp, FileText,
  Settings, Moon, Sun, Monitor, Plus, Search
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COMMANDS = [
  { group: "Navigate",   icon: LayoutDashboard, label: "Go to Dashboard",   href: "/dashboard" },
  { group: "Navigate",   icon: Webhook,          label: "Go to Automations", href: "/dashboard/automations" },
  { group: "Navigate",   icon: Users,            label: "Go to Contacts",    href: "/dashboard/contacts" },
  { group: "Navigate",   icon: TrendingUp,       label: "Go to Leads",       href: "/dashboard/leads" },
  { group: "Navigate",   icon: FileText,         label: "Go to Forms",       href: "/dashboard/forms" },
  { group: "Navigate",   icon: Settings,         label: "Go to Settings",    href: "/dashboard/settings" },
  { group: "Create",     icon: Plus,             label: "Create workflow",    href: "/dashboard/automations/new" },
  { group: "Create",     icon: Plus,             label: "Create form",        href: "/dashboard/forms/new" },
];

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [search, setSearch] = React.useState("");

  // Close on Escape — handled by Dialog; reset search on open
  React.useEffect(() => {
    if (open) setSearch("");
  }, [open]);

  function runCommand(fn: () => void) {
    onOpenChange(false);
    fn();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      {/* Panel */}
      <div className="relative w-full max-w-lg animate-scale-in">
        <Command
          className={cn(
            "rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)]",
            "bg-[var(--surface-elevated)] border border-[var(--border-strong)]"
          )}
          shouldFilter
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
            <Search className="h-4 w-4 text-[var(--muted)] shrink-0" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search or type a command..."
              className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none"
            />
            <kbd className="hidden sm:flex h-5 items-center rounded-[4px] border border-[var(--border-strong)] px-1.5 text-[10px] text-[var(--muted)] font-mono">ESC</kbd>
          </div>
          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-[var(--muted)]">
              No results found.
            </Command.Empty>
            {["Navigate", "Create"].map((group) => (
              <Command.Group
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--muted)]"
              >
                {COMMANDS.filter((c) => c.group === group).map((cmd) => (
                  <Command.Item
                    key={cmd.href}
                    value={cmd.label}
                    onSelect={() => runCommand(() => router.push(cmd.href))}
                    className={cn(
                      "flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-[var(--foreground)] cursor-pointer",
                      "hover:bg-[var(--surface-overlay)] aria-selected:bg-[var(--brand-light)] aria-selected:text-[var(--brand)]",
                      "transition-colors duration-100"
                    )}
                  >
                    <cmd.icon className="h-4 w-4 text-[var(--muted)]" />
                    {cmd.label}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
            <Command.Group
              heading="Theme"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--muted)]"
            >
              {[
                { label: "Dark mode",   icon: Moon,    value: "dark" },
                { label: "Light mode",  icon: Sun,     value: "light" },
                { label: "System mode", icon: Monitor, value: "system" },
              ].map((t) => (
                <Command.Item
                  key={t.value}
                  value={`theme ${t.label}`}
                  onSelect={() => runCommand(() => setTheme(t.value))}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-[var(--foreground)] cursor-pointer",
                    "hover:bg-[var(--surface-overlay)] aria-selected:bg-[var(--brand-light)] aria-selected:text-[var(--brand)]",
                    "transition-colors duration-100"
                  )}
                >
                  <t.icon className="h-4 w-4 text-[var(--muted)]" />
                  {t.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <div className="flex items-center gap-3 px-4 py-2.5 border-t border-[var(--border)] text-[10px] text-[var(--subtle)]">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>ESC close</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
