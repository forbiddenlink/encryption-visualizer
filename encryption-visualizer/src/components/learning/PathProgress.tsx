import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, ChevronRight } from 'lucide-react';
import { isModuleAvailable } from '@/data/learningProgress';
import type { LearningModule } from '@/data/learningPaths';

interface PathProgressProps {
  modules: LearningModule[];
  completedModules: string[];
  currentModuleId?: string;
  onModuleClick?: (module: LearningModule) => void;
  vertical?: boolean;
}

export const PathProgress: React.FC<PathProgressProps> = ({
  modules,
  completedModules,
  currentModuleId,
  onModuleClick,
  vertical = false,
}) => {
  const isModuleCompleted = (id: string): boolean => completedModules.includes(id);

  const isModuleLocked = (module: LearningModule): boolean => {
    return !isModuleAvailable(module, completedModules);
  };

  const completedCount = modules.filter((m) => isModuleCompleted(m.id)).length;
  const progressPercent = modules.length > 0 ? (completedCount / modules.length) * 100 : 0;

  if (vertical) {
    return (
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-700">
          <motion.div
            className="w-full bg-gradient-to-b from-cyber-cyan to-cyber-blue"
            initial={{ height: 0 }}
            animate={{ height: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        <div className="space-y-4">
          {modules.map((module, index) => {
            const completed = isModuleCompleted(module.id);
            const locked = isModuleLocked(module);
            const isCurrent = module.id === currentModuleId;

            return (
              <motion.button
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => !locked && onModuleClick?.(module)}
                disabled={locked}
                className={`relative flex items-start gap-4 w-full text-left pl-2 pr-4 py-3 rounded-xl transition-all ${
                  locked
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-white/5 cursor-pointer'
                } ${isCurrent ? 'bg-cyber-blue/10 border border-cyber-blue/20 rounded-xl' : ''}`}
              >
                {/* Node */}
                <div
                  className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    completed
                      ? 'bg-cyber-cyan border-cyber-cyan'
                      : isCurrent
                      ? 'bg-cyber-blue/20 border-cyber-blue '
                      : locked
                      ? 'bg-slate-800 border-slate-600'
                      : 'bg-slate-800 border-slate-500'
                  }`}
                >
                  {completed ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : locked ? (
                    <Lock className="w-3 h-3 text-slate-500" />
                  ) : (
                    <span className="text-xs font-bold text-slate-400">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h4
                    className={`text-sm font-bold ${
                      completed
                        ? 'text-cyber-cyan'
                        : locked
                        ? 'text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {module.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {module.description}
                  </p>
                </div>

                {!locked && !completed && (
                  <ChevronRight className="w-4 h-4 text-slate-500 mt-1 flex-shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className="relative">
      {/* Progress bar */}
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-700">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-blue"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      <div className="relative flex justify-between">
        {modules.map((module, index) => {
          const completed = isModuleCompleted(module.id);
          const locked = isModuleLocked(module);
          const isCurrent = module.id === currentModuleId;

          return (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !locked && onModuleClick?.(module)}
              disabled={locked}
              className={`flex flex-col items-center gap-2 ${
                locked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer group'
              }`}
            >
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110 ${
                  completed
                    ? 'bg-cyber-cyan border-cyber-cyan'
                    : isCurrent
                    ? 'bg-cyber-blue/20 border-cyber-blue '
                    : locked
                    ? 'bg-slate-800 border-slate-600'
                    : 'bg-slate-800 border-slate-500'
                }`}
              >
                {completed ? (
                  <Check className="w-4 h-4 text-white" />
                ) : locked ? (
                  <Lock className="w-3 h-3 text-slate-500" />
                ) : (
                  <span className="text-xs font-bold text-slate-400">
                    {index + 1}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] font-semibold text-center max-w-[80px] ${
                  completed
                    ? 'text-cyber-cyan'
                    : locked
                    ? 'text-slate-600'
                    : 'text-slate-400'
                }`}
              >
                {module.title}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
