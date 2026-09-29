/**
 * One requestAnimationFrame loop for every moving part of the device. The needle, the
 * strobe and the waveform write straight to the DOM from here, so a playing track never
 * re-renders React. The loop stops when nothing is listening.
 */
type Listener = (dt: number, now: number) => void;

const listeners = new Set<Listener>();
let frame = 0;
let last = 0;

function loop(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  for (const listener of listeners) listener(dt, now);
  frame = listeners.size ? requestAnimationFrame(loop) : 0;
}

export function onFrame(listener: Listener): () => void {
  listeners.add(listener);
  if (!frame) {
    last = performance.now();
    frame = requestAnimationFrame(loop);
  }
  return () => {
    listeners.delete(listener);
  };
}

export const reducedMotion = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Index of the last beat at or before the playhead, or -1 before the first. */
export function beatAt(beats: number[], position: number): number {
  let lo = 0;
  let hi = beats.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (beats[mid]! <= position) {
      found = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found;
}

/** Sizes a canvas's backing store to its rendered size, and says how many device pixels make one CSS pixel of the design. */
export function fitCanvas(canvas: HTMLCanvasElement): { w: number; h: number; k: number } {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return { w, h, k: w / Math.max(1, canvas.offsetWidth) };
}
