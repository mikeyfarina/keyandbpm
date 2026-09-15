import type { Analysis, TempoResult } from "./analyzer.ts";

export function formatBpm(bpm: number, decimals = 1): string {
  return bpm.toFixed(decimals);
}

export function formatTuning(hz: number): string {
  return `${hz.toFixed(1)} Hz`;
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
