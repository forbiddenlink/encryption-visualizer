import { afterEach, expect, it } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';
afterEach(cleanup);
it('renders a 404 heading and a link home', () => {
  render(<MemoryRouter initialEntries={['/does-not-exist']}><NotFoundPage /></MemoryRouter>);
  expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Back to home' }).getAttribute('href')).toBe('/');
});
