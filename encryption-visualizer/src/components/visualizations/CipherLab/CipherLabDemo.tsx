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
  return (
    <m.div
      className="cipher-byte"
      data-state={state}
      data-variant={variant}
      animate={
        reduced
          ? undefined
          : { scale: state === 'active' ? 1.08 : 1, y: state === 'active' ? -2 : 0 }
      }
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
    >
      <span className="cipher-byte-character">
        {char === ' ' ? '␣' : char}
      </span>
      <span className="cipher-byte-hex">{hex}</span>
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
  const atEnd = total > 0 && revealed >= total;

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
      className="cipher-instrument"
    >
      <div className="instrument-header">
        <div><p className="eyebrow">Experiment 01 / Live specimen</p><h2>Cipher Lab</h2></div>
        <span className="instrument-serial">BYTE → BYTE</span>
      </div>

      {/* Algorithm selector */}
      <div className="instrument-tabs" role="group" aria-label="Cipher algorithm">
        {CIPHER_ALGOS.map((a) => {
          const selected = a.id === algo;
          return (
            <button
              key={a.id}
              aria-pressed={selected}
              onClick={() => selectAlgo(a.id)}
              className="instrument-tab"
            >
              {a.label}
              <span className="instrument-tab-tag">{a.tag}</span>
            </button>
          );
        })}
      </div>

      {/* Inputs */}
      <div className="instrument-inputs">
        <label className="block">
          <span className="instrument-input-label">
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
          <label className="instrument-key">
            <span className="instrument-input-label">
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
      <div className="instrument-flow">
        {/* Plaintext row */}
        <div>
          <div className="byte-label">
            Input
          </div>
          <div className="byte-cells">
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

        <div className="cipher-operation">
          <span aria-hidden="true" className="cipher-operation-line" />
          <div className="cipher-operation-value">
            <span aria-hidden="true">↓</span>
            <span>{activeFrame ? activeFrame.operand : meta.tag}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </div>
          <span aria-hidden="true" className="cipher-operation-line" />
        </div>

        {/* Ciphertext row */}
        <div>
          <div className="byte-label">
            Ciphertext
          </div>
          <div className="byte-cells">
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

      {total === 0 && <p role="status" className="text-sm text-slate-600 dark:text-slate-300">Enter a message to see its bytes and begin the transformation.</p>}

      {/* Step note */}
      <div
        className="instrument-note"
        aria-live="polite"
      >
        <span className="instrument-step-number">
          {activeFrame ? `[${activeIndex + 1}/${total}]` : `[0/${total}]`}
        </span>
        <span className="instrument-step-note">
          {activeFrame ? activeFrame.note : meta.rule}
        </span>
      </div>

      {/* Controls */}
      <div className="instrument-controls">
        <div className="control-group">
          <button
            onClick={reset}
            className="control-button"
            title="Reset"
            aria-label="Reset cipher lab"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={back}
            disabled={revealed === 0}
            className="control-button"
            title="Step back"
            aria-label="Previous step"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlay}
            disabled={total === 0}
            className="control-button control-play"
            aria-label={playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
          >
            {playing ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span className="font-semibold text-sm">
              {playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
            </span>
          </button>
          <button
            onClick={forward}
            disabled={atEnd || total === 0}
            className="control-button"
            title="Step forward"
            aria-label="Next step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed */}
        <div className="instrument-speed">
          <Gauge className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className="instrument-speed-button"
              aria-label={`Speed ${s}x`}
              aria-pressed={speed === s}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrubber */}
      <div className="instrument-scrubber">
        <input
          type="range"
          min={0}
          max={total}
          value={revealed}
          onChange={(e) => {
            setPlaying(false);
            setStep(Number(e.target.value));
          }}
          className="instrument-range"
          aria-label="Scrub through cipher steps"
          aria-valuetext={`Step ${revealed} of ${total}`}
        />
        <div className="instrument-progress">
          <div
            className="instrument-progress-value"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
};
