import { TriggerContext, TriggerExecutor } from "./types";
import { WorkflowExecutionService } from "../../../services/workflow-execution.service";

export const manualTrigger: TriggerExecutor = {
  type: "MANUAL",
  async execute(context: TriggerContext): Promise<string> {
    if (!context.userId) {
      throw new Error("INVALID_TRIGGER: Manual trigger requires a userId.");
    }

    const execution = await WorkflowExecutionService.executeManualTrigger(
      context.organizationId,
      context.workflowId,
      context.userId,
      context.input
    );

    return execution.id;
  },
};
