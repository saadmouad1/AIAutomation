import { db } from "../lib/db/client";
import { Role } from "../modules/permissions/roles";

export async function addMemberToOrganization(
  organizationId: string,
  userId: string,
  role: Role = Role.MEMBER
) {
  return db.organizationMember.create({
    data: {
      organizationId,
      userId,
      role,
    },
  });
}

export async function removeMemberFromOrganization(
  organizationId: string,
  userId: string
) {
  return db.organizationMember.delete({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });
}

export async function updateMemberRole(
  organizationId: string,
  userId: string,
  role: Role
) {
  return db.organizationMember.update({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
    data: {
      role,
    },
  });
}

export async function getOrganizationMembers(organizationId: string) {
  return db.organizationMember.findMany({
    where: { organizationId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

export async function getMember(organizationId: string, userId: string) {
  return db.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });
}
