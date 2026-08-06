import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ArrowRight, Gauge } from 'lucide-react';
import {
  CIPHER_ALGOS,
  runCipher,
  toHex,
  type CipherAlgo,
} from '@/lib/cipher-lab';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const SPEEDS = [0.5, 1, 2, 4] as const;
const BASE_INTERVAL = 620; // ms per step at 1x

/** Single byte cell in the plaintext / ciphertext rows. */
interface ByteCellProps {
  char: string;
  hex: string;
  state: 'pending' | 'active' | 'done';
  variant: 'in' | 'out';
  reduced: boolean;
}

const ByteCell = ({ char, hex, state, variant, reduced }: ByteCellProps) => {
  const base =
    'relative flex flex-col items-center justify-center rounded-md border w-11 h-12 sm:w-12 sm:h-14 font-mono transition-colors duration-200 select-none';
  const tone =
    variant === 'in'
      ? {
          pending: 'bg-slate-100 dark:bg-cyber-dark border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600',
          active: 'bg-cyber-blue/10 border-cyber-blue text-cyber-blue',
          done: 'bg-slate-100 dark:bg-cyber-dark border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-500',
        }
      : {
          pending: 'bg-slate-100 dark:bg-cyber-dark border-slate-200 dark:border-white/5 text-slate-300 dark:text-slate-700',
          active: 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan shadow-[0_0_16px_rgba(6,182,212,0.35)]',
          done: 'bg-emerald-500/10 dark:bg-cyber-cyan/5 border-emerald-500/30 dark:border-cyber-cyan/25 text-emerald-600 dark:text-cyber-cyan',
        };

  return (
    <m.div
      className={`${base} ${tone[state]}`}
      animate={
        reduced
          ? undefined
          : { scale: state === 'active' ? 1.08 : 1, y: state === 'active' ? -2 : 0 }
      }
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
    >
      <span className="text-base sm:text-lg font-semibold leading-none">
        {char === ' ' ? '␣' : char}
      </span>
      <span className="text-[9px] sm:text-[10px] leading-none mt-1 opacity-70">{hex}</span>
    </m.div>
  );
};

export const CipherLabDemo = () => {
  const reduced = useReducedMotion();

  const [algo, setAlgo] = useState<CipherAlgo>('xor');
  const [text, setText] = useState('encrypt me');
  const [key, setKey] = useState('KEY');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const meta = useMemo(() => CIPHER_ALGOS.find((a) => a.id === algo)!, [algo]);
  const result = useMemo(() => runCipher(algo, text, key), [algo, text, key]);
  const frames = result.frames;
  const total = frames.length;
  // step 0 == nothing revealed; step N == N bytes transformed.
  const revealed = step;
  const activeIndex = revealed > 0 ? revealed - 1 : -1;
  const activeFrame = activeIndex >= 0 ? frames[activeIndex] : null;
  const atEnd = revealed >= total;

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Reset the run whenever the configuration changes. Called from the input
  // handlers rather than an effect so state updates stay in event handlers.
  const resetRun = useCallback(() => {
    setPlaying(false);
    setStep(0);
  }, []);

  const selectAlgo = (id: CipherAlgo) => {
    setAlgo(id);
    resetRun();
  };
  const changeText = (v: string) => {
    setText(v);
    resetRun();
  };
  const changeKey = (v: string) => {
    setKey(v);
    resetRun();
  };

  // Playback loop. The tick advances one step and stops itself at the end —
  // all setState happens inside the interval callback (an event), not the
  // effect body, so there are no cascading synchronous renders.
  useEffect(() => {
    clearTimer();
    if (!playing || total === 0) return;
    timerRef.current = window.setInterval(() => {
      const next = stepRef.current + 1;
      setStep(Math.min(next, total));
      if (next >= total) setPlaying(false);
    }, BASE_INTERVAL / speed);
    return clearTimer;
  }, [playing, speed, total]);

  const togglePlay = useCallback(() => {
    if (atEnd) {
      setStep(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  }, [atEnd]);

  const reset = () => {
    setPlaying(false);
    setStep(0);
  };
  const back = () => {
    setPlaying(false);
    setStep((s) => Math.max(0, s - 1));
  };
  const forward = () => {
    setPlaying(false);
    setStep((s) => Math.min(total, s + 1));
  };

  const progress = total > 0 ? (revealed / total) * 100 : 0;

  return (
    <section
      aria-label="Interactive cipher lab"
      className="glass-card p-5 sm:p-7 space-y-6 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            {!reduced && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75 animate-ping" />
            )}
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-cyan" />
          </span>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Cipher Lab
          </h2>
        </div>
        <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
          live byte-by-byte transform
        </p>
      </div>

      {/* Algorithm selector */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Cipher algorithm">
        {CIPHER_ALGOS.map((a) => {
          const selected = a.id === algo;
          return (
            <button
              key={a.id}
              role="tab"
              aria-selected={selected}
              onClick={() => selectAlgo(a.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.98] border ${
                selected
                  ? 'bg-cyber-blue text-white border-cyber-blue shadow-[0_0_14px_rgba(59,130,246,0.3)]'
                  : 'bg-slate-100 dark:bg-cyber-dark text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:border-cyber-blue/40'
              }`}
            >
              {a.label}
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  selected ? 'bg-white/20' : 'bg-white dark:bg-cyber-surface text-slate-400'
                }`}
              >
                {a.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
        <label className="block">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
            Plaintext
          </span>
          <input
            type="text"
            value={text}
            maxLength={18}
            onChange={(e) => changeText(e.target.value)}
            placeholder="type a message…"
            aria-label="Plaintext to encrypt"
          />
        </label>
        {meta.usesKey && (
          <label className="block sm:w-32">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
              {meta.keyLabel}
            </span>
            <input
              type="text"
              value={key}
              maxLength={12}
              onChange={(e) => changeKey(e.target.value)}
              aria-label={`${meta.keyLabel} for cipher`}
              inputMode={algo === 'caesar' ? 'numeric' : 'text'}
            />
          </label>
        )}
      </div>

      {/* Flow: plaintext -> core -> ciphertext */}
      <div className="space-y-4">
        {/* Plaintext row */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Input
          </div>
          <div className="flex flex-wrap gap-1.5">
            {frames.map((f, i) => (
              <ByteCell
                key={`in-${i}`}
                char={f.inChar}
                hex={toHex(f.inByte)}
                variant="in"
                state={i === activeIndex ? 'active' : i < activeIndex ? 'done' : 'pending'}
                reduced={reduced}
              />
            ))}
          </div>
        </div>

        {/* Core */}
        <div className="flex items-center justify-center gap-3 py-1">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-slate-200 dark:to-white/10" />
          <m.div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue font-mono text-sm font-semibold"
            animate={reduced || !playing ? undefined : { scale: [1, 1.04, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <span aria-hidden="true">↓</span>
            {activeFrame ? activeFrame.operand : meta.tag}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </m.div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 dark:via-white/10 to-slate-200 dark:to-white/10" />
        </div>

        {/* Ciphertext row */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Ciphertext
          </div>
          <div className="flex flex-wrap gap-1.5">
            {frames.map((f, i) => (
              <ByteCell
                key={`out-${i}`}
                char={i < revealed ? f.outChar : '·'}
                hex={i < revealed ? toHex(f.outByte) : '··'}
                variant="out"
                state={i === activeIndex ? 'active' : i < activeIndex ? 'done' : 'pending'}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step note */}
      <div
        className="min-h-[2.5rem] flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-100/70 dark:bg-cyber-dark/60 border border-slate-200 dark:border-white/5"
        aria-live="polite"
      >
        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 shrink-0">
          {activeFrame ? `[${activeIndex + 1}/${total}]` : `[0/${total}]`}
        </span>
        <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
          {activeFrame ? activeFrame.note : meta.rule}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="min-w-[44px] min-h-[44px] p-2.5 bg-slate-100 dark:bg-cyber-surface hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-lg transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyber-blue flex items-center justify-center"
            title="Reset"
            aria-label="Reset cipher lab"
          >
            <RotateCcw className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <button
            onClick={back}
            disabled={revealed === 0}
            className="min-w-[44px] min-h-[44px] p-2.5 bg-slate-100 dark:bg-cyber-surface hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyber-blue flex items-center justify-center"
            title="Step back"
            aria-label="Previous step"
          >
            <SkipBack className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <button
            onClick={togglePlay}
            className="min-h-[44px] px-6 py-3 bg-cyber-blue hover:bg-cyber-cyan hover:text-cyber-dark text-white rounded-lg transition-all duration-150 active:scale-[0.98] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
            aria-label={playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
          >
            {playing ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
            <span className="font-semibold text-sm">
              {playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
            </span>
          </button>
          <button
            onClick={forward}
            disabled={atEnd}
            className="min-w-[44px] min-h-[44px] p-2.5 bg-slate-100 dark:bg-cyber-surface hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyber-blue flex items-center justify-center"
            title="Step forward"
            aria-label="Next step"
          >
            <SkipForward className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Speed */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-cyber-surface border border-slate-200 dark:border-white/5 rounded-lg">
          <Gauge className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded-md text-xs font-semibold transition-all duration-150 active:scale-95 ${
                speed === s
                  ? 'bg-cyber-blue text-white'
                  : 'bg-white dark:bg-cyber-dark text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5'
              }`}
              aria-label={`Speed ${s}x`}
              aria-pressed={speed === s}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrubber */}
      <div className="space-y-1.5">
        <input
          type="range"
          min={0}
          max={total}
          value={revealed}
          onChange={(e) => {
            setPlaying(false);
            setStep(Number(e.target.value));
          }}
          className="w-full accent-cyber-blue cursor-pointer"
          aria-label="Scrub through cipher steps"
          aria-valuetext={`Step ${revealed} of ${total}`}
        />
        <div className="h-1 rounded-full bg-slate-200 dark:bg-cyber-dark overflow-hidden">
          <div
            className="h-full bg-cyber-cyan transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
};
