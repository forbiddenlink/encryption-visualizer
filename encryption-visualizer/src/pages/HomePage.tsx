import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Key, Hash, ArrowRight, Lock, Fingerprint, FileSignature, GitCompare, Users, Globe, ShieldAlert, KeyRound, Ellipsis, GraduationCap } from 'lucide-react';
import { lessons } from '@/data/lessonCatalog';
import { ROUTES } from '@/router/routes';
import { useProgressStore } from '@/store/progressStore';
import { CompletionBadge } from '@/components/ui/ProgressIndicator';
import { WebSiteSchema } from '@/components/seo/JsonLd';
import { websiteSchema } from '@/data/structuredData';
import { CipherLabDemo } from '@/components/visualizations/CipherLab/CipherLabDemo';

const algorithmCards = [
  { to: ROUTES.AES, icon: Cpu, title: 'AES Encryption', description: 'The worldwide standard for symmetric encryption. Watch SubBytes, ShiftRows, MixColumns, and AddRoundKey transform your data.', tag: 'symmetric', slug: 'aes' },
  { to: ROUTES.RSA, icon: Key, title: 'RSA Encryption', description: 'Public-key cryptography demystified. See how prime numbers create the mathematical foundation for secure communication.', tag: 'asymmetric', slug: 'rsa' },
  { to: ROUTES.ECC, icon: GitCompare, title: 'Elliptic Curve Crypto', description: 'Modern cryptography on curves. Smaller keys, same security. See point addition, scalar multiplication, and ECDH.', tag: 'asymmetric', slug: 'ecc' },
  { to: ROUTES.HASHING, icon: Fingerprint, title: 'Hash Functions', description: 'Experience the avalanche effect firsthand. See how changing one bit cascades into a completely different hash output.', tag: 'one-way', slug: 'hashing' },
  { to: ROUTES.HMAC, icon: KeyRound, title: 'HMAC', description: 'Hash-based message authentication. See how combining a key with a hash provides both integrity and authenticity.', tag: 'authentication', slug: 'hmac' },
  { to: ROUTES.SIGNATURES, icon: FileSignature, title: 'Digital Signatures', description: 'See how cryptographic signatures prove authenticity and detect tampering without hiding the message.', tag: 'sign/verify', slug: 'signatures' },
  { to: ROUTES.DIFFIE_HELLMAN, icon: Users, title: 'Diffie-Hellman', description: 'Watch two parties establish a shared secret over a public channel. The foundation of modern key exchange.', tag: 'key exchange', slug: 'diffie-hellman' },
  { to: ROUTES.BLOCK_MODES, icon: Cpu, title: 'Block Cipher Modes', description: 'ECB, CBC, GCM — see why mode of operation matters as much as the cipher itself.', tag: 'modes', slug: 'block-modes' },
  { to: ROUTES.PADDING, icon: Ellipsis, title: 'Padding Schemes', description: 'PKCS#7, zero padding, ANSI X.923 — see how block ciphers handle data that does not fit neatly into blocks.', tag: 'block cipher', slug: 'padding' },
  { to: ROUTES.PASSWORD_HASHING, icon: Lock, title: 'Password Hashing', description: 'Why SHA-256 is wrong for passwords. See how bcrypt, scrypt, and Argon2 use deliberate slowness for security.', tag: 'passwords', slug: 'password-hashing' },
  { to: ROUTES.TLS, icon: Globe, title: 'TLS Handshake', description: 'Watch a complete TLS 1.3 handshake. See how DH, AES, signatures, and hashing combine to secure the web.', tag: 'protocol', slug: 'tls' },
  { to: ROUTES.CRYPTANALYSIS, icon: ShieldAlert, title: 'Cryptanalysis', description: 'Break ciphers yourself. Frequency analysis, brute force, padding oracle — understand attacks to build better defenses.', tag: 'attacks', slug: 'cryptanalysis' },
];

export const HomePage = () => {
  const isAlgorithmComplete = useProgressStore((state) => state.isAlgorithmComplete);
  const getQuizScore = useProgressStore((state) => state.getQuizScore);

  const lastVisited = useProgressStore((state) => state.lastVisitedAlgorithm);
  const completed = useProgressStore((state) => state.completedAlgorithms);
  const resumeLesson = lessons.find((lesson) => lesson.slug === lastVisited);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', 'Symmetric', 'Asymmetric', 'Hashing', 'Protocols', 'Attacks'];
  const categoryFor = (slug: string): string => {
    if (['aes', 'block-modes', 'padding'].includes(slug)) return 'Symmetric';
    if (['rsa', 'ecc', 'diffie-hellman', 'signatures'].includes(slug)) return 'Asymmetric';
    if (['hashing', 'hmac', 'password-hashing'].includes(slug)) return 'Hashing';
    return slug === 'tls' ? 'Protocols' : 'Attacks';
  };
  const filteredCards = algorithmCards.filter((card) =>
    (category === 'All' || categoryFor(card.slug) === category) &&
    `${card.title} ${card.description} ${card.tag}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
    <WebSiteSchema {...websiteSchema} />
    <article style={{ display: 'grid', gap: 'var(--space-section)' }}>
      <div>
        <div className="home-guide">
          <header className="home-intro">
            <p className="eyebrow">A field guide to cryptography / 01</p>
            <h1 className="display-title">See how encryption <span style={{ color: 'var(--accent)' }}>actually works.</span></h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Don&apos;t just read about cryptography. <em>Experience</em> it.
              Watch bytes transform, witness key generation, and observe the avalanche effect.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link to={ROUTES.LEARNING_PATHS} className="btn-primary">Start learning <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
              <Link to={ROUTES.AES} className="btn-secondary">Start with AES</Link>
            </div>
            <Link to={ROUTES.GLOSSARY} className="inline-flex mt-5 text-sm text-slate-600 dark:text-slate-300 underline underline-offset-4">Browse Glossary</Link>
          </header>
          <section aria-labelledby="cipher-lab-heading" className="home-lab">
            <h2 id="cipher-lab-heading" className="sr-only">Live cipher lab</h2>
            <CipherLabDemo />
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-4">Try a message. Step through each byte. This introductory lab demonstrates Caesar, XOR, and the AES S-box.</p>
          </section>
        </div>
        <div className="home-meta eyebrow">
          <span>Interactive cryptography education</span>
          <span>12 topics · 3 guided paths · Learn at your pace</span>
        </div>
      </div>

      {resumeLesson && <section className="guided-callout" aria-label="Your learning progress"><div><p className="eyebrow mb-3">Your field notes / saved on this device</p><h2 className="section-title text-2xl">{completed.filter((slug) => lessons.some((lesson) => lesson.slug === slug)).length} of 12 knowledge checks passed</h2><p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Last visited: {resumeLesson.title}</p></div><Link to={`/${resumeLesson.slug}`} className="btn-primary">Resume learning →</Link></section>}

      {/* Algorithm Cards */}
      <section id="topics" aria-labelledby="algorithms-heading">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">The algorithm library / 02</p>
            <h2 id="algorithms-heading" className="section-title">Choose your learning path</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">Each algorithm is broken down into visual, digestible steps.</p>
          </div>
          <Link to={ROUTES.COMPARE} className="btn-secondary text-sm">Compare algorithms <GitCompare className="w-4 h-4" aria-hidden="true" /></Link>
        </div>
        <div className="catalog-controls">
          <div className="catalog-filters" role="group" aria-label="Filter topics by category">
            {categories.map((item) => <button key={item} className="filter-button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <div className="catalog-search">
            <label htmlFor="topic-search" className="sr-only">Search algorithm topics</label>
            <input id="topic-search" type="search" placeholder="Search topics or concepts…" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </div>
        <p className="eyebrow mb-5" role="status">{filteredCards.length} of {algorithmCards.length} topics</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map(({ to, icon: Icon, title, description, tag, slug }) => (
            <Link key={to} to={to} className="group relative glass-card-hover topic-card">
              <CompletionBadge isComplete={isAlgorithmComplete(slug)} quizScore={getQuizScore(slug)} />
              <div className="flex items-center justify-between">
                <span className="topic-number">{String(algorithmCards.findIndex((card) => card.slug === slug) + 1).padStart(2, '0')} / {categoryFor(slug)}</span>
                <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3>{title}</h3><p>{description}</p>
              <span className="topic-action"><span>{tag}</span><span className="flex items-center gap-2">Explore <ArrowRight className="w-4 h-4" aria-hidden="true" /></span></span>
            </Link>
          ))}
        </div>
        {filteredCards.length === 0 && <div className="glass-card p-8 text-center"><h3 className="text-xl mb-2">No matching topics</h3><p className="text-slate-600 dark:text-slate-400 mb-5">Try another concept or clear your filters to see every lab.</p><button className="btn-secondary mx-auto" onClick={() => { setQuery(''); setCategory('All'); }}>Clear filters</button></div>}
        <div className="guided-callout mt-8">
          <div><p className="eyebrow mb-3">A little structure goes a long way</p><h3 className="text-xl mb-2">New to cryptography?</h3><p className="text-sm text-slate-600 dark:text-slate-400">Start with the fundamentals, then connect encryption, key exchange, and authentication.</p></div>
          <Link to={ROUTES.LEARNING_PATHS} className="btn-primary shrink-0"><GraduationCap className="w-5 h-5" aria-hidden="true" />Follow a Guided Learning Path<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="glass-card p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="inline-flex p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-sm">
              <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Step-by-Step
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Every transformation is visualized. Pause, rewind, and examine each operation at your own pace.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-sm">
              <Cpu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Real Algorithms
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Not simplified versions. See the actual S-boxes, permutations, and mathematical operations.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-sm">
              <Hash className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Interactive Quizzes
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Test your understanding with built-in knowledge checks after each section.
            </p>
          </div>
        </div>
      </section>
    </article>
    </>
  );
};
