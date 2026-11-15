import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '@/router/routes';
import { SITE_URL, getRouteSeo } from './seo';

const paths = Object.values(ROUTES);

describe('getRouteSeo', () => {
  it('gives every route a unique title, description and canonical', () => {
    const metas = paths.map((p) => getRouteSeo(p));
    for (const meta of metas) {
      expect(meta?.title).toBeTruthy();
      expect(meta?.description?.length).toBeGreaterThan(40);
    }
    expect(new Set(metas.map((m) => m?.title)).size).toBe(paths.length);
    expect(new Set(metas.map((m) => m?.description)).size).toBe(paths.length);
    expect(new Set(metas.map((m) => m?.canonical)).size).toBe(paths.length);
  });

  it('builds canonicals from the site URL and path', () => {
    expect(getRouteSeo('/')?.canonical).toBe(`${SITE_URL}/`);
    expect(getRouteSeo('/aes')?.canonical).toBe(`${SITE_URL}/aes`);
  });

  it('has no canonical for unknown paths', () => {
    expect(getRouteSeo('/nope')?.canonical).toBeUndefined();
  });
});

describe('public/sitemap.xml', () => {
  const xml = readFileSync(resolve(__dirname, '../../public/sitemap.xml'), 'utf8');

  it('lists real paths, not hash fragments', () => {
    expect(xml).not.toContain('/#');
  });

  it('lists every route exactly once', () => {
    for (const p of paths) {
      const loc = p === '/' ? `${SITE_URL}/` : `${SITE_URL}${p}`;
      expect(xml.split(`<loc>${loc}</loc>`).length - 1).toBe(1);
    }
    expect(xml.match(/<loc>/g)?.length).toBe(paths.length);
  });
});
