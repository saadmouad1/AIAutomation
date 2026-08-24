"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Webhook, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface WebhookUrlCardProps {
  workflowId: string;
  isActive: boolean;
}

export function WebhookUrlCard({ workflowId, isActive }: WebhookUrlCardProps) {
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWebhookUrl(`${window.location.origin}/api/webhooks/${workflowId}`);
    }
  }, [workflowId]);

  if (!isActive) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      toast.success("Webhook URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-elevated overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 bg-surface p-3 border-b border-surface-border">
        <Webhook className="h-4 w-4 text-brand" />
        <h3 className="text-sm font-semibold text-text-primary">Webhook Trigger</h3>
      </div>
      <div className="p-4 space-y-4">
        <p className="text-sm text-text-muted">
          This endpoint triggers this workflow. Send a POST request to start an execution.
        </p>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 font-mono text-sm bg-surface p-2 rounded border border-surface-border truncate text-text-primary">
            {webhookUrl || "Loading..."}
          </div>
          <Button variant="secondary" size="icon" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-start gap-2 bg-warning/10 text-warning p-3 rounded-lg border border-warning/20">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="text-xs">
            Webhook authentication/signing is not implemented yet. Do not expose this endpoint publicly without additional protection.
          </p>
        </div>
      </div>
    </div>
  );
}
