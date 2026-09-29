import type { Post } from "../post.ts";

export default {
  slug: "house-and-techno-bpm",
  title: "What BPM are house and techno?",
  description:
    "House usually runs 118 to 130 BPM and techno 125 to 150. Subgenre tempos, how to mix between them, and why a detector sometimes reads 64 on a 128 track.",
  published: "2026-09-29",
  answer:
    "House music usually runs from 118 to 130 BPM, with 120 to 128 the most common range. Techno usually runs from 125 to 140 BPM, and harder modern techno often goes to 140 to 150 or faster. Both use a four-on-the-floor kick, one per beat, so the tempo you hear is normally the tempo a detector reports.",
  body: `
<h2>What BPM is house music?</h2>
<p>House mostly lives between 118 and 130 BPM. If you walked into a club playing house and guessed 124, you'd be close more often than not. Different styles sit in different corners of that range, and these are habits, not borders:</p>
<div class="table-wrap">
<table>
<thead><tr><th>Style</th><th>Typical BPM</th></tr></thead>
<tbody>
<tr><td>Deep house</td><td>118 to 124</td></tr>
<tr><td>Classic Chicago house</td><td>118 to 128</td></tr>
<tr><td>Disco-leaning and French house</td><td>118 to 126</td></tr>
<tr><td>Tech house</td><td>124 to 128</td></tr>
<tr><td>Progressive house</td><td>122 to 130</td></tr>
<tr><td>Big-room and festival house</td><td>126 to 130</td></tr>
</tbody>
</table>
</div>

<h2>What BPM is techno?</h2>
<p>Techno starts where house tops out and keeps going. Detroit techno and a lot of its descendants sit roughly between 125 and 135. The Berlin-style warehouse sound often pushes 130 to 140. Harder techno, which has grown a lot in the last several years, regularly runs 140 to 150 and past it.</p>
<div class="table-wrap">
<table>
<thead><tr><th>Style</th><th>Typical BPM</th></tr></thead>
<tbody>
<tr><td>Minimal and dub techno</td><td>120 to 130</td></tr>
<tr><td>Detroit techno</td><td>125 to 135</td></tr>
<tr><td>Peak-time and warehouse techno</td><td>128 to 140</td></tr>
<tr><td>Hard techno</td><td>140 to 155</td></tr>
</tbody>
</table>
</div>
<p>There's real overlap. A 127 BPM track could be house or techno; the sound decides, not the number. House tends to be warmer, with swing, chords, vocals and disco in its DNA. Techno tends to be more mechanical and repetitive, and cares more about texture and tension than about songs.</p>

<h2>Where did house and techno come from?</h2>
<p>House came out of Chicago in the early and mid 1980s. The name is usually traced to the Warehouse club, where Frankie Knuckles played. DJs there were stretching disco records and mixing them with drum machines, and producers started making their own tracks from the same pieces: a steady kick, handclaps, piano or synth chords, and often a vocal.</p>
<p>Techno came from Detroit around the same time. Juan Atkins, Derrick May and Kevin Saunderson, often called the Belleville Three, took influences from European electronic music and funk and made something colder and more futuristic.</p>
<p>The hardware shaped both. The Roland TR-808 and TR-909 drum machines gave house and techno their kicks, claps and hats, and the Roland TB-303 bass synth gave acid house its squelch. Those machines held a perfectly steady tempo, which is part of why dance music became the genre where BPM matters to the decimal.</p>

<h2>What does four-on-the-floor mean for BPM detection?</h2>
<p>Four-on-the-floor means a kick drum on every beat: one, two, three, four. It's the heartbeat of both genres, and it makes BPM detection much easier than in hip hop, because the loudest regular event in the track is also the beat.</p>
<p>So for most house and techno, the number you get from a detector is the number you'd count. Where it goes wrong:</p>
<ul>
<li>Beatless intros and breakdowns. A 90-second ambient intro gives a detector nothing to lock onto. Analysing the whole track usually fixes this, because the kick comes back.</li>
<li>Half-time breakdowns. Some tracks drop the kick and play a half-time pattern for a while. A tool that weighs that section heavily may report 64 on a 128 track.</li>
<li>Offbeat hats and busy percussion. The open hat on the offbeat (between kicks) is a house trademark. On sparse, hat-led tracks, a detector occasionally locks onto the hats and doubles the figure, giving 250-something on a 125 track.</li>
</ul>
<p>If your reading is under 90 for anything that sounds like house or techno, double it. If it's over 200, halve it. There's a full explanation of this in <a href="/blog/why-is-my-bpm-half-or-double/">why your BPM reads half or double</a>, and it's worth reading if you're also playing slower or faster genres in the same set. <a href="/blog/drum-and-bass-bpm/">Drum and bass</a> at 174 is a classic case where the half-time number (87) gets reported.</p>

<h2>How do I mix between house and techno tempos?</h2>
<p>The classic turntable pitch fader covers plus or minus 8%, and CDJs and controllers let you pick narrower or wider ranges. At plus 8%, a 124 BPM house track can reach about 133.9, which is well into techno territory. So you can get from one to the other in a single blend, but you'll hear it: with key lock off, the track also goes up about 1.3 semitones, and with key lock on, heavy stretching can smear the sound.</p>
<p>What I do instead is move the tempo a little over several tracks. Nudging the master tempo up one or two BPM per mix takes a set from 122 to 132 over half an hour without anyone noticing a jump.</p>
<p>Key matters as much as tempo when you're blending long sections of two tracks. If the basslines clash, the mix sounds wrong even if the beats are perfect. The <a href="/">analyser</a> gives each track's key as a name, like F minor, along with its relative major, and <a href="/blog/harmonic-mixing-for-djs/">harmonic mixing</a> covers which keys go together.</p>

<h2>How do I get BPM and key into my DJ software?</h2>
<p>Rekordbox, Serato and Traktor all analyse tempo themselves when you import. They mostly do fine on house and techno for the reasons above. Where it helps to bring your own numbers is when you want consistent readings across all three, or you want key and BPM in the file names so you can see them in any folder.</p>
<p>The terminal version of this tool can analyse a whole folder and write key and BPM into the file tags (mp3, aiff, flac, ogg and opus), so your DJ software picks them up, and it can rename files so the key and tempo are right there in the name. <a href="/blog/tag-key-and-bpm-in-rekordbox-serato-traktor/">Tagging key and BPM for Rekordbox, Serato and Traktor</a> walks through it.</p>

<h2>What BPM should I make my house or techno track?</h2>
<p>Pick based on where the track will be played. If it's for early in the night or for listening, 118 to 122 gives room for groove and swing. If it's for peak time, 124 to 128 for house, 130 to 140 for techno. Hard techno producers aiming at the fastest rooms go past 145.</p>
<p>One practical thing: at dance tempos, delay and reverb times are easy to lock to the beat. A quarter-note delay at 125 BPM is exactly 480 ms (60,000 divided by the BPM).</p>
<p>And set the tempo as a whole number unless you have a reason not to. DJs will beatmatch your track either way, but a clean 126.00 makes the grid behave in every piece of software that touches it.</p>
`,
  faq: [
    {
      q: "Is 128 BPM house or techno?",
      a: "It can be either. 128 is the upper end of typical house and the lower-middle of techno, so the sound of the track decides which it is.",
    },
    {
      q: "What BPM is deep house?",
      a: "Deep house usually runs around 118 to 124 BPM. It sits at the slower end of house, with more space, warmer chords and softer drums.",
    },
    {
      q: "Why did my BPM detector read 64 on a house track?",
      a: "It locked onto a half-time section or a beatless breakdown instead of the kick. Double it to get 128, which is almost certainly the real tempo.",
    },
    {
      q: "What BPM is hard techno?",
      a: "Hard techno commonly runs from about 140 to 155 BPM, and some of it goes faster. It sits well above the 125 to 135 range of classic Detroit techno.",
    },
    {
      q: "Can I mix a 122 BPM house track with a 135 BPM techno track?",
      a: "It's a 10.7% jump, beyond a plus or minus 8% pitch range, so you would either widen the range or bring the tempo up gradually over a few tracks. Moving in small steps usually sounds better.",
    },
  ],
  related: ["why-is-my-bpm-half-or-double", "harmonic-mixing-for-djs", "tag-key-and-bpm-in-rekordbox-serato-traktor", "drum-and-bass-bpm"],
} satisfies Post;
