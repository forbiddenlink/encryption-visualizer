import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, Check, Minus, Star, X as XIcon } from 'lucide-react';

interface CellInfo {
  suitable: 'recommended' | 'possible' | 'not-suitable';
  explanation: string;
}

type Algorithm = 'AES' | 'RSA' | 'SHA-256' | 'HMAC' | 'DH' | 'Signatures';
type UseCase =
  | 'Encrypt bulk data'
  | 'Sign documents'
  | 'Exchange keys'
  | 'Hash passwords'
  | 'Authenticate messages'
  | 'Store secrets'
  | 'TLS/HTTPS';

const matrix: Record<UseCase, Record<Algorithm, CellInfo>> = {
  'Encrypt bulk data': {
    AES: { suitable: 'recommended', explanation: 'AES is the standard for fast, secure bulk data encryption.' },
    RSA: { suitable: 'not-suitable', explanation: 'RSA is too slow for bulk data. Used only for key wrapping.' },
    'SHA-256': { suitable: 'not-suitable', explanation: 'Hash functions are one-way -- they cannot encrypt data.' },
    HMAC: { suitable: 'not-suitable', explanation: 'HMAC authenticates but does not encrypt.' },
    DH: { suitable: 'not-suitable', explanation: 'DH only establishes keys; does not encrypt data itself.' },
    Signatures: { suitable: 'not-suitable', explanation: 'Signatures prove authenticity, not confidentiality.' },
  },
  'Sign documents': {
    AES: { suitable: 'not-suitable', explanation: 'Symmetric keys cannot provide non-repudiation.' },
    RSA: { suitable: 'recommended', explanation: 'RSA signatures are widely used for document signing.' },
    'SHA-256': { suitable: 'not-suitable', explanation: 'Hashes alone cannot prove who created the hash.' },
    HMAC: { suitable: 'possible', explanation: 'HMAC can prove authenticity between two parties sharing a key, but lacks non-repudiation.' },
    DH: { suitable: 'not-suitable', explanation: 'DH is for key exchange, not signing.' },
    Signatures: { suitable: 'recommended', explanation: 'Digital signatures are purpose-built for this use case.' },
  },
  'Exchange keys': {
    AES: { suitable: 'not-suitable', explanation: 'AES needs a pre-shared key -- it cannot bootstrap one.' },
    RSA: { suitable: 'possible', explanation: 'RSA can encrypt a symmetric key for transport (key wrapping).' },
    'SHA-256': { suitable: 'not-suitable', explanation: 'Hash functions cannot exchange keys.' },
    HMAC: { suitable: 'not-suitable', explanation: 'HMAC requires a shared key to already exist.' },
    DH: { suitable: 'recommended', explanation: 'Diffie-Hellman is specifically designed for key exchange over insecure channels.' },
    Signatures: { suitable: 'not-suitable', explanation: 'Signatures authenticate but do not exchange keys.' },
  },
  'Hash passwords': {
    AES: { suitable: 'not-suitable', explanation: 'Encryption is reversible -- passwords should be hashed, not encrypted.' },
    RSA: { suitable: 'not-suitable', explanation: 'Asymmetric encryption is wrong for password storage.' },
    'SHA-256': { suitable: 'possible', explanation: 'SHA-256 works but is too fast -- use bcrypt/scrypt/argon2 instead for resistance to brute force.' },
    HMAC: { suitable: 'not-suitable', explanation: 'HMAC is for message authentication, not password storage.' },
    DH: { suitable: 'not-suitable', explanation: 'Key exchange is unrelated to password storage.' },
    Signatures: { suitable: 'not-suitable', explanation: 'Signatures are not designed for password storage.' },
  },
  'Authenticate messages': {
    AES: { suitable: 'possible', explanation: 'AES-GCM provides authenticated encryption (combined confidentiality + integrity).' },
    RSA: { suitable: 'possible', explanation: 'RSA signatures can authenticate messages but are slow.' },
    'SHA-256': { suitable: 'not-suitable', explanation: 'A plain hash can be recomputed by anyone -- no authentication.' },
    HMAC: { suitable: 'recommended', explanation: 'HMAC is the standard for symmetric message authentication.' },
    DH: { suitable: 'not-suitable', explanation: 'DH exchanges keys but does not authenticate messages.' },
    Signatures: { suitable: 'recommended', explanation: 'Digital signatures provide strong message authentication with non-repudiation.' },
  },
  'Store secrets': {
    AES: { suitable: 'recommended', explanation: 'AES encrypts secrets at rest with a master key.' },
    RSA: { suitable: 'possible', explanation: 'RSA can encrypt small secrets (limited by key size).' },
    'SHA-256': { suitable: 'not-suitable', explanation: 'Hashing destroys the original data -- cannot retrieve secrets.' },
    HMAC: { suitable: 'not-suitable', explanation: 'HMAC does not provide confidentiality.' },
    DH: { suitable: 'not-suitable', explanation: 'DH is for key exchange, not storage.' },
    Signatures: { suitable: 'not-suitable', explanation: 'Signatures do not hide data.' },
  },
  'TLS/HTTPS': {
    AES: { suitable: 'recommended', explanation: 'AES-GCM is the bulk cipher in modern TLS.' },
    RSA: { suitable: 'possible', explanation: 'RSA certificates authenticate the server; RSA key exchange is being phased out for DH.' },
    'SHA-256': { suitable: 'recommended', explanation: 'SHA-256 is used in certificate fingerprints and HKDF.' },
    HMAC: { suitable: 'recommended', explanation: 'HMAC is used in TLS PRF and record MAC.' },
    DH: { suitable: 'recommended', explanation: 'ECDHE (Diffie-Hellman over elliptic curves) provides forward secrecy in TLS 1.3.' },
    Signatures: { suitable: 'recommended', explanation: 'Server certificate signatures authenticate the handshake.' },
  },
};

const useCases = Object.keys(matrix) as UseCase[];
const algorithms: Algorithm[] = ['AES', 'RSA', 'SHA-256', 'HMAC', 'DH', 'Signatures'];

const suitabilityConfig = {
  recommended: {
    icon: Star,
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    label: 'Recommended',
  },
  possible: {
    icon: Check,
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    label: 'Possible',
  },
  'not-suitable': {
    icon: Minus,
    bg: 'bg-slate-800/50',
    text: 'text-slate-600',
    border: 'border-white/5',
    label: 'Not Suitable',
  },
};

export const UseCaseMatrix: React.FC = () => {
  const [activeCell, setActiveCell] = useState<{ useCase: UseCase; algorithm: Algorithm } | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Grid3X3 className="w-5 h-5 text-cyber-cyan" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Use Case Matrix
        </h3>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        Which algorithm for which purpose? Click any cell for a detailed explanation.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {Object.entries(suitabilityConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <span key={key} className="flex items-center gap-1.5">
              <span className={`flex items-center justify-center w-5 h-5 rounded ${config.bg}`}>
                <Icon className={`w-3 h-3 ${config.text}`} />
              </span>
              <span className="text-slate-400">{config.label}</span>
            </span>
          );
        })}
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 pr-4 text-slate-500 font-semibold text-xs">
                Use Case
              </th>
              {algorithms.map((alg) => (
                <th
                  key={alg}
                  className="py-3 px-2 text-center text-xs font-bold text-slate-300 whitespace-nowrap"
                >
                  {alg}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {useCases.map((useCase) => (
              <tr key={useCase} className="hover:bg-white/[0.02]">
                <td className="py-3 pr-4 text-xs font-medium text-slate-400 whitespace-nowrap">
                  {useCase}
                </td>
                {algorithms.map((alg) => {
                  const cell = matrix[useCase][alg];
                  const config = suitabilityConfig[cell.suitable];
                  const Icon = config.icon;
                  const isActive =
                    activeCell?.useCase === useCase && activeCell?.algorithm === alg;

                  return (
                    <td key={alg} className="py-3 px-2 text-center">
                      <button
                        onClick={() =>
                          setActiveCell(
                            isActive ? null : { useCase, algorithm: alg }
                          )
                        }
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all hover:scale-110 ${
                          config.bg
                        } ${config.border} ${
                          isActive ? 'ring-2 ring-cyber-cyan ring-offset-1 ring-offset-slate-900' : ''
                        }`}
                        aria-pressed={isActive}
                        title={`${alg} for ${useCase}: ${config.label}`}
                      >
                        <Icon className={`w-4 h-4 ${config.text}`} />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explanation Panel */}
      <AnimatePresence>
        {activeCell && (
          <motion.div
            role="region"
            aria-label="Use case explanation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-white">
                      {activeCell.algorithm}
                    </span>
                    <span className="text-slate-500">for</span>
                    <span className="text-sm font-bold text-cyber-cyan">
                      {activeCell.useCase}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        suitabilityConfig[matrix[activeCell.useCase][activeCell.algorithm].suitable].bg
                      } ${
                        suitabilityConfig[matrix[activeCell.useCase][activeCell.algorithm].suitable].text
                      }`}
                    >
                      {suitabilityConfig[matrix[activeCell.useCase][activeCell.algorithm].suitable].label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {matrix[activeCell.useCase][activeCell.algorithm].explanation}
                  </p>
                </div>
                <button
                  aria-label="Close use case explanation"
                  onClick={() => setActiveCell(null)}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <XIcon className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
