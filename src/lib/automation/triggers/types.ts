export type TriggerType = "MANUAL" | "WEBHOOK";

export interface TriggerContext {
  workflowId: string;
  organizationId: string;
  input?: Record<string, unknown>;
  userId?: string; // For manual triggers
}

export interface TriggerExecutor {
  type: TriggerType;
  execute(context: TriggerContext): Promise<string>; // Returns execution ID
}
