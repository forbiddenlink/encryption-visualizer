import React from 'react';
import { motion } from 'framer-motion';
import {
  Footprints,
  Fingerprint,
  Cpu,
  Key,
  Shield,
  Trophy,
  Compass,
  Zap,
  Lock,
} from 'lucide-react';
import type { Achievement } from '@/data/achievements';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Footprints,
  Fingerprint,
  Cpu,
  Key,
  Shield,
  Trophy,
  Compass,
  Zap,
};

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  compact?: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  unlocked,
  compact = false,
}) => {
  const Icon = iconMap[achievement.icon] ?? Shield;

  const categoryColors: Record<string, string> = {
    completion: 'from-cyber-cyan to-cyber-blue',
    quiz: 'from-amber-400 to-orange-500',
    speed: 'from-rose-400 to-pink-600',
    exploration: 'from-emerald-400 to-teal-600',
  };

  const gradient = categoryColors[achievement.category] ?? 'from-slate-400 to-slate-600';

  if (compact) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border ${
          unlocked
            ? 'bg-white/5 border-white/10'
            : 'bg-slate-900/50 border-white/5 opacity-50'
        }`}
      >
        <div
          className={`p-1.5 rounded-lg ${
            unlocked ? `bg-gradient-to-br ${gradient}` : 'bg-slate-700'
          }`}
        >
          {unlocked ? (
            <Icon className="w-4 h-4 text-white" />
          ) : (
            <Lock className="w-4 h-4 text-slate-500" />
          )}
        </div>
        <span
          className={`text-xs font-semibold ${
            unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500'
          }`}
        >
          {achievement.title}
        </span>
        {unlocked && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
            }}
          />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={unlocked ? { scale: 1.03 } : undefined}
      className={`relative glass-card p-4 text-center overflow-hidden ${
        unlocked ? '' : 'border-dashed'
      }`}
    >
      {/* Shine animation on unlock */}
      {unlocked && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 60%, rgba(255,255,255,0) 100%)',
              'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 60%, rgba(255,255,255,0) 100%)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
        />
      )}

      <div
        className={`inline-flex p-3 rounded-xl mb-3 ${
          unlocked ? `bg-gradient-to-br ${gradient}` : 'bg-slate-700'
        }`}
      >
        {unlocked ? (
          <Icon className="w-6 h-6 text-white" />
        ) : (
          <Lock className="w-6 h-6 text-slate-500" />
        )}
      </div>

      <h4
        className={`text-sm font-bold mb-1 ${
          unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500'
        }`}
      >
        {achievement.title}
      </h4>
      <p className="text-xs text-slate-600 dark:text-slate-400">{achievement.description}</p>

      {/* Category label */}
      <span
        className={`inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
          unlocked
            ? 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}
      >
        {achievement.category}
      </span>
    </motion.div>
  );
};
