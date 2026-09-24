/**
 * Plays a decoded buffer and reports where the playhead is. Position is read
 * straight from the audio clock rather than pushed through React, so the waveform
 * and the beat pulse can follow it at frame rate without re-rendering anything.
 */
export class Player {
  private source: AudioBufferSourceNode | null = null;
  private startedAt = 0;
  private offset = 0;
  private resuming: Promise<void> | null = null;
  private listeners = new Set<(playing: boolean) => void>();

  constructor(
    private readonly context: AudioContext,
    private readonly buffer: AudioBuffer,
  ) {}

  get playing(): boolean {
    return this.source !== null;
  }

  get duration(): number {
    return this.buffer.duration;
  }

  get position(): number {
    if (!this.source) return this.offset;
    return Math.min(this.duration, this.offset + (this.context.currentTime - this.startedAt));
  }

  onChange(listener: (playing: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async play(): Promise<void> {
    // A second click while the context wakes would otherwise start a second source nothing can stop.
    if (this.source || this.resuming) return;
    if (this.context.state === "suspended") {
      this.resuming = this.context.resume();
      try {
        await this.resuming;
      } finally {
        this.resuming = null;
      }
    }
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.context.destination);
    source.onended = () => {
      if (this.source !== source) return;
      this.source = null;
      this.offset = 0;
      this.announce();
    };
    source.start(0, this.offset);
    this.startedAt = this.context.currentTime;
    this.source = source;
    this.announce();
  }

  pause(): void {
    if (!this.source) return;
    const at = this.position;
    const source = this.source;
    this.source = null;
    source.onended = null;
    source.stop();
    this.offset = at;
    this.announce();
  }

  toggle(): void {
    if (this.playing) this.pause();
    else void this.play();
  }

  seek(seconds: number): void {
    const target = Math.max(0, Math.min(this.duration, seconds));
    if (this.playing) {
      this.pause();
      this.offset = target;
      void this.play();
    } else {
      this.offset = target;
      this.announce();
    }
  }

  dispose(): void {
    this.pause();
    this.listeners.clear();
  }

  private announce(): void {
    for (const listener of this.listeners) listener(this.playing);
  }
}
