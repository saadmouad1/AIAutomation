import { Form, FormField, FormSubmission } from "../../types/forms";

const ORG_ID = "mock-org-1";
const now = new Date();
const ago = (days: number) => new Date(now.getTime() - days * 86400000);

export const MOCK_FORMS: Form[] = [
  {
    id: "form-1", organizationId: ORG_ID,
    title: "Contact Us",
    description: "General inquiry form",
    status: "published",
    submissionCount: 24,
    fields: [
      { id: "f1", type: "text",  label: "Full Name",     required: true  },
      { id: "f2", type: "email", label: "Email Address", required: true  },
      { id: "f3", type: "textarea", label: "Message",    required: false },
    ],
    createdAt: ago(30), updatedAt: ago(2),
  },
  {
    id: "form-2", organizationId: ORG_ID,
    title: "Lead Capture",
    description: "Collect leads from landing page",
    status: "published",
    submissionCount: 57,
    fields: [
      { id: "f1", type: "text",  label: "Company Name", required: true  },
      { id: "f2", type: "email", label: "Work Email",   required: true  },
      { id: "f3", type: "select", label: "Team size",   required: false, options: ["1–5", "6–20", "21–100", "100+"] },
    ],
    createdAt: ago(60), updatedAt: ago(5),
  },
  {
    id: "form-3", organizationId: ORG_ID,
    title: "Support Request",
    description: "Help desk intake form",
    status: "draft",
    submissionCount: 0,
    fields: [
      { id: "f1", type: "text",  label: "Subject",     required: true  },
      { id: "f2", type: "textarea", label: "Details",  required: true  },
    ],
    createdAt: ago(3), updatedAt: ago(1),
  },
];

export const MOCK_SUBMISSIONS: FormSubmission[] = [
  { id: "sub-1", formId: "form-1", data: { "Full Name": "Alice Smith", "Email Address": "alice@acmecorp.com", Message: "Interested in your platform." }, createdAt: ago(1) },
  { id: "sub-2", formId: "form-1", data: { "Full Name": "Bob Johnson", "Email Address": "bob@techstart.io",   Message: "Can we schedule a call?" }, createdAt: ago(2) },
  { id: "sub-3", formId: "form-2", data: { "Company Name": "Innovate Co", "Work Email": "david@innovate.co", "Team size": "21–100" }, createdAt: ago(1) },
];

export const getMockForms  = () => Promise.resolve(MOCK_FORMS);
export const getMockForm   = (id: string) => Promise.resolve(MOCK_FORMS.find(f => f.id === id) ?? null);
export const getMockSubmissions = (formId: string) => Promise.resolve(MOCK_SUBMISSIONS.filter(s => s.formId === formId));
