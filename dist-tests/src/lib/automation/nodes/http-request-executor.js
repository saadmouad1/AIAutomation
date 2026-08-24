"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequestExecutor = void 0;
const MAX_RESPONSE_SIZE = 5 * 1024 * 1024; // 5 MB
const DEFAULT_TIMEOUT_MS = 10000;
class HttpRequestExecutor {
    async execute(node, context) {
        const startTime = Date.now();
        try {
            const data = node.data;
            if (!data.url) {
                throw new Error("HTTP_REQUEST node requires a 'url'.");
            }
            this.validateUrl(data.url);
            const method = (data.method || "GET").toUpperCase();
            const validMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
            if (!validMethods.includes(method)) {
                throw new Error(`Invalid HTTP method: ${method}`);
            }
            const headers = new Headers();
            if (data.headers) {
                for (const [key, value] of Object.entries(data.headers)) {
                    headers.set(key, value);
                }
            }
            const controller = new AbortController();
            const timeout = data.timeoutMs || DEFAULT_TIMEOUT_MS;
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            const response = await fetch(data.url, {
                method,
                headers,
                body: ["POST", "PUT", "PATCH"].includes(method) && data.body ? data.body : undefined,
                signal: controller.signal,
                redirect: "manual", // Prevent automatic redirects to mitigate some SSRF risks
            });
            clearTimeout(timeoutId);
            if (response.status >= 300 && response.status < 400) {
                throw new Error(`HTTP Redirects are not permitted (Status: ${response.status})`);
            }
            const responseText = await this.readResponseWithLimit(response, MAX_RESPONSE_SIZE);
            let parsedBody = responseText;
            try {
                parsedBody = JSON.parse(responseText);
            }
            catch {
                // Leave as string if not JSON
            }
            // We do not log headers to avoid leaking secrets
            return {
                success: response.ok,
                output: {
                    status: response.status,
                    body: parsedBody,
                },
                durationMs: Date.now() - startTime,
            };
        }
        catch (error) {
            let message = "Unknown error in HTTP_REQUEST";
            if (error instanceof Error) {
                if (error.name === "AbortError") {
                    message = "HTTP request timed out.";
                }
                else {
                    message = error.message;
                }
            }
            return {
                success: false,
                error: {
                    code: "HTTP_REQUEST_ERROR",
                    message,
                },
                durationMs: Date.now() - startTime,
            };
        }
    }
    validateUrl(urlString) {
        let url;
        try {
            url = new URL(urlString);
        }
        catch {
            throw new Error(`Invalid URL format: ${urlString}`);
        }
        if (url.protocol !== "http:" && url.protocol !== "https:") {
            throw new Error(`Invalid URL protocol: ${url.protocol}`);
        }
        const hostname = url.hostname.toLowerCase();
        // Basic SSRF protections based on hostname parsing (MVP level)
        const blockedHostnames = ["localhost", "169.254.169.254", "metadata.google.internal"];
        if (blockedHostnames.includes(hostname)) {
            throw new Error("Blocked URL: Metadata/Localhost endpoints are not permitted.");
        }
        // Block IPv4 loopback and private ranges based on string matching
        // Note: A full SSRF protection requires DNS resolution checking, but this provides baseline MVP protection
        if (hostname === "127.0.0.1" ||
            hostname === "::1" ||
            hostname.startsWith("10.") ||
            hostname.startsWith("192.168.") ||
            (hostname.startsWith("172.") && this.is172Private(hostname))) {
            throw new Error("Blocked URL: Private or loopback IP addresses are not permitted.");
        }
    }
    is172Private(hostname) {
        const parts = hostname.split(".");
        if (parts.length === 4) {
            const secondOctet = parseInt(parts[1], 10);
            return secondOctet >= 16 && secondOctet <= 31;
        }
        return false;
    }
    async readResponseWithLimit(response, limit) {
        const reader = response.body?.getReader();
        if (!reader)
            return "";
        let receivedLength = 0;
        let chunks = [];
        const decoder = new TextDecoder("utf-8");
        let result = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            if (value) {
                receivedLength += value.length;
                if (receivedLength > limit) {
                    reader.cancel();
                    throw new Error(`Response size exceeded the limit of ${limit} bytes.`);
                }
                result += decoder.decode(value, { stream: true });
            }
        }
        result += decoder.decode();
        return result;
    }
}
exports.HttpRequestExecutor = HttpRequestExecutor;
