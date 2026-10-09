/**
 * Cryptanalysis Functions Test Suite
 * Tests for Caesar cipher, frequency analysis, and brute force attacks
 */
import { describe, it, expect } from 'vitest';
import {
  caesarEncrypt,
  caesarDecrypt,
  caesarWithSteps,
  countLetterFrequencies,
  getLetterCount,
  suggestShifts,
  frequencyAnalysisAttack,
  bruteForceAttack,
  paddingOracleAttack,
  timingAttack,
} from './cryptanalysis';

describe('Cryptanalysis Functions', () => {
  describe('caesarEncrypt', () => {
    it('encrypts lowercase letters', () => {
      expect(caesarEncrypt('abc', 3)).toBe('def');
    });

    it('encrypts uppercase letters', () => {
      expect(caesarEncrypt('ABC', 3)).toBe('DEF');
    });

    it('wraps around the alphabet', () => {
      expect(caesarEncrypt('xyz', 3)).toBe('abc');
      expect(caesarEncrypt('XYZ', 3)).toBe('ABC');
    });

    it('preserves non-alphabetic characters', () => {
      expect(caesarEncrypt('hello, world!', 5)).toBe('mjqqt, btwqi!');
    });

    it('shift of 0 returns original', () => {
      expect(caesarEncrypt('hello', 0)).toBe('hello');
    });

    it('shift of 26 returns original', () => {
      expect(caesarEncrypt('hello', 26)).toBe('hello');
    });
  });

  describe('caesarDecrypt', () => {
    it('decrypts back to original', () => {
      expect(caesarDecrypt('def', 3)).toBe('abc');
    });

    it('encrypt then decrypt roundtrip', () => {
      const original = 'The quick brown fox jumps over the lazy dog';
      for (let shift = 0; shift < 26; shift++) {
        const encrypted = caesarEncrypt(original, shift);
        const decrypted = caesarDecrypt(encrypted, shift);
        expect(decrypted).toBe(original);
      }
    });
  });

  describe('caesarEncrypt with all 26 shifts', () => {
    it('each shift produces a different result (except 0 and 26)', () => {
      const plaintext = 'hello';
      const results = new Set<string>();
      for (let shift = 0; shift < 26; shift++) {
        results.add(caesarEncrypt(plaintext, shift));
      }
      expect(results.size).toBe(26);
    });
  });

  describe('countLetterFrequencies', () => {
    it('counts letters correctly', () => {
      const counts = countLetterFrequencies('AABBC');
      expect(counts['A']).toBe(2);
      expect(counts['B']).toBe(2);
      expect(counts['C']).toBe(1);
      expect(counts['D']).toBe(0);
    });

    it('is case-insensitive', () => {
      const counts = countLetterFrequencies('aAbB');
      expect(counts['A']).toBe(2);
      expect(counts['B']).toBe(2);
    });

    it('ignores non-letter characters', () => {
      const counts = countLetterFrequencies('a1b!c ');
      expect(counts['A']).toBe(1);
      expect(counts['B']).toBe(1);
      expect(counts['C']).toBe(1);
    });
  });

  describe('getLetterCount', () => {
    it('counts only alphabetic characters', () => {
      expect(getLetterCount('abc')).toBe(3);
      expect(getLetterCount('a1b2c3')).toBe(3);
      expect(getLetterCount('123')).toBe(0);
      expect(getLetterCount('')).toBe(0);
    });
  });

  describe('suggestShifts', () => {
    it('returns 26 results sorted by score', () => {
      const ciphertext = caesarEncrypt(
        'The quick brown fox jumps over the lazy dog and many other things',
        7
      );
      const results = suggestShifts(ciphertext);
      expect(results).toHaveLength(26);
      // Scores should be sorted ascending
      for (let i = 1; i < results.length; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i - 1].score);
      }
    });

    it('returns empty for empty string', () => {
      expect(suggestShifts('')).toHaveLength(0);
    });

    it('returns empty for non-letter string', () => {
      expect(suggestShifts('12345')).toHaveLength(0);
    });
  });

  describe('frequency analysis finds correct shift', () => {
    it('identifies shift for English-like text', () => {
      const shift = 13;
      const plaintext =
        'The quick brown fox jumps over the lazy dog and many other animals roam freely across the countryside';
      const ciphertext = caesarEncrypt(plaintext, shift);
      const results = suggestShifts(ciphertext);
      expect(results[0].shift).toBe(shift);
    });
  });

  describe('frequencyAnalysisAttack', () => {
    it('generates 6 steps', () => {
      const ciphertext = caesarEncrypt('Hello world this is a test message', 5);
      const steps = frequencyAnalysisAttack(ciphertext);
      expect(steps).toHaveLength(6);
    });

    it('step types are correct', () => {
      const ciphertext = caesarEncrypt('Hello world this is a test message with more words', 5);
      const steps = frequencyAnalysisAttack(ciphertext);
      expect(steps[0].type).toBe('setup');
      expect(steps[1].type).toBe('analyze');
      expect(steps[2].type).toBe('analyze');
      expect(steps[3].type).toBe('analyze');
      expect(steps[4].type).toBe('breakthrough');
      expect(steps[5].type).toBe('result');
    });

    it('all steps have frequency-analysis attackType', () => {
      const ciphertext = caesarEncrypt('Testing the frequency analysis attack', 10);
      const steps = frequencyAnalysisAttack(ciphertext);
      steps.forEach((step) => {
        expect(step.attackType).toBe('frequency-analysis');
      });
    });

    it('steps have incrementing step numbers', () => {
      const ciphertext = caesarEncrypt('Some test text', 3);
      const steps = frequencyAnalysisAttack(ciphertext);
      for (let i = 0; i < steps.length; i++) {
        expect(steps[i].stepNumber).toBe(i);
      }
    });

    it('includes frequency data in analysis steps', () => {
      const ciphertext = caesarEncrypt('Testing frequency data presence', 5);
      const steps = frequencyAnalysisAttack(ciphertext);
      const analyzeSteps = steps.filter((s) => s.frequencyData);
      expect(analyzeSteps.length).toBeGreaterThan(0);
    });
  });

  describe('bruteForceAttack', () => {
    it('generates 6 steps', () => {
      const ciphertext = caesarEncrypt('test', 5);
      const steps = bruteForceAttack(ciphertext);
      expect(steps).toHaveLength(6);
    });

    it('finds correct key when expectedPlaintext is provided', () => {
      const plaintext = 'hello world';
      const shift = 7;
      const ciphertext = caesarEncrypt(plaintext, shift);
      const steps = bruteForceAttack(ciphertext, plaintext);
      const resultStep = steps[steps.length - 1];
      expect(resultStep.values?.['best key']).toBe(shift);
    });

    it('all steps have brute-force attackType', () => {
      const steps = bruteForceAttack(caesarEncrypt('test', 3));
      steps.forEach((step) => {
        expect(step.attackType).toBe('brute-force');
      });
    });

    it('attempt steps include attempts array', () => {
      const steps = bruteForceAttack(caesarEncrypt('test', 3));
      const attemptSteps = steps.filter((s) => s.type === 'attempt');
      expect(attemptSteps.length).toBe(3);
      attemptSteps.forEach((step) => {
        expect(step.attempts).toBeDefined();
        expect(step.attempts!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('caesarWithSteps', () => {
    it('generates 3 steps', () => {
      const steps = caesarWithSteps('hello', 5);
      expect(steps).toHaveLength(3);
    });

    it('step types are setup, analyze, result', () => {
      const steps = caesarWithSteps('hello', 5);
      expect(steps[0].type).toBe('setup');
      expect(steps[1].type).toBe('analyze');
      expect(steps[2].type).toBe('result');
    });

    it('result step contains ciphertext', () => {
      const steps = caesarWithSteps('hello', 5);
      const resultStep = steps[2];
      expect(resultStep.values?.ciphertext).toBe(caesarEncrypt('hello', 5).slice(0, 60));
    });
  });

  describe('paddingOracleAttack', () => {
    it('generates 6 steps', () => {
      const steps = paddingOracleAttack();
      expect(steps).toHaveLength(6);
    });

    it('all steps have padding-oracle attackType', () => {
      const steps = paddingOracleAttack();
      steps.forEach((step) => {
        expect(step.attackType).toBe('padding-oracle');
      });
    });
  });

  describe('timingAttack', () => {
    it('generates 6 steps', () => {
      const steps = timingAttack();
      expect(steps).toHaveLength(6);
    });

    it('all steps have timing-attack attackType', () => {
      const steps = timingAttack();
      steps.forEach((step) => {
        expect(step.attackType).toBe('timing-attack');
      });
    });
  });
});


describe('Frequency analysis uncertainty', () => {
  it.each(['', '12345!', 'X'])('does not claim successful recovery for %s', (text) => {
    const result = frequencyAnalysisAttack(text).at(-1);
    expect(result?.description).not.toMatch(/successfully identified/);
    expect(result?.values?.['recovered key']).toBeUndefined();
  });
});
