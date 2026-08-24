"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const handler_1 = require("@/lib/errors/handler");
const auth_service_1 = require("@/services/auth.service");
async function POST(req) {
    try {
        const body = await req.json();
        const user = await auth_service_1.authService.register(body);
        return server_1.NextResponse.json({ data: user }, { status: 201 });
    }
    catch (error) {
        return (0, handler_1.handleApiError)(error);
    }
}
