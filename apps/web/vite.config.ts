import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  // A production build without a key would ship a site that silently records nothing.
  if (command === "build" && mode === "production" && !loadEnv(mode, process.cwd(), "VITE_").VITE_POSTHOG_KEY) {
    throw new Error("VITE_POSTHOG_KEY is not set. Put the PostHog project token in apps/web/.env.production.");
  }
  return {
    plugins: [react()],
    worker: { format: "es" },
    build: { target: "es2022", assetsInlineLimit: 0 },
  };
});
