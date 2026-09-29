import type { Post } from "../post.ts";

export default {
  slug: "a432-vs-a440",
  title: "432 Hz vs 440 Hz: what the tuning difference actually does",
  description:
    "Tuning to A = 432 Hz lowers every note by about 31.8 cents, under a third of a semitone. What that changes, where 440 came from, and what the claims skip.",
  published: "2026-09-29",
  answer:
    "Tuning to A = 432 Hz instead of 440 Hz lowers every note by about 31.8 cents, a bit under a third of a semitone. You can hear it side by side and it matters when you play along with other music, but it doesn't change the key, and there's no good evidence it has health benefits or is more natural. Both 440 and 432 are conventions.",
  body: `
<p>I get asked about 432 Hz more than almost any other tuning question, usually by someone who watched a video saying 440 is wrong. So here are the measurable parts: what the number means, what it does to a track, and how to work at 432 if you want to. Then a sober look at the claims.</p>

<h2>What is the difference between 432 Hz and 440 Hz?</h2>
<p>Both numbers are the frequency chosen for the A above middle C (A4). Every other note is tuned relative to it, so changing A moves the whole instrument up or down by the same amount.</p>
<p>Musicians measure pitch differences in cents: 100 cents is one semitone, and the gap between two frequencies is 1200 × log2(f1 / f2). For 432 against 440 that's 1200 × log2(432 / 440), which comes out at −31.77 cents. So a 432 track is about 32 cents flat compared with standard pitch. Every note, top to bottom, by the same amount.</p>
<p>For context, here's where some other reference pitches sit:</p>
<div class="table-wrap">
<table>
<thead><tr><th>A4</th><th>Cents from 440</th><th>Where you meet it</th></tr></thead>
<tbody>
<tr><td>415 Hz</td><td>−101.3</td><td>Common modern convention for baroque period instruments, about a semitone low</td></tr>
<tr><td>432 Hz</td><td>−31.8</td><td>The alternative tuning this post is about</td></tr>
<tr><td>435 Hz</td><td>−19.8</td><td>French standard pitch set in 1859</td></tr>
<tr><td>440 Hz</td><td>0</td><td>ISO 16 standard pitch</td></tr>
<tr><td>442 Hz</td><td>+7.9</td><td>Many orchestras tune a little high</td></tr>
<tr><td>443 Hz</td><td>+11.8</td><td>Some orchestras go higher still</td></tr>
</tbody>
</table>
</div>

<h2>Can you hear the difference between 432 and 440?</h2>
<p>Played one straight after the other, you can usually tell one is lower. Heard on its own, with nothing to compare against, most listeners can't name which tuning a song uses (people with perfect pitch are the exception). Your ear judges pitch relative to what came before.</p>
<p>Where you really hear it is when two things meet. Play a 432 track into a 440 track in a DJ set and the chords rub. Sing along with a piano tuned to 440 while the backing is at 432 and you'll be a third of a semitone out the whole time. Thirty-two cents is well past the point where two instruments stop sounding in tune together.</p>

<h2>Does 432 Hz change the key of a song?</h2>
<p>No. A song in A minor at 432 is still in A minor; it's just a slightly flat A minor. The nearest semitone below would be 100 cents down, and 32 cents isn't close to that. Key finders that measure the track against its own tuning (the <a href="/">keyandbpm analyser</a> does this) will report the same key either way, plus the tuning as Hz of A4 and cents from 440. Drop a 432 track in and you'd expect to see something near 432 Hz and about −32 cents. The <a href="/432-hz-checker/">432 Hz checker</a> does the same measurement and tells you which of the two a file is closer to.</p>
<p>Some tools assume 440 and snap each note to the nearest semitone. A track 32 cents flat still usually lands on the right notes, but the further off a recording is, the more that approach can wobble between neighbours. That's one of the reasons in <a href="/blog/why-key-finders-disagree/">why key finders disagree</a>.</p>

<h2>Where did 440 Hz come from?</h2>
<p>Concert pitch used to vary by country, city, era and even by which organ you were playing. France fixed A at 435 in 1859. An international conference in London in 1939 recommended 440, and the International Organization for Standardization published it as ISO 16 in 1975. The US music industry was already widely using 440 before that conference.</p>
<p>So 440 is an agreement, not a law of nature. So is 432. The value of a standard is that instruments, recordings and tuners made by different people all line up.</p>

<h2>What about the claims that 432 Hz is healing or natural?</h2>
<p>These are the claims you'll run into, and what can actually be checked:</p>
<ul>
<li>"432 is mathematically tied to nature or the universe." The frequency of a note depends on an arbitrary unit, the second. Change the unit of time and the number changes, while the sound doesn't.</li>
<li>"432 matches the Schumann resonance." The Earth's lowest Schumann resonance is around 7.8 Hz. Doubling that by octaves gives roughly 250 Hz and 501 Hz, neither of which is 432 or a note tuned from it.</li>
<li>"C = 256 is scientific pitch, and that gives A = 432." Partly true. If you set C4 to 256 Hz and tune A as a pure Pythagorean sixth (27/16), you get exactly 432. In equal temperament, which almost every modern instrument uses, C = 256 gives A = 430.5, not 432.</li>
<li>"432 is better for your health or makes you calmer." I haven't seen good evidence for this. If a piece of music relaxes you, it's far more likely to be the tempo, arrangement and volume than a 1.8% shift in pitch.</li>
<li>"440 was imposed to make music harsher." The adoption history above is about getting instruments to agree. There's no documented plan behind it beyond that.</li>
</ul>
<p>My opinion: if you like how your music sounds at 432, use it. Detuning is a legitimate creative choice, and a lot of people enjoy slightly lower tunings on guitars and synths. Just do it because of how it sounds, not because of the claims.</p>

<h2>What about 432 Hz versions on YouTube?</h2>
<p>Most "432 Hz version" uploads of popular songs are 440 recordings shifted down by 31.8 cents after the fact. If the shift was done by pitch-shifting, the tempo stays the same. If it was done by slowing the audio (resampling), the tempo drops by the same ratio, about 1.8%, so a 120 BPM track ends up at about 117.8. Either way it's the same performance, just lower.</p>

<h2>How to make music at 432 Hz</h2>
<ol>
<li>Set your synths' and samplers' master tune to 432 Hz, or detune them by −31.8 cents if they only take cents.</li>
<li>Tune guitars and bass with a tuner set to 432 as the reference. Most clip-on and app tuners have the setting.</li>
<li>Detune any samples or loops recorded at 440 by −31.8 cents. <a href="/blog/how-to-pitch-a-sample-in-cents/">How to fine-tune a sample in cents</a> walks through it.</li>
<li>Check the result. Drop the bounce into the analyser, or a tuner plugin on a sustained note, and confirm it reads about 432.</li>
</ol>
<p>The same steps apply in reverse if you've sampled an old record that sits at 432 or thereabouts and want it at 440. Records drifting away from 440 is common for other reasons, covered in <a href="/blog/why-old-records-sound-out-of-tune/">why old records aren't tuned to 440 Hz</a>.</p>
`,
  faq: [
    {
      q: "How many cents is 432 Hz from 440 Hz?",
      a: "About 31.8 cents flat, calculated as 1200 × log2(432 / 440). That's a little under a third of a semitone.",
    },
    {
      q: "Is 432 Hz better for you?",
      a: "There's no good evidence that tuning to 432 Hz has health benefits. It lowers the pitch slightly, and any effect on mood is far more likely to come from the music itself.",
    },
    {
      q: "Is 432 Hz a different key from 440 Hz?",
      a: "No. The notes are the same, just about 32 cents lower. A song in C major at 432 is still in C major.",
    },
    {
      q: "Does converting a song to 432 Hz change the BPM?",
      a: "Only if it's done by slowing the audio down, which lowers the tempo by about 1.8%, so 120 BPM becomes about 117.8. A proper pitch shift keeps the original tempo.",
    },
    {
      q: "Why do some orchestras tune to 442 Hz?",
      a: "Mostly tradition and taste; many ensembles prefer a slightly brighter sound. 442 is about 8 cents above 440, and 443 is about 12 cents above.",
    },
  ],
  related: ["how-to-pitch-a-sample-in-cents", "why-old-records-sound-out-of-tune", "why-key-finders-disagree"],
} satisfies Post;
