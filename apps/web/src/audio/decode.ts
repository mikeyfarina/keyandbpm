import { SAMPLE_RATE } from "@keyandbpm/core";

export interface DecodedAudio {
  buffer: AudioBuffer;
  /** Channels averaged into one, which is what the analysis works on. */
  mono: Float32Array;
  context: AudioContext;
}

let context: AudioContext | null = null;

/** One context for the page, fixed at the rate the analysis expects. */
export function audioContext(): AudioContext {
  context ??= new AudioContext({ sampleRate: SAMPLE_RATE });
  return context;
}

export async function decodeFile(file: File): Promise<DecodedAudio> {
  const ctx = audioContext();
  const bytes = await file.arrayBuffer();
  let buffer: AudioBuffer;
  try {
    buffer = await ctx.decodeAudioData(bytes);
  } catch {
    throw new Error(
      `${file.name} could not be decoded. Browsers each read a slightly different set of formats; an mp3 or wav will work everywhere.`,
    );
  }
  return { buffer, mono: toMono(buffer), context: ctx };
}

function toMono(buffer: AudioBuffer): Float32Array {
  const channels = buffer.numberOfChannels;
  const out = new Float32Array(buffer.length);
  for (let c = 0; c < channels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < out.length; i++) out[i]! += data[i]!;
  }
  if (channels > 1) for (let i = 0; i < out.length; i++) out[i]! /= channels;
  return out;
}
