"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookUrlCard = WebhookUrlCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const sonner_1 = require("sonner");
function WebhookUrlCard({ workflowId, isActive }) {
    const [copied, setCopied] = (0, react_1.useState)(false);
    const [webhookUrl, setWebhookUrl] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        if (typeof window !== "undefined") {
            setWebhookUrl(`${window.location.origin}/api/webhooks/${workflowId}`);
        }
    }, [workflowId]);
    if (!isActive)
        return null;
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(webhookUrl);
            setCopied(true);
            sonner_1.toast.success("Webhook URL copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
        catch (err) {
            sonner_1.toast.error("Failed to copy URL");
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-xl border border-surface-border bg-surface-elevated overflow-hidden shadow-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 bg-surface p-3 border-b border-surface-border", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Webhook, { className: "h-4 w-4 text-brand" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: "Webhook Trigger" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 space-y-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-text-muted", children: "This endpoint triggers this workflow. Send a POST request to start an execution." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 font-mono text-sm bg-surface p-2 rounded border border-surface-border truncate text-text-primary", children: webhookUrl || "Loading..." }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "secondary", size: "icon", onClick: handleCopy, children: copied ? (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "h-4 w-4 text-success" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "h-4 w-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2 bg-warning/10 text-warning p-3 rounded-lg border border-warning/20", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs", children: "Webhook authentication/signing is not implemented yet. Do not expose this endpoint publicly without additional protection." })] })] })] }));
}
