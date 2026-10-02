#!/usr/bin/env bun
/*
  Renders every guide in posts/ to blog/<slug>/index.html, writes the /blog/ index, renders
  the standalone pages in ../pages/ at their own paths, and writes sitemap.xml and llms.txt,
  all into apps/web/generated/. Guides are plain HTML with no JavaScript, so crawlers and
  answer engines read the whole article without running anything.

  The guides plugin in vite.config.ts runs this on every build and dev start, serves
  generated/ in dev and copies it into dist/. Run it by hand to check posts without Vite.
*/
import { Glob } from "bun";
import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { Page, RenderedPage } from "./page.ts";
import type { Post } from "./post.ts";

const here = import.meta.dir;
const web = dirname(here);
const pub = join(web, "public");
const gen = join(web, "generated");
const out = join(gen, "blog");

// The canonical address lives in index.html; everything here follows it.
const indexHtml = await readFile(join(web, "index.html"), "utf8");
const canonical = indexHtml.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
if (!canonical) throw new Error("index.html has no <link rel=\"canonical\">, so the blog cannot know the site's address.");
const SITE = canonical.replace(/\/$/, "");
const AUTHOR = { name: "Mike Farina", url: "https://github.com/mikeyfarina" };

const posts: Post[] = [];
for await (const file of new Glob("posts/*.ts").scan(here)) {
  const mod = await import(join(here, file));
  if (!mod.default) throw new Error(`${file} has no default export.`);
  posts.push(mod.default as Post);
}
const pages: Page[] = [];
for await (const file of new Glob("*.ts").scan(join(web, "pages"))) {
  const mod = await import(join(web, "pages", file));
  if (!mod.default) throw new Error(`pages/${file} has no default export.`);
  pages.push(...[mod.default as Page | Page[]].flat());
}
validate(posts, pages);
posts.sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title));
const bySlug = new Map(posts.map((p) => [p.slug, p]));

// Stale pages from renamed or deleted posts must not linger, so the folder is rebuilt whole.
if (existsSync(gen)) await rm(gen, { recursive: true });
await mkdir(join(out, "fonts"), { recursive: true });
for (const [pkg, file] of [
  ["@fontsource-variable/archivo", "archivo-latin-wdth-normal.woff2"],
  ["@fontsource/ibm-plex-mono", "ibm-plex-mono-latin-400-normal.woff2"],
  ["@fontsource/ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff2"],
]) {
  await copyFile(Bun.resolveSync(`${pkg}/files/${file}`, web), join(out, "fonts", file));
}
await copyFile(join(here, "blog.css"), join(out, "blog.css"));

for (const post of posts) {
  await mkdir(join(out, post.slug), { recursive: true });
  await writeFile(join(out, post.slug, "index.html"), renderPost(post));
}
await writeFile(join(out, "index.html"), renderIndex());

const rendered = pages.filter((p): p is RenderedPage => !("external" in p));
for (const page of rendered) {
  await mkdir(join(gen, page.path), { recursive: true });
  await writeFile(join(gen, page.path, "index.html"), renderPage(page));
}

await writeFile(join(gen, "sitemap.xml"), renderSitemap());
await writeFile(join(gen, "llms.txt"), renderLlms());
console.log(`Wrote ${posts.length} guides and ${rendered.length} pages; listed ${pages.length - rendered.length} external pages`);

function validate(all: Post[], allPages: Page[]): void {
  const problems: string[] = [];
  const slugs = new Set<string>();
  const paths = new Set(["/", "/blog/"]);
  for (const p of all) {
    const at = p.slug ?? "(no slug)";
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) problems.push(`${at}: slug must be lowercase words joined by hyphens`);
    if (slugs.has(p.slug)) problems.push(`${at}: slug used twice`);
    slugs.add(p.slug);
    if (p.title.length > 65) problems.push(`${at}: title is ${p.title.length} characters, over 65`);
    if (p.description.length < 120 || p.description.length > 158) problems.push(`${at}: description is ${p.description.length} characters, outside 120 to 158`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.published)) problems.push(`${at}: published must be YYYY-MM-DD`);
    if (p.faq.length < 3) problems.push(`${at}: needs at least 3 FAQ entries`);
    if (/<h1/i.test(p.body)) problems.push(`${at}: body must not contain an h1; the title is the h1`);
    paths.add(`/blog/${p.slug}/`);
  }
  for (const p of allPages) {
    const at = p.path ?? "(no path)";
    if (!/^\/([a-z0-9]+(-[a-z0-9]+)*\/)+$/.test(p.path)) problems.push(`${at}: path must look like /word/ or /word/word/`);
    if (p.path.startsWith("/blog/")) problems.push(`${at}: /blog/ belongs to the guides`);
    if (paths.has(p.path)) problems.push(`${at}: path used twice`);
    paths.add(p.path);
    if (p.title.length > 65) problems.push(`${at}: title is ${p.title.length} characters, over 65`);
    if (p.description.length < 120 || p.description.length > 158) problems.push(`${at}: description is ${p.description.length} characters, outside 120 to 158`);
    if (!("external" in p) && /<h1/i.test(p.body)) problems.push(`${at}: body must not contain an h1; the title is the h1`);
  }
  for (const p of all) {
    for (const r of p.related) if (!slugs.has(r)) problems.push(`${p.slug}: related slug "${r}" does not exist`);
  }
  // Every internal link must land on a guide, a page, or a file in public/.
  const bodies = [
    ...all.map((p) => [`/blog/${p.slug}/`, p.body] as const),
    ...allPages.flatMap((p) => ("external" in p ? [] : [[p.path, p.body] as const])),
  ];
  for (const [from, body] of bodies) {
    for (const [, href] of body.matchAll(/href="(\/[^"#?]*)/g)) {
      if (!paths.has(href!) && !existsSync(join(pub, href!))) problems.push(`${from}: links to ${href}, which does not exist`);
    }
  }
  if (problems.length) throw new Error(`Guides and pages failed validation:\n  ${problems.join("\n  ")}`);
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function jsonLd(data: unknown): string {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

function shell(opts: { title: string; description: string; path: string; ogType: string; head: string; main: string }): string {
  const url = `${SITE}${opts.path}`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(opts.title)}</title>
    <meta name="description" content="${esc(opts.description)}" />
    <link rel="canonical" href="${url}" />
    <meta name="theme-color" content="#0e0e0f" />
    <meta property="og:type" content="${opts.ogType}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(opts.title)}" />
    <meta property="og:description" content="${esc(opts.description)}" />
    <meta property="og:image" content="${SITE}/og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="The KB-01 analyser showing A minor, 8A, 92.95 BPM and A4 = 438.5 Hz" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/icon.svg" type="image/svg+xml" />
    <link rel="preload" href="/blog/fonts/archivo-latin-wdth-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/blog/blog.css" />
    ${opts.head}
  </head>
  <body>
    <header class="masthead">
      <a class="wordmark" href="/">keyandbpm</a>
      <nav class="masthead-nav">
        <a href="/">analyser</a>
        <a href="/blog/">guides</a>
        <a href="https://github.com/mikeyfarina/keyandbpm">source</a>
      </nav>
    </header>
${opts.main}
    <footer class="colophon">
      <p>
        Free and open source under the AGPL, by <a href="${AUTHOR.url}">${AUTHOR.name}</a>.
        Analysis by <a href="https://essentia.upf.edu/">Essentia</a>.
      </p>
    </footer>
  </body>
</html>
`;
}

function renderPost(p: Post): string {
  const path = `/blog/${p.slug}/`;
  const date = new Date(`${p.published}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const related = p.related.map((s) => bySlug.get(s)!);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: p.title,
        description: p.description,
        datePublished: p.published,
        dateModified: p.published,
        mainEntityOfPage: `${SITE}${path}`,
        author: { "@type": "Person", ...AUTHOR },
        publisher: { "@type": "Organization", name: "keyandbpm", url: `${SITE}/` },
      },
      {
        "@type": "FAQPage",
        mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "keyandbpm", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE}/blog/` },
          { "@type": "ListItem", position: 3, name: p.title, item: `${SITE}${path}` },
        ],
      },
    ],
  };
  const main = `    <main class="article">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/blog/">Guides</a></nav>
      <h1>${esc(p.title)}</h1>
      <p class="byline">By <a href="${AUTHOR.url}">${AUTHOR.name}</a> · <time datetime="${p.published}">${date}</time></p>
      <p class="answer">${esc(p.answer)}</p>
${p.body.trim().replace(/^/gm, "      ")}
      <aside class="try">
        <p><strong>Check a track now.</strong> Drop any audio file into the <a href="/">key and BPM finder</a> to read its key, tempo and tuning. It runs in your browser, so the file is never uploaded.</p>
      </aside>
      <section class="faq">
        <h2>Questions people ask</h2>
${p.faq.map((f) => `        <h3>${esc(f.q)}</h3>\n        <p>${esc(f.a)}</p>`).join("\n")}
      </section>
${related.length ? `      <section class="related">
        <h2>Keep reading</h2>
        <ul>
${related.map((r) => `          <li><a href="/blog/${r.slug}/">${esc(r.title)}</a></li>`).join("\n")}
        </ul>
      </section>` : ""}
    </main>`;
  return shell({ title: p.title, description: p.description, path, ogType: "article", head: jsonLd(data), main });
}

function renderPage(p: RenderedPage): string {
  const graph: unknown[] = [
    { "@type": "WebPage", name: p.title, description: p.description, url: `${SITE}${p.path}` },
  ];
  if (p.faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  const main = `    <main class="article">
      <h1>${esc(p.title)}</h1>
      <p class="answer">${esc(p.answer)}</p>
${p.body.trim().replace(/^/gm, "      ")}
${p.faq.length ? `      <section class="faq">
        <h2>Questions people ask</h2>
${p.faq.map((f) => `        <h3>${esc(f.q)}</h3>\n        <p>${esc(f.a)}</p>`).join("\n")}
      </section>` : ""}
    </main>${p.script ? `\n    <script type="module">\n${p.script.trim()}\n    </script>` : ""}`;
  return shell({ title: p.title, description: p.description, path: p.path, ogType: "website", head: jsonLd({ "@context": "https://schema.org", "@graph": graph }), main });
}

function renderIndex(): string {
  const title = "Guides to key, BPM, tuning and finding samples";
  const description = "Plain answers on finding a song's key and BPM, matching samples to a beat, harmonic mixing, tuning and tagging your library, from the people who built keyandbpm.";
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${SITE}/blog/`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/blog/${p.slug}/`, name: p.title })),
    },
  };
  const main = `    <main class="article index">
      <h1>Guides</h1>
      <p class="answer">Straight answers about key, tempo and tuning: how to find them, what they mean, and what to do with them once you have them.</p>
      <ul class="cards">
${posts.map((p) => `        <li>
          <a href="/blog/${p.slug}/">${esc(p.title)}</a>
          <p>${esc(p.description)}</p>
        </li>`).join("\n")}
      </ul>
    </main>`;
  return shell({ title: `${title} | keyandbpm`, description, path: "/blog/", ogType: "website", head: jsonLd(data), main });
}

function renderSitemap(): string {
  const newest = posts[0]?.published;
  const entries = [
    { loc: `${SITE}/`, priority: "1.0" },
    { loc: `${SITE}/blog/`, priority: "0.8", lastmod: newest },
    ...posts.map((p) => ({ loc: `${SITE}/blog/${p.slug}/`, priority: "0.7", lastmod: p.published })),
    ...[...pages].sort((a, b) => a.path.localeCompare(b.path)).map((p) => ({ loc: `${SITE}${p.path}`, priority: "0.8", lastmod: undefined })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url>
    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}
    <priority>${e.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

function renderLlms(): string {
  const line = (title: string, path: string, description: string) => `- [${title}](${SITE}${path}): ${description}`;
  const sorted = [...pages].sort((a, b) => a.path.localeCompare(b.path));
  return `# keyandbpm

> Free, open-source tool that finds the musical key, tempo in BPM and tuning reference of an audio file. The analysis runs in the browser with a WebAssembly build of Essentia, so the audio is never uploaded.

## Tools

${line("Key and BPM finder", "/", "Drop an audio file to read its key, relative key, tempo with a beat grid, and tuning in Hz and cents from A440.")}
${sorted.map((p) => line(p.title, p.path, p.description)).join("\n")}

## Guides

${posts.map((p) => line(p.title, `/blog/${p.slug}/`, p.description)).join("\n")}
`;
}
