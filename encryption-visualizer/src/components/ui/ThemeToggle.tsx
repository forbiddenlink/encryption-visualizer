import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light mode' },
    { value: 'dark' as const, icon: Moon, label: 'Dark mode' },
    { value: 'system' as const, icon: Monitor, label: 'System theme' },
  ];

  return (
    <div
      className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 shadow-inner"
      role="radiogroup"
      aria-label="Theme selection"
    >
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            p-2 rounded-lg transition-all duration-150 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-cyber-blue/50
            ${
              theme === value
                ? 'bg-cyber-blue text-white shadow-md shadow-cyber-blue/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }
          `}
          role="radio"
          aria-checked={theme === value}
          tabIndex={theme === value ? 0 : -1}
          onKeyDown={(event) => {
            const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
            if (!direction) return;
            event.preventDefault();
            const index = themes.findIndex((item) => item.value === value);
            const next = themes[(index + direction + themes.length) % themes.length];
            setTheme(next.value);
            event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`button[aria-label="${next.label}"]`)?.focus();
          }}
          aria-label={label}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};
