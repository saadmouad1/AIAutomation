"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manualTrigger = void 0;
const workflow_execution_service_1 = require("../../../services/workflow-execution.service");
exports.manualTrigger = {
    type: "MANUAL",
    async execute(context) {
        if (!context.userId) {
            throw new Error("INVALID_TRIGGER: Manual trigger requires a userId.");
        }
        const execution = await workflow_execution_service_1.WorkflowExecutionService.executeManualTrigger(context.organizationId, context.workflowId, context.userId, context.input);
        return execution.id;
    },
};
