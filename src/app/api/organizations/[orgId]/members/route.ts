import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "../../../../../lib/errors/handler";
import { requirePermission } from "../../../../../lib/tenant/guard";
import { memberService } from "../../../../../services/member.service";
import { z } from "zod";
import { Role } from "../../../../../modules/permissions/roles";
import { AppError } from "../../../../../lib/errors/app-error";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    // Any member can list members
    await requirePermission(req, orgId, "org:update"); 
    // Wait, let's use a standard requireMembership for reading if we want any member to see it.
    // For now, let's just use requireMembership
    const { requireMembership } = await import("../../../../../lib/tenant/guard");
    await requireMembership(req, orgId);

    const members = await memberService.listMembers(orgId);
    return NextResponse.json({ data: members });
  } catch (error) {
    return handleApiError(error);
  }
}

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role).default(Role.MEMBER),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    await requirePermission(req, orgId, "member:invite");

    const body = await req.json();
    const { email, role } = inviteSchema.parse(body);

    const member = await memberService.inviteMember(orgId, email, role);
    return NextResponse.json({ data: member }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
