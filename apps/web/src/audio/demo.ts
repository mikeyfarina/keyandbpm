import { SAMPLE_RATE, type Scale } from "@keyandbpm/core";
import { audioContext } from "./decode.ts";

/**
 * Four short tracks the page can build without a download, so a visitor can try the
 * device before they have a file to hand. Each one is synthesised in a known key, tempo
 * and tuning, then goes through the same analyser as a dropped file: the display shows
 * what was measured, not the recipe.
 */
export interface Demo {
  id: string;
  label: string;
  fileName: string;
  tonic: number;
  scale: Scale;
  bpm: number;
  cents: number;
}

export const DEMOS: readonly Demo[] = [
  { id: "night-drive", label: "night drive", fileName: "night-drive.demo", tonic: 9, scale: "minor", bpm: 92.94, cents: -7 },
  { id: "soul-45", label: "soul 45", fileName: "1974-soul-45.demo", tonic: 2, scale: "major", bpm: 104.12, cents: 29 },
  { id: "warehouse", label: "warehouse", fileName: "warehouse-loop.demo", tonic: 5, scale: "minor", bpm: 128, cents: 0 },
  { id: "ballad", label: "ballad", fileName: "slow-ballad.demo", tonic: 10, scale: "major", bpm: 68.47, cents: -18 },
];

const BARS = 20;

export interface RenderedDemo {
  buffer: AudioBuffer;
  mono: Float32Array;
  context: AudioContext;
}

export async function renderDemo(demo: Demo): Promise<RenderedDemo> {
  const beat = 60 / demo.bpm;
  const length = Math.ceil((BARS * 4 * beat + 1.5) * SAMPLE_RATE);
  const offline = new OfflineAudioContext(1, length, SAMPLE_RATE);
  const voices = new Voices(offline, demo);

  // Harmonic-minor V and a IV-V cadence leave no doubt about the key.
  const root = 57 + ((demo.tonic - 9 + 12) % 12);
  const minor = demo.scale === "minor";
  const tonic = minor ? [root, root + 3, root + 7] : [root, root + 4, root + 7];
  const four = minor ? [root + 5, root + 8, root + 12] : [root + 5, root + 9, root + 12];
  const five = [root - 5, root - 1, root + 2];
  const progression = [tonic, tonic, four, five];

  for (let b = 0; b < BARS * 4; b++) {
    const t = 0.25 + b * beat;
    const bar = Math.floor(b / 4);
    const chord = progression[bar % 4]!;
    voices.kick(t, root - 36);
    if (b % 2 === 1) voices.snare(t, root - 12);
    voices.hat(t, 0.05);
    voices.hat(t + beat / 2, 0.09);
    if (b % 4 === 0) voices.pad(t, chord, beat * 4);
    if (b % 2 === 0) voices.bass(t + beat / 2, chord[0]! - 24, beat * 0.45);
  }

  const rendered = await offline.startRendering();
  // Played back through the page's own context; a copy of the channel goes to the analyser,
  // because that transfer detaches it.
  const context = audioContext();
  const buffer = context.createBuffer(1, rendered.length, SAMPLE_RATE);
  buffer.copyToChannel(rendered.getChannelData(0), 0);
  return { buffer, mono: rendered.getChannelData(0).slice(), context };
}

class Voices {
  private readonly noise: AudioBuffer;
  private readonly out: GainNode;

  constructor(
    private readonly ctx: OfflineAudioContext,
    private readonly demo: Demo,
  ) {
    this.noise = ctx.createBuffer(1, SAMPLE_RATE, SAMPLE_RATE);
    const data = this.noise.getChannelData(0);
    let seed = 1;
    for (let i = 0; i < data.length; i++) {
      seed = (seed * 16807) % 2147483647;
      data[i] = (seed / 2147483647) * 2 - 1;
    }
    this.out = ctx.createGain();
    this.out.gain.value = 0.5;
    this.out.connect(ctx.destination);
  }

  private hz(midi: number): number {
    return 440 * 2 ** ((midi - 69) / 12) * 2 ** (this.demo.cents / 1200);
  }

  private envelope(t: number, attack: number, peak: number, release: number): GainNode {
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
    gain.connect(this.out);
    return gain;
  }

  private noiseThrough(t: number, filter: BiquadFilterNode, gain: GainNode, seconds: number): void {
    const source = this.ctx.createBufferSource();
    source.buffer = this.noise;
    source.connect(filter).connect(gain);
    source.start(t, (t * 7.3) % 0.5);
    source.stop(t + seconds);
  }

  /** Falls onto the key's own root, so its energy does not pull the tuning estimate. */
  kick(t: number, midi: number): void {
    const osc = this.ctx.createOscillator();
    osc.frequency.setValueAtTime(this.hz(midi) * 3, t);
    osc.frequency.exponentialRampToValueAtTime(this.hz(midi), t + 0.12);
    osc.connect(this.envelope(t, 0.003, 0.9, 0.34));
    osc.start(t);
    osc.stop(t + 0.42);
  }

  snare(t: number, midi: number): void {
    const band = this.ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1900;
    band.Q.value = 0.7;
    this.noiseThrough(t, band, this.envelope(t, 0.002, 0.3, 0.16), 0.24);
    const body = this.ctx.createOscillator();
    body.type = "triangle";
    body.frequency.value = this.hz(midi);
    body.connect(this.envelope(t, 0.002, 0.16, 0.08));
    body.start(t);
    body.stop(t + 0.12);
  }

  hat(t: number, level: number): void {
    const high = this.ctx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 7500;
    this.noiseThrough(t, high, this.envelope(t, 0.001, level, 0.04), 0.06);
  }

  bass(t: number, midi: number, seconds: number): void {
    const osc = this.ctx.createOscillator();
    const low = this.ctx.createBiquadFilter();
    osc.type = "sawtooth";
    osc.frequency.value = this.hz(midi);
    low.type = "lowpass";
    low.frequency.value = 380;
    osc.connect(low).connect(this.envelope(t, 0.01, 0.22, seconds));
    osc.start(t);
    osc.stop(t + seconds + 0.05);
  }

  pad(t: number, notes: number[], seconds: number): void {
    const low = this.ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 1500;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.05, t + 0.4);
    gain.gain.setValueAtTime(0.05, t + seconds - 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + seconds + 0.3);
    low.connect(gain).connect(this.out);
    for (const midi of notes) {
      for (const detune of [-7, 7]) {
        const osc = this.ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = this.hz(midi);
        osc.detune.value = detune;
        osc.connect(low);
        osc.start(t);
        osc.stop(t + seconds + 0.4);
      }
    }
  }
}
