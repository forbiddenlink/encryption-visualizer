import { useState, useMemo } from 'react';
import { simpleHash, compareHashes } from '@/lib/crypto/hash';
import { Copy, Check, FlaskConical, GitCompare } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

type ViewMode = 'single' | 'compare';
type HashDisplay = 'hex' | 'binary' | 'blocks';

function hexToBinary(hex: string): string {
  return hex
    .split('')
    .map((c) => parseInt(c, 16).toString(2).padStart(4, '0'))
    .join(' ');
}

function HexBlock({ hex, highlight }: { hex: string; highlight?: boolean }) {
  return (
    <span
      className={`inline-block w-7 h-7 rounded text-center text-xs font-mono leading-7 transition-all duration-200 ${
        highlight
          ? 'bg-red-500/30 text-red-300 ring-1 ring-red-500/50'
          : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
      }`}
    >
      {hex}
    </span>
  );
}

function ColorBlocks({ hex, diffHex }: { hex: string; diffHex?: string }) {
  return (
    <div className="flex flex-wrap gap-1">
      {hex.split('').map((char, idx) => {
        const isDiff = diffHex ? char !== diffHex[idx] : false;
        return <HexBlock key={idx} hex={char} highlight={isDiff} />;
      })}
    </div>
  );
}

export const HashPlayground: React.FC = () => {
  const [input, setInput] = useState('');
  const [compareInput, setCompareInput] = useState('');
  const [mode, setMode] = useState<ViewMode>('single');
  const [display, setDisplay] = useState<HashDisplay>('blocks');
  const [copied, setCopied] = useState(false);

  const hash = useMemo(() => (input ? simpleHash(input) : ''), [input]);
  const comparison = useMemo(
    () => (mode === 'compare' && input && compareInput ? compareHashes(input, compareInput) : null),
    [mode, input, compareInput]
  );

  const handleCopy = async () => {
    if (!hash) return;
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const renderHash = (h: string, diffHash?: string) => {
    if (!h) return <span className="text-slate-400 italic text-sm">Type something to see the hash</span>;
    switch (display) {
      case 'hex':
        return <span className="font-mono text-lg text-emerald-600 dark:text-emerald-400 break-all">{h}</span>;
      case 'binary':
        return (
          <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 break-all leading-relaxed">
            {hexToBinary(h)}
          </span>
        );
      case 'blocks':
        return <ColorBlocks hex={h} diffHex={diffHash} />;
    }
  };

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-xl">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          Hash Playground
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'single'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Single
          </button>
          <button
            onClick={() => setMode('compare')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'compare'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <GitCompare className="w-3 h-3" />
            Compare
          </button>
        </div>
      </div>

      {/* Display mode selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">View:</span>
        {(['hex', 'binary', 'blocks'] as HashDisplay[]).map((d) => (
          <button
            key={d}
            onClick={() => setDisplay(d)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              display === d
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      <div className={mode === 'compare' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}>
        {/* Input A */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all pr-16"
              aria-label="Playground message" placeholder="Type to hash in real-time..."
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
              {input.length} chars
            </span>
          </div>

          <AnimatePresence mode="wait">
            <m.div
              key={hash}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-4 rounded-xl min-h-[60px] flex items-center justify-between gap-3"
            >
              <div className="flex-1">{renderHash(hash, comparison?.hash2)}</div>
              {hash && (
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex-shrink-0"
                  aria-label="Copy hash"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  )}
                </button>
              )}
            </m.div>
          </AnimatePresence>
        </div>

        {/* Input B (compare mode) */}
        {mode === 'compare' && (
          <div className="space-y-3">
            <input
              type="text"
              value={compareInput}
              onChange={(e) => setCompareInput(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              aria-label="Comparison message" placeholder="Compare with..."
            />

            <AnimatePresence mode="wait">
              <m.div
                key={comparison?.hash2 ?? ''}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-4 rounded-xl min-h-[60px] flex items-center"
              >
                {renderHash(comparison?.hash2 ?? '', comparison?.hash1)}
              </m.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Comparison stats */}
      {mode === 'compare' && comparison && (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4 flex items-center justify-around text-center"
        >
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{comparison.bitsChanged}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">bits changed</div>
          </div>
          <div className="w-px h-8 bg-blue-200 dark:bg-blue-500/30" />
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{comparison.similarity}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">similarity</div>
          </div>
          <div className="w-px h-8 bg-blue-200 dark:bg-blue-500/30" />
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {32 - comparison.bitsChanged}/{32}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">bits match</div>
          </div>
        </m.div>
      )}
    </div>
  );
};
