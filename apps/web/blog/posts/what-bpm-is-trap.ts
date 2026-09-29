import type { Post } from "../post.ts";

export default {
  slug: "what-bpm-is-trap",
  title: "What BPM is trap?",
  description:
    "Trap usually sits between 130 and 160 BPM, most often 140 to 150, but it feels like 65 to 80. Why both numbers are right and which one to set in your DAW.",
  published: "2026-09-29",
  answer:
    "Trap is usually made between 130 and 160 BPM, with 140 to 150 the most common range, but it feels half as fast (65 to 80 BPM) because the snare or clap lands only once per bar. Both numbers describe the same beat: a track at 140 is also a track at 70, so set your DAW to the double-time figure and count the groove at the half-time one.",
  body: `
<h2>What BPM is trap, in numbers?</h2>
<p>Ask ten producers and you'll hear "140" from most of them. That's the default most people load up when they start a trap beat, and it's a fine place to be. The wider convention looks like this, counted the way a DAW counts it:</p>
<div class="table-wrap">
<table>
<thead><tr><th>Style</th><th>Typical DAW tempo</th><th>How it feels (half-time)</th></tr></thead>
<tbody>
<tr><td>Slower, melodic trap</td><td>130 to 140</td><td>65 to 70</td></tr>
<tr><td>Standard Atlanta-style trap</td><td>140 to 150</td><td>70 to 75</td></tr>
<tr><td>Faster, more aggressive trap</td><td>150 to 165</td><td>75 to 82.5</td></tr>
<tr><td>EDM or festival trap</td><td>140 to 150</td><td>70 to 75</td></tr>
</tbody>
</table>
</div>
<p>These are conventions, not rules. Plenty of good records sit outside them. But if you're lost, 140 is where most of the genre lives and nobody will look at you funny for starting there.</p>

<h2>Why does trap feel like 70 when the session says 140?</h2>
<p>This is the part that confuses people, and it's also the reason BPM tools argue about trap more than almost any other genre.</p>
<p>In a typical trap beat at 140, the clap or snare hits once per bar, on beat 3. The hi-hats run in eighths or sixteenths, with rolls on top. So there are two clocks running at once:</p>
<ul>
<li>The hats and the grid say 140. Everything small and fast is locked to that.</li>
<li>The clap says 70. If you nod your head, you nod to the clap, and that's one nod every two beats at 140.</li>
</ul>
<p>Write the same pattern at 70 BPM with the clap on beats 2 and 4, then double every hi-hat subdivision, and you get an identical-sounding beat. Nothing changes except the number on the screen. That's the whole half-time idea. I explain it in more detail, with other genres, in <a href="/blog/why-is-my-bpm-half-or-double/">why your BPM reads half or double</a>.</p>
<p>My opinion: work at the double-time number (140, not 70). Hat rolls, triplets and 808 slides are much easier to draw when the grid is fine enough to hold them, and most sample packs and loop libraries label trap at the higher figure, so your loops will line up without a conversion.</p>

<h2>What makes a beat trap, apart from tempo?</h2>
<p>Tempo alone doesn't make trap. A 140 BPM beat with a straight backbeat is just a fast hip hop beat. The things that make people say "that's trap" are mostly in the drums and the low end.</p>
<h3>The 808</h3>
<p>The long, tuned bass drum from the Roland TR-808 carries both the kick and the bassline. It's pitched, so it has a key, and it often glides between notes. Because the 808 is the bass, it's usually the first thing that clashes when a melody is in the wrong key. I tune the 808 to the melody's key before I touch anything else in the low end.</p>
<h3>The hi-hats</h3>
<p>Hats are where trap shows off. Steady eighths or sixteenths, then rolls into 32nds, triplet bursts, and pitch-bent rolls that climb or fall. This is the busiest layer and the reason trap sounds fast even though it grooves slow.</p>
<h3>The clap on 3</h3>
<p>One clap or snare per bar, on beat 3 at the 140 count. Often layered, sometimes with a short ghost hit before it. That single hit is what gives trap its half-time weight.</p>
<h3>Sparse kicks</h3>
<p>Kicks (or 808 hits doubling as kicks) are placed off the grid's strong beats a lot of the time, syncopated against the clap. There's a lot of space in a trap bar, and the space is on purpose.</p>

<h2>Where did trap come from?</h2>
<p>Trap grew out of Atlanta rap in the late 1990s and early 2000s. The word came from the "trap house," and the lyrics were about that life before the name meant a drum sound. T.I.'s 2003 album <em>Trap Muzik</em> is the usual reference point for when the word stuck. Memphis rap from the 1990s fed into it too, with its dark, 808-heavy tapes.</p>
<p>Producers like DJ Toomp, Shawty Redd and Zaytoven shaped the early sound. Around 2010, Lex Luger's big, orchestral, hat-heavy beats became the template a lot of people copied, and in the years after, producers like Metro Boomin and Southside pushed it into the pop charts. Around 2012, dance music producers took the drum language and made "EDM trap," which kept the half-time feel and the rolls but swapped the rap focus for big drops.</p>
<p>The tempo has stayed surprisingly stable through all of it. What changed is the sound palette, the mix (808s got louder and longer) and how busy the hats got.</p>

<h2>How do I find the BPM of a trap song?</h2>
<p>You've got a few honest options, and I use all of them depending on what's nearby.</p>
<ol>
<li>Count the claps. Tap along to the clap for 15 seconds, multiply by 4. You'll get the half-time figure, around 70. Double it for the DAW number. <a href="/blog/how-to-tap-tempo/">Tap tempo</a> works well on trap because the clap is loud and regular.</li>
<li>Drop it in your DAW. Most DAWs will detect tempo on import. Check the result against the grid by ear; if the claps line up on every other bar line, the DAW picked the half-time number.</li>
<li>Use a detector. The <a href="/">analyser on this site</a> reads the file in your browser and shows the BPM with a confidence figure and a beat grid under the waveform. Press play and watch whether the marks fall on every hat pulse or every clap.</li>
</ol>
<p>Whichever tool you use, expect it to sometimes hand you 70-something instead of 140-something, or the other way round. Neither is a mistake. If you know the genre is trap and the number is under 100, double it. If it's over 170 and the track is clearly a slow, heavy trap beat, halve it. If a reading still looks odd, trust the clap and your ears over the screen.</p>

<h2>What BPM should I make my trap beat?</h2>
<p>Start from the energy you want, then pick the number.</p>
<ul>
<li>For a melodic, sung-over beat with room for long vocal lines, try 130 to 140. The half-time pulse (65 to 70) leaves a lot of space.</li>
<li>For a standard rap beat with room for fast flows, 140 to 150. Triplet flows sit nicely here.</li>
<li>For something more aggressive and rushed, push towards 155 to 165. At that speed, the hats start to blur together and the energy gets louder even at the same volume.</li>
</ul>
<p>I'd also say: don't agonise over 142 versus 144. Your listener can't hear two BPM. What they hear is how the hats and the 808 sit against the clap.</p>

<h2>Does trap use swing?</h2>
<p>Less than older hip hop. Most trap hats are straight on the grid, and the movement comes from rolls, triplets and velocity changes, not from shuffling every other note. Some producers add a small amount of swing to the hats to loosen them up, and that's a taste thing. If you want to hear the opposite approach, the swung, pushed-and-pulled drums of <a href="/blog/what-bpm-is-boom-bap/">boom bap</a> are a good contrast. Drill, trap's close relative, keeps the tempo but changes the drum placement completely; see <a href="/blog/what-bpm-is-drill/">what BPM drill is</a>.</p>
`,
  faq: [
    {
      q: "Is trap 70 or 140 BPM?",
      a: "Both. The clap lands once per bar at 140, so the groove feels like 70. Most producers set the DAW to 140 so the hi-hat rolls fit the grid.",
    },
    {
      q: "Why does my BPM detector say 72 for a trap song?",
      a: "It locked onto the clap instead of the hi-hats. Double the number to get the figure most producers would use, in this case 144.",
    },
    {
      q: "What BPM is EDM trap?",
      a: "EDM or festival trap usually sits around 140 to 150 BPM, with the same half-time drop feel as rap trap. The difference is in the sound design and arrangement, not the tempo.",
    },
    {
      q: "Can a trap beat be 100 BPM?",
      a: "Nothing stops you, but with one clap per bar the groove would feel like 50 BPM, slower than almost anything people call trap. If you want that slow, heavy feel, most producers get it at 130 to 140 instead.",
    },
    {
      q: "Do I need to know the key of a trap beat?",
      a: "Yes, mainly because the 808 is tuned. If the 808 notes and the melody disagree, the low end sounds muddy or sour, so match the 808 to the key of the melody.",
    },
  ],
  related: ["why-is-my-bpm-half-or-double", "what-bpm-is-drill", "how-to-find-the-bpm-of-a-song", "best-keys-for-beats"],
} satisfies Post;
