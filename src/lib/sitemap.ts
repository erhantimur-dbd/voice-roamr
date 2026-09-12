import { SITE } from "./site.ts";

/**
 * Indexable marketing routes only. Keep /app, /admin, /api, /login, and
 * /signup out — those are Disallow in public/robots.txt.
 *
 * /legal is a layout outlet with no page, so it is omitted.
 */
export const PUBLIC_SITEMAP_PATHS = [
  "/",
  "/use-cases",
  "/pricing",
  "/languages",
  "/integrations",
  "/voices",
  "/security",
  "/about",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
  "/legal/cookies",
] as const;

export type PublicSitemapPath = (typeof PUBLIC_SITEMAP_PATHS)[number];

export function sitemapLoc(path: PublicSitemapPath): string {
  return path === "/" ? `${SITE.url}/` : `${SITE.url}${path}`;
}

export function renderSitemapXml(): string {
  const urls = PUBLIC_SITEMAP_PATHS.map(
    (path) => `  <url><loc>${sitemapLoc(path)}</loc></url>`,
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
