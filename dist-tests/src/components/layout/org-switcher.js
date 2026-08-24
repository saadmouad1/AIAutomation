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
exports.OrgSwitcher = OrgSwitcher;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const dropdown_menu_1 = require("../ui/dropdown-menu");
const button_1 = require("../ui/button");
// Mock data until we wire up SWR/React Query
const organizations = [
    { id: "1", name: "Acme Corp", slug: "acme" },
];
function OrgSwitcher() {
    const [activeOrg, setActiveOrg] = React.useState(organizations[0]);
    return ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", role: "combobox", "aria-expanded": false, className: "w-[200px] justify-between border-surface-border bg-surface hover:bg-surface-elevated hover:text-text-primary", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 truncate", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building2, { className: "h-4 w-4 shrink-0 text-text-muted" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: activeOrg?.name || "Select Org" })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })] }) }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { className: "w-[200px] p-0", align: "start", children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuLabel, { className: "text-xs text-text-muted font-normal uppercase tracking-wider px-3 py-2", children: "Organizations" }), (0, jsx_runtime_1.jsx)("div", { className: "max-h-[300px] overflow-y-auto p-1", children: organizations.map((org) => ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: () => setActiveOrg(org), className: "flex items-center justify-between cursor-pointer", children: [(0, jsx_runtime_1.jsx)("span", { className: "truncate", children: org.name }), activeOrg?.id === org.id && ((0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "h-4 w-4 text-brand" }))] }, org.id))) }), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuSeparator, { className: "m-0" }), (0, jsx_runtime_1.jsx)("div", { className: "p-1", children: (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { className: "cursor-pointer text-brand focus:text-brand focus:bg-brand/10", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.PlusCircle, { className: "mr-2 h-4 w-4" }), "Create Organization"] }) })] })] }));
}
