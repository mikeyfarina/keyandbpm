import { useEffect, useRef } from "react";
import { confidenceLabel, formatDuration, isConcertPitch, pitchClassOf, type Scale } from "@keyandbpm/core";
import type { AnalysisState } from "../analysis/useAnalysis.ts";
import type { Player } from "../audio/player.ts";
import { beatAt, onFrame } from "../ticker.ts";

interface Props {
  state: AnalysisState;
  player: Player | null;
  lampTest: boolean;
}

/** The analyser's passes in the order the worker reports them. */
const PASSES = ["decode", "beat", "tune", "key", "lock"] as const;

/**
 * A vacuum fluorescent display: one phosphor colour, unlit segments faintly visible,
 * and annunciators that light as each pass of the analysis lands.
 */
export function Display({ state, player, lampTest }: Props) {
  const { stage, tempo, tuning, key, error } = state;
  const beatCells = useRef<Array<HTMLElement | null>>([]);
  const barText = useRef<HTMLSpanElement>(null);

  const landed = {
    decode: stage !== "decoding" && stage !== "idle",
    beat: tempo !== null,
    tune: tuning !== null,
    key: key !== null,
    lock: tempo?.method === "accurate",
  };
  const working = stage === "decoding" || stage === "analysing";
  const next = working ? PASSES.find((pass) => !landed[pass]) : undefined;

  const locked = tempo?.method === "accurate";
  const unsure = locked && tempo && confidenceLabel(tempo) === "unreliable";
  const digits = tempo ? tempo.bpm.toFixed(2) : null;

  // The beat counter follows the detected beat positions, not a clock, so it proves the grid.
  const beats = tempo?.beats;
  useEffect(() => {
    let last = -2;
    return onFrame(() => {
      const index = player && beats?.length ? beatAt(beats, player.position) : -1;
      if (index === last) return;
      last = index;
      const inBar = index < 0 ? -1 : index % 4;
      const lit = player?.playing ?? false;
      beatCells.current.forEach((cell, i) => cell?.setAttribute("data-on", String(lit && i <= inBar)));
      if (barText.current) {
        barText.current.textContent = index < 0 ? "BAR ---.-" : `BAR ${String(Math.floor(index / 4) + 1).padStart(3, "0")}.${inBar + 1}`;
      }
    });
  }, [beats, player]);

  return (
    <div className="vfd display" data-test={lampTest} data-stage={stage}>
      <div className="display-ann">
        {PASSES.map((pass) => (
          <Ann key={pass} on={landed[pass]} blink={pass === next}>
            {pass.toUpperCase()}
          </Ann>
        ))}
        <span className="grow" />
        {state.demo ? <Ann on>DEMO</Ann> : null}
        <Ann on={tuning !== null && isConcertPitch(tuning)}>A440</Ann>
      </div>

      <div className="display-bpm">
        <SevenSegment text={digits} chase={stage === "decoding"} />
        <div className="display-bpm-side">
          <Ann on={tempo !== null}>BPM</Ann>
          <Ann on={tempo !== null && !locked}>FAST</Ann>
          <Ann on={Boolean(unsure)}>UNSURE</Ann>
        </div>
      </div>

      <div className="display-beats">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} ref={(node) => void (beatCells.current[i] = node)} data-on="false" />
        ))}
        <span className="grow" />
        <span ref={barText} className={tempo ? "lit" : "ghost"}>BAR ---.-</span>
      </div>

      {error ? (
        <p className="display-error lit" role="alert">
          <span>ERROR</span> {error}
        </p>
      ) : stage === "idle" ? (
        <div className="display-idle">
          <span className="lit">INSERT TRACK</span>
          <span className="lit">Drop an audio file anywhere on the device, or press load. It is measured here and never uploaded.</span>
        </div>
      ) : (
        <>
          <div className="display-key">
            <Lit on={key !== null}>{key ? `${key.tonic} ${key.scale === "minor" ? "MIN" : "MAJ"}` : "--- ---"}</Lit>
            <Lit on={key !== null}>{key ? camelot(key.tonic, key.scale) : "--"}</Lit>
            <small className={key ? "lit" : "ghost"}>
              REL {key ? `${key.relative.tonic} ${key.relative.scale === "minor" ? "MIN" : "MAJ"}` : "--- ---"}
            </small>
          </div>
          <div className="display-strength">
            <Ann on={key !== null}>STR</Ann>
            <span className="display-bars">
              {Array.from({ length: 10 }, (_, i) => (
                <i key={i} data-on={key !== null && i < Math.round(key.strength * 10)} />
              ))}
            </span>
            <Lit on={key !== null}>{key ? key.strength.toFixed(2).replace(/^0/, "") : ".--"}</Lit>
          </div>
        </>
      )}

      <div className="display-file lit">
        <span className="ph-no-capture">{state.fileName ?? "NO TRACK"}</span>
        <span>{state.buffer ? formatDuration(state.buffer.duration) : "-:--"}</span>
      </div>
    </div>
  );
}

/** The Camelot code DJ software prints: minor keys are A, majors B, numbered round the circle of fifths from 8B = C. */
function camelot(tonic: string, scale: Scale): string {
  const pitch = pitchClassOf(tonic);
  const major = scale === "minor" ? (pitch + 3) % 12 : pitch;
  return `${((major * 7 + 7) % 12) + 1}${scale === "minor" ? "A" : "B"}`;
}

function Ann({ on, blink = false, children }: { on: boolean; blink?: boolean; children: React.ReactNode }) {
  return <span className={blink ? "lit blink" : on ? "lit" : "ghost"}>{children}</span>;
}

function Lit({ on, children }: { on: boolean; children: React.ReactNode }) {
  return <span className={on ? "lit" : "ghost"}>{children}</span>;
}

/* Hexagonal segments on a 44 x 80 cell, set italic like the tubes in DJ decks. */
const W = 44;
const H = 80;
const T = 8;
const G = 1.6;
const PITCH = 54;
const L = T / 2;
const R = W - T / 2;
const M = H / 2;
const horizontal = (x0: number, x1: number, y: number) =>
  `${x0},${y} ${x0 + T / 2},${y - T / 2} ${x1 - T / 2},${y - T / 2} ${x1},${y} ${x1 - T / 2},${y + T / 2} ${x0 + T / 2},${y + T / 2}`;
const vertical = (x: number, y0: number, y1: number) =>
  `${x},${y0} ${x + T / 2},${y0 + T / 2} ${x + T / 2},${y1 - T / 2} ${x},${y1} ${x - T / 2},${y1 - T / 2} ${x - T / 2},${y0 + T / 2}`;
const SEGMENTS = {
  a: horizontal(L + G, R - G, T / 2),
  b: vertical(R, T / 2 + G, M - G),
  c: vertical(R, M + G, H - T / 2 - G),
  d: horizontal(L + G, R - G, H - T / 2),
  e: vertical(L, M + G, H - T / 2 - G),
  f: vertical(L, T / 2 + G, M - G),
  g: horizontal(L + G, R - G, M),
};
const GLYPHS: Record<string, string> = {
  "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc",
  "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg", "-": "g", " ": "",
};

function SevenSegment({ text, chase }: { text: string | null; chase: boolean }) {
  const [whole = "", fraction = ""] = text ? text.split(".") : [];
  const chars = text ? [...whole.padStart(3, " ").slice(-3), ...fraction.padEnd(2, "0").slice(0, 2)] : ["-", "-", "-", "-", "-"];
  return (
    <svg className="seg" viewBox={`-4 -2 ${PITCH * 5 + 18} ${H + 6}`} aria-hidden="true" data-chase={chase}>
      {chars.map((char, i) => (
        <g key={i} transform={`translate(${i * PITCH + (i >= 3 ? 16 : 0)} 0) skewX(-7)`} style={{ "--i": i } as React.CSSProperties}>
          {Object.entries(SEGMENTS).map(([name, points]) => (
            <polygon key={name} points={points} data-seg={name} data-on={!chase && (GLYPHS[char] ?? "").includes(name)} />
          ))}
        </g>
      ))}
      <circle cx={PITCH * 3 + 2} cy={H - 3} r={4.5} data-on={Boolean(text) && !chase} />
    </svg>
  );
}
