import { Automation } from "../../types/automations";

const ORG_ID = "mock-org-1";
const now = new Date();
const ago = (days: number) => new Date(now.getTime() - days * 86400000);

export const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: "auto-1", organizationId: ORG_ID,
    name: "Lead Qualification",
    description: "Qualifies and routes new leads from the contact form",
    status: "active",
    runCount: 148,
    lastRunAt: new Date(now.getTime() - 5 * 60000),
    steps: [
      { id: "s1", type: "trigger", name: "Form submitted",    description: "Website contact form" },
      { id: "s2", type: "action",  name: "Create lead",       description: "Add to Leads pipeline" },
      { id: "s3", type: "condition", name: "Check priority",  description: "Is subject urgent?" },
      { id: "s4", type: "action",  name: "Notify team",       description: "Send Slack notification" },
      { id: "s5", type: "action",  name: "Send confirmation", description: "Email confirmation to submitter" },
    ],
    createdAt: ago(30), updatedAt: ago(2),
  },
  {
    id: "auto-2", organizationId: ORG_ID,
    name: "New Contact Welcome",
    description: "Sends a welcome email when a contact is created",
    status: "active",
    runCount: 72,
    lastRunAt: ago(1),
    steps: [
      { id: "s1", type: "trigger", name: "Contact created", description: "New contact added to CRM" },
      { id: "s2", type: "action",  name: "Send welcome email", description: "Send onboarding email" },
    ],
    createdAt: ago(20), updatedAt: ago(5),
  },
  {
    id: "auto-3", organizationId: ORG_ID,
    name: "Weekly Summary Report",
    description: "Sends a weekly summary to the team every Monday",
    status: "paused",
    runCount: 12,
    lastRunAt: ago(7),
    steps: [
      { id: "s1", type: "trigger", name: "Schedule",         description: "Every Monday at 9:00 AM" },
      { id: "s2", type: "action",  name: "Generate summary", description: "Compile weekly stats" },
      { id: "s3", type: "action",  name: "Send email",       description: "Send to team@company.com" },
    ],
    createdAt: ago(45), updatedAt: ago(7),
  },
  {
    id: "auto-4", organizationId: ORG_ID,
    name: "High-Value Lead Alert",
    description: "Alerts sales when a lead value exceeds $10k",
    status: "draft",
    runCount: 0,
    lastRunAt: null,
    steps: [
      { id: "s1", type: "trigger",   name: "Lead updated",    description: "Lead value changes" },
      { id: "s2", type: "condition", name: "Check value",     description: "Value > $10,000" },
      { id: "s3", type: "action",    name: "Notify sales",    description: "Send priority alert" },
    ],
    createdAt: ago(2), updatedAt: ago(1),
  },
];

export const TEMPLATE_AUTOMATIONS: Array<{ id: string; name: string; description: string; steps: Automation["steps"] }> = [
  {
    id: "tpl-1",
    name: "Form to Lead",
    description: "Capture form submissions and create CRM leads",
    steps: [
      { id: "s1", type: "trigger", name: "Form submitted",  description: "Any form submission" },
      { id: "s2", type: "action",  name: "Create lead",     description: "Add to Leads pipeline" },
      { id: "s3", type: "action",  name: "Send email",      description: "Send confirmation email" },
    ],
  },
  {
    id: "tpl-2",
    name: "Lead Follow-up",
    description: "Auto-follow-up with leads after 2 days of no response",
    steps: [
      { id: "s1", type: "trigger",   name: "Lead created",    description: "New lead added" },
      { id: "s2", type: "condition", name: "Wait 2 days",     description: "If no response in 48h" },
      { id: "s3", type: "action",    name: "Send follow-up",  description: "Send follow-up email" },
    ],
  },
];

export const getMockAutomations = () => Promise.resolve(MOCK_AUTOMATIONS);
export const getMockAutomation  = (id: string) => Promise.resolve(MOCK_AUTOMATIONS.find(a => a.id === id) ?? null);
