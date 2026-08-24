"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const codes_1 = require("./codes");
class AppError extends Error {
    code;
    statusCode;
    publicMessage;
    details;
    constructor({ code, message, statusCode, publicMessage, details, }) {
        super(message || codes_1.ERROR_MESSAGES[code]);
        this.code = code;
        this.statusCode = statusCode;
        this.publicMessage = publicMessage || codes_1.ERROR_MESSAGES[code];
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
    }
    static unauthorized(message) {
        return new AppError({
            code: codes_1.ErrorCode.UNAUTHORIZED,
            statusCode: 401,
            message,
            publicMessage: message,
        });
    }
    static forbidden(message) {
        return new AppError({
            code: codes_1.ErrorCode.FORBIDDEN,
            statusCode: 403,
            message,
            publicMessage: message,
        });
    }
    static notFound(message) {
        return new AppError({
            code: codes_1.ErrorCode.NOT_FOUND,
            statusCode: 404,
            message,
            publicMessage: message,
        });
    }
    static badRequest(message, details) {
        return new AppError({
            code: codes_1.ErrorCode.BAD_REQUEST,
            statusCode: 400,
            message,
            publicMessage: message,
            details,
        });
    }
    static conflict(message) {
        return new AppError({
            code: codes_1.ErrorCode.CONFLICT,
            statusCode: 409,
            message,
            publicMessage: message,
        });
    }
    static validation(details) {
        return new AppError({
            code: codes_1.ErrorCode.VALIDATION_ERROR,
            statusCode: 422,
            details,
        });
    }
    static internal(message, details) {
        return new AppError({
            code: codes_1.ErrorCode.INTERNAL_SERVER_ERROR,
            statusCode: 500,
            message,
            details,
        });
    }
}
exports.AppError = AppError;
