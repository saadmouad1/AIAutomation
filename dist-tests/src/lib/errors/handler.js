"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleApiError = handleApiError;
const server_1 = require("next/server");
const zod_1 = require("zod");
const app_error_1 = require("./app-error");
const logger_1 = require("../logger");
function handleApiError(error) {
    if (error instanceof app_error_1.AppError) {
        if (error.statusCode >= 500) {
            logger_1.logger.error({ err: error }, "Internal Server Error");
        }
        else {
            logger_1.logger.warn({ err: error }, "API Error");
        }
        return server_1.NextResponse.json({
            success: false,
            error: {
                code: error.code,
                message: error.publicMessage,
                details: error.details,
            },
        }, { status: error.statusCode });
    }
    if (error instanceof zod_1.ZodError) {
        logger_1.logger.warn({ err: error }, "Validation Error");
        return server_1.NextResponse.json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "The provided data is invalid.",
                details: error.flatten().fieldErrors,
            },
        }, { status: 422 });
    }
    // Unhandled errors — never expose internal details
    logger_1.logger.error({ err: error }, "Unhandled API Error");
    return server_1.NextResponse.json({
        success: false,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred.",
        },
    }, { status: 500 });
}
