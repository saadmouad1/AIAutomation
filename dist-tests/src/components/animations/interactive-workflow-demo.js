"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveWorkflowDemo = InteractiveWorkflowDemo;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
function InteractiveWorkflowDemo() {
    const containerRef = (0, react_1.useRef)(null);
    const [nodes, setNodes] = (0, react_1.useState)([
        { id: "1", type: "trigger", title: "New Website Lead", icon: lucide_react_1.Mail, x: 20, y: 100, status: "idle" },
        { id: "2", type: "condition", title: "Lead Score > 80", icon: lucide_react_1.Filter, x: 300, y: 100, status: "idle" },
        { id: "3", type: "action", title: "Add to Premium CRM", icon: lucide_react_1.Database, x: 580, y: 100, status: "idle" }
    ]);
    const [isRunning, setIsRunning] = (0, react_1.useState)(false);
    // Run the automation visually
    const runAutomation = async () => {
        if (isRunning)
            return;
        setIsRunning(true);
        // Reset
        setNodes(prev => prev.map(n => ({ ...n, status: "idle" })));
        // Node 1
        await new Promise(r => setTimeout(r, 500));
        setNodes(prev => prev.map(n => n.id === "1" ? { ...n, status: "running" } : n));
        await new Promise(r => setTimeout(r, 1000));
        setNodes(prev => prev.map(n => n.id === "1" ? { ...n, status: "success" } : n));
        // Node 2
        setNodes(prev => prev.map(n => n.id === "2" ? { ...n, status: "running" } : n));
        await new Promise(r => setTimeout(r, 1000));
        setNodes(prev => prev.map(n => n.id === "2" ? { ...n, status: "success" } : n));
        // Node 3
        setNodes(prev => prev.map(n => n.id === "3" ? { ...n, status: "running" } : n));
        await new Promise(r => setTimeout(r, 1000));
        setNodes(prev => prev.map(n => n.id === "3" ? { ...n, status: "success" } : n));
        setTimeout(() => setIsRunning(false), 2000);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative w-full max-w-4xl h-[350px] mx-auto bg-[var(--surface-elevated)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden", ref: containerRef, children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute top-0 left-0 right-0 h-14 border-b border-[var(--border-strong)] bg-[var(--surface)]/80 backdrop-blur-md flex items-center justify-between px-6 z-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 rounded-full bg-red-500/80" }), (0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 rounded-full bg-yellow-500/80" }), (0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 rounded-full bg-green-500/80" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-4 text-sm font-medium text-[var(--muted)]", children: "Lead Routing Workflow" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: runAutomation, disabled: isRunning, className: "flex items-center gap-2 px-4 py-1.5 bg-[var(--brand)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand)]/90 transition-colors disabled:opacity-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-4 h-4" }), isRunning ? "Running..." : "Test Workflow"] })] }), (0, jsx_runtime_1.jsx)("svg", { className: "absolute inset-0 w-full h-full pointer-events-none z-0", children: nodes.map((node, i) => {
                    if (i === nodes.length - 1)
                        return null;
                    const nextNode = nodes[i + 1];
                    // Hardcoded line paths for demonstration since nodes are relatively positioned
                    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.path, { d: `M ${node.x + 220} ${node.y + 114} L ${nextNode.x + 20} ${nextNode.y + 114}`, stroke: node.status === "success" ? "var(--brand)" : "var(--border-strong)", strokeWidth: "2", strokeDasharray: "5,5", fill: "none", initial: { pathLength: 1 }, animate: node.status === "success" ? {
                            strokeDashoffset: [0, -20],
                            stroke: "var(--brand)"
                        } : {}, transition: node.status === "success" ? {
                            duration: 0.5,
                            repeat: Infinity,
                            ease: "linear"
                        } : {} }, `line-${node.id}`));
                }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 pt-14 pointer-events-none", children: nodes.map((node, i) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { drag: true, dragConstraints: containerRef, dragElastic: 0.1, dragMomentum: false, className: "absolute pointer-events-auto cursor-grab active:cursor-grabbing", style: { left: node.x, top: node.y }, whileHover: { scale: 1.02 }, whileDrag: { scale: 1.05, zIndex: 50, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }, children: (0, jsx_runtime_1.jsxs)("div", { className: `w-[220px] bg-[var(--surface)] border-2 ${node.status === "running" ? "border-[var(--brand)] shadow-[0_0_20px_rgba(99,91,255,0.4)]" :
                            node.status === "success" ? "border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]" :
                                "border-[var(--border-strong)]"} rounded-xl p-4 transition-colors duration-300`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${node.type === "trigger" ? "bg-blue-500/10 text-blue-500" :
                                            node.type === "condition" ? "bg-purple-500/10 text-purple-500" :
                                                "bg-orange-500/10 text-orange-500"}`, children: (0, jsx_runtime_1.jsx)(node.icon, { className: "w-5 h-5" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]", children: node.type }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-semibold text-[var(--foreground)]", children: node.title })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mt-4 pt-3 border-t border-[var(--border)]", children: [node.status === "idle" && (0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 rounded-full bg-[var(--muted)]" }), node.status === "running" && (0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 rounded-full bg-[var(--brand)] animate-ping" }), node.status === "success" && (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "w-4 h-4 text-green-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-[var(--muted)] font-medium", children: node.status === "idle" ? "Waiting..." :
                                            node.status === "running" ? "Processing..." :
                                                "Completed" })] })] }) }, node.id))) }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 bg-[var(--surface-overlay)] border border-[var(--border-strong)] backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-xs font-medium text-[var(--foreground)] shadow-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "w-3 h-3 text-[var(--brand)]" }), "Try dragging the nodes around or click \"Test Workflow\""] })] }));
}
