/**
 * A standalone page outside /blog/, such as a small tool. Each file in apps/web/pages/
 * default-exports one Page or an array of them; `build.ts` renders them with the guides'
 * shell and lists them in the sitemap and llms.txt.
 */
export type Page = RenderedPage | ExternalPage;

export interface RenderedPage {
  /** Absolute URL path starting and ending with "/", e.g. "/tap-tempo/" or "/key/a-minor/". */
  path: string;
  /** The <title> and the h1. Under 65 characters. */
  title: string;
  /** Meta description. 120 to 158 characters. */
  description: string;
  /** One to three plain-text sentences shown first, for answer engines to quote. */
  answer: string;
  /** HTML after the answer: h2, h3, p, ul, ol, table, pre, code, a, and any markup the script needs. */
  body: string;
  /** Plain text questions and answers, shown at the end and emitted as FAQPage data. May be empty. */
  faq: { q: string; a: string }[];
  /** Inline JavaScript, emitted as a module script at the end of the page. */
  script?: string;
}

/** A page whose HTML another build makes (a Vite entry, say). Only listed in the sitemap and llms.txt. */
export interface ExternalPage {
  path: string;
  title: string;
  description: string;
  external: true;
}
