"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
exports.PATCH = PATCH;
exports.DELETE = DELETE;
const handler_1 = require("@/lib/errors/handler");
const context_1 = require("@/lib/tenant/context");
const member_service_1 = require("@/services/member.service");
const api_response_1 = require("@/lib/api-response");
const zod_1 = require("zod");
const roles_1 = require("@/modules/permissions/roles");
const inviteSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    role: zod_1.z.nativeEnum(roles_1.Role).default(roles_1.Role.MEMBER),
});
const updateRoleSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    role: zod_1.z.nativeEnum(roles_1.Role),
});
const removeMemberSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
});
async function GET(_req, { params }) {
    try {
        const { orgId } = await params;
        // Any member can read members list
        await (0, context_1.requireTenant)(orgId);
        const members = await member_service_1.memberService.listMembers(orgId);
        return api_response_1.ApiResponse.success(members);
    }
    catch (error) {
        return (0, handler_1.handleApiError)(error);
    }
}
async function POST(req, { params }) {
    try {
        const { orgId } = await params;
        await (0, context_1.requireRole)(orgId, "member:invite");
        const body = await req.json();
        const { email, role } = inviteSchema.parse(body);
        const member = await member_service_1.memberService.inviteMember(orgId, email, role);
        return api_response_1.ApiResponse.success(member, 201);
    }
    catch (error) {
        return (0, handler_1.handleApiError)(error);
    }
}
async function PATCH(req, { params }) {
    try {
        const { orgId } = await params;
        // Only OWNER can change roles (enforced at service layer too)
        await (0, context_1.requireRole)(orgId, "member:updateRole");
        const body = await req.json();
        const { userId, role } = updateRoleSchema.parse(body);
        const member = await member_service_1.memberService.changeRole(orgId, userId, role);
        return api_response_1.ApiResponse.success(member);
    }
    catch (error) {
        return (0, handler_1.handleApiError)(error);
    }
}
async function DELETE(req, { params }) {
    try {
        const { orgId } = await params;
        await (0, context_1.requireRole)(orgId, "member:remove");
        const body = await req.json();
        const { userId } = removeMemberSchema.parse(body);
        await member_service_1.memberService.removeMember(orgId, userId);
        return api_response_1.ApiResponse.success({ removed: true });
    }
    catch (error) {
        return (0, handler_1.handleApiError)(error);
    }
}
