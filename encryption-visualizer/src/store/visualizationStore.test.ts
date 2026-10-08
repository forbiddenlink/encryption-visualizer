import { beforeEach, expect, it } from 'vitest';
import { useVisualizationStore } from './visualizationStore';
beforeEach(() => useVisualizationStore.setState({ steps: [], totalSteps: 0, currentStep: 0, isPlaying: false, speed: 1 }));
it('empty playback stays at a valid position and cannot start', () => {
  const store = useVisualizationStore.getState();
  store.nextStep();
  store.play();
  expect(useVisualizationStore.getState()).toMatchObject({ currentStep: 0, isPlaying: false });
});
it('seek requests stay within finite integer bounds and shorter data resets playback', () => {
  const store = useVisualizationStore.getState();
  store.setTotalSteps(3);
  store.goToStep(100);
  expect(useVisualizationStore.getState().currentStep).toBe(2);
  store.setCurrentStep(-2);
  expect(useVisualizationStore.getState().currentStep).toBe(0);
  store.goToStep(1.7);
  expect(useVisualizationStore.getState().currentStep).toBe(1);
  store.play();
  store.setSteps([]);
  expect(useVisualizationStore.getState()).toMatchObject({ currentStep: 0, totalSteps: 0, isPlaying: false });
});
