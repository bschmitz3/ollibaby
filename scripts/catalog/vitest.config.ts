import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["scripts/catalog/src/**/*.test.ts"],
    environment: "node",
    reporters: ["default"],
  },
});

