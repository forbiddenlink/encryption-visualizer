import '@/test/disableNativeAnimation';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { MemoryRouter } from 'react-router-dom';
import { LearningPathsPage } from '@/pages/LearningPathsPage';
import { LessonNext } from './LessonNext';
import { PathProgress } from './PathProgress';
import { learningPaths } from '@/data/learningPaths';
import { useProgressStore } from '@/store/progressStore';

beforeEach(() => useProgressStore.getState().resetProgress());
afterEach(cleanup);

it('keeps an incomplete learner at the current assessment instead of suggesting a locked lesson', () => {
  render(<MemoryRouter><LessonNext slug="hashing" /></MemoryRouter>);
  expect(screen.getByRole('link', { name: 'Complete knowledge check →' })).toHaveAttribute('href', '#lesson-quiz');
  expect(screen.queryByRole('link', { name: /Next:/ })).not.toBeInTheDocument();
});

it('recognizes historical module completion and suggests the available next lesson', () => {
  useProgressStore.setState({ pathProgress: { fundamentals: ['fund-hashing'] } });
  render(<MemoryRouter><LessonNext slug="hashing" /></MemoryRouter>);
  expect(screen.getByRole('link', { name: 'Next: AES Symmetric Encryption →' })).toHaveAttribute('href', '/aes');
  expect(screen.queryByText(/Pass this lesson/)).not.toBeInTheDocument();
});

it.each([false, true])('lets learners review a standalone completed module in vertical=%s', (vertical) => {
  render(<LazyMotion features={domAnimation}><PathProgress modules={learningPaths[0].modules} completedModules={['fund-rsa']} vertical={vertical} /></LazyMotion>);
  expect(screen.getByRole('button', { name: /RSA Asymmetric Encryption/ })).toBeEnabled();
  expect(screen.getByRole('button', { name: /AES Symmetric Encryption/ })).toBeDisabled();
  expect(screen.getByRole('button', { name: /Hash Functions/ })).toBeEnabled();
});

it('reconciles standalone lesson completion with path progress and keeps the next module available', async () => {
  useProgressStore.setState({ completedAlgorithms: ['aes'], pathProgress: { fundamentals: ['legacy-module'] } });
  render(<MemoryRouter><LazyMotion features={domAnimation}><LearningPathsPage /></LazyMotion></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /Cryptography Fundamentals/ }));
  expect(await screen.findByRole('button', { name: /AES Symmetric Encryption/ })).toBeEnabled();
  expect(screen.getByRole('button', { name: /Padding Schemes/ })).toBeEnabled();
  expect(screen.getByRole('button', { name: /Block Cipher Modes/ })).toBeDisabled();
  expect(screen.getByText('20%')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
});
