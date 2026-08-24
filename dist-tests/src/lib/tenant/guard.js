"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = exports.requireMembership = void 0;
/**
 * guard.ts — Legacy shim for backward compatibility.
 * New code should use src/lib/tenant/context.ts directly.
 */
var context_1 = require("./context");
Object.defineProperty(exports, "requireMembership", { enumerable: true, get: function () { return context_1.requireTenant; } });
Object.defineProperty(exports, "requirePermission", { enumerable: true, get: function () { return context_1.requireRole; } });
