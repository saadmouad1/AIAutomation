"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const handler_1 = require("@/lib/errors/handler");
const auth_1 = require("@/lib/auth");
const organization_service_1 = require("@/services/organization.service");
const schemas_1 = require("@/lib/validation/schemas");
const api_response_1 = require("@/lib/api-response");
async function GET(req) {
    try {
        const user = await (0, auth_1.requireUser)();
        const organizations = await organization_service_1.organizationService.listForUser(user.id);
        return api_response_1.ApiResponse.success(organizations);
    }
    catch (error) {
        return (0, handler_1.handleApiError)(error);
    }
}
async function POST(req) {
    try {
        const user = await (0, auth_1.requireUser)();
        const body = await req.json();
        const { name } = schemas_1.createOrganizationSchema.parse(body);
        const organization = await organization_service_1.organizationService.create({
            name,
            creatorId: user.id,
        });
        return api_response_1.ApiResponse.success(organization, 201);
    }
    catch (error) {
        return (0, handler_1.handleApiError)(error);
    }
}
