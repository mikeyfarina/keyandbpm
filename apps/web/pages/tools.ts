/*
  Two small tools that answer searches the analyser doesn't: tapping out a tempo by hand, and
  turning a tempo into delay and reverb times. The BPM table is rendered at 120 BPM in the
  static HTML, so crawlers and answer engines read real numbers without running the script.
*/
import type { RenderedPage } from "../blog/page.ts";

const DEFAULT_BPM = 120;
const NOTES = [
  { name: "Whole note", short: "1/1", beats: 4 },
  { name: "Half note", short: "1/2", beats: 2 },
  { name: "Quarter note", short: "1/4", beats: 1 },
  { name: "Eighth note", short: "1/8", beats: 0.5 },
  { name: "Sixteenth note", short: "1/16", beats: 0.25 },
  { name: "Thirty-second note", short: "1/32", beats: 0.125 },
];

const ms = (bpm: number, beats: number) => (60000 / bpm) * beats;
const fmt = (n: number) => String(Number(n.toFixed(2)));

function delayRows(bpm: number): string {
  return NOTES.map((n) => {
    const straight = ms(bpm, n.beats);
    return `<tr><td>${n.name} (${n.short})</td><td>${fmt(straight)}</td><td>${fmt(straight * 1.5)}</td><td>${fmt((straight * 2) / 3)}</td><td>${(1000 / straight).toFixed(2)}</td></tr>`;
  }).join("\n");
}

const tapTempo: RenderedPage = {
  path: "/tap-tempo/",
  title: "Tap tempo: find the BPM of a song by tapping along",
  description:
    "Tap any key or the button in time with the music and read the tempo in BPM. Averages every tap, shows half and double time, and works offline in your browser.",
  answer:
    "Tap along with the beat for eight to sixteen taps and the average of the gaps between them gives the tempo in beats per minute. Tap on the kick or snare, not the hi-hats, or you will read double the tempo.",
  body: `
<link rel="stylesheet" href="/tools.css" />
<section class="tool" aria-label="Tap tempo">
  <p class="tool-readout"><output id="bpm">---</output><small>BPM</small></p>
  <p class="tool-note" id="detail" aria-live="polite">Tap the button, or press any key, on each beat.</p>
  <div class="tool-row">
    <button type="button" class="tool-tap" id="tap">Tap</button>
    <button type="button" id="reset">Reset</button>
  </div>
</section>

<h2>How to tap a tempo accurately</h2>
<ol>
<li>Listen for a bar or two before you start, so your first tap lands on the beat instead of chasing it.</li>
<li>Tap on the kick drum or the snare. Tapping every hi-hat gives you twice the real tempo.</li>
<li>Keep going for at least eight taps. The number steadies as the average takes in more beats; one early or late tap matters less the longer you go.</li>
<li>Stop for two seconds to start a fresh count.</li>
</ol>
<p>Tapping gets you within a beat or two per minute. For the exact figure, and a beat grid to check it against, drop the file into the <a href="/">key and BPM finder</a>, which measures the tempo from the audio itself. There is more on the technique in <a href="/blog/how-to-tap-tempo/">how to tap tempo</a>, and on why a result can come out at half or double in <a href="/blog/why-is-my-bpm-half-or-double/">why is my BPM half or double</a>.</p>
<p>Once you have the tempo, the <a href="/bpm-to-ms/">BPM to milliseconds calculator</a> turns it into delay and reverb times.</p>
`,
  faq: [
    { q: "How many times should I tap to get the BPM?", a: "At least eight. Each tap only tells you the gap to the one before, so the average needs several gaps before a single early or late tap stops moving the number." },
    { q: "Why does tapping give me double the BPM?", a: "You are probably tapping the hi-hats or a fast shaker rather than the kick and snare. Halve the number, or tap half as often." },
    { q: "Is tap tempo accurate?", a: "To within about one or two BPM if you tap steadily for a few bars. Software that measures the audio can give the tempo to a hundredth of a BPM and shows whether the beats line up." },
  ],
  script: `
const bpmOut = document.getElementById("bpm");
const detail = document.getElementById("detail");
const RESET_AFTER_MS = 2000;
const WINDOW = 16;
let taps = [];

function render() {
  if (taps.length < 2) {
    bpmOut.textContent = "---";
    detail.textContent = taps.length ? "Keep tapping on each beat." : "Tap the button, or press any key, on each beat.";
    return;
  }
  const recent = taps.slice(-WINDOW);
  const bpm = (60000 * (recent.length - 1)) / (recent.at(-1) - recent[0]);
  bpmOut.textContent = bpm.toFixed(1);
  detail.textContent = taps.length + " taps · half time " + (bpm / 2).toFixed(1) + " · double time " + (bpm * 2).toFixed(1);
}

function tap() {
  const now = performance.now();
  if (taps.length && now - taps.at(-1) > RESET_AFTER_MS) taps = [];
  taps.push(now);
  render();
}

document.getElementById("tap").addEventListener("pointerdown", (event) => {
  event.preventDefault();
  tap();
});
document.getElementById("reset").addEventListener("click", () => {
  taps = [];
  render();
});
document.addEventListener("keydown", (event) => {
  if (event.repeat || event.metaKey || event.ctrlKey || event.altKey || event.key === "Tab") return;
  if (document.activeElement?.id === "reset" && (event.key === "Enter" || event.key === " ")) return;
  event.preventDefault();
  tap();
});
`,
};

const bpmToMs: RenderedPage = {
  path: "/bpm-to-ms/",
  title: "BPM to milliseconds: delay and reverb time calculator",
  description:
    "Turn a tempo into delay and reverb times in milliseconds for every note length, straight, dotted and triplet, plus the matching LFO rate in hertz.",
  answer: `Divide 60,000 by the BPM to get one quarter note in milliseconds. At ${DEFAULT_BPM} BPM a quarter note is ${fmt(ms(DEFAULT_BPM, 1))} ms, an eighth is ${fmt(ms(DEFAULT_BPM, 0.5))} ms, a dotted eighth is ${fmt(ms(DEFAULT_BPM, 0.75))} ms, and an eighth-note triplet is ${fmt(ms(DEFAULT_BPM, 1 / 3))} ms.`,
  body: `
<link rel="stylesheet" href="/tools.css" />
<section class="tool" aria-label="BPM to milliseconds">
  <div class="tool-row">
    <label for="bpm">Tempo</label>
    <input id="bpm" type="number" inputmode="decimal" min="20" max="400" step="any" value="${DEFAULT_BPM}" />
    <label for="bpm">BPM</label>
  </div>
  <div class="table-wrap">
  <table>
  <thead><tr><th>Note</th><th>Straight ms</th><th>Dotted ms</th><th>Triplet ms</th><th>LFO Hz</th></tr></thead>
  <tbody id="rows">
${delayRows(DEFAULT_BPM)}
  </tbody>
  </table>
  </div>
  <p class="tool-note" id="caption" aria-live="polite">Times at ${DEFAULT_BPM} BPM.</p>
</section>

<h2>The formula</h2>
<p>A quarter note lasts <code>60000 ÷ BPM</code> milliseconds. Halve it for an eighth, halve again for a sixteenth. A dotted note is one and a half times as long as the plain one, and a triplet is two thirds as long. The LFO column is the rate in hertz that completes one cycle per note: <code>1000 ÷ ms</code>.</p>

<h2>Which delay time to use</h2>
<ul>
<li><strong>Dotted eighth</strong> is the classic rhythmic delay on guitars and vocals: the repeats fall between the beats and fill the gaps.</li>
<li><strong>Quarter or eighth</strong> sits on the grid and thickens a part without adding a new rhythm.</li>
<li><strong>Reverb pre-delay</strong> set to a sixteenth or thirty-second keeps the dry sound clear before the tail arrives.</li>
<li><strong>Reverb decay</strong> tuned to a half or whole note lets the tail die away before the next bar starts.</li>
</ul>
<p>Don't know the tempo? Drop the track into the <a href="/">key and BPM finder</a>, or use the <a href="/tap-tempo/">tap tempo</a> page. More on setting delays in <a href="/blog/bpm-to-ms-delay-times/">BPM to milliseconds for delay times</a>.</p>
`,
  faq: [
    { q: "How do I convert BPM to milliseconds?", a: "Divide 60,000 by the BPM. That is one beat, a quarter note, in milliseconds. At 128 BPM it is 468.75 ms." },
    { q: "What is a dotted eighth delay at 120 BPM?", a: "375 ms. An eighth note at 120 BPM is 250 ms, and dotted means one and a half times as long." },
    { q: "How do I work out a triplet delay time?", a: "Take the straight note's time and multiply by two thirds. An eighth-note triplet at 120 BPM is 250 × 2 ÷ 3, about 166.7 ms." },
  ],
  script: `
const NOTES = ${JSON.stringify(NOTES)};
const input = document.getElementById("bpm");
const rows = document.getElementById("rows");
const caption = document.getElementById("caption");
const fmt = (n) => String(Number(n.toFixed(2)));

function render() {
  const bpm = Number(input.value);
  if (!(bpm >= 20 && bpm <= 400)) {
    caption.textContent = "Enter a tempo between 20 and 400 BPM.";
    return;
  }
  rows.innerHTML = NOTES.map((n) => {
    const straight = (60000 / bpm) * n.beats;
    return "<tr><td>" + n.name + " (" + n.short + ")</td><td>" + fmt(straight) + "</td><td>" + fmt(straight * 1.5) + "</td><td>" + fmt((straight * 2) / 3) + "</td><td>" + (1000 / straight).toFixed(2) + "</td></tr>";
  }).join("");
  caption.textContent = "Times at " + bpm + " BPM.";
}

input.addEventListener("input", render);
`,
};

export default [tapTempo, bpmToMs];
