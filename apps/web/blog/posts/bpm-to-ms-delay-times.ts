import type { Post } from "../post.ts";

export default {
  slug: "bpm-to-ms-delay-times",
  title: "How to time delay and reverb to the BPM, with a tempo chart",
  description:
    "Which delay and reverb times suit a song's tempo: dotted eighths, triplets, pre-delay and decay, with a chart for common BPMs and the formula behind it.",
  published: "2026-09-29",
  answer:
    "Divide 60,000 by the BPM to get one beat (a quarter note) in milliseconds. At 120 BPM that's 500 ms, so an eighth note is 250 ms, a dotted eighth 375 ms, an eighth-note triplet 166.7 ms and a sixteenth 125 ms. For an LFO synced to quarter notes, the rate in Hz is BPM divided by 60. For any other tempo, the BPM to milliseconds calculator on this site works every value out.",
  body: `
<p>Most plugins will sync to your DAW's tempo for you, and when they do, use that. The maths is for everything else: hardware delays, pedals with a tap button you can't be bothered to hit in time, reverbs with pre-delay in milliseconds, and plugins that only take Hz. To skip the maths, type the tempo into the <a href="/bpm-to-ms/">BPM to milliseconds calculator</a>.</p>

<h2>How do you convert BPM to milliseconds?</h2>
<p>A minute is 60,000 milliseconds, and BPM tells you how many beats fit in it. So one beat lasts:</p>
<pre><code>quarter note (ms) = 60000 / BPM</code></pre>
<p>Everything else is that number multiplied by a fraction:</p>
<ul>
<li>Whole note (one bar of 4/4): × 4</li>
<li>Half note: × 2</li>
<li>Dotted quarter: × 1.5</li>
<li>Quarter-note triplet: × 2/3</li>
<li>Eighth note: × 1/2</li>
<li>Dotted eighth: × 3/4</li>
<li>Eighth-note triplet: × 1/3</li>
<li>Sixteenth note: × 1/4</li>
<li>Thirty-second note: × 1/8</li>
</ul>
<p>Dotted means one and a half times as long. Triplet means three in the space of two, so a triplet eighth is two thirds of a straight eighth.</p>

<h2>BPM to ms chart for delay times</h2>
<p>All values are in milliseconds, rounded to one decimal place. The last two columns are LFO rates in Hz for a quarter-note and eighth-note cycle.</p>
<div class="table-wrap">
<table>
<thead><tr><th>BPM</th><th>1/4</th><th>1/8</th><th>Dotted 1/8</th><th>1/8 triplet</th><th>1/16</th><th>1 bar</th><th>1/4 in Hz</th><th>1/8 in Hz</th></tr></thead>
<tbody>
<tr><td>60</td><td>1000.0</td><td>500.0</td><td>750.0</td><td>333.3</td><td>250.0</td><td>4000.0</td><td>1.00</td><td>2.00</td></tr>
<tr><td>70</td><td>857.1</td><td>428.6</td><td>642.9</td><td>285.7</td><td>214.3</td><td>3428.6</td><td>1.17</td><td>2.33</td></tr>
<tr><td>75</td><td>800.0</td><td>400.0</td><td>600.0</td><td>266.7</td><td>200.0</td><td>3200.0</td><td>1.25</td><td>2.50</td></tr>
<tr><td>80</td><td>750.0</td><td>375.0</td><td>562.5</td><td>250.0</td><td>187.5</td><td>3000.0</td><td>1.33</td><td>2.67</td></tr>
<tr><td>85</td><td>705.9</td><td>352.9</td><td>529.4</td><td>235.3</td><td>176.5</td><td>2823.5</td><td>1.42</td><td>2.83</td></tr>
<tr><td>90</td><td>666.7</td><td>333.3</td><td>500.0</td><td>222.2</td><td>166.7</td><td>2666.7</td><td>1.50</td><td>3.00</td></tr>
<tr><td>95</td><td>631.6</td><td>315.8</td><td>473.7</td><td>210.5</td><td>157.9</td><td>2526.3</td><td>1.58</td><td>3.17</td></tr>
<tr><td>100</td><td>600.0</td><td>300.0</td><td>450.0</td><td>200.0</td><td>150.0</td><td>2400.0</td><td>1.67</td><td>3.33</td></tr>
<tr><td>110</td><td>545.5</td><td>272.7</td><td>409.1</td><td>181.8</td><td>136.4</td><td>2181.8</td><td>1.83</td><td>3.67</td></tr>
<tr><td>120</td><td>500.0</td><td>250.0</td><td>375.0</td><td>166.7</td><td>125.0</td><td>2000.0</td><td>2.00</td><td>4.00</td></tr>
<tr><td>124</td><td>483.9</td><td>241.9</td><td>362.9</td><td>161.3</td><td>121.0</td><td>1935.5</td><td>2.07</td><td>4.13</td></tr>
<tr><td>128</td><td>468.8</td><td>234.4</td><td>351.6</td><td>156.3</td><td>117.2</td><td>1875.0</td><td>2.13</td><td>4.27</td></tr>
<tr><td>130</td><td>461.5</td><td>230.8</td><td>346.2</td><td>153.8</td><td>115.4</td><td>1846.2</td><td>2.17</td><td>4.33</td></tr>
<tr><td>140</td><td>428.6</td><td>214.3</td><td>321.4</td><td>142.9</td><td>107.1</td><td>1714.3</td><td>2.33</td><td>4.67</td></tr>
<tr><td>150</td><td>400.0</td><td>200.0</td><td>300.0</td><td>133.3</td><td>100.0</td><td>1600.0</td><td>2.50</td><td>5.00</td></tr>
<tr><td>160</td><td>375.0</td><td>187.5</td><td>281.3</td><td>125.0</td><td>93.8</td><td>1500.0</td><td>2.67</td><td>5.33</td></tr>
<tr><td>170</td><td>352.9</td><td>176.5</td><td>264.7</td><td>117.6</td><td>88.2</td><td>1411.8</td><td>2.83</td><td>5.67</td></tr>
<tr><td>174</td><td>344.8</td><td>172.4</td><td>258.6</td><td>114.9</td><td>86.2</td><td>1379.3</td><td>2.90</td><td>5.80</td></tr>
</tbody>
</table>
</div>
<p>If your track isn't on a round number, plug the exact tempo into the formula. At 92.94 BPM a quarter note is 645.6 ms and an eighth is 322.8 ms. Rounding the tempo to 93 first would put you under half a millisecond out per quarter, which you won't hear, but there's no reason to do it.</p>

<h2>What delay time should I use?</h2>
<p>Opinions here, from a lot of hours spent turning delay knobs:</p>
<ul>
<li>The eighth-note delay is the safe one. It fills gaps without changing the rhythm much, which is why it sits under so many vocals.</li>
<li>The dotted eighth is the classic rhythmic delay. Against straight eighths it creates a syncopated pattern that sounds busier than what you actually played. Great on guitar and plucks, messy on a dense vocal.</li>
<li>A quarter note works on sparse parts and slow tempos. At 70 BPM that's 857 ms, long enough to hear as a distinct echo.</li>
<li>Triplet delays make straight parts swing slightly. They suit R&B and hip hop hats or ad-libs.</li>
<li>Sixteenths are almost a doubling effect at faster tempos. At 174 BPM a sixteenth is 86.2 ms, short enough to thicken rather than echo.</li>
</ul>
<p>I usually set the time from the chart, then move it a few milliseconds by ear. Slightly shorter than the grid feels like it's pushing; slightly longer feels lazy. Neither is wrong.</p>

<h2>How do I set reverb pre-delay and decay to the tempo?</h2>
<p>Pre-delay is the gap before the reverb starts. A short pre-delay keeps the dry sound in front and the reverb behind it. Tempo-based values that work well are a 1/64 or 1/32 note. At 120 BPM that's about 31.3 ms and 62.5 ms; at 90 BPM, 41.7 ms and 83.3 ms. Past about 100 ms the gap starts to sound like a separate echo, which can be a nice effect but changes the feel.</p>
<p>For decay, a simple rule of thumb is to let the tail die away before the next important hit. On a snare in a 90 BPM beat, the next snare is a half note later (1333.3 ms), so a decay somewhere under that keeps the backbeat clean. On a pad you can let it run for a bar or more. Reverb decay times are usually measured as the time for the tail to fall by 60 dB, so the audible tail is often shorter than the number on the dial. Trust your ears over the maths here.</p>

<h2>How do I convert BPM to Hz for an LFO?</h2>
<p>Hz means cycles per second, so it's the reverse of milliseconds:</p>
<pre><code>Hz = 1000 / (length in ms)
quarter-note LFO (Hz) = BPM / 60
eighth-note LFO (Hz) = BPM / 30
one-bar LFO in 4/4 (Hz) = BPM / 240</code></pre>
<p>So at 120 BPM a quarter-note tremolo is 2 Hz, an eighth-note wobble is 4 Hz and a one-bar filter sweep is 0.5 Hz. Many older synths and pedals only show Hz, and some only show a knob with no numbers at all, in which case you set it by ear against a click.</p>

<h2>Does half-time or double-time change the delay?</h2>
<p>Yes, and this trips people up. If your DAW is at 140 but the track feels like 70, then a "quarter note" in the DAW is an eighth note in the groove you're hearing. The delay is still in time either way, it's just a different subdivision from the one you had in mind. Read the tempo the way your project is set, not the way the track feels. <a href="/blog/why-is-my-bpm-half-or-double/">Why your BPM reads half or double</a> explains the mix-up.</p>

<h2>What if I don't know the BPM?</h2>
<p>You need the tempo first. Tap it in your DAW, use the tap button on a delay pedal, or check the project settings if it's your own session. For a finished track or a sample, drop it on the <a href="/">keyandbpm analyser</a>. It gives a BPM figure with a confidence value and a beat grid you can play against, then you can read your delay times off the chart above, or type it into the <a href="/bpm-to-ms/">BPM to ms calculator</a> for tempos the chart skips. <a href="/blog/how-to-find-the-bpm-of-a-song/">How to find the BPM of a song</a> and <a href="/blog/how-to-tap-tempo/">how to tap tempo</a> cover the other ways in more detail.</p>
<p>One caution with samples: if you repitch a sample to match your beat, its tempo changes too, so measure it again after the change rather than using the original number.</p>
`,
  faq: [
    {
      q: "How many milliseconds is a quarter note at 120 BPM?",
      a: "500 ms. An eighth is 250 ms, a dotted eighth is 375 ms and a sixteenth is 125 ms.",
    },
    {
      q: "What is the formula for BPM to ms?",
      a: "Divide 60,000 by the BPM to get a quarter note in milliseconds. Multiply that by 0.5 for an eighth, 0.75 for a dotted eighth, 1/3 for an eighth triplet or 0.25 for a sixteenth.",
    },
    {
      q: "How do I calculate a dotted eighth delay?",
      a: "Multiply the quarter-note time by 0.75, which is the same as 45,000 divided by the BPM. At 100 BPM that's 450 ms.",
    },
    {
      q: "How do I work out a triplet delay time?",
      a: "An eighth-note triplet is a third of a quarter note, or 20,000 divided by the BPM. At 90 BPM that's 222.2 ms.",
    },
    {
      q: "How do I sync an LFO in Hz to the tempo?",
      a: "Divide the BPM by 60 for one cycle per quarter note, or by 30 for one per eighth note. At 128 BPM those are about 2.13 Hz and 4.27 Hz.",
    },
  ],
  related: ["how-to-find-the-bpm-of-a-song", "how-to-tap-tempo", "why-is-my-bpm-half-or-double", "drum-and-bass-bpm"],
} satisfies Post;
