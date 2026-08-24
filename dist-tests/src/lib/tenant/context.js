"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationMembership = getOrganizationMembership;
exports.getTenantContext = getTenantContext;
exports.requireTenant = requireTenant;
exports.requireRole = requireRole;
const auth_1 = require("../auth");
const client_1 = require("../db/client");
const app_error_1 = require("../errors/app-error");
const permissions_1 = require("./permissions");
async function getOrganizationMembership(userId, organizationId) {
    return client_1.db.organizationMember.findUnique({
        where: {
            organizationId_userId: {
                organizationId,
                userId
            }
        },
        include: {
            organization: true
        }
    });
}
async function getTenantContext(organizationId) {
    const user = await (0, auth_1.requireUser)();
    const membership = await getOrganizationMembership(user.id, organizationId);
    if (!membership) {
        // Return 404 behavior as requested to not leak resource existence
        throw app_error_1.AppError.notFound("Organization not found");
    }
    return {
        user,
        organization: membership.organization,
        role: membership.role,
    };
}
async function requireTenant(organizationId) {
    const context = await getTenantContext(organizationId);
    return context;
}
async function requireRole(organizationId, requiredPermission) {
    const context = await requireTenant(organizationId);
    if (!(0, permissions_1.hasPermission)(context.role, requiredPermission)) {
        throw app_error_1.AppError.forbidden("You do not have permission to perform this action");
    }
    return context;
}
