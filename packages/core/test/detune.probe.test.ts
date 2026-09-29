import { test } from "bun:test";
import { Analyzer } from "../src/index.ts";
import { loadEssentiaWasm } from "../src/node.ts";
import { chord } from "./synth.ts";
const analyzer = new Analyzer(loadEssentiaWasm());
test("probe", () => {
  for (const cents of [0, 20, 30, 40, 45, -30, -40, -45]) {
    const a4 = 440 * Math.pow(2, cents / 1200);
    const pcm = chord([48, 60, 64, 67, 72], 20, a4);
    const minor = chord([45, 57, 60, 64, 69], 20, a4);
    console.log(cents, analyzer.key(pcm).name, analyzer.key(minor).name, analyzer.key(pcm, analyzer.tuning(pcm).hz).name, analyzer.key(minor, analyzer.tuning(minor).hz).name, analyzer.tuning(pcm).cents);
  }
});
