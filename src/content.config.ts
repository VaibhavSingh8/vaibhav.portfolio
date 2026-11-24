import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

/**
 * Work. One markdown file per piece of work in `src/content/work/`.
 *
 * Two formats:
 * - `case-study` (default): a card on the homepage plus a page at
 *   `/work/<filename>`. The markdown body is the case study.
 * - `note`: a compact, non-clickable row under "More work". No page is
 *   generated and the body is not rendered, so it can hold notes or a
 *   skeleton until the entry is promoted to a case study.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    format: z.enum(['case-study', 'note']).default('case-study'),

    /* --- shown on the card / row --- */
    title: z.string(),
    /** small uppercase line above the title, e.g. "Backend migration · DataPOEM" */
    kicker: z.string(),
    /** one or two sentences: this is what most people will actually read */
    summary: z.string(),
    /** the headline numbers, each with its scope */
    outcome: z.string(),

    /* --- shown on the case study page --- */
    role: z.string(),
    team: z.string().optional(),
    /** optional so a note can leave out a date that isn't confirmed */
    period: z.string().optional(),
    stack: z.array(z.string()).default([]),

    /* --- housekeeping --- */
    status: z
      .enum(['shipped', 'in production', 'in rollout', 'built, pre-launch'])
      .default('shipped'),
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
