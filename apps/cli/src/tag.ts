import { rename, unlink } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import type { Analysis } from "@keyandbpm/core";
import { ffmpegPath } from "./decode.ts";

interface TagNames {
  bpm: string;
  key: string;
  extraArgs: string[];
}

/** Tag names differ by container. ID3 uses TBPM/TKEY frames; Vorbis comments use BPM/INITIALKEY. */
export function tagNamesFor(ext: string): TagNames | null {
  switch (ext.toLowerCase()) {
    case ".mp3":
      return { bpm: "TBPM", key: "TKEY", extraArgs: ["-id3v2_version", "3"] };
    case ".aif":
    case ".aiff":
      // The AIFF muxer only writes an ID3 chunk when asked; without this the tags are dropped.
      return { bpm: "TBPM", key: "TKEY", extraArgs: ["-write_id3v2", "1", "-id3v2_version", "3"] };
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
    // ffmpeg may have got as far as creating the temp file; don't leave it in the user's folder.
    await unlink(tmp).catch((err: NodeJS.ErrnoException) => {
      if (err.code !== "ENOENT") throw err;
    });
    throw new Error(`Could not write tags to ${file}: ${proc.stderr.toString().trim()}`);
  }
  await rename(tmp, file);
  return "written";
}
