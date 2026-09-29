import { SAMPLE_RATE, formatDuration } from "@keyandbpm/core";

/** Past this the decoded audio and the copy sent for analysis run past a gigabyte and can crash the tab. */
const MAX_MINUTES = 30;

/** Thrown for files longer than the browser version accepts, so callers can tell it from a decode failure. */
export class TooLongError extends Error {
  constructor(message: string, readonly seconds: number) {
    super(message);
  }
}

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
  if (buffer.duration > MAX_MINUTES * 60) {
    throw new TooLongError(
      `${file.name} is ${formatDuration(buffer.duration)} long. The browser version stops at ${MAX_MINUTES} minutes to stay within memory; the terminal version takes any length.`,
      buffer.duration,
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
