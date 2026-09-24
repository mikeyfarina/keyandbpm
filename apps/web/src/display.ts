import type { KeyName, TempoResult, TuningResult } from "@keyandbpm/core";
import { confidenceLabel, isConcertPitch } from "@keyandbpm/core";

/** Proper accidentals for the screen. File names and tags keep the ASCII form. */
export function prettyKey(key: KeyName): string {
  return `${key.tonic.replace("b", "♭").replace("#", "♯")} ${key.scale}`;
}

export function tempoNote(tempo: TempoResult): string {
  if (tempo.method === "fast") return "first pass, still refining";
  const label = confidenceLabel(tempo);
  if (label === "unreliable") return "the beats did not line up well; treat this one with suspicion";
  return `beats lined up ${label === "excellent" ? "cleanly" : "well"}`;
}

export function tuningNote(tuning: TuningResult): string {
  if (isConcertPitch(tuning)) return "concert pitch";
  const direction = tuning.cents > 0 ? "sharp of" : "flat of";
  return `${Math.abs(tuning.cents)} cents ${direction} A440`;
}
