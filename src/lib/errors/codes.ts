export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  CONFLICT = "CONFLICT",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.UNAUTHORIZED]: "You must be logged in to perform this action.",
  [ErrorCode.FORBIDDEN]: "You do not have permission to perform this action.",
  [ErrorCode.NOT_FOUND]: "The requested resource could not be found.",
  [ErrorCode.VALIDATION_ERROR]: "The provided data is invalid.",
  [ErrorCode.CONFLICT]: "A conflict occurred with the current state of the resource.",
  [ErrorCode.INTERNAL_SERVER_ERROR]: "An unexpected error occurred. Please try again later.",
  [ErrorCode.BAD_REQUEST]: "The request was malformed or invalid.",
};
