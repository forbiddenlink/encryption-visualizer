import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useCompareStore, type ComparableAlgorithm } from '@/store/compareStore';
import { CompareControls } from '@/components/compare/CompareControls';
import { ComparePanel } from '@/components/compare/ComparePanel';
import { ComparisonExperiment } from '@/components/compare/ComparisonExperiment';
import { SecurityLevelChart } from '@/components/compare/SecurityLevelChart';
import { PerformanceChart } from '@/components/compare/PerformanceChart';
import { UseCaseMatrix } from '@/components/compare/UseCaseMatrix';
import { GitCompare, ArrowLeftRight } from 'lucide-react';

const validAlgorithms: ComparableAlgorithm[] = ['aes', 'rsa', 'hashing', 'signatures', 'diffie-hellman', 'block-modes'];

function isValidAlgorithm(value: string | null): value is ComparableAlgorithm {
  return value !== null && validAlgorithms.includes(value as ComparableAlgorithm);
}

export const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const { leftAlgorithm, rightAlgorithm } = useCompareStore();

  // Initialize from URL params
  useEffect(() => {
    const left = searchParams.get('left');
    const right = searchParams.get('right');

    const current = useCompareStore.getState();
    const nextLeft = isValidAlgorithm(left) ? left : current.leftAlgorithm;
    const nextRight = isValidAlgorithm(right) ? right : current.rightAlgorithm;
    if (nextLeft !== nextRight) {
      useCompareStore.setState({ leftAlgorithm: nextLeft, rightAlgorithm: nextRight });
    }
  }, [searchParams]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <p className="eyebrow">The comparison desk / 06 algorithms</p>
      {/* Page Header */}
      <div className="lesson-header">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyber-cyan to-cyber-blue rounded-lg">
              <GitCompare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="section-title mb-4">
                Algorithm Comparison
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Compare cryptographic algorithms side by side
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <CompareControls />

      {/* Comparison Grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComparePanel algorithm={leftAlgorithm} side="left" />

        {/* Comparison Arrow (visible on lg screens) */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
            <ArrowLeftRight className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
        </div>

        <ComparePanel algorithm={rightAlgorithm} side="right" />
      </div>

      {/* Comparison Table */}
      <ComparisonExperiment key={`${leftAlgorithm}-${rightAlgorithm}`} />
      <div className="glass-card p-4 sm:p-6 overflow-x-auto">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Feature Comparison
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 pr-4 text-slate-500 dark:text-slate-400 font-semibold">Feature</th>
              <th className="text-left py-3 px-4 text-blue-600 dark:text-cyber-cyan font-semibold">{leftAlgorithm.toUpperCase()}</th>
              <th className="text-left py-3 pl-4 text-purple-600 dark:text-purple-400 font-semibold">{rightAlgorithm.toUpperCase()}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <tr>
              <td className="py-3 pr-4 text-slate-600 dark:text-slate-400 font-medium">Type</td>
              <td className="py-3 px-4 text-slate-900 dark:text-white">{getAlgorithmType(leftAlgorithm)}</td>
              <td className="py-3 pl-4 text-slate-900 dark:text-white">{getAlgorithmType(rightAlgorithm)}</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-slate-600 dark:text-slate-400 font-medium">Key Management</td>
              <td className="py-3 px-4 text-slate-900 dark:text-white">{getKeyManagement(leftAlgorithm)}</td>
              <td className="py-3 pl-4 text-slate-900 dark:text-white">{getKeyManagement(rightAlgorithm)}</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-slate-600 dark:text-slate-400 font-medium">Speed</td>
              <td className="py-3 px-4 text-slate-900 dark:text-white">{getSpeed(leftAlgorithm)}</td>
              <td className="py-3 pl-4 text-slate-900 dark:text-white">{getSpeed(rightAlgorithm)}</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-slate-600 dark:text-slate-400 font-medium">Use Case</td>
              <td className="py-3 px-4 text-slate-900 dark:text-white">{getUseCase(leftAlgorithm)}</td>
              <td className="py-3 pl-4 text-slate-900 dark:text-white">{getUseCase(rightAlgorithm)}</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 text-slate-600 dark:text-slate-400 font-medium">Reversible</td>
              <td className="py-3 px-4 text-slate-900 dark:text-white">{['aes', 'rsa', 'block-modes'].includes(leftAlgorithm) ? 'Yes' : 'No'}</td>
              <td className="py-3 pl-4 text-slate-900 dark:text-white">{['aes', 'rsa', 'block-modes'].includes(rightAlgorithm) ? 'Yes' : 'No'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Security Level Chart */}
      <div className="glass-card p-4 sm:p-6">
        <SecurityLevelChart />
      </div>

      {/* Performance Chart */}
      <div className="glass-card p-4 sm:p-6">
        <PerformanceChart />
      </div>

      {/* Use Case Matrix */}
      <div className="glass-card p-4 sm:p-6">
        <UseCaseMatrix />
      </div>
    </div>
  );
};

function getAlgorithmType(alg: ComparableAlgorithm): string {
  const types: Record<ComparableAlgorithm, string> = {
    aes: 'Symmetric Cipher',
    rsa: 'Asymmetric Cipher',
    hashing: 'Hash Function',
    signatures: 'Digital Signature',
    'diffie-hellman': 'Key Exchange',
    'block-modes': 'Cipher Mode',
  };
  return types[alg];
}

function getKeyManagement(alg: ComparableAlgorithm): string {
  const keys: Record<ComparableAlgorithm, string> = {
    aes: 'Shared secret key',
    rsa: 'Public/private pair',
    hashing: 'No key required',
    signatures: 'Private for sign, public for verify',
    'diffie-hellman': 'Generates shared secret',
    'block-modes': 'Same as underlying cipher',
  };
  return keys[alg];
}

function getSpeed(alg: ComparableAlgorithm): string {
  const speeds: Record<ComparableAlgorithm, string> = {
    aes: 'Very Fast',
    rsa: 'Slow (large numbers)',
    hashing: 'Fast',
    signatures: 'Moderate',
    'diffie-hellman': 'Moderate',
    'block-modes': 'Depends on mode',
  };
  return speeds[alg];
}

function getUseCase(alg: ComparableAlgorithm): string {
  const cases: Record<ComparableAlgorithm, string> = {
    aes: 'Bulk data encryption',
    rsa: 'Key exchange, signatures',
    hashing: 'Integrity, passwords',
    signatures: 'Authentication, documents',
    'diffie-hellman': 'Secure key exchange',
    'block-modes': 'Multi-block encryption',
  };
  return cases[alg];
}
