# Agent Instructions

## Project Overview

Personal portfolio site for Vaibhav Singh. Built with Astro v5, TypeScript (strict), Motion v12, and pnpm. One static page (`/`) composed from 13 components.

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
├── layouts/Layout.astro      # HTML shell only — global CSS vars, resets, overlays
├── pages/index.astro         # Single page — composition of all components
├── components/               # One component per section (see list below)
├── data/                     # Typed content arrays — edit these to update copy
└── scripts/                  # Client-side TS modules — imported by components
```

### Components

| File | Owns |
| --- | --- |
| `Nav.astro` | Sticky nav, theme toggle |
| `Hero.astro` | Avatar, name, tagline, status pill |
| `Hatch.astro` | Section dividers — props: `mark`, `label` |
| `About.astro` | Bio bullets, currently widget cards |
| `Connect.astro` | Social chip links, buildstrip |
| `Stack.astro` | Three-row marquee carousel |
| `ContribGrid.astro` | GitHub-style contribution heatmap |
| `Projects.astro` | Project cards + FLIP lightbox overlay |
| `Experience.astro` | Expandable work history rows |
| `Education.astro` | Education rows |
| `Quote.astro` | Pull quote block |
| `Footer.astro` | Copyright + pixel cat SVG |

### Data Files (`src/data/`)

Edit these to update content — no component HTML changes needed:

- `stack.ts` — `StackChip[]` grouped by row (`1 | 2 | 3`)
- `projects.ts` — `Project[]` (id, badge, thumbLabel, kicker, title, description, links)
- `experience.ts` — `ExperienceEntry[]` (org, title, type, period, tags, description)
- `education.ts` — `EducationEntry[]` (org, title, period)
- `connect.ts` — `ConnectLink[]` (label, href, paths, filled)

### Scripts (`src/scripts/`)

Each script is imported by exactly one component (or Layout):

| Script | Imported by |
| --- | --- |
| `theme.ts` | `Nav.astro` |
| `typewriter.ts`, `motion-hero.ts` | `Hero.astro` |
| `carousel.ts` | `Stack.astro` |
| `contrib-grid.ts` | `ContribGrid.astro` |
| `motion-lightbox.ts` | `Projects.astro` |
| `expandable.ts` | `Experience.astro` |
| `ambient.ts`, `meteors.ts`, `interactions.ts`, `motion-reveal.ts` | `Layout.astro` |

## Coding Guidelines

### CSS

- Use scoped `<style>` blocks — one per component.
- `Layout.astro` holds only: CSS custom properties (`:root`, `[data-theme="dark"]`), `*`/`html`/`body` resets, `.theme-wipe`, `.frame`, `.ambient`, `.meteors`, `main`, `.dot-grid`, `.tip`, `.tweaks`.
- Do not add component-specific CSS to `Layout.astro`.
- For elements created by JS at runtime (e.g. carousel chips, contrib grid cells), wrap the selectors in `:global()` inside the owning component's `<style>` block.
- CSS custom properties for theming: `--bg`, `--bg-2`, `--ink`, `--ink-2`, `--ink-3`, `--rule`, `--rule-2`, `--card`, `--accent`, `--accent-ink`, `--shadow`, `--hatch`, `--grid-dot`.

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

To update projects, experience, education, stack chips, or social links — edit the relevant file in `src/data/` only. The components read from these typed arrays at build time.

## Verification

Before committing any change:

```sh
pnpm astro check   # must show 0 errors, 0 warnings
pnpm build         # must complete without errors
```

For visual changes, also run `pnpm dev` and check both light and dark themes on desktop and mobile viewport.
