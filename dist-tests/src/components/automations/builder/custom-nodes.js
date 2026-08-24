"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartNode = StartNode;
exports.EndNode = EndNode;
exports.LogNode = LogNode;
exports.SetValueNode = SetValueNode;
exports.TransformNode = TransformNode;
exports.ConditionNode = ConditionNode;
exports.HttpRequestNode = HttpRequestNode;
exports.AiGenerateNode = AiGenerateNode;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@xyflow/react");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
function BaseNode({ data, type, icon: Icon, colorClass, hasSource = true, hasTarget = true, isCondition = false }) {
    const status = data.executionStatus;
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("relative min-w-[260px] rounded-2xl border bg-surface/90 backdrop-blur-xl p-4 shadow-xl transition-all", status === "SUCCESS" ? "border-green-500/50 shadow-green-500/10" :
            status === "FAILED" ? "border-red-500/50 shadow-red-500/10" :
                status === "RUNNING" ? "border-blue-500/50 shadow-blue-500/10 animate-pulse" :
                    "border-surface-border hover:border-text-muted", "group"), children: [hasTarget && ((0, jsx_runtime_1.jsx)(react_1.Handle, { type: "target", position: react_1.Position.Top, className: "w-3 h-3 bg-text-muted border-2 border-surface" })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-opacity-20", colorClass), children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-text-muted", children: type }), (0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-text-primary truncate", children: data.title || type })] }), status === "SUCCESS" && (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "h-5 w-5 text-green-500 shrink-0" }), status === "FAILED" && (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-5 w-5 text-red-500 shrink-0" }), status === "RUNNING" && (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-5 w-5 text-blue-500 animate-spin shrink-0" })] }), data.description && ((0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-xs text-text-muted line-clamp-2", children: data.description })), hasSource && !isCondition && ((0, jsx_runtime_1.jsx)(react_1.Handle, { type: "source", position: react_1.Position.Bottom, className: "w-3 h-3 bg-brand border-2 border-surface" })), isCondition && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_1.Handle, { type: "source", position: react_1.Position.Bottom, id: "true", className: "w-3 h-3 bg-green-500 border-2 border-surface -ml-6" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -bottom-5 left-1/2 -translate-x-1/2 -ml-6 text-[10px] text-green-500 font-medium pointer-events-none", children: "TRUE" }), (0, jsx_runtime_1.jsx)(react_1.Handle, { type: "source", position: react_1.Position.Bottom, id: "false", className: "w-3 h-3 bg-red-500 border-2 border-surface ml-6" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -bottom-5 left-1/2 -translate-x-1/2 ml-6 text-[10px] text-red-500 font-medium pointer-events-none", children: "FALSE" })] }))] }));
}
function StartNode({ data }) {
    return (0, jsx_runtime_1.jsx)(BaseNode, { data: data, type: "START", icon: lucide_react_1.Play, colorClass: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30", hasTarget: false });
}
function EndNode({ data }) {
    return (0, jsx_runtime_1.jsx)(BaseNode, { data: data, type: "END", icon: lucide_react_1.CheckSquare, colorClass: "bg-slate-500/20 text-slate-400 border-slate-500/30", hasSource: false });
}
function LogNode({ data }) {
    return (0, jsx_runtime_1.jsx)(BaseNode, { data: data, type: "LOG", icon: lucide_react_1.Terminal, colorClass: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" });
}
function SetValueNode({ data }) {
    return (0, jsx_runtime_1.jsx)(BaseNode, { data: data, type: "SET_VALUE", icon: lucide_react_1.Variable, colorClass: "bg-blue-500/20 text-blue-500 border-blue-500/30" });
}
function TransformNode({ data }) {
    return (0, jsx_runtime_1.jsx)(BaseNode, { data: data, type: "TRANSFORM", icon: lucide_react_1.Type, colorClass: "bg-indigo-500/20 text-indigo-500 border-indigo-500/30" });
}
function ConditionNode({ data }) {
    return (0, jsx_runtime_1.jsx)(BaseNode, { data: data, type: "CONDITION", icon: lucide_react_1.Split, colorClass: "bg-purple-500/20 text-purple-500 border-purple-500/30", isCondition: true });
}
function HttpRequestNode({ data }) {
    return (0, jsx_runtime_1.jsx)(BaseNode, { data: data, type: "HTTP_REQUEST", icon: lucide_react_1.Globe, colorClass: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30" });
}
function AiGenerateNode({ data }) {
    return (0, jsx_runtime_1.jsx)(BaseNode, { data: data, type: "AI_GENERATE", icon: lucide_react_1.Sparkles, colorClass: "bg-amber-500/20 text-amber-500 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]" });
}
