"use client";

import { useEffect, useState, useCallback } from "react";
import { WorkflowExecutionRecord } from "@/types/automations";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ExecutionHistoryProps {
  orgId: string;
  workflowId: string;
}

export function ExecutionHistory({ orgId, workflowId }: ExecutionHistoryProps) {
  const [executions, setExecutions] = useState<WorkflowExecutionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExecutions = useCallback(async () => {
    try {
      const res = await fetch(`/api/organizations/${orgId}/executions?workflowId=${workflowId}`);
      if (!res.ok) throw new Error("Failed to fetch executions");
      const data = await res.json();
      setExecutions(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [orgId, workflowId]);

  useEffect(() => {
    fetchExecutions();
  }, [fetchExecutions]);

  useEffect(() => {
    const hasRunning = executions.some(e => e.status === "RUNNING" || e.status === "PENDING");
    if (!hasRunning) return;

    const interval = setInterval(() => {
      fetchExecutions();
    }, 5000);

    return () => clearInterval(interval);
  }, [executions, fetchExecutions]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8 text-text-muted">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error/10 text-error rounded-lg text-sm border border-error/20">
        {error}
      </div>
    );
  }

  if (executions.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-surface-border rounded-xl">
        <p className="text-sm text-text-muted">No executions yet.</p>
        <p className="text-xs text-text-muted mt-1">Run the workflow or trigger a webhook to see history here.</p>
      </div>
    );
  }

  const getStatusType = (status: string) => {
    switch (status) {
      case "SUCCESS": return "active";
      case "FAILED": return "error";
      case "RUNNING": return "pending";
      case "PENDING": return "pending";
      default: return "draft";
    }
  };

  return (
    <div className="rounded-xl border border-surface-border overflow-hidden bg-surface">
      <table className="w-full text-sm text-left">
        <thead className="bg-surface-elevated text-xs uppercase text-text-muted border-b border-surface-border">
          <tr>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Started</th>
            <th className="px-4 py-3 font-medium">Duration</th>
            <th className="px-4 py-3 font-medium">Version</th>
            <th className="px-4 py-3 font-medium">Trigger</th>
            <th className="px-4 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {executions.map((exec) => (
            <tr key={exec.id} className="hover:bg-surface-elevated/50 transition-colors group">
              <td className="px-4 py-3">
                <StatusIndicator status={getStatusType(exec.status)} />
              </td>
              <td className="px-4 py-3 text-text-primary whitespace-nowrap">
                {exec.startedAt ? new Date(exec.startedAt).toLocaleString() : "-"}
              </td>
              <td className="px-4 py-3 text-text-muted">
                {exec.completedAt && exec.startedAt
                  ? `${Math.max(0, new Date(exec.completedAt).getTime() - new Date(exec.startedAt).getTime())}ms`
                  : "-"}
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className="text-[10px]">v{exec.workflowVersion}</Badge>
              </td>
              <td className="px-4 py-3 text-text-muted capitalize">
                {String((exec.input as any)?.source || 'manual')}
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/dashboard/automations/${workflowId}/executions/${exec.id}`}>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    View <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
