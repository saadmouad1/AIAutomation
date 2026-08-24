"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseTemplateButton = UseTemplateButton;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const navigation_1 = require("next/navigation");
function UseTemplateButton({ templateSlug, status, orgId }) {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    if (status === "COMING_SOON") {
        return ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", className: "w-full", disabled: true, children: "Coming Soon" }));
    }
    const handleUseTemplate = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/organizations/${orgId}/workflows/from-template`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templateSlug }),
            });
            if (!res.ok) {
                throw new Error("Failed to create workflow");
            }
            const { data } = await res.json();
            // Redirect to the builder
            router.push(`/dashboard/automations/${data.id}`);
        }
        catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(button_1.Button, { className: "w-full bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]", onClick: handleUseTemplate, disabled: isLoading, children: [isLoading ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-4 w-4 mr-2 animate-spin" }) : null, "Use Automation ", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "h-4 w-4 ml-2" })] }));
}
