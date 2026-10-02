import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const web = fileURLToPath(new URL(".", import.meta.url));
const generated = join(web, "generated");

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

/*
  The guides and static pages are rendered by blog/build.ts, which needs Bun, so it runs as
  a child process. Its output goes to generated/ (not public/, so none of it is committed):
  dev serves that folder directly and a build copies it into dist/.
*/
function guides(): Plugin {
  const render = () => execFileSync("bun", [join(web, "blog", "build.ts")], { stdio: "inherit" });
  let outDir = "";
  return {
    name: "guides",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    buildStart() {
      render();
    },
    closeBundle() {
      cpSync(generated, outDir, { recursive: true });
    },
    configureServer(server) {
      const sources = [join(web, "blog") + sep, join(web, "pages") + sep];
      server.watcher.add(sources);
      server.watcher.on("all", (_event, file) => {
        if (!sources.some((dir) => file.startsWith(dir))) return;
        try {
          render();
          server.ws.send({ type: "full-reload" });
        } catch {
          // build.ts has already printed why; the last good pages stay up until the source is fixed.
          server.config.logger.error("Guides failed to build; see the error above.");
        }
      });
      server.middlewares.use((req, res, next) => {
        const path = decodeURIComponent((req.url ?? "/").split("?")[0]!);
        const file = join(generated, path.endsWith("/") ? join(path, "index.html") : path);
        if (!file.startsWith(generated + sep) || !existsSync(file) || !statSync(file).isFile()) return next();
        res.setHeader("Content-Type", TYPES[extname(file)] ?? "application/octet-stream");
        res.end(readFileSync(file));
      });
    },
  };
}

// The analytics token lives in src/analytics.ts rather than an environment file, so a
// build needs nothing configured and can no longer ship without instrumentation.
export default defineConfig({
  plugins: [react(), guides()],
  worker: { format: "es" },
  build: {
    target: "es2022",
    assetsInlineLimit: 0,
    rollupOptions: { input: { main: "index.html", checker: "432-hz-checker/index.html" } },
  },
});
