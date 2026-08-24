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
exports.DataTable = DataTable;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const table_1 = require("@/components/ui/table");
const input_1 = require("@/components/ui/input");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const navigation_1 = require("next/navigation");
function DataTable({ data }) {
    const [search, setSearch] = React.useState("");
    const router = (0, navigation_1.useRouter)();
    const filtered = data.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.company?.toLowerCase().includes(search.toLowerCase()));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative w-72", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Search contacts...", className: "pl-9 bg-surface border-surface-border", value: search, onChange: (e) => setSearch(e.target.value) })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { children: "Add Contact" })] }), (0, jsx_runtime_1.jsx)("div", { className: "rounded-md border border-surface-border overflow-hidden", children: (0, jsx_runtime_1.jsxs)(table_1.Table, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHeader, { className: "bg-surface-elevated", children: (0, jsx_runtime_1.jsxs)(table_1.TableRow, { className: "border-surface-border hover:bg-transparent", children: [(0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Name" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Email" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Company" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Phone" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { className: "w-[50px]" })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableBody, { children: filtered.length === 0 ? ((0, jsx_runtime_1.jsx)(table_1.TableRow, { children: (0, jsx_runtime_1.jsx)(table_1.TableCell, { colSpan: 5, className: "text-center h-24 text-text-muted", children: "No contacts found." }) })) : (filtered.map((contact) => ((0, jsx_runtime_1.jsxs)(table_1.TableRow, { className: "border-surface-border hover:bg-surface-elevated cursor-pointer", onClick: () => router.push(`/dashboard/contacts/${contact.id}`), children: [(0, jsx_runtime_1.jsx)(table_1.TableCell, { className: "font-medium text-text-primary", children: contact.name }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { className: "text-text-muted", children: contact.email || "-" }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { className: "text-text-muted", children: contact.company || "-" }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { className: "text-text-muted", children: contact.phone || "-" }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-text-muted hover:text-text-primary", onClick: (e) => { e.stopPropagation(); }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreHorizontal, { className: "h-4 w-4" }) }) })] }, contact.id)))) })] }) })] }));
}
