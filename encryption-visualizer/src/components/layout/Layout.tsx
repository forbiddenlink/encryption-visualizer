import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { ToastContainer } from '@/components/ui/Toast';
import { lessons } from '@/data/lessonCatalog';
import { LessonNext } from '@/components/learning/LessonNext';
import { formatTitle, getRouteSeo } from '@/lib/seo';

// Create, update or remove a single <head> tag so each route owns its metadata.
function setHeadTag(selector: string, tag: 'meta' | 'link', attrs: Record<string, string> | null): void {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!attrs) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement(tag);
    document.head.appendChild(el);
  }
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
}

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const lesson = lessons.find((item) => `/${item.slug}` === location.pathname);

  useEffect(() => {
    const seo = getRouteSeo(location.pathname);
    document.title = formatTitle(seo.title);
    setHeadTag('meta[name="description"]', 'meta', { name: 'description', content: seo.description });
    setHeadTag('link[rel="canonical"]', 'link', seo.canonical ? { rel: 'canonical', href: seo.canonical } : null);
  }, [location.pathname]);

  return (
    <div className="site-shell" data-page={lesson ? 'lesson' : location.pathname.slice(1) || 'home'} data-lesson={lesson?.slug}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <ScrollToTop />
      <Header />

      <main
        id="main-content"
        role="main"
        className="site-main"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={location.pathname}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {lesson && (
              <div className="lesson-running-head" aria-label="Lesson index">
                <span>Study {String(lessons.indexOf(lesson) + 1).padStart(2, '0')} / {String(lessons.length).padStart(2, '0')}</span>
                <span>{lesson.category}</span>
              </div>
            )}
            {children}
            {lesson && <LessonNext slug={lesson.slug} />}
          </m.div>
        </AnimatePresence>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};
