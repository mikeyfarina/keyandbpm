import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyResult, TempoResult, TuningResult } from "@keyandbpm/core";
import { decodeFile } from "../audio/decode.ts";
import type { AnalysisMessage } from "./worker.ts";

export type Stage = "idle" | "decoding" | "analysing" | "done";

export interface AnalysisState {
  stage: Stage;
  fileName: string | null;
  buffer: AudioBuffer | null;
  context: AudioContext | null;
  key: KeyResult | null;
  tuning: TuningResult | null;
  tempo: TempoResult | null;
  tempoStage: "fast" | "accurate" | null;
  error: string | null;
}

const EMPTY: AnalysisState = {
  stage: "idle",
  fileName: null,
  buffer: null,
  context: null,
  key: null,
  tuning: null,
  tempo: null,
  tempoStage: null,
  error: null,
};

/** Four passes report back, and the bar fills as each one lands. */
export function progressOf(state: AnalysisState): number {
  if (state.stage === "idle") return 0;
  if (state.stage === "done") return 1;
  const landed = [state.tempo, state.key, state.tuning, state.tempoStage === "accurate"].filter(Boolean).length;
  return (landed + 0.35) / 5;
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>(EMPTY);
  const workerRef = useRef<Worker | null>(null);

  const spawn = useCallback((): Worker => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<AnalysisMessage>) => {
      const message = event.data;
      switch (message.type) {
        case "key":
          setState((s) => ({ ...s, key: message.key }));
          break;
        case "tuning":
          setState((s) => ({ ...s, tuning: message.tuning }));
          break;
        case "tempo":
          setState((s) => ({ ...s, tempo: message.tempo, tempoStage: message.stage }));
          break;
        case "done":
          setState((s) => ({ ...s, stage: "done" }));
          break;
        case "failed":
          setState((s) => ({ ...s, stage: "idle", error: message.message }));
          break;
        case "ready":
          break;
      }
    };
    worker.onerror = (event) => {
      setState((s) => ({ ...s, stage: "idle", error: event.message || "The analyser failed to start." }));
    };
    return worker;
  }, []);

  // Build the WebAssembly ahead of time so the first file does not wait for it.
  useEffect(() => {
    const worker = spawn();
    workerRef.current = worker;
    worker.postMessage({ type: "warm" });
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [spawn]);

  const analyse = useCallback(
    async (file: File) => {
      // The analysis runs as one long synchronous call, so the only way to drop it
      // for a newly chosen file is to replace the worker outright.
      workerRef.current?.terminate();
      const worker = spawn();
      workerRef.current = worker;

      setState({ ...EMPTY, stage: "decoding", fileName: file.name });
      try {
        const decoded = await decodeFile(file);
        setState((s) =>
          s.fileName === file.name
            ? { ...s, stage: "analysing", buffer: decoded.buffer, context: decoded.context }
            : s,
        );
        worker.postMessage({ type: "analyze", pcm: decoded.mono }, [decoded.mono.buffer]);
      } catch (error) {
        setState({
          ...EMPTY,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
    [spawn],
  );

  const reset = useCallback(() => setState(EMPTY), []);

  return { state, analyse, reset };
}
