import { SAMPLE_RATE } from "../src/index.ts";

/** Deterministic pseudo-random numbers so tests never flake. */
function lcg(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000 - 0.5;
  };
}

/** Short percussive hits on every beat, like a metronome played through a room. */
export function clickTrack(bpm: number, seconds: number): Float32Array {
  const n = Math.floor(seconds * SAMPLE_RATE);
  const out = new Float32Array(n);
  const rand = lcg(7);
  const beat = (60 / bpm) * SAMPLE_RATE;
  const hitLength = Math.floor(0.03 * SAMPLE_RATE);
  for (let start = 0; start < n; start += beat) {
    const s = Math.floor(start);
    for (let i = 0; i < hitLength && s + i < n; i++) {
      const env = Math.exp(-i / (hitLength / 5));
      const ping = Math.sin((2 * Math.PI * 1000 * i) / SAMPLE_RATE);
      out[s + i]! += env * (0.6 * ping + 0.4 * rand());
    }
  }
  for (let i = 0; i < n; i++) out[i]! += 0.002 * rand();
  return out;
}

/**
 * A sustained chord with harmonics, retuned so that A4 = `a4Hz`.
 * `midiNotes` are MIDI note numbers (69 = A4).
 */
export function chord(midiNotes: number[], seconds: number, a4Hz = 440): Float32Array {
  const n = Math.floor(seconds * SAMPLE_RATE);
  const out = new Float32Array(n);
  const rand = lcg(11);
  for (const note of midiNotes) {
    const f0 = a4Hz * Math.pow(2, (note - 69) / 12);
    for (let h = 1; h <= 5; h++) {
      const amp = 0.25 / midiNotes.length / h;
      const w = (2 * Math.PI * f0 * h) / SAMPLE_RATE;
      for (let i = 0; i < n; i++) out[i]! += amp * Math.sin(w * i);
    }
  }
  // Gentle amplitude pulse so the signal is not a single static frame.
  for (let i = 0; i < n; i++) {
    const env = 0.7 + 0.3 * Math.sin((2 * Math.PI * 2 * i) / SAMPLE_RATE);
    out[i] = out[i]! * env + 0.001 * rand();
  }
  return out;
}

/** A chord riding on a click track, the closest a synthetic signal gets to a song. */
export function mix(a: Float32Array, b: Float32Array): Float32Array {
  const n = Math.min(a.length, b.length);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = a[i]! + b[i]!;
  return out;
}
