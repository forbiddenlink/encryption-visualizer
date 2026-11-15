import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROUTES } from './routes';

// vercel.json rewrites are an allow-list of the real routes. Unknown paths
// then fall through to Vercel's 404 instead of serving the app shell with
// HTTP 200 (a soft 404 that search engines can index).
const config = JSON.parse(readFileSync(resolve(__dirname, '../../../vercel.json'), 'utf8')) as {
  rewrites: { source: string; destination: string }[];
};

function isRewritten(url: string): boolean {
  return config.rewrites.some(
    (r) => r.destination === '/index.html' && new RegExp(`^${r.source}/?$`).test(url),
  );
}

describe('vercel.json SPA rewrites', () => {
  it.each(Object.values(ROUTES))('serves the app shell for %s', (route) => {
    expect(isRewritten(route)).toBe(true);
  });

  it.each(['/zzz', '/zzz-nope', '/aes/extra', '/Aes'])('does not rewrite %s (real 404)', (url) => {
    expect(isRewritten(url)).toBe(false);
  });
});
