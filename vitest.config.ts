import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: [],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@workspace/languages": path.resolve(__dirname, "lib/languages/src/exports.ts"),
      "@workspace/api-zod": path.resolve(__dirname, "lib/api-zod/src/index.ts"),
    },
  },
});
