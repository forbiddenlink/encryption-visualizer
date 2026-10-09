import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('pwa-install-dismissed')) return;
    } catch {
      // Installation remains available when browser storage is blocked.
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem('pwa-install-dismissed', 'true');
    } catch {
      // The prompt is still dismissed for this visit when saving is unavailable.
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-card px-5 py-3 flex items-center gap-4 shadow-xl border border-slate-200 dark:border-white/10 max-w-md"
        >
          <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex-shrink-0">
            <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Install CryptoViz for offline learning
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};
