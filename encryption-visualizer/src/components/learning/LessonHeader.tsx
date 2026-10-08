import { Link } from 'react-router-dom';
import { lessons } from '@/data/lessonCatalog';
import { useProgressStore } from '@/store/progressStore';

interface LessonHeaderProps {
  slug: string;
  title: string;
  description: string;
}

export const LessonHeader = ({ slug, title, description }: LessonHeaderProps) => {
  const lesson = lessons.find((item) => item.slug === slug);
  const number = lessons.findIndex((item) => item.slug === slug) + 1;
  const complete = useProgressStore((state) => state.completedAlgorithms.includes(slug));
  const recordVisit = useProgressStore((state) => state.recordVisit);
  useEffect(() => recordVisit(slug), [slug, recordVisit]);
  const scope: Record<string, string> = {
    hashing: 'Lab scope: this visualization uses a simplified 32-bit FNV-1a hash. The notes explain cryptographic hashes such as SHA-256; the lab output is not SHA-256.',
    hmac: 'Lab scope: this demonstration uses a simplified FNV-1a hash and a 16-byte block to illustrate the inner and outer HMAC construction.',
    'password-hashing': 'Lab scope: this is an iterated-hash simulation of salt and cost, not an implementation of bcrypt, scrypt, or Argon2.',
  };

  return (
    <header className="lesson-header">
      <div className="lesson-heading">
        <p className="eyebrow"><Link to="/#topics">Field guide</Link> / {String(number).padStart(2, '0')} / {lesson?.category}</p>
        <h1 className="section-title">{title}</h1>
        <p className="lesson-description">{description}</p>
        {scope[slug] && <p className="lesson-scope">{scope[slug]}</p>}
      </div>
      <div className="lesson-actions">
        <span className="eyebrow">{complete ? 'Knowledge check passed' : 'Experiment · understand · test'}</span>
        <div className="flex flex-wrap gap-3">
          <a href="#lesson-notes" className="btn-secondary">Learn More ↓</a>
          <a href="#lesson-quiz" className="btn-secondary">Knowledge check ↓</a>
        </div>
      </div>
    </header>
  );
};
import { useEffect } from 'react';
