import { useEffect, useMemo, useRef } from "react";
import { formatDuration } from "@keyandbpm/core";
import { peaksFor } from "../audio/peaks.ts";
import type { Player } from "../audio/player.ts";
import { track } from "../analytics.ts";
import { fitCanvas, onFrame } from "../ticker.ts";

/** Peak slices per second of audio; enough for the zoomed view to show individual hits. */
const RESOLUTION = 100;
const ZOOM_BEATS = 16;
const PHOSPHOR = "142, 245, 225";

interface Props {
  buffer: AudioBuffer | null;
  beats: number[];
  bpm: number | null;
  player: Player | null;
  decoding: boolean;
}

export function togglePlayback(player: Player): void {
  if (!player.playing) track("playback_started", { position_s: Math.round(player.position) });
  player.toggle();
}

/**
 * Needle search, as on a CDJ. The zoomed view scrolls under a fixed playhead with the
 * beat grid drawn beneath it: if the marks land with the snare, the tempo is right. Drag
 * it to nudge. The strip below is the whole track; click or drag it to jump.
 */
export function Waveform({ buffer, beats, bpm, player, decoding }: Props) {
  const zoomRef = useRef<HTMLCanvasElement>(null);
  const overRef = useRef<HTMLCanvasElement>(null);
  const elapsedRef = useRef<HTMLSpanElement>(null);
  const remainingRef = useRef<HTMLSpanElement>(null);

  const peaks = useMemo(() => {
    if (!buffer) return null;
    const raw = peaksFor(buffer.getChannelData(0), Math.max(1, Math.ceil(buffer.duration * RESOLUTION)));
    let loudest = 0;
    for (const v of raw) if (v > loudest) loudest = v;
    if (loudest > 0) for (let i = 0; i < raw.length; i++) raw[i]! /= loudest;
    return raw;
  }, [buffer]);

  // Beats arrive twice (fast, then accurate); the frame loop reads the latest through a ref.
  const live = useRef({ peaks, beats, bpm, player, decoding, buffer });
  live.current = { peaks, beats, bpm, player, decoding, buffer };

  useEffect(
    () =>
      onFrame((_, now) => {
        const { peaks, beats, bpm, player, decoding, buffer } = live.current;
        const position = player?.position ?? 0;
        const duration = buffer?.duration ?? 0;
        if (elapsedRef.current) elapsedRef.current.textContent = clock(position);
        if (remainingRef.current) remainingRef.current.textContent = `-${clock(duration - position)}`;
        drawZoom(zoomRef.current, peaks, beats, bpm, position);
        drawOverview(overRef.current, peaks, position, duration, decoding, now);
        overRef.current?.setAttribute("aria-valuenow", String(Math.round(position)));
      }),
    [],
  );

  const windowSeconds = bpm ? (ZOOM_BEATS * 60) / bpm : 8;
  const jog = useRef<{ x: number; from: number; resume: boolean } | null>(null);

  const seekOverview = (clientX: number) => {
    const canvas = overRef.current;
    if (!canvas || !player) return;
    const rect = canvas.getBoundingClientRect();
    player.seek(((clientX - rect.left) / rect.width) * player.duration);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!player) return;
    const step = event.shiftKey ? 10 : 2;
    if (event.key === " " || event.key === "Enter") {
      togglePlayback(player);
    } else {
      if (event.key === "ArrowRight") player.seek(player.position + step);
      else if (event.key === "ArrowLeft") player.seek(player.position - step);
      else if (event.key === "Home") player.seek(0);
      else return;
      // A held arrow key repeats; count the gesture once.
      if (!event.repeat) track("seeked", { via: "keyboard" });
    }
    event.preventDefault();
  };

  return (
    <div className="vfd strip">
      <canvas
        ref={zoomRef}
        className="strip-zoom"
        aria-hidden="true"
        onPointerDown={(event) => {
          if (!player) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          jog.current = { x: event.clientX, from: player.position, resume: player.playing };
          if (player.playing) player.pause();
          track("seeked", { via: "pointer" });
        }}
        onPointerMove={(event) => {
          const drag = jog.current;
          if (!drag || !player) return;
          const width = event.currentTarget.getBoundingClientRect().width;
          player.seek(drag.from - ((event.clientX - drag.x) / width) * windowSeconds);
        }}
        onPointerUp={() => {
          if (jog.current?.resume && player) void player.play();
          jog.current = null;
        }}
      />
      <div className="strip-times">
        <span ref={elapsedRef} className={buffer ? "lit" : "ghost"}>
          0:00
        </span>
        <span className="ghost">{bpm ? `${ZOOM_BEATS} BEATS` : "8 SEC"}</span>
        <span ref={remainingRef} className={buffer ? "lit" : "ghost"}>
          -0:00
        </span>
      </div>
      <canvas
        ref={overRef}
        className="strip-overview"
        role="slider"
        tabIndex={buffer ? 0 : -1}
        aria-label="Playback position"
        aria-valuemin={0}
        aria-valuemax={Math.round(buffer?.duration ?? 0)}
        aria-valuenow={0}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => {
          if (!player) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          seekOverview(event.clientX);
          track("seeked", { via: "pointer" });
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) seekOverview(event.clientX);
        }}
      />
    </div>
  );
}

function clock(seconds: number): string {
  return formatDuration(Math.max(0, Math.floor(seconds)));
}

function drawZoom(
  canvas: HTMLCanvasElement | null,
  peaks: Float32Array | null,
  beats: number[],
  bpm: number | null,
  position: number,
): void {
  if (!canvas) return;
  const { w, h, k } = fitCanvas(canvas);
  const g = canvas.getContext("2d");
  if (!g) return;
  g.clearRect(0, 0, w, h);
  if (!peaks) return;

  const span = bpm ? (ZOOM_BEATS * 60) / bpm : 8;
  const start = position - span / 2;
  const bar = 2 * k;
  const gap = k;
  const count = Math.floor(w / (bar + gap));
  const middle = h / 2 - 4 * k;
  const reach = h / 2 - 10 * k;
  for (let i = 0; i < count; i++) {
    const from = start + (i / count) * span;
    const to = start + ((i + 1) / count) * span;
    if (to < 0) continue;
    let peak = 0;
    for (let s = Math.max(0, Math.floor(from * RESOLUTION)); s <= Math.floor(to * RESOLUTION) && s < peaks.length; s++) {
      if (peaks[s]! > peak) peak = peaks[s]!;
    }
    const height = Math.max(k, peak * reach);
    g.fillStyle = `rgba(${PHOSPHOR}, ${from < position ? 0.95 : 0.38})`;
    g.fillRect(i * (bar + gap), middle - height, bar, height * 2);
  }

  g.font = `800 ${9 * k}px "Doto Variable", monospace`;
  for (let b = 0; b < beats.length; b++) {
    const t = beats[b]!;
    if (t < start) continue;
    if (t > start + span) break;
    const x = Math.round(((t - start) / span) * w);
    const down = b % 4 === 0;
    const tall = (down ? 8 : 5) * k;
    g.fillStyle = `rgba(${PHOSPHOR}, ${down ? 0.95 : 0.4})`;
    g.fillRect(x, h - tall, k * (down ? 2 : 1), tall);
    if (down) g.fillText(String(b / 4 + 1), x + 4 * k, h - k);
  }

  g.fillStyle = "rgba(255, 255, 255, 0.95)";
  g.shadowColor = `rgba(${PHOSPHOR}, 0.9)`;
  g.shadowBlur = 8 * k;
  g.fillRect(w / 2 - k, 0, 2 * k, h - 12 * k);
  g.shadowBlur = 0;
}

function drawOverview(
  canvas: HTMLCanvasElement | null,
  peaks: Float32Array | null,
  position: number,
  duration: number,
  decoding: boolean,
  now: number,
): void {
  if (!canvas) return;
  const { w, h, k } = fitCanvas(canvas);
  const g = canvas.getContext("2d");
  if (!g) return;
  g.clearRect(0, 0, w, h);
  if (decoding) {
    g.fillStyle = `rgba(${PHOSPHOR}, 0.6)`;
    g.fillRect(((now / 3) % (w + 40 * k)) - 40 * k, h / 2 - k, 40 * k, 2 * k);
    return;
  }
  if (!peaks || duration <= 0) return;
  const count = Math.floor(w / (2 * k));
  const per = peaks.length / count;
  const played = (position / duration) * w;
  for (let i = 0; i < count; i++) {
    let peak = 0;
    for (let s = Math.floor(i * per); s < Math.floor((i + 1) * per); s++) if (peaks[s]! > peak) peak = peaks[s]!;
    const x = i * 2 * k;
    const height = Math.max(k, peak * (h / 2 - 2 * k));
    g.fillStyle = `rgba(${PHOSPHOR}, ${x < played ? 0.9 : 0.3})`;
    g.fillRect(x, h / 2 - height, k, height * 2);
  }
  g.fillStyle = "#fff";
  g.fillRect(played - k / 2, 0, 1.5 * k, h);
}
