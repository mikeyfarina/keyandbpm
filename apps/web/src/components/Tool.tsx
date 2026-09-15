import { useEffect, useMemo, useRef, useState } from "react";
import { pitchClassOf } from "@keyandbpm/core";
import { progressOf, useAnalysis, type AnalysisState } from "../analysis/useAnalysis.ts";
import { Player } from "../audio/player.ts";
import { keyHue } from "../keyColor.ts";
import { duration } from "../display.ts";
import { Readouts } from "./Readouts.tsx";
import { Waveform } from "./Waveform.tsx";

const FORMATS = "mp3, wav, m4a, flac, ogg, opus";

export function Tool() {
  const { state, analyse, reset } = useAnalysis();
  const [dragging, setDragging] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state.buffer || !state.context) {
      setPlayer(null);
      return;
    }
    const created = new Player(state.context, state.buffer);
    setPlayer(created);
    return () => created.dispose();
  }, [state.buffer, state.context]);

  const style = useMemo(() => {
    if (!state.key) return undefined;
    return {
      "--key-hue": String(keyHue(state.key, pitchClassOf(state.key.tonic))),
      "--key-chroma": "0.145",
    } as React.CSSProperties;
  }, [state.key]);

  const take = (files: FileList | null) => {
    const file = files?.[0];
    if (file) void analyse(file);
  };

  const idle = state.stage === "idle";

  return (
    <div
      className="panel"
      data-state={state.stage}
      style={style}
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
        take(event.dataTransfer.files);
      }}
    >
      <input
        ref={input}
        className="visually-hidden"
        type="file"
        accept="audio/*"
        onChange={(event) => {
          take(event.target.files);
          event.target.value = "";
        }}
      />

      {state.error ? <p className="error">{state.error}</p> : null}

      {idle ? (
        <div
          className="drop"
          data-dragging={dragging}
          role="button"
          tabIndex={0}
          onClick={() => input.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              input.current?.click();
            }
          }}
        >
          <span className="drop-headline">Drop an audio file here</span>
          <span className="drop-hint">or click to choose one</span>
          <span className="drop-formats">{FORMATS}</span>
        </div>
      ) : (
        <>
          <div className="filebar">
            <span className="filebar-name" title={state.fileName ?? ""}>
              {state.fileName}
              {state.buffer ? `, ${duration(state.buffer.duration)}` : ""}
            </span>
            <button type="button" onClick={() => input.current?.click()}>
              analyse another
            </button>
          </div>

          <Readouts
            musicalKey={state.key}
            tempo={state.tempo}
            tuning={state.tuning}
            player={player}
          />

          {state.buffer && player ? (
            <Waveform buffer={state.buffer} beats={state.tempo?.beats ?? []} player={player} />
          ) : null}

          {state.stage === "done" ? null : (
            <div className="status" style={{ "--progress": progressOf(state) } as React.CSSProperties}>
              <span>{stepLabel(state)}</span>
              <span className="status-bar" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function stepLabel(state: AnalysisState): string {
  if (state.stage === "decoding") return "reading the file";
  if (!state.tempo) return "finding the beat";
  if (!state.key) return "finding the key";
  if (!state.tuning) return "checking the tuning";
  return "refining the tempo";
}
