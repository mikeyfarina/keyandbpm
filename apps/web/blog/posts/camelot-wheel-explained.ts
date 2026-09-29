import type { Post } from "../post.ts";

export default {
  slug: "camelot-wheel-explained",
  title: "The Camelot wheel explained: every key and its code",
  description: "What the Camelot wheel is, a chart of all 24 keys with their codes (8A is A minor, 8B is C major), and which codes mix together without clashing.",
  published: "2026-09-29",
  answer: "The Camelot wheel gives each of the 24 major and minor keys a code from 1 to 12 plus a letter: A for minor, B for major. 8A is A minor and 8B is C major. Keys mix well when they share a code, sit one number apart with the same letter, or share a number across A and B.",
  body: `
<h2>What is the Camelot wheel?</h2>
<p>It's the circle of fifths with the music theory filed off. Instead of asking you to remember that E minor sits next to A minor and B minor, it calls them 9A, 8A and 10A. Neighbouring numbers are neighbouring keys. That's the whole trick.</p>
<p>The system was popularised by Mixed In Key, and most DJ software can now show keys in a Camelot style or something close to it. It exists for one job: letting you glance at two tracks in a crate and know whether their keys will fight, without working out scales in your head during a set.</p>
<p>Each key gets two things:</p>
<ul>
<li>A number from 1 to 12. Moving one number up means moving up a fifth (C major to G major). Moving one down means moving down a fifth (C major to F major).</li>
<li>A letter. A is minor, B is major. The same number with A and B gives you a relative pair: two keys that use exactly the same notes.</li>
</ul>

<h2>Camelot wheel chart: all 24 keys and their codes</h2>
<p>This table is generated from the pitch maths, not typed out by hand, so it's safe to copy. Enharmonic spellings are in brackets (G# minor and Ab minor are the same key, and different apps pick different names). The last column is Open Key notation, which Traktor can display: 1d is C major and 1m is A minor.</p>
<div class="table-wrap">
<table>
<thead><tr><th>Minor code</th><th>Minor key</th><th>Major code</th><th>Major key</th><th>Open Key (minor / major)</th></tr></thead>
<tbody>
<tr><td>1A</td><td>G# (Ab) minor</td><td>1B</td><td>B major</td><td>6m / 6d</td></tr>
<tr><td>2A</td><td>Eb (D#) minor</td><td>2B</td><td>F# (Gb) major</td><td>7m / 7d</td></tr>
<tr><td>3A</td><td>Bb (A#) minor</td><td>3B</td><td>Db (C#) major</td><td>8m / 8d</td></tr>
<tr><td>4A</td><td>F minor</td><td>4B</td><td>Ab (G#) major</td><td>9m / 9d</td></tr>
<tr><td>5A</td><td>C minor</td><td>5B</td><td>Eb (D#) major</td><td>10m / 10d</td></tr>
<tr><td>6A</td><td>G minor</td><td>6B</td><td>Bb (A#) major</td><td>11m / 11d</td></tr>
<tr><td>7A</td><td>D minor</td><td>7B</td><td>F major</td><td>12m / 12d</td></tr>
<tr><td>8A</td><td>A minor</td><td>8B</td><td>C major</td><td>1m / 1d</td></tr>
<tr><td>9A</td><td>E minor</td><td>9B</td><td>G major</td><td>2m / 2d</td></tr>
<tr><td>10A</td><td>B minor</td><td>10B</td><td>D major</td><td>3m / 3d</td></tr>
<tr><td>11A</td><td>F# (Gb) minor</td><td>11B</td><td>A major</td><td>4m / 4d</td></tr>
<tr><td>12A</td><td>C# (Db) minor</td><td>12B</td><td>E major</td><td>5m / 5d</td></tr>
</tbody>
</table>
</div>
<p>Two quick sanity checks I use: 8A is A minor and 8B is C major (the keys with no sharps or flats), and each row's A and B are relatives, so they share a key signature. If a chart you find online breaks either of those, bin it.</p>

<h2>How do you read a Camelot code?</h2>
<p>Read the number as position on a clock and the letter as mood. 5A is C minor. 6A is G minor, one step clockwise. 4A is F minor, one step anticlockwise. 5B is Eb major, C minor's relative.</p>
<p>The wheel wraps round, so 12 sits next to 1. 12A (C# minor) and 1A (G# minor) are neighbours, exactly like 7A and 8A. People forget this at the edges and think a track in 1A has only one neighbour. It has two, same as every other key.</p>

<h2>Which Camelot keys mix together?</h2>
<p>From any code, these moves keep every note in the two tracks either shared or one note away:</p>
<ol>
<li>Same code. 8A into 8A. Identical key, nothing to clash.</li>
<li>One number up, same letter. 8A into 9A (A minor into E minor). The scales differ by one note.</li>
<li>One number down, same letter. 8A into 7A (A minor into D minor). Also one note different.</li>
<li>Same number, swap the letter. 8A into 8B (A minor into C major). Same notes, different home chord, so the mood lifts or darkens.</li>
</ol>
<p>Those four are the safe set. Beyond them there are "energy" moves people like, such as jumping two numbers or seven numbers, which I cover in the <a href="/blog/harmonic-mixing-for-djs/">harmonic mixing guide</a>. They work, but they're choices you make on purpose, not defaults.</p>

<h2>Why numbers and not key names?</h2>
<p>Because the distance between key names on a keyboard tells you almost nothing about whether they'll mix. C and C# are one semitone apart and sound terrible layered. C and G are seven semitones apart and sit together nicely. The circle of fifths reorders the keys so that the close ones are the ones that share notes, and Camelot just numbers that circle.</p>
<p>So the number isn't a pitch. 9A is not "higher" than 8A in any useful sense. It's a position on a loop of compatibility.</p>

<h2>How do I convert a key to Camelot?</h2>
<p>Find the key name, then look it up in the table above. If you've got a key in flats and the table lists sharps, check the bracket: Db major is 3B whether your software writes it as Db or C#.</p>
<p>To get the key name in the first place, you've got options. You can work it out by ear or on an instrument (there's a walkthrough in <a href="/blog/how-to-find-the-key-of-a-song/">how to find the key of a song</a>). Your DJ software will analyse it. Or you can drop the file into <a href="/">keyandbpm</a>, which shows the key name, the relative key and a strength figure from 0 to 1. It doesn't print Camelot codes, so you'd take the name it gives and read the code off the chart, or open its page in the <a href="/key/">list of all 24 keys</a>, which gives the Camelot code, chords and relative key for each. It runs in the browser and doesn't upload the file.</p>
<p>A note on minor keys: if a tool gives you "Am" or "A minor" or "A min", it's all 8A. If it gives you something like "A Aeolian", that's also A minor for mixing purposes.</p>

<h2>Does the pitch fader change the Camelot code?</h2>
<p>Yes, and this catches people out. Speeding a track up without key lock raises its pitch. Roughly 6% faster is one semitone higher (a semitone is a ratio of about 1.0595). And one semitone up on the wheel is not one step. It's seven steps clockwise, which is the same as five steps anticlockwise.</p>
<p>So an 8A track pushed up a semitone becomes 3A (Bb minor). Pulled down a semitone, it becomes 1A (G# minor). Neither is compatible with 8A. If you're riding the pitch fader hard between genres, either turn key lock on or re-check the codes at the speed you'll actually play them.</p>
<p>Smaller moves shift the tuning rather than the key. A 2% nudge is about 34 cents, a third of a semitone. That won't change the code, but layered over a long blend it can make two tracks sound slightly sour against each other.</p>

<h2>Where the wheel falls short</h2>
<p>The code is only as good as the key it came from, and key detection is a best guess. Tracks built on one droning chord, tracks that sit between a major key and its relative minor, and tracks with a key change halfway through can all get a confident-looking code that's wrong for the part you're mixing. I've covered why that happens in <a href="/blog/why-key-finders-disagree/">why key finders disagree</a>.</p>
<p>My habit: trust the code for shortlisting, trust my ears for the actual blend. If two "compatible" tracks sound wrong together in the headphones, they are wrong together, whatever the numbers say. If two "incompatible" ones sound fine because one of them is mostly drums, play them.</p>
<p>Also worth knowing: the wheel assumes Western major and minor keys. Plenty of music leans on modes (Dorian, Mixolydian) or doesn't settle into a key at all. Software will still hand those tracks a code, usually the nearest major or minor. Treat that code as approximate.</p>
`,
  faq: [
    { q: "What key is 8A on the Camelot wheel?", a: "8A is A minor. Its partner 8B is C major, and both use only the white notes of a piano." },
    { q: "What is the Camelot code for C major?", a: "C major is 8B. Its relative minor, A minor, is 8A." },
    { q: "What do A and B mean on the Camelot wheel?", a: "A means a minor key and B means a major key. The same number with A and B is a relative pair that shares all the same notes." },
    { q: "Is 12A next to 1A on the Camelot wheel?", a: "Yes. The wheel is a circle, so 12 and 1 are neighbours. 12A (C# minor) mixes into 1A (G# minor) as easily as 7A mixes into 8A." },
    { q: "Is Open Key the same as Camelot?", a: "It's the same idea with different labels. Open Key numbers start from C major as 1d and A minor as 1m, so Camelot 8B is Open Key 1d and 8A is 1m." },
  ],
  related: ["harmonic-mixing-for-djs", "relative-major-and-minor-keys", "why-key-finders-disagree", "tag-key-and-bpm-in-rekordbox-serato-traktor"],
} satisfies Post;
