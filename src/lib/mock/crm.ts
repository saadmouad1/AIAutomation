import { Contact, Lead, Activity, LeadStatus } from "../../types/crm";

const ORG_ID = "mock-org-1";

export const MOCK_CONTACTS: Contact[] = [
  {
    id: "contact-1",
    organizationId: ORG_ID,
    name: "Alice Smith",
    email: "alice@acmecorp.com",
    phone: "+1 555-0100",
    company: "Acme Corp",
    createdAt: new Date("2023-01-15T10:00:00Z"),
    updatedAt: new Date("2023-01-15T10:00:00Z"),
  },
  {
    id: "contact-2",
    organizationId: ORG_ID,
    name: "Bob Johnson",
    email: "bob@techstart.io",
    phone: "+1 555-0200",
    company: "TechStart",
    createdAt: new Date("2023-02-20T14:30:00Z"),
    updatedAt: new Date("2023-02-20T14:30:00Z"),
  },
  {
    id: "contact-3",
    organizationId: ORG_ID,
    name: "Carol Williams",
    email: "carol@globalreach.net",
    phone: null,
    company: "Global Reach",
    createdAt: new Date("2023-03-05T09:15:00Z"),
    updatedAt: new Date("2023-03-05T09:15:00Z"),
  },
  {
    id: "contact-4",
    organizationId: ORG_ID,
    name: "David Brown",
    email: "david@innovate.co",
    phone: "+1 555-0400",
    company: "Innovate Co",
    createdAt: new Date("2023-04-10T11:45:00Z"),
    updatedAt: new Date("2023-04-10T11:45:00Z"),
  },
];

export const MOCK_LEADS: Lead[] = [
  {
    id: "lead-1",
    organizationId: ORG_ID,
    contactId: "contact-1",
    title: "Enterprise License Expansion",
    status: "QUALIFIED",
    value: 25000,
    createdAt: new Date("2023-05-01T10:00:00Z"),
    updatedAt: new Date("2023-05-02T10:00:00Z"),
  },
  {
    id: "lead-2",
    organizationId: ORG_ID,
    contactId: "contact-2",
    title: "New Implementation",
    status: "NEW",
    value: 12000,
    createdAt: new Date("2023-06-15T14:00:00Z"),
    updatedAt: new Date("2023-06-15T14:00:00Z"),
  },
  {
    id: "lead-3",
    organizationId: ORG_ID,
    contactId: "contact-3",
    title: "Consulting Services",
    status: "CONTACTED",
    value: 5000,
    createdAt: new Date("2023-07-20T09:00:00Z"),
    updatedAt: new Date("2023-07-21T09:00:00Z"),
  },
  {
    id: "lead-4",
    organizationId: ORG_ID,
    contactId: "contact-4",
    title: "Platform Migration",
    status: "WON",
    value: 45000,
    createdAt: new Date("2023-08-10T11:00:00Z"),
    updatedAt: new Date("2023-08-25T11:00:00Z"),
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "activity-1",
    organizationId: ORG_ID,
    contactId: "contact-1",
    type: "MEETING",
    content: "Initial discovery call to discuss expansion.",
    createdAt: new Date("2023-05-02T10:00:00Z"),
    updatedAt: new Date("2023-05-02T10:00:00Z"),
  },
  {
    id: "activity-2",
    organizationId: ORG_ID,
    contactId: "contact-1",
    type: "EMAIL",
    content: "Sent proposal and pricing sheet.",
    createdAt: new Date("2023-05-05T14:00:00Z"),
    updatedAt: new Date("2023-05-05T14:00:00Z"),
  },
  {
    id: "activity-3",
    organizationId: ORG_ID,
    contactId: "contact-2",
    type: "NOTE",
    content: "Client requested feature roadmap.",
    createdAt: new Date("2023-06-16T09:30:00Z"),
    updatedAt: new Date("2023-06-16T09:30:00Z"),
  }
];

// Helper functions for mock data
export function getMockContacts() {
  return Promise.resolve(MOCK_CONTACTS);
}

export function getMockContact(id: string) {
  const contact = MOCK_CONTACTS.find(c => c.id === id);
  return Promise.resolve(contact || null);
}

export function getMockLeads() {
  return Promise.resolve(MOCK_LEADS);
}

export function getMockContactLeads(contactId: string) {
  const leads = MOCK_LEADS.filter(l => l.contactId === contactId);
  return Promise.resolve(leads);
}

export function getMockContactActivities(contactId: string) {
  const activities = MOCK_ACTIVITIES.filter(a => a.contactId === contactId);
  return Promise.resolve(activities);
}
