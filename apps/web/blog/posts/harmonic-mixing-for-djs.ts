import type { Post } from "../post.ts";

export default {
  slug: "harmonic-mixing-for-djs",
  title: "Harmonic mixing: how to mix in key as a DJ",
  description: "How to mix in key: the four safe key moves, the riskier energy jumps, how the pitch fader shifts a track's key, and when to ignore key and trust your ears.",
  published: "2026-09-29",
  answer: "To mix in key, play the next track in the same key, one step up or down the circle of fifths (one Camelot number either way, same letter), or in the relative major or minor (same Camelot number, other letter). Turn key lock on or keep pitch changes small, because about 6% of speed is a full semitone.",
  body: `
<h2>What is harmonic mixing?</h2>
<p>It's choosing the next track partly by key, so that when two records overlap their basslines and chords don't clash. Beatmatching lines up the drums. Harmonic mixing lines up the notes.</p>
<p>You'll hear the difference most in long blends. A 32-bar overlap of two melodic house records in clashing keys sounds like two bands rehearsing in neighbouring rooms. The same blend with compatible keys can sound like one new track. For quick cuts, or tracks that are mostly drums, key matters much less.</p>

<h2>Do you really need to mix in key?</h2>
<p>My opinion: you need to know the keys, and then you need to be willing to ignore them. Plenty of great DJs never think about key and rely entirely on ears, and plenty of mechanically "in key" mixes are dull because every track was chosen for its code rather than its energy.</p>
<p>Where it earns its keep is in shortlisting. When you've got 40 tracks that would work on tempo and vibe, knowing which six are also harmonically safe saves you from finding out mid-blend.</p>

<h2>How to mix in key: the four safe moves</h2>
<p>Using Camelot codes (see the <a href="/blog/camelot-wheel-explained/">Camelot wheel chart</a> if you need to convert key names), from a track in 8A (A minor) you can go to:</p>
<div class="table-wrap">
<table>
<thead><tr><th>Move</th><th>From 8A to</th><th>In key names</th><th>What it sounds like</th></tr></thead>
<tbody>
<tr><td>Same key</td><td>8A</td><td>A minor to A minor</td><td>Smoothest possible, nothing changes</td></tr>
<tr><td>One step up</td><td>9A</td><td>A minor to E minor</td><td>A gentle lift, one note changes</td></tr>
<tr><td>One step down</td><td>7A</td><td>A minor to D minor</td><td>Settles slightly, one note changes</td></tr>
<tr><td>Relative switch</td><td>8B</td><td>A minor to C major</td><td>Same notes, mood turns brighter</td></tr>
</tbody>
</table>
</div>
<p>The same logic works from any code. From 3B (Db major) you'd have 3B, 4B, 2B and 3A. From 12A (C# minor) it's 12A, 1A, 11A and 12B, because the wheel wraps round.</p>
<p>The relative switch is the one I reach for most when a set has been in minor keys for a long run and needs a lift that isn't just more volume. The <a href="/blog/relative-major-and-minor-keys/">relative keys guide</a> explains why it works.</p>

<h2>What are energy boost mixes?</h2>
<p>These are the moves beyond the safe four. They add more tension, so they're a tool, not a default:</p>
<ul>
<li>Two steps up, same letter (8A to 10A, A minor to B minor). The whole track lands a tone higher. Noticeable lift, and it works best as a quick transition rather than a long blend, because more notes clash during the overlap.</li>
<li>Seven steps up, same letter (8A to 3A, A minor to Bb minor). This is up one semitone, the classic pop key change. Very obvious. Cut or drop into it rather than blend.</li>
<li>Diagonal moves, such as 8A to 9B (A minor to G major) or 8B to 7A (C major to D minor). One note different, like a normal step, but with the mood switch on top. These tend to work fine.</li>
</ul>
<p>Anything else (8A into 2A, say, which is a tritone away) is a clash unless one of the tracks has very little pitched content in the overlap.</p>

<h2>How does the pitch fader change the key?</h2>
<p>Without key lock, speeding a record up raises its pitch by the same ratio. A semitone is a ratio of about 1.0595, so roughly 6% on the pitch fader moves a track up a full semitone. That's seven steps round the Camelot wheel, which turns a compatible pairing into a clash.</p>
<p>Smaller changes shift the tuning rather than the key:</p>
<div class="table-wrap">
<table>
<thead><tr><th>Speed change</th><th>Pitch change</th></tr></thead>
<tbody>
<tr><td>+1%</td><td>+17 cents</td></tr>
<tr><td>+2%</td><td>+34 cents</td></tr>
<tr><td>+3%</td><td>+51 cents (about half a semitone)</td></tr>
<tr><td>+4%</td><td>+68 cents</td></tr>
<tr><td>+6%</td><td>+101 cents (one semitone)</td></tr>
<tr><td>+8%</td><td>+133 cents</td></tr>
</tbody>
</table>
</div>
<p>A hundred cents is a semitone. The same figures apply in reverse when you slow down. At around 3%, a track is half a semitone out, which is as far from its labelled key as it can be. If you're matching a 124 BPM track to a 128 BPM one, that's about a 3.2% push, so it's worth caring.</p>
<p>Every major DJ platform has a key lock (Rekordbox and CDJs call it Master Tempo, Serato and Traktor call it key lock or keylock). It keeps the pitch where it is while the tempo changes. It costs a bit of audio quality at big tempo shifts, but for the few percent most blends need, it's usually fine.</p>

<h2>What about records that aren't tuned to 440?</h2>
<p>Older records, and some newer ones, sit a bit off standard tuning. A record tuned around A = 432 Hz is about 32 cents flat of A440. Two tracks with the same key label can still sound slightly sour together if one is 30 cents flat and the other is dead on.</p>
<p>The <a href="/">keyandbpm analyser</a> shows tuning as the Hz of A4 and cents from 440, and it measures key against the record's own tuning, so a flat record still gets the right key name. If you see two tracks in the same key but 30 or 40 cents apart, you can nudge the pitch a couple of percent (with key lock off) to pull them together. There's background on why this happens in <a href="/blog/why-old-records-sound-out-of-tune/">why old records aren't tuned to 440 Hz</a>.</p>

<h2>How to prepare a set for harmonic mixing</h2>
<p>If you want the compatible keys for one track spelled out, each of the <a href="/key/">24 key pages</a> lists the Camelot code and the keys that mix cleanly with it.</p>
<ol>
<li>Get keys for your library. Your DJ software will analyse them, or you can use a separate tool and write the results into the file tags (see <a href="/blog/tag-key-and-bpm-in-rekordbox-serato-traktor/">tagging key and BPM for Rekordbox, Serato and Traktor</a>).</li>
<li>Pick one notation and stick to it. Camelot, Open Key or plain key names all work. Mixing notations in your head mid-set is how mistakes happen.</li>
<li>Spot-check anything that matters. Key detection is wrong more often than people admit, especially on tracks that sit between a key and its relative, on drum-heavy tracks, and on tracks that change key. Play the root chord over the track, or just hum along to the bassline.</li>
<li>Build short chains, not whole sets. I plan clusters of three or four tracks that flow harmonically and leave the gaps between clusters for energy or genre changes.</li>
<li>Listen to the blend before the gig. If it sounds wrong, it is wrong, whatever the codes say.</li>
</ol>

<h2>When should you ignore the key?</h2>
<p>Plenty of the time:</p>
<ul>
<li>When one track is drums and percussion in the overlap. There's nothing to clash.</li>
<li>When the key result is weak. A low strength figure, or two tools disagreeing, usually means the track is ambiguous. Ears win.</li>
<li>When you're cutting, not blending. A clean cut on the one hides almost any key relationship.</li>
<li>When the right next record is in the wrong key. Energy and crowd beat theory every time. EQ out the lows and mids of the outgoing track early and the clash mostly disappears.</li>
</ul>
<p>Harmonic mixing is a way of avoiding mistakes, not a way of choosing music. Use it to rule things out, then pick with your ears.</p>
`,
  faq: [
    { q: "What keys mix well together for DJing?", a: "The same key, the keys one step either side on the circle of fifths, and the relative major or minor. On the Camelot wheel that's the same code, plus or minus one number with the same letter, or the same number with the other letter." },
    { q: "Does key lock affect sound quality?", a: "A little, and more as the tempo change grows. For the small adjustments most blends need, a few percent either way, it's rarely noticeable." },
    { q: "How much pitch change is one semitone on a DJ deck?", a: "About 6% of speed, since a semitone is a ratio of roughly 1.0595. At around 3% a track is half a semitone out, the furthest it can be from its labelled key." },
    { q: "Can you mix a major key into a minor key?", a: "Yes, if it's the relative pair, like C major and A minor, which share every note. Moving from a major key to its parallel minor, like C major to C minor, changes three notes and is much harder to blend." },
    { q: "Is harmonic mixing necessary for techno and drum-heavy music?", a: "Less so. When most of the overlap is drums, keys rarely clash, but bass-heavy or melodic sections still benefit from a quick key check." },
  ],
  related: ["camelot-wheel-explained", "relative-major-and-minor-keys", "tag-key-and-bpm-in-rekordbox-serato-traktor", "why-key-finders-disagree"],
} satisfies Post;
