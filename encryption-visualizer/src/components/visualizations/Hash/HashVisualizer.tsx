import React from 'react';
import type { HashStep } from '@/lib/types';
import { m } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HashVisualizerProps {
  steps: HashStep[];
  currentStep: number;
}

export const HashVisualizer: React.FC<HashVisualizerProps> = ({ steps, currentStep }) => {
  const reducedMotion = useReducedMotion();
  const step = steps[currentStep];
  if (!step) {
    return (
      <div className="hash-instrument hash-empty">
        <p className="eyebrow">SHA-256 experiment</p>
        <h3>Ready to Hash</h3>
        <p>
          Enter a message above. Inspect its bytes, padding, message schedule, and every compression
          round.
        </p>
        <div className="hash-empty-flow" aria-hidden="true">
          <span>Message</span>
          <span>→</span>
          <span>64 rounds / block</span>
          <span>→</span>
          <span>256 bits</span>
        </div>
      </div>
    );
  }
  const data = step.data;
  const round = data?.sha256;
  const previousValues = steps[currentStep - 1]?.data?.roundValues;
  return (
    <m.section
      key={currentStep}
      initial={{ opacity: reducedMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.16 }}
      className="hash-instrument"
      aria-label="Hash computation state"
    >
      <header className="hash-instrument-header">
        <div>
          <p className="eyebrow">
            {data?.algorithm || 'Hash'} / {step.type}
          </p>
          <h3>{step.title}</h3>
        </div>
        <p className="hash-step-index">
          Step {step.stepNumber + 1} of {steps.length}
        </p>
      </header>
      <p className="hash-step-description">{step.description}</p>
      {data && (
        <div className="hash-data">
          {data.input !== undefined && (
            <div className="hash-data-row">
              <h4>Input message</h4>
              <code>{data.input || '(empty input)'}</code>
            </div>
          )}
          {data.binary !== undefined && (
            <div className="hash-data-row">
              <h4>UTF-8 bytes · binary</h4>
              <code className="hash-binary">{data.binary || '(no bytes)'}</code>
            </div>
          )}
          {data.padded && (
            <details className="hash-padding">
              <summary>Inspect padded message · binary</summary>
              <code className="hash-binary">{data.padded}</code>
            </details>
          )}
          {round && (
            <div className="hash-round-label">
              <span>
                Block {round.blockIndex + 1} of {round.blockCount}
              </span>
              {round.round !== undefined && <span>Round {round.round + 1} of 64</span>}
            </div>
          )}
          {round?.round !== undefined && (
            <div className="hash-round-flow">
              <dl className="hash-round-inputs">
                {[
                  ['W[t]', round.word],
                  ['K[t]', round.constant],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="hash-round-operation">
                <span aria-hidden="true">↓</span>
                <p>T₁ = h + Σ₁(e) + Ch(e,f,g) + K[t] + W[t]</p>
                <p>T₂ = Σ₀(a) + Maj(a,b,c)</p>
              </div>
              <dl className="hash-round-temps">
                {[
                  ['T1', round.temp1],
                  ['T2', round.temp2],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="hash-round-result">
                <span aria-hidden="true">↓</span> a = T₁ + T₂ <span aria-hidden="true">·</span> e =
                d + T₁ <small>All sums modulo 2³²</small>
              </p>
            </div>
          )}
          {data.roundValues && (
            <div className="hash-state">
              <h4>
                {round?.round !== undefined ? 'Working registers after this round' : 'State words'}
              </h4>
              <dl className="hash-registers">
                {data.roundValues.map((value, index) => {
                  const changed =
                    round?.round !== undefined &&
                    previousValues !== undefined &&
                    previousValues[index] !== value;
                  return (
                    <div key={index} className={`hash-register${changed ? ' changed' : ''}`}>
                      <dt>{round?.round !== undefined ? 'abcdefgh'[index] : `H${index}`}</dt>
                      <dd>{value}</dd>
                    </div>
                  );
                })}
              </dl>
              {round?.round !== undefined && (
                <p className="hash-register-caption">
                  Accented registers changed from the previous displayed state.
                </p>
              )}
            </div>
          )}
          {data.chunks && (
            <div className="hash-schedule">
              <h4>{data.algorithm === 'SHA-256' ? 'Message words' : 'Message chunks'}</h4>
              <div className="hash-words">
                {data.chunks.map((chunk, index) => (
                  <div key={index}>
                    <span>
                      {data.algorithm === 'SHA-256'
                        ? round
                          ? `W[${index}]`
                          : `Word ${index + 1}`
                        : `Chunk ${index + 1}`}
                    </span>
                    <code>{chunk}</code>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.hash && (
            <div className={`hash-digest${step.type === 'output' ? ' is-final' : ''}`}>
              <h4>
                {step.type === 'output' ? `${data.algorithm || 'Hash'} hash output` : 'Hash state'}
              </h4>
              <code>{data.hash}</code>
              <p>
                {data.hash.length * 4} bits · {data.hash.length} hexadecimal characters
              </p>
            </div>
          )}
        </div>
      )}
    </m.section>
  );
};
