import type { Analysis, TempoResult } from "./analyzer.ts";
import type { TuningResult } from "./tuning.ts";

export function formatBpm(bpm: number, decimals = 1): string {
  return bpm.toFixed(decimals);
}

export function formatTuning(hz: number): string {
  return `${hz.toFixed(1)} Hz`;
}

/** Within a cent of A440 is indistinguishable from it by ear. */
export function isConcertPitch(tuning: TuningResult): boolean {
  return Math.abs(tuning.cents) <= 1;
}

/** "3:07". Rounds to whole seconds first so 119.6 s reads 2:00, not 1:60. */
export function formatDuration(seconds: number): string {
  const whole = Math.round(seconds);
  return `${Math.floor(whole / 60)}:${(whole % 60).toString().padStart(2, "0")}`;
}

/** "[Am][96.5] " style prefix, matching the naming DJs use for sample folders. */
export function filePrefix(analysis: Analysis): string {
  return `[${analysis.key.short}][${formatBpm(analysis.tempo.bpm, 2)}] `;
}

export type ConfidenceLabel = "unreliable" | "good" | "excellent" | "unknown";

export function confidenceLabel(tempo: TempoResult): ConfidenceLabel {
  if (tempo.confidence === null) return "unknown";
  if (tempo.confidence < 1.5) return "unreliable";
  if (tempo.confidence < 3.5) return "good";
  return "excellent";
}
