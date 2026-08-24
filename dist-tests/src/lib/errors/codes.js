"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["CONFLICT"] = "CONFLICT";
    ErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    ErrorCode["BAD_REQUEST"] = "BAD_REQUEST";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
exports.ERROR_MESSAGES = {
    [ErrorCode.UNAUTHORIZED]: "You must be logged in to perform this action.",
    [ErrorCode.FORBIDDEN]: "You do not have permission to perform this action.",
    [ErrorCode.NOT_FOUND]: "The requested resource could not be found.",
    [ErrorCode.VALIDATION_ERROR]: "The provided data is invalid.",
    [ErrorCode.CONFLICT]: "A conflict occurred with the current state of the resource.",
    [ErrorCode.INTERNAL_SERVER_ERROR]: "An unexpected error occurred. Please try again later.",
    [ErrorCode.BAD_REQUEST]: "The request was malformed or invalid.",
};
