/// <reference path="./essentia.d.ts" />
import Essentia, { type EssentiaApi } from "essentia.js/dist/essentia.js-core.es.js";
import { keyName, pitchClassOf, relativeKey, type KeyName, type Scale } from "./keys.ts";
import { estimateTuning, type TuningResult } from "./tuning.ts";

/** RhythmExtractor2013 is defined for 44.1 kHz input; callers must resample to this. */
export const SAMPLE_RATE = 44100;

export type TempoMethod = "fast" | "accurate";

export interface KeyResult extends KeyName {
  relative: KeyName;
  /** How clearly the key profile matched, 0 to 1. */
  strength: number;
}

export interface TempoResult {
  bpm: number;
  /** Beat positions in seconds, for drawing a beat grid or clicking along. */
  beats: number[];
  /**
   * essentia's beat confidence on a 0 to 5.32 scale, only for the accurate method.
   * Below 1.5 is unreliable, 1.5 to 3.5 is good, above 3.5 is excellent.
   */
  confidence: number | null;
  method: TempoMethod;
}

export interface Analysis {
  key: KeyResult;
  tempo: TempoResult;
  tuning: TuningResult;
  /** Length of the analysed audio in seconds. */
  duration: number;
}

/** One measurement, reported as it lands. For the accurate method, tempo arrives twice: fast, then accurate. */
export type AnalysisUpdate =
  | { type: "tempo"; tempo: TempoResult }
  | { type: "tuning"; tuning: TuningResult }
  | { type: "key"; key: KeyResult };

export interface AnalyzeOptions {
  tempoMethod?: TempoMethod;
  /** Called with each result as it lands, quickest first, so a front end can show numbers early. */
  onProgress?: (update: AnalysisUpdate) => void;
}

export class Analyzer {
  private readonly essentia: EssentiaApi;

  constructor(wasmModule: unknown) {
    this.essentia = new Essentia(wasmModule);
  }

  get version(): string {
    return this.essentia.version;
  }

  /** `tuningHz` is the track's A4 reference, so a detuned record is heard against its own grid. */
  key(pcm: Float32Array, tuningHz = 440): KeyResult {
    const signal = this.essentia.arrayToVector(pcm);
    try {
      const result = this.essentia.KeyExtractor(
        signal, true, 4096, 4096, 12, 3500, 60, 25, 0.2, "bgate", SAMPLE_RATE, 0.0001, tuningHz, "cosine", "hann",
      );
      const scale: Scale = result.scale === "minor" ? "minor" : "major";
      const pc = pitchClassOf(result.key);
      return { ...keyName(pc, scale), relative: relativeKey(pc, scale), strength: result.strength };
    } finally {
      signal.delete();
    }
  }

  tempo(pcm: Float32Array, method: TempoMethod = "accurate"): TempoResult {
    const signal = this.essentia.arrayToVector(pcm);
    try {
      const result = this.essentia.RhythmExtractor2013(
        signal, 208, method === "accurate" ? "multifeature" : "degara", 40,
      );
      const beats = Array.from(this.essentia.vectorToArray(result.ticks));
      result.ticks.delete();
      result.estimates.delete();
      result.bpmIntervals.delete();
      return {
        bpm: result.bpm,
        beats,
        confidence: method === "accurate" ? result.confidence : null,
        method,
      };
    } finally {
      signal.delete();
    }
  }

  tuning(pcm: Float32Array): TuningResult {
    return estimateTuning(this.essentia, pcm, SAMPLE_RATE);
  }

  analyze(pcm: Float32Array, options: AnalyzeOptions = {}): Analysis {
    const method = options.tempoMethod ?? "accurate";
    const report = options.onProgress;

    // The fast tempo is only worth its cost when it is the answer or someone will see it early.
    let tempo = method === "fast" || report ? this.tempo(pcm, "fast") : null;
    if (tempo) report?.({ type: "tempo", tempo });

    // Tuning goes first so the key is heard against the record's own pitch grid.
    const tuning = this.tuning(pcm);
    report?.({ type: "tuning", tuning });
    const key = this.key(pcm, tuning.hz);
    report?.({ type: "key", key });

    if (method === "accurate") {
      tempo = this.tempo(pcm, "accurate");
      report?.({ type: "tempo", tempo });
    }
    return { key, tempo: tempo!, tuning, duration: pcm.length / SAMPLE_RATE };
  }
}
