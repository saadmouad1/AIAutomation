"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetValueExecutor = void 0;
class SetValueExecutor {
    async execute(node, context) {
        const startTime = Date.now();
        try {
            const data = node.data;
            if (!data.key) {
                throw new Error("SET_VALUE node requires a 'key' in configuration.");
            }
            // We store the new value in the execution context output
            return {
                success: true,
                output: { [data.key]: data.value },
                durationMs: Date.now() - startTime,
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: "SET_VALUE_ERROR",
                    message: error instanceof Error ? error.message : "Unknown error in SET_VALUE",
                },
                durationMs: Date.now() - startTime,
            };
        }
    }
}
exports.SetValueExecutor = SetValueExecutor;
