/** One guide under /blog/. `build.ts` renders every file in `posts/` into a static page. */
export interface Post {
  /** URL segment: /blog/<slug>/. Lowercase words joined by hyphens. */
  slug: string;
  /** Used for the <title> and the h1. Under 65 characters. */
  title: string;
  /** Meta description and the index card's summary. 120 to 158 characters. */
  description: string;
  /** ISO date, e.g. "2026-09-29". */
  published: string;
  /** The direct answer to the title's question, one to three sentences of plain text. It is shown first because answer engines quote the opening paragraph. */
  answer: string;
  /** The article after the answer, as HTML: h2, h3, p, ul, ol, table, pre, code, a, strong, em. */
  body: string;
  /** Plain text questions and answers, shown at the end and emitted as FAQPage data. */
  faq: { q: string; a: string }[];
  /** Slugs of other posts to link at the end. */
  related: string[];
}
