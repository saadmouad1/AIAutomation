export interface Contact {
  id: string;
  organizationId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "WON" | "LOST";

export interface Lead {
  id: string;
  organizationId: string;
  contactId: string;
  title: string;
  status: LeadStatus;
  value?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityType = "NOTE" | "EMAIL" | "CALL" | "MEETING";

export interface Activity {
  id: string;
  organizationId: string;
  contactId: string;
  type: ActivityType;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
