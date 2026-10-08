import '@/test/disableNativeAnimation';
import { afterEach, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { UseCaseMatrix } from './UseCaseMatrix';
afterEach(cleanup);
it('offers an accessible close action for the selected use-case explanation', async () => {
  render(<UseCaseMatrix />);
  fireEvent.click(screen.getByRole('button', { name: 'AES for Encrypt bulk data: Recommended' }));
  await waitFor(() => expect(screen.getByText('AES is the standard for fast, secure bulk data encryption.')).toBeVisible());
  fireEvent.click(screen.getByRole('button', { name: /Close use case explanation/i }));
  await waitFor(() => expect(screen.queryByText('AES is the standard for fast, secure bulk data encryption.')).not.toBeInTheDocument());
});
