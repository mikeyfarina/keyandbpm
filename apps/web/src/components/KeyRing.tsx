import { useEffect, useRef } from "react";
import { keyName, pitchClassOf, type KeyResult } from "@keyandbpm/core";
import { keyHue } from "../keyColor.ts";
import { onFrame, reducedMotion } from "../ticker.ts";

/** Major keys clockwise round the circle of fifths from C at the top; each relative minor sits inside it. */
const FIFTHS = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];
const OUTER_LED = 127;
const INNER_LED = 101;

const pretty = (tonic: string) => tonic.replace("b", "♭").replace("#", "♯");
const at = (radius: number, degrees: number): [number, number] => [
  radius * Math.sin((degrees * Math.PI) / 180),
  -radius * Math.cos((degrees * Math.PI) / 180),
];

interface Props {
  musicalKey: KeyResult | null;
  /** The key pass is running: the lights chase and the pointer spins until it lands. */
  searching: boolean;
  lampTest: boolean;
}

/**
 * The key as a position on the circle of fifths. The lit point is the answer; the dim
 * points beside it are the keys that mix cleanly with it, which is what the Camelot
 * wheel in DJ software encodes as the neighbouring numbers and the other letter.
 */
export function KeyRing({ musicalKey, searching, lampTest }: Props) {
  const pointer = useRef<HTMLDivElement>(null);

  const minor = musicalKey?.scale === "minor";
  const position = musicalKey
    ? FIFTHS.indexOf(minor ? (pitchClassOf(musicalKey.tonic) + 3) % 12 : pitchClassOf(musicalKey.tonic))
    : -1;
  const hue = musicalKey ? keyHue(pitchClassOf(musicalKey.tonic), musicalKey.scale) : 0;

  const target = useRef(0);
  target.current = position < 0 ? 0 : position * 30;
  const spinning = useRef(searching);
  spinning.current = searching;

  useEffect(() => {
    let angle = 0;
    let velocity = 0;
    return onFrame((dt) => {
      const node = pointer.current;
      if (!node) return;
      if (spinning.current && !reducedMotion()) {
        angle += dt * 400;
        velocity = 0;
      } else {
        const goal = target.current + 360 * Math.round((angle - target.current) / 360);
        if (reducedMotion()) angle = goal;
        else {
          velocity = (velocity + (goal - angle) * 0.06) * 0.74;
          angle += velocity;
        }
      }
      node.style.transform = `rotate(${angle.toFixed(2)}deg)`;
    });
  }, []);

  const state = (ring: "outer" | "inner", i: number): "on" | "near" | "off" => {
    if (!musicalKey || searching) return "off";
    const mine = (ring === "inner") === minor;
    const step = (i - position + 12) % 12;
    if (mine && step === 0) return "on";
    if ((mine && (step === 1 || step === 11)) || (!mine && step === 0)) return "near";
    return "off";
  };

  return (
    <div
      className="ring"
      data-searching={searching}
      data-test={lampTest}
      style={{ "--key-hue": hue } as React.CSSProperties}
    >
      <div className="ring-well" />
      <svg viewBox="-170 -170 340 340" aria-hidden="true">
        <defs>
          <filter id="led-glow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle r={163} className="ring-edge" />
        {[140, 114, 88].map((r) => (
          <g key={r}>
            <circle r={r} className="ring-groove" />
            <circle r={r + 1} className="ring-groove-lip" />
          </g>
        ))}
        {FIFTHS.map((pc, i) => {
          const [x0, y0] = at(140, i * 30 + 15);
          const [x1, y1] = at(163, i * 30 + 15);
          const [ox, oy] = at(152, i * 30);
          const [ix, iy] = at(75, i * 30);
          const outer = state("outer", i);
          const inner = state("inner", i);
          return (
            <g key={pc}>
              <line x1={x0} y1={y0} x2={x1} y2={y1} className="ring-tick" />
              <Led radius={OUTER_LED} index={i} state={outer} />
              <Led radius={INNER_LED} index={i} state={inner} />
              <text x={ox} y={oy} className="ring-label" data-lit={outer !== "off"}>
                {pretty(keyName(pc, "major").tonic)}
              </text>
              <text x={ix} y={iy} className="ring-label ring-label-minor" data-lit={inner !== "off"}>
                {pretty(keyName(pc + 9, "minor").tonic)}m
              </text>
            </g>
          );
        })}
      </svg>
      <div className="ring-cap">
        <div className="ring-pointer" ref={pointer} />
      </div>
    </div>
  );
}

function Led({ radius, index, state }: { radius: number; index: number; state: "on" | "near" | "off" }) {
  const [x, y] = at(radius, index * 30);
  return (
    <g transform={`translate(${x} ${y})`} className="ring-led" data-state={state} style={{ "--i": index } as React.CSSProperties}>
      <circle r={6.5} className="ring-led-socket" />
      <circle r={5} className="ring-led-lens" />
      <circle cx={-1.6} cy={-1.8} r={1.4} className="ring-led-glint" />
    </g>
  );
}
