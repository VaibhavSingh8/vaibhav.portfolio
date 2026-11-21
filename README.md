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
├── content.config.ts         # Content collection schemas
├── content/
│   └── work/*.md             # Case studies — one markdown file each
├── layouts/
│   └── Layout.astro          # HTML shell, design tokens, shared section CSS
├── pages/
│   ├── index.astro           # Home page composition
│   └── work/[slug].astro     # Case study page, one per content file
├── components/
│   ├── Nav.astro             # Sticky nav, theme toggle
│   ├── Hero.astro            # Avatar, name, tagline, status
│   ├── About.astro           # Bio bullets, currently widget
│   ├── Connect.astro         # Social/contact chip links
│   ├── Hatch.astro           # Section dividers (prop-driven)
│   ├── Stack.astro           # Marquee tech stack carousel + pause control
│   ├── Projects.astro        # Case study cards, read from the work collection
│   ├── Experience.astro      # Work history rows (<details>)
│   ├── Education.astro       # Education rows
│   ├── Quote.astro           # Pull quote
│   └── Footer.astro          # Copyright + pixel cat
├── data/
│   ├── stack.ts              # StackChip[] per carousel row
│   ├── experience.ts         # ExperienceEntry[] (org, title, period, summary, highlights)
│   ├── education.ts          # EducationEntry[] (org, title, period)
│   └── connect.ts            # ConnectLink[] (label, href, svgPath)
└── scripts/
    ├── theme.ts              # Theme toggle, wipe animation, click sound
    ├── ambient.ts            # Cursor glow via CSS vars
    ├── typewriter.ts         # Tagline phrase cycling
    ├── carousel.ts           # Builds stack chips, marquee pause control
    ├── interactions.ts       # Chip ripple origin
    ├── motion-hero.ts        # Letter stagger on hero name
    └── motion-reveal.ts      # Scroll-triggered section reveals
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
- **Content**: Case studies are markdown in `src/content/work/` (schema in `src/content.config.ts`; `draft: true` hides an entry from production builds). Experience, education, stack and links are typed arrays in `src/data/*.ts`. Neither needs component HTML changes.
- **Dynamic DOM**: Components where JS creates elements at runtime (e.g. Stack) wrap those selectors in `:global()` inside their scoped style block.
- **Colour**: Components never hardcode colours. `--rule` is decorative only; control borders use `--border-control`, which holds 3:1 for WCAG 1.4.11.
- **Motion v12**: Uses `ease` (not `easing`), `startDelay` (not `start`), and `transform` as CSS string arrays. Lightbox uses FLIP via `animate(...).finished`.
