# vaibhav.portfolio

Personal portfolio site — built with Astro, TypeScript, and Motion.

## Stack

- **Astro v5** — static site generation, scoped component styles
- **TypeScript** (strict) — all scripts and data files
- **Motion v12** — scroll reveals, hero letter stagger, FLIP lightbox
- **pnpm** — package manager

## Project Structure

```
src/
├── layouts/
│   └── Layout.astro          # HTML shell, global CSS vars, overlays
├── pages/
│   └── index.astro           # Page composition
├── components/
│   ├── Nav.astro             # Sticky nav, theme toggle
│   ├── Hero.astro            # Avatar, name, tagline, status
│   ├── About.astro           # Bio bullets, currently widget
│   ├── Connect.astro         # Social/contact chip links
│   ├── Hatch.astro           # Section dividers (prop-driven)
│   ├── Stack.astro           # Marquee tech stack carousel
│   ├── ContribGrid.astro     # GitHub-style contribution heatmap
│   ├── Projects.astro        # Data-driven project cards + FLIP lightbox
│   ├── Experience.astro      # Expandable work history rows
│   ├── Education.astro       # Education rows
│   ├── Quote.astro           # Pull quote
│   └── Footer.astro          # Copyright + pixel cat
├── data/
│   ├── stack.ts              # StackChip[] per carousel row
│   ├── projects.ts           # Project[] (id, badge, title, desc, links)
│   ├── experience.ts         # ExperienceEntry[] (org, title, period, tags, desc)
│   ├── education.ts          # EducationEntry[] (org, title, period)
│   └── connect.ts            # ConnectLink[] (label, href, svgPath)
└── scripts/
    ├── theme.ts              # Theme toggle, wipe animation, accent hue, audio
    ├── ambient.ts            # Cursor glow via CSS vars
    ├── meteors.ts            # Canvas star + meteor animation
    ├── typewriter.ts         # Tagline phrase cycling
    ├── carousel.ts           # Builds stack chips from data
    ├── contrib-grid.ts       # Seeded RNG heatmap + tooltips
    ├── expandable.ts         # [data-expand] row click handler
    ├── interactions.ts       # Magnetic hover, chip ripple, view counter
    ├── motion-hero.ts        # Letter stagger on hero name
    ├── motion-reveal.ts      # Scroll-triggered section reveals
    └── motion-lightbox.ts    # FLIP animation for project lightbox
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
- **Content**: Edit `src/data/*.ts` to update projects, experience, education, stack, and links — no touching component HTML needed.
- **Dynamic DOM**: Components where JS creates elements at runtime (Stack, ContribGrid) wrap those selectors in `:global()` inside their scoped style block.
- **Motion v12**: Uses `ease` (not `easing`), `startDelay` (not `start`), and `transform` as CSS string arrays. Lightbox uses FLIP via `animate(...).finished`.
