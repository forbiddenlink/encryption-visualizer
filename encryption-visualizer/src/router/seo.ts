export const SITE_ORIGIN = 'https://encryption-visualizer-zeta.vercel.app';

export function canonicalUrl(pathname: string): string {
  return `${SITE_ORIGIN}${pathname === '' ? '/' : pathname}`;
}
