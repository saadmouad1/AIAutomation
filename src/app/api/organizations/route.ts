import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "../../../lib/errors/handler";
import { requireSession } from "../../../lib/auth/session";
import { organizationService } from "../../../services/organization.service";
import { createOrganizationSchema } from "../../../lib/validation/schemas";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    const organizations = await organizationService.listForUser(session.user.id);
    return NextResponse.json({ data: organizations });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    
    // Zod validation throws error which is caught by handleApiError
    const { name } = createOrganizationSchema.parse(body);

    const organization = await organizationService.create({
      name,
      creatorId: session.user.id,
    });

    return NextResponse.json({ data: organization }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
