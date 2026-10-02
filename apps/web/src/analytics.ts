import type { PostHog } from "posthog-js";

/**
 * Every event the site sends, and exactly what it carries. Nothing here may hold audio,
 * a file name, or anything else read out of the user's file: the page promises that
 * only anonymous usage counts leave the machine.
 */
export interface Events {
  file_selected: { method: "drop" | "picker"; extension: string; mime: string; size_mb: number };
  decode_failed: { extension: string; mime: string };
  file_too_long: { minutes: number };
  first_result_shown: { ms: number };
  analysis_completed: {
    decode_ms: number;
    analysis_ms: number;
    total_ms: number;
    track_seconds: number;
    key: string;
    key_strength: number;
    bpm: number;
    tempo_confidence: string;
    tuning_cents: number;
  };
  analysis_failed: { stage: "analysis" | "worker_start"; message: string };
  analysis_replaced: { during: "decoding" | "analysis" };
  wasm_ready: { ms: number };
  playback_started: { position_s: number };
  seeked: { via: "pointer" | "keyboard" };
  demo_loaded: { demo: string; via: "startup" | "button" };
  result_copied: { demo: boolean };
}

/**
 * The PostHog project token. It is public by design: it only initialises the SDK and
 * captures events, it reaches no private data, and this bundle already serves it to every
 * visitor. Keeping it in source rather than an environment file means a fresh clone and CI
 * both build with analytics intact, with nothing to wire up. The secret counterpart is the
 * personal key beginning phx_, which must never appear here.
 */
const PROJECT_TOKEN = "phc_zJ7ZRe9e5XwTDgKcoE3oAJ53E2jpz9L2dxZGh4hKkGRn";

let client: PostHog | null = null;
let disabled = false;
const queue: Array<(posthog: PostHog) => void> = [];

function send(call: (posthog: PostHog) => void): void {
  if (disabled) return;
  if (client) call(client);
  else queue.push(call);
}

export function track<E extends keyof Events>(event: E, properties: Events[E]): void {
  send((posthog) => posthog.capture(event, properties));
}

export function reportError(error: unknown, properties: Record<string, unknown> = {}): void {
  send((posthog) => posthog.captureException(error, properties));
}

/** Lower-cased extension without the dot; the only part of a file name that is sent. */
export function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot > 0 ? fileName.slice(dot + 1).toLowerCase() : "";
}

/**
 * Loaded after the page renders so it never delays the analyser. Events tracked before
 * then are queued and sent once PostHog is up.
 */
export async function startAnalytics(): Promise<void> {
  const key = import.meta.env.VITE_POSTHOG_KEY ?? PROJECT_TOKEN;
  if (!key) {
    // Only reachable when VITE_POSTHOG_KEY is set to an empty string, which is how a fork
    // turns analytics off, or points at its own project, without editing this file.
    console.info("Analytics off: VITE_POSTHOG_KEY is empty.");
    disabled = true;
    queue.length = 0;
    return;
  }
  const { default: posthog } = await import("posthog-js");
  posthog.init(key, {
    api_host: import.meta.env.VITE_POSTHOG_HOST ?? "https://us.i.posthog.com",
    defaults: "2026-08-30",
    // No cookies or storage, so no consent banner. The project must have cookieless mode enabled.
    cookieless_mode: "always",
    // The file name is on screen; replay would carry it off the machine.
    disable_session_recording: true,
    capture_exceptions: true,
    capture_performance: { web_vitals: true },
  });
  client = posthog;
  for (const call of queue.splice(0)) call(posthog);
}
