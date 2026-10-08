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

function boundedStep(step: number, total: number): number {
  return Number.isFinite(step) ? Math.max(0, Math.min(Math.trunc(step), Math.max(0, total - 1))) : 0;
}

export const useVisualizationStore = create<VisualizationStore>((set) => ({
  sessionPath: null,
  algorithm: 'AES',
  isPlaying: false,
  currentStep: 0,
  totalSteps: 0,
  speed: 1,
  steps: [],

  setAlgorithm: (algorithm) => set({ algorithm, currentStep: 0, steps: [], totalSteps: 0, isPlaying: false }),

  play: () => set((state) => ({ isPlaying: state.totalSteps > 0 })),

  pause: () => set({ isPlaying: false }),

  reset: () => set({ currentStep: 0, isPlaying: false }),

  nextStep: () =>
    set((state) => ({
      currentStep: boundedStep(state.currentStep + 1, state.totalSteps),
    })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  setSpeed: (speed) => set({ speed }),

  goToStep: (step) => set((state) => ({ currentStep: boundedStep(step, state.totalSteps) })),

  setCurrentStep: (step) => set((state) => ({ currentStep: boundedStep(step, state.totalSteps) })),

  setTotalSteps: (total) => set((state) => {
    const totalSteps = Number.isFinite(total) ? Math.max(0, Math.trunc(total)) : 0;
    return { totalSteps, currentStep: boundedStep(state.currentStep, totalSteps), isPlaying: totalSteps > 0 && state.isPlaying };
  }),

  setSteps: (steps) => set({ steps, totalSteps: steps.length, currentStep: 0, isPlaying: false }),
}));
