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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterForm = RegisterForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const react_1 = require("next-auth/react");
const navigation_1 = require("next/navigation");
const button_1 = require("../ui/button");
const input_1 = require("../ui/input");
const label_1 = require("../ui/label");
const card_1 = require("../ui/card");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
function RegisterForm() {
    const router = (0, navigation_1.useRouter)();
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        // We don't have a register endpoint yet, but this is the structure
        // Since we didn't add a /api/auth/register endpoint in the plan,
        // let's assume we create the user via a server action or route.
        // For MVP phase 1, we will need to add a register API route if we haven't.
        // I'll leave the call here to an assumed API route for now.
        try {
            // Temporary mock register call, in real implementation this hits an API
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error?.message || "Registration failed");
            }
            // Automatically sign in after register
            const signInRes = await (0, react_1.signIn)("credentials", {
                email,
                password,
                redirect: false,
            });
            if (signInRes?.error) {
                setError("Account created, but automatic sign in failed.");
            }
            else {
                router.push("/dashboard");
                router.refresh();
            }
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "w-full max-w-md border-surface-border bg-surface/50 backdrop-blur-xl", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "space-y-3 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mb-2", children: (0, jsx_runtime_1.jsx)("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "h-6 w-6 text-brand" }) }) }), (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-2xl font-semibold tracking-tight text-text-primary", children: "Create an account" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { className: "text-text-muted", children: "Enter your details to get started with AURIVO" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: onSubmit, children: [(0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [error && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 rounded-md bg-error/10 p-3 text-sm text-error", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4" }), error] })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "name", children: "Full Name" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "name", name: "name", type: "text", placeholder: "John Doe", required: true, disabled: isLoading })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "email", children: "Email" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "email", name: "email", type: "email", placeholder: "m@example.com", required: true, disabled: isLoading })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "password", children: "Password" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "password", name: "password", type: "password", required: true, disabled: isLoading })] })] }), (0, jsx_runtime_1.jsxs)(card_1.CardFooter, { className: "flex flex-col gap-4 mt-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? "Creating account..." : "Sign up" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center text-sm text-text-muted", children: ["Already have an account?", " ", (0, jsx_runtime_1.jsx)(link_1.default, { href: "/login", className: "text-brand hover:text-brand-hover underline-offset-4 hover:underline", children: "Sign in" })] })] })] })] }));
}
