import React, { useId } from 'react';
import { Plus, Minus } from 'lucide-react';

interface EducationalCardProps {
  title: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const EducationalCard: React.FC<EducationalCardProps> = ({
  title,
  isExpanded,
  onToggle,
  children,
}) => {
  const panelId = useId();
  const headingId = useId();
  return (
    <section className="lesson-note">
      <h3>
        <button
          type="button"
          id={headingId}
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={panelId}
          className="lesson-note-toggle"
        >
          <span>{title}</span>
          {isExpanded ? (
            <Minus size={18} aria-hidden="true" />
          ) : (
            <Plus size={18} aria-hidden="true" />
          )}
        </button>
      </h3>
      <div
        id={panelId}
        aria-labelledby={headingId}
        hidden={!isExpanded}
        className="lesson-note-body"
      >
        {children}
      </div>
    </section>
  );
};
