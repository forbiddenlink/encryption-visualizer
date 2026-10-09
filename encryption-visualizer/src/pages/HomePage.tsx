import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GitCompare, GraduationCap } from 'lucide-react';
import { TopicGlyph } from '@/components/visualizations/TopicGlyph';
import { lessons } from '@/data/lessonCatalog';
import { ROUTES } from '@/router/routes';
import { useProgressStore } from '@/store/progressStore';
import { CompletionBadge } from '@/components/ui/ProgressIndicator';
import { WebSiteSchema } from '@/components/seo/JsonLd';
import { websiteSchema } from '@/data/structuredData';
import { CipherLabDemo } from '@/components/visualizations/CipherLab/CipherLabDemo';

const algorithmCards = [
  { to: ROUTES.AES, title: 'AES Encryption', description: 'A sixteen-byte state, transformed round by round. Follow substitution, shifting, mixing, and the round key.', tag: 'symmetric', slug: 'aes' },
  { to: ROUTES.RSA, title: 'RSA Encryption', description: 'Start with two primes. Build a public and private key, then trace the modular arithmetic that connects them.', tag: 'asymmetric', slug: 'rsa' },
  { to: ROUTES.ECC, title: 'Elliptic Curve Crypto', description: 'Add points on a curve, multiply them by a scalar, and see how two parties arrive at a shared secret.', tag: 'asymmetric', slug: 'ecc' },
  { to: ROUTES.HASHING, title: 'Hash Functions', description: 'Follow SHA-256 from UTF-8 bytes to a 256-bit digest. Change the message and measure the avalanche effect.', tag: 'one-way', slug: 'hashing' },
  { to: ROUTES.HMAC, title: 'HMAC', description: 'Follow the inner and outer hash construction to see how a shared key authenticates a message.', tag: 'authentication', slug: 'hmac' },
  { to: ROUTES.SIGNATURES, title: 'Digital Signatures', description: 'Sign with a private key. Verify with a public key. Change the message and see why verification fails.', tag: 'sign/verify', slug: 'signatures' },
  { to: ROUTES.DIFFIE_HELLMAN, title: 'Diffie-Hellman', description: 'Two private numbers. One shared secret. Follow a key exchange across a channel everyone can observe.', tag: 'key exchange', slug: 'diffie-hellman' },
  { to: ROUTES.BLOCK_MODES, title: 'Block Cipher Modes', description: 'Compare how ECB, CBC, and GCM handle blocks. See the patterns, chaining, and role of authentication.', tag: 'modes', slug: 'block-modes' },
  { to: ROUTES.PADDING, title: 'Padding Schemes', description: 'A message rarely fills every block. Compare the extra bytes added by PKCS#7, zero padding, and ANSI X.923.', tag: 'block cipher', slug: 'padding' },
  { to: ROUTES.PASSWORD_HASHING, title: 'Password Hashing', description: 'Explore salt and work factor, and why password storage needs more than a fast cryptographic hash.', tag: 'passwords', slug: 'password-hashing' },
  { to: ROUTES.TLS, title: 'TLS Handshake', description: 'Follow the handshake that connects key exchange, authentication, and encryption to protect a connection.', tag: 'protocol', slug: 'tls' },
  { to: ROUTES.CRYPTANALYSIS, title: 'Cryptanalysis', description: 'Study frequency analysis, brute force, and padding oracles. Examine what an attacker can learn.', tag: 'attacks', slug: 'cryptanalysis' },
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
    <article className="atlas-home" style={{ display: 'grid', gap: 'var(--space-section)' }}>
      <div>
        <div className="atlas-masthead">
          <span>FIELD GUIDE № 001</span>
          <span>Cryptography, taken apart.</span>
          <span>Explore · experiment · understand</span>
        </div>
        <div className="home-guide">
          <header className="home-intro">
            <p className="eyebrow">An illustrated introduction to cryptography</p>
            <h1 className="display-title">See how encryption <span style={{ color: 'var(--accent)' }}>actually works.</span></h1>
            <p className="atlas-hero-lead">A message becomes bytes. Bytes become a secret. Follow the mathematics in between, one operation at a time.</p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link to={ROUTES.LEARNING_PATHS} className="btn-primary">Start learning <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
              <Link to={ROUTES.AES} className="btn-secondary">Start with AES</Link>
            </div>
            <Link to={ROUTES.GLOSSARY} className="inline-flex mt-5 text-sm text-slate-600 dark:text-slate-300 underline underline-offset-4">Browse Glossary</Link>
          </header>
          <section aria-labelledby="cipher-lab-heading" className="home-lab">
            <h2 id="cipher-lab-heading" className="sr-only">Live cipher lab</h2>
            <CipherLabDemo />
            <p className="atlas-figure-caption"><span>Fig. 01</span> A working cipher, byte by byte. Try a message, choose an operation, and follow the transformation.</p>
          </section>
        </div>
        <div className="home-meta eyebrow">
          <span>A notebook you can interact with</span>
          <span>12 topics / 3 guided paths / At your pace</span>
        </div>
      </div>

      {resumeLesson && <section className="guided-callout" aria-label="Your learning progress"><div><p className="eyebrow mb-3">Your field notes / saved on this device</p><h2 className="section-title text-2xl">{completed.filter((slug) => lessons.some((lesson) => lesson.slug === slug)).length} of 12 knowledge checks passed</h2><p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Last visited: {resumeLesson.title}</p></div><Link to={`/${resumeLesson.slug}`} className="btn-primary">Resume learning →</Link></section>}

      {/* Algorithm Cards */}
      <section id="topics" aria-labelledby="algorithms-heading" className="atlas-library">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">The algorithm index / 02</p>
            <h2 id="algorithms-heading" className="section-title">Choose your learning path</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">Twelve ways to understand how information is protected. Start anywhere, or follow a guided path.</p>
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
        <div className="topic-grid">
          {filteredCards.map(({ to, title, description, tag, slug }) => (
            <Link key={to} to={to} className="topic-entry group">
              <figure className="topic-plate"><TopicGlyph slug={slug} /></figure>
              <div className="topic-copy">
                <div className="topic-heading">
                  <span className="topic-number">{String(algorithmCards.findIndex((card) => card.slug === slug) + 1).padStart(2, '0')} / {categoryFor(slug)}</span>
                  <CompletionBadge isComplete={isAlgorithmComplete(slug)} quizScore={getQuizScore(slug)} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="topic-action"><span>{tag}</span><span>Open lesson <ArrowRight className="w-4 h-4" aria-hidden="true" /></span></span>
              </div>
            </Link>
          ))}
        </div>
        {filteredCards.length === 0 && <div className="glass-card p-8 text-center"><h3 className="text-xl mb-2">No matching topics</h3><p className="text-slate-600 dark:text-slate-400 mb-5">Try another concept or clear your filters to see every lab.</p><button className="btn-secondary mx-auto" onClick={() => { setQuery(''); setCategory('All'); }}>Clear filters</button></div>}
        <div className="guided-callout mt-8">
          <div><p className="eyebrow mb-3">A little structure goes a long way</p><h3 className="text-xl mb-2">New to cryptography?</h3><p className="text-sm text-slate-600 dark:text-slate-400">Start with the fundamentals, then connect encryption, key exchange, and authentication.</p></div>
          <Link to={ROUTES.LEARNING_PATHS} className="btn-primary shrink-0"><GraduationCap className="w-5 h-5" aria-hidden="true" />Follow a Guided Learning Path<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="atlas-method" aria-labelledby="method-heading">
        <div className="atlas-method-intro"><p className="eyebrow">How to use this field guide / 03</p><h2 id="method-heading" className="section-title">Look closer.</h2><p>Understanding comes from following the details.</p></div>
        <ol className="atlas-method-steps">
          <li><span className="eyebrow">01 / Experiment</span><h3>Make it your message.</h3><p>Change an input, a key, or a parameter. See which parts of the output change with it.</p></li>
          <li><span className="eyebrow">02 / Inspect</span><h3>Follow the operations.</h3><p>Pause at a transformation. Read the bytes, the equations, and the explanation alongside them. Each lesson identifies its educational scope.</p></li>
          <li><span className="eyebrow">03 / Understand</span><h3>Put it to the test.</h3><p>Check what you learned with a quiz, then connect the ideas through a guided learning path.</p></li>
        </ol>
      </section>
    </article>
    </>
  );
};
