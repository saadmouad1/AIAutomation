import { TriggerExecutor, TriggerType } from "./types";
import { manualTrigger } from "./manual-trigger";
import { webhookTrigger } from "./webhook-trigger";
import { scheduledTrigger } from "./scheduled-trigger";

export class TriggerRegistry {
  private static triggers: Map<string, TriggerExecutor> = new Map([
    ["MANUAL", manualTrigger],
    ["WEBHOOK", webhookTrigger],
    ["SCHEDULED", scheduledTrigger]
  ]);

  static getTrigger(type: string): TriggerExecutor {
    const trigger = this.triggers.get(type);
    if (!trigger) {
      throw new Error(`TRIGGER_NOT_FOUND: Trigger type ${type} is not supported.`);
    }
    return trigger;
  }
}
