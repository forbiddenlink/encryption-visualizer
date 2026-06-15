import { Shield, GraduationCap, Code, Mail } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const AboutPage = () => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 text-center">
        <div className="inline-flex p-4 bg-cyber-blue/10 dark:bg-cyber-blue/20 border border-cyber-blue/20 rounded-2xl mb-6 shadow-inner">
          <Shield className="w-10 h-10 text-cyber-blue dark:text-cyber-cyan" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">
          About CryptoViz
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          An open-source educational tool for understanding cryptographic algorithms through interactive visualization.
        </p>
      </div>

      {/* Mission */}
      <section className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-6 h-6 text-cyber-blue dark:text-cyber-cyan" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Cryptography can feel abstract and intimidating. CryptoViz was created to make these concepts accessible by showing you exactly what happens at each step of encryption, decryption, and hashing operations.
        </p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
          Whether you're a student learning about security fundamentals, a developer implementing encryption, or simply curious about how your data stays safe, we aim to provide clear, accurate visualizations of real-world algorithms.
        </p>
      </section>

      {/* What We Cover */}
      <section className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-6 h-6 text-cyber-blue dark:text-cyber-cyan" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">What We Cover</h2>
        </div>
        <ul className="space-y-3 text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 bg-cyber-blue rounded-full mt-2 flex-shrink-0"></span>
            <span><strong className="text-slate-900 dark:text-white">AES (Advanced Encryption Standard)</strong> - The most widely used symmetric encryption algorithm, visualized round-by-round including SubBytes, ShiftRows, MixColumns, and AddRoundKey operations.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 bg-cyber-cyan rounded-full mt-2 flex-shrink-0"></span>
            <span><strong className="text-slate-900 dark:text-white">RSA</strong> - Public-key cryptography explained through prime number generation, key derivation, and modular arithmetic.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
            <span><strong className="text-slate-900 dark:text-white">Hash Functions</strong> - See the avalanche effect in action and understand why hash functions are one-way.</span>
          </li>
        </ul>
      </section>

      {/* Accuracy Note */}
      <section className="glass-card p-6 sm:p-8 border-l-4 border-l-amber-500">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Educational Purpose</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          This tool is designed for learning, not for production cryptographic operations. The implementations prioritize clarity and visualization over performance. For real-world applications, always use established cryptographic libraries.
        </p>
      </section>

      {/* Contact & Contribute */}
      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Get Involved</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://github.com/forbiddenlink/encryption-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <GithubIcon className="w-5 h-5" />
            View on GitHub
          </a>
          <a
            href="https://github.com/forbiddenlink/encryption-visualizer/issues"
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
