import { rename } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import type { Analysis } from "@keyandbpm/core";
import { ffmpegPath } from "./decode.ts";

interface TagNames {
  bpm: string;
  key: string;
  extraArgs: string[];
}

/** Tag names differ by container. ID3 uses TBPM/TKEY frames; Vorbis comments use BPM/INITIALKEY. */
function tagNamesFor(ext: string): TagNames | null {
  switch (ext.toLowerCase()) {
    case ".mp3":
    case ".aif":
    case ".aiff":
      return { bpm: "TBPM", key: "TKEY", extraArgs: ["-id3v2_version", "3"] };
    case ".flac":
    case ".ogg":
    case ".oga":
    case ".opus":
      return { bpm: "BPM", key: "INITIALKEY", extraArgs: [] };
    default:
      return null;
  }
}

export type TagOutcome = "written" | "unsupported";

/**
 * Writes key and tempo into the file's own metadata so DJ software picks them up.
 * The audio stream is copied bit for bit; only the tags change. ffmpeg cannot edit
 * in place, so the result is written next to the original and then swapped in.
 */
export async function writeTags(file: string, analysis: Analysis): Promise<TagOutcome> {
  const ext = extname(file);
  const names = tagNamesFor(ext);
  if (!names) return "unsupported";

  const tmp = join(dirname(file), `.${basename(file, ext)}.keyandbpm-tmp${ext}`);
  const proc = Bun.spawnSync(
    [
      ffmpegPath(), "-v", "error", "-y", "-i", file,
      "-map", "0", "-c", "copy", ...names.extraArgs,
      "-metadata", `${names.bpm}=${Math.round(analysis.tempo.bpm)}`,
      "-metadata", `${names.key}=${analysis.key.short}`,
      tmp,
    ],
    { stdout: "pipe", stderr: "pipe" },
  );
  if (proc.exitCode !== 0) {
    throw new Error(`Could not write tags to ${file}: ${proc.stderr.toString().trim()}`);
  }
  await rename(tmp, file);
  return "written";
}
