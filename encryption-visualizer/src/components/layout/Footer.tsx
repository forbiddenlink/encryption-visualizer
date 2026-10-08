import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/router/routes';

export const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer-inner">
      <div>
        <Link to={ROUTES.HOME} className="brand-name">CryptoViz</Link>
        <p className="mt-3 max-w-sm text-sm text-slate-600 dark:text-slate-400">Understand the algorithms behind secure communication. One transformation at a time.</p>
        <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">For learning. Use established libraries for production cryptography.</p>
      </div>
      <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
        <Link to={ROUTES.LEARNING_PATHS}>Learning paths</Link>
        <Link to={ROUTES.GLOSSARY}>Glossary</Link>
        <Link to={ROUTES.ABOUT}>About</Link>
        <a href="https://github.com/forbiddenlink/EncryptionVisualizer" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">Source code <ArrowUpRight className="w-4 h-4" aria-hidden="true" /></a>
      </nav>
    </div>
    <p className="footer-colophon eyebrow">An open-source guide to cryptography</p>
  </footer>
);
