import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAnalysis } from "../analysis/useAnalysis.ts";
import { DEMOS } from "../audio/demo.ts";
import { Player } from "../audio/player.ts";
import { prettyKey, tempoNote, tuningNote } from "../display.ts";
import { extensionOf, track } from "../analytics.ts";
import { reducedMotion } from "../ticker.ts";
import { Display } from "./Display.tsx";
import { KeyRing } from "./KeyRing.tsx";
import { TuningPanel } from "./TuningPanel.tsx";
import { togglePlayback, Waveform } from "./Waveform.tsx";

/* The faceplate is drawn at one of two fixed sizes and scaled to fit, like an object on a desk. */
const WIDE = 1086;
const NARROW = 446;
const NARROW_BELOW = 780;
const LAMP_TEST_MS = 900;

export function Tool() {
  const { state, analyse, analyseDemo } = useAnalysis();
  const [dragging, setDragging] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [lampTest, setLampTest] = useState(() => !reducedMotion());
  const [narrow, setNarrow] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const bench = useRef<HTMLDivElement>(null);
  const device = useRef<HTMLDivElement>(null);
  const stage = useRef(state.stage);
  stage.current = state.stage;

  useEffect(() => {
    if (!state.buffer || !state.context) {
      setPlayer(null);
      return;
    }
    const created = new Player(state.context, state.buffer);
    setPlayer(created);
    return () => created.dispose();
  }, [state.buffer, state.context]);

  useEffect(() => {
    setPlaying(player?.playing ?? false);
    return player?.onChange(setPlaying);
  }, [player]);

  useLayoutEffect(() => {
    const wrap = bench.current;
    const plate = device.current;
    if (!wrap || !plate) return;
    const fit = () => {
      const width = wrap.clientWidth;
      const isNarrow = width < NARROW_BELOW;
      setNarrow(isNarrow);
      plate.style.zoom = String(Math.min(1.15, width / (isNarrow ? NARROW : WIDE)));
    };
    const observer = new ResizeObserver(fit);
    observer.observe(wrap);
    fit();
    return () => observer.disconnect();
  }, []);

  // Power-up: every segment lights for a moment, then the first demo track loads so the
  // device opens showing a real result. A file chosen in the meantime wins.
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setLampTest(false);
        if (stage.current === "idle") void analyseDemo(DEMOS[0]!, "startup");
      },
      reducedMotion() ? 0 : LAMP_TEST_MS,
    );
    return () => clearTimeout(timer);
  }, [analyseDemo]);

  const take = (files: FileList | null, method: "drop" | "picker") => {
    const file = files?.[0];
    if (!file) return;
    track("file_selected", {
      method,
      extension: extensionOf(file.name),
      mime: file.type,
      size_mb: Math.round((file.size / 1_000_000) * 10) / 10,
    });
    void analyse(file);
  };

  const searchingKey = state.stage === "analysing" && state.tuning !== null && state.key === null;

  return (
    <div className="bench" ref={bench}>
      <div
        ref={device}
        className="device"
        data-narrow={narrow}
        data-dragging={dragging}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          take(event.dataTransfer.files, "drop");
        }}
      >
        <div className="plate">
          <i className="screw" data-at="tl" />
          <i className="screw" data-at="tr" />
          <i className="screw" data-at="bl" />
          <i className="screw" data-at="br" />

          <input
            ref={input}
            className="visually-hidden"
            type="file"
            accept="audio/*"
            tabIndex={-1}
            onChange={(event) => {
              take(event.target.files, "picker");
              event.target.value = "";
            }}
          />

          <div className="plate-head">
            <span className="plate-brand">keyandbpm</span>
            <span className="plate-model">
              <b>KB-01</b>
              <span className="etch">key · tempo · tuning analyser</span>
            </span>
            <span className="grow" />
            <span className="plate-power">
              <span className="etch">runs in your browser</span>
              <i className="led" data-on="true" />
            </span>
          </div>

          <div className="plate-main">
            <section aria-label="Key">
              <Group name="key">circle of fifths</Group>
              <KeyRing musicalKey={state.key} searching={searchingKey} lampTest={lampTest} />
            </section>
            <section aria-label="Tempo display">
              <Group name="tempo">display</Group>
              <Display state={state} player={player} lampTest={lampTest} />
            </section>
            <section aria-label="Tuning" className="plate-tuning">
              <Group name="tuning">cents from a440</Group>
              <TuningPanel tuning={state.tuning} tempo={state.tempo} player={player} lampTest={lampTest} />
            </section>
          </div>

          <div className="plate-bottom">
            <section aria-label="Transport">
              <Group name="transport" />
              <div className="keys">
                <Key tone="orange" label="load" onPress={() => input.current?.click()} aria="Choose an audio file">
                  <path d="M7 1 12.5 7.5h-3.3V11H4.8V7.5H1.5z" />
                  <rect x="2" y="12" width="10" height="1.6" />
                </Key>
                <Key
                  label={playing ? "pause" : "play"}
                  led={playing}
                  disabled={!player}
                  onPress={() => player && togglePlayback(player)}
                  aria={playing ? "Pause" : "Play"}
                >
                  {playing ? (
                    <>
                      <rect x="2" y="1.5" width="3.6" height="11" />
                      <rect x="8.4" y="1.5" width="3.6" height="11" />
                    </>
                  ) : (
                    <path d="M2 1.2 12.6 7 2 12.8z" />
                  )}
                </Key>
                <Key label="cue" disabled={!player} onPress={() => player?.seek(0)} aria="Back to the start">
                  <rect x="1.5" y="1.5" width="2" height="11" />
                  <path d="M12.5 1.5v11L4.5 7z" />
                </Key>
              </div>
              <Group name="demo tracks">made in your browser</Group>
              <div className="presets">
                {DEMOS.map((demo, i) => (
                  <div className="preset" key={demo.id}>
                    <div className="key-well">
                      <button
                        type="button"
                        className="key key-small"
                        aria-label={`Demo track ${i + 1}: ${demo.label}`}
                        onClick={() => void analyseDemo(demo, "button")}
                      >
                        {i + 1}
                        <i className="led" data-on={state.demo?.id === demo.id} data-tone="green" />
                      </button>
                    </div>
                    <span className="etch">{demo.label}</span>
                  </div>
                ))}
              </div>
            </section>
            <section aria-label="Waveform" className="plate-strip">
              <Group name="waveform">needle search · beat grid</Group>
              <Waveform
                buffer={state.buffer}
                beats={state.tempo?.beats ?? []}
                bpm={state.tempo?.bpm ?? null}
                player={player}
                decoding={state.stage === "decoding"}
              />
            </section>
          </div>
        </div>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {[
          state.key ? `Key ${prettyKey(state.key)}, relative ${prettyKey(state.key.relative)}.` : "",
          state.tempo ? `Tempo ${state.tempo.bpm.toFixed(2)} bpm, ${tempoNote(state.tempo)}.` : "",
          state.tuning ? `Tuning ${state.tuning.hz.toFixed(1)} hertz, ${tuningNote(state.tuning)}.` : "",
        ].join(" ")}
      </p>
    </div>
  );
}

function Group({ name, children }: { name: string; children?: React.ReactNode }) {
  return (
    <div className="group etch">
      <b>{name}</b>
      {children}
    </div>
  );
}

interface KeyProps {
  label: string;
  aria: string;
  onPress: () => void;
  tone?: "orange";
  led?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

function Key({ label, aria, onPress, tone, led, disabled, children }: KeyProps) {
  return (
    <div className="key-well">
      <button type="button" className="key" data-tone={tone} aria-label={aria} disabled={disabled} onClick={onPress}>
        <span className="key-row">
          <span>{label}</span>
          {led === undefined ? null : <i className="led" data-on={led} data-tone="green" />}
        </span>
        <svg viewBox="0 0 14 14" aria-hidden="true">
          {children}
        </svg>
      </button>
    </div>
  );
}
