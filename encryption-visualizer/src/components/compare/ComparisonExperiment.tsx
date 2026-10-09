import { useEffect, useMemo, useState } from 'react';
import { useCompareStore, type ComparableAlgorithm } from '@/store/compareStore';
import { encryptAESWithSteps } from '@/lib/crypto/aes';
import { generateRSAKeyPairWithSteps } from '@/lib/crypto/rsa';
import { sha256WithSteps } from '@/lib/crypto/sha256';
import { signMessageWithSteps } from '@/lib/crypto/signatures';
import { generateDHKeyExchangeWithSteps } from '@/lib/crypto/diffie-hellman';
import { encryptCBCWithSteps } from '@/lib/crypto/block-modes';
import type { AESStep, RSAStep, HashStep, SignatureStep, DHStep, BlockModeStep } from '@/lib/types';

type Step = AESStep | RSAStep | HashStep | SignatureStep | DHStep | BlockModeStep;
type Side = 'left' | 'right';
interface Playback { left: number; right: number; leftPlaying: boolean; rightPlaying: boolean }

function experiment(algorithm: ComparableAlgorithm): Step[] {
  switch (algorithm) {
    case 'aes': return encryptAESWithSteps('Hello CryptoViz!', 'CryptoVizKey1234');
    case 'rsa': return generateRSAKeyPairWithSteps('small').steps;
    case 'hashing': return sha256WithSteps('Hello CryptoViz!');
    case 'signatures': return signMessageWithSteps('Hello CryptoViz!', generateRSAKeyPairWithSteps('small').keyPair).steps;
    case 'diffie-hellman': return generateDHKeyExchangeWithSteps('small').steps;
    case 'block-modes': return encryptCBCWithSteps('Hello CryptoViz!', 'CryptoVizKey1234');
  }
}

export const ComparisonExperiment = () => {
  const { leftAlgorithm, rightAlgorithm, syncPlayback } = useCompareStore();
  const frames = useMemo(() => ({ left: experiment(leftAlgorithm), right: experiment(rightAlgorithm) }), [leftAlgorithm, rightAlgorithm]);
  const [playback, setPlayback] = useState<Playback>({ left: 0, right: 0, leftPlaying: false, rightPlaying: false });

  useEffect(() => {
    if (!playback.leftPlaying && !playback.rightPlaying) return;
    const timer = setTimeout(() => setPlayback((current) => {
      const next = { ...current };
      for (const side of ['left', 'right'] as const) {
        const playing = `${side}Playing` as const;
        if (current[playing]) {
          next[side] = Math.min(current[side] + 1, frames[side].length - 1);
          next[playing] = next[side] < frames[side].length - 1;
        }
      }
      return next;
    }), 1200);
    return () => clearTimeout(timer);
  }, [playback, frames]);

  const move = (side: Side, delta: number): void => setPlayback((current) => {
    const next = { ...current };
    for (const target of syncPlayback ? ['left', 'right'] as const : [side]) {
      next[target] = Math.max(0, Math.min(current[target] + delta, frames[target].length - 1));
      next[`${target}Playing`] = false;
    }
    return next;
  });
  const toggle = (side: Side): void => setPlayback((current) => {
    const next = { ...current };
    const play = !current[`${side}Playing`];
    for (const target of syncPlayback ? ['left', 'right'] as const : [side]) {
      next[`${target}Playing`] = play && current[target] < frames[target].length - 1;
    }
    return next;
  });
  const reset = (side: Side): void => setPlayback((current) => {
    const next = { ...current };
    for (const target of syncPlayback ? ['left', 'right'] as const : [side]) { next[target] = 0; next[`${target}Playing`] = false; }
    return next;
  });

  return (
    <section aria-labelledby="comparison-experiment-title" className="space-y-6">
      <div><p className="eyebrow mb-3">Observe the differences</p><h2 id="comparison-experiment-title" className="section-title">Two algorithms. One experiment.</h2><p className="lesson-description mt-3">Step through sample runs. Sync advances both panels together; turn it off to inspect them independently. Different algorithms need different numbers of steps.</p><p className="text-xs text-slate-600 dark:text-slate-400 mt-3">Small educational keys keep public-key examples readable. Hashing uses SHA-256.</p></div>
      <div className="grid md:grid-cols-2 gap-6">
        {(['left', 'right'] as const).map((side) => {
          const frame = frames[side][playback[side]];
          const data = 'values' in frame ? frame.values : 'data' in frame ? frame.data : undefined;
          return (
            <section key={side} aria-label={`${side} experiment`} className="glass-card p-4 sm:p-6 space-y-5 min-w-0">
              <p className="eyebrow">{side} / {side === 'left' ? leftAlgorithm : rightAlgorithm}</p>
              <div role="status"><p className="text-xs font-mono text-slate-600 dark:text-slate-400">Step {playback[side] + 1} of {frames[side].length}</p><h3 className="text-xl mt-2">{frame.title}</h3></div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed min-h-[5rem]">{frame.description}</p>
              {'state' in frame && <div className="grid grid-cols-4 gap-2" aria-label="AES state matrix">{frame.state.flat().map((value, index) => <span key={index} className="bg-slate-100 dark:bg-cyber-dark p-3 text-center font-mono text-sm rounded-lg">{value.toString(16).padStart(2, '0')}</span>)}</div>}
              {data && <dl className="space-y-2 font-mono text-xs">{Object.entries(data).map(([key, value]) => <div key={key} className="flex flex-wrap justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-2"><dt>{key}</dt><dd className="break-all max-w-full">{Array.isArray(value) ? value.join(' · ') : typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}</dd></div>)}</dl>}
              {'blocks' in frame && frame.blocks && <p className="font-mono text-xs break-all">{frame.blocks.join(' · ')}</p>}
              <progress aria-label={`${side} experiment progress`} className="w-full accent-cyber-blue" value={playback[side] + 1} max={frames[side].length} />
              <div className="flex flex-wrap gap-2">
                <button className="btn-secondary text-sm" onClick={() => reset(side)}>Reset</button>
                <button className="btn-secondary text-sm" disabled={playback[side] === 0} onClick={() => move(side, -1)}>Back</button>
                <button className="btn-primary text-sm" disabled={playback[side] === frames[side].length - 1} onClick={() => toggle(side)}>{playback[`${side}Playing`] ? 'Pause' : 'Play'}</button>
                <button className="btn-secondary text-sm" disabled={playback[side] === frames[side].length - 1} onClick={() => move(side, 1)}>Next</button>
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
};
