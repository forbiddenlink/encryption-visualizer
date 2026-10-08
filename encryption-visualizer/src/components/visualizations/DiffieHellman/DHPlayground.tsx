import { useState, useMemo } from 'react';
import { computePublicKey, computeSharedSecret, findGenerator } from '@/lib/crypto/diffie-hellman';
import { generatePrime } from '@/lib/crypto/rsa';
import { Eye, EyeOff, RefreshCw, Users } from 'lucide-react';
import { m } from 'framer-motion';

function normalizePrivateKey(value: number, prime: number): number {
  return Number.isFinite(value) ? Math.max(2, Math.min(prime - 2, Math.trunc(value))) : 2;
}

export const DHPlayground: React.FC = () => {
  const [p, setP] = useState(() => generatePrime(23, 97));
  const g = useMemo(() => findGenerator(p), [p]);
  const [alicePrivate, setAlicePrivate] = useState(5);
  const [bobPrivate, setBobPrivate] = useState(7);

  const alicePublic = useMemo(() => computePublicKey(g, alicePrivate, p), [g, alicePrivate, p]);
  const bobPublic = useMemo(() => computePublicKey(g, bobPrivate, p), [g, bobPrivate, p]);
  const aliceSecret = useMemo(() => computeSharedSecret(bobPublic, alicePrivate, p), [bobPublic, alicePrivate, p]);
  const bobSecret = useMemo(() => computeSharedSecret(alicePublic, bobPrivate, p), [alicePublic, bobPrivate, p]);
  const secretsMatch = aliceSecret === bobSecret;

  const regeneratePrime = () => {
    const newPrime = generatePrime(23, 97);
    setP(newPrime);
    setAlicePrivate(value => normalizePrivateKey(value, newPrime));
    setBobPrivate(value => normalizePrivateKey(value, newPrime));
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl">
            <Users className="w-5 h-5 text-white" />
          </div>
          DH Playground
        </h3>
        <button
          onClick={regeneratePrime}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          New Prime
        </button>
      </div>

      {/* Public Parameters */}
      <div className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-4 rounded-xl">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Public Parameters (visible to everyone)
        </div>
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-slate-400">Prime (p):</span>
            <span className="ml-2 font-mono font-bold text-slate-900 dark:text-white">{p}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400">Generator (g):</span>
            <span className="ml-2 font-mono font-bold text-slate-900 dark:text-white">{g}</span>
          </div>
        </div>
      </div>

      {/* Alice & Bob panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Alice */}
        <m.div
          layout
          className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 p-4 rounded-xl space-y-3"
        >
          <h4 className="font-bold text-blue-700 dark:text-blue-300 text-sm">Alice</h4>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
              <EyeOff className="w-3 h-3" /> Private Key (a)
            </p>
            <input
              type="range"
              aria-label="Alice private key slider"
              min={2}
              max={p - 2}
              value={alicePrivate}
              onChange={(e) => setAlicePrivate(normalizePrivateKey(Number(e.target.value), p))}
              className="w-full accent-blue-600"
            />
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-sm font-bold text-blue-700 dark:text-blue-300">{alicePrivate}</span>
              <input
                type="number"
                aria-label="Alice private key"
                min={2}
                max={p - 2}
                value={alicePrivate}
                onChange={(e) => {
                  const v = normalizePrivateKey(Number(e.target.value), p);
                  setAlicePrivate(v);
                }}
                className="w-16 px-2 py-1 text-xs font-mono bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-500/30 rounded text-right"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-lg p-3 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Public Key: A = g^a mod p
            </div>
            <div className="text-xs font-mono text-slate-400">
              {g}^{alicePrivate} mod {p}
            </div>
            <m.div
              key={alicePublic}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400"
            >
              A = {alicePublic}
            </m.div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-3 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Shared Secret: s = B^a mod p
            </div>
            <div className="text-xs font-mono text-slate-400">
              {bobPublic}^{alicePrivate} mod {p}
            </div>
            <m.div
              key={aliceSecret}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400"
            >
              s = {aliceSecret}
            </m.div>
          </div>
        </m.div>

        {/* Bob */}
        <m.div
          layout
          className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 p-4 rounded-xl space-y-3"
        >
          <h4 className="font-bold text-purple-700 dark:text-purple-300 text-sm">Bob</h4>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
              <EyeOff className="w-3 h-3" /> Private Key (b)
            </p>
            <input
              type="range"
              aria-label="Bob private key slider"
              min={2}
              max={p - 2}
              value={bobPrivate}
              onChange={(e) => setBobPrivate(normalizePrivateKey(Number(e.target.value), p))}
              className="w-full accent-purple-600"
            />
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-sm font-bold text-purple-700 dark:text-purple-300">{bobPrivate}</span>
              <input
                type="number"
                aria-label="Bob private key"
                min={2}
                max={p - 2}
                value={bobPrivate}
                onChange={(e) => {
                  const v = normalizePrivateKey(Number(e.target.value), p);
                  setBobPrivate(v);
                }}
                className="w-16 px-2 py-1 text-xs font-mono bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-500/30 rounded text-right"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-lg p-3 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Public Key: B = g^b mod p
            </div>
            <div className="text-xs font-mono text-slate-400">
              {g}^{bobPrivate} mod {p}
            </div>
            <m.div
              key={bobPublic}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="font-mono text-lg font-bold text-purple-600 dark:text-purple-400"
            >
              B = {bobPublic}
            </m.div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-3 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Shared Secret: s = A^b mod p
            </div>
            <div className="text-xs font-mono text-slate-400">
              {alicePublic}^{bobPrivate} mod {p}
            </div>
            <m.div
              key={bobSecret}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400"
            >
              s = {bobSecret}
            </m.div>
          </div>
        </m.div>
      </div>

      {/* Match indicator */}
      <m.div
        key={String(secretsMatch)}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center p-3 rounded-xl font-semibold text-sm ${
          secretsMatch
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300'
        }`}
      >
        {secretsMatch
          ? `Both computed the same shared secret: ${aliceSecret}`
          : 'Secrets do not match (bug -- should always match!)'}
      </m.div>

      {/* Eve panel */}
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 p-4 rounded-xl space-y-2">
        <h4 className="font-bold text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
          <Eye className="w-4 h-4" /> Eve (Eavesdropper)
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Eve can see everything sent over the public channel, but cannot compute the shared secret.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-white dark:bg-slate-800/50 rounded-lg p-2">
            <div className="text-[10px] text-slate-400 uppercase mb-1">Can see</div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-slate-700 dark:text-slate-300">p = {p}</div>
              <div className="text-slate-700 dark:text-slate-300">g = {g}</div>
              <div className="text-blue-600 dark:text-blue-400">A = {alicePublic}</div>
              <div className="text-purple-600 dark:text-purple-400">B = {bobPublic}</div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800/50 rounded-lg p-2">
            <div className="text-[10px] text-red-400 uppercase mb-1">Cannot see</div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-red-400 line-through">a = ???</div>
              <div className="text-red-400 line-through">b = ???</div>
              <div className="text-red-400 line-through">s = ???</div>
            </div>
            <p className="text-[10px] text-red-500 dark:text-red-400 mt-1">
              Computing a from A requires solving the discrete logarithm problem
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
