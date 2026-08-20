import { db } from "../lib/db/client";
import { CreateOrganizationInput } from "../types/organization";
import { Role } from "../modules/permissions/roles";

export async function createOrganization(input: CreateOrganizationInput) {
  // Generate a simple slug from the name
  let slug = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // Ensure uniqueness
  const existing = await db.organization.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
  }

  return db.organization.create({
    data: {
      name: input.name,
      slug,
      members: {
        create: {
          userId: input.creatorId,
          role: Role.OWNER,
        },
      },
    },
  });
}

export async function getOrganizationById(id: string) {
  return db.organization.findUnique({
    where: { id },
  });
}

export async function getOrganizationBySlug(slug: string) {
  return db.organization.findUnique({
    where: { slug },
  });
}

export async function listUserOrganizations(userId: string) {
  return db.organization.findMany({
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
