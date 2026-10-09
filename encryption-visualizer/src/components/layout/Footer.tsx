import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/router/routes';

export const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer-inner">
      <div className="footer-statement">
        <p className="eyebrow">A field guide for the curious</p>
        <Link to={ROUTES.HOME} className="footer-wordmark">CryptoViz</Link>
        <p>Understand the algorithms behind secure communication. One transformation at a time.</p>
      </div>
      <div className="footer-index">
        <p className="eyebrow">Continue your study</p>
        <nav aria-label="Footer navigation">
          <Link to={ROUTES.LEARNING_PATHS}>Learning paths</Link>
          <Link to={ROUTES.GLOSSARY}>Glossary</Link>
          <Link to={ROUTES.ABOUT}>About</Link>
          <a href="https://github.com/forbiddenlink/EncryptionVisualizer" target="_blank" rel="noopener noreferrer">Source code <ArrowUpRight aria-hidden="true" size={14} /></a>
        </nav>
      </div>
      <div className="footer-note">
        <span className="footer-note-number" aria-hidden="true">∴</span>
        <p>Built to make the mathematics visible.</p>
        <p>For learning. Use established libraries for production cryptography.</p>
      </div>
    </div>
    <div className="footer-colophon">
      <span>An open-source guide to cryptography</span>
      <span>12 studies · 3 guided paths · Countless discoveries</span>
    </div>
  </footer>
);
