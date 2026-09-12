import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PUBLIC_SITEMAP_PATHS, renderSitemapXml, sitemapLoc } from "./sitemap.ts";
import { SITE } from "./site.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("renderSitemapXml", () => {
  it("emits a urlset of canonical marketing locs only", () => {
    const xml = renderSitemapXml();

    assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
    assert.match(xml, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
    assert.doesNotMatch(xml, /changefreq|priority|xhtml/);

    for (const path of PUBLIC_SITEMAP_PATHS) {
      assert.match(xml, new RegExp(`<loc>${sitemapLoc(path)}</loc>`));
    }

    assert.equal(xml.match(/<url>/g)?.length, PUBLIC_SITEMAP_PATHS.length);
    assert.ok(xml.includes(`${SITE.url}/`));

    for (const blocked of ["/app", "/admin", "/api", "/login", "/signup"]) {
      assert.doesNotMatch(xml, new RegExp(`${SITE.url}${blocked}(/|")`));
    }
  });

  it("keeps public/sitemap.xml identical to the renderer", () => {
    const onDisk = readFileSync(join(root, "public/sitemap.xml"), "utf8");
    assert.equal(onDisk, renderSitemapXml());
  });

  it("keeps robots.txt pointed at the canonical sitemap", () => {
    const robots = readFileSync(join(root, "public/robots.txt"), "utf8");
    assert.match(robots, /^Sitemap: https:\/\/www\.roamr\.mobile\/sitemap\.xml$/m);
    assert.match(robots, /Disallow: \/app/);
    assert.match(robots, /Disallow: \/admin/);
    assert.match(robots, /Disallow: \/api/);
    assert.match(robots, /Disallow: \/login/);
    assert.match(robots, /Disallow: \/signup/);
  });
});
