/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** PostHog project token. Public by design; it only permits sending events. */
  readonly VITE_POSTHOG_KEY?: string;
  readonly VITE_POSTHOG_HOST?: string;
}
