import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AESInputPanel } from './AESInputPanel';

afterEach(cleanup);

describe('AES input byte validation', () => {
  it.each(['😀', 'a'.repeat(17)])('explains unsupported input without truncating: %s', input => {
    const encrypt = vi.fn();
    render(<AESInputPanel onEncrypt={encrypt} />);
    fireEvent.change(screen.getByLabelText(/Plaintext/), { target: { value: input } });
    expect(screen.getByLabelText(/Plaintext/)).toHaveValue(input);
    expect(screen.getByRole('alert')).toHaveTextContent(/Latin-1|16 bytes/);
    fireEvent.click(screen.getByRole('button', { name: /Start Encryption/ }));
    expect(encrypt).not.toHaveBeenCalled();
  });

  it('still submits supported Latin-1 text and zero-padded short keys', () => {
    const encrypt = vi.fn();
    render(<AESInputPanel onEncrypt={encrypt} />);
    fireEvent.change(screen.getByLabelText(/Plaintext/), { target: { value: 'café' } });
    fireEvent.click(screen.getByRole('button', { name: /Start Encryption/ }));
    expect(encrypt).toHaveBeenCalledWith('café', 'SecretKey123456!');
  });

  it('ships a sample key that is a full 16 bytes, not an implicitly zero-padded one', () => {
    const encrypt = vi.fn();
    render(<AESInputPanel onEncrypt={encrypt} />);
    fireEvent.click(screen.getByRole('button', { name: /Start Encryption/ }));
    const key = encrypt.mock.calls[0][1] as string;
    expect(new TextEncoder().encode(key)).toHaveLength(16);
  });
});
