/**
 * Loads essentia's WebAssembly for the browser.
 *
 * This deliberately uses the ES build rather than the smaller `essentia-wasm.web.js`.
 * That one is compiled for the main thread only: its environment flags are fixed at
 * `ENVIRONMENT_IS_WEB = true, ENVIRONMENT_IS_WORKER = false`, so it reads
 * `document.currentScript` on startup and throws "document is not defined" inside a
 * Web Worker. The ES build carries the WebAssembly inline and touches no DOM, which
 * costs about 200 kB gzipped and buys analysis that does not block the page.
 */
export async function loadEssentiaWasm(): Promise<unknown> {
  const { EssentiaWASM } = await import("essentia.js/dist/essentia-wasm.es.js");
  return EssentiaWASM;
}
