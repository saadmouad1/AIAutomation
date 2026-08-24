import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";
import { Node } from "@xyflow/react";

interface NodeConfigPanelProps {
  node: Node | null;
  onUpdate: (nodeId: string, data: any) => void;
  onClose: () => void;
}

export function NodeConfigPanel({ node, onUpdate, onClose }: NodeConfigPanelProps) {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (node) {
      setData(node.data || {});
    }
  }, [node]);

  if (!node) return null;

  const handleChange = (key: string, value: any) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    onUpdate(node.id, newData);
  };

  const renderConfig = () => {
    switch (node.type) {
      case "LOG":
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Message</label>
              <textarea
                value={data.message || ""}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Message to log..."
                className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand min-h-[100px]"
              />
            </div>
          </div>
        );

      case "SET_VALUE":
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Key</label>
              <input
                type="text"
                value={data.key || ""}
                onChange={(e) => handleChange("key", e.target.value)}
                placeholder="e.g. customerName"
                className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Value</label>
              <textarea
                value={data.value || ""}
                onChange={(e) => handleChange("value", e.target.value)}
                placeholder="Value to set..."
                className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand min-h-[100px]"
              />
            </div>
          </div>
        );

      case "TRANSFORM":
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Input Key</label>
              <input
                type="text"
                value={data.inputKey || ""}
                onChange={(e) => handleChange("inputKey", e.target.value)}
                placeholder="e.g. customerName"
                className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Output Key</label>
              <input
                type="text"
                value={data.outputKey || ""}
                onChange={(e) => handleChange("outputKey", e.target.value)}
                placeholder="e.g. transformedName"
                className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Operation</label>
              <select
                value={data.operation || "UPPERCASE"}
                onChange={(e) => handleChange("operation", e.target.value)}
                className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="UPPERCASE">UPPERCASE</option>
                <option value="LOWERCASE">LOWERCASE</option>
                <option value="TRIM">TRIM</option>
                <option value="TO_NUMBER">TO_NUMBER</option>
              </select>
            </div>
          </div>
        );

      case "CONDITION":
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Input Key</label>
              <input
                type="text"
                value={data.inputKey || ""}
                onChange={(e) => handleChange("inputKey", e.target.value)}
                placeholder="e.g. orderValue"
                className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Operator</label>
              <select
                value={data.operator || "EQUALS"}
                onChange={(e) => handleChange("operator", e.target.value)}
                className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="EQUALS">EQUALS</option>
                <option value="NOT_EQUALS">NOT_EQUALS</option>
                <option value="CONTAINS">CONTAINS</option>
                <option value="GREATER_THAN">GREATER_THAN</option>
                <option value="LESS_THAN">LESS_THAN</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Compare Value</label>
              <input
                type="text"
                value={data.compareValue || ""}
                onChange={(e) => handleChange("compareValue", e.target.value)}
                placeholder="Value to compare against"
                className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div className="mt-4 rounded-md bg-surface p-3 text-xs text-text-muted border border-surface-border">
              Nodes connected to the <strong>TRUE</strong> handle execute if the condition passes. Nodes connected to <strong>FALSE</strong> execute otherwise.
            </div>
          </div>
        );

      case "HTTP_REQUEST":
        return (
          <div className="space-y-4">
            <div className="rounded-md bg-blue-500/10 border border-blue-500/20 p-3 flex gap-2 text-blue-500">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="text-xs">
                External HTTP requests are subject to server-side security and SSRF protection.
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Method</label>
              <select
                value={data.method || "GET"}
                onChange={(e) => handleChange("method", e.target.value)}
                className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">URL</label>
              <input
                type="text"
                value={data.url || ""}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="https://api.example.com/data"
                className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Headers (JSON)</label>
              <textarea
                value={data.headers || ""}
                onChange={(e) => handleChange("headers", e.target.value)}
                placeholder='{"Authorization": "Bearer token"}'
                className="w-full font-mono rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand min-h-[80px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Body (JSON)</label>
              <textarea
                value={data.body || ""}
                onChange={(e) => handleChange("body", e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full font-mono rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand min-h-[120px]"
              />
            </div>
          </div>
        );

      case "AI_GENERATE":
        return (
          <div className="space-y-4">
            <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3 flex gap-2 text-amber-500">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="text-xs">
                Execution of this node consumes your configured AI provider quota.
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">System Prompt (Optional)</label>
              <textarea
                value={data.systemPrompt || ""}
                onChange={(e) => handleChange("systemPrompt", e.target.value)}
                placeholder="You are a helpful assistant..."
                className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand min-h-[80px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Prompt</label>
              <textarea
                value={data.prompt || ""}
                onChange={(e) => handleChange("prompt", e.target.value)}
                placeholder="What is the meaning of life?"
                className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand min-h-[120px]"
              />
            </div>
          </div>
        );

      case "START":
      case "END":
        return (
          <div className="text-sm text-text-muted italic p-4 text-center border rounded-md border-dashed border-surface-border">
            No configuration available for this node type.
          </div>
        );

      default:
        return (
          <div className="text-sm text-text-muted italic p-4 text-center border rounded-md border-dashed border-surface-border">
            Unknown node type.
          </div>
        );
    }
  };

  return (
    <div className="flex h-full w-80 flex-col border-l border-surface-border bg-surface-elevated overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-surface-border sticky top-0 bg-surface-elevated/95 backdrop-blur z-10">
        <div>
          <h2 className="font-semibold text-text-primary">Configure Node</h2>
          <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">{node.type}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-text-muted">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">Node Title (Optional)</label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder={`e.g. ${node.type} step`}
            className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">Description (Optional)</label>
          <textarea
            value={data.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe what this node does"
            className="w-full rounded-md border border-surface-border bg-surface p-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand min-h-[60px]"
          />
        </div>

        <div className="border-t border-surface-border pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
            Node Settings
          </h3>
          {renderConfig()}
        </div>

        <div className="border-t border-surface-border pt-4">
          <div className="rounded-md bg-surface p-3 border border-surface-border">
            <h4 className="text-xs font-semibold text-text-primary mb-1">Context Reference</h4>
            <p className="text-[11px] text-text-muted">
              Use <code className="bg-surface-elevated px-1 py-0.5 rounded text-text-primary">{"{{key}}"}</code> to reference variables from the execution context in compatible fields.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
