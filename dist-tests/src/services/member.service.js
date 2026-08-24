"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberService = exports.MemberService = void 0;
const member_repository_1 = require("../repositories/member.repository");
const roles_1 = require("../modules/permissions/roles");
const app_error_1 = require("../lib/errors/app-error");
const user_repository_1 = require("../repositories/user.repository");
class MemberService {
    async inviteMember(organizationId, email, role) {
        const user = await (0, user_repository_1.findUserByEmail)(email);
        if (!user) {
            throw app_error_1.AppError.badRequest("User not found with this email");
        }
        const existing = await (0, member_repository_1.getMember)(organizationId, user.id);
        if (existing) {
            throw app_error_1.AppError.conflict("User is already a member of this organization");
        }
        return (0, member_repository_1.addMemberToOrganization)(organizationId, user.id, role);
    }
    async removeMember(organizationId, userId) {
        const member = await (0, member_repository_1.getMember)(organizationId, userId);
        if (!member) {
            throw app_error_1.AppError.notFound("Member not found");
        }
        if (member.role === roles_1.Role.OWNER) {
            throw app_error_1.AppError.forbidden("Cannot remove the organization owner");
        }
        return (0, member_repository_1.removeMemberFromOrganization)(organizationId, userId);
    }
    async changeRole(organizationId, userId, newRole) {
        const member = await (0, member_repository_1.getMember)(organizationId, userId);
        if (!member) {
            throw app_error_1.AppError.notFound("Member not found");
        }
        if (member.role === roles_1.Role.OWNER && newRole !== roles_1.Role.OWNER) {
            throw app_error_1.AppError.forbidden("Cannot change the role of the organization owner");
        }
        return (0, member_repository_1.updateMemberRole)(organizationId, userId, newRole);
    }
    async listMembers(organizationId) {
        return (0, member_repository_1.getOrganizationMembers)(organizationId);
    }
}
exports.MemberService = MemberService;
exports.memberService = new MemberService();
