"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSession = getSession;
exports.requireSession = requireSession;
const nextauth_adapter_1 = require("./nextauth-adapter");
const app_error_1 = require("../errors/app-error");
async function getSession() {
    return nextauth_adapter_1.nextAuthProvider.getSession();
}
async function requireSession() {
    const session = await getSession();
    if (!session) {
        throw app_error_1.AppError.unauthorized();
    }
    return session;
}
