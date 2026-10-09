import '@/test/disableNativeAnimation';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { AESVisualizer } from './AESVisualizer';
import { encryptAESWithSteps } from '@/lib/crypto/aes';
import { useVisualizationStore } from '@/store/visualizationStore';
import { useProgressStore } from '@/store/progressStore';
beforeEach(() => {
  useProgressStore.getState().resetProgress();
  useVisualizationStore.setState({ currentStep: 0, totalSteps: 0, isPlaying: false, speed: 4, steps: [] });
  vi.useFakeTimers();
});
afterEach(() => { cleanup(); vi.useRealTimers(); });
it('completing AES playback at 4x awards the existing Speed Demon achievement', () => {
  const steps = encryptAESWithSteps('Hello AES!', 'SecretKey12345!').slice(0, 2);
  render(<LazyMotion features={domAnimation}><AESVisualizer steps={steps} /></LazyMotion>);
  act(() => useVisualizationStore.getState().play());
  act(() => vi.advanceTimersByTime(500));
  expect(useVisualizationStore.getState().currentStep).toBe(1);
  expect(useVisualizationStore.getState().isPlaying).toBe(false);
  expect(useProgressStore.getState().achievements).toContain('speed-demon');
});
