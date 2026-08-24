"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageExecutor = void 0;
/** E.164 format: +[country code][number], 7–15 digits total */
const E164_REGEX = /^\+[1-9]\d{6,14}$/;
/**
 * SEND_MESSAGE Node Executor
 *
 * Sends an SMS or WhatsApp message via Twilio.
 *
 * Configuration (from node.data):
 *   - channel: "sms" | "whatsapp"
 *   - to:      E.164 phone number or {{variable}} path
 *   - body:    Message text or {{variable}} path
 *
 * Credentials are read ONLY from process.env — never from node config:
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_SMS_FROM
 *   TWILIO_WHATSAPP_FROM
 */
class SendMessageExecutor {
    async execute(node, context) {
        const startTime = Date.now();
        try {
            const data = node.data;
            const channel = data.channel ?? "sms";
            // ── Resolve variables in `to` and `body` ──────────────────────────
            const to = this.interpolate(data.to ?? "", context);
            const body = this.interpolate(data.body ?? "", context);
            if (!to) {
                throw new Error("SEND_MESSAGE: 'to' is required.");
            }
            if (!body) {
                throw new Error("SEND_MESSAGE: 'body' is required.");
            }
            // ── Validate E.164 ─────────────────────────────────────────────────
            if (!E164_REGEX.test(to)) {
                throw new Error(`SEND_MESSAGE: 'to' must be in E.164 format (e.g. +12125550100). Got: ${to}`);
            }
            // ── Read credentials from environment ──────────────────────────────
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const smsSender = process.env.TWILIO_SMS_FROM;
            const whatsappSender = process.env.TWILIO_WHATSAPP_FROM;
            if (!accountSid || !authToken) {
                throw new Error("SEND_MESSAGE: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be configured.");
            }
            // ── Resolve sender / recipient based on channel ───────────────────
            let from;
            let toAddress;
            if (channel === "whatsapp") {
                if (!whatsappSender) {
                    throw new Error("SEND_MESSAGE: TWILIO_WHATSAPP_FROM must be configured for WhatsApp channel.");
                }
                from = `whatsapp:${whatsappSender}`;
                toAddress = `whatsapp:${to}`;
            }
            else {
                if (!smsSender) {
                    throw new Error("SEND_MESSAGE: TWILIO_SMS_FROM must be configured for SMS channel.");
                }
                from = smsSender;
                toAddress = to;
            }
            // ── Send via Twilio Messages API ───────────────────────────────────
            const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
            const formBody = new URLSearchParams({
                From: from,
                To: toAddress,
                Body: body,
            });
            const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
            const response = await fetch(twilioUrl, {
                method: "POST",
                headers: {
                    Authorization: `Basic ${credentials}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formBody.toString(),
            });
            const responseJson = await response.json();
            if (!response.ok) {
                const errMsg = responseJson.message ?? "Twilio API error";
                const errCode = responseJson.code ?? response.status;
                throw new Error(`SEND_MESSAGE: Twilio error ${errCode} — ${errMsg}`);
            }
            return {
                success: true,
                output: {
                    sid: responseJson.sid,
                    status: responseJson.status,
                    channel,
                    to,
                },
                durationMs: Date.now() - startTime,
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: "SEND_MESSAGE_ERROR",
                    message: error instanceof Error ? error.message : "Unknown error in SEND_MESSAGE",
                },
                durationMs: Date.now() - startTime,
            };
        }
    }
    /**
     * Interpolates {{path.to.value}} expressions against the execution context.
     * Uses the same path resolution logic as AiGenerateExecutor.
     */
    interpolate(template, context) {
        return template.replace(/\{\{([\w.]+)\}\}/g, (_match, path) => {
            const value = this.resolve(path, context);
            return value !== undefined ? String(value) : "";
        });
    }
    resolve(path, context) {
        const parts = path.split(".");
        // input.foo.bar
        if (parts[0] === "input") {
            let cur = context.input;
            for (let i = 1; i < parts.length; i++) {
                if (cur === null || cur === undefined || typeof cur !== "object")
                    return undefined;
                cur = cur[parts[i]];
            }
            return cur;
        }
        // nodeId.output.foo
        if (parts.length > 1) {
            const nodeId = parts[0];
            const result = context.nodeResults[nodeId];
            if (result?.output) {
                let cur = result.output;
                for (let i = 1; i < parts.length; i++) {
                    if (cur === null || cur === undefined || typeof cur !== "object")
                        return undefined;
                    cur = cur[parts[i]];
                }
                return cur;
            }
        }
        return undefined;
    }
}
exports.SendMessageExecutor = SendMessageExecutor;
