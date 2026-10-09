import React, { useState } from 'react';
import { Hash, Zap, Sparkles } from 'lucide-react';
import { MAX_SHA256_TRACE_BYTES } from '@/lib/crypto/sha256';

export const HashInputPanel: React.FC<{ onHash: (input: string) => void }> = ({ onHash }) => {
  const [input, setInput] = useState('Hello, World!');
  const byteLength = new TextEncoder().encode(input).length;
  const error = byteLength > MAX_SHA256_TRACE_BYTES
    ? `Use at most ${MAX_SHA256_TRACE_BYTES} UTF-8 bytes for the step-by-step trace.`
    : '';

  const submit = (message: string): void => {
    if (new TextEncoder().encode(message).length <= MAX_SHA256_TRACE_BYTES) onHash(message);
  };

  const examples = [
    'Hello, World!',
    'Cryptography',
    'SHA-256',
    'Blockchain',
  ];

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-xl">
            <Hash className="w-5 h-5 text-white" />
          </div>
          Hash Function Input
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="hash-input" className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 block">
            Enter text to hash:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="hash-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-w-0 flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              aria-invalid={Boolean(error)}
              aria-describedby="hash-input-hint hash-input-error"
              placeholder="Enter any text..."
            />
            <button
              onClick={() => submit(input)}
              className="btn-primary px-6"
            >
              <Zap className="w-4 h-4" />
              Hash It!
            </button>
          </div>
          <p id="hash-input-hint" className="text-xs text-slate-500 dark:text-slate-400 mt-2">SHA-256 · {byteLength} / {MAX_SHA256_TRACE_BYTES} UTF-8 bytes. Empty input is supported.</p>
          <p id="hash-input-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Quick examples:</span>
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => {
                setInput(example);
                submit(example);
              }}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/30 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Hash Functions:</span> Transform any input into a fixed-size output. Same input always produces the same hash, but even tiny changes create completely different hashes!
          </div>
        </div>
      </div>
    </div>
  );
};
