import { TriggerContext, TriggerExecutor } from "./types";
import { WorkflowExecutionService } from "../../../services/workflow-execution.service";

export const scheduledTrigger: TriggerExecutor = {
  type: "SCHEDULED" as any, 
  async execute(context: TriggerContext): Promise<string> {
    const execution = await WorkflowExecutionService.executeWebhookTrigger(
      context.organizationId,
      context.workflowId,
      context.input
    );
    return execution.id;
  },
};
