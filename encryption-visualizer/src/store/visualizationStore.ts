import { create } from 'zustand';
import type { VisualizationState, Algorithm, AESStep, RSAStep, HashStep, SignatureStep, DHStep, BlockModeStep } from '@/lib/types';
import type { TLSStep } from '@/lib/types/tls';
import type { ECCStep } from '@/lib/types/ecc';
import type { CryptanalysisStep } from '@/lib/types/cryptanalysis';
import type { HMACStep } from '@/lib/types/hmac';
import type { PaddingStep } from '@/lib/types/padding';
import type { PasswordHashStep } from '@/lib/types/password-hashing';

export type VisualizationSteps = AESStep[] | RSAStep[] | HashStep[] | SignatureStep[] | DHStep[] | BlockModeStep[] | TLSStep[] | ECCStep[] | CryptanalysisStep[] | HMACStep[] | PaddingStep[] | PasswordHashStep[];

interface VisualizationStore extends VisualizationState {
  sessionPath: string | null;
  steps: VisualizationSteps;
  setAlgorithm: (algorithm: Algorithm) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  nextStep: () => void;
  previousStep: () => void;
  setSpeed: (speed: number) => void;
  goToStep: (step: number) => void;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (total: number) => void;
  setSteps: (steps: VisualizationSteps) => void;
}

export const useVisualizationStore = create<VisualizationStore>((set) => ({
  sessionPath: null,
  algorithm: 'AES',
  isPlaying: false,
  currentStep: 0,
  totalSteps: 0,
  speed: 1,
  steps: [],

  setAlgorithm: (algorithm) => set({ algorithm, currentStep: 0, steps: [] }),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  reset: () => set({ currentStep: 0, isPlaying: false }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
    })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  setSpeed: (speed) => set({ speed }),

  goToStep: (step) => set({ currentStep: step }),

  setCurrentStep: (step) => set({ currentStep: step }),

  setTotalSteps: (total) => set({ totalSteps: total }),

  setSteps: (steps) => set({ steps, totalSteps: steps.length }),
}));
