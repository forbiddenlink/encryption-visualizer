import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { lessons } from '@/data/lessonCatalog';
import { learningPaths } from '@/data/learningPaths';

interface QuizScore {
  score: number;
  total: number;
  completedAt: number;
}

interface ProgressStore {
  completedAlgorithms: string[];
  quizScores: Record<string, QuizScore>;
  sectionProgress: Record<string, Record<string, boolean>>;
  missedQuestions: Record<string, string[]>;
  pathProgress: Record<string, string[]>;
  achievements: string[];
  visitedAlgorithms: string[];
  lastVisitedAlgorithm: string | null;
  recordVisit: (algorithm: string) => void;
  syncLearningProgress: () => void;

  markAlgorithmComplete: (algorithm: string) => void;
  saveQuizScore: (algorithm: string, score: number, total: number) => void;
  isAlgorithmComplete: (algorithm: string) => boolean;
  getQuizScore: (algorithm: string) => QuizScore | null;
  getCompletionPercentage: () => number;
  resetProgress: () => void;

  markSectionViewed: (algorithm: string, sectionId: string) => void;
  getSectionProgress: (algorithm: string) => number;

  addMissedQuestion: (algorithm: string, questionId: string) => void;
  removeMissedQuestion: (algorithm: string, questionId: string) => void;
  getMissedQuestions: (algorithm: string) => string[];

  completeModule: (pathId: string, moduleId: string) => void;
  addAchievement: (achievementId: string) => void;
}

const ALL_ALGORITHMS = lessons.map((lesson) => lesson.slug);

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedAlgorithms: [],
      quizScores: {},
      sectionProgress: {},
      missedQuestions: {},
      pathProgress: {},
      achievements: [],
      visitedAlgorithms: [],
      lastVisitedAlgorithm: null,

      recordVisit: (algorithm: string) => {
        if (!ALL_ALGORITHMS.includes(algorithm)) return;
        set((state) => ({
          visitedAlgorithms: [...new Set([...state.visitedAlgorithms, algorithm])],
          lastVisitedAlgorithm: algorithm,
        }));
        get().syncLearningProgress();
      },

      syncLearningProgress: () => {
        const state = get();
        for (const path of learningPaths) {
          for (const module of path.modules) {
            if (state.completedAlgorithms.includes(module.algorithmPage.slice(1))) {
              get().completeModule(path.id, module.id);
            }
          }
        }
        const completed = (ids: string[]): boolean => ids.every((id) => state.completedAlgorithms.includes(id));
        if (state.completedAlgorithms.length > 0) get().addAchievement('first-steps');
        if (completed(['aes', 'block-modes'])) get().addAchievement('symmetric-scholar');
        if (completed(['rsa', 'diffie-hellman', 'signatures'])) get().addAchievement('asymmetric-expert');
        if (completed(ALL_ALGORITHMS)) get().addAchievement('cryptographer');
        const hashScore = state.quizScores.hashing;
        if (hashScore?.total > 0 && hashScore.score === hashScore.total) get().addAchievement('hash-master');
        if (ALL_ALGORITHMS.every((id) => {
          const result = state.quizScores[id];
          return result?.total > 0 && result.score / result.total >= 0.9;
        })) get().addAchievement('quiz-champion');
        if (ALL_ALGORITHMS.every((id) => state.visitedAlgorithms.includes(id))) get().addAchievement('explorer');
      },

      markAlgorithmComplete: (algorithm: string) => {
        set((state) => {
          if (state.completedAlgorithms.includes(algorithm)) {
            return state;
          }
          return {
            completedAlgorithms: [...state.completedAlgorithms, algorithm],
          };
        });
        get().syncLearningProgress();
      },

      saveQuizScore: (algorithm: string, score: number, total: number) => {
        if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0 || score < 0 || score > total) return;
        set((state) => ({
          quizScores: {
            ...state.quizScores,
            [algorithm]: {
              score,
              total,
              completedAt: Date.now(),
            },
          },
        }));
        // Also mark algorithm as complete if quiz is passed (>= 70%)
        if (score / total >= 0.7) {
          get().markAlgorithmComplete(algorithm);
        }
        get().syncLearningProgress();
      },

      isAlgorithmComplete: (algorithm: string) => {
        return get().completedAlgorithms.includes(algorithm);
      },

      getQuizScore: (algorithm: string) => {
        return get().quizScores[algorithm] ?? null;
      },

      getCompletionPercentage: () => {
        const completed = ALL_ALGORITHMS.filter((id) => get().completedAlgorithms.includes(id)).length;
        return Math.round((completed / ALL_ALGORITHMS.length) * 100);
      },

      resetProgress: () => {
        set({
          completedAlgorithms: [],
          quizScores: {},
          sectionProgress: {},
          missedQuestions: {},
          pathProgress: {},
          achievements: [],
          visitedAlgorithms: [],
          lastVisitedAlgorithm: null,
        });
      },

      markSectionViewed: (algorithm: string, sectionId: string) => {
        set((state) => {
          const existing = state.sectionProgress[algorithm] ?? {};
          if (existing[sectionId]) return state;
          return {
            sectionProgress: {
              ...state.sectionProgress,
              [algorithm]: {
                ...existing,
                [sectionId]: true,
              },
            },
          };
        });
      },

      getSectionProgress: (algorithm: string) => {
        const sections = get().sectionProgress[algorithm];
        if (!sections) return 0;
        const viewed = Object.values(sections).filter(Boolean).length;
        // Return the count; the page knows the total and computes percentage
        return viewed;
      },

      addMissedQuestion: (algorithm: string, questionId: string) => {
        set((state) => {
          const existing = state.missedQuestions[algorithm] ?? [];
          if (existing.includes(questionId)) return state;
          return {
            missedQuestions: {
              ...state.missedQuestions,
              [algorithm]: [...existing, questionId],
            },
          };
        });
      },

      removeMissedQuestion: (algorithm: string, questionId: string) => {
        set((state) => {
          const existing = state.missedQuestions[algorithm] ?? [];
          if (!existing.includes(questionId)) return state;
          return {
            missedQuestions: {
              ...state.missedQuestions,
              [algorithm]: existing.filter((id) => id !== questionId),
            },
          };
        });
      },

      getMissedQuestions: (algorithm: string) => {
        return get().missedQuestions[algorithm] ?? [];
      },

      completeModule: (pathId: string, moduleId: string) => {
        set((state) => {
          const existing = state.pathProgress[pathId] ?? [];
          if (existing.includes(moduleId)) return state;
          return {
            pathProgress: {
              ...state.pathProgress,
              [pathId]: [...existing, moduleId],
            },
          };
        });
      },

      addAchievement: (achievementId: string) => {
        set((state) => {
          if (state.achievements.includes(achievementId)) return state;
          return { achievements: [...state.achievements, achievementId] };
        });
      },
    }),
    {
      name: 'cryptoviz-progress',
      onRehydrateStorage: () => (state) => state?.syncLearningProgress(),
    }
  )
);
