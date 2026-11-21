# Agent Instructions

## Project Overview

Personal portfolio site for Vaibhav Singh. Built with Astro v7, TypeScript (strict), Motion v12, Zod and pnpm.

Two route types: the home page (`/`), composed from 11 components, and one case study page per
markdown file in the `work` content collection (`/work/<slug>`).

## Environment

- Node.js `>=22.12.0`
- `pnpm` as package manager — lockfile is `pnpm-lock.yaml`
- Run all commands from the repository root

## Common Commands

```sh
pnpm install          # install dependencies
pnpm dev              # dev server at http://localhost:4321
pnpm build            # production build → dist/
pnpm preview          # preview production build
pnpm astro check      # TypeScript + Astro diagnostics (run before committing)
```

No separate lint or test script is configured.

## Repository Structure

```
src/
├── content.config.ts         # Content collection schemas (Zod)
├── content/work/*.md         # Case studies — one file per piece of work
├── layouts/Layout.astro      # HTML shell — design tokens, resets, shared section CSS
├── pages/
│   ├── index.astro           # Home page — composition of all components
│   └── work/[slug].astro     # Case study page, generated per content file
├── components/               # One component per section (see list below)
├── data/                     # Typed content arrays — edit these to update copy
└── scripts/                  # Client-side TS modules — imported by components
```

### Components

| File | Owns |
| --- | --- |
| `Nav.astro` | Sticky nav, theme toggle |
| `Hero.astro` | Avatar, name, tagline, status pill |
| `Hatch.astro` | Section dividers — plain dashed rule, no props |
| `About.astro` | Bio bullets, currently widget cards |
| `Connect.astro` | Social chip links, buildstrip |
| `Stack.astro` | Two-row marquee carousel + pause control |
| `Projects.astro` | Case study cards, read from the `work` collection |
| `Experience.astro` | Work history rows as `<details>`/`<summary>` |
| `Education.astro` | Education rows |
| `Quote.astro` | Pull quote block |
| `Footer.astro` | Copyright + pixel cat SVG |

### Data Files (`src/data/`)

Edit these to update content — no component HTML changes needed:

- `stack.ts` — `StackChip[]` grouped by row (`1 | 2 | 3`)
- `experience.ts` — `ExperienceEntry[]` (org, location, title, type, period, summary, highlights, tags)
- `education.ts` — `EducationEntry[]` (org, title, period)
- `connect.ts` — `ConnectLink[]` (label, href, paths, filled)

### Scripts (`src/scripts/`)

Each script is imported by exactly one component (or Layout):

| Script | Imported by |
| --- | --- |
| `theme.ts` | `Nav.astro` |
| `motion-hero.ts` | `Hero.astro` |
| `carousel.ts` | `Stack.astro` |
| `ambient.ts`, `interactions.ts`, `motion-reveal.ts` | `Layout.astro` |

## Coding Guidelines

### CSS

- Use scoped `<style>` blocks — one per component.
- `Layout.astro` holds only: design tokens (`:root`, `[data-theme="dark"]`), `*`/`html`/`body` resets, the global `:focus-visible` ring, `.skip-link`, `.sr-only`, the shared `main section` / `main h2.section` rules, `.theme-wipe`, `.frame`, `.ambient`, `.dot-grid`, and the global `prefers-reduced-motion` block. Its `<head>` also holds the blocking inline theme script and the SEO tags.
- Do not redeclare `section { margin-top }` or `h2.section` in a component — they are defined once in `Layout.astro`.
- Do not add component-specific CSS to `Layout.astro`.
- For elements created by JS at runtime (e.g. carousel chips), wrap the selectors in `:global()` inside the owning component's `<style>` block.
- Never hardcode a colour in a component — every colour is a token in `Layout.astro`.
- Surfaces: `--bg`, `--bg-2`, `--card`, `--chip`, `--bg-glow`. Text: `--ink`, `--ink-2`, `--ink-3`.
- Lines: `--rule` and `--rule-2` are **decorative hairlines only**. Borders on buttons and links must use `--border-control`, which is kept at 3:1 contrast for WCAG 1.4.11.
- Accent: `--accent`, `--accent-ink`, `--accent-soft`, `--accent-faint`, `--accent-edge`.
- Translucent surfaces: `--nav-bg`, `--overlay-bg`, `--card-soft`. Also `--live`, `--live-ring`, `--shadow`, `--hatch`, `--grid-dot`.
- Layout: `--measure`, `--gutter`, `--frame-inset`.
- Typography lives in three CSS vars, never hardcode a font string in a component: `--font-sans` (Inter — body copy, labels), `--font-mono` (IBM Plex Mono — meta text, tags, terminal-style bits), `--font-display` (Bricolage Grotesque — section headers, hero name, italic accent moments like the "currently" widget values and pull quote).
- For a repeated-row layout that needs columns to align across rows (see `About.astro`'s `.currently` widget), make the parent `display: grid` with the real column tracks and give each row `grid-template-columns: subgrid; grid-column: 1 / -1`. Do not give each row its own independent `grid-template-columns` — the tracks size per-row instead of sharing one layout, which misaligns content across rows.

### TypeScript

- Strictest tsconfig — `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess` are all on.
- Do not add `// @ts-ignore` or cast to `any` to silence errors — fix the root cause.
- Async calls in sync event handlers: use `void asyncFn()` pattern.

### Motion v12

The project uses `motion` v12 (re-exports from `framer-motion/dom`). Key API differences from v11:

- `ease` not `easing`
- `startDelay` not `start` in stagger options
- `transform` as CSS string array is valid: `['translateY(8px)', 'translateY(0)']`
- No CDN guard needed — it's a build-time dependency
- `.finished` returns a Promise — use `await animate(...).finished` for sequencing

### Content Changes

- **Case studies** live in `src/content/work/*.md`. The filename is the URL slug. Frontmatter is
  validated against the Zod schema in `src/content.config.ts` — add a field there before using it.
  `draft: true` keeps an entry visible in `pnpm dev` but out of the production build.
- **Everything else** (experience, education, stack chips, social links) is a typed array in
  `src/data/`. Components read these at build time.

### Accessibility

This site is being taken to WCAG 2.2 AA. Do not regress:

- Anything auto-moving for more than 5s needs a real pause control (SC 2.2.2). Hover-to-pause does
  not count — no keyboard, no touch. See the marquee toggle in `Stack.astro`.
- Control borders use `--border-control`, not `--rule` (SC 1.4.11, 3:1).
- Interactive things must be real `<button>`/`<a>` elements, not `<div>`s with click handlers.
- Every page has a skip link to `<main id="main">`, and focus uses the one global `:focus-visible`
  ring from `Layout.astro`. Don't remove outlines without a visible replacement.
- `--ink-3` is tuned to 4.5:1 on every surface, including hatch stripes. Check contrast before
  darkening a surface or lightening a text token.
- Content that's decorative or duplicated (animated letters, marquee copies) is `aria-hidden`, with
  an `.sr-only` equivalent beside it.
- The theme is set by the inline script in `<head>` before first paint. Don't move theme
  initialisation back into a module script; that brings the flash back.
- Keep the global `prefers-reduced-motion` block working; if a control must override it, scope the
  override to an explicit user action (see `Stack.astro`).

## Verification

Before committing any change:

```sh
pnpm astro check   # must show 0 errors, 0 warnings
pnpm build         # must complete without errors
```

For visual changes, also run `pnpm dev` and check both light and dark themes on desktop and mobile viewport.
