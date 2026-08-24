import { requireUser } from "../auth";
import { db } from "../db/client";
import { AppError } from "../errors/app-error";
import { Role, Permission, hasPermission } from "./permissions";

export async function getOrganizationMembership(userId: string, organizationId: string) {
  return db.organizationMember.findUnique({
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

export async function getTenantContext(organizationId: string) {
  const user = await requireUser();
  const membership = await getOrganizationMembership(user.id, organizationId);

  if (!membership) {
    // Return 404 behavior as requested to not leak resource existence
    throw AppError.notFound("Organization not found");
  }

  return {
    user,
    organization: membership.organization,
    role: membership.role as Role,
  };
}

export async function requireTenant(organizationId: string) {
  const context = await getTenantContext(organizationId);
  return context;
}

export async function requireRole(organizationId: string, requiredPermission: Permission) {
  const context = await requireTenant(organizationId);
  
  if (!hasPermission(context.role, requiredPermission)) {
    throw AppError.forbidden("You do not have permission to perform this action");
  }

  return context;
}
