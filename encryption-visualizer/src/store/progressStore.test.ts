import { beforeEach, describe, expect, it } from 'vitest';
import { useProgressStore } from './progressStore';
import { lessons } from '@/data/lessonCatalog';
import { learningPaths } from '@/data/learningPaths';

describe('learning progression', () => {
  beforeEach(() => useProgressStore.getState().resetProgress());

  it('advances matching modules only after a passed quiz and persists the result', async () => {
    const store = useProgressStore.getState();
    store.saveQuizScore('hashing', 6, 10);
    expect(useProgressStore.getState().pathProgress.fundamentals).toBeUndefined();
    store.saveQuizScore('hashing', 7, 10);
    expect(useProgressStore.getState().pathProgress.fundamentals).toEqual(['fund-hashing']);
    store.saveQuizScore('hashing', 10, 10);
    expect(useProgressStore.getState().pathProgress.fundamentals).toEqual(['fund-hashing']);
    expect(useProgressStore.getState().achievements).toEqual(expect.arrayContaining(['first-steps', 'hash-master']));
    await useProgressStore.persist.rehydrate();
    expect(useProgressStore.getState().completedAlgorithms).toContain('hashing');
    expect(useProgressStore.getState().pathProgress.fundamentals).toContain('fund-hashing');
  });

  it('uses dedicated lesson destinations and preserves previously completed modules', () => {
    const store = useProgressStore.getState();
    store.completeModule('advanced-security', 'legacy-module');
    store.markAlgorithmComplete('ecc');
    expect(useProgressStore.getState().pathProgress['advanced-security']).toEqual(['legacy-module', 'adv-ecc']);
    expect(learningPaths.flatMap((path) => path.modules).every((module) => lessons.some((lesson) => module.algorithmPage === `/${lesson.slug}`))).toBe(true);
  });

  it('counts all twelve lessons and awards completion and quiz achievements', () => {
    const store = useProgressStore.getState();
    lessons.forEach((lesson) => store.saveQuizScore(lesson.slug, 9, 10));
    expect(store.getCompletionPercentage()).toBe(100);
    expect(useProgressStore.getState().achievements).toEqual(expect.arrayContaining(['cryptographer', 'quiz-champion', 'symmetric-scholar', 'asymmetric-expert']));
    expect(useProgressStore.getState().pathProgress['key-exchange']).toContain('kx-tls');
  });

  it('records unique lesson visits and rejects impossible quiz scores', () => {
    const store = useProgressStore.getState();
    lessons.forEach((lesson) => store.recordVisit(lesson.slug));
    store.recordVisit('aes');
    expect(useProgressStore.getState().visitedAlgorithms).toHaveLength(12);
    expect(useProgressStore.getState().lastVisitedAlgorithm).toBe('aes');
    expect(useProgressStore.getState().achievements).toContain('explorer');
    store.saveQuizScore('aes', 1, 0);
    store.saveQuizScore('aes', 11, 10);
    expect(store.getQuizScore('aes')).toBeNull();
  });
});
