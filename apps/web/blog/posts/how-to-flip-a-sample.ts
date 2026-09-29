import type { Post } from "../post.ts";

export default {
  slug: "how-to-flip-a-sample",
  title: "How to flip a sample",
  description:
    "How to flip a sample into a beat: chopping it into slices, re-sequencing the chops, filtering, re-pitching and layering until the loop becomes something new.",
  published: "2026-09-29",
  answer:
    "To flip a sample, chop it into short slices (on transients, on the beat, or by hand), map the slices to pads or keys, and play them back in a new order and rhythm. Then change its sound: filter it, re-pitch it, reverse or stretch chops, and add your own drums and bass so the result is a new idea built from the old one.",
  body: `
<p>Looping four bars of a record and putting drums on it is sampling. Flipping is when you take the record apart and build something it never played. A good flip can make someone who knows the original do a double take, and that's usually the goal.</p>

<h2>What does it mean to flip a sample?</h2>
<p>"Flip" covers anything that turns a sample into a new musical idea: a new melody made from its notes, a new rhythm made from its hits, a new mood made by pitching or filtering it. There's no fixed method. In practice most flips use some mix of the techniques below, and the first one, chopping, does most of the work.</p>
<p>Before you start, know the sample's key and tempo. You'll need the key to write bass and chords under it, and the tempo to line chops up with your grid. The <a href="/">analyser</a> gives you both (plus tuning) in a few seconds, and you can play the sample against its beat grid to check the tempo is the one you'd count. <a href="/blog/what-key-is-this-sample-in/">How to find the key of a sample</a> covers doing it by ear.</p>

<h2>How do you chop a sample?</h2>
<p>You cut it into slices and assign each slice to a pad or a key. There are three common ways to decide where the cuts go:</p>
<ul>
  <li><strong>On transients.</strong> The software drops a slice marker at every attack: every drum hit, every new chord. Good for breaks and rhythmic material, messy on legato strings.</li>
  <li><strong>On the grid.</strong> Equal slices, one per beat or per eighth note. Works well if the sample is already at a steady tempo, and it keeps everything in time.</li>
  <li><strong>By hand.</strong> You pick every start point yourself. Slowest, and the one that gets the most musical results, because you choose the phrases.</li>
</ul>
<p>Most DAWs have tools for this. Ableton's "Slice to New MIDI Track" puts slices onto a Drum Rack. FL Studio has Slicex and Fruity Slicer. Logic's Quick Sampler has a slice mode. On an MPC or SP-style sampler, chopping to pads is what the machine is built for.</p>
<p>Some practical habits: cut a few milliseconds before the transient so you don't lose the attack, add short fades at the start and end of each slice to stop clicks, and set pads to "choke" each other (or monophonic playback) so one chop cuts off the previous one, the way an MPC does it. That cut-off is a big part of the classic chopped sound.</p>

<h2>Re-sequencing: playing the chops in a new order</h2>
<p>Once the slices are on pads, forget the original and play. Tap out a new melody from the chord stabs. Repeat one short vocal syllable in a rhythm. Leave space where the original was busy. Record it roughly, then tidy the timing.</p>
<p>A few ideas I come back to:</p>
<ul>
  <li>Pick three or four chops that sound good together and build a two-bar phrase from only those. Fewer chops usually make a stronger flip.</li>
  <li>Use a single chop as a drum. A short horn hit or a vocal "ah" played on the backbeat can replace or layer the snare.</li>
  <li>Stutter a chop by retriggering it on sixteenths just before a phrase changes.</li>
  <li>Don't quantize everything to 100%. Slightly late or early chops are a lot of what makes boom bap swing. There's more on that feel in <a href="/blog/what-bpm-is-boom-bap/">what BPM is boom bap</a>.</li>
</ul>

<h2>Filtering the sample</h2>
<p>Filtering is how you make room and change the mood. A high-pass filter removes the sample's low end, which you'll usually want anyway, because the original bass line will fight your own 808 or bass. Somewhere around 100 to 200 Hz is a common starting point; sweep it and listen.</p>
<p>A low-pass does the opposite: it takes off the top, making the sample darker and pushing it back behind the drums. Low-passing hard and bringing the filter up for the hook is an old trick that still works. A band-pass, cutting both ends, gives you the telephone or small-radio sound.</p>
<p>If you want to keep the sample's bass line instead, low-pass hard so the bass is most of what's left, then put your own drums over it. You'll get whatever else lives down there too, so pick a section where the bass is exposed.</p>

<h2>Re-pitching the chops</h2>
<p>Pitching a sample changes its character more than almost anything else. Slowing it down and dropping the pitch together (a repitch, like a turntable at a lower speed) makes a soul loop heavy and dark. Speeding it up raises vocals into the "chipmunk soul" sound that a lot of early-2000s hip hop was built on.</p>
<p>You can also re-pitch individual chops to play new notes. Map one clean chord stab across a keyboard and you can play a new chord progression out of it. It'll sound more obviously "sampled" the further you move it from its original pitch, which is often the point.</p>
<p>When you change pitch, the key changes with it. A sample in D minor pitched down 2 semitones is in C minor. Keep track so your bass and chords follow; <a href="/blog/how-to-match-a-sample-to-your-beat/">how to match a sample to your beat</a> has the semitone-to-tempo maths if you're repitching the whole loop. If the flip still sounds slightly sour after the key's right, check its tuning in cents.</p>

<h2>Other ways to flip a sample</h2>
<ul>
  <li><strong>Reverse.</strong> A reversed chop swells into the next one. Reverse a cymbal or a sustained chord for a riser.</li>
  <li><strong>Stretch.</strong> Time-stretch a short chop far past its original length and the artefacts become a pad or a texture.</li>
  <li><strong>Halve the tempo.</strong> Play a sample at half speed under double-time drums, or run the drums in half-time under a busy sample.</li>
  <li><strong>Layer.</strong> Double the sample's main melody on a synth, or add your own chords underneath once you know the key. This makes the flip less dependent on the sample.</li>
  <li><strong>Resample.</strong> Bounce your chopped pattern to audio, then chop that again. A flip of a flip rarely sounds like the source.</li>
</ul>

<h2>Does flipping a sample mean I don't need to clear it?</h2>
<p>No. Chopping and re-pitching change how a sample sounds, but it's still the original recording, and the melody you took may still belong to the song's writers. This is general information rather than legal advice, and the rules vary by country. For the basics of how clearance usually works, and for sources that come pre-cleared, see <a href="/blog/how-to-find-samples-for-beats/">where to find samples for beats</a>.</p>
<p>If you want the flipped sound with none of that, play or make your own "sample" first and flip that. Nobody can tell the difference once it's chopped.</p>
`,
  faq: [
    {
      q: "What's the difference between chopping and flipping a sample?",
      a: "Chopping is cutting the sample into slices. Flipping is the whole process of turning it into something new, which usually starts with chopping and then adds re-sequencing, filtering and pitching.",
    },
    {
      q: "What's the best software for chopping samples?",
      a: "Whatever you already use. Ableton, FL Studio and Logic all have built-in slicing, and MPC-style hardware and apps are built around chopping to pads.",
    },
    {
      q: "Should I chop on transients or on the grid?",
      a: "Chop drum breaks and rhythmic parts on transients, and steady loops on the grid. For melodic samples, picking slices by hand usually gives the most musical chops.",
    },
    {
      q: "Why does my chopped sample click?",
      a: "The slice starts or ends where the waveform isn't at zero. Add a very short fade at each end of the slice, or move the start point to a zero crossing.",
    },
    {
      q: "How do I know what key my flip is in after pitching it?",
      a: "Add the semitones you shifted to the sample's original key: a sample in D minor pitched up 3 semitones is in F minor. Or bounce the flip and run it through a key finder.",
    },
  ],
  related: [
    "how-to-find-samples-for-beats",
    "how-to-match-a-sample-to-your-beat",
    "what-key-is-this-sample-in",
    "what-bpm-is-boom-bap",
  ],
} satisfies Post;
