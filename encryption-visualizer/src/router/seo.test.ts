// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROUTES } from './routes';
import { canonicalUrl, SITE_ORIGIN } from './seo';

describe('sitemap', () => {
  const xml = readFileSync(resolve(__dirname, '../../public/sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  it('lists every router path and no hash fragments', () => {
    expect(locs.some((l) => l.includes('#'))).toBe(false);
    for (const path of Object.values(ROUTES)) {
      expect(locs).toContain(canonicalUrl(path));
    }
  });
});

describe('canonicalUrl', () => {
  it('maps the root to the origin with a trailing slash', () => {
    expect(canonicalUrl('/')).toBe(`${SITE_ORIGIN}/`);
  });
  it('maps routes to their own URL and drops hash/query', () => {
    expect(canonicalUrl('/aes')).toBe(`${SITE_ORIGIN}/aes`);
  });
});
