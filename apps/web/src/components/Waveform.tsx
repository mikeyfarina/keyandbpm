import { useEffect, useRef, useState } from "react";
import { peaksFor } from "../audio/peaks.ts";
import type { Player } from "../audio/player.ts";

const BAR_PITCH = 3;

interface Props {
  buffer: AudioBuffer;
  beats: number[];
  player: Player;
}

/** The waveform doubles as proof: if the beat marks land with the snare, the tempo is right. */
export function Waveform({ buffer, beats, player }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(player.playing);
  // Beats arrive twice (fast, then accurate) after the waveform is up. Reading them through a
  // ref means a new beat list only repaints, instead of re-scanning the whole track for peaks.
  const beatsRef = useRef(beats);
  const redrawRef = useRef<(() => void) | null>(null);

  useEffect(() => player.onChange(setPlaying), [player]);

  useEffect(() => {
    beatsRef.current = beats;
    redrawRef.current?.();
  }, [beats]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let peaks = new Float32Array();
    let width = 0;
    let height = 0;
    let colors = readColors(canvas);

    const draw = () => {
      const marks = beatsRef.current;
      ctx.clearRect(0, 0, width, height);
      const middle = height / 2;
      const playedTo = (player.position / buffer.duration) * width;

      for (let b = 0; b < peaks.length; b++) {
        const x = b * BAR_PITCH;
        const amplitude = Math.max(1, peaks[b]! * (height / 2) * 0.92);
        ctx.fillStyle = x <= playedTo ? colors.signal : colors.quiet;
        ctx.fillRect(x, middle - amplitude, BAR_PITCH - 1, amplitude * 2);
      }

      // Every beat of a long track would smear into a dotted line, so mark bars
      // instead once the beats crowd together, and nothing at all when even those would.
      const spacing = marks.length > 1 ? width / marks.length : width;
      const every = spacing >= 7 ? 1 : spacing * 4 >= 7 ? 4 : 0;
      if (every > 0) {
        ctx.fillStyle = colors.mark;
        for (let i = 0; i < marks.length; i += every) {
          ctx.fillRect(Math.floor((marks[i]! / buffer.duration) * width), height - 6, 1, 6);
        }
      }

      if (player.position > 0) {
        ctx.fillStyle = colors.signal;
        ctx.fillRect(Math.floor(playedTo), 0, 1, height);
      }

      const announced = String(Math.round(player.position));
      if (wrap.getAttribute("aria-valuenow") !== announced) {
        wrap.setAttribute("aria-valuenow", announced);
      }
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, Math.floor(wrap.clientWidth));
      height = Math.max(1, Math.floor(canvas.clientHeight));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      colors = readColors(canvas);
      peaks = peaksFor(buffer.getChannelData(0), Math.max(1, Math.floor(width / BAR_PITCH)));
      draw();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    // Drawing follows the player directly rather than React state, so a seek while
    // paused repaints the playhead straight away instead of waiting for a render.
    let frame = 0;
    const loop = () => {
      draw();
      frame = requestAnimationFrame(loop);
    };
    const follow = (isPlaying: boolean) => {
      if (isPlaying) {
        if (!frame) frame = requestAnimationFrame(loop);
      } else {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        draw();
      }
    };
    const unfollow = player.onChange(follow);
    follow(player.playing);
    redrawRef.current = draw;

    return () => {
      redrawRef.current = null;
      observer.disconnect();
      unfollow();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [buffer, player]);

  const seekTo = (clientX: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    player.seek(((clientX - rect.left) / rect.width) * buffer.duration);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === "ArrowRight") player.seek(player.position + step);
    else if (event.key === "ArrowLeft") player.seek(player.position - step);
    else if (event.key === "Home") player.seek(0);
    else if (event.key === " " || event.key === "Enter") player.toggle();
    else return;
    event.preventDefault();
  };

  return (
    <div className="wave">
      <button
        type="button"
        className="wave-play"
        onClick={() => player.toggle()}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div
        ref={wrapRef}
        className="wave-canvas-wrap"
        role="slider"
        tabIndex={0}
        aria-label="Playback position"
        aria-valuemin={0}
        aria-valuemax={Math.round(buffer.duration)}
        aria-valuenow={Math.round(player.position)}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          seekTo(event.clientX);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) seekTo(event.clientX);
        }}
      >
        <canvas ref={canvasRef} className="wave-canvas" />
      </div>
    </div>
  );
}

function readColors(element: HTMLElement): { signal: string; quiet: string; mark: string } {
  const styles = getComputedStyle(element);
  return {
    signal: styles.getPropertyValue("--signal").trim(),
    quiet: styles.getPropertyValue("--ink-quiet").trim(),
    mark: styles.getPropertyValue("--rule").trim(),
  };
}

function PlayIcon() {
  return (
    <svg width="13" height="15" viewBox="0 0 13 15" aria-hidden="true">
      <path d="M1 1.2 12 7.5 1 13.8Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="11" height="14" viewBox="0 0 11 14" aria-hidden="true">
      <path d="M0 0h3.6v14H0zM7.4 0H11v14H7.4z" fill="currentColor" />
    </svg>
  );
}
