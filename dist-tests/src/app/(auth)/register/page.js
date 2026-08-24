"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RegisterPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const register_form_1 = require("@/components/auth/register-form");
exports.metadata = {
    title: "Sign Up - AURIVO",
    description: "Create a new AURIVO account.",
};
function RegisterPage() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex min-h-screen items-center justify-center bg-dark p-4", children: (0, jsx_runtime_1.jsx)(register_form_1.RegisterForm, {}) }));
}
