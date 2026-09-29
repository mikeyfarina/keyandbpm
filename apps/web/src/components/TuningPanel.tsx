import { useEffect, useRef } from "react";
import { isConcertPitch, type TempoResult, type TuningResult } from "@keyandbpm/core";
import type { Player } from "../audio/player.ts";
import { beatAt, fitCanvas, onFrame, reducedMotion } from "../ticker.ts";

interface Props {
  tuning: TuningResult | null;
  tempo: TempoResult | null;
  player: Player | null;
  lampTest: boolean;
}

/* The meter face: pivot below the window, ±50 cents across 90 degrees. */
const CX = 130;
const CY = 176;
const R = 138;
const DEG_PER_CENT = 0.9;
const INK = "#2a2011";
const on = (radius: number, cents: number): [number, number] => {
  const a = (cents * DEG_PER_CENT * Math.PI) / 180;
  return [CX + radius * Math.sin(a), CY - radius * Math.cos(a)];
};
const arc = (radius: number, from: number, to: number) => {
  const [x0, y0] = on(radius, from);
  const [x1, y1] = on(radius, to);
  return `M${x0} ${y0}A${radius} ${radius} 0 0 1 ${x1} ${y1}`;
};

/**
 * Rows of strobe dots as on a turntable platter, one per reference pitch. Under the lamp
 * a row stands still only when the record plays at that row's pitch, so the still row
 * names the tuning. The offsets are in cents from A440.
 */
const STROBE_ROWS = [
  { label: "432", cents: -31.8, pitch: 9 },
  { label: "440", cents: 0, pitch: 10 },
  { label: "448", cents: 31.2, pitch: 11 },
];

export function TuningPanel({ tuning, tempo, player, lampTest }: Props) {
  const needle = useRef<SVGPolygonElement>(null);
  const shadow = useRef<SVGPolygonElement>(null);
  const strobe = useRef<HTMLCanvasElement>(null);
  const live = useRef({ tuning, tempo, player, lampTest });
  live.current = { tuning, tempo, player, lampTest };

  useEffect(() => {
    let angle = -50;
    let velocity = 0;
    let lastBeat = -1;
    const offsets = STROBE_ROWS.map(() => 0);
    return onFrame((dt) => {
      const { tuning, tempo, player, lampTest } = live.current;
      const playing = player?.playing ?? false;

      // Pinned left until there is a reading, then a damped swing onto it.
      const target = lampTest ? 50 : tuning ? Math.max(-50, Math.min(50, tuning.cents)) : -50;
      if (reducedMotion()) angle = target;
      else {
        velocity = (velocity + (target - angle) * 0.035) * 0.84;
        angle += velocity;
        // The kick drum nudges a real meter; this one twitches on each detected beat.
        const beat = tempo && player ? beatAt(tempo.beats, player.position) : -1;
        if (playing && beat !== lastBeat && beat >= 0) velocity += 0.55;
        lastBeat = beat;
      }
      const degrees = (angle * DEG_PER_CENT).toFixed(2);
      needle.current?.setAttribute("transform", `translate(${CX} ${CY}) rotate(${degrees})`);
      shadow.current?.setAttribute("transform", `translate(${CX + 3} ${CY + 4}) rotate(${degrees})`);

      const canvas = strobe.current;
      if (!canvas) return;
      const { w, h, k } = fitCanvas(canvas);
      const g = canvas.getContext("2d");
      if (!g) return;
      g.clearRect(0, 0, w, h);
      if (!tuning && !lampTest) return;
      const lamp = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.62);
      lamp.addColorStop(0, "rgba(255, 90, 40, 1)");
      lamp.addColorStop(1, "rgba(255, 90, 40, 0.18)");
      const rowHeight = h / STROBE_ROWS.length;
      STROBE_ROWS.forEach((row, i) => {
        if (playing && tuning && !reducedMotion()) offsets[i]! += (tuning.cents - row.cents) * 0.9 * dt;
        const y = rowHeight * (i + 0.5);
        const step = row.pitch * k;
        const dotHeight = rowHeight * 0.42;
        g.fillStyle = lamp;
        const gutter = 34 * k;
        for (let x = ((((offsets[i]! * k) % step) + step) % step) - step + gutter; x < w; x += step) {
          if (x > gutter - 4 * k) g.fillRect(x, y - dotHeight / 2, step / 2, dotHeight);
        }
        const still = tuning !== null && Math.abs(tuning.cents - row.cents) < 1.5;
        g.font = `500 ${8 * k}px "IBM Plex Mono", monospace`;
        g.textBaseline = "middle";
        g.fillStyle = `rgba(255, 140, 90, ${still || lampTest ? 0.95 : 0.35})`;
        g.fillText(row.label, 6 * k, y);
      });
    });
  }, []);

  const hz = tuning ? tuning.hz.toFixed(1) : "---.-";
  const cents = !tuning ? "---" : isConcertPitch(tuning) ? "CONCERT" : `${tuning.cents > 0 ? "+" : "-"}${Math.abs(tuning.cents)} CT`;

  return (
    <>
      <div className="meter">
        <div className="meter-face">
          <svg viewBox="0 0 260 150" aria-hidden="true">
            <defs>
              <filter id="needle-shadow" x="-50%" y="-10%" width="200%" height="130%">
                <feGaussianBlur stdDeviation="1.4" />
              </filter>
            </defs>
            <path d={arc(R, -50, 50)} fill="none" stroke={INK} strokeWidth={1.2} />
            <path d={arc(R + 5, -1, 1)} fill="none" stroke="#2e6a3c" strokeWidth={5} />
            {Array.from({ length: 21 }, (_, i) => {
              const c = i * 5 - 50;
              const major = c % 25 === 0;
              const [x0, y0] = on(R - (major ? 12 : 6), c);
              const [x1, y1] = on(R, c);
              const [tx, ty] = on(R - 23, c);
              return (
                <g key={c}>
                  <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={INK} strokeWidth={major ? 1.6 : 0.9} />
                  {major ? (
                    <text x={tx} y={ty} className="meter-num">
                      {Math.abs(c)}
                    </text>
                  ) : null}
                </g>
              );
            })}
            {([[-36, "♭"], [36, "♯"]] as const).map(([c, glyph]) => {
              const [x, y] = on(R - 58, c);
              return (
                <text key={glyph} x={x} y={y} className="meter-glyph">
                  {glyph}
                </text>
              );
            })}
            <text x={CX} y={92} className="meter-title">CENTS</text>
            <text x={CX} y={106} className="meter-sub">A = 440 HZ</text>
            <polygon ref={shadow} points={`-1.6,0 1.6,0 .45,${-R - 6} -.45,${-R - 6}`} className="meter-needle-shadow" filter="url(#needle-shadow)" />
            <polygon ref={needle} points={`-1.5,0 1.5,0 .4,${-R - 6} -.4,${-R - 6}`} className="meter-needle" />
            <path d="M0 150V131Q130 108 260 131V150Z" fill="#0d0d0d" />
            <path d="M0 131Q130 108 260 131" fill="none" stroke="rgba(255,255,255,.12)" />
            <text x={CX} y={140} className="meter-cover">KB · ±50¢</text>
          </svg>
        </div>
        <div className="meter-glass" />
      </div>
      <div className="strobe">
        <canvas ref={strobe} aria-hidden="true" />
      </div>
      <div className="strobe-caption">
        <span className="etch">strobe</span>
        <span className="etch">still row = the record's pitch</span>
      </div>
      <div className="vfd tuning-readout" data-test={lampTest}>
        <span className={tuning ? "lit" : "ghost"}>{hz}</span>
        <small className={tuning ? "lit" : "ghost"}>HZ</small>
        <span className="grow" />
        <span className={`tuning-cents ${tuning ? "lit" : "ghost"}`}>{cents}</span>
      </div>
    </>
  );
}
