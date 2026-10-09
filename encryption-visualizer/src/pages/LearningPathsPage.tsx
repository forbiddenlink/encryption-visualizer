import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Lock } from 'lucide-react';
import { learningPaths, type LearningPath, type LearningModule } from '@/data/learningPaths';
import { getCompletedModuleIds, getNextAvailableModule, isModuleAvailable } from '@/data/learningProgress';
import { achievements } from '@/data/achievements';
import { useProgressStore } from '@/store/progressStore';
import { AchievementBadge } from '@/components/learning/AchievementBadge';

export const LearningPathsPage = () => {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const navigate = useNavigate();
  const completedAlgorithms = useProgressStore((state) => state.completedAlgorithms);
  const pathProgress = useProgressStore((state) => state.pathProgress);
  const earnedAchievements = useProgressStore((state) => state.achievements);

  const getCompletedModules = (path: LearningPath): string[] => {
    return getCompletedModuleIds(path, { completedAlgorithms, pathProgress });
  };

  const getPathCompletion = (path: LearningPath): number => {
    return path.modules.length > 0 ? Math.round((getCompletedModules(path).length / path.modules.length) * 100) : 0;
  };

  const getCurrentModule = (path: LearningPath): LearningModule | undefined => {
    return getNextAvailableModule(path, getCompletedModules(path));
  };

  const handleStartPath = (path: LearningPath): void => {
    const destination = getCurrentModule(path) ?? path.modules[0];
    if (destination) navigate(destination.algorithmPage);
  };

  return (
    <div className="curriculum-page">
      <header className="curriculum-header">
        <p className="eyebrow">The curriculum / 03 guided paths</p>
        <h1 className="section-title">Learning Paths</h1>
        <p className="curriculum-deck">A deliberate route through the mathematics of trust.</p>
        <div className="curriculum-intro">
          <p>Start with the foundations. Follow the relationships between ideas. Build an understanding that lasts beyond the experiment.</p>
          <p>Pass a lesson’s knowledge check to complete its module. Your progress is saved on this device. Modules unlock as you complete their prerequisites.</p>
        </div>
      </header>

      {selectedPath ? (
        <section className="curriculum-detail" aria-label={selectedPath.title}>
          <button onClick={() => setSelectedPath(null)} className="curriculum-back"><ArrowLeft size={16} aria-hidden="true" />All Paths</button>
          <header className="curriculum-path-heading">
            <div>
              <p className="eyebrow">Path {String(learningPaths.indexOf(selectedPath) + 1).padStart(2, '0')} / {selectedPath.difficulty}</p>
              <h2>{selectedPath.title}</h2>
              <p>{selectedPath.description}</p>
            </div>
            <div className="curriculum-path-progress">
              <span className="curriculum-progress-value">{getPathCompletion(selectedPath)}%</span>
              <span>{getCompletedModules(selectedPath).length} of {selectedPath.modules.length} modules completed</span>
              <progress value={getCompletedModules(selectedPath).length} max={selectedPath.modules.length} aria-label={`${selectedPath.title} progress`} />
            </div>
          </header>
          <div className="curriculum-chapters-heading"><h3>Modules</h3><span>{selectedPath.estimatedTime} of guided study</span></div>
          <ol className="curriculum-chapters">
            {selectedPath.modules.map((module, index) => {
              const completed = getCompletedModules(selectedPath).includes(module.id);
              const locked = !isModuleAvailable(module, getCompletedModules(selectedPath));
              const current = getCurrentModule(selectedPath)?.id === module.id;
              const required = module.prerequisites.filter((id) => !getCompletedModules(selectedPath).includes(id)).map((id) => selectedPath.modules.find((item) => item.id === id)?.title).filter(Boolean);
              return (
                <li key={module.id} data-status={completed ? 'completed' : locked ? 'locked' : current ? 'current' : 'available'}>
                  <button onClick={() => navigate(module.algorithmPage)} disabled={locked} className="curriculum-chapter" aria-labelledby={`${module.id}-title`} aria-describedby={`${module.id}-description${locked ? ` ${module.id}-prerequisite` : ''}`}>
                    <span className="curriculum-chapter-number" aria-hidden="true">{completed ? <Check size={18} /> : locked ? <Lock size={16} /> : String(index + 1).padStart(2, '0')}</span>
                    <span className="curriculum-chapter-content"><span id={`${module.id}-title`} className="curriculum-chapter-title">{module.title}</span><span id={`${module.id}-description`} className="curriculum-chapter-description">{module.description}</span>{locked && <span id={`${module.id}-prerequisite`} className="curriculum-prerequisite">Complete {required.join(' and ')} to unlock</span>}</span>
                    <span className="curriculum-chapter-action">{completed ? 'Review' : locked ? 'Locked' : current ? 'Start here' : 'Explore'}{!locked && <ArrowRight size={16} aria-hidden="true" />}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <button onClick={() => handleStartPath(selectedPath)} className="btn-primary curriculum-continue">{getPathCompletion(selectedPath) === 100 ? 'Review Path' : getPathCompletion(selectedPath) > 0 ? 'Continue' : 'Start Path'}<ArrowRight size={18} aria-hidden="true" /></button>
        </section>
      ) : (
        <section className="curriculum-paths" aria-label="Choose a learning path">
          {learningPaths.map((path, index) => {
            const completion = getPathCompletion(path);
            const currentModule = getCurrentModule(path);
            return (
              <button key={path.id} onClick={() => setSelectedPath(path)} className="curriculum-path-row">
                <span className="curriculum-path-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="curriculum-path-overview"><span className="eyebrow">{path.difficulty} / {path.estimatedTime}</span><span className="curriculum-path-title">{path.title}</span><span className="curriculum-path-description">{path.description}</span><span className="curriculum-path-next">{currentModule ? <>Next: <strong>{currentModule.title}</strong></> : 'All modules complete. Return to review.'}</span></span>
                <span className="curriculum-path-meta"><span>{path.modules.length} modules</span><span className="curriculum-row-progress"><span>{completion}% complete</span><progress value={completion} max={100} aria-label={`${path.title} progress`} /></span><span className="curriculum-path-open">View path <ArrowRight size={20} aria-hidden="true" /></span></span>
              </button>
            );
          })}
        </section>
      )}

      <section className="curriculum-achievements" aria-labelledby="achievements-title">
        <div className="curriculum-achievements-heading"><div><p className="eyebrow">Milestones, earned through understanding</p><h2 id="achievements-title">Achievements</h2></div><span>{earnedAchievements.length}/{achievements.length} unlocked</span></div>
        <div className="curriculum-achievement-grid">{achievements.map((achievement) => <AchievementBadge key={achievement.id} achievement={achievement} unlocked={earnedAchievements.includes(achievement.id)} />)}</div>
      </section>
    </div>
  );
};
