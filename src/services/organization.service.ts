import {
  createOrganization,
  getOrganizationById,
  listUserOrganizations,
} from "../repositories/organization.repository";
import { CreateOrganizationInput } from "../types/organization";
import { AppError } from "../lib/errors/app-error";

export class OrganizationService {
  async create(input: CreateOrganizationInput) {
    if (!input.name || input.name.trim().length < 2) {
      throw AppError.validation({ name: ["Name must be at least 2 characters"] });
    }

    try {
      return await createOrganization(input);
    } catch (error) {
      // Handle potential slug collision or other DB errors gracefully
      throw AppError.internal("Failed to create organization");
    }
  }

  async getById(id: string) {
    const org = await getOrganizationById(id);
    if (!org) {
      throw AppError.notFound("Organization not found");
    }
    return org;
  }

  async listForUser(userId: string) {
    return listUserOrganizations(userId);
  }
}

export const organizationService = new OrganizationService();
