# vaibhav.portfolio

Personal portfolio site — built with Astro, TypeScript, and Motion.

## Stack

- **Astro v7** — static site generation, content collections, scoped component styles
- **TypeScript** (strict) — all scripts and data files
- **Motion v12** — scroll reveals, hero letter stagger
- **Zod** — content collection schemas
- **pnpm** — package manager

## Project Structure

```
src/
├── content.config.ts         # Content collection schema (case-study | note)
├── content/
│   └── work/*.md             # Case studies and notes — one markdown file each
├── layouts/
│   └── Layout.astro          # HTML shell, tokens, SEO tags, theme script, shared section CSS
├── pages/
│   ├── index.astro           # Home page composition
│   ├── robots.txt.ts         # robots.txt (adds the sitemap when SITE_URL is set)
│   └── work/[slug].astro     # Case study page, one per case-study entry
├── components/
│   ├── Nav.astro             # Sticky nav, theme toggle
│   ├── Hero.astro            # Avatar, name, lede, calls to action
│   ├── Projects.astro        # Case study cards + expandable note rows
│   ├── Experience.astro      # Work history rows (<details>)
│   ├── About.astro           # Bio, education and outside-work lines
│   ├── Stack.astro           # Marquee tech stack carousel + pause control
│   ├── Connect.astro         # Contact
│   ├── Footer.astro          # Copyright + pixel cat
│   └── ValidatorDemo.astro   # Interactive demo for the planning workspace case study
├── data/
│   ├── stack.ts              # StackChip[] per carousel row
│   ├── experience.ts         # ExperienceEntry[] (org, title, period, summary, highlights)
│   ├── education.ts          # EducationEntry[] (org, title, period), shown in About
│   └── connect.ts            # ConnectLink[] (label, text, href | null, icon paths)
└── scripts/
    ├── theme.ts              # Theme toggle, wipe animation, click sound
    ├── ambient.ts            # Cursor glow via CSS vars
    ├── carousel.ts           # Builds stack chips, marquee pause control
    ├── motion-hero.ts        # Letter stagger on hero name
    ├── motion-reveal.ts      # Scroll-triggered section reveals
    └── validator-demo.ts     # O(n²) vs indexed validator, timed in the browser
```

## Commands

| Command | Action |
| :--- | :--- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm astro check` | TypeScript + Astro diagnostics |

## Architecture Notes

- **CSS**: Scoped `<style>` per component. Only CSS vars, resets, and global overlays live in `Layout.astro`.
- **JS**: All client-side logic lives in `src/scripts/*.ts` and is imported by the component that owns it.
- **Content**: Case studies and notes are markdown in `src/content/work/` (schema in `src/content.config.ts`; `format: note` gives a home-page row with no page; `draft: true` hides an entry from production builds). Experience, education, stack and links are typed arrays in `src/data/*.ts`. Neither needs component HTML changes.
- **Dynamic DOM**: Components where JS creates elements at runtime (e.g. Stack) wrap those selectors in `:global()` inside their scoped style block.
- **Colour**: Components never hardcode colours. `--rule` is decorative only; control borders use `--border-control`, which holds 3:1 for WCAG 1.4.11.
- **Motion v12**: Uses `ease` (not `easing`), `startDelay` (not `start`), and `transform` as CSS string arrays.

## Deploying

Set `SITE_URL` to the production origin (for example `https://your-domain.com`) in the build
environment. It drives canonical URLs, absolute Open Graph URLs, the sitemap and the `Sitemap:`
line in `robots.txt`. Without it the build still succeeds but skips those.

### Hosting

The site is fully static, so any static host works. Cloudflare (Pages, or Workers with static
assets) or Vercel:

| Setting | Value |
| --- | --- |
| Build command | `pnpm build` |
| Output directory | `dist` |
| `NODE_VERSION` | `22` |
| `SITE_URL` | the free `*.pages.dev` / `*.vercel.app` URL until a domain is bought |

pnpm is pinned through `packageManager` in `package.json`, so the host builds with the same
version as local. GitHub Pages is not a good fit while the repo isn't named
`<user>.github.io`: the site would be served under a subpath and every root-relative link would
need Astro's `base`.

The Open Graph image is `public/og.png`; its source is `tools/og.html`, with the command to
regenerate it at the top of that file.
