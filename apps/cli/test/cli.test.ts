import { afterAll, describe, expect, test } from "bun:test";
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { keyName, relativeKey, type Analysis } from "@keyandbpm/core";
import { renamedPath, renameWithPrefix } from "../src/rename.ts";
import { tagNamesFor, writeTags } from "../src/tag.ts";
import { ffmpegPath } from "../src/decode.ts";

const A_MINOR: Analysis = {
  key: { ...keyName(9, "minor"), relative: relativeKey(9, "minor"), strength: 0.9 },
  tempo: { bpm: 92.94, beats: [], confidence: 4, method: "accurate" },
  tuning: { hz: 440, cents: 0 },
  duration: 180,
};

const dirs: string[] = [];
async function scratch(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "keyandbpm-test-"));
  dirs.push(dir);
  return dir;
}
afterAll(async () => {
  for (const dir of dirs) await rm(dir, { recursive: true });
});

function ffprobeTags(file: string): Record<string, string> {
  const proc = Bun.spawnSync(
    [ffmpegPath().replace(/ffmpeg$/, "ffprobe"), "-v", "error", "-show_entries", "format_tags", "-of", "json", file],
  );
  return JSON.parse(proc.stdout.toString()).format.tags ?? {};
}

describe("rename", () => {
  test("prefixes the file name with key and bpm", () => {
    expect(renamedPath("/music/track.mp3", A_MINOR)).toBe("/music/[Am][92.94] track.mp3");
  });

  test("replaces a prefix from an earlier run instead of stacking a second one", () => {
    expect(renamedPath("/music/[C#m][120.00] track.mp3", A_MINOR)).toBe("/music/[Am][92.94] track.mp3");
  });

  test("refuses to overwrite a different file that already has the target name", async () => {
    const dir = await scratch();
    await writeFile(join(dir, "track.mp3"), "new");
    await writeFile(join(dir, "[Am][92.94] track.mp3"), "old");
    await expect(renameWithPrefix(join(dir, "track.mp3"), A_MINOR)).rejects.toThrow("already exists");
    expect(await Bun.file(join(dir, "[Am][92.94] track.mp3")).text()).toBe("old");
  });
});

describe("tags", () => {
  test("uses ID3 frames for mp3 and aiff, Vorbis comments for flac and ogg", () => {
    expect(tagNamesFor(".MP3")?.bpm).toBe("TBPM");
    expect(tagNamesFor(".aiff")?.key).toBe("TKEY");
    expect(tagNamesFor(".flac")?.key).toBe("INITIALKEY");
    expect(tagNamesFor(".wav")).toBeNull();
  });

  for (const ext of [".aiff", ".mp3", ".flac"]) {
    test(`writes key and bpm that ffprobe can read back (${ext})`, async () => {
      const dir = await scratch();
      const file = join(dir, `tone${ext}`);
      Bun.spawnSync([ffmpegPath(), "-v", "error", "-f", "lavfi", "-i", "sine=f=440:d=1", file]);
      expect(await writeTags(file, A_MINOR)).toBe("written");
      const tags = ffprobeTags(file);
      const bpm = tags.TBPM ?? tags.BPM;
      const key = tags.TKEY ?? tags.INITIALKEY;
      expect(bpm).toBe("93");
      expect(key).toBe("Am");
    });
  }

  test("leaves no temp file behind when ffmpeg fails", async () => {
    // FLAC audio behind an .mp3 name: ffmpeg opens the temp output, then the mp3 muxer rejects the stream.
    const dir = await scratch();
    const file = join(dir, "broken.mp3");
    Bun.spawnSync([ffmpegPath(), "-v", "error", "-f", "lavfi", "-i", "sine=f=440:d=1", "-f", "flac", file]);
    await expect(writeTags(file, A_MINOR)).rejects.toThrow("Could not write tags");
    expect(await readdir(dir)).toEqual(["broken.mp3"]);
  });
});
