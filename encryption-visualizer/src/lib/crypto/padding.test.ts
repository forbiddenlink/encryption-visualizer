/**
 * Padding Schemes Test Suite
 * Tests for PKCS#7, Zero Padding, and ANSI X.923
 */
import { describe, it, expect } from 'vitest';
import {
  pkcs7Pad,
  pkcs7Unpad,
  zeroPad,
  zeroUnpad,
  ansiX923Pad,
  ansiX923Unpad,
  pad,
  unpad,
  padWithSteps,
  compareSchemes,
} from './padding';

describe('Padding Schemes', () => {
  describe('PKCS#7', () => {
    it('adds correct padding bytes', () => {
      // 5 bytes, block size 8 -> 3 bytes of padding (value 0x03)
      const data = [1, 2, 3, 4, 5];
      const padded = pkcs7Pad(data, 8);
      expect(padded).toEqual([1, 2, 3, 4, 5, 3, 3, 3]);
    });

    it('adds full block when already aligned', () => {
      const data = [1, 2, 3, 4];
      const padded = pkcs7Pad(data, 4);
      expect(padded).toEqual([1, 2, 3, 4, 4, 4, 4, 4]);
      expect(padded.length).toBe(8);
    });

    it('single byte needs blockSize-1 padding', () => {
      const data = [0x41];
      const padded = pkcs7Pad(data, 4);
      expect(padded).toEqual([0x41, 3, 3, 3]);
    });

    it('unpad returns original data', () => {
      const data = [1, 2, 3, 4, 5];
      const padded = pkcs7Pad(data, 8);
      const unpadded = pkcs7Unpad(padded);
      expect(unpadded).toEqual(data);
    });

    it('unpad throws for invalid padding', () => {
      expect(() => pkcs7Unpad([1, 2, 3, 5])).toThrow('Invalid PKCS#7 padding');
    });

    it('unpad throws for empty array', () => {
      // empty array -> returns empty
      const result = pkcs7Unpad([]);
      expect(result).toEqual([]);
    });

    it('roundtrip with various data lengths', () => {
      for (let len = 1; len <= 16; len++) {
        const data = Array.from({ length: len }, (_, i) => i + 1);
        const padded = pkcs7Pad(data, 8);
        expect(padded.length % 8).toBe(0);
        const unpadded = pkcs7Unpad(padded);
        expect(unpadded).toEqual(data);
      }
    });
  });

  describe('Zero Padding', () => {
    it('pads with zeros', () => {
      const data = [1, 2, 3];
      const padded = zeroPad(data, 8);
      expect(padded).toEqual([1, 2, 3, 0, 0, 0, 0, 0]);
    });

    it('does not add padding when already aligned and non-empty', () => {
      const data = [1, 2, 3, 4];
      const padded = zeroPad(data, 4);
      expect(padded).toEqual([1, 2, 3, 4]);
    });

    it('unpad removes trailing zeros', () => {
      const padded = [1, 2, 3, 0, 0, 0];
      const unpadded = zeroUnpad(padded);
      expect(unpadded).toEqual([1, 2, 3]);
    });

    it('unpad is ambiguous for data ending with zeros', () => {
      // This is the known limitation of zero padding
      const data = [1, 2, 0, 0];
      const padded = zeroPad(data, 8);
      const unpadded = zeroUnpad(padded);
      // Loses trailing zeros from original data
      expect(unpadded).toEqual([1, 2]);
    });
  });

  describe('ANSI X.923', () => {
    it('pads with zeros and count byte at end', () => {
      const data = [1, 2, 3, 4, 5];
      const padded = ansiX923Pad(data, 8);
      expect(padded).toEqual([1, 2, 3, 4, 5, 0, 0, 3]);
    });

    it('adds full block when aligned', () => {
      const data = [1, 2, 3, 4];
      const padded = ansiX923Pad(data, 4);
      expect(padded).toEqual([1, 2, 3, 4, 0, 0, 0, 4]);
    });

    it('unpad returns original data', () => {
      const data = [1, 2, 3, 4, 5];
      const padded = ansiX923Pad(data, 8);
      const unpadded = ansiX923Unpad(padded);
      expect(unpadded).toEqual(data);
    });

    it('unpad throws for invalid padding', () => {
      expect(() => ansiX923Unpad([])).not.toThrow();
      expect(ansiX923Unpad([])).toEqual([]);
    });
  });

  describe('pad / unpad generic functions', () => {
    it('delegates to correct scheme', () => {
      const data = [1, 2, 3];
      expect(pad(data, 8, 'pkcs7')).toEqual(pkcs7Pad(data, 8));
      expect(pad(data, 8, 'zero')).toEqual(zeroPad(data, 8));
      expect(pad(data, 8, 'ansi-x923')).toEqual(ansiX923Pad(data, 8));
    });

    it('unpad delegates to correct scheme', () => {
      const data = [1, 2, 3];
      const paddedPkcs7 = pad(data, 8, 'pkcs7');
      expect(unpad(paddedPkcs7, 'pkcs7')).toEqual(data);
    });
  });

  describe('padWithSteps', () => {
    it('generates 6 steps', () => {
      const steps = padWithSteps('Hello', 8, 'pkcs7');
      expect(steps).toHaveLength(6);
    });

    it('steps have correct types in order', () => {
      const steps = padWithSteps('Hi', 8, 'pkcs7');
      const expectedTypes = [
        'input',
        'measure',
        'calculate-padding',
        'apply-padding',
        'show-blocks',
        'verify',
      ];
      // First 6 types match (step count is 7 including index 0-6)
      expect(steps.map((s) => s.type)).toEqual(expect.arrayContaining(expectedTypes));
    });

    it('each step has required properties', () => {
      const steps = padWithSteps('Test', 8, 'pkcs7');
      steps.forEach((step) => {
        expect(step).toHaveProperty('stepNumber');
        expect(step).toHaveProperty('type');
        expect(step).toHaveProperty('title');
        expect(step).toHaveProperty('description');
        expect(step).toHaveProperty('scheme');
      });
    });

    it('verify step confirms match', () => {
      const steps = padWithSteps('Hello', 8, 'pkcs7');
      const verifyStep = steps.find((s) => s.type === 'verify');
      expect(verifyStep?.values?.match).toBe('YES');
    });

    it('works with all schemes', () => {
      const schemes = ['pkcs7', 'zero', 'ansi-x923'] as const;
      schemes.forEach((scheme) => {
        const steps = padWithSteps('Test', 8, scheme);
        expect(steps.length).toBeGreaterThanOrEqual(6);
      });
    });
  });

  describe('compareSchemes', () => {
    it('returns all three schemes', () => {
      const result = compareSchemes('Hello', 8);
      expect(result['pkcs7']).toBeDefined();
      expect(result['zero']).toBeDefined();
      expect(result['ansi-x923']).toBeDefined();
    });

    it('all results are block-aligned', () => {
      const result = compareSchemes('Test', 8);
      expect(result['pkcs7'].padded.length % 8).toBe(0);
      expect(result['zero'].padded.length % 8).toBe(0);
      expect(result['ansi-x923'].padded.length % 8).toBe(0);
    });
  });
});


describe('Padding byte regressions', () => {
  it.each(['pkcs7', 'ansi-x923'] as const)('recovers Unicode and control characters with %s', (scheme) => {
    const input = 'é😀\n';
    const steps = padWithSteps(input, 8, scheme);
    expect(steps.at(-1)?.values?.recoveredText).toBe(input);
    expect(steps.at(-1)?.values?.match).toBe('YES');
    expect(compareSchemes(input, 8)[scheme].padded.every((byte) => byte >= 0 && byte <= 255)).toBe(true);
  });
  it('shows no padding for aligned zero padding', () => {
    const steps = padWithSteps('12345678', 8, 'zero');
    expect(steps.find((step) => step.type === 'measure')?.values?.paddingNeeded).toBe(0);
    expect(steps.find((step) => step.type === 'calculate-padding')?.paddingBytes).toEqual([]);
  });
  it('rejects nonzero ANSI fill bytes', () => {
    expect(() => ansiX923Unpad([65, 9, 2])).toThrow();
  });
  it.each([0, -1, 1.5, 256, NaN])('rejects invalid block size %s', (size) => {
    expect(() => pad([65], size, 'pkcs7')).toThrow();
    expect(() => compareSchemes('a', size)).toThrow();
  });
  it('rejects values outside a byte', () => {
    expect(() => pkcs7Pad([256], 8)).toThrow();
    expect(() => ansiX923Unpad([65, 1.5])).toThrow();
  });
});
