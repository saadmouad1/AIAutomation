"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerRegistry = void 0;
const manual_trigger_1 = require("./manual-trigger");
const webhook_trigger_1 = require("./webhook-trigger");
const scheduled_trigger_1 = require("./scheduled-trigger");
class TriggerRegistry {
    static triggers = new Map([
        ["MANUAL", manual_trigger_1.manualTrigger],
        ["WEBHOOK", webhook_trigger_1.webhookTrigger],
        ["SCHEDULED", scheduled_trigger_1.scheduledTrigger]
    ]);
    static getTrigger(type) {
        const trigger = this.triggers.get(type);
        if (!trigger) {
            throw new Error(`TRIGGER_NOT_FOUND: Trigger type ${type} is not supported.`);
        }
        return trigger;
    }
}
exports.TriggerRegistry = TriggerRegistry;
