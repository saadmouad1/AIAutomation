"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookTrigger = void 0;
const workflow_execution_service_1 = require("../../../services/workflow-execution.service");
exports.webhookTrigger = {
    type: "WEBHOOK",
    async execute(context) {
        const execution = await workflow_execution_service_1.WorkflowExecutionService.executeWebhookTrigger(context.organizationId, context.workflowId, context.input);
        return execution.id;
    },
};
