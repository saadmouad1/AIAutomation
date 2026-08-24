"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMemberToOrganization = addMemberToOrganization;
exports.removeMemberFromOrganization = removeMemberFromOrganization;
exports.updateMemberRole = updateMemberRole;
exports.getOrganizationMembers = getOrganizationMembers;
exports.getMember = getMember;
const client_1 = require("../lib/db/client");
const roles_1 = require("../modules/permissions/roles");
async function addMemberToOrganization(organizationId, userId, role = roles_1.Role.MEMBER) {
    return client_1.db.organizationMember.create({
        data: {
            organizationId,
            userId,
            role,
        },
    });
}
async function removeMemberFromOrganization(organizationId, userId) {
    return client_1.db.organizationMember.delete({
        where: {
            organizationId_userId: {
                organizationId,
                userId,
            },
        },
    });
}
async function updateMemberRole(organizationId, userId, role) {
    return client_1.db.organizationMember.update({
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
async function getOrganizationMembers(organizationId) {
    return client_1.db.organizationMember.findMany({
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
async function getMember(organizationId, userId) {
    return client_1.db.organizationMember.findUnique({
        where: {
            organizationId_userId: {
                organizationId,
                userId,
            },
        },
    });
}
