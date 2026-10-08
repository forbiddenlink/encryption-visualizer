import React, { useId } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

interface EducationalCardProps {
  title: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const EducationalCard: React.FC<EducationalCardProps> = ({
  title,
  isExpanded,
  onToggle,
  children,
}) => {
  const panelId = useId();
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full" />
          {title}
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <m.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-slate-200 dark:border-slate-700">
              {children}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
