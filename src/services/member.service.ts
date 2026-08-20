import {
  addMemberToOrganization,
  removeMemberFromOrganization,
  updateMemberRole,
  getOrganizationMembers,
  getMember,
} from "../repositories/member.repository";
import { Role } from "../modules/permissions/roles";
import { AppError } from "../lib/errors/app-error";
import { findUserByEmail } from "../repositories/user.repository";

export class MemberService {
  async inviteMember(organizationId: string, email: string, role: Role) {
    const user = await findUserByEmail(email);

    if (!user) {
      throw AppError.badRequest("User not found with this email");
    }

    const existing = await getMember(organizationId, user.id);
    if (existing) {
      throw AppError.conflict("User is already a member of this organization");
    }

    return addMemberToOrganization(organizationId, user.id, role);
  }

  async removeMember(organizationId: string, userId: string) {
    const member = await getMember(organizationId, userId);
    
    if (!member) {
      throw AppError.notFound("Member not found");
    }

    if (member.role === Role.OWNER) {
      throw AppError.forbidden("Cannot remove the organization owner");
    }

    return removeMemberFromOrganization(organizationId, userId);
  }

  async changeRole(organizationId: string, userId: string, newRole: Role) {
    const member = await getMember(organizationId, userId);
    
    if (!member) {
      throw AppError.notFound("Member not found");
    }

    if (member.role === Role.OWNER && newRole !== Role.OWNER) {
      throw AppError.forbidden("Cannot change the role of the organization owner");
    }

    return updateMemberRole(organizationId, userId, newRole);
  }

  async listMembers(organizationId: string) {
    return getOrganizationMembers(organizationId);
  }
}

export const memberService = new MemberService();
