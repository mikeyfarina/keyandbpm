/// <reference lib="webworker" />
import { Analyzer, type AnalysisUpdate } from "@keyandbpm/core";
import { loadEssentiaWasm } from "@keyandbpm/core/web";

export type AnalysisRequest = { type: "warm" } | { type: "analyze"; pcm: Float32Array };

export type AnalysisMessage =
  | { type: "ready" }
  | AnalysisUpdate
  | { type: "done" }
  | { type: "failed"; message: string };

let loading: Promise<Analyzer> | null = null;

function analyzer(): Promise<Analyzer> {
  loading ??= loadEssentiaWasm().then((wasm) => new Analyzer(wasm));
  return loading;
}

function post(message: AnalysisMessage): void {
  self.postMessage(message);
}

self.onmessage = async (event: MessageEvent<AnalysisRequest>) => {
  try {
    const ready = await analyzer();
    if (event.data.type === "warm") {
      post({ type: "ready" });
      return;
    }
    ready.analyze(event.data.pcm, { onProgress: post });
    post({ type: "done" });
  } catch (error) {
    post({ type: "failed", message: error instanceof Error ? error.message : String(error) });
  }
};
