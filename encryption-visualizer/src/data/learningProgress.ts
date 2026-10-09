import { learningPaths, type LearningModule, type LearningPath } from './learningPaths';

interface LearningProgress {
  completedAlgorithms: readonly string[];
  pathProgress: Record<string, string[]>;
}

type LessonContinuation =
  | { kind: 'assessment'; url: '#lesson-quiz' }
  | { kind: 'lesson'; title: string; url: string }
  | { kind: 'review'; url: '/learn' };

export const getCompletedModuleIds = (path: LearningPath, progress: LearningProgress): string[] => {
  const historical = progress.pathProgress[path.id] ?? [];
  return path.modules
    .filter((module) => historical.includes(module.id) || progress.completedAlgorithms.includes(module.algorithmPage.slice(1)))
    .map((module) => module.id);
};

export const isModuleAvailable = (module: LearningModule, completedModuleIds: readonly string[]): boolean => {
  return completedModuleIds.includes(module.id) || module.prerequisites.every((id) => completedModuleIds.includes(id));
};

export const getNextAvailableModule = (path: LearningPath, completedModuleIds: readonly string[]): LearningModule | undefined => {
  return path.modules.find((module) => !completedModuleIds.includes(module.id) && isModuleAvailable(module, completedModuleIds));
};

export const getLessonContinuation = (slug: string, progress: LearningProgress): LessonContinuation => {
  const currentPath = learningPaths.find((path) => path.modules.some((module) => module.algorithmPage === `/${slug}`));
  if (!currentPath) return { kind: 'review', url: '/learn' };

  const currentModule = currentPath.modules.find((module) => module.algorithmPage === `/${slug}`)!;
  if (!getCompletedModuleIds(currentPath, progress).includes(currentModule.id)) {
    return { kind: 'assessment', url: '#lesson-quiz' };
  }

  const orderedPaths = [currentPath, ...learningPaths.filter((path) => path.id !== currentPath.id)];
  for (const path of orderedPaths) {
    const next = getNextAvailableModule(path, getCompletedModuleIds(path, progress));
    if (next) return { kind: 'lesson', title: next.title, url: next.algorithmPage };
  }
  return { kind: 'review', url: '/learn' };
};
