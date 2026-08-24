import { NextRequest } from "next/server";
import { handleApiError } from "@/lib/errors/handler";
import { requireRole, requireTenant } from "@/lib/tenant/context";
import { memberService } from "@/services/member.service";
import { ApiResponse } from "@/lib/api-response";
import { z } from "zod";
import { Role } from "@/modules/permissions/roles";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.nativeEnum(Role).default(Role.MEMBER),
});

const updateRoleSchema = z.object({
  userId: z.string().cuid(),
  role: z.nativeEnum(Role),
});

const removeMemberSchema = z.object({
  userId: z.string().cuid(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    // Any member can read members list
    await requireTenant(orgId);
    const members = await memberService.listMembers(orgId);
    return ApiResponse.success(members);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    await requireRole(orgId, "member:invite");

    const body = await req.json();
    const { email, role } = inviteSchema.parse(body);
    const member = await memberService.inviteMember(orgId, email, role);
    return ApiResponse.success(member, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    // Only OWNER can change roles (enforced at service layer too)
    await requireRole(orgId, "member:updateRole");

    const body = await req.json();
    const { userId, role } = updateRoleSchema.parse(body);
    const member = await memberService.changeRole(orgId, userId, role);
    return ApiResponse.success(member);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    await requireRole(orgId, "member:remove");

    const body = await req.json();
    const { userId } = removeMemberSchema.parse(body);
    await memberService.removeMember(orgId, userId);
    return ApiResponse.success({ removed: true });
  } catch (error) {
    return handleApiError(error);
  }
}
