import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const ScrollToTop: React.FC = () => {
  const { pathname, hash, key } = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const behavior = reduceMotion ? 'instant' : 'smooth';
    if (!hash) {
      window.scrollTo({ top: 0, behavior });
      return;
    }
    let id: string;
    try { id = decodeURIComponent(hash.slice(1)); }
    catch { return; }
    const scrollToTarget = (): boolean => {
      const target = document.getElementById(id);
      if (!target) return false;
      const headerHeight = document.querySelector('header.site-header')?.getBoundingClientRect().height ?? 0;
      window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 16), behavior });
      return true;
    };
    // Route transitions and lazy lessons can mount the destination after this effect.
    if (scrollToTarget()) return;
    const observer = new MutationObserver(() => {
      if (scrollToTarget()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, hash, key, reduceMotion]);

  return null;
};
