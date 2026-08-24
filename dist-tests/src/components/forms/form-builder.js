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
exports.FormBuilder = FormBuilder;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const textarea_1 = require("@/components/ui/textarea");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const FIELD_TYPES = [
    { type: "text", label: "Short text", icon: lucide_react_1.Type },
    { type: "email", label: "Email", icon: lucide_react_1.Mail },
    { type: "textarea", label: "Long text", icon: lucide_react_1.AlignLeft },
    { type: "select", label: "Dropdown", icon: lucide_react_1.List },
    { type: "number", label: "Number", icon: lucide_react_1.Hash },
    { type: "phone", label: "Phone", icon: lucide_react_1.Phone },
    { type: "checkbox", label: "Checkbox", icon: lucide_react_1.ToggleLeft },
];
function FieldRow({ field, onRemove, }) {
    const typeInfo = FIELD_TYPES.find(t => t.type === field.type);
    const Icon = typeInfo?.icon ?? lucide_react_1.Type;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3 group hover:border-[var(--border-strong)] transition-all", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "h-4 w-4 text-[var(--subtle)] cursor-grab" }), (0, jsx_runtime_1.jsx)("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-elevated)]", children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-3.5 w-3.5 text-[var(--muted)]" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-[var(--foreground)] truncate", children: field.label }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-[var(--muted)]", children: [typeInfo?.label, field.required ? " · Required" : ""] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onRemove, className: "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-[var(--radius-sm)] text-[var(--muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)]", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-3.5 w-3.5" }) })] }));
}
function FormBuilder({ initialForm }) {
    const [title, setTitle] = React.useState(initialForm?.title ?? "Untitled Form");
    const [fields, setFields] = React.useState(initialForm?.fields ?? []);
    const [addingType, setAddingType] = React.useState(false);
    function addField(type) {
        const typeInfo = FIELD_TYPES.find(t => t.type === type);
        setFields(f => [...f, {
                id: `f-${Date.now()}`,
                type,
                label: typeInfo?.label ?? "New field",
                required: false,
            }]);
        setAddingType(false);
    }
    function removeField(id) {
        setFields(f => f.filter(field => field.id !== id));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-3 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--brand-border)] bg-[var(--brand-light)]/20 p-4", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { value: title, onChange: e => setTitle(e.target.value), className: "bg-transparent border-none text-lg font-bold text-[var(--foreground)] focus:ring-0 p-0 h-auto" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-[var(--muted)] mt-1", children: "Click to edit form title" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: fields.map(field => ((0, jsx_runtime_1.jsx)(FieldRow, { field: field, onRemove: () => removeField(field.id) }, field.id))) }), !addingType ? ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "w-full border-dashed", onClick: () => setAddingType(true), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }), " Add field"] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold text-[var(--muted)] mb-3 uppercase tracking-wide", children: "Choose field type" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: FIELD_TYPES.map(t => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => addField(t.type), className: "flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] p-3 text-xs text-[var(--muted)] hover:border-[var(--brand-border)] hover:text-[var(--brand)] hover:bg-[var(--brand-light)] transition-all duration-150", children: [(0, jsx_runtime_1.jsx)(t.icon, { className: "h-4 w-4" }), t.label] }, t.type))) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "mt-2", onClick: () => setAddingType(false), children: "Cancel" })] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "sticky top-6 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "px-5 py-4 border-b border-[var(--border)] flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold text-[var(--foreground)]", children: "Preview" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", children: "Live preview" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-5 space-y-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-base font-bold text-[var(--foreground)]", children: title }), fields.map(field => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-xs font-medium text-[var(--foreground)] mb-1", children: [field.label, field.required && (0, jsx_runtime_1.jsx)("span", { className: "text-[var(--error)] ml-0.5", children: "*" })] }), field.type === "textarea" ? ((0, jsx_runtime_1.jsx)(textarea_1.Textarea, { placeholder: `Enter ${field.label.toLowerCase()}...`, disabled: true, className: "text-xs" })) : ((0, jsx_runtime_1.jsx)(input_1.Input, { type: field.type === "email" ? "email" : "text", placeholder: `Enter ${field.label.toLowerCase()}...`, disabled: true, className: "text-xs h-8" }))] }, field.id))), fields.length === 0 && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-[var(--muted)] text-center py-6", children: "Add fields to see a preview" })), fields.length > 0 && ((0, jsx_runtime_1.jsx)(button_1.Button, { className: "w-full", size: "sm", disabled: true, children: "Submit" }))] })] }) })] }));
}
