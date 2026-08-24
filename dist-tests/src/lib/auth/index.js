"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSession = exports.getSession = void 0;
exports.getCurrentUser = getCurrentUser;
exports.requireUser = requireUser;
const session_1 = require("./session");
const app_error_1 = require("../errors/app-error");
async function getCurrentUser() {
    const session = await (0, session_1.getSession)();
    if (!session?.user) {
        return null;
    }
    return session.user;
}
async function requireUser() {
    const user = await getCurrentUser();
    if (!user) {
        throw app_error_1.AppError.unauthorized();
    }
    return user;
}
var session_2 = require("./session");
Object.defineProperty(exports, "getSession", { enumerable: true, get: function () { return session_2.getSession; } });
Object.defineProperty(exports, "requireSession", { enumerable: true, get: function () { return session_2.requireSession; } });
