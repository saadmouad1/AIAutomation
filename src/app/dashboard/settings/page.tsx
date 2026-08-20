"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useFlowraTheme } from "@/components/providers/theme-provider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Monitor, Settings, User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENTS = [
  { id: "purple", label: "Flowra Purple", color: "#635BFF" },
  { id: "blue",   label: "Blue",          color: "#4F46E5" },
  { id: "cyan",   label: "Cyan",          color: "#06B6D4" },
  { id: "green",  label: "Green",         color: "#22C55E" },
  { id: "orange", label: "Orange",        color: "#F59E0B" },
  { id: "rose",   label: "Rose",          color: "#F43F5E" },
] as const;

function ThemeButton({ value, icon: Icon, label, current }: { value: string; icon: React.ElementType; label: string; current: string | undefined }) {
  const { setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(value)}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] border text-sm font-medium transition-all duration-150",
        current === value
          ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]"
          : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export default function SettingsPage() {
  const { theme } = useTheme();
  const { accent, setAccent } = useFlowraTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <Settings className="h-5 w-5 text-[var(--brand)]" />
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Settings</h1>
        </div>
        <p className="text-sm text-[var(--muted)]">Manage your account and workspace preferences</p>
      </div>

      <Tabs defaultValue="appearance">
        <TabsList>
          <TabsTrigger value="appearance"><Sun className="h-3.5 w-3.5 mr-1.5" />Appearance</TabsTrigger>
          <TabsTrigger value="profile"><User className="h-3.5 w-3.5 mr-1.5" />Profile</TabsTrigger>
          <TabsTrigger value="organization"><Building2 className="h-3.5 w-3.5 mr-1.5" />Organization</TabsTrigger>
        </TabsList>

        {/* ── Appearance ── */}
        <TabsContent value="appearance">
          <Card className="divide-y divide-[var(--border)]">
            {/* Theme */}
            <div className="p-5">
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-0.5">Theme</h2>
              <p className="text-xs text-[var(--muted)] mb-4">Choose how Flowra looks on your device.</p>
              {mounted && (
                <div className="flex flex-wrap gap-2">
                  <ThemeButton value="system" icon={Monitor} label="System" current={theme} />
                  <ThemeButton value="light"  icon={Sun}     label="Light"  current={theme} />
                  <ThemeButton value="dark"   icon={Moon}    label="Dark"   current={theme} />
                </div>
              )}
            </div>

            {/* Accent color */}
            <div className="p-5">
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-0.5">Accent color</h2>
              <p className="text-xs text-[var(--muted)] mb-4">Customize the primary color across the interface.</p>
              <div className="flex flex-wrap gap-3">
                {ACCENTS.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAccent(a.id as typeof accent)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border text-xs font-medium transition-all duration-150",
                      accent === a.id
                        ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]"
                        : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <span className="h-3.5 w-3.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="p-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[var(--foreground)]">Email notifications</h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">Receive workflow run summaries by email</p>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </TabsContent>

        {/* ── Profile ── */}
        <TabsContent value="profile">
          <Card className="p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Profile information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Full name</label>
                <Input defaultValue="Saad Mouad" />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Email</label>
                <Input defaultValue="saad@flowra.app" type="email" />
              </div>
            </div>
            <Button size="sm">Save changes</Button>
          </Card>
        </TabsContent>

        {/* ── Organization ── */}
        <TabsContent value="organization">
          <Card className="p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Organization details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Organization name</label>
                <Input defaultValue="My Organization" />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Slug</label>
                <Input defaultValue="my-org" />
              </div>
            </div>
            <Button size="sm">Save changes</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
