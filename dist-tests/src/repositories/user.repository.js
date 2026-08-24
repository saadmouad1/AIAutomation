"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.createUser = createUser;
const client_1 = require("../lib/db/client");
async function findUserByEmail(email) {
    return client_1.db.user.findUnique({
        where: { email: email.toLowerCase() },
    });
}
async function findUserById(id) {
    return client_1.db.user.findUnique({
        where: { id },
    });
}
async function createUser(data) {
    const orgName = `${data.name.split(" ")[0]}'s Workspace`;
    const orgSlug = `${data.name.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "")}-${Date.now()}`;
    return client_1.db.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email: data.email.toLowerCase(),
                passwordHash: data.passwordHash,
                name: data.name,
            },
        });
        const org = await tx.organization.create({
            data: {
                name: orgName,
                slug: orgSlug,
            },
        });
        await tx.organizationMember.create({
            data: {
                userId: user.id,
                organizationId: org.id,
                role: "OWNER",
            },
        });
        return user;
    });
}
