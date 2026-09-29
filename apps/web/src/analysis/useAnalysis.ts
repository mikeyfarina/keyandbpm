import { useCallback, useEffect, useRef, useState } from "react";
import { confidenceLabel, type KeyResult, type TempoResult, type TuningResult } from "@keyandbpm/core";
import { decodeFile, TooLongError } from "../audio/decode.ts";
import { renderDemo, type Demo } from "../audio/demo.ts";
import { extensionOf, reportError, track } from "../analytics.ts";
import type { AnalysisMessage } from "./worker.ts";

export type Stage = "idle" | "decoding" | "analysing" | "done";

export interface AnalysisState {
  stage: Stage;
  fileName: string | null;
  /** Set while a built-in demo track is loaded rather than the visitor's own file. */
  demo: Demo | null;
  buffer: AudioBuffer | null;
  context: AudioContext | null;
  key: KeyResult | null;
  tuning: TuningResult | null;
  tempo: TempoResult | null;
  error: string | null;
}

const EMPTY: AnalysisState = {
  stage: "idle",
  fileName: null,
  demo: null,
  buffer: null,
  context: null,
  key: null,
  tuning: null,
  tempo: null,
  error: null,
};

/** Four passes report back, and the bar fills as each one lands. */
export function progressOf(state: AnalysisState): number {
  if (state.stage === "idle") return 0;
  if (state.stage === "done") return 1;
  const landed = [state.tempo, state.tuning, state.key, state.tempo?.method === "accurate"].filter(Boolean).length;
  return (landed + 0.35) / 5;
}

/** When each step of the current file happened, and what it found, for the completion event. */
interface Run {
  startedAt: number;
  decodedAt: number;
  trackSeconds: number;
  firstResultSent: boolean;
  key: KeyResult | null;
  tuning: TuningResult | null;
  tempo: TempoResult | null;
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>(EMPTY);
  const workerRef = useRef<Worker | null>(null);
  const busyRef = useRef(false);
  const decodingRef = useRef(false);
  const runRef = useRef<Run | null>(null);
  // Bumped per chosen file, so a slow decode of an earlier file cannot write over a later one.
  const requestRef = useRef(0);

  const spawn = useCallback((): Worker => {
    const spawnedAt = performance.now();
    const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<AnalysisMessage>) => {
      const message = event.data;
      const run = runRef.current;
      switch (message.type) {
        case "key":
          if (run) run.key = message.key;
          setState((s) => ({ ...s, key: message.key }));
          break;
        case "tuning":
          if (run) run.tuning = message.tuning;
          setState((s) => ({ ...s, tuning: message.tuning }));
          break;
        case "tempo":
          if (run) {
            run.tempo = message.tempo;
            if (!run.firstResultSent) {
              run.firstResultSent = true;
              track("first_result_shown", { ms: Math.round(performance.now() - run.startedAt) });
            }
          }
          setState((s) => ({ ...s, tempo: message.tempo }));
          break;
        case "done":
          busyRef.current = false;
          if (run?.key && run.tuning && run.tempo) {
            const now = performance.now();
            track("analysis_completed", {
              decode_ms: Math.round(run.decodedAt - run.startedAt),
              analysis_ms: Math.round(now - run.decodedAt),
              total_ms: Math.round(now - run.startedAt),
              track_seconds: Math.round(run.trackSeconds),
              key: run.key.short,
              key_strength: Math.round(run.key.strength * 100) / 100,
              bpm: Math.round(run.tempo.bpm * 10) / 10,
              tempo_confidence: confidenceLabel(run.tempo),
              tuning_cents: run.tuning.cents,
            });
          }
          runRef.current = null;
          setState((s) => ({ ...s, stage: "done" }));
          break;
        case "failed":
          busyRef.current = false;
          runRef.current = null;
          track("analysis_failed", { stage: "analysis", message: message.message });
          reportError(new Error(message.message), { stage: "analysis" });
          setState((s) => ({ ...s, stage: "idle", error: message.message }));
          break;
        case "ready":
          track("wasm_ready", { ms: Math.round(performance.now() - spawnedAt) });
          break;
      }
    };
    worker.onerror = (event) => {
      busyRef.current = false;
      runRef.current = null;
      const message = event.message || "The analyser failed to start.";
      track("analysis_failed", { stage: "worker_start", message });
      reportError(new Error(message), { stage: "worker_start" });
      setState((s) => ({ ...s, stage: "idle", error: message }));
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

  /**
   * Decodes (or builds) the audio and hands it to the worker. Only the visitor's own files
   * are timed and reported; a demo run would skew the figures about real tracks.
   */
  const load = useCallback(
    async (source: { file: File } | { demo: Demo }) => {
      const request = ++requestRef.current;
      if (busyRef.current || decodingRef.current) {
        track("analysis_replaced", { during: busyRef.current ? "analysis" : "decoding" });
      }
      // The analysis runs as one long synchronous call, so the only way to drop it
      // for a newly chosen file is to replace the worker. An idle one keeps its warm WASM.
      if (busyRef.current) {
        workerRef.current?.terminate();
        workerRef.current = spawn();
        busyRef.current = false;
      }

      const startedAt = performance.now();
      const demo = "demo" in source ? source.demo : null;
      runRef.current = null;
      decodingRef.current = true;
      setState({
        ...EMPTY,
        stage: "decoding",
        fileName: demo ? demo.fileName : (source as { file: File }).file.name,
        demo,
      });
      try {
        const decoded = demo ? await renderDemo(demo) : await decodeFile((source as { file: File }).file);
        const worker = workerRef.current;
        if (request !== requestRef.current || !worker) return;
        decodingRef.current = false;
        runRef.current = demo
          ? null
          : {
              startedAt,
              decodedAt: performance.now(),
              trackSeconds: decoded.buffer.duration,
              firstResultSent: false,
              key: null,
              tuning: null,
              tempo: null,
            };
        setState((s) => ({ ...s, stage: "analysing", buffer: decoded.buffer, context: decoded.context }));
        busyRef.current = true;
        worker.postMessage({ type: "analyze", pcm: decoded.mono }, [decoded.mono.buffer]);
      } catch (error) {
        if (request !== requestRef.current) return;
        decodingRef.current = false;
        if (demo) reportError(error, { stage: "demo_render", demo: demo.id });
        // The message names the file, so only the extension and type are sent.
        else if (error instanceof TooLongError) track("file_too_long", { minutes: Math.round(error.seconds / 60) });
        else {
          const file = (source as { file: File }).file;
          track("decode_failed", { extension: extensionOf(file.name), mime: file.type });
        }
        setState({
          ...EMPTY,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
    [spawn],
  );

  const analyse = useCallback((file: File) => load({ file }), [load]);
  const analyseDemo = useCallback(
    (demo: Demo, via: "startup" | "button") => {
      track("demo_loaded", { demo: demo.id, via });
      return load({ demo });
    },
    [load],
  );

  return { state, analyse, analyseDemo };
}
