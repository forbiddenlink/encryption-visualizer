import { useEffect, useCallback } from 'react';
import { useVisualizationStore } from '@/store/visualizationStore';

interface ShortcutConfig {
  enabled?: boolean;
}

const SPEED_LEVELS = [0.5, 1, 2, 4] as const;

export function useKeyboardShortcuts(config: ShortcutConfig = {}) {
  const { enabled = true } = config;

  const store = useVisualizationStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target;
      if (
        event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey ||
        (target instanceof HTMLElement && (
          target.closest('input, textarea, select, button, a, summary, [role="button"], [role="radio"]') ||
          target.isContentEditable
        )) || store.totalSteps === 0
      ) {
        return;
      }

      const { isPlaying, currentStep, totalSteps, speed } = store;

      // Define handlers for each key code
      const handlers: Record<string, () => void> = {
        Space: () => (isPlaying ? store.pause() : store.play()),
        ArrowRight: () => currentStep < totalSteps - 1 && store.nextStep(),
        ArrowLeft: () => currentStep > 0 && store.previousStep(),
        Home: () => store.reset(),
        End: () => totalSteps > 0 && store.goToStep(totalSteps - 1),
        Digit1: () => store.setSpeed(0.5),
        Digit2: () => store.setSpeed(1),
        Digit3: () => store.setSpeed(2),
        Digit4: () => store.setSpeed(4),
        Equal: () => adjustSpeed(speed, 1),
        NumpadAdd: () => adjustSpeed(speed, 1),
        Minus: () => adjustSpeed(speed, -1),
        NumpadSubtract: () => adjustSpeed(speed, -1),
      };

      // Handle 'R' key separately (needs modifier check)
      if (event.code === 'KeyR' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        store.reset();
        return;
      }

      const handler = handlers[event.code];
      if (handler) {
        event.preventDefault();
        handler();
      }

      function adjustSpeed(currentSpeed: number, direction: 1 | -1) {
        const currentIndex = SPEED_LEVELS.indexOf(currentSpeed as typeof SPEED_LEVELS[number]);
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < SPEED_LEVELS.length) {
          store.setSpeed(SPEED_LEVELS[newIndex]);
        }
      }
    },
    [store]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}

export const KEYBOARD_SHORTCUTS = [
  { key: 'Space', action: 'Play / Pause' },
  { key: '\u2190', action: 'Previous step' },
  { key: '\u2192', action: 'Next step' },
  { key: 'R', action: 'Reset' },
  { key: 'Home', action: 'Go to first step' },
  { key: 'End', action: 'Go to last step' },
  { key: '1-4', action: 'Set speed (0.5x, 1x, 2x, 4x)' },
  { key: '+/-', action: 'Increase / Decrease speed' },
] as const;
