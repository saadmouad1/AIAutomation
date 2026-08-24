"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = TemplatesPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const session_1 = require("@/lib/auth/session");
const navigation_1 = require("next/navigation");
const organization_repository_1 = require("@/repositories/organization.repository");
const product_definitions_1 = require("@/lib/templates/product-definitions");
const template_card_1 = require("@/components/templates/template-card");
const tabs_1 = require("@/components/ui/tabs");
const lucide_react_1 = require("lucide-react");
exports.metadata = {
    title: "Automation Products — Flowra",
    description: "Browse ready-to-deploy automation products for your business.",
};
async function TemplatesPage() {
    const session = await (0, session_1.getSession)();
    if (!session?.user?.id)
        (0, navigation_1.redirect)("/login");
    const orgs = await (0, organization_repository_1.listUserOrganizations)(session.user.id);
    if (orgs.length === 0)
        (0, navigation_1.redirect)("/dashboard");
    const orgId = orgs[0].id;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto space-y-10 animate-fade-up pb-20", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-start gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--brand-light)] border border-[var(--brand-border)]", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-6 w-6 text-[var(--brand)]" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-[var(--foreground)] tracking-tight", children: "Automation Products" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[var(--muted)] mt-2 text-lg max-w-3xl", children: "Ready-to-deploy automations built to solve real business problems. Select a product, connect your accounts, and let Flowra do the heavy lifting." })] })] }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "All", className: "w-full", children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsList, { className: "flex flex-wrap h-auto p-1 bg-[var(--surface-elevated)] border border-[var(--border)] gap-1 mb-8 overflow-x-auto justify-start", children: product_definitions_1.PRODUCT_CATEGORIES.map(category => ((0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: category, className: "px-4 py-2 text-sm data-[state=active]:bg-[var(--surface)] data-[state=active]:text-[var(--foreground)] data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-[var(--border-strong)] rounded-md transition-all whitespace-nowrap", children: category }, category))) }), product_definitions_1.PRODUCT_CATEGORIES.map(category => {
                        const categoryProducts = category === "All"
                            ? product_definitions_1.AUTOMATION_PRODUCTS
                            : product_definitions_1.AUTOMATION_PRODUCTS.filter(p => p.category === category);
                        return ((0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: category, className: "mt-0 outline-none", children: categoryProducts.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: categoryProducts.map(product => ((0, jsx_runtime_1.jsx)(template_card_1.TemplateCard, { product: product, orgId: orgId }, product.id))) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "py-20 text-center border border-dashed border-[var(--border-strong)] rounded-2xl bg-[var(--surface-elevated)]", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-[var(--foreground)]", children: "No products in this category yet." }), (0, jsx_runtime_1.jsx)("p", { className: "text-[var(--muted)] mt-1", children: "We are constantly adding new automation products." })] })) }, category));
                    })] })] }));
}
