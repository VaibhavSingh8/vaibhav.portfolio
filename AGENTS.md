# Agent Instructions

## Project Overview

This is a personal portfolio site built with Astro. The project uses pnpm, Astro single-file components, and global styling in `src/layouts/Layout.astro`.

## Environment

- Use Node.js `>=22.12.0`.
- Use `pnpm` as the package manager. The lockfile is `pnpm-lock.yaml`.
- Run commands from the repository root.

## Common Commands

- `pnpm install` - install dependencies.
- `pnpm dev` - start the Astro dev server, usually at `http://localhost:4321`.
- `pnpm build` - build the production site into `dist/`.
- `pnpm preview` - preview the production build locally.
- `pnpm astro check` - run Astro and TypeScript checks.

There is no separate lint or test script configured at the moment.

## Repository Structure

- `src/pages/` contains Astro routes.
- `src/layouts/Layout.astro` defines the base HTML shell, metadata, font links, and global CSS variables/styles.
- `src/components/` contains page components.
- `src/assets/` contains imported assets used by Astro components.
- `public/` contains static files served from the site root.

## Coding Guidelines

- Prefer Astro component patterns already present in the repo.
- Keep route-level composition in `src/pages/` and reusable UI in `src/components/`.
- Keep site-wide CSS, theme tokens, and base element styles in `src/layouts/Layout.astro`.
- Use component-scoped `<style>` blocks for styles that only apply to a single Astro component.
- Preserve TypeScript strictness from `tsconfig.json`; avoid unused locals and parameters.
- Keep edits narrowly scoped. Do not reformat unrelated files or replace existing user work.
- The current project has uncommitted work, so check `git status` before editing and avoid reverting changes you did not make.

## Design Notes

- The portfolio styling uses a restrained editorial feel with Inter, Instrument Serif, and JetBrains Mono.
- `Layout.astro` already defines light/dark theme tokens, accent colors, ambient effects, navigation styles, and responsive frame rules.
- Avoid introducing a separate design system unless the project grows enough to justify it.
- When adding UI, make sure it works cleanly on both mobile and desktop.

## Verification

Before handing off code changes, run:

```sh
pnpm build
```

For TypeScript or Astro API changes, also run:

```sh
pnpm astro check
```

For visual changes, start the dev server with `pnpm dev` and inspect the affected page in a browser.
