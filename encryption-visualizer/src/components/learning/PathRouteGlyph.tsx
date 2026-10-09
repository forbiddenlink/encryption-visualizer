import type { ReactNode } from 'react';
import type { LearningPath } from '@/data/learningPaths';

interface PathRouteGlyphProps {
  path: LearningPath;
  completedModuleIds: string[];
}

/**
 * Visual topological route schematic for curriculum paths.
 * Renders connected chronological nodes representing the modules in the learning journey.
 */
export const PathRouteGlyph = ({
  path,
  completedModuleIds,
}: PathRouteGlyphProps): ReactNode => {
  const modules = path.modules;
  const count = modules.length;
  if (count === 0) return null;

  return (
    <div className="my-4 py-2 border-y border-[var(--line)]">
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] mb-2">
        <span>Route Topology</span>
        <span>{count} Milestones</span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {modules.map((module, index) => {
          const isComplete = completedModuleIds.includes(module.id);
          const isLast = index === count - 1;

          return (
            <div key={module.id} className="flex items-center gap-2 shrink-0">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono transition-colors ${
                  isComplete
                    ? 'border-[var(--accent)] bg-[var(--surface-quiet)] text-[var(--accent)]'
                    : 'border-[var(--line)] bg-[var(--canvas)] text-[var(--muted)]'
                }`}
                title={module.title}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isComplete ? 'bg-[var(--accent)]' : 'bg-[var(--line)]'
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate max-w-[120px] sm:max-w-[160px]">{module.title}</span>
              </div>
              {!isLast && (
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  className="text-[var(--line)] shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M1 5H11M11 5L7 1M11 5L7 9"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
