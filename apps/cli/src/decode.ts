import { SAMPLE_RATE } from "@keyandbpm/core";

export function ffmpegPath(): string {
  const path = Bun.which("ffmpeg");
  if (!path) {
    throw new Error("ffmpeg is not installed or not on PATH. Install it with `brew install ffmpeg` (macOS) or your package manager.");
  }
  return path;
}

/** Decodes any format ffmpeg understands into mono 32-bit float PCM at 44.1 kHz. */
export function decodeToMono(file: string): Float32Array {
  const proc = Bun.spawnSync(
    [ffmpegPath(), "-v", "error", "-i", file, "-f", "f32le", "-ac", "1", "-ar", String(SAMPLE_RATE), "-"],
    { stdout: "pipe", stderr: "pipe" },
  );
  if (proc.exitCode !== 0) {
    const detail = proc.stderr.toString().trim() || `ffmpeg exited with code ${proc.exitCode}`;
    throw new Error(`Could not decode ${file}: ${detail}`);
  }
  const bytes = proc.stdout;
  const floats = Math.floor(bytes.byteLength / 4);
  if (floats === 0) throw new Error(`Could not decode ${file}: ffmpeg produced no audio`);
  return new Float32Array(bytes.buffer, bytes.byteOffset, floats);
}
