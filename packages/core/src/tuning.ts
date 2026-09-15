/// <reference path="./essentia.d.ts" />
import type { EssentiaApi } from "essentia.js/dist/essentia.js-core.es.js";

export interface TuningResult {
  /** Estimated reference pitch for A4, in Hz. 440 means concert pitch. */
  hz: number;
  /** Deviation from 440 Hz in cents, in the range [-50, 50). */
  cents: number;
}

const REFERENCE_HZ = 440;
const BINS = 100; // one bin per cent across a semitone

/**
 * Estimates the tuning reference by looking at where spectral peaks sit relative to
 * the equal-tempered grid. Every peak votes for its deviation from the nearest
 * semitone, weighted by magnitude, and the strongest bin wins. This mirrors
 * essentia's TuningFrequency algorithm, whose accumulation across frames the JS
 * bindings do not expose.
 */
export function estimateTuning(
  essentia: EssentiaApi,
  pcm: Float32Array,
  sampleRate: number,
  options: { frameSize?: number; hopSize?: number } = {},
): TuningResult {
  const frameSize = options.frameSize ?? 4096;
  const hopSize = options.hopSize ?? frameSize * 4;
  const histogram = new Float64Array(BINS);

  const frames = essentia.FrameGenerator(pcm, frameSize, hopSize);
  const frameCount = frames.size();
  for (let i = 0; i < frameCount; i++) {
    const frame = frames.get(i);
    const windowed = essentia.Windowing(frame, true, frameSize, "hann");
    const spectrum = essentia.Spectrum(windowed.frame, frameSize);
    const peaks = essentia.SpectralPeaks(spectrum.spectrum, 0.0001, 3500, 60, 60, "magnitude", sampleRate);

    const count = peaks.frequencies.size();
    for (let p = 0; p < count; p++) {
      const hz = peaks.frequencies.get(p);
      if (hz <= 0) continue;
      const cents = 1200 * Math.log2(hz / REFERENCE_HZ);
      const deviation = ((cents % 100) + 150) % 100 - 50; // [-50, 50)
      const bin = ((Math.round(deviation) + 50) % BINS + BINS) % BINS;
      histogram[bin]! += peaks.magnitudes.get(p);
    }

    peaks.frequencies.delete();
    peaks.magnitudes.delete();
    spectrum.spectrum.delete();
    windowed.frame.delete();
    frame.delete();
  }
  frames.delete();

  // Smooth circularly over ±2 cents so a peak split across neighbouring bins still wins.
  let bestBin = 0;
  let bestWeight = -1;
  for (let b = 0; b < BINS; b++) {
    let weight = 0;
    for (let d = -2; d <= 2; d++) weight += histogram[(b + d + BINS) % BINS]!;
    if (weight > bestWeight) {
      bestWeight = weight;
      bestBin = b;
    }
  }
  if (bestWeight <= 0) return { hz: REFERENCE_HZ, cents: 0 };

  const cents = bestBin - 50;
  return { hz: REFERENCE_HZ * Math.pow(2, cents / 1200), cents };
}
