import { createRequire } from "node:module";

/**
 * Loads the synchronous essentia WASM build for Bun and Node. The UMD file assigns
 * the Emscripten module straight to `module.exports`, so there is no named export.
 */
export function loadEssentiaWasm(): unknown {
  const require = createRequire(import.meta.url);
  const mod = require("essentia.js/dist/essentia-wasm.umd.js") as { EssentiaWASM?: unknown };
  return mod.EssentiaWASM ?? mod;
}
