import '@/test/disableNativeAnimation';
import { beforeEach, afterEach, expect, it } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import { ComparePage } from './ComparePage';
import { useCompareStore } from '@/store/compareStore';
beforeEach(() => useCompareStore.setState({ leftAlgorithm: 'aes', rightAlgorithm: 'rsa', syncPlayback: true }));
afterEach(cleanup);
it('initializes reversed query pairs atomically and lets visitors change the pair afterward', () => {
  render(<MemoryRouter initialEntries={['/compare?left=rsa&right=aes']}><LazyMotion features={domAnimation}><ComparePage /></LazyMotion></MemoryRouter>);
  expect(useCompareStore.getState().leftAlgorithm).toBe('rsa');
  expect(useCompareStore.getState().rightAlgorithm).toBe('aes');
  act(() => useCompareStore.getState().setLeftAlgorithm('hashing'));
  expect(useCompareStore.getState().leftAlgorithm).toBe('hashing');
});
it('does not describe signatures or key exchange as reversible encryption', () => {
  const view = render(<MemoryRouter><LazyMotion features={domAnimation}><ComparePage /></LazyMotion></MemoryRouter>);
  act(() => useCompareStore.setState({ leftAlgorithm: 'signatures', rightAlgorithm: 'diffie-hellman' }));
  const row = Array.from(view.container.querySelectorAll('tr')).find((item) => item.firstElementChild?.textContent === 'Reversible');
  expect(row?.textContent?.replace(/\s/g, '')).toBe('ReversibleNoNo');
});
