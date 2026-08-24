"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowStatusControls = WorkflowStatusControls;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const sonner_1 = require("sonner");
const navigation_1 = require("next/navigation");
const dialog_1 = require("@/components/ui/dialog");
function WorkflowStatusControls({ orgId, workflowId, currentStatus }) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [isUpdating, setIsUpdating] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const isCurrentlyActive = currentStatus === "ACTIVE";
    const targetStatus = isCurrentlyActive ? "PAUSED" : "ACTIVE";
    const handleConfirm = async () => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/organizations/${orgId}/workflows/${workflowId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: targetStatus }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error?.message || "Failed to update status");
            }
            sonner_1.toast.success(`Workflow is now ${targetStatus.toLowerCase()}`);
            setIsOpen(false);
            router.refresh();
        }
        catch (err) {
            sonner_1.toast.error(err.message || "Failed to update workflow status");
        }
        finally {
            setIsUpdating(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "secondary", size: "sm", onClick: () => setIsOpen(true), children: isCurrentlyActive ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Pause, { className: "h-4 w-4 mr-2" }), " Pause"] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "h-4 w-4 mr-2" }), " Activate"] })) }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: isOpen, onOpenChange: setIsOpen, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: isCurrentlyActive ? "Pause Workflow?" : "Activate Workflow?" }), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: isCurrentlyActive
                                        ? "New trigger executions will be blocked while this workflow is paused."
                                        : "This workflow will begin accepting triggers once active." })] }), (0, jsx_runtime_1.jsxs)(dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", onClick: () => setIsOpen(false), disabled: isUpdating, children: "Cancel" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: isCurrentlyActive ? "danger" : "primary", onClick: handleConfirm, disabled: isUpdating, children: [isUpdating && (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), isCurrentlyActive ? "Pause Workflow" : "Activate Workflow"] })] })] }) })] }));
}
