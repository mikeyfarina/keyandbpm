# keyandbpm

Finds the musical key, tempo and tuning reference of an audio file.

Live at <https://whatkeyandbpm.com>.

There are two ways to use it. The website analyses one track at a time and runs entirely
in the browser, so the audio is never uploaded. The terminal version takes any number of
files at once (a whole folder with `*.mp3`), writes the results into each file's tags, and can rename files to the bracketed form DJs
use for sample libraries.

```
[Am][92.94] a track.mp3
```

## What it reports

| | |
|---|---|
| Key | Tonic and scale, the relative key, and a strength figure saying how clearly the track committed to one key |
| Tempo | Beats per minute, a confidence figure, and the position of every beat |
| Tuning | The reference pitch the recording actually sits at, in Hz and in cents from A440 |

Tuning is the one most tools leave out. Records pressed before digital mastering drift a
long way from 440 Hz, because tape machines and cutting lathes ran at slightly different
speeds. A record sitting 29 cents sharp will fight anything you write against it.

## The website

```
bun install
bun run dev
```

The analysis runs in a Web Worker so the page stays responsive, and the first estimate
appears within a second or two while a slower, more accurate pass refines it. Press play
to check the result: if the beat marks under the waveform land with the snare, the tempo
is right. Files longer than 30 minutes are refused, to keep the tab within memory.

Usage is counted with PostHog in cookieless mode: page visits, timings, and the key, tempo
and tuning each analysis found. The audio and file names are never sent. Production builds
need `VITE_POSTHOG_KEY` in `apps/web/.env.production` and fail without it; the project must
have cookieless mode enabled in its PostHog settings.

Deploying is one command once `wrangler` is logged in to Cloudflare:

```
bun run --filter @keyandbpm/web deploy
```

The site URL appears in `apps/web/index.html`, `apps/web/public/sitemap.xml` and
`apps/web/public/robots.txt`. Change it in all three when moving to a custom domain, or
search engines will index the wrong address.

## The terminal version

```
bun apps/cli/src/cli.ts [options] <file> [<file> ...]
```

| Option | |
|---|---|
| `--json` | One JSON object per file instead of the readable summary |
| `--fast` | Skip the slower, more accurate tempo pass |
| `--tag` | Write key and tempo into the file's metadata (mp3, aiff, flac, ogg, opus) |
| `--rename` | Prefix the file name with `[Key][BPM]` |

Tags are written as `TBPM` and `TKEY` for ID3 files and `BPM` and `INITIALKEY` for Vorbis
comments, which is what Rekordbox, Serato and Traktor read. The audio stream is copied
without re-encoding.

Decoding needs `ffmpeg` on PATH. Everything else is installed by `bun install`.

## Layout

| | |
|---|---|
| `packages/core` | The analysis itself, shared by both front ends |
| `apps/web` | The website: static HTML with the analyser mounted as one interactive island |
| `apps/cli` | The terminal version |

The measuring is done by [Essentia](https://essentia.upf.edu/), from the Music Technology
Group at Universitat Pompeu Fabra, through its WebAssembly build. Tuning is worked out
here rather than by Essentia, because the JavaScript bindings do not expose the algorithm
that accumulates tuning across frames; the implementation in `packages/core/src/tuning.ts`
follows the same method and agrees with the native library to within half a hertz on the
records it was checked against.

## Tests

```
bun test          # analysis against synthesised signals; CLI tagging and renaming (needs ffmpeg)
bun run typecheck
```

The tests synthesise their own audio rather than shipping recordings, so the repository
carries no copyrighted material and the expected answers are exact.

## Accuracy

Key detection is most reliable on music with clear, sustained harmony. It has nothing to
find in drum loops or sound effects, and tracks that change key have no single answer;
the strength figure is the honest signal there. Tempo is occasionally
reported at half or double what you would count, which happens when the rhythm genuinely
supports both readings.

## Licence

AGPL-3.0-or-later. Essentia is AGPL, so anything built on it carries the same terms,
including over a network: if you run a modified copy as a service, its source has to be
available to the people using it.
