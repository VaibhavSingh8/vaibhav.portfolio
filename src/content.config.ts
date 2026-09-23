import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

/**
 * Case studies. One markdown file per piece of work in `src/content/work/`.
 * The filename becomes the URL: `fastapi-migration.md` -> `/work/fastapi-migration`.
 *
 * Frontmatter drives the card on the homepage; the markdown body is the
 * case study itself.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    /* --- shown on the card --- */
    title: z.string(),
    /** small uppercase line above the title, e.g. "Backend migration · DataPOEM" */
    kicker: z.string(),
    /** one or two sentences — this is what most people will actually read */
    summary: z.string(),
    /** the headline number, e.g. "100+ endpoints · 2 months · no downtime" */
    outcome: z.string(),
    /** text inside the thumbnail block; falls back to the title */
    thumbLabel: z.string().optional(),

    /* --- shown on the case study page --- */
    role: z.string(),
    period: z.string(),
    stack: z.array(z.string()),

    /* --- housekeeping --- */
    status: z.enum(['shipped', 'in progress', 'archived']).default('shipped'),
    /** lower numbers sort first */
    order: z.number().default(0),
    /** drafts are visible in `pnpm dev` but excluded from the production build */
    draft: z.boolean().default(false),
    /** any extra links; the "read case study" link is added automatically */
    links: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
  }),
});

export const collections = { work };
