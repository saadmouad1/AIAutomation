import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./app-error";
import { logger } from "../logger";

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logger.error({ err: error }, "Internal Server Error");
    } else {
      logger.warn({ err: error }, "API Error");
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.publicMessage,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    logger.warn({ err: error }, "Validation Error");
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "The provided data is invalid.",
          details: error.flatten().fieldErrors,
        },
      },
      { status: 422 }
    );
  }

  // Unhandled errors — never expose internal details
  logger.error({ err: error }, "Unhandled API Error");
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred.",
      },
    },
    { status: 500 }
  );
}
