import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DHPlayground } from './DHPlayground';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('DH playground private-key bounds', () => {
  it('keeps both keys inside the new prime range immediately', () => {
    // generatePrime maps these random values to the primes 97 then 23.
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.999).mockReturnValue(0);
    render(<DHPlayground />);
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Alice private key' }), { target: { value: '95' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Bob private key' }), { target: { value: '94' } });
    fireEvent.click(screen.getByRole('button', { name: 'New Prime' }));
    expect(screen.getByRole('spinbutton', { name: 'Alice private key' })).toHaveValue(21);
    expect(screen.getByRole('spinbutton', { name: 'Bob private key' })).toHaveValue(21);
    expect(screen.getByText('Both computed the same shared secret: 5')).toBeInTheDocument();
  });

  it('normalizes fractional and empty numeric keys to supported integers', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<DHPlayground />);
    const alice = screen.getByRole('spinbutton', { name: 'Alice private key' });
    fireEvent.change(alice, { target: { value: '3.5' } });
    expect(alice).toHaveValue(3);
    fireEvent.change(alice, { target: { value: '' } });
    expect(alice).toHaveValue(2);
    expect(screen.queryByText(/Secrets do not match/)).not.toBeInTheDocument();
  });
});
