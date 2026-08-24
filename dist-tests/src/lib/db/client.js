"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
const createPrismaClient = () => {
    if (process.env.NODE_ENV === "test") {
        if (!process.env.TEST_DATABASE_URL) {
            throw new Error("TEST_DATABASE_URL is required in test environment");
        }
        if (!process.env.TEST_DATABASE_URL.includes("schema=test") && !process.env.TEST_DATABASE_URL.includes("schema=tenant_test")) {
            throw new Error("TEST_DATABASE_URL must explicitly target a test schema (e.g., ?schema=test)");
        }
        // Force the Prisma client to use the test database
        process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
        // Also override DIRECT_URL so Prisma uses the stable direct connection
        // The pooler (port 6543) can drop mid-run; the direct port (5432) is stable.
        if (process.env.TEST_DIRECT_URL) {
            process.env.DIRECT_URL = process.env.TEST_DIRECT_URL;
        }
    }
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is required");
    }
    if (process.env.NODE_ENV === "test" && !process.env.DATABASE_URL.includes("schema=")) {
        throw new Error("Safety abort: DATABASE_URL does not contain a schema definition during tests");
    }
    return new client_1.PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
};
// Use a singleton to avoid exhausting DB connections in development with HMR
exports.db = globalThis.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = exports.db;
}
