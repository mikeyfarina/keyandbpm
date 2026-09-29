/*
  One page per key at /key/<slug>/, plus the /key/ index. Everything on them is derived from
  the key itself (scale spelling, chords, Camelot neighbours), so there is nothing to keep in
  sync by hand and nothing that could be wrong for one key but not another.
*/
import { camelot, keyName, pitchClassOf, relativeKey, type KeyName, type Scale } from "@keyandbpm/core";
import type { RenderedPage } from "../blog/page.ts";

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const NATURAL = [0, 2, 4, 5, 7, 9, 11];
const STEPS: Record<Scale, number[]> = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10] };
const QUALITIES: Record<Scale, Quality[]> = {
  major: ["maj", "min", "min", "maj", "maj", "min", "dim"],
  minor: ["min", "dim", "maj", "min", "min", "maj", "maj"],
};
const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII"];
const ACCIDENTAL: Record<number, string> = { [-2]: "bb", [-1]: "b", 0: "", 1: "#", 2: "##" };

type Quality = "maj" | "min" | "dim";

/** Every key, in Camelot order: 1A, 1B, 2A, 2B ... */
const KEYS: KeyName[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  .flatMap((pc) => [keyName(pc, "minor"), keyName(pc, "major")])
  .sort((a, b) => parseInt(camelot(a)) - parseInt(camelot(b)) || camelot(a).localeCompare(camelot(b)));
const BY_CAMELOT = new Map(KEYS.map((k) => [camelot(k), k]));

/** "F#" -> "F♯". Only the accidental changes; the letter B stays B. */
function pretty(note: string): string {
  return note[0] + note.slice(1).replace("##", "𝄪").replace(/#/g, "♯").replace(/b/g, "♭");
}

function slug(key: KeyName): string {
  const [letter, accidental] = key.tonic;
  return `${letter!.toLowerCase()}${accidental === "#" ? "-sharp" : accidental === "b" ? "-flat" : ""}-${key.scale}`;
}

function link(key: KeyName): string {
  return `<a href="/key/${slug(key)}/">${pretty(key.tonic)} ${key.scale}</a>`;
}

/** The seven notes, each on its own letter, as a key signature spells them. */
function spell(key: KeyName): string[] {
  const tonicPc = pitchClassOf(key.tonic);
  const tonicLetter = LETTERS.indexOf(key.tonic[0] as (typeof LETTERS)[number]);
  return STEPS[key.scale].map((step, degree) => {
    const letterIndex = (tonicLetter + degree) % 7;
    const offset = ((((tonicPc + step - NATURAL[letterIndex]!) % 12) + 18) % 12) - 6;
    const accidental = ACCIDENTAL[offset];
    if (accidental === undefined) throw new Error(`${key.name}: degree ${degree + 1} needs ${offset} accidentals`);
    return LETTERS[letterIndex] + accidental;
  });
}

/** The same letter a semitone higher: G -> G#, Bb -> B, F# -> F##. */
function raise(note: string): string {
  return note.endsWith("b") ? note.slice(0, -1) : `${note}#`;
}

function chordName(root: string, quality: Quality): string {
  return pretty(root) + (quality === "min" ? "m" : quality === "dim" ? "°" : "");
}

function numeral(degree: number, quality: Quality): string {
  const n = NUMERALS[degree]!;
  return quality === "maj" ? n : quality === "min" ? n.toLowerCase() : `${n.toLowerCase()}°`;
}

function list(items: string[]): string {
  return items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

function signature(notes: string[]): string {
  const sharps = notes.filter((n) => n.includes("#"));
  const flats = notes.filter((n) => n.includes("b"));
  const marked = sharps.length ? sharps : flats;
  if (!marked.length) return "no sharps or flats";
  // Signatures are written in the order of fifths, not scale order.
  const order = sharps.length ? ["F", "C", "G", "D", "A", "E", "B"] : ["B", "E", "A", "D", "G", "C", "F"];
  const sorted = [...marked].sort((a, b) => order.indexOf(a[0]!) - order.indexOf(b[0]!));
  const word = sharps.length ? "sharp" : "flat";
  return `${marked.length} ${word}${marked.length > 1 ? "s" : ""} (${sorted.map(pretty).join(", ")})`;
}

/** The same pitch under its other name: Db major is also C# major. */
function enharmonic(key: KeyName): string | null {
  const [letter, accidental] = key.tonic;
  if (!accidental) return null;
  const i = LETTERS.indexOf(letter as (typeof LETTERS)[number]);
  const other = accidental === "b" ? `${LETTERS[(i + 6) % 7]}#` : `${LETTERS[(i + 1) % 7]}b`;
  return `${pretty(other)} ${key.scale}`;
}

function neighbours(key: KeyName): { key: KeyName; why: string }[] {
  const code = camelot(key);
  const n = parseInt(code);
  const letter = code.slice(-1);
  const around = (step: number) => `${((n - 1 + step + 12) % 12) + 1}${letter}`;
  return [
    { key: BY_CAMELOT.get(around(-1))!, why: "One step round the wheel: shares six of its seven notes" },
    { key: BY_CAMELOT.get(around(1))!, why: "One step the other way: also shares six of seven notes" },
    { key: BY_CAMELOT.get(`${n}${letter === "A" ? "B" : "A"}`)!, why: `The relative ${key.scale === "minor" ? "major" : "minor"}: exactly the same notes` },
  ];
}

function keyPage(key: KeyName): RenderedPage {
  const notes = spell(key);
  const qualities = QUALITIES[key.scale];
  const chords = notes.map((root, i) => ({
    numeral: numeral(i, qualities[i]!),
    name: chordName(root, qualities[i]!),
    notes: [notes[i]!, notes[(i + 2) % 7]!, notes[(i + 4) % 7]!].map(pretty),
  }));
  const chordNames = chords.map((c) => c.name);
  const code = camelot(key);
  const pc = pitchClassOf(key.tonic);
  const relative = relativeKey(pc, key.scale);
  const parallel = keyName(pc, key.scale === "major" ? "minor" : "major");
  const mixes = neighbours(key);
  const name = `${pretty(key.tonic)} ${key.scale}`;
  // Core spells pitch class 6 major as F#, so E♭ minor's relative needs its flat-side name too.
  const flatSide = (k: KeyName) => k.tonic.endsWith("b");
  const relAlias = relative.tonic.length > 1 && key.tonic.length > 1 && flatSide(relative) !== flatSide(key) ? enharmonic(relative) : null;
  const relName = `${pretty(relative.tonic)} ${relative.scale}${relAlias ? ` (${relAlias})` : ""}`;
  const relShort = relAlias ?? `${pretty(relative.tonic)} ${relative.scale}`;
  const sig = signature(notes);
  const alias = enharmonic(key);
  const c = (degree: number) => chordNames[degree]!;
  // A minor-key song's V is almost always major, borrowed from harmonic minor, because its raised 7th pulls home.
  const raised = key.scale === "minor" ? chordName(notes[4]!, "maj") : null;
  const progressions =
    key.scale === "major"
      ? [
          ["I–V–vi–IV", [c(0), c(4), c(5), c(3)], "the most used pop progression of the last forty years"],
          ["I–vi–IV–V", [c(0), c(5), c(3), c(4)], "the 1950s doo-wop turnaround"],
          ["ii–V–I", [c(1), c(4), c(0)], "the jazz cadence"],
          ["vi–IV–I–V", [c(5), c(3), c(0), c(4)], "the same four chords as I–V–vi–IV, started on the minor chord for a darker feel"],
        ]
      : [
          ["i–VI–III–VII", [c(0), c(5), c(2), c(6)], "the minor-key pop and trap loop"],
          ["i–iv–v", [c(0), c(3), c(4)], "the plain minor blues shape"],
          ["i–VII–VI–V", [c(0), c(6), c(5), raised!], "the descending Andalusian cadence, with a major V"],
          ["i–iv–VII–III", [c(0), c(3), c(6), c(2)], "a common lo-fi and R&B cycle"],
        ];
  const title = `${key.name} chords, relative ${relative.scale} and Camelot code (${code})`;

  return {
    path: `/key/${slug(key)}/`,
    title,
    description: `The chords in ${name} are ${list(chordNames)}. Its relative ${relative.scale} is ${relShort}, its Camelot code is ${code}, and here are the keys it mixes with.`,
    answer: `${name} has ${sig}. Its chords are ${list(chordNames)}. The relative ${relative.scale} is ${relName} and the Camelot code is ${code}, so it mixes cleanly with ${list(mixes.map((m) => camelot(m.key)))}.`,
    body: `
<h2>Notes in the ${name} scale</h2>
<p>${name} has ${sig}.${alias ? ` It sounds identical to ${alias}, which is the same set of pitches spelled differently; ${name} is the usual spelling.` : ""}</p>
<div class="table-wrap">
<table>
<thead><tr>${notes.map((_, i) => `<th>${i + 1}</th>`).join("")}</tr></thead>
<tbody><tr>${notes.map((n) => `<td>${pretty(n)}</td>`).join("")}</tr></tbody>
</table>
</div>

<h2>Chords in ${name}</h2>
<p>Stack every other note of the scale on each degree and you get the seven chords that belong to the key:</p>
<div class="table-wrap">
<table>
<thead><tr><th>Degree</th><th>Chord</th><th>Notes</th></tr></thead>
<tbody>
${chords.map((ch) => `<tr><td>${ch.numeral}</td><td>${ch.name}</td><td>${ch.notes.join(" · ")}</td></tr>`).join("\n")}
</tbody>
</table>
</div>
${raised ? `<p>In practice most songs in ${name} swap the minor v for <strong>${raised}</strong>. Raising the seventh note (${pretty(notes[6]!)} to ${pretty(raise(notes[6]!))}) gives a leading note that pulls back to ${pretty(key.tonic)}, so ${raised} to ${c(0)} sounds like arriving home.</p>` : ""}

<h2>Common progressions in ${name}</h2>
<ul>
${progressions.map(([numerals, names, note]) => `<li><strong>${(names as string[]).join(" – ")}</strong> (${numerals}): ${note}.</li>`).join("\n")}
</ul>

<h2>Keys that mix with ${name}</h2>
<p>${name} is <strong>${code}</strong> on the Camelot wheel. For a clean blend, go to a key next to it:</p>
<div class="table-wrap">
<table>
<thead><tr><th>Camelot</th><th>Key</th><th>Why it works</th></tr></thead>
<tbody>
${mixes.map((m) => `<tr><td>${camelot(m.key)}</td><td>${link(m.key)}</td><td>${m.why}</td></tr>`).join("\n")}
</tbody>
</table>
</div>
<p>How the wheel works is in <a href="/blog/camelot-wheel-explained/">the Camelot wheel explained</a>, and how to use it in a set is in <a href="/blog/harmonic-mixing-for-djs/">harmonic mixing for DJs</a>.</p>

<h2>Relative and parallel keys</h2>
<p>The relative ${relative.scale}, ${link(relative)}, uses exactly the same notes with a different home chord. The parallel ${parallel.scale}, ${link(parallel)}, keeps ${pretty(key.tonic)} as home but changes three notes. More on the difference in <a href="/blog/relative-major-and-minor-keys/">relative major and minor keys</a>.</p>

<aside class="try">
<p><strong>Is your track really in ${name}?</strong> Drop it into the <a href="/">key and BPM finder</a> to read its key, tempo and tuning. It runs in your browser, so the file is never uploaded. Or see <a href="/key/">all 24 keys</a>.</p>
</aside>
`,
    faq: [
      { q: `What chords are in ${name}?`, a: `${list(chords.map((ch) => `${ch.name} (${ch.numeral})`))}.` },
      { q: `What is the relative ${relative.scale} of ${name}?`, a: `${relName}. It uses the same ${notes.length} notes, ${notes.map(pretty).join(", ")}, but centres on ${pretty(relative.tonic)} instead of ${pretty(key.tonic)}.` },
      { q: `What is the Camelot code for ${name}?`, a: `${code}. In Open Key notation it is ${openKey(code)}.` },
      { q: `What keys mix well with ${name}?`, a: `${list(mixes.map((m) => `${pretty(m.key.tonic)} ${m.key.scale} (${camelot(m.key)})`))}. They sit next to ${code} on the Camelot wheel.` },
      { q: `How many sharps or flats does ${name} have?`, a: `${sig[0]!.toUpperCase()}${sig.slice(1)}.` },
    ],
  };
}

/** Traktor's Open Key numbers C major as 1d and runs round the same circle: 8B -> 1d, 8A -> 1m. */
function openKey(code: string): string {
  const n = parseInt(code);
  return `${((n - 8 + 12) % 12) + 1}${code.endsWith("A") ? "m" : "d"}`;
}

const index: RenderedPage = {
  path: "/key/",
  title: "All 24 musical keys: chords, relatives and Camelot codes",
  description: "Every major and minor key with its chords, relative key and Camelot code, laid out in Camelot wheel order so neighbouring keys mix cleanly with each other.",
  answer:
    "There are 24 keys: 12 major and 12 minor. On the Camelot wheel each number holds a minor key (A) and its relative major (B), and keys one number apart share six of their seven notes, which is why they mix cleanly.",
  body: `
<div class="table-wrap">
<table>
<thead><tr><th>Camelot</th><th>Minor (A)</th><th>Major (B)</th></tr></thead>
<tbody>
${Array.from({ length: 12 }, (_, i) => `<tr><td>${i + 1}</td><td>${link(BY_CAMELOT.get(`${i + 1}A`)!)}</td><td>${link(BY_CAMELOT.get(`${i + 1}B`)!)}</td></tr>`).join("\n")}
</tbody>
</table>
</div>
<p>Each page lists the key's notes, its seven chords, the progressions that use them, and the keys that mix with it. The system itself is explained in <a href="/blog/camelot-wheel-explained/">the Camelot wheel explained</a>.</p>
<aside class="try">
<p><strong>Don't know the key yet?</strong> Drop the track into the <a href="/">key and BPM finder</a>. It reads the key, tempo and tuning in your browser without uploading the file.</p>
</aside>
`,
  faq: [
    { q: "How many musical keys are there?", a: "24: a major and a minor key on each of the 12 notes. Some have two names, like C sharp major and D flat major, but they sound the same." },
    { q: "What is the Camelot wheel?", a: "A numbering of the 24 keys used by DJ software. Minor keys are A and majors are B, numbered 1 to 12 round the circle of fifths, so keys one number apart mix cleanly." },
    { q: "Which keys are relative to each other?", a: "The two keys that share a Camelot number: 8A (A minor) and 8B (C major) use the same notes, as do 5A (C minor) and 5B (E flat major), and so on." },
  ],
};

export default [index, ...KEYS.map(keyPage)];
