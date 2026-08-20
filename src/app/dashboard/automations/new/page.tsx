"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkflowCanvas } from "@/components/automations/workflow-canvas";
import { GlassCard } from "@/components/ui/glass-card";
import { WorkflowStep } from "@/types/automations";
import { TEMPLATE_AUTOMATIONS } from "@/lib/mock/automations";
import { Sparkles, Webhook, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const PROMPTS = [
  "Capture leads from my website form",
  "Send a confirmation when someone submits a form",
  "Notify my team about high-priority requests",
  "Create a task when a customer needs follow-up",
];

function matchTemplate(prompt: string): typeof TEMPLATE_AUTOMATIONS[number] | null {
  const lower = prompt.toLowerCase();
  if (lower.includes("lead") || lower.includes("form") || lower.includes("capture")) return TEMPLATE_AUTOMATIONS[0];
  if (lower.includes("follow") || lower.includes("task") || lower.includes("response")) return TEMPLATE_AUTOMATIONS[1];
  return TEMPLATE_AUTOMATIONS[Math.floor(Math.random() * TEMPLATE_AUTOMATIONS.length)];
}

export default function NewAutomationPage() {
  const router = useRouter();
  const [prompt, setPrompt] = React.useState("");
  const [suggested, setSuggested] = React.useState<{ name: string; steps: WorkflowStep[] } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  async function handleDescribe() {
    if (!prompt.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate analysis
    const template = matchTemplate(prompt);
    if (template) setSuggested({ name: template.name, steps: template.steps });
    setLoading(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => router.push("/dashboard/automations"), 1000);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Create workflow</h1>
        <p className="text-sm text-[var(--muted)] mt-1">Build a workflow step by step or describe what you need.</p>
      </div>

      <Tabs defaultValue="describe">
        <TabsList>
          <TabsTrigger value="describe"><Sparkles className="h-3.5 w-3.5 mr-1.5" />Describe it</TabsTrigger>
          <TabsTrigger value="build"><Webhook className="h-3.5 w-3.5 mr-1.5" />Build manually</TabsTrigger>
        </TabsList>

        {/* ── Describe it tab (Phase 5) ─────────────────── */}
        <TabsContent value="describe">
          <GlassCard className="p-6 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-1">Describe what you want to automate</h2>
              <p className="text-xs text-[var(--muted)] mb-3">Write in plain language. Flowra will suggest the best workflow.</p>
              <Textarea
                placeholder="e.g. Whenever someone submits my contact form, create a lead and send a confirmation email..."
                className="min-h-[100px]"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>
            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2">
              {PROMPTS.map(p => (
                <button key={p} onClick={() => setPrompt(p)}
                  className="text-xs px-3 py-1.5 rounded-full border border-[var(--border-strong)] text-[var(--muted)] hover:border-[var(--brand-border)] hover:text-[var(--brand)] transition-all duration-150 cursor-pointer">
                  {p}
                </button>
              ))}
            </div>
            <Button onClick={handleDescribe} disabled={!prompt.trim() || loading} className="w-full">
              {loading ? "Analyzing..." : <><ArrowRight className="h-4 w-4" /> Suggest workflow</>}
            </Button>
          </GlassCard>

          {/* Suggested result */}
          {suggested && (
            <div className="mt-6 rounded-[var(--radius-xl)] border border-[var(--brand-border)] bg-[var(--brand-light)]/30 p-6 space-y-4 animate-fade-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--brand)] mb-1">Suggested workflow</p>
                  <h3 className="text-base font-bold text-[var(--foreground)]">{suggested.name}</h3>
                </div>
                <Button onClick={handleSave} variant="brand_outline" size="sm" disabled={saved}>
                  {saved ? <><Check className="h-4 w-4" /> Saved!</> : "Save workflow"}
                </Button>
              </div>
              <WorkflowCanvas steps={suggested.steps} />
            </div>
          )}
        </TabsContent>

        {/* ── Build manually tab ─────────────────────────── */}
        <TabsContent value="build">
          <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-[var(--foreground)] mb-1 block">Workflow name</label>
              <Input placeholder="e.g. Lead Qualification" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--foreground)] mb-1 block">Description</label>
              <Textarea placeholder="Describe what this workflow does..." className="min-h-[80px]" />
            </div>
            <p className="text-xs text-[var(--muted)] bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-3">
              Visual step builder coming in the next update. Use the "Describe it" tab for now to auto-generate a workflow.
            </p>
            <Button className="w-full" disabled>Create workflow</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
