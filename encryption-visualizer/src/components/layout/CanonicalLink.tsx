import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { canonicalUrl } from '@/router/seo';

/** Keeps <link rel="canonical"> in step with the current route (SPA, one index.html). */
export const CanonicalLink: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (link) link.href = canonicalUrl(pathname);
  }, [pathname]);

  return null;
};
