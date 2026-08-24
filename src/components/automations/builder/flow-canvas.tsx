"use client";

import { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  BackgroundVariant,
  Panel,
  useReactFlow,
  ReactFlowProvider
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  StartNode,
  EndNode,
  LogNode,
  SetValueNode,
  TransformNode,
  ConditionNode,
  HttpRequestNode,
  AiGenerateNode
} from "./custom-nodes";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Play, Save, Settings2, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NodeLibrary } from "./node-library";
import { NodeConfigPanel } from "./node-config-panel";
import { WorkflowExecutionRecord } from "@/types/automations";

const nodeTypes = {
  START: StartNode,
  END: EndNode,
  LOG: LogNode,
  SET_VALUE: SetValueNode,
  TRANSFORM: TransformNode,
  CONDITION: ConditionNode,
  HTTP_REQUEST: HttpRequestNode,
  AI_GENERATE: AiGenerateNode,
};

const DEFAULT_NODES: Node[] = [
  {
    id: "start-1",
    type: "START",
    position: { x: 250, y: 100 },
    data: { title: "Start" },
  },
];

interface FlowCanvasProps {
  workflowId?: string;
  orgId?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

function FlowCanvasInner({
  workflowId,
  orgId,
  initialNodes,
  initialEdges,
}: FlowCanvasProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes?.length ? initialNodes : DEFAULT_NODES);
  const [edges, setEdges] = useState<Edge[]>(initialEdges ?? []);
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { screenToFlowPosition, getNodes } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const nextNodes = applyNodeChanges(changes, nds);
        const hasMeaningfulChange = changes.some(c => c.type !== 'select' && c.type !== 'dimensions');
        if (hasMeaningfulChange) setIsDirty(true);
        return nextNodes;
      });

      // Handle selection change
      const selectionChange = changes.find(c => c.type === 'select');
      if (selectionChange && selectionChange.type === 'select') {
        if (selectionChange.selected) {
          const node = getNodes().find(n => n.id === selectionChange.id);
          if (node) setSelectedNode(node);
        } else {
          setSelectedNode(null);
        }
      }
    },
    [getNodes]
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        const nextEdges = applyEdgeChanges(changes, eds);
        const hasMeaningfulChange = changes.some(c => c.type !== 'select');
        if (hasMeaningfulChange) setIsDirty(true);
        return nextEdges;
      });
    },
    []
  );
  
  const onConnect = useCallback(
    (params: Connection) => {
      setIsDirty(true);
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "rgba(99,91,255,0.5)", strokeWidth: 2 } }, eds));
    },
    []
  );

  const handleUpdateNode = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          return { ...n, data };
        }
        return n;
      })
    );
    setIsDirty(true);
  }, []);

  const handleAddNode = useCallback((type: string) => {
    const id = `${type.toLowerCase()}-${Date.now()}`;
    const newNode: Node = {
      id,
      type,
      position: { x: 250, y: 100 }, // We place it at a default location. User can drag it.
      data: { title: type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ') }
    };
    setNodes((nds) => [...nds, newNode]);
    setIsDirty(true);
    setIsLibraryOpen(false);
  }, []);

  const handleSave = async () => {
    if (!workflowId || !orgId) {
      toast.error("Cannot save workflow: missing ID");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/organizations/${orgId}/workflows/${workflowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodes: nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
          edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Failed to save workflow");
      }

      toast.success("Workflow saved successfully");
      setIsDirty(false);
      router.refresh(); 
    } catch (err: any) {
      toast.error(err.message || "Failed to save workflow");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExecute = async () => {
    if (!workflowId || !orgId) {
      toast.error("Cannot execute workflow: missing ID");
      return;
    }

    if (isDirty) {
      toast.error("Please save changes before executing.");
      return;
    }

    setIsExecuting(true);
    try {
      // 1. Trigger execution
      const res = await fetch(`/api/organizations/${orgId}/workflows/${workflowId}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Failed to execute workflow");
      }

      const { data: { id: executionId } } = await res.json();
      toast.info(`Execution started. Fetching status...`);

      // 2. Poll execution status
      let execution: WorkflowExecutionRecord | null = null;
      let attempts = 0;
      while (attempts < 15) { // Max 15 attempts (30 seconds approx)
        await new Promise(resolve => setTimeout(resolve, 2000));
        const statusRes = await fetch(`/api/organizations/${orgId}/executions/${executionId}`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          execution = statusData.data;
          
          // Apply statuses to nodes during polling
          if (execution && execution.nodeResults) {
            setNodes((nds) => 
              nds.map((n) => {
                const nodeResult = (execution!.nodeResults as Record<string, { status: string, error?: string }>)[n.id];
                if (nodeResult) {
                  return { ...n, data: { ...n.data, executionStatus: nodeResult.status, executionError: nodeResult.error } };
                }
                return { ...n, data: { ...n.data, executionStatus: undefined, executionError: undefined } };
              })
            );
          }

          if (execution && (execution.status === "SUCCESS" || execution.status === "FAILED" || execution.status === "CANCELLED")) {
            break; // Terminal state reached
          }
        }
        attempts++;
      }

      if (execution) {
        if (execution.status === "SUCCESS") {
          toast.success(`Execution completed successfully!`, {
            action: {
              label: 'View Detail',
              onClick: () => router.push(`/dashboard/automations/${workflowId}/executions/${executionId}`)
            }
          });
        } else if (execution.status === "FAILED") {
          toast.error(`Execution failed: ${execution.error || "Unknown error"}`, {
            action: {
              label: 'View Detail',
              onClick: () => router.push(`/dashboard/automations/${workflowId}/executions/${executionId}`)
            }
          });
        } else {
          toast.warning(`Execution still running. Check history for final status.`);
        }
      }
      
    } catch (err: any) {
      toast.error(err.message || "Failed to execute workflow");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex w-full h-full min-h-[700px] border border-surface-border bg-background rounded-2xl overflow-hidden relative">
      {/* Node Library Sidebar */}
      {isLibraryOpen && (
        <NodeLibrary onAddNode={handleAddNode} />
      )}

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-transparent"
          colorMode={resolvedTheme === "dark" ? "dark" : "light"}
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={24} 
            size={2} 
            color={resolvedTheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 
          />
          <Controls className="!bg-surface/80 !backdrop-blur-md !border-surface-border !rounded-xl !overflow-hidden" />
          
          {/* Top Floating Panel */}
          <Panel position="top-right" className="flex gap-3">
            {isDirty && (
              <div className="flex items-center text-xs font-medium text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/20">
                <span className="w-2 h-2 rounded-full bg-warning mr-2 animate-pulse" />
                Unsaved changes
              </div>
            )}
            {!isDirty && nodes.length > 0 && (
              <div className="flex items-center text-xs font-medium text-success bg-success/10 px-3 py-1 rounded-full border border-success/20">
                <span className="w-2 h-2 rounded-full bg-success mr-2" />
                Saved
              </div>
            )}

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsLibraryOpen(!isLibraryOpen)}
              className="bg-surface/80 backdrop-blur-md rounded-full shadow-lg h-10 px-4 border-surface-border"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Node
            </Button>
            
            <Button 
              size="sm" 
              onClick={handleSave} 
              disabled={isSaving || !isDirty}
              className="rounded-full shadow-lg h-10 px-5 transition-shadow bg-brand hover:bg-brand-hover text-white disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
            
            <Button 
              size="sm" 
              onClick={handleExecute}
              disabled={isExecuting || isSaving || isDirty}
              className="rounded-full h-10 px-5 bg-success hover:bg-success/90 text-white shadow-lg transition-shadow disabled:opacity-50"
            >
              {isExecuting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2 fill-current" />}
              Run Workflow
            </Button>
          </Panel>
        </ReactFlow>
      </div>

      {/* Config Panel Sidebar */}
      {selectedNode && (
        <NodeConfigPanel 
          node={selectedNode} 
          onUpdate={handleUpdateNode} 
          onClose={() => setSelectedNode(null)} 
        />
      )}
    </div>
  );
}

export function FlowCanvas(props: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
