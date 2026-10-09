import { Link } from 'react-router-dom';
import { getLessonContinuation } from '@/data/learningProgress';
import { useProgressStore } from '@/store/progressStore';

export const LessonNext = ({ slug }: { slug: string }) => {
  const completed = useProgressStore((state) => state.completedAlgorithms);
  const pathProgress = useProgressStore((state) => state.pathProgress);
  const next = getLessonContinuation(slug, { completedAlgorithms: completed, pathProgress });
  const isCompleted = next.kind !== 'assessment';

  return (
    <section className="lesson-next" aria-label="Continue learning">
      <div>
        <p className="eyebrow">Keep learning</p>
        <h2 className="section-title">
          {isCompleted
            ? 'One topic understood. What’s next?'
            : 'Turn the experiment into understanding.'}
        </h2>
        <p>
          {isCompleted
            ? 'Your progress is saved on this device.'
            : 'Pass this lesson’s knowledge check to save your progress on this device.'}
        </p>
      </div>
      <div className="lesson-next-actions">
        {next.kind === 'assessment' ? (
          <a href={next.url} className="btn-primary">
            Complete knowledge check →
          </a>
        ) : (
          <Link to={next.url} className="btn-primary">
            {next.kind === 'lesson' ? `Next: ${next.title} →` : 'Review learning paths →'}
          </Link>
        )}
        <Link to="/learn" className="text-sm underline underline-offset-4">
          View learning paths
        </Link>
      </div>
    </section>
  );
};
