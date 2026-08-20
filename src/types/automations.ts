export type AutomationStatus = "active" | "paused" | "draft" | "error";
export type TriggerType = "form_submitted" | "contact_created" | "lead_status_changed" | "schedule" | "webhook" | "manual";
export type ActionType = "send_email" | "create_lead" | "create_task" | "send_notification" | "update_field" | "http_request";

export interface WorkflowStep {
  id: string;
  type: "trigger" | "action" | "condition";
  name: string;
  description: string;
  icon?: string;
  config?: Record<string, unknown>;
}

export interface Automation {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  status: AutomationStatus;
  runCount: number;
  lastRunAt?: Date | null;
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
}
