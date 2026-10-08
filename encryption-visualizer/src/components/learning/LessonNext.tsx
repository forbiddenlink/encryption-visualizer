import { Link } from 'react-router-dom';
import { lessons } from '@/data/lessonCatalog';
import { learningPaths } from '@/data/learningPaths';
import { useProgressStore } from '@/store/progressStore';

export const LessonNext = ({ slug }: { slug: string }) => {
  const completed = useProgressStore((state) => state.completedAlgorithms);
  const currentIndex = lessons.findIndex((lesson) => lesson.slug === slug);
  const path = learningPaths.find((item) => item.modules.some((module) => module.algorithmPage === `/${slug}`));
  const nextModule = path?.modules.find((module) => module.algorithmPage !== `/${slug}` && !completed.includes(module.algorithmPage.slice(1)));
  const next = nextModule ? { title: nextModule.title, url: nextModule.algorithmPage } : {
    title: lessons[(currentIndex + 1) % lessons.length].title,
    url: `/${lessons[(currentIndex + 1) % lessons.length].slug}`,
  };

  return (
    <section className="lesson-next" aria-label="Continue learning">
      <div>
        <p className="eyebrow">Keep learning</p>
        <h2 className="section-title">{completed.includes(slug) ? 'One topic understood. What’s next?' : 'Turn the experiment into understanding.'}</h2>
        <p>Pass this lesson’s knowledge check to save your progress on this device.</p>
      </div>
      <div className="flex flex-col gap-3">
        <Link to={next.url} className="btn-primary">Next: {next.title} →</Link>
        <Link to="/learn" className="text-sm underline underline-offset-4">View learning paths</Link>
      </div>
    </section>
  );
};
