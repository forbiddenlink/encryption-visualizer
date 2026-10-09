import { afterEach, describe, expect, it, vi } from 'vitest';
import { randomInteger } from './random';

afterEach(() => vi.unstubAllGlobals());

describe('uniform random integers', () => {
  it('rejects excess samples instead of biasing the first outcomes', () => {
    const samples = [0xffffffff, 24, 0];
    const getRandomValues = vi.fn((words: Uint32Array): Uint32Array => {
      words[0] = samples.shift()!;
      return words;
    });
    vi.stubGlobal('crypto', { getRandomValues });
    expect(randomInteger(1, 25)).toBe(25);
    expect(getRandomValues).toHaveBeenCalledTimes(2);
    expect(randomInteger(1, 25)).toBe(1);
  });

  it('preserves the unsigned upper boundary and singleton ranges', () => {
    vi.stubGlobal('crypto', { getRandomValues: (words: Uint32Array): Uint32Array => {
      words[0] = 0xffffffff;
      return words;
    } });
    expect(randomInteger(0, 0xffffffff)).toBe(0xffffffff);
    expect(randomInteger(7, 7)).toBe(7);
  });

  it.each([[2, 1], [0, 2 ** 32], [0.5, 2], [0, Infinity]])('rejects invalid bounds %s..%s', (min, max) => {
    expect(() => randomInteger(min, max)).toThrow(RangeError);
  });
});
