"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_TYPES = void 0;
exports.NodeLibrary = NodeLibrary;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
exports.NODE_TYPES = [
    {
        category: "Triggers",
        items: [
            { type: "START", label: "Start", description: "Entry point for the automation", icon: lucide_react_1.Play, color: "text-emerald-500 bg-emerald-500/20" },
        ]
    },
    {
        category: "Actions",
        items: [
            { type: "LOG", label: "Log", description: "Log a message to execution history", icon: lucide_react_1.Terminal, color: "text-zinc-400 bg-zinc-500/20" },
            { type: "SET_VALUE", label: "Set Value", description: "Set a variable in the execution context", icon: lucide_react_1.Variable, color: "text-blue-500 bg-blue-500/20" },
            { type: "TRANSFORM", label: "Transform", description: "Transform a variable's value", icon: lucide_react_1.Type, color: "text-indigo-500 bg-indigo-500/20" },
            { type: "HTTP_REQUEST", label: "HTTP Request", description: "Make an external API call", icon: lucide_react_1.Globe, color: "text-cyan-500 bg-cyan-500/20" },
            { type: "AI_GENERATE", label: "AI Generate", description: "Generate content using Groq", icon: lucide_react_1.Sparkles, color: "text-amber-500 bg-amber-500/20" },
        ]
    },
    {
        category: "Logic",
        items: [
            { type: "CONDITION", label: "Condition", description: "Branch workflow based on a condition", icon: lucide_react_1.Split, color: "text-purple-500 bg-purple-500/20" },
        ]
    },
    {
        category: "Control",
        items: [
            { type: "END", label: "End", description: "End the workflow execution", icon: lucide_react_1.CheckSquare, color: "text-slate-400 bg-slate-500/20" },
        ]
    }
];
function NodeLibrary({ onAddNode }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex h-full w-64 flex-col border-r border-surface-border bg-surface-elevated overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-surface-border sticky top-0 bg-surface-elevated/95 backdrop-blur z-10", children: [(0, jsx_runtime_1.jsx)("h2", { className: "font-semibold text-text-primary", children: "Add Node" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-text-muted mt-1", children: "Select a node to add to canvas" })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 space-y-6", children: exports.NODE_TYPES.map((category) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-text-muted", children: category.category }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col gap-1", children: category.items.map((item) => {
                                const Icon = item.icon;
                                return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => onAddNode(item.type), className: "flex w-full items-start gap-3 rounded-lg border border-transparent p-2 text-left transition-colors hover:bg-surface hover:border-surface-border", children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", item.color), children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-text-primary", children: item.label }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-text-muted line-clamp-1", children: item.description })] })] }, item.type));
                            }) })] }, category.category))) })] }));
}
