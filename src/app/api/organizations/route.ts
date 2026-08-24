import { NextRequest } from "next/server";
import { handleApiError } from "@/lib/errors/handler";
import { requireUser } from "@/lib/auth";
import { organizationService } from "@/services/organization.service";
import { createOrganizationSchema } from "@/lib/validation/schemas";
import { ApiResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const organizations = await organizationService.listForUser(user.id);
    return ApiResponse.success(organizations);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    
    const { name } = createOrganizationSchema.parse(body);

    const organization = await organizationService.create({
      name,
      creatorId: user.id,
    });

    return ApiResponse.success(organization, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
