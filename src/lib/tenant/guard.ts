import { NextRequest } from "next/server";
import { getTenantContext, TenantContext } from "./context";
import { Role } from "../../modules/permissions/roles";
import { Action, can } from "../../modules/permissions/can";
import { AppError } from "../errors/app-error";

export async function requireMembership(
  req: NextRequest,
  orgId: string
): Promise<TenantContext> {
  return await getTenantContext(req, orgId);
}

export async function requirePermission(
  req: NextRequest,
  orgId: string,
  action: Action
): Promise<TenantContext> {
  const context = await getTenantContext(req, orgId);

  if (!can(context.membership.role, action)) {
    throw AppError.forbidden(
      "You do not have permission to perform this action in this organization."
    );
  }

  return context;
}
