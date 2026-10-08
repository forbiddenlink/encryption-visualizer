import React, { useState, useEffect, useRef, useMemo } from 'react';
import { m } from 'framer-motion';
import { Zap, Clock, Shield } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface BruteForceDemoProps {
  attempts?: { key: string | number; result: string; isCorrect: boolean }[];
  progress?: number;
  isActive?: boolean;
}

const KEY_SIZE_DATA = [
  { name: 'Caesar', bits: 5, keys: '26', time: '< 1 microsecond', color: 'bg-green-500', width: 1 },
  { name: 'DES', bits: 56, keys: '7.2 x 10^16', time: '~1 day', color: 'bg-yellow-500', width: 8 },
  { name: 'AES-128', bits: 128, keys: '3.4 x 10^38', time: '~10^18 years', color: 'bg-orange-500', width: 30 },
  { name: 'AES-256', bits: 256, keys: '1.2 x 10^77', time: '~10^50 years', color: 'bg-red-600', width: 100 },
];

const TIMELINE_EVENTS = [
  { label: 'Caesar brute force', time: '0.001 sec', position: 0 },
  { label: 'DES brute force', time: '~1 day', position: 15 },
  { label: 'Age of universe', time: '13.8B years', position: 40 },
  { label: 'AES-128 brute force', time: '10^18 years', position: 65 },
  { label: 'Heat death of universe', time: '~10^100 years', position: 85 },
  { label: 'AES-256 brute force', time: '10^50 years', position: 75 },
];

export const BruteForceDemo: React.FC<BruteForceDemoProps> = ({
  attempts = [],
  progress = 0,
  isActive = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [counter, setCounter] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animate counter when active
  useEffect(() => {
    if (isActive && !prefersReducedMotion) {
      intervalRef.current = setInterval(() => {
        setCounter((prev) => (prev + Math.floor(Math.random() * 3) + 1) % 26);
      }, 50);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, prefersReducedMotion]);

  const transition = useMemo(
    () => (prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }),
    [prefersReducedMotion]
  );

  return (
    <div className="space-y-4">
      {/* Attempt Counter */}
      {isActive && (
        <m.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={transition}
          className="glass-card p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">
                Current Attempt
              </div>
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                Shift = {isActive && !prefersReducedMotion ? counter : 0}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">Progress</div>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
              {Math.round(progress)}%
            </div>
          </div>
        </m.div>
      )}

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <m.div
            className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8 }}
          />
        </div>
      )}

      {/* Attempts Table */}
      {attempts.length > 0 && (
        <div className="glass-card p-4 space-y-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Decryption Attempts
          </h4>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {attempts.map((attempt, idx) => (
              <m.div
                key={idx}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                transition={{ ...transition, delay: idx * 0.05 }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono ${
                  attempt.isCorrect
                    ? 'bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-500/40'
                    : 'bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5'
                }`}
              >
                <span className={`font-bold min-w-[60px] ${
                  attempt.isCorrect
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  Key: {attempt.key}
                </span>
                <span className={`flex-1 truncate ${
                  attempt.isCorrect
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {attempt.result}
                </span>
                {attempt.isCorrect && (
                  <span className="px-2 py-0.5 bg-green-600 text-white rounded text-[10px] font-bold flex-shrink-0">
                    MATCH
                  </span>
                )}
              </m.div>
            ))}
          </div>
        </div>
      )}

      {/* Key Space Comparison */}
      <div className="glass-card p-4 sm:p-6 space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          Key Size vs Brute Force Time
        </h4>

        <div className="space-y-3">
          {KEY_SIZE_DATA.map((item, idx) => (
            <m.div
              key={item.name}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              transition={{ ...transition, delay: idx * 0.1 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {item.name}
                  <span className="text-slate-400 dark:text-slate-500 ml-1">
                    ({item.bits} bits)
                  </span>
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-mono">
                  {item.time}
                </span>
              </div>
              <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <m.div
                  className={`h-full ${item.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.width}%` }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: idx * 0.15 }}
                />
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                {item.keys} possible keys
              </div>
            </m.div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="glass-card p-4 sm:p-6 space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-500" />
          Cosmic Timeline of Brute Force
        </h4>

        <div className="relative grid gap-3 sm:block sm:h-32">
          {/* Timeline line */}
          <div className="hidden sm:block absolute left-0 right-0 top-1/2 h-0.5 bg-slate-300 dark:bg-slate-600" />

          {TIMELINE_EVENTS.map((event, idx) => (
            <m.div
              key={event.label}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ ...transition, delay: idx * 0.1 }}
              className={`static sm:absolute ${event.position > 70 ? 'sm:-translate-x-full' : ''}`}
              style={{ left: `${event.position}%`, top: idx % 2 === 0 ? '0%' : '55%' }}
            >
              <div className={`text-xs sm:text-[10px] font-bold whitespace-nowrap ${
                event.label.includes('AES') || event.label.includes('Heat')
                  ? 'text-red-500 dark:text-red-400'
                  : event.label.includes('Caesar')
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-slate-600 dark:text-slate-400'
              }`}>
                {event.label}
              </div>
              <div className="text-xs sm:text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                {event.time}
              </div>
              {/* Dot on timeline */}
              <div
                className={`hidden sm:block absolute w-2 h-2 rounded-full ${
                  event.label.includes('AES')
                    ? 'bg-red-500'
                    : event.label.includes('Caesar')
                      ? 'bg-green-500'
                      : 'bg-slate-400'
                }`}
                style={{
                  left: event.position > 70 ? '100%' : 0,
                  top: idx % 2 === 0 ? '100%' : '-8px',
                }}
              />
            </m.div>
          ))}
        </div>
      </div>
    </div>
  );
};
