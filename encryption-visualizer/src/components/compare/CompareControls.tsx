import React from 'react';
import { useCompareStore, type ComparableAlgorithm } from '@/store/compareStore';
import { Link2, Link2Off } from 'lucide-react';

const algorithms: { id: ComparableAlgorithm; label: string; color: string }[] = [
  { id: 'aes', label: 'AES', color: 'bg-blue-600' },
  { id: 'rsa', label: 'RSA', color: 'bg-purple-600' },
  { id: 'hashing', label: 'Hashing', color: 'bg-emerald-600' },
  { id: 'signatures', label: 'Signatures', color: 'bg-amber-600' },
  { id: 'diffie-hellman', label: 'Diffie-Hellman', color: 'bg-indigo-600' },
  { id: 'block-modes', label: 'Block Modes', color: 'bg-red-600' },
];

export const CompareControls: React.FC = () => {
  const {
    leftAlgorithm,
    rightAlgorithm,
    syncPlayback,
    setLeftAlgorithm,
    setRightAlgorithm,
    toggleSyncPlayback,
  } = useCompareStore();

  return (
    <div className="glass-card p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Compare Algorithms
        </h2>

        <button
          onClick={toggleSyncPlayback}
          aria-pressed={syncPlayback}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            syncPlayback
              ? 'bg-cyber-blue text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {syncPlayback ? (
            <>
              <Link2 className="w-4 h-4" />
              Sync On
            </>
          ) : (
            <>
              <Link2Off className="w-4 h-4" />
              Sync Off
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left Algorithm */}
        <div className="space-y-2">
          <span className="block text-sm font-semibold text-slate-600 dark:text-slate-400">
            Left Panel
          </span>
          <div className="flex flex-wrap gap-2">
            {algorithms.map((alg) => (
              <button
                key={`left-${alg.id}`}
                onClick={() => setLeftAlgorithm(alg.id)}
                aria-pressed={leftAlgorithm === alg.id}
                disabled={alg.id === rightAlgorithm}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  leftAlgorithm === alg.id
                    ? `${alg.color} text-white`
                    : alg.id === rightAlgorithm
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {alg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Algorithm */}
        <div className="space-y-2">
          <span className="block text-sm font-semibold text-slate-600 dark:text-slate-400">
            Right Panel
          </span>
          <div className="flex flex-wrap gap-2">
            {algorithms.map((alg) => (
              <button
                key={`right-${alg.id}`}
                onClick={() => setRightAlgorithm(alg.id)}
                aria-pressed={rightAlgorithm === alg.id}
                disabled={alg.id === leftAlgorithm}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  rightAlgorithm === alg.id
                    ? `${alg.color} text-white`
                    : alg.id === leftAlgorithm
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {alg.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
