import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { ToastContainer } from '@/components/ui/Toast';
import { lessons } from '@/data/lessonCatalog';
import { LessonNext } from '@/components/learning/LessonNext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const lesson = lessons.find((item) => `/${item.slug}` === location.pathname);

  useEffect(() => {
    const titles: Record<string, string> = { '/': 'Interactive cryptography field guide', '/learn': 'Learning Paths', '/glossary': 'Crypto Glossary', '/compare': 'Algorithm Comparison', '/about': 'About CryptoViz' };
    document.title = `${lesson?.title ?? titles[location.pathname] ?? 'Cryptography'} | CryptoViz`;
  }, [location.pathname, lesson?.title]);

  return (
    <div className="min-h-screen">
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
