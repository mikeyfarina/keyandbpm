/// <reference lib="webworker" />
import { Analyzer, type KeyResult, type TempoResult, type TuningResult } from "@keyandbpm/core";
import { loadEssentiaWasm } from "@keyandbpm/core/web";

export type AnalysisRequest = { type: "warm" } | { type: "analyze"; pcm: Float32Array };

export type AnalysisMessage =
  | { type: "ready" }
  | { type: "key"; key: KeyResult }
  | { type: "tuning"; tuning: TuningResult }
  | { type: "tempo"; tempo: TempoResult; stage: "fast" | "accurate" }
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
    // Ordered by how long each pass takes, so the first numbers land immediately.
    const pcm = event.data.pcm;
    post({ type: "tempo", tempo: ready.tempo(pcm, "fast"), stage: "fast" });
    post({ type: "key", key: ready.key(pcm) });
    post({ type: "tuning", tuning: ready.tuning(pcm) });
    post({ type: "tempo", tempo: ready.tempo(pcm, "accurate"), stage: "accurate" });
    post({ type: "done" });
  } catch (error) {
    post({ type: "failed", message: error instanceof Error ? error.message : String(error) });
  }
};
