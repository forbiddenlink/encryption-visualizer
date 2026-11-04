import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

export const NotFoundPage = () => (
  <div className="space-y-6">
    <p className="eyebrow">Error 404</p>
    <h1 className="section-title">Page not found</h1>
    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
      This address does not match any study in the field guide. Check the URL, or head back to the atlas and pick a lesson.
    </p>
    <div className="flex flex-wrap gap-3">
      <Link to={ROUTES.HOME} className="btn-primary inline-flex items-center px-5">Back to home</Link>
      <Link to={ROUTES.LEARNING_PATHS} className="btn-secondary inline-flex items-center px-5">Browse learning paths</Link>
    </div>
  </div>
);
