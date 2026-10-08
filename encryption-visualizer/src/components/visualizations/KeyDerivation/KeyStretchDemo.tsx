import { useState, useCallback } from 'react';
import { simpleHash } from '@/lib/crypto/hash';
import { Timer, Shield, AlertTriangle } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

interface BenchmarkResult {
  iterations: number;
  timeMs: number;
  hash: string;
}

function iteratedHash(input: string, iterations: number): { hash: string; timeMs: number } {
  const start = performance.now();
  let h = input;
  for (let i = 0; i < iterations; i++) {
    h = simpleHash(h);
  }
  const end = performance.now();
  return { hash: h, timeMs: end - start };
}

const ITERATION_COUNTS = [1, 10, 100, 1000, 10000];
const DICTIONARY_SIZE = 100_000;

export const KeyStretchDemo: React.FC = () => {
  const [password, setPassword] = useState('password123');
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [running, setRunning] = useState(false);

  const runBenchmark = useCallback(() => {
    if (!password) return;
    setRunning(true);
    setResults([]);

    // Run in a timeout so the UI updates
    setTimeout(() => {
      const newResults: BenchmarkResult[] = [];
      for (const count of ITERATION_COUNTS) {
        const { hash, timeMs } = iteratedHash(password, count);
        newResults.push({ iterations: count, timeMs, hash });
      }
      setResults(newResults);
      setRunning(false);
    }, 50);
  }, [password]);

  const maxTime = Math.max(...results.map((r) => r.timeMs), 0.01);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-amber-600 rounded-xl">
            <Shield className="w-5 h-5 text-white" />
          </div>
          Key Stretching Demo
        </h3>
      </div>

      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="font-semibold text-amber-600 dark:text-amber-400">Why slow is good:</span>{' '}
            Password hashing should be deliberately slow. Each iteration makes brute-force attacks
            exponentially harder -- if one hash takes 1ms, hashing a 100K-word dictionary takes 100 seconds
            instead of 0.1 seconds.
          </div>
        </div>
      </div>

      {/* Password input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="min-w-0 flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          aria-label="Key stretching password" placeholder="Enter a password..."
        />
        <button
          onClick={runBenchmark}
          disabled={running || !password}
          className="px-6 py-3 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-all duration-150 active:scale-95 shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Timer className="w-4 h-4" />
          {running ? 'Running...' : 'Benchmark'}
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Iteration results */}
            <div className="space-y-2">
              {results.map((result, idx) => (
                <m.div
                  key={result.iterations}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 w-20">
                        {result.iterations.toLocaleString()}x
                      </span>
                      <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 truncate max-w-[140px]">
                        {result.hash}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      {result.timeMs < 1 ? result.timeMs.toFixed(3) : result.timeMs.toFixed(1)} ms
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <m.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max((result.timeMs / maxTime) * 100, 1)}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                    />
                  </div>
                </m.div>
              ))}
            </div>

            {/* Dictionary attack comparison */}
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-red-700 dark:text-red-300 text-sm">
                Dictionary Attack Time ({DICTIONARY_SIZE.toLocaleString()} passwords)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {results.map((result) => {
                  const dictionaryTimeMs = result.timeMs * DICTIONARY_SIZE;
                  const dictionaryTimeSec = dictionaryTimeMs / 1000;
                  let display: string;
                  if (dictionaryTimeSec < 1) {
                    display = `${dictionaryTimeMs.toFixed(0)} ms`;
                  } else if (dictionaryTimeSec < 60) {
                    display = `${dictionaryTimeSec.toFixed(1)} sec`;
                  } else if (dictionaryTimeSec < 3600) {
                    display = `${(dictionaryTimeSec / 60).toFixed(1)} min`;
                  } else {
                    display = `${(dictionaryTimeSec / 3600).toFixed(1)} hrs`;
                  }

                  return (
                    <div
                      key={result.iterations}
                      className="bg-white dark:bg-slate-800/50 rounded-lg p-2 text-center"
                    >
                      <div className="text-[10px] text-slate-400 uppercase">
                        {result.iterations.toLocaleString()} iters
                      </div>
                      <div className="font-mono text-sm font-bold text-red-600 dark:text-red-400">
                        {display}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                More iterations = more time per password = exponentially harder for attackers.
                Production systems like bcrypt use 10,000+ iterations.
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
