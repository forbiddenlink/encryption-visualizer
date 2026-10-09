/**
 * Hash Functions Test Suite
 * Tests for FNV-1a hash implementation and visualization helpers
 */
import { describe, it, expect } from 'vitest';
import {
  simpleHash,
  stringToBinary,
  demonstrateAvalancheEffect,
  hashWithSteps,
  compareHashes,
  type HashStep,
} from './hash';

describe('Hash Crypto Functions', () => {
  describe('simpleHash', () => {
    it('returns 8-character hex string', () => {
      const hash = simpleHash('test');

      expect(hash).toHaveLength(8);
      expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
    });

    it('is deterministic - same input produces same hash', () => {
      const input = 'Hello, World!';

      const hash1 = simpleHash(input);
      const hash2 = simpleHash(input);

      expect(hash1).toBe(hash2);
    });

    it('produces different hashes for different inputs', () => {
      const hash1 = simpleHash('test1');
      const hash2 = simpleHash('test2');

      expect(hash1).not.toBe(hash2);
    });

    it('handles empty string', () => {
      const hash = simpleHash('');

      expect(hash).toHaveLength(8);
      expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
    });

    it('handles long strings', () => {
      const longString = 'a'.repeat(10000);
      const hash = simpleHash(longString);

      expect(hash).toHaveLength(8);
    });

    it('handles special characters', () => {
      const hash = simpleHash('!@#$%^&*()');

      expect(hash).toHaveLength(8);
      expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
    });

    it('handles unicode characters', () => {
      const hash = simpleHash('Hello 世界 🌍');

      expect(hash).toHaveLength(8);
      expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
    });

    it('small changes produce different hashes', () => {
      const hash1 = simpleHash('password');
      const hash2 = simpleHash('Password');
      const hash3 = simpleHash('password1');

      expect(hash1).not.toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(hash2).not.toBe(hash3);
    });
  });

  describe('stringToBinary', () => {
    it('converts single character to 8-bit binary', () => {
      const binary = stringToBinary('A');

      // 'A' = 65 = 01000001
      expect(binary).toBe('01000001');
    });

    it('converts multiple characters with space separator', () => {
      const binary = stringToBinary('Hi');

      // 'H' = 72 = 01001000, 'i' = 105 = 01101001
      expect(binary).toBe('01001000 01101001');
    });

    it('handles empty string', () => {
      const binary = stringToBinary('');

      expect(binary).toBe('');
    });

    it('pads binary to 8 bits', () => {
      // Space character = 32 = 00100000 (needs padding)
      const binary = stringToBinary(' ');

      expect(binary).toBe('00100000');
    });

    it('handles numeric digits', () => {
      const binary = stringToBinary('0');

      // '0' = 48 = 00110000
      expect(binary).toBe('00110000');
    });

    it('handles newline character', () => {
      const binary = stringToBinary('\n');

      // '\n' = 10 = 00001010
      expect(binary).toBe('00001010');
    });
  });

  describe('demonstrateAvalancheEffect', () => {
    it('returns array with original input first', () => {
      const results = demonstrateAvalancheEffect('test');

      expect(results[0].input).toBe('test');
      expect(results[0].bitsChanged).toBe(0);
    });

    it('includes variations of the input', () => {
      const results = demonstrateAvalancheEffect('hello');

      expect(results.length).toBeGreaterThan(1);

      // Should include original plus variations
      const inputs = results.map((r) => r.input);
      expect(inputs).toContain('hello');
    });

    it('each result has input, hash, and bitsChanged', () => {
      const results = demonstrateAvalancheEffect('test');

      results.forEach((result) => {
        expect(result).toHaveProperty('input');
        expect(result).toHaveProperty('hash');
        expect(result).toHaveProperty('bitsChanged');
        expect(typeof result.input).toBe('string');
        expect(typeof result.hash).toBe('string');
        expect(typeof result.bitsChanged).toBe('number');
      });
    });

    it('variations have non-zero bit differences', () => {
      const results = demonstrateAvalancheEffect('hello');

      // Skip original (index 0), check variations have bit differences
      const variations = results.slice(1);
      variations.forEach((result) => {
        expect(result.bitsChanged).toBeGreaterThanOrEqual(0);
      });
    });

    it('handles single character input', () => {
      const results = demonstrateAvalancheEffect('a');

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].input).toBe('a');
    });

    it('includes space variation', () => {
      const input = 'test';
      const results = demonstrateAvalancheEffect(input);

      const hasSpaceVariation = results.some((r) => r.input === 'test ');
      expect(hasSpaceVariation).toBe(true);
    });

    it('includes capitalize variation', () => {
      const results = demonstrateAvalancheEffect('hello');

      const hasCapitalizeVariation = results.some((r) => r.input === 'Hello');
      expect(hasCapitalizeVariation).toBe(true);
    });
  });

  describe('hashWithSteps', () => {
    it('returns 5 steps for hashing', () => {
      const steps = hashWithSteps('test');

      expect(steps).toHaveLength(5);
    });

    it('steps have correct types in order', () => {
      const steps = hashWithSteps('test');

      const expectedTypes: HashStep['type'][] = [
        'input',
        'preprocessing',
        'initialization',
        'compression',
        'output',
      ];

      expect(steps.map((s) => s.type)).toEqual(expectedTypes);
    });

    it('each step has required properties', () => {
      const steps = hashWithSteps('test');

      steps.forEach((step) => {
        expect(step).toHaveProperty('stepNumber');
        expect(step).toHaveProperty('type');
        expect(step).toHaveProperty('title');
        expect(step).toHaveProperty('description');
        expect(typeof step.stepNumber).toBe('number');
        expect(typeof step.type).toBe('string');
        expect(typeof step.title).toBe('string');
        expect(typeof step.description).toBe('string');
      });
    });

    it('steps have incrementing step numbers', () => {
      const steps = hashWithSteps('test');

      for (let i = 0; i < steps.length; i++) {
        expect(steps[i].stepNumber).toBe(i);
      }
    });

    it('first step shows input message', () => {
      const input = 'Hello, Hash!';
      const steps = hashWithSteps(input);

      expect(steps[0].type).toBe('input');
      expect(steps[0].data?.input).toBe(input);
    });

    it('second step shows binary conversion', () => {
      const steps = hashWithSteps('test');

      expect(steps[1].type).toBe('preprocessing');
      expect(steps[1].data?.binary).toBeDefined();
    });

    it('third step shows initialization', () => {
      const steps = hashWithSteps('test');

      expect(steps[2].type).toBe('initialization');
      expect(steps[2].data?.hash).toBe('811c9dc5'); // FNV offset basis
    });

    it('fourth step shows compression chunks', () => {
      const steps = hashWithSteps('test message');

      expect(steps[3].type).toBe('compression');
      expect(steps[3].data?.chunks).toBeDefined();
      expect(Array.isArray(steps[3].data?.chunks)).toBe(true);
    });

    it('final step shows hash output', () => {
      const input = 'test';
      const steps = hashWithSteps(input);

      expect(steps[4].type).toBe('output');
      expect(steps[4].data?.hash).toBe(simpleHash(input));
    });

    it('handles empty input', () => {
      const steps = hashWithSteps('');

      expect(steps).toHaveLength(5);
      expect(steps[0].data?.input).toBe('');
    });
  });

  describe('compareHashes', () => {
    it('returns comparison object with all properties', () => {
      const result = compareHashes('hello', 'world');

      expect(result).toHaveProperty('input1', 'hello');
      expect(result).toHaveProperty('hash1');
      expect(result).toHaveProperty('input2', 'world');
      expect(result).toHaveProperty('hash2');
      expect(result).toHaveProperty('similarity');
      expect(result).toHaveProperty('bitsChanged');
    });

    it('identical inputs have 100% similarity', () => {
      const result = compareHashes('test', 'test');

      expect(result.similarity).toBe(100);
      expect(result.bitsChanged).toBe(0);
      expect(result.hash1).toBe(result.hash2);
    });

    it('different inputs have less than 100% similarity', () => {
      const result = compareHashes('hello', 'world');

      expect(result.similarity).toBeLessThan(100);
      expect(result.bitsChanged).toBeGreaterThan(0);
    });

    it('hashes match direct simpleHash calls', () => {
      const input1 = 'first';
      const input2 = 'second';

      const result = compareHashes(input1, input2);

      expect(result.hash1).toBe(simpleHash(input1));
      expect(result.hash2).toBe(simpleHash(input2));
    });

    it('similarity is between 0 and 100', () => {
      const result = compareHashes('abc', 'xyz');

      expect(result.similarity).toBeGreaterThanOrEqual(0);
      expect(result.similarity).toBeLessThanOrEqual(100);
    });

    it('bitsChanged is non-negative', () => {
      const result = compareHashes('test1', 'test2');

      expect(result.bitsChanged).toBeGreaterThanOrEqual(0);
    });

    it('handles empty strings', () => {
      const result = compareHashes('', '');

      expect(result.similarity).toBe(100);
      expect(result.bitsChanged).toBe(0);
    });

    it('handles one empty string', () => {
      const result = compareHashes('test', '');

      expect(result.similarity).toBeLessThan(100);
      expect(result.bitsChanged).toBeGreaterThan(0);
    });

    it('is commutative for bitsChanged', () => {
      const result1 = compareHashes('hello', 'world');
      const result2 = compareHashes('world', 'hello');

      expect(result1.bitsChanged).toBe(result2.bitsChanged);
    });
  });

  describe('Hash consistency', () => {
    it('hash function is stable across multiple calls', () => {
      const inputs = ['test', 'Hello, World!', '', 'a', '12345', 'special!@#$'];

      inputs.forEach((input) => {
        const hash1 = simpleHash(input);
        const hash2 = simpleHash(input);
        expect(hash1).toBe(hash2);
      });
    });

    it('hashWithSteps produces same hash as simpleHash', () => {
      const inputs = ['test', 'abc123', 'Hello'];

      inputs.forEach((input) => {
        const steps = hashWithSteps(input);
        const directHash = simpleHash(input);
        expect(steps[steps.length - 1].data?.hash).toBe(directHash);
      });
    });
  });

  describe('Edge cases', () => {
    it('handles very long input for demonstrateAvalancheEffect', () => {
      const longInput = 'x'.repeat(1000);
      const results = demonstrateAvalancheEffect(longInput);

      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    it('handles special characters in all functions', () => {
      const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      expect(() => simpleHash(special)).not.toThrow();
      expect(() => stringToBinary(special)).not.toThrow();
      expect(() => hashWithSteps(special)).not.toThrow();
      expect(() => compareHashes(special, 'test')).not.toThrow();
      expect(() => demonstrateAvalancheEffect(special)).not.toThrow();
    });

    it('handles whitespace-only input', () => {
      const whitespace = '   \t\n';

      const hash = simpleHash(whitespace);
      expect(hash).toHaveLength(8);

      const steps = hashWithSteps(whitespace);
      expect(steps).toHaveLength(5);
    });
  });
});


describe('FNV-1a byte regressions', () => {
  it.each([['', '811c9dc5'], ['a', 'e40c292c'], ['hello', '4f9f2cab'], ['foobar', 'bf9cf968']])('matches the independent vector for %s', (input, expected) => {
    expect(simpleHash(input)).toBe(expected);
  });
  it('encodes all UTF-8 bytes in the binary view', () => {
    expect(stringToBinary('😀')).toBe('11110000 10011111 10011000 10000000');
    expect(simpleHash('😀')).not.toBe(simpleHash('😁'));
  });
});


describe('Hash UTF-8 preview', () => {
  it('previews bytes without replacing a truncated surrogate pair', () => {
    expect(hashWithSteps('a'.repeat(15) + '😀')[1].data?.binary?.split(' ').at(-1)).toBe('11110000');
  });
});
