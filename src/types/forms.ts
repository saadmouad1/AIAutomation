export type FormFieldType = "text" | "email" | "textarea" | "select" | "checkbox" | "number" | "phone";
export type FormStatus = "draft" | "published" | "archived";

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface Form {
  id: string;
  organizationId: string;
  title: string;
  description?: string;
  status: FormStatus;
  submissionCount: number;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, string>;
  createdAt: Date;
}
