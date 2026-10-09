import React, { useMemo } from 'react';
import type { ECCStep } from '@/lib/types/ecc';
import { m } from 'framer-motion';
import { Key, Lock, Hash, CheckCircle, Fingerprint, Share2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ECCCurveGraph } from './ECCCurveGraph';

interface ECCVisualizerProps {
  steps: ECCStep[];
  currentStep: number;
}

export const ECCVisualizer: React.FC<ECCVisualizerProps> = ({ steps, currentStep }) => {
  const prefersReducedMotion = useReducedMotion();

  const transition = useMemo(() =>
    prefersReducedMotion
      ? { duration: 0 }
      : { type: 'spring' as const, stiffness: 400, damping: 40 },
    [prefersReducedMotion]
  );

  const itemTransition = useMemo(() =>
    prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.3 },
    [prefersReducedMotion]
  );

  if (steps.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="inline-block p-4 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl mb-4">
          <Fingerprint className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ready to Explore ECC</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Click "Generate ECC Key Pair" above to see how elliptic curve cryptography works step-by-step
        </p>
      </div>
    );
  }

  const step = steps[currentStep];

  const getStepColor = (type: ECCStep['type']) => {
    switch (type) {
      case 'curve-setup': return { bg: 'from-violet-600 to-purple-500', text: 'text-violet-400', border: 'border-violet-500/30' };
      case 'generator-point': return { bg: 'from-blue-600 to-indigo-500', text: 'text-blue-400', border: 'border-blue-500/30' };
      case 'private-key': return { bg: 'from-red-600 to-pink-500', text: 'text-red-400', border: 'border-red-500/30' };
      case 'scalar-multiply': return { bg: 'from-amber-600 to-orange-500', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'public-key': return { bg: 'from-green-600 to-emerald-500', text: 'text-green-400', border: 'border-green-500/30' };
      case 'shared-secret': return { bg: 'from-cyan-600 to-teal-500', text: 'text-cyan-400', border: 'border-cyan-500/30' };
      case 'signing': return { bg: 'from-pink-600 to-rose-500', text: 'text-pink-400', border: 'border-pink-500/30' };
      case 'verification': return { bg: 'from-indigo-600 to-blue-500', text: 'text-indigo-400', border: 'border-indigo-500/30' };
      case 'complete': return { bg: 'from-emerald-600 to-teal-500', text: 'text-emerald-400', border: 'border-emerald-500/30' };
      default: return { bg: 'from-gray-600 to-gray-500', text: 'text-gray-400', border: 'border-gray-500/30' };
    }
  };

  const stepColor = getStepColor(step.type);

  const getStepIcon = (type: ECCStep['type']) => {
    switch (type) {
      case 'curve-setup': return <Hash className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'generator-point': return <Fingerprint className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'private-key': return <Key className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'scalar-multiply': return <Hash className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'public-key': return <Lock className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'shared-secret': return <Share2 className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'signing': return <Fingerprint className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'verification': return <CheckCircle className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'complete': return <CheckCircle className="w-7 h-7 text-white" strokeWidth={2.5} />;
      default: return <Key className="w-7 h-7 text-white" strokeWidth={2.5} />;
    }
  };

  // Build highlight points for the curve graph based on current step
  const highlightPoints = (() => {
    const points: { point: { x: number; y: number }; label: string; color: string }[] = [];

    if (step.curve) {
      // Always show generator point
      points.push({ point: step.curve.G, label: 'G', color: '#6366f1' });
    }

    if (step.point && !step.point.isInfinity) {
      const labelMap: Record<string, string> = {
        'generator-point': 'G',
        'public-key': 'Q_A',
        'shared-secret': 'S',
        'scalar-multiply': 'kG',
      };
      const label = labelMap[step.type] || 'P';
      // Don't duplicate the generator point
      if (step.point.x !== step.curve?.G.x || step.point.y !== step.curve?.G.y) {
        points.push({ point: step.point, label, color: '#10b981' });
      }
    }

    return points;
  })();

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <m.div
        key={currentStep}
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, filter: "blur(4px)" }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20, filter: "blur(4px)" }}
        transition={transition}
        className="glass-card p-6 space-y-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-4 bg-gradient-to-br ${stepColor.bg} rounded-2xl shadow-lg`}>
              {getStepIcon(step.type)}
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{step.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Step {step.stepNumber + 1} of {steps.length}
              </p>
            </div>
          </div>
        </div>

        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{step.description}</p>

        {step.formula && (
          <div className={`bg-slate-50 dark:bg-cyber-dark p-4 border-2 ${stepColor.border} rounded-xl`}>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">FORMULA:</div>
            <div className={`text-lg font-mono font-bold ${stepColor.text}`}>
              {step.formula}
            </div>
          </div>
        )}

        {step.calculation && (
          <div className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-4 rounded-xl">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">CALCULATION:</div>
            <div className="text-base font-mono text-slate-800 dark:text-slate-200">{step.calculation}</div>
          </div>
        )}
      </m.div>

      {/* Curve Graph - show when we have curve data */}
      {step.curve && (
        <m.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={itemTransition}
          className="glass-card p-4 sm:p-6"
        >
          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
            Curve Visualization
          </h4>
          <ECCCurveGraph
            curve={step.curve}
            highlightPoints={highlightPoints}
            showLine={
              step.type === 'scalar-multiply' && step.point && step.curve
                ? { from: step.curve.G, to: step.point }
                : undefined
            }
          />
        </m.div>
      )}

      {/* Values Display */}
      {step.values && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(step.values).map(([key, value]) => (
            <m.div
              key={key}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={itemTransition}
              className="glass-card p-4 text-center"
            >
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mb-2">{key}</div>
              <div className={`text-xl font-bold font-mono ${stepColor.text} break-all`}>{value}</div>
            </m.div>
          ))}
        </div>
      )}

      {/* Key Pair Display (for final step) */}
      {step.type === 'complete' && step.values && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-6 border-2 border-green-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-600 rounded-xl">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Public Key</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Share this openly</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">x:</span>
                <span className="text-lg font-mono font-bold text-green-600 dark:text-green-400">{step.values.publicKeyX}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">y:</span>
                <span className="text-lg font-mono font-bold text-green-600 dark:text-green-400">{step.values.publicKeyY}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-2 border-red-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-600 rounded-xl">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Private Key</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Keep this secret!</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">d:</span>
                <span className="text-lg font-mono font-bold text-red-600 dark:text-red-400">{step.values.privateKey}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">curve:</span>
                <span className="text-sm font-mono font-bold text-red-600 dark:text-red-400 truncate">{step.values.curve}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
