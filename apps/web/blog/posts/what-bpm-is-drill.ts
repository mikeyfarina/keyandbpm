import type { Post } from "../post.ts";

export default {
  slug: "what-bpm-is-drill",
  title: "What BPM is drill? UK, Chicago and New York drill tempos",
  description:
    "UK and New York drill mostly sit at 138 to 145 BPM; Chicago drill is slower. How drill differs from trap at the same tempo, and why detectors read it as 70.",
  published: "2026-09-29",
  answer:
    "Most UK and New York drill is made at about 138 to 145 BPM, with 140 as the usual default, and it feels like 69 to 72.5 because of the half-time snare. Chicago drill, where the genre started, tends to be slower and darker, commonly felt around 60 to 70 BPM (120 to 140 on a DAW's double-time count).",
  body: `
<h2>What BPM is drill?</h2>
<p>If you only remember one number, remember 140. It's the tempo most UK drill producers open a session at, and New York drill, which borrowed UK drill's drums, stays close to it. Here's the rough map, with the caveat that these are habits producers share, not rules anyone enforces:</p>
<div class="table-wrap">
<table>
<thead><tr><th>Scene</th><th>Typical DAW tempo</th><th>Half-time feel</th><th>What stands out</th></tr></thead>
<tbody>
<tr><td>Chicago drill (early 2010s)</td><td>120 to 140</td><td>60 to 70</td><td>Dark, sparse, trap-derived drums</td></tr>
<tr><td>UK drill</td><td>138 to 145</td><td>69 to 72.5</td><td>Sliding 808s, shuffled snares</td></tr>
<tr><td>Brooklyn drill</td><td>138 to 145</td><td>69 to 72.5</td><td>UK drums, heavier and louder 808s</td></tr>
<tr><td>Bronx sample drill</td><td>around 140 to 145</td><td>around 70 to 72.5</td><td>Flipped R&amp;B and pop samples</td></tr>
</tbody>
</table>
</div>

<h2>Is drill the same tempo as trap?</h2>
<p>Pretty much, yes. Both live around 140, both feel like 70, both lean on 808s. If you set the tempo and stop there, you haven't made either one.</p>
<p>The difference is in where the drums go. In trap, the clap lands once per bar on beat 3 and stays put, and the fireworks happen in the hi-hats. Drill keeps a snare around that same spot but surrounds it with extra snares that move from bar to bar, so the backbeat feels like it's stumbling forward. The hats are sparser and often grouped in triplets, which gives the pattern a lopsided bounce. Put a trap pattern and a drill pattern next to each other at the same tempo and they don't sound alike at all.</p>
<p>For trap's own tempo ranges and history, see <a href="/blog/what-bpm-is-trap/">what BPM trap is</a>.</p>

<h2>Why does my BPM finder say drill is 70?</h2>
<p>Same reason it does for trap. A beat tracker looks for the strongest regular pulse. In drill, that's often the snare, which returns every two beats at 140. The tool counts those as beats and reports 70-ish. It isn't wrong; it picked the other of two valid readings.</p>
<p>Drill makes this worse than trap in one specific way: the snares move. When the extra snares shift around, a detector has a harder time deciding which hits are "the beat," and you'll see lower confidence figures and the occasional odd reading. If you get something like 93 or 105 on a drill track, that's usually the tool grabbing onto a triplet pattern in the hats rather than the real pulse. I'd trust your ears over the number there.</p>
<p>The fix is simple. If the track is drill and the reading is around 70, double it. If it's around 280, halve it. The full explanation of why tempo tools pick the wrong multiple is in <a href="/blog/why-is-my-bpm-half-or-double/">why your BPM reads half or double</a>.</p>
<p>The <a href="/">analyser here</a> shows a beat grid under the waveform, so you can press play and see whether the marks fall on every snare or every hat. That settles it faster than arguing with the number.</p>

<h2>How did drill start in Chicago?</h2>
<p>Drill started on the South Side of Chicago in the early 2010s. Chief Keef's early records, with production from Young Chop, are the usual reference point for when it broke out beyond the city. "Drill" was local slang before it was a genre name.</p>
<p>Musically, Chicago drill came out of trap: 808s, rolling hats, a half-time clap. What set it apart was the mood. The beats were colder and more stripped back, often built on dark synth pads or bells, with a flat, menacing delivery on top. The drums were closer to trap than to what UK drill later became, so if you want the Chicago sound, start from a trap pattern, slow it down, and take things away.</p>

<h2>What makes UK drill different?</h2>
<p>UK drill came out of South London around 2012 to 2014. Producers there took the Chicago attitude and rebuilt the drums, partly with ideas from UK rap and grime, which already had its own 140 BPM habit.</p>
<h3>The sliding 808</h3>
<p>This is the sound most people recognise first. The 808 notes glide from one pitch to the next, often jumping an octave or sliding between notes of the scale. That means the 808 is playing a real bassline in a real key, so tuning matters. If the slide lands between two notes of the key, it sounds wrong in a way that's hard to un-hear.</p>
<h3>The snare pattern</h3>
<p>There's a main snare near beat 3 of the bar, as in trap, plus one or two extra snares placed late in the bar or just before the next strong beat, and they don't always repeat exactly. That's where the forward-leaning, slightly off-balance swing comes from. Copying one drill snare pattern and looping it for three minutes is the fastest way to make a beat that sounds like a drill tutorial.</p>
<h3>Triplet hats and a bit of swing</h3>
<p>Hats are often sparse and grouped in triplets, with gaps, rather than trap's constant sixteenths. Many producers add swing to the hats, which loosens the grid and pushes the groove further from trap.</p>
<h3>Minor keys and dark melodies</h3>
<p>Drill melodies are mostly minor, often built on piano, strings, bells or choir samples. Minor-key melodies with a gliding bass are the whole emotional tone of the genre.</p>

<h2>How is New York drill different?</h2>
<p>Brooklyn drill took off around 2019. Pop Smoke is the name most people connect it with, and several of the early Brooklyn records were produced by UK drill producers, which is why the drums sound so close to London's. The New York version tends to hit harder in the low end, with bigger, more distorted 808s and a rougher vocal style.</p>
<p>A few years later, the Bronx produced "sample drill": UK-style drums under flipped samples from R&amp;B, pop and old hits, often sped up or chopped. If that's what you're making, the sampling side matters as much as the drums. Getting a sample to sit at 140 without mangling its key is its own job, covered in <a href="/blog/how-to-match-a-sample-to-your-beat/">how to fit a sample's key and tempo to your beat</a>, and <a href="/blog/how-to-flip-a-sample/">how to flip a sample</a> goes into chopping and rearranging it.</p>

<h2>What BPM should I make a drill beat?</h2>
<p>My advice: open at 140 and only move if the vocal asks for it. A few BPM either side is fine. Rappers who use a lot of triplet flows sometimes like 142 to 145. If you're going for the Chicago sound, try something around 130 counted in double time, and strip the drums back.</p>
<p>Before you worry about tempo, get the 808 in key. Find the key of your melody or sample first (by ear, on a keyboard, or with a detector), then tune the 808 slides to notes in that key. That single step does more for a drill beat than any number of BPM tweaks.</p>
`,
  faq: [
    {
      q: "Is UK drill 140 BPM?",
      a: "Usually, give or take a few BPM. Most UK drill is made between about 138 and 145, and 140 is the common starting point.",
    },
    {
      q: "What BPM is Chicago drill?",
      a: "Chicago drill is generally slower than UK drill, often felt around 60 to 70 BPM, which a DAW would show as roughly 120 to 140. The drums are closer to trap, with less of the UK snare shuffle.",
    },
    {
      q: "Why does drill sound different from trap at the same BPM?",
      a: "The drum placement. Trap keeps one steady clap per bar with busy hats, while drill adds moving extra snares, sparser triplet hats and sliding 808 basslines.",
    },
    {
      q: "My detector gave a weird BPM like 105 for a drill track. Why?",
      a: "Drill's triplet hats and shifting snares can make a beat tracker lock onto the wrong pulse. Tap along to the main snare, double what you count, and you should land near 140.",
    },
    {
      q: "What key is drill usually in?",
      a: "There is no single drill key, but most drill is in a minor key. What matters more is that the sliding 808 stays on notes of whatever key the melody uses.",
    },
  ],
  related: ["why-is-my-bpm-half-or-double", "what-bpm-is-trap", "how-to-match-a-sample-to-your-beat", "how-to-flip-a-sample"],
} satisfies Post;
