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

export interface AnalyzeOptions {
  tempoMethod?: TempoMethod;
  /** Called with the fast tempo before the accurate pass runs. Only fires for tempoMethod "accurate". */
  onFastTempo?: (tempo: TempoResult) => void;
}

export class Analyzer {
  private readonly essentia: EssentiaApi;

  constructor(wasmModule: unknown) {
    this.essentia = new Essentia(wasmModule);
  }

  get version(): string {
    return this.essentia.version;
  }

  key(pcm: Float32Array): KeyResult {
    const signal = this.essentia.arrayToVector(pcm);
    try {
      const result = this.essentia.KeyExtractor(
        signal, true, 4096, 4096, 12, 3500, 60, 25, 0.2, "bgate", SAMPLE_RATE, 0.0001, 440, "cosine", "hann",
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
    const key = this.key(pcm);
    const tuning = this.tuning(pcm);
    let tempo = this.tempo(pcm, "fast");
    if (method === "accurate") {
      options.onFastTempo?.(tempo);
      tempo = this.tempo(pcm, "accurate");
    }
    return { key, tempo, tuning, duration: pcm.length / SAMPLE_RATE };
  }
}
