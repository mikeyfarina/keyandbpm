export type Scale = "major" | "minor";

/** Pitch classes spelled the way key signatures are written. Index = semitones above C. */
const MAJOR_NAMES = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"] as const;
const MINOR_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"] as const;

const PITCH_CLASS: Record<string, number> = {
  C: 0, "B#": 0,
  "C#": 1, Db: 1,
  D: 2,
  "D#": 3, Eb: 3,
  E: 4, Fb: 4,
  F: 5, "E#": 5,
  "F#": 6, Gb: 6,
  G: 7,
  "G#": 8, Ab: 8,
  A: 9,
  "A#": 10, Bb: 10,
  B: 11, Cb: 11,
};

export interface KeyName {
  /** Tonic spelled for this scale, e.g. "Bb" for Bb major, "A#" never. */
  tonic: string;
  scale: Scale;
  /** Long form: "A minor". */
  name: string;
  /** Short form used in file names and ID3 TKEY: "Am", "Bb". */
  short: string;
}

export function pitchClassOf(note: string): number {
  const pc = PITCH_CLASS[note];
  if (pc === undefined) throw new Error(`Unknown note name: ${note}`);
  return pc;
}

export function keyName(pitchClass: number, scale: Scale): KeyName {
  const pc = ((pitchClass % 12) + 12) % 12;
  const tonic = (scale === "major" ? MAJOR_NAMES : MINOR_NAMES)[pc]!;
  return {
    tonic,
    scale,
    name: `${tonic} ${scale}`,
    short: scale === "minor" ? `${tonic}m` : tonic,
  };
}

/** The relative key shares the same notes: A minor for C major, and back. */
export function relativeKey(pitchClass: number, scale: Scale): KeyName {
  return scale === "major" ? keyName(pitchClass - 3, "minor") : keyName(pitchClass + 3, "major");
}
