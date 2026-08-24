"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowCanvas = FlowCanvas;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@xyflow/react");
require("@xyflow/react/dist/style.css");
const custom_nodes_1 = require("./custom-nodes");
const next_themes_1 = require("next-themes");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const sonner_1 = require("sonner");
const navigation_1 = require("next/navigation");
const node_library_1 = require("./node-library");
const node_config_panel_1 = require("./node-config-panel");
const nodeTypes = {
    START: custom_nodes_1.StartNode,
    END: custom_nodes_1.EndNode,
    LOG: custom_nodes_1.LogNode,
    SET_VALUE: custom_nodes_1.SetValueNode,
    TRANSFORM: custom_nodes_1.TransformNode,
    CONDITION: custom_nodes_1.ConditionNode,
    HTTP_REQUEST: custom_nodes_1.HttpRequestNode,
    AI_GENERATE: custom_nodes_1.AiGenerateNode,
};
const DEFAULT_NODES = [
    {
        id: "start-1",
        type: "START",
        position: { x: 250, y: 100 },
        data: { title: "Start" },
    },
];
function FlowCanvasInner({ workflowId, orgId, initialNodes, initialEdges, }) {
    const [nodes, setNodes] = (0, react_1.useState)(initialNodes?.length ? initialNodes : DEFAULT_NODES);
    const [edges, setEdges] = (0, react_1.useState)(initialEdges ?? []);
    const [isSaving, setIsSaving] = (0, react_1.useState)(false);
    const [isExecuting, setIsExecuting] = (0, react_1.useState)(false);
    const [isDirty, setIsDirty] = (0, react_1.useState)(false);
    const [selectedNode, setSelectedNode] = (0, react_1.useState)(null);
    const [isLibraryOpen, setIsLibraryOpen] = (0, react_1.useState)(false);
    const { resolvedTheme } = (0, next_themes_1.useTheme)();
    const router = (0, navigation_1.useRouter)();
    const { screenToFlowPosition, getNodes } = (0, react_2.useReactFlow)();
    const onNodesChange = (0, react_1.useCallback)((changes) => {
        setNodes((nds) => {
            const nextNodes = (0, react_2.applyNodeChanges)(changes, nds);
            const hasMeaningfulChange = changes.some(c => c.type !== 'select' && c.type !== 'dimensions');
            if (hasMeaningfulChange)
                setIsDirty(true);
            return nextNodes;
        });
        // Handle selection change
        const selectionChange = changes.find(c => c.type === 'select');
        if (selectionChange && selectionChange.type === 'select') {
            if (selectionChange.selected) {
                const node = getNodes().find(n => n.id === selectionChange.id);
                if (node)
                    setSelectedNode(node);
            }
            else {
                setSelectedNode(null);
            }
        }
    }, [getNodes]);
    const onEdgesChange = (0, react_1.useCallback)((changes) => {
        setEdges((eds) => {
            const nextEdges = (0, react_2.applyEdgeChanges)(changes, eds);
            const hasMeaningfulChange = changes.some(c => c.type !== 'select');
            if (hasMeaningfulChange)
                setIsDirty(true);
            return nextEdges;
        });
    }, []);
    const onConnect = (0, react_1.useCallback)((params) => {
        setIsDirty(true);
        setEdges((eds) => (0, react_2.addEdge)({ ...params, animated: true, style: { stroke: "rgba(99,91,255,0.5)", strokeWidth: 2 } }, eds));
    }, []);
    const handleUpdateNode = (0, react_1.useCallback)((nodeId, data) => {
        setNodes((nds) => nds.map((n) => {
            if (n.id === nodeId) {
                return { ...n, data };
            }
            return n;
        }));
        setIsDirty(true);
    }, []);
    const handleAddNode = (0, react_1.useCallback)((type) => {
        const id = `${type.toLowerCase()}-${Date.now()}`;
        const newNode = {
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
            sonner_1.toast.error("Cannot save workflow: missing ID");
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
            sonner_1.toast.success("Workflow saved successfully");
            setIsDirty(false);
            router.refresh();
        }
        catch (err) {
            sonner_1.toast.error(err.message || "Failed to save workflow");
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleExecute = async () => {
        if (!workflowId || !orgId) {
            sonner_1.toast.error("Cannot execute workflow: missing ID");
            return;
        }
        if (isDirty) {
            sonner_1.toast.error("Please save changes before executing.");
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
            sonner_1.toast.info(`Execution started. Fetching status...`);
            // 2. Poll execution status
            let execution = null;
            let attempts = 0;
            while (attempts < 15) { // Max 15 attempts (30 seconds approx)
                await new Promise(resolve => setTimeout(resolve, 2000));
                const statusRes = await fetch(`/api/organizations/${orgId}/executions/${executionId}`);
                if (statusRes.ok) {
                    const statusData = await statusRes.json();
                    execution = statusData.data;
                    // Apply statuses to nodes during polling
                    if (execution && execution.nodeResults) {
                        setNodes((nds) => nds.map((n) => {
                            const nodeResult = execution.nodeResults[n.id];
                            if (nodeResult) {
                                return { ...n, data: { ...n.data, executionStatus: nodeResult.status, executionError: nodeResult.error } };
                            }
                            return { ...n, data: { ...n.data, executionStatus: undefined, executionError: undefined } };
                        }));
                    }
                    if (execution && (execution.status === "SUCCESS" || execution.status === "FAILED" || execution.status === "CANCELLED")) {
                        break; // Terminal state reached
                    }
                }
                attempts++;
            }
            if (execution) {
                if (execution.status === "SUCCESS") {
                    sonner_1.toast.success(`Execution completed successfully!`, {
                        action: {
                            label: 'View Detail',
                            onClick: () => router.push(`/dashboard/automations/${workflowId}/executions/${executionId}`)
                        }
                    });
                }
                else if (execution.status === "FAILED") {
                    sonner_1.toast.error(`Execution failed: ${execution.error || "Unknown error"}`, {
                        action: {
                            label: 'View Detail',
                            onClick: () => router.push(`/dashboard/automations/${workflowId}/executions/${executionId}`)
                        }
                    });
                }
                else {
                    sonner_1.toast.warning(`Execution still running. Check history for final status.`);
                }
            }
        }
        catch (err) {
            sonner_1.toast.error(err.message || "Failed to execute workflow");
        }
        finally {
            setIsExecuting(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex w-full h-full min-h-[700px] border border-surface-border bg-background rounded-2xl overflow-hidden relative", children: [isLibraryOpen && ((0, jsx_runtime_1.jsx)(node_library_1.NodeLibrary, { onAddNode: handleAddNode })), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 relative", children: (0, jsx_runtime_1.jsxs)(react_2.ReactFlow, { nodes: nodes, edges: edges, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, onConnect: onConnect, nodeTypes: nodeTypes, fitView: true, className: "bg-transparent", colorMode: resolvedTheme === "dark" ? "dark" : "light", children: [(0, jsx_runtime_1.jsx)(react_2.Background, { variant: react_2.BackgroundVariant.Dots, gap: 24, size: 2, color: resolvedTheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }), (0, jsx_runtime_1.jsx)(react_2.Controls, { className: "!bg-surface/80 !backdrop-blur-md !border-surface-border !rounded-xl !overflow-hidden" }), (0, jsx_runtime_1.jsxs)(react_2.Panel, { position: "top-right", className: "flex gap-3", children: [isDirty && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-xs font-medium text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/20", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-2 h-2 rounded-full bg-warning mr-2 animate-pulse" }), "Unsaved changes"] })), !isDirty && nodes.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-xs font-medium text-success bg-success/10 px-3 py-1 rounded-full border border-success/20", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-2 h-2 rounded-full bg-success mr-2" }), "Saved"] })), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: () => setIsLibraryOpen(!isLibraryOpen), className: "bg-surface/80 backdrop-blur-md rounded-full shadow-lg h-10 px-4 border-surface-border", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4 mr-2" }), "Add Node"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", onClick: handleSave, disabled: isSaving || !isDirty, className: "rounded-full shadow-lg h-10 px-5 transition-shadow bg-brand hover:bg-brand-hover text-white disabled:opacity-50", children: [isSaving ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 mr-2 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "w-4 h-4 mr-2" }), "Save Draft"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", onClick: handleExecute, disabled: isExecuting || isSaving || isDirty, className: "rounded-full h-10 px-5 bg-success hover:bg-success/90 text-white shadow-lg transition-shadow disabled:opacity-50", children: [isExecuting ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 mr-2 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-4 h-4 mr-2 fill-current" }), "Run Workflow"] })] })] }) }), selectedNode && ((0, jsx_runtime_1.jsx)(node_config_panel_1.NodeConfigPanel, { node: selectedNode, onUpdate: handleUpdateNode, onClose: () => setSelectedNode(null) }))] }));
}
function FlowCanvas(props) {
    return ((0, jsx_runtime_1.jsx)(react_2.ReactFlowProvider, { children: (0, jsx_runtime_1.jsx)(FlowCanvasInner, { ...props }) }));
}
