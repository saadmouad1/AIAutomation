"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationService = exports.OrganizationService = void 0;
const organization_repository_1 = require("../repositories/organization.repository");
const app_error_1 = require("../lib/errors/app-error");
class OrganizationService {
    async create(input) {
        if (!input.name || input.name.trim().length < 2) {
            throw app_error_1.AppError.validation({ name: ["Name must be at least 2 characters"] });
        }
        try {
            return await (0, organization_repository_1.createOrganization)(input);
        }
        catch (error) {
            // Handle potential slug collision or other DB errors gracefully
            throw app_error_1.AppError.internal("Failed to create organization");
        }
    }
    async getById(id) {
        const org = await (0, organization_repository_1.getOrganizationById)(id);
        if (!org) {
            throw app_error_1.AppError.notFound("Organization not found");
        }
        return org;
    }
    async listForUser(userId) {
        return (0, organization_repository_1.listUserOrganizations)(userId);
    }
}
exports.OrganizationService = OrganizationService;
exports.organizationService = new OrganizationService();
