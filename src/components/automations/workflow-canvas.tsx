"use client";

import { FlowCanvas } from "./builder/flow-canvas";
import { AiCopilot } from "@/components/ai/ai-copilot";
import type { Node, Edge } from "@xyflow/react";

interface WorkflowCanvasProps {
  workflowId?: string;
  orgId?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

export function WorkflowCanvas({
  workflowId,
  orgId,
  initialNodes,
  initialEdges,
}: WorkflowCanvasProps) {
  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
      <FlowCanvas
        workflowId={workflowId}
        orgId={orgId}
        initialNodes={initialNodes}
        initialEdges={initialEdges}
      />
      <AiCopilot />
    </div>
  );
}
