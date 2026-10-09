import { useEffect } from 'react';
import { LessonSchematic } from './LessonSchematic';
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
    signatures:
      'Lab scope: this demonstration signs a truncated FNV-1a hash with small RSA keys. Different messages can collide; use it to study the steps, not to authenticate real messages.',
    hashing:
      'Lab scope: SHA-256 follows FIPS 180-4, with UTF-8 encoding, padding, and all 64 compression rounds per block. Interactive messages are limited to 1024 UTF-8 bytes.',
    hmac: 'Lab scope: this demonstration uses a simplified FNV-1a hash and a 16-byte block to illustrate the inner and outer HMAC construction.',
    'password-hashing':
      'Lab scope: this is an iterated-hash simulation of salt and cost, not an implementation of bcrypt, scrypt, or Argon2.',
  };

  return (
    <>
      <header className="lesson-header">
        <div className="lesson-heading">
          <p className="eyebrow">
            <Link to="/#topics">Field guide</Link> / {String(number).padStart(2, '0')} /{' '}
            {lesson?.category}
          </p>
          <h1 className="section-title">{title}</h1>
          <p className="lesson-description">{description}</p>
          {scope[slug] && <p className="lesson-scope">{scope[slug]}</p>}
        </div>
        <LessonSchematic slug={slug} />
      </header>
      <nav className="lesson-chapters" aria-label="Lesson chapters">
        <a href="#lesson-experiment">
          <span>01</span> Experiment
        </a>
        <a href="#lesson-notes">
          <span>02</span> Learn More
        </a>
        <a href="#lesson-quiz">
          <span>03</span> Knowledge check
        </a>
        <div className="lesson-actions">
          <span className="eyebrow">
            {complete ? 'Knowledge check passed' : 'Experiment · understand · test'}
          </span>
        </div>
      </nav>
      <h2 id="lesson-experiment" className="sr-only">
        Interactive experiment
      </h2>
    </>
  );
};
