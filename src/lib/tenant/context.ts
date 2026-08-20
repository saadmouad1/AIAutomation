import { NextRequest } from "next/server";
import { getSession } from "../auth";
import { AppError } from "../errors/app-error";
import { db } from "../db/client";
import { Role } from "../../modules/permissions/roles";

export interface TenantContext {
  user: { id: string; email: string; name?: string | null };
  organization: { id: string; name: string; slug: string };
  membership: { id: string; role: Role };
}

export async function getTenantContext(
  req: NextRequest,
  orgIdOrSlug: string
): Promise<TenantContext> {
  const session = await getSession();

  if (!session) {
    throw AppError.unauthorized();
  }

  // Look up organization and membership in one query
  const orgWithMembership = await db.organization.findFirst({
    where: {
      OR: [{ id: orgIdOrSlug }, { slug: orgIdOrSlug }],
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      members: {
        where: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!orgWithMembership || orgWithMembership.members.length === 0) {
    // If they aren't a member, treat it as FORBIDDEN (tenant isolation)
    // We return FORBIDDEN rather than NOT_FOUND to avoid enumerating orgs
    throw AppError.forbidden("You do not have access to this organization.");
  }

  const membership = orgWithMembership.members[0];

  return {
    user: session.user,
    organization: {
      id: orgWithMembership.id,
      name: orgWithMembership.name,
      slug: orgWithMembership.slug,
    },
    membership: {
      id: membership.id,
      role: membership.role as Role,
    },
  };
}
