import { describe, expect, it } from 'vitest';
import { lessons } from './lessonCatalog';
import { learningPaths } from './learningPaths';
import { getCompletedModuleIds, getLessonContinuation, getNextAvailableModule, isModuleAvailable } from './learningProgress';

const fundamentals = learningPaths[0];
const emptyProgress = { completedAlgorithms: [], pathProgress: {} };

describe('curriculum progression', () => {
  it('covers every lesson once and has prerequisites within each path', () => {
    const routes = learningPaths.flatMap((path) => path.modules.map((module) => module.algorithmPage));
    expect(routes.sort()).toEqual(lessons.map((lesson) => `/${lesson.slug}`).sort());
    for (const path of learningPaths) {
      for (const module of path.modules) {
        expect(module.prerequisites.every((id) => path.modules.some((item) => item.id === id))).toBe(true);
      }
    }
  });

  it('requires padding before block modes and selects only available incomplete modules', () => {
    const completed = ['fund-hashing', 'fund-aes'];
    expect(getNextAvailableModule(fundamentals, completed)?.id).toBe('fund-padding');
    expect(isModuleAvailable(fundamentals.modules.find((module) => module.id === 'fund-block-modes')!, completed)).toBe(false);
    expect(getNextAvailableModule(fundamentals, [...completed, 'fund-padding'])?.id).toBe('fund-block-modes');
  });

  it('keeps standalone completed modules reviewable while their prerequisites remain incomplete', () => {
    const rsa = fundamentals.modules.find((module) => module.id === 'fund-rsa')!;
    expect(isModuleAvailable(rsa, ['fund-rsa'])).toBe(true);
    expect(getNextAvailableModule(fundamentals, ['fund-rsa'])?.id).toBe('fund-hashing');
  });

  it('combines quiz completion with historical path completion without counting removed modules', () => {
    expect(getCompletedModuleIds(fundamentals, {
      completedAlgorithms: ['aes'],
      pathProgress: { fundamentals: ['fund-hashing', 'legacy-module'] },
    })).toEqual(['fund-hashing', 'fund-aes']);
  });

  it('directs incomplete lessons to their own knowledge check', () => {
    expect(getLessonContinuation('hashing', emptyProgress)).toEqual({ kind: 'assessment', url: '#lesson-quiz' });
    expect(getLessonContinuation('aes', emptyProgress)).toEqual({ kind: 'assessment', url: '#lesson-quiz' });
  });

  it('suggests an available lesson and respects historical completion', () => {
    expect(getLessonContinuation('aes', {
      completedAlgorithms: ['hashing', 'aes'], pathProgress: {},
    })).toEqual({ kind: 'lesson', title: 'Padding Schemes', url: '/padding' });
    expect(getLessonContinuation('hashing', {
      completedAlgorithms: [], pathProgress: { fundamentals: ['fund-hashing'] },
    })).toEqual({ kind: 'lesson', title: 'AES Symmetric Encryption', url: '/aes' });
  });

  it('moves to an available lesson in another path when the current path is finished', () => {
    expect(getLessonContinuation('rsa', {
      completedAlgorithms: fundamentals.modules.map((module) => module.algorithmPage.slice(1)), pathProgress: {},
    })).toEqual({ kind: 'lesson', title: 'Diffie-Hellman Key Exchange', url: '/diffie-hellman' });
  });

  it('offers path review when every lesson is complete or the slug is unknown', () => {
    expect(getLessonContinuation('hmac', {
      completedAlgorithms: lessons.map((lesson) => lesson.slug), pathProgress: {},
    })).toEqual({ kind: 'review', url: '/learn' });
    expect(getLessonContinuation('unknown', emptyProgress)).toEqual({ kind: 'review', url: '/learn' });
  });
});
