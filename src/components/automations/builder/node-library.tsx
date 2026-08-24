import { Button } from "@/components/ui/button";
import { Play, CheckSquare, Terminal, Variable, Type, Split, Globe, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const NODE_TYPES = [
  {
    category: "Triggers",
    items: [
      { type: "START", label: "Start", description: "Entry point for the automation", icon: Play, color: "text-emerald-500 bg-emerald-500/20" },
    ]
  },
  {
    category: "Actions",
    items: [
      { type: "LOG", label: "Log", description: "Log a message to execution history", icon: Terminal, color: "text-zinc-400 bg-zinc-500/20" },
      { type: "SET_VALUE", label: "Set Value", description: "Set a variable in the execution context", icon: Variable, color: "text-blue-500 bg-blue-500/20" },
      { type: "TRANSFORM", label: "Transform", description: "Transform a variable's value", icon: Type, color: "text-indigo-500 bg-indigo-500/20" },
      { type: "HTTP_REQUEST", label: "HTTP Request", description: "Make an external API call", icon: Globe, color: "text-cyan-500 bg-cyan-500/20" },
      { type: "AI_GENERATE", label: "AI Generate", description: "Generate content using Groq", icon: Sparkles, color: "text-amber-500 bg-amber-500/20" },
    ]
  },
  {
    category: "Logic",
    items: [
      { type: "CONDITION", label: "Condition", description: "Branch workflow based on a condition", icon: Split, color: "text-purple-500 bg-purple-500/20" },
    ]
  },
  {
    category: "Control",
    items: [
      { type: "END", label: "End", description: "End the workflow execution", icon: CheckSquare, color: "text-slate-400 bg-slate-500/20" },
    ]
  }
];

interface NodeLibraryProps {
  onAddNode: (type: string) => void;
}

export function NodeLibrary({ onAddNode }: NodeLibraryProps) {
  return (
    <div className="flex h-full w-64 flex-col border-r border-surface-border bg-surface-elevated overflow-y-auto">
      <div className="p-4 border-b border-surface-border sticky top-0 bg-surface-elevated/95 backdrop-blur z-10">
        <h2 className="font-semibold text-text-primary">Add Node</h2>
        <p className="text-xs text-text-muted mt-1">Select a node to add to canvas</p>
      </div>

      <div className="p-3 space-y-6">
        {NODE_TYPES.map((category) => (
          <div key={category.category}>
            <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
              {category.category}
            </h3>
            <div className="flex flex-col gap-1">
              {category.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => onAddNode(item.type)}
                    className="flex w-full items-start gap-3 rounded-lg border border-transparent p-2 text-left transition-colors hover:bg-surface hover:border-surface-border"
                  >
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", item.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">{item.label}</h4>
                      <p className="text-xs text-text-muted line-clamp-1">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
