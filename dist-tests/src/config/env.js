"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url(),
    NEXTAUTH_SECRET: zod_1.z.string().min(1),
    NEXTAUTH_URL: zod_1.z.string().url().optional(),
    NODE_ENV: zod_1.z
        .enum(["development", "test", "production"])
        .default("development"),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
}
exports.env = parsed.data;
