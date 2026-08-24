"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const server_1 = require("next/server");
exports.ApiResponse = {
    success(data, status = 200) {
        return server_1.NextResponse.json({ success: true, data }, { status });
    },
    error(code, message, status = 400) {
        return server_1.NextResponse.json({ success: false, error: { code, message } }, { status });
    }
};
