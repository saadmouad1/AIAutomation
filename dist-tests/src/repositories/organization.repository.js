"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganization = createOrganization;
exports.getOrganizationById = getOrganizationById;
exports.getOrganizationBySlug = getOrganizationBySlug;
exports.listUserOrganizations = listUserOrganizations;
const client_1 = require("../lib/db/client");
const roles_1 = require("../modules/permissions/roles");
async function createOrganization(input) {
    // Generate a simple slug from the name
    let slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    // Ensure uniqueness
    const existing = await client_1.db.organization.findUnique({ where: { slug } });
    if (existing) {
        slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
    }
    return client_1.db.organization.create({
        data: {
            name: input.name,
            slug,
            members: {
                create: {
                    userId: input.creatorId,
                    role: roles_1.Role.OWNER,
                },
            },
        },
    });
}
async function getOrganizationById(id) {
    return client_1.db.organization.findUnique({
        where: { id },
    });
}
async function getOrganizationBySlug(slug) {
    return client_1.db.organization.findUnique({
        where: { slug },
    });
}
async function listUserOrganizations(userId) {
    return client_1.db.organization.findMany({
        where: {
            members: {
                some: {
                    userId,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
