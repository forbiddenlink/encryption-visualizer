import { useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Cpu, Hash, Menu, Book, Key, Info, FileSignature, Users, Layers, ShieldAlert, Globe, Lock, KeyRound, Ellipsis, GraduationCap, GitCompare, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ROUTES } from '@/router/routes';

const algorithmLinks = [
  { to: ROUTES.AES, icon: Cpu, label: 'AES Encryption', category: 'Symmetric' },
  { to: ROUTES.BLOCK_MODES, icon: Layers, label: 'Block Modes', category: 'Symmetric' },
  { to: ROUTES.PADDING, icon: Ellipsis, label: 'Padding Schemes', category: 'Symmetric' },
  { to: ROUTES.RSA, icon: Key, label: 'RSA Encryption', category: 'Asymmetric' },
  { to: ROUTES.ECC, icon: GitCompare, label: 'Elliptic Curves', category: 'Asymmetric' },
  { to: ROUTES.DIFFIE_HELLMAN, icon: Users, label: 'Diffie-Hellman', category: 'Asymmetric' },
  { to: ROUTES.SIGNATURES, icon: FileSignature, label: 'Digital Signatures', category: 'Asymmetric' },
  { to: ROUTES.HASHING, icon: Hash, label: 'Hash Functions', category: 'Hashing' },
  { to: ROUTES.HMAC, icon: KeyRound, label: 'HMAC', category: 'Hashing' },
  { to: ROUTES.PASSWORD_HASHING, icon: Lock, label: 'Password Hashing', category: 'Hashing' },
  { to: ROUTES.TLS, icon: Globe, label: 'TLS Handshake', category: 'Protocols' },
  { to: ROUTES.CRYPTANALYSIS, icon: ShieldAlert, label: 'Cryptanalysis', category: 'Attacks' },
];

const otherLinks = [
  { to: ROUTES.LEARNING_PATHS, icon: GraduationCap, label: 'Learning Paths' },
  { to: ROUTES.COMPARE, icon: GitCompare, label: 'Compare' },
  { to: ROUTES.GLOSSARY, icon: Book, label: 'Glossary' },
  { to: ROUTES.ABOUT, icon: Info, label: 'About' },
];

export const Header = () => {
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const categories = ['Symmetric', 'Asymmetric', 'Hashing', 'Protocols', 'Attacks'];
  const closeMenus = (): void => {
    headerRef.current?.querySelectorAll('details[open]').forEach((menu) => menu.removeAttribute('open'));
  };

  useEffect(() => {
    const closeMenus = () => headerRef.current?.querySelectorAll('details[open]').forEach((menu) => menu.removeAttribute('open'));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const openMenu = headerRef.current?.querySelector('details[open]');
        closeMenus();
        openMenu?.querySelector('summary')?.focus();
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) closeMenus();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
    };
  }, []);

  const topicGroups = (
    <div className="topic-menu-grid">
      {categories.map((category, categoryIndex) => (
        <div key={category} className="topic-menu-group">
          <p className="topic-group-label"><span>{String(categoryIndex + 1).padStart(2, '0')}</span>{category}</p>
          {algorithmLinks.filter((link) => link.category === category).map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className="menu-topic" onClick={closeMenus}>
              <Icon className="w-4 h-4" aria-hidden="true" />{label}
            </NavLink>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <header ref={headerRef} className="site-header">
      <div className="site-header-inner">
        <Link to={ROUTES.HOME} className="brand" aria-label="CryptoViz home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" width="36" height="36" fill="none">
              <path d="M18 2 32 10v16l-14 8L4 26V10L18 2Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="m4 10 14 8 14-8M18 18v16M11 6v16l14 8M25 6v16l-14 8" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="18" cy="18" r="3" fill="currentColor" />
            </svg>
          </span>
          <span><span className="brand-name">CryptoViz</span><span className="brand-caption">The cryptography atlas</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation" key={`desktop-${location.pathname}`}>
          <details className="explore-menu">
            <summary className="nav-item">Explore topics <ChevronDown className="w-4 h-4" aria-hidden="true" /></summary>
            <div className="topic-menu"><div className="topic-menu-heading"><span className="eyebrow">The atlas index</span><span>12 interactive studies</span></div>{topicGroups}<Link to={`${ROUTES.HOME}#topics`} className="menu-topic topic-menu-library" onClick={closeMenus}>View the complete library →</Link></div>
          </details>
          {otherLinks.map(({ to, label }) => <NavLink key={to} to={to} className="nav-item">{label}</NavLink>)}
          <ThemeToggle />
        </nav>
        <div className="mobile-nav" key={`mobile-${location.pathname}`}>
          <ThemeToggle />
          <details className="mobile-menu">
            <summary className="nav-item" aria-label="Open navigation menu"><Menu className="w-5 h-5" aria-hidden="true" /></summary>
            <nav className="mobile-menu-panel" aria-label="Mobile navigation">
              {otherLinks.map(({ to, icon: Icon, label }) => <NavLink key={to} to={to} className="menu-topic" onClick={closeMenus}><Icon className="w-4 h-4" aria-hidden="true" />{label}</NavLink>)}
              <div className="mobile-topic-index"><p className="eyebrow">The atlas index</p>{topicGroups}</div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
};
