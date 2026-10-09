import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HashInputPanel } from './HashInputPanel';
import { HashPlayground } from './HashPlayground';
import { AvalancheEffectDemo } from './AvalancheEffectDemo';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  return {
    m: { div: ({ children, ...props }: Record<string, unknown>) => {
      const rest = Object.fromEntries(Object.entries(props).filter(([key]) => !['initial', 'animate', 'exit', 'transition'].includes(key)));
      return React.createElement('div', rest, children as React.ReactNode);
    } },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('SHA-256 lesson inputs', () => {
  it('accepts empty messages and measures the trace limit in UTF-8 bytes', () => {
    const onHash = vi.fn();
    render(<HashInputPanel onHash={onHash} />);
    const input = screen.getByLabelText('Enter text to hash:');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Hash It!' }));
    expect(onHash).toHaveBeenLastCalledWith('');
    fireEvent.change(input, { target: { value: '😀'.repeat(257) } });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('1024 UTF-8 bytes');
    fireEvent.click(screen.getByRole('button', { name: 'Hash It!' }));
    expect(onHash).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('😀'.repeat(257));
    fireEvent.change(input, { target: { value: '😀'.repeat(256) } });
    fireEvent.click(screen.getByRole('button', { name: 'Hash It!' }));
    expect(onHash).toHaveBeenLastCalledWith('😀'.repeat(256));
  });

  it('shows the standard empty digest and compares all 256 bits', () => {
    render(<HashPlayground />);
    fireEvent.click(screen.getByRole('button', { name: 'Hex' }));
    expect(screen.getByText('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Compare' }));
    expect(screen.getByText('256/256')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Comparison message' }), { target: { value: 'a'.repeat(1025) } });
    expect(screen.queryByText('256/256')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Comparison message' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles clipboard denial with a manual-copy recovery message', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Denied'));
    render(<HashPlayground />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy hash' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copy failed. Select the Hex view'));
  });

  it('does not replace avalanche results with oversized input', () => {
    render(<AvalancheEffectDemo />);
    fireEvent.click(screen.getByRole('button', { name: 'Demonstrate' }));
    expect(screen.getByText('ORIGINAL INPUT:')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Avalanche message' }), { target: { value: '😀'.repeat(257) } });
    fireEvent.click(screen.getByRole('button', { name: 'Demonstrate' }));
    expect(screen.getByRole('alert')).toHaveTextContent('1024 UTF-8 bytes');
    expect(screen.getByText('"Hello"')).toBeInTheDocument();
  });
});
