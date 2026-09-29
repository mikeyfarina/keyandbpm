import type { KeyName, KeyResult, TempoResult, TuningResult } from "@keyandbpm/core";
import { camelot, confidenceLabel, formatBpm, formatTuning, isConcertPitch } from "@keyandbpm/core";

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

/**
 * The one-line reading the copy key puts on the clipboard, signed with the site's address so a
 * pasted result leads back here. The address comes from the canonical tag, so it follows the domain.
 */
export function resultLine(key: KeyResult, tempo: TempoResult, tuning: TuningResult): string {
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) throw new Error('index.html has no <link rel="canonical">, so the copied result cannot name the site.');
  const site = new URL(canonical.href).host;
  return `${prettyKey(key)} (${camelot(key)}) · ${formatBpm(tempo.bpm)} BPM · A4 = ${formatTuning(tuning.hz)} · via ${site}`;
}

/** How far from 432 Hz still counts as 432: tape drift alone moves records a few cents. */
const A432_TOLERANCE_CENTS = 5;
const A432_CENTS = 1200 * Math.log2(432 / 440);

/** The one-line answer on the 432 Hz checker page. */
export function verdict432(tuning: TuningResult): string {
  const hz = formatTuning(tuning.hz);
  const from432 = tuning.cents - A432_CENTS;
  if (Math.abs(from432) <= A432_TOLERANCE_CENTS) return `Yes: this track is tuned to 432 Hz (A4 = ${hz}).`;
  if (isConcertPitch(tuning)) return `No: this track is at standard 440 Hz tuning (A4 = ${hz}).`;
  const direction = from432 > 0 ? "above" : "below";
  return `No: A4 = ${hz}, ${Math.abs(from432).toFixed(0)} cents ${direction} 432 and ${tuningNote(tuning)}.`;
}
