import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

const webRoot = path.dirname(fileURLToPath(import.meta.url));

function resolveCurriculoPath(): string {
  const candidates = [
    path.resolve(webRoot, "../../curriculo.md"),
    path.resolve(webRoot, "curriculo.md"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(
    "curriculo.md não encontrado. Esperado na raiz do monorepo (ou em apps/web/ no Docker).",
  );
}

/** Serve/emite o currículo da raiz do monorepo — fonte única de verdade. */
function curriculoFromMonorepo(): Plugin {
  const curriculoPath = resolveCurriculoPath();
  return {
    name: "curriculo-from-monorepo",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url !== "/curriculo.md") {
          next();
          return;
        }
        res.setHeader("Content-Type", "text/markdown; charset=utf-8");
        fs.createReadStream(curriculoPath).pipe(res);
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "curriculo.md",
        source: fs.readFileSync(curriculoPath, "utf-8"),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), curriculoFromMonorepo()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        timeout: 300_000,
        proxyTimeout: 300_000,
      },
    },
  },
});
