import { ErrorCode, ERROR_MESSAGES } from "./codes";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly publicMessage: string;
  public readonly details?: unknown;

  constructor({
    code,
    message,
    statusCode,
    publicMessage,
    details,
  }: {
    code: ErrorCode;
    message?: string;
    statusCode: number;
    publicMessage?: string;
    details?: unknown;
  }) {
    super(message || ERROR_MESSAGES[code]);
    this.code = code;
    this.statusCode = statusCode;
    this.publicMessage = publicMessage || ERROR_MESSAGES[code];
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
  }

  static unauthorized(message?: string) {
    return new AppError({
      code: ErrorCode.UNAUTHORIZED,
      statusCode: 401,
      publicMessage: message,
    });
  }

  static forbidden(message?: string) {
    return new AppError({
      code: ErrorCode.FORBIDDEN,
      statusCode: 403,
      publicMessage: message,
    });
  }

  static notFound(message?: string) {
    return new AppError({
      code: ErrorCode.NOT_FOUND,
      statusCode: 404,
      publicMessage: message,
    });
  }

  static badRequest(message?: string, details?: unknown) {
    return new AppError({
      code: ErrorCode.BAD_REQUEST,
      statusCode: 400,
      publicMessage: message,
      details,
    });
  }

  static conflict(message?: string) {
    return new AppError({
      code: ErrorCode.CONFLICT,
      statusCode: 409,
      publicMessage: message,
    });
  }

  static validation(details?: unknown) {
    return new AppError({
      code: ErrorCode.VALIDATION_ERROR,
      statusCode: 422,
      details,
    });
  }

  static internal(message?: string, details?: unknown) {
    return new AppError({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      statusCode: 500,
      message,
      details,
    });
  }
}
