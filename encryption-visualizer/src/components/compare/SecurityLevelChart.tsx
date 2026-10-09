import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface SecurityLevel {
  bits: number;
  label: string;
  algorithms: { name: string; keySize: number; color: string; family: string }[];
  nistRecommended: boolean;
}

const securityLevels: SecurityLevel[] = [
  {
    bits: 80,
    label: '80-bit (Legacy)',
    nistRecommended: false,
    algorithms: [
      { name: 'RSA-1024', keySize: 1024, color: 'bg-purple-500', family: 'Asymmetric' },
      { name: 'ECC-160', keySize: 160, color: 'bg-indigo-500', family: 'Asymmetric' },
      { name: '2-Key 3DES', keySize: 112, color: 'bg-blue-500', family: 'Symmetric' },
    ],
  },
  {
    bits: 128,
    label: '128-bit (Standard)',
    nistRecommended: true,
    algorithms: [
      { name: 'AES-128', keySize: 128, color: 'bg-blue-500', family: 'Symmetric' },
      { name: 'RSA-3072', keySize: 3072, color: 'bg-purple-500', family: 'Asymmetric' },
      { name: 'ECC-256', keySize: 256, color: 'bg-indigo-500', family: 'Asymmetric' },
    ],
  },
  {
    bits: 192,
    label: '192-bit (High)',
    nistRecommended: true,
    algorithms: [
      { name: 'AES-192', keySize: 192, color: 'bg-blue-500', family: 'Symmetric' },
      { name: 'RSA-7680', keySize: 7680, color: 'bg-purple-500', family: 'Asymmetric' },
      { name: 'ECC-384', keySize: 384, color: 'bg-indigo-500', family: 'Asymmetric' },
    ],
  },
  {
    bits: 256,
    label: '256-bit (Top Secret)',
    nistRecommended: true,
    algorithms: [
      { name: 'AES-256', keySize: 256, color: 'bg-blue-500', family: 'Symmetric' },
      { name: 'RSA-15360', keySize: 15360, color: 'bg-purple-500', family: 'Asymmetric' },
      { name: 'ECC-512', keySize: 512, color: 'bg-indigo-500', family: 'Asymmetric' },
    ],
  },
];

const maxKeySize = 15360;

export const SecurityLevelChart: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Shield className="w-5 h-5 text-cyber-cyan" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Equivalent Security Levels
        </h3>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        Different algorithms need different key sizes to achieve the same security level.
        Shorter bars mean more efficient key usage.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-500" />
          Symmetric
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-purple-500" />
          RSA
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-indigo-500" />
          ECC
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          NIST Recommended
        </span>
      </div>

      <div className="space-y-6">
        {securityLevels.map((level, levelIndex) => (
          <motion.div
            key={level.bits}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: levelIndex * 0.1 }}
            className={`p-4 rounded-xl border ${
              level.nistRecommended
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-white/5'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-bold text-white">{level.label}</h4>
              {level.nistRecommended && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-full">
                  NIST
                </span>
              )}
            </div>

            <div className="space-y-2">
              {level.algorithms.map((alg, algIndex) => {
                const widthPercent = Math.max(
                  (Math.log(alg.keySize) / Math.log(maxKeySize)) * 100,
                  8
                );

                return (
                  <div key={alg.name} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono w-24 flex-shrink-0 text-right">
                      {alg.name}
                    </span>
                    <div className="flex-1 h-6 bg-slate-900/50 rounded-lg overflow-hidden">
                      <motion.div
                        className={`h-full ${alg.color} rounded-lg flex items-center justify-end pr-2`}
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPercent}%` }}
                        transition={{
                          delay: levelIndex * 0.1 + algIndex * 0.05,
                          duration: 0.6,
                          ease: 'easeOut',
                        }}
                      >
                        <span className="text-[10px] font-bold text-white/90 whitespace-nowrap">
                          {alg.keySize} bits
                        </span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-cyber-blue/5 border border-cyber-blue/20">
        <p className="text-xs text-slate-400">
          <span className="font-bold text-cyber-cyan">Key insight:</span> RSA needs
          dramatically larger keys than AES or ECC for the same security.
          RSA-3072 (3072 bits) provides the same security as AES-128 (128 bits) or ECC-256 (256 bits).
        </p>
      </div>
    </div>
  );
};
