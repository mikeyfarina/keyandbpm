# keyandbpm

## Web pages

The site at whatkeyandbpm.com is three kinds of page, each built a different way:

- **The analyser apps** are Vite entries: `apps/web/index.html` and `apps/web/432-hz-checker/index.html`. A new app page needs its own HTML file *and* an entry in `build.rollupOptions.input` in `apps/web/vite.config.ts`, or Vite never builds it. Each mounts the React tool via `#tool`; `data-verdict="432"` on that mount switches on the 432 Hz answer.
- **Guides** are `apps/web/blog/posts/*.ts`, typed by `blog/post.ts`.
- **Standalone static pages** (the key pages, tap tempo, BPM to ms) are `apps/web/pages/*.ts`, typed by `blog/page.ts`. A file default-exports one page or an array. A page built by Vite instead is listed here as an `ExternalPage` (`external: true`) so it still reaches the sitemap and `llms.txt`.

`apps/web/blog/build.ts` renders guides and pages to static HTML, plus `sitemap.xml` and `llms.txt`, in `apps/web/generated/`, which is gitignored. The `guides` plugin in `vite.config.ts` runs it on every `vite build` and dev start, re-runs it in dev when anything in `blog/` or `pages/` changes, serves `generated/` in dev and copies it into `dist/`. Nothing it produces is committed, and nothing generated belongs in `public/`. Never add a page outside `pages/` or it drops out of the sitemap.

The build fails on: a title over 65 characters, a description outside 120 to 158, an `h1` in a body, or any internal `href="/..."` that doesn't resolve to a guide, a page or a file in `public/`. So a link to a new page can only go in once the page exists.

`answer` fields are plain text and get escaped; links go in `body`. Pages that need form controls link `/tools.css` from their body, since the guide stylesheet has none.

## The site's address

The canonical URL in `apps/web/index.html` is the source of truth. `build.ts` reads it for every generated page, and the copy key reads it at runtime. `432-hz-checker/index.html` hardcodes the address too, so a domain change must edit both HTML files.

## Music helpers

Key naming, relative keys and `camelot()` live in `packages/core/src/keys.ts`. Use them rather than re-deriving; the web display and the key pages share them.
