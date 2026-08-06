import { Link } from 'react-router-dom';
import { Cpu, Key, Hash, ArrowRight, Shield, Lock, Fingerprint, FileSignature, GitCompare, Users, Globe, ShieldAlert, KeyRound, Ellipsis, GraduationCap } from 'lucide-react';
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

  return (
    <>
    <WebSiteSchema {...websiteSchema} />
    <article className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <header className="relative pt-16 sm:pt-24 pb-8 overflow-hidden">
        <div className="cipher-rain" aria-hidden="true" />
        <div className="relative text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyber-blue/10 border border-cyber-blue/20 rounded-full">
            <Shield className="w-4 h-4 text-cyber-cyan" />
            <span className="text-xs font-semibold tracking-wide uppercase text-cyber-blue">
              Interactive Cryptography Education
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter">
            <span className="block text-slate-900 dark:text-white mb-2">
              See How Encryption
            </span>
            <span className="block bg-gradient-to-br from-cyber-cyan to-cyber-blue bg-clip-text text-transparent">
              Actually Works
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Don&apos;t just read about cryptography. <em>Experience</em> it.
            Watch bytes transform, witness key generation, and observe the avalanche effect.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={ROUTES.AES}
              className="btn-primary"
            >
              Start with AES
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to={ROUTES.GLOSSARY}
              className="btn-secondary"
            >
              Browse Glossary
            </Link>
          </div>
        </div>
      </header>

      {/* Cipher Lab — live animated transform */}
      <section aria-labelledby="cipher-lab-heading" className="max-w-3xl mx-auto w-full">
        <h2 id="cipher-lab-heading" className="sr-only">
          Live cipher lab
        </h2>
        <CipherLabDemo />
      </section>

      {/* Algorithm Cards */}
      <section aria-labelledby="algorithms-heading">
        <div className="text-center mb-10">
          <h2 id="algorithms-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Choose Your Learning Path
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Each algorithm is broken down into visual, digestible steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithmCards.map(({ to, icon: Icon, title, description, tag, slug }) => (
            <Link
              key={to}
              to={to}
              className="group relative glass-card-hover p-6 cursor-pointer overflow-hidden text-left block w-full"
            >
              <CompletionBadge isComplete={isAlgorithmComplete(slug)} quizScore={getQuizScore(slug)} />
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-cyber-dark border border-white/5 rounded-lg group-hover:border-cyber-blue/30 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-cyber-blue group-hover:text-cyber-cyan transition-colors" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-mono text-slate-500 bg-cyber-dark px-2 py-1 rounded border border-white/5">
                    {tag}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyber-cyan transition-colors duration-150 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Learning Paths CTA */}
        <div className="mt-8 text-center">
          <Link
            to={ROUTES.LEARNING_PATHS}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            <GraduationCap className="w-5 h-5" />
            Follow a Guided Learning Path
            <ArrowRight className="w-4 h-4" />
          </Link>
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
