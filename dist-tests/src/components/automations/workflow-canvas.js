"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowCanvas = WorkflowCanvas;
const jsx_runtime_1 = require("react/jsx-runtime");
const flow_canvas_1 = require("./builder/flow-canvas");
const ai_copilot_1 = require("@/components/ai/ai-copilot");
function WorkflowCanvas({ workflowId, orgId, initialNodes, initialEdges, }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative w-full h-[calc(100vh-80px)] overflow-hidden", children: [(0, jsx_runtime_1.jsx)(flow_canvas_1.FlowCanvas, { workflowId: workflowId, orgId: orgId, initialNodes: initialNodes, initialEdges: initialEdges }), (0, jsx_runtime_1.jsx)(ai_copilot_1.AiCopilot, {})] }));
}
