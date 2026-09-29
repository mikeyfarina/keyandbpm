import type { Post } from "../post.ts";

export default {
  slug: "what-key-is-this-sample-in",
  title: "What key is this sample in? How to find the key of a loop",
  description:
    "How to find the key of a sample or loop: when a key detector works, when you need a tuner, why short loops fool everyone, and what to do about detuning.",
  published: "2026-09-29",
  answer:
    "To find the key of a sample, first decide what kind of sample it is. A melodic or chord loop has a key: loop it, hum the note it wants to rest on, test the third (three semitones up means minor, four means major), or run it through a key detector. A one-shot or single 808 note has a pitch rather than a key, so use a tuner, and a pure drum loop usually has no key at all.",
  body: `
<h2>Does every sample have a key?</h2>
<p>No, and this is where most confusion starts. A key needs several notes and a sense of which one is home. A lot of samples don't give you that.</p>
<div class="table-wrap">
<table>
  <thead><tr><th>Sample type</th><th>What it has</th><th>How to find it</th></tr></thead>
  <tbody>
    <tr><td>Chord or piano loop</td><td>A key</td><td>Ear, instrument or key detector</td></tr>
    <tr><td>Melody or vocal phrase</td><td>A key, sometimes a vague one</td><td>Ear first, detector to confirm</td></tr>
    <tr><td>One-shot (single note or stab)</td><td>A pitch, or a chord</td><td>Tuner, or name the chord</td></tr>
    <tr><td>808 or bass hit</td><td>A pitch</td><td>Tuner on the fundamental</td></tr>
    <tr><td>Drum loop</td><td>Usually no key</td><td>Tune individual drums if they ring</td></tr>
  </tbody>
</table>
</div>
<p>If you drop a drum loop into any key detector you'll still get an answer, because the algorithm always picks something. That answer mostly reflects the ring of the kick and the resonance of the toms. It can still be useful (a kick that rings on F will fight a beat in E), but it isn't a key.</p>

<h2>How to find the key of a sample by ear</h2>
<p>This is the same method as for a full song, just with less material to go on. Full walkthrough in <a href="/blog/how-to-find-the-key-of-a-song/">how to find the key of a song</a>; here's the short version.</p>
<ol>
  <li>Loop the sample so it repeats without a gap.</li>
  <li>Hum the note it seems to resolve to at the end of each pass.</li>
  <li>Find that note on a keyboard.</li>
  <li>Play three semitones above it and four semitones above it. Three blends: minor. Four blends: major.</li>
  <li>Play a bass note or a simple chord on your guess under the loop. If it sounds like it belongs, you're done.</li>
</ol>
<p>Step 5 is the one people skip and the one I trust most. You're going to put a bass line under this sample anyway, so test with a bass line.</p>

<h2>Why short loops are so hard to call</h2>
<p>A two-bar loop might contain only one or two chords, and a single chord belongs to a lot of keys. Take an A minor chord (A, C, E). It fits naturally in six different major and minor keys:</p>
<div class="table-wrap">
<table>
  <thead><tr><th>Key</th><th>Role of A minor in that key</th></tr></thead>
  <tbody>
    <tr><td>A minor</td><td>i (home chord)</td></tr>
    <tr><td>C major</td><td>vi</td></tr>
    <tr><td>G major</td><td>ii</td></tr>
    <tr><td>F major</td><td>iii</td></tr>
    <tr><td>E minor</td><td>iv</td></tr>
    <tr><td>D minor</td><td>v</td></tr>
  </tbody>
</table>
</div>
<p>So if your loop is one sustained Am chord, "the key" is really up to you and whatever you put underneath it. Put an F bass note under it and it starts sounding like part of F major. Put A under it and it's A minor. Which is handy, because that ambiguity is half of how flips work (see <a href="/blog/how-to-flip-a-sample/">how to flip a sample</a>).</p>
<p>With two or three chords the options narrow quickly. Work out each chord, then find the keys that contain all of them.</p>

<h2>How to find the key of a sample with a key detector</h2>
<p>For anything longer than a couple of chords, a key detector saves time. Drop the loop into the <a href="/">keyandbpm analyser</a> and it gives you the key, the relative key and a strength figure from 0 to 1. It runs in the browser, the file is never uploaded, and it handles mp3, wav, flac, m4a, ogg and opus (plus aiff in Safari), which covers most sample packs.</p>
<p>With short loops, pay attention to the strength figure. A loop with only a few notes gives any algorithm less evidence, so a low strength is common and it's telling you something real: the loop fits more than one key. In that case look at the relative key it shows as well, and settle it with the bass-note test above. If you want the full story on why tools disagree, read <a href="/blog/why-key-finders-disagree/">why key finders disagree</a>.</p>

<h2>What if the sample sounds between two keys?</h2>
<p>If you've sampled from a record, it's quite likely the loop isn't tuned to A440. Tape machines ran a bit fast or slow, records get pressed and played at slightly off speeds, and pitching a sample up or down in your sampler by a non-whole amount does the same thing. The result is a loop that sounds sour against every key on your keyboard.</p>
<p>The analyser shows tuning as the Hz of A4 and the cents away from 440, and it reads the key against the sample's own tuning, so you still get the right key name for a detuned loop. Then you've got two options:</p>
<ul>
  <li>Retune the sample by the reported cents so it sits on A440 with everything else. Most samplers have a fine-tune control for exactly this; see <a href="/blog/how-to-pitch-a-sample-in-cents/">how to pitch a sample in cents</a>.</li>
  <li>Leave the sample alone and detune your synths, bass and 808 to match it. I do this when the sample's slightly off tuning is part of why it sounds good.</li>
</ul>

<h2>How to find the note of an 808 or one-shot</h2>
<p>Skip the key detector here. Load a tuner plugin (most DAWs ship one) on the channel and play the sample. For an 808, read the pitch from the sustained tail, not the click at the start, which is mostly noise. If the tuner jumps around, low-pass the sample hard before the tuner so it only hears the fundamental.</p>
<p>Once you know the note, tuning the 808 to your track's key is simple: pitch it so its root matches the key's tonic, or whichever note your bass line spends most time on.</p>

<h2>Can I trust the key in a sample pack filename?</h2>
<p>Mostly, but check. Filenames get written by people in a hurry. The common mistakes are listing the relative key (C major on something that's clearly A minor), labelling the key of a longer original after the loop was chopped, and forgetting that the loop was pitched after the name was written. Ten seconds with a bass note under it settles it.</p>

<h2>What to do once you know the key</h2>
<p>If the sample and your beat are already in the same key, great. If not, you'll be repitching or time-stretching, and the maths is simple once you know it: every semitone is 100 cents, and repitching by speed changes tempo too. That's covered in <a href="/blog/how-to-match-a-sample-to-your-beat/">how to match a sample to your beat</a>.</p>
`,
  faq: [
    {
      q: "Can a drum loop have a key?",
      a: "Not really. Drums ring at pitches, and a tuned kick or tom can clash with your bass, but a drum loop doesn't have a tonic and scale the way a chord loop does. Tune the drums that ring rather than looking for a key.",
    },
    {
      q: "How long does a sample need to be for key detection to work?",
      a: "There's no hard minimum, but more notes and chords give any detector more evidence. A single chord can belong to six keys, so for very short loops, trust your ear and a bass note over the reading.",
    },
    {
      q: "Does my 808 need to be in the same key as the sample?",
      a: "It should play notes from the sample's key, usually starting on the tonic. An 808 tuned to a note outside the key will clash with the sample every time it hits.",
    },
    {
      q: "Why does my sample sound out of tune with my keyboard?",
      a: "It's probably not tuned to A440, which is common with anything sampled from records. Measure the offset in cents and either retune the sample or detune your instruments to match it.",
    },
    {
      q: "Is the key of a sample the same as the key of the song it came from?",
      a: "Not always. A chopped section can sit on a chord that suggests a different home note, and any repitching in your sampler moves the key too. Check the loop you actually have.",
    },
  ],
  related: ["how-to-match-a-sample-to-your-beat", "how-to-pitch-a-sample-in-cents", "how-to-find-the-key-of-a-song", "best-keys-for-beats"],
} satisfies Post;
