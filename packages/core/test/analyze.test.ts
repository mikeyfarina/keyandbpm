import { describe, expect, test } from "bun:test";
import { Analyzer, filePrefix, formatDuration, keyName, relativeKey, type AnalysisUpdate } from "../src/index.ts";
import { loadEssentiaWasm } from "../src/node.ts";
import { chord, clickTrack, mix } from "./synth.ts";

const analyzer = new Analyzer(loadEssentiaWasm());

// MIDI: C4 = 60, E4 = 64, G4 = 67, A3 = 57, A4 = 69
const C_MAJOR = [48, 60, 64, 67, 72];
const A_MINOR = [45, 57, 60, 64, 69];

describe("tempo", () => {
  const clicks = clickTrack(120, 30);

  test("fast method finds a 120 bpm click track", () => {
    const tempo = analyzer.tempo(clicks, "fast");
    expect(Math.abs(tempo.bpm - 120)).toBeLessThan(1);
    expect(tempo.confidence).toBeNull();
  });

  test("accurate method finds it too and reports confidence", () => {
    const tempo = analyzer.tempo(clicks, "accurate");
    expect(Math.abs(tempo.bpm - 120)).toBeLessThan(1);
    expect(tempo.confidence).not.toBeNull();
    expect(tempo.confidence!).toBeGreaterThan(0);
  });
});

describe("key", () => {
  test("hears C major", () => {
    const key = analyzer.key(chord(C_MAJOR, 20));
    expect(key.name).toBe("C major");
    expect(key.relative.name).toBe("A minor");
  });

  test("hears A minor", () => {
    const key = analyzer.key(chord(A_MINOR, 20));
    expect(key.name).toBe("A minor");
    expect(key.relative.name).toBe("C major");
  });

  // At 440 Hz this chord is misheard as A major: the analyser has to listen against the record's own tuning.
  test("hears A minor on a record 45 cents sharp", () => {
    const a4 = 440 * Math.pow(2, 45 / 1200);
    const result = analyzer.analyze(chord(A_MINOR, 20, a4), { tempoMethod: "fast" });
    expect(result.key.name).toBe("A minor");
  });
});

describe("tuning", () => {
  test("reads concert pitch as 440 Hz", () => {
    const tuning = analyzer.tuning(chord(C_MAJOR, 20, 440));
    expect(Math.abs(tuning.hz - 440)).toBeLessThan(1);
  });

  test("notices a chord tuned to A4 = 432 Hz", () => {
    const tuning = analyzer.tuning(chord(C_MAJOR, 20, 432));
    expect(Math.abs(tuning.hz - 432)).toBeLessThan(1.5);
  });
});

describe("analyze", () => {
  test("combines everything and builds the file prefix", () => {
    const updates: AnalysisUpdate[] = [];
    const result = analyzer.analyze(mix(chord(A_MINOR, 30), clickTrack(120, 30)), {
      onProgress: (update) => updates.push(update),
    });
    expect(result.key.short).toBe("Am");
    expect(Math.abs(result.tempo.bpm - 120)).toBeLessThan(1);
    expect(result.tempo.method).toBe("accurate");
    expect(updates.map((u) => (u.type === "tempo" ? `tempo:${u.tempo.method}` : u.type))).toEqual([
      "tempo:fast", "tuning", "key", "tempo:accurate",
    ]);
    expect(result.duration).toBeCloseTo(30, 1);
    expect(filePrefix(result)).toMatch(/^\[Am\]\[1(19|20)\.\d\d\] $/);
  });
});

describe("key names", () => {
  test("spells flats for major keys and sharps where minor keys use them", () => {
    expect(keyName(10, "major").short).toBe("Bb");
    expect(keyName(1, "minor").short).toBe("C#m");
    expect(keyName(8, "minor").short).toBe("G#m");
    expect(keyName(8, "major").short).toBe("Ab");
  });

  test("relative keys go both ways", () => {
    expect(relativeKey(0, "major").name).toBe("A minor");
    expect(relativeKey(9, "minor").name).toBe("C major");
    expect(relativeKey(3, "major").name).toBe("C minor");
  });
});

describe("durations", () => {
  test("rounds up into the next minute instead of printing 60 seconds", () => {
    expect(formatDuration(119.6)).toBe("2:00");
    expect(formatDuration(59.4)).toBe("0:59");
    expect(formatDuration(187)).toBe("3:07");
  });
});
