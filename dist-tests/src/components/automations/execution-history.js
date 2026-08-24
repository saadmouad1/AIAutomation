"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionHistory = ExecutionHistory;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const status_indicator_1 = require("@/components/ui/status-indicator");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const badge_1 = require("@/components/ui/badge");
function ExecutionHistory({ orgId, workflowId }) {
    const [executions, setExecutions] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchExecutions = (0, react_1.useCallback)(async () => {
        try {
            const res = await fetch(`/api/organizations/${orgId}/executions?workflowId=${workflowId}`);
            if (!res.ok)
                throw new Error("Failed to fetch executions");
            const data = await res.json();
            setExecutions(data.data || []);
            setError(null);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setIsLoading(false);
        }
    }, [orgId, workflowId]);
    (0, react_1.useEffect)(() => {
        fetchExecutions();
    }, [fetchExecutions]);
    (0, react_1.useEffect)(() => {
        const hasRunning = executions.some(e => e.status === "RUNNING" || e.status === "PENDING");
        if (!hasRunning)
            return;
        const interval = setInterval(() => {
            fetchExecutions();
        }, 5000);
        return () => clearInterval(interval);
    }, [executions, fetchExecutions]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center p-8 text-text-muted", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-6 w-6 animate-spin" }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "p-4 bg-error/10 text-error rounded-lg text-sm border border-error/20", children: error }));
    }
    if (executions.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center p-8 border border-dashed border-surface-border rounded-xl", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-text-muted", children: "No executions yet." }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-text-muted mt-1", children: "Run the workflow or trigger a webhook to see history here." })] }));
    }
    const getStatusType = (status) => {
        switch (status) {
            case "SUCCESS": return "active";
            case "FAILED": return "error";
            case "RUNNING": return "pending";
            case "PENDING": return "pending";
            default: return "draft";
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "rounded-xl border border-surface-border overflow-hidden bg-surface", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full text-sm text-left", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-surface-elevated text-xs uppercase text-text-muted border-b border-surface-border", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 font-medium", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 font-medium", children: "Started" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 font-medium", children: "Duration" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 font-medium", children: "Version" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 font-medium", children: "Trigger" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-right" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-surface-border", children: executions.map((exec) => ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-surface-elevated/50 transition-colors group", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3", children: (0, jsx_runtime_1.jsx)(status_indicator_1.StatusIndicator, { status: getStatusType(exec.status) }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 text-text-primary whitespace-nowrap", children: exec.startedAt ? new Date(exec.startedAt).toLocaleString() : "-" }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 text-text-muted", children: exec.completedAt && exec.startedAt
                                    ? `${Math.max(0, new Date(exec.completedAt).getTime() - new Date(exec.startedAt).getTime())}ms`
                                    : "-" }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3", children: (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "text-[10px]", children: ["v", exec.workflowVersion] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 text-text-muted capitalize", children: String(exec.input?.source || 'manual') }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 text-right", children: (0, jsx_runtime_1.jsx)(link_1.default, { href: `/dashboard/automations/${workflowId}/executions/${exec.id}`, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", size: "sm", className: "opacity-0 group-hover:opacity-100 transition-opacity", children: ["View ", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "ml-2 h-4 w-4" })] }) }) })] }, exec.id))) })] }) }));
}
