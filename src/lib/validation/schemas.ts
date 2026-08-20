import { z } from "zod";

export const idSchema = z.string().cuid();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();
