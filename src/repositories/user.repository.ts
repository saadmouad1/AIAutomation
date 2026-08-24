import { db } from "../lib/db/client";

export async function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function findUserById(id: string) {
  return db.user.findUnique({
    where: { id },
  });
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  name: string;
}) {
  const orgName = `${data.name.split(" ")[0]}'s Workspace`;
  const orgSlug = `${data.name.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "")}-${Date.now()}`;

  return db.$transaction(async (tx) => {
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
