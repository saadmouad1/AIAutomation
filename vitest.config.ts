import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
        },
        resolve: {
          alias: { "@": resolve(__dirname, "./src") },
        },
      },
      {
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.{test,spec}.{ts,tsx}"],
          // Integration tests use a separate database — never touches production/dev
          env: {
            DATABASE_URL: process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? "",
          },
        },
        resolve: {
          alias: { "@": resolve(__dirname, "./src") },
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "tests/setup.ts",
        "**/*.d.ts",
        "src/app/**",
        "tailwind.config.ts",
        "next.config.ts",
        "vitest.config.ts",
        "prisma.config.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
