import type { Post } from "../post.ts";

export default {
  slug: "how-to-pitch-a-sample-in-cents",
  title: "How to fine-tune a sample in cents",
  description:
    "What cents are, how to measure how far a sample is off A440, and how to fine-tune it (or the rest of your beat) so everything sits in tune.",
  published: "2026-09-29",
  answer:
    "A cent is a hundredth of a semitone, so 100 cents make a semitone and 1,200 make an octave. To fine-tune a sample, measure how many cents it sits from A440, then set your sampler's fine-tune or detune control to the opposite amount (a sample 20 cents flat gets +20), or tune every other instrument in the beat to match the sample instead.",
  body: `
<p>Most tuning problems with samples aren't a wrong key. The key's right, the notes are right, and the whole thing still sounds slightly sour against your keys or 808. That's usually a sample that sits a fraction of a semitone off standard pitch, and semitone transposition can't fix it. You need cents.</p>

<h2>What are cents in music?</h2>
<p>A cent is one hundredth of an equal-tempered semitone. There are 100 cents between C and C#, and 1,200 in an octave. The scale is logarithmic, like the semitones it divides, so "10 cents" is the same musical distance on a bass note as on a hi-hat.</p>
<p>Tuning is usually described against A440, the standard where the A above middle C vibrates at 440 Hz. The conversion is:</p>
<pre><code>cents from 440 = 1200 × log2(A4 in Hz ÷ 440)
A4 in Hz       = 440 × 2^(cents ÷ 1200)</code></pre>
<p>Some reference points, computed from that formula:</p>
<div class="table-wrap">
<table>
  <thead>
    <tr><th>A4 tuned to</th><th>Cents from 440</th></tr>
  </thead>
  <tbody>
    <tr><td>427.5 Hz</td><td>-50 (a quarter-tone flat)</td></tr>
    <tr><td>432 Hz</td><td>-31.8</td></tr>
    <tr><td>435 Hz</td><td>-19.8</td></tr>
    <tr><td>437.5 Hz</td><td>-10</td></tr>
    <tr><td>438 Hz</td><td>-7.9</td></tr>
    <tr><td>440 Hz</td><td>0</td></tr>
    <tr><td>442 Hz</td><td>+7.9</td></tr>
    <tr><td>442.5 Hz</td><td>+10</td></tr>
    <tr><td>444 Hz</td><td>+15.7</td></tr>
    <tr><td>446 Hz</td><td>+23.4</td></tr>
    <tr><td>452.9 Hz</td><td>+50 (a quarter-tone sharp)</td></tr>
  </tbody>
</table>
</div>
<p>Past 50 cents you're closer to the next semitone than to the one you started from, which is why tuning offsets are normally quoted in the range -50 to +50. A sample that reads 70 cents sharp is really 30 cents flat of the semitone above.</p>

<h2>Why would a sample be out of tune?</h2>
<p>A few common reasons:</p>
<ul>
  <li>Old recordings weren't always made to A440. Bands tuned to a piano or to each other, and tape machines didn't always run at exactly their rated speed. <a href="/blog/why-old-records-sound-out-of-tune/">Why old records sound out of tune</a> goes into the causes.</li>
  <li>Vinyl rips pick up the turntable's own speed error. A deck running slightly fast makes everything sharp.</li>
  <li>You repitched the sample to change its tempo, and the shift didn't land on a whole semitone. Taking a 90 BPM loop to 92 BPM by repitch raises it about 38 cents.</li>
  <li>Someone else's loop was made on a synth with its master tune nudged, or it went through tape or pitch-drift effects.</li>
</ul>

<h2>How do I find how many cents off a sample is?</h2>
<p>By ear: load a sine or a plain piano, play the sample's root note along with it, and turn the sampler's fine-tune until the beating (the slow wobble you hear when two nearly equal pitches play together) stops. The number on the knob is your offset, reversed. This works best on sustained notes and gets hard on dense material.</p>
<p>With a tuner: put a chromatic tuner plugin on the sample channel and watch it on a held note. Most show cents. They struggle with chords and drums, so solo a single note if you can find one.</p>
<p>With an analyser: drop the file on the <a href="/">keyandbpm analyser</a> and it reports the tuning as the Hz of A4 and cents from 440. It also reads the key against that tuning, so a sample 40 cents sharp doesn't get mistaken for the key a semitone up. The file is analysed in your browser and never uploaded.</p>

<h2>How do I pitch a sample in cents?</h2>
<p>Almost every sampler and audio clip has a fine-tune control in cents alongside the semitone transpose. In Ableton it's the Detune control on an audio clip, next to Transpose. Other DAWs and samplers call it fine, fine tune, cents or detune. Set it to the opposite of the offset: a sample measured at -20 cents gets +20, one at +14 gets -14.</p>
<p>Then check what mode the sampler is in. If it's repitching (changing speed with pitch), the fine-tune also nudges the tempo. Roughly 17 cents is 1%, so a 20-cent correction speeds a sample up by a little over 1%. On a short one-shot you'll never notice. On a four-bar loop that has to line up with your drums, it will drift. Either let the DAW warp it back to tempo or set the beat's tempo to the sample's new speed.</p>

<h2>Should I tune the sample or tune the beat?</h2>
<p>This is the choice most people skip, and the second option is often better.</p>
<p>Tuning the sample means processing it. If it's repitched, the tempo changes; if it's pitch-shifted with an algorithm, you pick up a little of the smearing that stretching always brings. On a busy, full-band sample, a tiny fine-tune of 10 or 20 cents is usually clean enough that nobody will ever hear it.</p>
<p>Tuning the beat means leaving the sample alone and moving everything you control instead. Your 808, synths and keys are MIDI and oscillators, and detuning them costs nothing. Most synths and samplers have a master tune or fine control; set every instrument to the sample's offset and the whole beat moves to the sample's tuning. I do this whenever the sample is the star of the beat, because it stays exactly as it sounded on the record.</p>
<p>The one case where that's a pain is when a vocalist will record over it. Singers can sing to any reference, but if the session later gets autotuned to A440, or someone adds a live instrument tuned to 440, you're back where you started. If the track will leave your studio, tune the sample to 440.</p>

<h2>When should you detune on purpose?</h2>
<p>Sometimes you want things a little off:</p>
<ul>
  <li><strong>Thickening.</strong> Layer two copies of a synth or sample, detune one by 5 to 15 cents, and they beat against each other for a wider, chorused sound. That's how supersaw patches work.</li>
  <li><strong>Lo-fi drift.</strong> Slowly wobbling pitch by a few cents (tape wow and flutter emulations do this) makes a clean loop feel old.</li>
  <li><strong>Matching a vibe.</strong> If every other element in the beat is sampled from records around the same flat tuning, keeping them all flat together works fine. What matters is that the parts agree with each other, not with 440.</li>
</ul>

<h2>How much out of tune is too much?</h2>
<p>There's no hard line, and it depends on the material. In my experience a sample a few cents off is inaudible in a mix, while 20 cents or more against a clean synth or a sustained 808 usually sounds wrong even to people who couldn't tell you why. Sustained, pure tones (sine 808s, pads, sub bass) show tuning problems the most. Short plucks and heavily distorted sounds hide them. When in doubt, solo the sample with the 808 and listen for beating on long notes.</p>
<p>If you're also moving the sample to a different key, do the whole-semitone shift first and the cents fix last. The steps for that are in <a href="/blog/how-to-match-a-sample-to-your-beat/">how to match a sample to your beat</a>, and if the 432 Hz debate has come up in your corner of the internet, <a href="/blog/a432-vs-a440/">432 Hz vs 440 Hz</a> explains what that tuning does and doesn't do.</p>
`,
  faq: [
    {
      q: "How many cents are in a semitone?",
      a: "100. An octave has 12 semitones, so it has 1,200 cents.",
    },
    {
      q: "How many cents is 432 Hz from 440 Hz?",
      a: "About 31.8 cents flat, from 1200 × log2(432 ÷ 440). That's roughly a third of a semitone.",
    },
    {
      q: "Does fine-tuning a sample change its tempo?",
      a: "Only if the sampler repitches, meaning pitch and speed move together. Then about 17 cents changes the speed by 1%. A warp or stretch mode keeps the tempo fixed.",
    },
    {
      q: "Can I just tune my 808 to the sample instead?",
      a: "Yes, and it's often the cleaner choice because the sample stays untouched. Set the 808 and every other synth to the same cents offset as the sample so they all agree.",
    },
    {
      q: "Why is my sample's key right but it still sounds off?",
      a: "It's probably tuned a fraction of a semitone away from A440, which semitone transposition can't fix. Measure its offset in cents and correct it with the fine-tune control.",
    },
  ],
  related: [
    "how-to-match-a-sample-to-your-beat",
    "why-old-records-sound-out-of-tune",
    "a432-vs-a440",
    "what-key-is-this-sample-in",
  ],
} satisfies Post;
