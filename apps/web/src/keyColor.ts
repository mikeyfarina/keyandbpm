import type { Scale } from "@keyandbpm/core";

/**
 * Hue by position on the circle of fifths, so keys that mix well sit next to each
 * other on the colour wheel. Minor keys borrow the hue of their relative major,
 * which is the pairing DJ software encodes as 8A and 8B.
 */
export function keyHue(pitchClass: number, scale: Scale): number {
  const major = scale === "minor" ? (pitchClass + 3) % 12 : pitchClass;
  const positionInFifths = (major * 7) % 12;
  return positionInFifths * 30;
}
