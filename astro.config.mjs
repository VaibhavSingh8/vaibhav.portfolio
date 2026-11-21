// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * The production origin. It drives canonical URLs, absolute Open Graph URLs,
 * the sitemap and the Sitemap line in robots.txt. Without it the site still
 * builds, but skips those.
 *
 * TODO(vaibhav): set your real domain here, or SITE_URL in the deploy env.
 */
const site = process.env['SITE_URL'] || undefined;

// https://astro.build/config
export default defineConfig({
  ...(site ? { site } : {}),
  integrations: [sitemap()],
});
