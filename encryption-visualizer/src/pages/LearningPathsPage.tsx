import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  KeyRound,
  ShieldCheck,
  Clock,
  BarChart3,
  ChevronRight,
  ArrowLeft,
  Award,
} from 'lucide-react';
import { learningPaths, type LearningPath, type LearningModule } from '@/data/learningPaths';
import { achievements } from '@/data/achievements';
import { useProgressStore } from '@/store/progressStore';
import { PathProgress } from '@/components/learning/PathProgress';
import { AchievementBadge } from '@/components/learning/AchievementBadge';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  BookOpen,
  KeyRound,
  ShieldCheck,
};

const difficultyColors: Record<string, string> = {
  beginner: 'text-emerald-700 dark:text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  intermediate: 'text-amber-700 dark:text-amber-400 bg-amber-400/10 border-amber-400/20',
  advanced: 'text-rose-700 dark:text-rose-400 bg-rose-400/10 border-rose-400/20',
};

export const LearningPathsPage = () => {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const navigate = useNavigate();

  const pathProgress = useProgressStore((s) => s.pathProgress);
  const earnedAchievements = useProgressStore((s) => s.achievements);

  const getCompletedModules = (pathId: string): string[] => {
    return pathProgress[pathId] ?? [];
  };

  const getPathCompletion = (path: LearningPath): number => {
    const completed = getCompletedModules(path.id);
    return path.modules.length > 0
      ? Math.round((path.modules.filter((module) => completed.includes(module.id)).length / path.modules.length) * 100)
      : 0;
  };

  const getCurrentModule = (path: LearningPath): LearningModule | undefined => {
    const completed = getCompletedModules(path.id);
    return path.modules.find((m) => !completed.includes(m.id));
  };

  const handleModuleClick = (module: LearningModule) => {
    navigate(module.algorithmPage);
  };

  const handleStartPath = (path: LearningPath) => {
    const current = getCurrentModule(path);
    navigate((current ?? path.modules[0]).algorithmPage);
  };

  return (
    <div className="space-y-8">
      <p className="eyebrow">The curriculum / 03 guided paths</p>
      {/* Page Header */}
      <div className="lesson-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyber-cyan to-cyber-blue rounded-lg">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-slate-900 dark:text-white" />
          </div>
          <div>
            <h1 className="section-title mb-4">
              Learning Paths
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Structured curricula to guide your cryptography journey
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">Pass a lesson’s knowledge check to complete its module. Your progress is saved on this device. Modules unlock as you complete their prerequisites.</p>
      <AnimatePresence mode="wait">
        {selectedPath ? (
          /* Path Detail View */
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Back Button */}
            <button
              onClick={() => setSelectedPath(null)}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Paths
            </button>

            {/* Path Header */}
            <div className="glass-card p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-cyber-cyan to-cyber-blue rounded-xl">
                    {(() => {
                      const Icon = iconMap[selectedPath.icon] ?? BookOpen;
                      return <Icon className="w-8 h-8 text-slate-900 dark:text-white" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedPath.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {selectedPath.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      difficultyColors[selectedPath.difficulty]
                    }`}
                  >
                    {selectedPath.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedPath.estimatedTime}
                  </span>
                </div>
              </div>

              {/* Overall progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="text-xs font-bold text-cyber-cyan">
                    {getPathCompletion(selectedPath)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${getPathCompletion(selectedPath)}%`,
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            </div>

            {/* Module List */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Modules</h3>
              <PathProgress
                modules={selectedPath.modules}
                completedModules={getCompletedModules(selectedPath.id)}
                currentModuleId={getCurrentModule(selectedPath)?.id}
                onModuleClick={handleModuleClick}
                vertical
              />
            </div>

            {/* Start / Continue Button */}
            <button
              onClick={() => handleStartPath(selectedPath)}
              className="btn-primary w-full sm:w-auto"
            >
              {getPathCompletion(selectedPath) === 100 ? 'Review Path' : getPathCompletion(selectedPath) > 0 ? 'Continue' : 'Start Path'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          /* Path Cards Grid */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {learningPaths.map((path, index) => {
                const Icon = iconMap[path.icon] ?? BookOpen;
                const completion = getPathCompletion(path);
                const currentModule = getCurrentModule(path);

                return (
                  <motion.button
                    key={path.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedPath(path)}
                    className="glass-card-hover curriculum-card p-6 text-left w-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 bg-gradient-to-br from-cyber-cyan/20 to-cyber-blue/20 border border-cyber-blue/20 rounded-lg">
                        <Icon className="w-6 h-6 text-cyber-cyan" />
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                          difficultyColors[path.difficulty]
                        }`}
                      >
                        {path.difficulty}
                      </span>
                    </div>

                    <h2 className="section-title text-2xl mb-3">
                      {path.title}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                      {path.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {path.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3.5 h-3.5" />
                        {path.modules.length} modules
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-slate-500">
                          {completion}% complete
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-full transition-all duration-500"
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                    </div>

                    {/* Current module hint */}
                    {currentModule && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        Next: <span className="text-cyber-cyan font-semibold">{currentModule.title}</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Achievements Section */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Achievements
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {earnedAchievements.length}/{achievements.length} unlocked
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {achievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={earnedAchievements.includes(achievement.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
