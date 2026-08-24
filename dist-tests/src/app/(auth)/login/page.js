"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = LoginPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const login_form_1 = require("@/components/auth/login-form");
exports.metadata = {
    title: "Login - AURIVO",
    description: "Sign in to your AURIVO account.",
};
function LoginPage() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex min-h-screen items-center justify-center bg-dark p-4", children: (0, jsx_runtime_1.jsx)(login_form_1.LoginForm, {}) }));
}
