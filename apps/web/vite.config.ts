import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The analytics token lives in src/analytics.ts rather than an environment file, so a
// build needs nothing configured and can no longer ship without instrumentation.
export default defineConfig({
  plugins: [react()],
  worker: { format: "es" },
  build: {
    target: "es2022",
    assetsInlineLimit: 0,
    rollupOptions: { input: { main: "index.html", checker: "432-hz-checker/index.html" } },
  },
});
