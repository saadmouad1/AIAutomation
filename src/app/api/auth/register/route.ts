import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/handler";
import { authService } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await authService.register(body);

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
