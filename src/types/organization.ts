import { Role } from "../modules/permissions/roles";

export interface CreateOrganizationInput {
  name: string;
  creatorId: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
