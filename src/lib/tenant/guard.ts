/**
 * guard.ts — Legacy shim for backward compatibility.
 * New code should use src/lib/tenant/context.ts directly.
 */
export { requireTenant as requireMembership, requireRole as requirePermission } from "./context";
