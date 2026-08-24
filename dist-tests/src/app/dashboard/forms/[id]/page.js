"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMetadata = generateMetadata;
exports.default = FormEditorPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const forms_1 = require("@/lib/mock/forms");
const navigation_1 = require("next/navigation");
const form_builder_1 = require("@/components/forms/form-builder");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
async function generateMetadata({ params }) {
    const { id } = await params;
    if (id === "new")
        return { title: "New Form — Flowra" };
    const form = await (0, forms_1.getMockForm)(id);
    return { title: form ? `${form.title} — Flowra` : "Form Not Found" };
}
async function FormEditorPage({ params }) {
    const { id } = await params;
    const isNew = id === "new";
    const form = isNew ? null : await (0, forms_1.getMockForm)(id);
    if (!isNew && !form)
        (0, navigation_1.notFound)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-5xl mx-auto space-y-6 animate-fade-up", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/dashboard/forms", children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon_sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-4 w-4" }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl font-bold text-[var(--foreground)]", children: form?.title ?? "New Form" }), form && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mt-0.5", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: form.status === "published" ? "success" : "default", children: form.status }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-[var(--muted)]", children: [form.submissionCount, " submissions"] })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [form && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "secondary", size: "sm", asChild: true, children: (0, jsx_runtime_1.jsxs)(link_1.default, { href: `/dashboard/forms/${form.id}/submissions`, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }), " View responses"] }) })), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", children: "Save & publish" })] })] }), (0, jsx_runtime_1.jsx)(form_builder_1.FormBuilder, { initialForm: form ?? undefined })] }));
}
