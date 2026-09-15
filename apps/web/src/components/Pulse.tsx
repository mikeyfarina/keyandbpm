import { useEffect, useRef } from "react";
import type { TempoResult } from "@keyandbpm/core";
import type { Player } from "../audio/player.ts";

interface Props {
  tempo: TempoResult | null;
  player: Player | null;
}

/**
 * Ticks once per beat so the tempo can be checked by eye. While the track plays it
 * follows the detected beat positions exactly; when paused it keeps time from the bpm.
 */
export function Pulse({ tempo, player }: Props) {
  const dot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = dot.current;
    if (!node || !tempo || tempo.bpm <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const period = 60 / tempo.bpm;
    let frame = 0;
    let lastBeat = -1;
    let litUntil = 0;

    const tick = () => {
      const playing = player?.playing ?? false;
      const now = performance.now() / 1000;
      const beat = playing
        ? countBeatsBefore(tempo.beats, player!.position)
        : Math.floor(now / period);

      if (beat !== lastBeat) {
        lastBeat = beat;
        litUntil = now + 0.09;
        node.dataset.lit = "true";
      } else if (now > litUntil && node.dataset.lit === "true") {
        node.dataset.lit = "false";
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      node.dataset.lit = "false";
    };
  }, [tempo, player]);

  return <span ref={dot} className="pulse" data-lit="false" aria-hidden="true" />;
}

function countBeatsBefore(beats: number[], position: number): number {
  let count = 0;
  for (const beat of beats) {
    if (beat > position) break;
    count++;
  }
  return count;
}
