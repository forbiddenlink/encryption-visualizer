import { GraduationCap, Code, Mail } from 'lucide-react';
import { AtlasInsignia, CryptographicPillarsSchematic } from '@/components/educational/AboutSchematics';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const AboutPage = () => {
  return (
    <div className="about-page space-y-8">
      <p className="eyebrow">About the field guide</p>
      {/* Header */}
      <div className="about-intro">
        <AtlasInsignia />
        <h1 className="section-title mb-6">
          About CryptoViz
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          An open-source interactive atlas designed to teach modern cryptography through transparent, step-by-step mathematical specimens.
        </p>
      </div>

      {/* Mission */}
      <section className="reading-section">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-6 h-6 text-[var(--accent)]" />
          <h2 className="section-title text-2xl">Our Mission</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Cryptography can feel abstract and intimidating. CryptoViz was created to make these concepts accessible by showing you exactly what happens at each step of encryption, decryption, and hashing operations.
        </p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
          Whether you are a student learning security fundamentals, a developer implementing encryption, or simply curious about how your data stays safe, we aim to provide clear, accurate visualizations of real-world algorithms.
        </p>
      </section>

      {/* What We Cover */}
      <section className="reading-section">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-6 h-6 text-[var(--accent)]" />
          <h2 className="section-title text-2xl">What We Cover</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          The atlas spans twelve interactive studies grouped into the foundational disciplines of cryptography, from low-level byte substitutions to full transport security handshakes.
        </p>
        <CryptographicPillarsSchematic />
      </section>

      {/* Accuracy Note */}
      <section className="glass-card p-6 sm:p-8 border-l-4 border-l-amber-500">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Educational Purpose</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          This tool is designed for learning, not for production cryptographic operations. The implementations prioritize clarity and visualization over performance. For real-world applications, always use established cryptographic libraries.
        </p>
      </section>

      {/* Contact & Contribute */}
      <section className="reading-section">
        <h2 className="section-title text-2xl mb-4">Get Involved</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://github.com/forbiddenlink/EncryptionVisualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <GithubIcon className="w-5 h-5" />
            View on GitHub
          </a>
          <a
            href="https://github.com/forbiddenlink/EncryptionVisualizer/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <Mail className="w-5 h-5" />
            Report an Issue
          </a>
        </div>
      </section>
    </div>
  );
};
