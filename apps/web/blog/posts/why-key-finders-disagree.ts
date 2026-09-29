import type { Post } from "../post.ts";

export default {
  slug: "why-key-finders-disagree",
  title: "Why key finders disagree (and which answer to trust)",
  description:
    "Why key detection tools give different answers for the same track: relative keys, fifths, modes, drums, key changes, tuning, notation and the strength figure.",
  published: "2026-09-29",
  answer:
    "Key finders disagree because they estimate a key by matching a track's pitch content against templates of the 24 major and minor keys, and many tracks fit two or three templates almost equally well. Most disagreements are between relative keys (A minor and C major), keys a fifth apart (C and G), or the same tonic in major and minor (C and C minor). Modes, drums, distorted bass, key changes, detuned recordings and different notation make it worse.",
  body: `
<h2>How does a key finder work?</h2>
<p>Most key detectors, the open-source ones and the ones inside DJ software alike, follow the same basic recipe:</p>
<ol>
  <li>Measure how much energy the track has at each of the 12 pitch classes (C, C sharp, D and so on), folding every octave together. This is called a chromagram; Essentia's version is the HPCP, the harmonic pitch class profile.</li>
  <li>Compare that 12-number summary against a template for each of the 24 major and minor keys.</li>
  <li>Report whichever key fits best.</li>
</ol>
<p>The templates are where tools start to differ. The classic ones come from Carol Krumhansl and Edward Kessler's listening experiments in the early 1980s, where people rated how well each note fitted a key. Later researchers built templates from musical scores or from large sets of electronic dance music. Essentia alone ships a whole menu of profiles. Two tools with different templates can look at the same chromagram and pick different winners, especially when the top two are close.</p>
<p>So a key finder never "hears" the key the way you do. It measures which notes are loudest and most frequent, then makes a statistical best guess. Usually the guess is good. When it isn't, the mistake almost always falls into one of a few patterns.</p>

<h2>What are the most common key detection mistakes?</h2>
<p>Here are the usual confusions, using C major as the example.</p>
<div class="table-wrap">
<table>
  <thead><tr><th>Confusion</th><th>C major mistaken for</th><th>Why it happens</th></tr></thead>
  <tbody>
    <tr><td>Relative key</td><td>A minor</td><td>Exactly the same seven notes, different home note</td></tr>
    <tr><td>Fifth above</td><td>G major</td><td>Shares six of seven notes (only F vs F sharp differs)</td></tr>
    <tr><td>Fifth below</td><td>F major</td><td>Shares six of seven notes (only B vs B flat differs)</td></tr>
    <tr><td>Parallel key</td><td>C minor</td><td>Same tonic, and the tonic dominates the chromagram</td></tr>
  </tbody>
</table>
</div>
<p>These are common enough that MIREX, the long-running research benchmark for music analysis, scores key detection with partial credit for exactly these neighbours: half a point for a fifth, 0.3 for the relative key and 0.2 for the parallel key. If the researchers grading the algorithms treat these as near misses, you can too.</p>
<p>The practical upshot: when two tools disagree, check the relationship between their answers first. If one says A minor and the other says C major, they've both found the same scale and differ only on the home note. You can settle that by ear in about ten seconds. The method is in <a href="/blog/how-to-find-the-key-of-a-song/">how to find the key of a song</a>, and the full list of pairs is in <a href="/blog/relative-major-and-minor-keys/">relative major and minor keys</a>.</p>

<h2>Why do modes confuse key detectors?</h2>
<p>Most detectors only have templates for major and minor. Plenty of music doesn't sit in either.</p>
<ul>
  <li>A tune in D Dorian uses the notes of C major but treats D as home. It sounds minor with a bright sixth. Detectors tend to call it D minor or C major, and neither is quite wrong.</li>
  <li>A tune in G Mixolydian also uses the notes of C major, with G as home. Lots of rock and funk lives here. You'll see G major and C major in the results.</li>
  <li>E Phrygian, again the notes of C major with E as home, turns up in some metal and flamenco-influenced music. Expect E minor, A minor or C major.</li>
</ul>
<p>In all three cases the tool is being asked to force a mode into a major/minor box. Different templates force it into different boxes.</p>

<h2>Do drums and bass affect key detection?</h2>
<p>Yes, more than people expect. Drums are mostly noise spread across every pitch class, which blurs the chromagram and lowers the contrast between the right key and its neighbours. Tuned kicks, toms and long 808s aren't noise, though. They pile a lot of energy onto one or two notes, and if an 808 spends the track on the fifth of the key, it can drag the answer towards the dominant.</p>
<p>Distortion makes it stranger. A distorted bass note produces strong harmonics. The third harmonic of A is an E (an octave and a fifth up), which strengthens the fifth. The fifth harmonic is a C sharp (two octaves and a major third up), which can nudge an A minor track towards A major. Heavily saturated basslines are one of the reasons parallel major/minor mistakes happen at all.</p>

<h2>What if the song changes key?</h2>
<p>A single key per file assumes the track stays put. When the last chorus jumps up a tone, or a bridge moves to the relative minor, the tool reports whichever key dominates overall, or a key that splits the difference. Two tools weighting sections differently will split it differently. keyandbpm reports one key per file and doesn't detect key changes within a track, so if you suspect one, trim the sections and check them separately.</p>

<h2>Can tuning make key finders disagree?</h2>
<p>It can. A record that runs 40 or 50 cents sharp sits almost halfway between two keys. A tool that assumes A440 will round the notes to whichever semitone is nearer, and two tools can round different ways. Older records, sped-up or slowed-down edits and anything played from vinyl at slightly wrong speed are the usual suspects (background in <a href="/blog/why-old-records-sound-out-of-tune/">why old records sound out of tune</a>).</p>
<p>The <a href="/">keyandbpm analyser</a> measures the recording's own tuning first, shows it as Hz of A4 and cents from 440, and reads the key against that tuning. A detuned record still gets the key it's actually played in.</p>

<h2>Sometimes they agree and just write it differently</h2>
<p>Before assuming a disagreement, check the notation. A few things that look different but aren't:</p>
<ul>
  <li>Enharmonic spellings: D flat major and C sharp major are the same pitches, as are E flat minor and D sharp minor.</li>
  <li>Camelot codes: 8A is A minor and 8B is C major. See <a href="/blog/camelot-wheel-explained/">the Camelot wheel explained</a> for the full table.</li>
  <li>Open Key notation, used by some DJ software: 1m is A minor and 1d is C major.</li>
</ul>
<p>keyandbpm itself shows plain key names and no Camelot codes, so if you're comparing it against a DJ app, convert first.</p>

<h2>What does the key strength figure mean?</h2>
<p>keyandbpm shows a strength figure from 0 to 1 next to the key. Think of it as how well the track's pitch content matches the best key template. A high figure means a clear fit; a low one means the track matches its best key only loosely, which usually means other keys are close behind.</p>
<p>How I use it: with a high figure I trust the answer and move on. With a low one I assume the right answer might be one of the neighbours in the table above, starting with the relative key the analyser lists, and I check by ear. Short loops, drum-heavy tracks and modal tunes tend to score lower. In those cases the low number is an honest reading of ambiguous music.</p>

<h2>Which key finder should I trust?</h2>
<p>My opinion: trust your ear for the final call and use any detector to narrow it down. When two tools disagree, the answer is nearly always one of their two results, and they're nearly always related by one of the patterns above.</p>
<p>For DJing, the stakes are lower than they look. Relative keys share every note, so a mix between an A minor track and a C major track works whichever label is "right". More on that in <a href="/blog/harmonic-mixing-for-djs/">harmonic mixing for DJs</a>. For producing over a sample, get it right by ear, because you'll be writing notes against it.</p>
`,
  faq: [
    {
      q: "Why does Rekordbox say a different key than another key finder?",
      a: "Different tools use different pitch analysis and key templates, so close calls go different ways. Check whether the two answers are relative keys, a fifth apart, or the same tonic in major and minor; that's almost always the case.",
    },
    {
      q: "Which is right if one tool says A minor and another says C major?",
      a: "Both have found the same notes. The right answer is whichever note the song treats as home, which you can hear by humming the note the track resolves to.",
    },
    {
      q: "Can a key detector tell if a song changes key?",
      a: "Most return one key per file, including keyandbpm. Trim each section and analyse it separately if you think the key changes.",
    },
    {
      q: "Is a low key strength a bad result?",
      a: "It's a warning, not a failure. It means the track fits several keys nearly as well as its best one, so check the relative key and the key a fifth away by ear.",
    },
    {
      q: "Does a Camelot code mean a different key from a plain key name?",
      a: "Not necessarily. Camelot codes are another way of writing the same 24 keys, so 8A is simply A minor. Convert to the same notation before comparing.",
    },
  ],
  related: ["how-to-find-the-key-of-a-song", "relative-major-and-minor-keys", "camelot-wheel-explained", "harmonic-mixing-for-djs"],
} satisfies Post;
