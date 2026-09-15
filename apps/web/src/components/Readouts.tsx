import { formatBpm, type KeyResult, type TempoResult, type TuningResult } from "@keyandbpm/core";
import { prettyKey, tempoNote, tuningNote } from "../display.ts";
import { Pulse } from "./Pulse.tsx";
import type { Player } from "../audio/player.ts";

interface Props {
  musicalKey: KeyResult | null;
  tempo: TempoResult | null;
  tuning: TuningResult | null;
  player: Player | null;
}

export function Readouts({ musicalKey, tempo, tuning, player }: Props) {
  return (
    <div className="readouts" aria-live="polite">
      <Readout
        label="key"
        value={musicalKey ? prettyKey(musicalKey) : null}
        note={
          musicalKey
            ? `shares its notes with ${prettyKey(musicalKey.relative)}, strength ${musicalKey.strength.toFixed(2)}`
            : null
        }
      />
      <Readout
        label="tempo"
        value={tempo ? `${formatBpm(tempo.bpm)} bpm` : null}
        note={tempo ? tempoNote(tempo) : null}
        adornment={<Pulse tempo={tempo} player={player} />}
      />
      <Readout
        label="tuning"
        value={tuning ? `${tuning.hz.toFixed(1)} Hz` : null}
        note={tuning ? tuningNote(tuning) : null}
      />
    </div>
  );
}

interface ReadoutProps {
  label: string;
  value: string | null;
  note: string | null;
  adornment?: React.ReactNode;
}

function Readout({ label, value, note, adornment }: ReadoutProps) {
  return (
    <div className="readout">
      <div className="readout-label">
        {label}
        {adornment}
      </div>
      <div className="readout-value" data-pending={value === null}>
        {value ?? "—"}
      </div>
      <div className="readout-note">{note ?? "measuring"}</div>
    </div>
  );
}
