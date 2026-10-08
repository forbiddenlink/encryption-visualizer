import { useEffect } from 'react';
import { useVisualizationStore } from '@/store/visualizationStore';
import { useProgressStore } from '@/store/progressStore';

export function useAutoAdvance(stepsLength: number) {
  const { isPlaying, currentStep, speed, setCurrentStep, pause } = useVisualizationStore();

  useEffect(() => {
    if (isPlaying && currentStep < stepsLength - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 2000 / speed);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= stepsLength - 1) {
      if (stepsLength > 0 && speed >= 4) useProgressStore.getState().addAchievement('speed-demon');
      pause();
    }
  }, [isPlaying, currentStep, stepsLength, speed, setCurrentStep, pause]);
}
