"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { Sparkles, Webhook, ArrowRight, Loader2, Play, CheckSquare, Terminal, Variable, Type, Split, Globe, AlertTriangle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const nodeIcons: Record<string, React.ElementType> = {
  START: Play,
  END: CheckSquare,
  LOG: Terminal,
  SET_VALUE: Variable,
  TRANSFORM: Type,
  CONDITION: Split,
  HTTP_REQUEST: Globe,
  AI_GENERATE: Sparkles,
};

export default function NewAutomationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgId = searchParams.get("orgId");
  
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  
  // AI Generate state
  const [aiPrompt, setAiPrompt] = React.useState("");
  const [aiGenerating, setAiGenerating] = React.useState(false);
  const [aiResult, setAiResult] = React.useState<{ nodes: any[], edges: any[] } | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (!orgId) {
      toast.error("Organization ID is missing.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/organizations/${orgId}/workflows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Failed to create workflow");
      }

      const data = await res.json();
      toast.success("Workflow created");
      router.push(`/dashboard/automations/${data.data.id}`);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      setLoading(false);
    }
  }

  async function handleAiGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    if (!orgId) {
      toast.error("Organization ID is missing.");
      return;
    }

    setAiGenerating(true);
    setAiResult(null);
    try {
      const res = await fetch(`/api/organizations/${orgId}/workflows/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Failed to generate workflow");
      }

      const data = await res.json();
      setAiResult({ nodes: data.data.nodes, edges: data.data.edges });
      toast.success("Workflow structure generated");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setAiGenerating(false);
    }
  }

  async function handleInsertGenerated() {
    if (!aiResult) return;
    if (!orgId) return;

    setLoading(true);
    try {
      // Use the prompt as a default name if not provided elsewhere, or generate a generic one
      const workflowName = aiPrompt.slice(0, 30) + (aiPrompt.length > 30 ? "..." : "") || "AI Generated Workflow";
      
      const res = await fetch(`/api/organizations/${orgId}/workflows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: workflowName, 
          description: `Generated from prompt: ${aiPrompt}`,
          nodes: aiResult.nodes,
          edges: aiResult.edges
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Failed to create workflow");
      }

      const data = await res.json();
      toast.success("Workflow created from AI design");
      router.push(`/dashboard/automations/${data.data.id}`);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up pb-20">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Create workflow</h1>
        <p className="text-sm text-text-muted mt-1">Build a workflow step by step or describe what you need.</p>
      </div>

      <Tabs defaultValue="build">
        <TabsList>
          <TabsTrigger value="build"><Webhook className="h-3.5 w-3.5 mr-1.5" />Start from Scratch</TabsTrigger>
          <TabsTrigger value="describe"><Sparkles className="h-3.5 w-3.5 mr-1.5" />Generate with AI</TabsTrigger>
        </TabsList>

        {/* ── Build manually tab ─────────────────────────── */}
        <TabsContent value="build">
          <form onSubmit={handleCreate} className="rounded-xl border border-surface-border bg-surface p-6 space-y-4">
            <div>
              <label htmlFor="wf-name" className="text-xs font-medium text-text-primary mb-1 block">Workflow name</label>
              <Input 
                id="wf-name"
                placeholder="e.g. Lead Qualification" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="wf-desc" className="text-xs font-medium text-text-primary mb-1 block">Description</label>
              <Textarea 
                id="wf-desc"
                placeholder="Describe what this workflow does..." 
                className="min-h-[80px]" 
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-brand hover:bg-brand-hover text-white" disabled={loading || !name.trim()}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Create workflow
            </Button>
          </form>
        </TabsContent>

        {/* ── Describe it tab (AI) ─────────────────── */}
        <TabsContent value="describe">
          <GlassCard className="p-6 space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-text-primary">AI Workflow Generator</h2>
                <p className="text-xs text-text-muted mt-1">
                  Describe what you want to automate in plain English, and Flowra will build the graph for you.
                </p>
              </div>
            </div>

            <form onSubmit={handleAiGenerate} className="space-y-4">
              <Textarea 
                placeholder="e.g. Create a workflow that receives a webhook, transforms the customer name to uppercase, checks whether the order value is greater than 100, and sends an HTTP request." 
                className="min-h-[120px]" 
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white" disabled={aiGenerating || !aiPrompt.trim()}>
                {aiGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                {aiGenerating ? "Generating..." : "Generate Preview"}
              </Button>
            </form>

            {aiResult && (
              <div className="mt-8 pt-6 border-t border-surface-border space-y-4 animate-fade-up">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">Preview</h3>
                  <p className="text-xs text-text-muted mt-1">Review the generated nodes below. You can configure them fully in the builder.</p>
                </div>

                <div className="space-y-2">
                  {aiResult.nodes.map((node: any, idx: number) => {
                    const Icon = nodeIcons[node.type] || Play;
                    return (
                      <div key={node.id} className="flex items-center gap-3 p-3 rounded-lg border border-surface-border bg-surface shadow-sm">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-surface-border bg-surface-elevated text-text-muted">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-text-primary">{node.data?.title || node.type}</h4>
                          <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">{node.type}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-warning/10 text-warning p-3 rounded-lg border border-warning/20 text-xs flex gap-2 items-start mt-4">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <p>The workflow will be created in DRAFT mode. You must review, configure, and activate it before it will run.</p>
                </div>

                <Button onClick={handleInsertGenerated} disabled={loading} className="w-full bg-brand hover:bg-brand-hover text-white mt-4">
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                  Insert into Builder
                </Button>
              </div>
            )}
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
