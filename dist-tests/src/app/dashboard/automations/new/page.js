"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NewAutomationPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const tabs_1 = require("@/components/ui/tabs");
const textarea_1 = require("@/components/ui/textarea");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const glass_card_1 = require("@/components/ui/glass-card");
const lucide_react_1 = require("lucide-react");
const navigation_1 = require("next/navigation");
const sonner_1 = require("sonner");
const nodeIcons = {
    START: lucide_react_1.Play,
    END: lucide_react_1.CheckSquare,
    LOG: lucide_react_1.Terminal,
    SET_VALUE: lucide_react_1.Variable,
    TRANSFORM: lucide_react_1.Type,
    CONDITION: lucide_react_1.Split,
    HTTP_REQUEST: lucide_react_1.Globe,
    AI_GENERATE: lucide_react_1.Sparkles,
};
function NewAutomationPage() {
    const router = (0, navigation_1.useRouter)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const orgId = searchParams.get("orgId");
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    // AI Generate state
    const [aiPrompt, setAiPrompt] = React.useState("");
    const [aiGenerating, setAiGenerating] = React.useState(false);
    const [aiResult, setAiResult] = React.useState(null);
    async function handleCreate(e) {
        e.preventDefault();
        if (!name.trim())
            return;
        if (!orgId) {
            sonner_1.toast.error("Organization ID is missing.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/organizations/${orgId}/workflows`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error?.message || "Failed to create workflow");
            }
            const data = await res.json();
            sonner_1.toast.success("Workflow created");
            router.push(`/dashboard/automations/${data.data.id}`);
        }
        catch (err) {
            sonner_1.toast.error(err.message || "An error occurred");
            setLoading(false);
        }
    }
    async function handleAiGenerate(e) {
        e.preventDefault();
        if (!aiPrompt.trim())
            return;
        if (!orgId) {
            sonner_1.toast.error("Organization ID is missing.");
            return;
        }
        setAiGenerating(true);
        setAiResult(null);
        try {
            const res = await fetch(`/api/organizations/${orgId}/workflows/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: aiPrompt }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error?.message || "Failed to generate workflow");
            }
            const data = await res.json();
            setAiResult({ nodes: data.data.nodes, edges: data.data.edges });
            sonner_1.toast.success("Workflow structure generated");
        }
        catch (err) {
            sonner_1.toast.error(err.message || "An error occurred");
        }
        finally {
            setAiGenerating(false);
        }
    }
    async function handleInsertGenerated() {
        if (!aiResult)
            return;
        if (!orgId)
            return;
        setLoading(true);
        try {
            // Use the prompt as a default name if not provided elsewhere, or generate a generic one
            const workflowName = aiPrompt.slice(0, 30) + (aiPrompt.length > 30 ? "..." : "") || "AI Generated Workflow";
            const res = await fetch(`/api/organizations/${orgId}/workflows`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: workflowName,
                    description: `Generated from prompt: ${aiPrompt}`,
                    nodes: aiResult.nodes,
                    edges: aiResult.edges
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error?.message || "Failed to create workflow");
            }
            const data = await res.json();
            sonner_1.toast.success("Workflow created from AI design");
            router.push(`/dashboard/automations/${data.data.id}`);
        }
        catch (err) {
            sonner_1.toast.error(err.message || "An error occurred");
            setLoading(false);
        }
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-3xl mx-auto space-y-6 animate-fade-up pb-20", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-text-primary", children: "Create workflow" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-text-muted mt-1", children: "Build a workflow step by step or describe what you need." })] }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "build", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "build", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Webhook, { className: "h-3.5 w-3.5 mr-1.5" }), "Start from Scratch"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "describe", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "h-3.5 w-3.5 mr-1.5" }), "Generate with AI"] })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "build", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleCreate, className: "rounded-xl border border-surface-border bg-surface p-6 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "wf-name", className: "text-xs font-medium text-text-primary mb-1 block", children: "Workflow name" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "wf-name", placeholder: "e.g. Lead Qualification", value: name, onChange: e => setName(e.target.value), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "wf-desc", className: "text-xs font-medium text-text-primary mb-1 block", children: "Description" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "wf-desc", placeholder: "Describe what this workflow does...", className: "min-h-[80px]", value: description, onChange: e => setDescription(e.target.value) })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { type: "submit", className: "w-full bg-brand hover:bg-brand-hover text-white", disabled: loading || !name.trim(), children: [loading ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-4 w-4 mr-2 animate-spin" }) : null, "Create workflow"] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "describe", children: (0, jsx_runtime_1.jsxs)(glass_card_1.GlassCard, { className: "p-6 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 shadow-sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-text-primary", children: "AI Workflow Generator" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-text-muted mt-1", children: "Describe what you want to automate in plain English, and Flowra will build the graph for you." })] })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleAiGenerate, className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(textarea_1.Textarea, { placeholder: "e.g. Create a workflow that receives a webhook, transforms the customer name to uppercase, checks whether the order value is greater than 100, and sends an HTTP request.", className: "min-h-[120px]", value: aiPrompt, onChange: e => setAiPrompt(e.target.value), required: true }), (0, jsx_runtime_1.jsxs)(button_1.Button, { type: "submit", className: "w-full bg-amber-500 hover:bg-amber-600 text-white", disabled: aiGenerating || !aiPrompt.trim(), children: [aiGenerating ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-4 w-4 mr-2 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "h-4 w-4 mr-2" }), aiGenerating ? "Generating..." : "Generate Preview"] })] }), aiResult && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-8 pt-6 border-t border-surface-border space-y-4 animate-fade-up", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-text-primary", children: "Preview" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-text-muted mt-1", children: "Review the generated nodes below. You can configure them fully in the builder." })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: aiResult.nodes.map((node, idx) => {
                                                const Icon = nodeIcons[node.type] || lucide_react_1.Play;
                                                return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 p-3 rounded-lg border border-surface-border bg-surface shadow-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-surface-border bg-surface-elevated text-text-muted", children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-text-primary", children: node.data?.title || node.type }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-medium text-text-muted uppercase tracking-wider", children: node.type })] })] }, node.id));
                                            }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-warning/10 text-warning p-3 rounded-lg border border-warning/20 text-xs flex gap-2 items-start mt-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 shrink-0" }), (0, jsx_runtime_1.jsx)("p", { children: "The workflow will be created in DRAFT mode. You must review, configure, and activate it before it will run." })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: handleInsertGenerated, disabled: loading, className: "w-full bg-brand hover:bg-brand-hover text-white mt-4", children: [loading ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-4 w-4 mr-2 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "h-4 w-4 mr-2" }), "Insert into Builder"] })] }))] }) })] })] }));
}
