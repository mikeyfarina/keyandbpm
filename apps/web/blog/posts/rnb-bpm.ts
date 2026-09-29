import type { Post } from "../post.ts";

export default {
  slug: "rnb-bpm",
  title: "What BPM is R&B? Typical tempos by style",
  description:
    "Most R&B sits between 60 and 110 BPM. Typical tempos for slow jams, neo-soul, new jack swing and trap-soul, plus why your BPM reader says 140.",
  published: "2026-09-29",
  answer:
    "Most R&B sits between 60 and 110 BPM. Slow jams and ballads usually land around 60 to 80 BPM, mid-tempo grooves around 85 to 100, and uptempo or dance-leaning R&B around 100 to 125. Modern trap-influenced R&B is often programmed at 120 to 150 BPM with a half-time feel, so it sounds like 60 to 75.",
  body: `
<p>Those ranges are conventions, not rules. R&B covers everything from a four-minute ballad with a live band to a sparse trap-soul record built in an afternoon, and the tempos follow the feel of the song more than any genre handbook. Still, if you're starting a beat or checking a track you pulled, the numbers below are where most records end up.</p>

<h2>What BPM is R&B usually?</h2>
<p>Here's how I'd break it down by style. Treat each range as the middle of the road, with plenty of good records sitting outside it.</p>
<div class="table-wrap">
<table>
<thead><tr><th>Style</th><th>Typical BPM</th><th>What it feels like</th></tr></thead>
<tbody>
<tr><td>Slow jam, ballad</td><td>60 to 80</td><td>Lots of space, long vocal runs</td></tr>
<tr><td>Neo-soul</td><td>70 to 95</td><td>Laid back, often behind the beat</td></tr>
<tr><td>Mid-tempo contemporary R&B</td><td>85 to 100</td><td>Head-nod pocket, close to hip hop</td></tr>
<tr><td>New jack swing</td><td>95 to 115</td><td>Swung drum machine, dance steps</td></tr>
<tr><td>Trap-soul, alternative R&B</td><td>60 to 75 felt (120 to 150 on the grid)</td><td>Half-time drums, fast hats</td></tr>
<tr><td>Uptempo, dance-leaning R&B</td><td>100 to 125</td><td>Four-on-the-floor or bouncy, made for clubs</td></tr>
</tbody>
</table>
</div>
<p>If you only remember one thing: slow R&B lives in the 60s and 70s, and the grooves you'd call mid-tempo sit around 90.</p>

<h2>Why does R&B feel slower than its BPM?</h2>
<p>Because the snare is doing the talking. Most R&B puts the backbeat (snare or clap) on beats 2 and 4, and at 65 BPM those hits are almost two seconds apart. That's a lot of air. The hats and percussion fill it with sixteenths, triplets and rolls, which is why a slow jam can feel busy and relaxed at the same time.</p>
<p>Half-time programming makes this even more confusing. A lot of modern R&B is made in a DAW set to 130 or 140 with the snare only on beat 3 of each bar. At 140, that snare comes around once every 1.7 seconds, exactly the same as a 70 BPM track with the snare on 2 and 4. Same record, two honest ways to count it.</p>

<h2>Is my R&B track 70 BPM or 140 BPM?</h2>
<p>Both answers describe the same audio, so pick the one that matches how people will use it. My rule: count where the main snare or clap lands. If it hits twice a bar and you're counting 1-2-3-4 comfortably around it, you've got the felt tempo. For most R&B that's the lower number.</p>
<p>DJs and producers disagree on this constantly, and software does too. A tempo detector hears the hats as well as the snare, so it will often report the double-time figure. That isn't wrong, just a different grid. There's a full breakdown in <a href="/blog/why-is-my-bpm-half-or-double/">why your BPM reads half or double</a>.</p>
<p>A practical tip if you're making beats: whichever you choose, set your DAW to that tempo and stick with it for the session. Flipping between 70 and 140 halfway through makes every delay, LFO and quantise setting wrong at once.</p>

<h2>How does swing change the tempo?</h2>
<p>It doesn't change the BPM at all, but it changes how the tempo feels and how easy it is to measure. New jack swing is the obvious example: the drum machine pushes every second sixteenth late, so the groove bounces. Neo-soul goes further, with drums that drag behind the grid on purpose.</p>
<p>Swing is also why tapping along to R&B is harder than tapping along to house. Your finger wants to follow the late notes. Tap on the snare only and you'll get a steadier number. More on that in <a href="/blog/how-to-tap-tempo/">how to tap tempo (and when it lies)</a>.</p>

<h2>What BPM should I make an R&B beat at?</h2>
<p>This part is opinion. I usually start slow ballad ideas around 68 to 72 and mid-tempo ones around 88 to 94, then move it by a few BPM once a vocal or a topline exists. The singer decides, really. A melismatic vocal needs room between the kicks, and a tempo that feels perfect with just drums can feel rushed once someone's actually singing over it.</p>
<p>A few things that help:</p>
<ul>
<li>Sing or hum the hook at the tempo before you commit. If you're gasping, slow down.</li>
<li>Program the hats last. A sparse pattern at 75 can feel slower than a busy one at 68.</li>
<li>If you're going for trap-soul, set the DAW to double (say 140) so hat rolls and triplets are easy to draw, and keep the snare on beat 3.</li>
<li>For uptempo R&B aimed at DJs, a tempo that blends with house or hip hop sets (around 100, or 120 to 125) makes the record easier to play out.</li>
</ul>
<p>Key matters as much as tempo for a vocal record. If you're still choosing one, <a href="/blog/best-keys-for-beats/">what key to make your beat in</a> covers vocal range and the keys that sit well on keys and guitar.</p>

<h2>How to find the BPM of an R&B song</h2>
<p>You have a few free options, and they're all fine:</p>
<ol>
<li>Tap along on the snare with a tap tempo tool or your DAW's tap button, for at least eight bars.</li>
<li>Drop the audio in your DAW, turn on the metronome, and nudge the project tempo until the clicks sit on the snare. Most DAWs will also estimate tempo on import.</li>
<li>Drop the file on the <a href="/">keyandbpm analyser</a>. It gives a BPM with a confidence figure and draws a beat grid under the waveform, so you can press play and hear whether the marks line up. It runs in the browser, so the file never leaves your machine.</li>
</ol>
<p>Whatever tool you use, sanity check the answer against your ears. If it says 142 and the song is obviously a slow jam, halve it. The walkthrough in <a href="/blog/how-to-find-the-bpm-of-a-song/">how to find the BPM of a song</a> goes through each method in more detail.</p>

<h2>Does R&B tempo drift?</h2>
<p>Older R&B cut with a live drummer often moves by a BPM or two across a song, pushing into choruses and settling in verses. That's part of the feel, and it's why a single BPM figure for a 70s or early 80s soul record is an average. If you're sampling one of those, expect to warp it or chop it into short sections rather than lock the whole thing to a grid. Drum machine R&B from the late 80s onward is usually rock steady.</p>
`,
  faq: [
    {
      q: "What BPM is a slow jam?",
      a: "Most slow jams sit around 60 to 80 BPM, counted with the snare on beats 2 and 4. Some tools will report the same songs at 120 to 160 because they count the double-time grid.",
    },
    {
      q: "Is 90 BPM R&B or hip hop?",
      a: "It can be either. Around 85 to 100 BPM is common ground for mid-tempo R&B and a lot of hip hop, and the difference comes from the drums, the chords and the vocal, not the tempo.",
    },
    {
      q: "What BPM is trap soul?",
      a: "Trap-soul is usually programmed at about 120 to 150 BPM with the snare on beat 3, so it feels like 60 to 75. Either number is a fair description of the same track.",
    },
    {
      q: "Why does my BPM detector say 140 for a slow R&B song?",
      a: "The detector is counting the hi-hats or the double-time grid rather than the snare. Halve the number if the song feels slow, and check it by tapping along to the snare.",
    },
    {
      q: "What BPM is new jack swing?",
      a: "New jack swing usually runs around 95 to 115 BPM with heavily swung sixteenths. The swing makes it feel bouncier than a straight beat at the same tempo.",
    },
  ],
  related: ["how-to-find-the-bpm-of-a-song", "why-is-my-bpm-half-or-double", "what-bpm-is-trap", "lofi-hip-hop-bpm-and-key"],
} satisfies Post;
