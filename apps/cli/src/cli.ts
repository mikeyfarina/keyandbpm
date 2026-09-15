#!/usr/bin/env bun
import { parseArgs } from "node:util";
import { basename } from "node:path";
import { stat } from "node:fs/promises";
import { Analyzer, confidenceLabel, formatBpm, formatTuning, type Analysis, type TempoResult } from "@keyandbpm/core";
import { loadEssentiaWasm } from "@keyandbpm/core/node";
import { decodeToMono } from "./decode.ts";
import { renameWithPrefix } from "./rename.ts";
import { writeTags } from "./tag.ts";

const HELP = `keyandbpm: find the key, tempo and tuning of audio files, offline.

Usage
  keyandbpm [options] <file> [<file> ...]

Options
  --json     Print one JSON object per file instead of the readable summary
  --fast     Skip the slower, more accurate tempo pass
  --tag      Write key and tempo into the file's metadata (mp3, aiff, flac, ogg, opus)
  --rename   Prefix the file name with [Key][BPM], e.g. "[Am][96.52] track.mp3"
  -h, --help Show this help

Needs ffmpeg on PATH for decoding. Nothing is uploaded anywhere.`;

interface Options {
  json: boolean;
  fast: boolean;
  tag: boolean;
  rename: boolean;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function printReadable(file: string, a: Analysis, extras: string[]): void {
  const cents = a.tuning.cents === 0 ? "at concert pitch" : `${a.tuning.cents > 0 ? "+" : ""}${a.tuning.cents} cents from A440`;
  const lines = [
    basename(file),
    `  key      ${a.key.name}  (relative ${a.key.relative.name}, strength ${a.key.strength.toFixed(2)})`,
    `  tempo    ${formatBpm(a.tempo.bpm)} bpm  (${a.tempo.method}, confidence ${confidenceLabel(a.tempo)})`,
    `  tuning   ${formatTuning(a.tuning.hz)}  (${cents})`,
    `  length   ${formatDuration(a.duration)}`,
    ...extras.map((e) => `  ${e}`),
  ];
  console.log(lines.join("\n"));
}

async function processFile(analyzer: Analyzer, file: string, opts: Options): Promise<boolean> {
  try {
    await stat(file);
  } catch {
    console.error(`${file}: no such file`);
    return false;
  }

  try {
    const pcm = decodeToMono(file);
    const analysis = analyzer.analyze(pcm, {
      tempoMethod: opts.fast ? "fast" : "accurate",
      onFastTempo: (t: TempoResult) => {
        if (!opts.json) console.error(`${basename(file)}: ${formatBpm(t.bpm)} bpm at first pass, refining...`);
      },
    });

    const extras: string[] = [];
    let path = file;
    if (opts.tag) {
      const outcome = await writeTags(path, analysis);
      extras.push(outcome === "written" ? "tags     written" : "tags     not supported for this format");
    }
    if (opts.rename) {
      path = await renameWithPrefix(path, analysis);
      extras.push(`renamed  ${basename(path)}`);
    }

    if (opts.json) {
      console.log(JSON.stringify({ file: path, ...analysis }));
    } else {
      printReadable(path, analysis, extras);
    }
    return true;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return false;
  }
}

async function main(): Promise<number> {
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      json: { type: "boolean", default: false },
      fast: { type: "boolean", default: false },
      tag: { type: "boolean", default: false },
      rename: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length === 0) {
    console.log(HELP);
    return values.help ? 0 : 1;
  }

  const analyzer = new Analyzer(loadEssentiaWasm());
  const opts: Options = { json: values.json, fast: values.fast, tag: values.tag, rename: values.rename };
  let failures = 0;
  for (const file of positionals) {
    if (!(await processFile(analyzer, file, opts))) failures++;
  }
  return failures === 0 ? 0 : 1;
}

process.exit(await main());
