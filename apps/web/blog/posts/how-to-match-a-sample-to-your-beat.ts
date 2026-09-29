import type { Post } from "../post.ts";

export default {
  slug: "how-to-match-a-sample-to-your-beat",
  title: "How to match a sample to your beat's key and tempo",
  description:
    "Fit a sample to your beat's key and BPM: when to time-stretch and when to repitch, how many semitones to move, and the maths that links pitch to tempo.",
  published: "2026-09-29",
  answer:
    "Find the sample's key and BPM, then either time-stretch it to your tempo and transpose it separately, or repitch it (change speed and pitch together, like a turntable). Every semitone of repitch changes the tempo by about 5.9%, so semitones = 12 × log2(new BPM ÷ old BPM); move the key by the smallest number of semitones, never more than 6.",
  body: `
<p>You've got a loop you love and a beat that's already half built, and they don't agree. Either the tempo's off, the key's off, or both. There are two ways to fix it, and picking the right one matters more than any plugin setting.</p>

<h2>Step one: find the sample's key and BPM</h2>
<p>You can't move something to the right place if you don't know where it starts. Loop the sample, find the root note on a keyboard, and tap the tempo (the <a href="/blog/what-key-is-this-sample-in/">key of a sample</a> guide goes through the by-ear method). Or drop the file on the <a href="/">analyser</a>: it gives the key, BPM and tuning, and it plays the sample against a beat grid so you can hear whether the tempo it found is the one you'd count.</p>
<p>Write down the tuning figure too. If the sample sits 30 cents flat, your key shift will leave it 30 cents flat, and that's its own fix (covered in <a href="/blog/how-to-pitch-a-sample-in-cents/">how to pitch a sample in cents</a>).</p>

<h2>Time-stretch or repitch: which should I use?</h2>
<p>These are the two approaches, and they sound very different.</p>
<p><strong>Repitch</strong> is what a turntable or tape machine does. Speed the sample up and it gets higher; slow it down and it gets lower. Pitch and tempo move together, locked. Ableton calls this the Re-Pitch warp mode; on an MPC or most samplers it's just what happens when you play a sample on a different note. Nothing is being calculated, so there are no stretching artefacts at all. The sound changes character (faster and brighter, or slower and darker), and a lot of classic hip hop sounds the way it does because of this.</p>
<p><strong>Time-stretching</strong> changes the tempo without touching the pitch, and pitch-shifting changes the pitch without touching the tempo. Your DAW does this with algorithms: Ableton's warp modes, Logic's Flex Time and Flex Pitch, FL Studio's stretch modes. It lets you move the two independently, which is more flexible, at the cost of artefacts: smeared transients, a phasey or metallic quality on sustained notes, and a "chipmunk" or "underwater" formant shift on vocals once you go more than a few semitones.</p>
<p>My rule of thumb:</p>
<ul>
  <li>If the tempo and key are both a small distance away and you like how the sample sounds a bit faster or slower, repitch. It's cleaner.</li>
  <li>If you need the sample at a very different tempo but the same key (or the other way round), stretch.</li>
  <li>If there's a vocal in the sample, stretch it no further than you have to. Voices give the game away first.</li>
  <li>For drum breaks, repitch or chop to slices. Stretching drums smears the hits.</li>
</ul>

<h2>How many semitones should I transpose a sample?</h2>
<p>Count the distance between the sample's key and the beat's key, in semitones, and take the shorter way round. There are only 12 semitones in an octave, so you never need to move more than 6 in either direction.</p>
<p>Example: the sample is in A minor and the beat is in C minor. C is 3 semitones above A (A, A#, B, C), so shift the sample up 3. You could also go down 9, but that's a much bigger shift for the same result.</p>
<p>Keep the mode in mind. If the sample is in a minor key and the beat is in its relative major, you don't need to move anything: A minor and C major share the same notes. The <a href="/blog/relative-major-and-minor-keys/">relative major and minor keys</a> guide lists all 12 pairs. The same trick works for fitting a sample to a beat you haven't committed to yet: shift the beat, not the sample.</p>
<p>If the sample and beat are a tritone apart (6 semitones), try it both ways, up 6 and down 6. They'll sound quite different, and one usually works better.</p>

<h2>The semitone and tempo maths</h2>
<p>Because repitch changes speed and pitch together, a given key change fixes the tempo change too. One semitone is a frequency ratio of 2<sup>1/12</sup>, which is about 1.0595. So every semitone up plays the sample about 5.9% faster, and every semitone down about 5.6% slower.</p>
<p>Here's what that does to a 90 BPM loop:</p>
<div class="table-wrap">
<table>
  <thead>
    <tr><th>Repitch (semitones)</th><th>Speed ratio</th><th>90 BPM loop becomes</th><th>Tempo change</th></tr>
  </thead>
  <tbody>
    <tr><td>-5</td><td>0.7492</td><td>67.4 BPM</td><td>-25.1%</td></tr>
    <tr><td>-4</td><td>0.7937</td><td>71.4 BPM</td><td>-20.6%</td></tr>
    <tr><td>-3</td><td>0.8409</td><td>75.7 BPM</td><td>-15.9%</td></tr>
    <tr><td>-2</td><td>0.8909</td><td>80.2 BPM</td><td>-10.9%</td></tr>
    <tr><td>-1</td><td>0.9439</td><td>84.9 BPM</td><td>-5.6%</td></tr>
    <tr><td>0</td><td>1.0000</td><td>90.0 BPM</td><td>0%</td></tr>
    <tr><td>+1</td><td>1.0595</td><td>95.4 BPM</td><td>+5.9%</td></tr>
    <tr><td>+2</td><td>1.1225</td><td>101.0 BPM</td><td>+12.2%</td></tr>
    <tr><td>+3</td><td>1.1892</td><td>107.0 BPM</td><td>+18.9%</td></tr>
    <tr><td>+4</td><td>1.2599</td><td>113.4 BPM</td><td>+26.0%</td></tr>
    <tr><td>+5</td><td>1.3348</td><td>120.1 BPM</td><td>+33.5%</td></tr>
  </tbody>
</table>
</div>
<p>Going the other way, if you know the tempo you want, the pitch shift you'll get from repitching is:</p>
<pre><code>semitones = 12 × log2(new BPM ÷ old BPM)
new BPM   = old BPM × 2^(semitones ÷ 12)</code></pre>
<p>So taking a 90 BPM loop to 95 BPM by repitch raises it about 0.94 semitones, or 94 cents. That's nearly a semitone but not quite, which means the sample ends up between keys. You then have three choices: nudge the beat's tempo so the shift lands on a whole semitone (95.4 BPM here), fine-tune the rest of the beat to match the sample, or give up on pure repitch and stretch instead.</p>
<p>I nearly always take the first option. A beat at 95.4 BPM sounds no different to a listener than one at 95, and the sample stays in tune with no processing.</p>

<h2>Should I move the sample or the beat?</h2>
<p>If the beat is mostly drums and an 808, move the beat. Drums don't care about key, and transposing an 808 pattern or a synth is free and clean because it's MIDI. The sample stays untouched and sounds its best.</p>
<p>If the beat already has a vocal, or you've built a lot of melodic parts, move the sample. Keep the shift small, and if you can, find the one semitone in either direction where the sample sounds best and set the beat up around that.</p>

<h2>What about half time and double time?</h2>
<p>Don't forget the sample doesn't have to play at the same tempo as your drums. A 70 BPM soul loop fits a 140 BPM trap beat as it is, because 140 is double 70. A 180 BPM loop drops into a 90 BPM beat the same way. Before you stretch anything, check whether the tempo is already a factor of 2 away. Analysers and DAWs sometimes report the half or double value anyway, which is its own headache: see <a href="/blog/why-is-my-bpm-half-or-double/">why is my BPM half or double</a>.</p>

<h2>A quick workflow</h2>
<ol>
  <li>Get the sample's key, BPM and tuning.</li>
  <li>Check for a relative key or a half/double tempo match before moving anything.</li>
  <li>Work out the smallest semitone shift to your key.</li>
  <li>Look up what that shift does to the tempo if you repitch. If it lands close to your target BPM, repitch and adjust the beat's tempo to match.</li>
  <li>If not, stretch to tempo and pitch-shift separately, and keep both moves as small as you can.</li>
  <li>Fix any leftover tuning offset in cents, on the sample or on everything else.</li>
  <li>Listen on its own and in the mix. Stretching artefacts that hide under drums can still show up in the intro.</li>
</ol>
`,
  faq: [
    {
      q: "How do I change a sample's key without changing its tempo?",
      a: "Use your DAW's pitch-shift or a warp mode that keeps tempo fixed, such as Ableton's Complex or Complex Pro, or Flex Pitch in Logic. Keep the shift small, because artefacts grow with every semitone.",
    },
    {
      q: "How much does one semitone change the BPM?",
      a: "When you repitch, one semitone up is about 5.9% faster and one semitone down is about 5.6% slower. A 90 BPM loop becomes about 95.4 BPM a semitone up and 84.9 BPM a semitone down.",
    },
    {
      q: "Can I put a minor sample in a major beat?",
      a: "Yes if the beat is in the sample's relative major, since they share the same notes: an A minor sample fits a C major beat with no shifting. Otherwise, transposing changes the root but keeps the sample minor.",
    },
    {
      q: "Why does my sample sound slightly out of tune after I matched the key?",
      a: "It was probably out of tune to begin with, which is common on old records and vinyl rips. Check its tuning in cents and fine-tune the sample or the rest of the beat by that amount.",
    },
    {
      q: "What's the most I should pitch a sample?",
      a: "You never need more than 6 semitones for a key change, because going the other way is shorter. With stretching, most material starts to sound processed beyond 3 or 4 semitones; with repitch the limit is whether you like the new tempo.",
    },
  ],
  related: [
    "what-key-is-this-sample-in",
    "how-to-pitch-a-sample-in-cents",
    "relative-major-and-minor-keys",
    "how-to-flip-a-sample",
  ],
} satisfies Post;
