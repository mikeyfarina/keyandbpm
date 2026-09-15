/** Loudest sample in each horizontal slice, which is all the waveform needs to draw. */
export function peaksFor(mono: Float32Array, buckets: number): Float32Array<ArrayBuffer> {
  const out = new Float32Array(buckets);
  const per = mono.length / buckets;
  for (let b = 0; b < buckets; b++) {
    const start = Math.floor(b * per);
    const end = Math.min(mono.length, Math.floor((b + 1) * per));
    let peak = 0;
    for (let i = start; i < end; i++) {
      const v = Math.abs(mono[i]!);
      if (v > peak) peak = v;
    }
    out[b] = peak;
  }
  return out;
}
