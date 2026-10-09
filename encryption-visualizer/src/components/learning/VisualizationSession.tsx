import { useLayoutEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useVisualizationStore } from '@/store/visualizationStore';

// A new lesson must not render another algorithm's step objects.
export const VisualizationSession = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const readyPath = useVisualizationStore((state) => state.sessionPath);
  useLayoutEffect(() => {
    useVisualizationStore.setState({ sessionPath: pathname, steps: [], totalSteps: 0, currentStep: 0, isPlaying: false });
  }, [pathname]);
  return readyPath === pathname ? children : <p role="status" className="eyebrow lesson-loading flex items-center justify-center">Preparing your experiment…</p>;
};
