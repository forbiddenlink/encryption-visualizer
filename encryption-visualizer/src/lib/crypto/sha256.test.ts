/// <reference types="node" />
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { compareSHA256, demonstrateSHA256Avalanche, MAX_SHA256_TRACE_BYTES, sha256, sha256WithSteps } from './sha256';

const reference = (input: string): string => createHash('sha256').update(input, 'utf8').digest('hex');
const bitDifference = (left: string, right: string): number => Array.from(left).reduce((sum, digit, index) => sum + (parseInt(digit, 16) ^ parseInt(right[index], 16)).toString(2).replaceAll('0', '').length, 0);

describe('SHA-256 digest', () => {
  it.each([
    ['', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
    ['abc', 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
    ['abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq', '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1'],
  ])('matches the NIST vector for %s', (input, digest) => {
    expect(sha256(input)).toBe(digest);
  });

  it.each(['Hello 世界 🌍', '\u0000\u00ff', '😀'.repeat(16), '\ud800', ...[55, 56, 63, 64, 65, 119, 120, 128, 1024, 4096].map(length => 'a'.repeat(length))])('matches independent node:crypto for %s', input => {
    expect(sha256(input)).toBe(reference(input));
  });
});

describe('SHA-256 trace', () => {
  it.each(['', 'abc', 'a'.repeat(55), 'a'.repeat(56), 'a'.repeat(64), 'Hello 世界 🌍'])('ends with the exact digest for %s', input => {
    const steps = sha256WithSteps(input);
    expect(steps.at(-1)?.data?.hash).toBe(reference(input));
    expect(steps.map(step => step.stepNumber)).toEqual(steps.map((_, index) => index));
    expect(steps.every(step => step.data?.algorithm === 'SHA-256')).toBe(true);
    const blockCount = Math.ceil((new TextEncoder().encode(input).length + 9) / 64);
    const rounds = steps.filter(step => step.data?.sha256?.round !== undefined);
    expect(rounds).toHaveLength(blockCount * 64);
    for (let blockIndex = 0; blockIndex < blockCount; blockIndex++) {
      expect(rounds.filter(step => step.data?.sha256?.blockIndex === blockIndex).map(step => step.data?.sha256?.round)).toEqual(Array.from({ length: 64 }, (_, index) => index));
    }
  });

  it('exposes the abc padding, schedule and independently known first round', () => {
    const steps = sha256WithSteps('abc');
    const padding = steps.find(step => step.data?.padded);
    expect(padding?.data?.chunks).toEqual(['61626380', ...Array<string>(14).fill('00000000'), '00000018']);
    const schedule = steps.find(step => step.data?.chunks?.length === 64);
    expect(schedule?.data?.chunks?.slice(16, 20)).toEqual(['61626380', '000f0000', '7da86405', '600003c6']);
    const round = steps.find(step => step.data?.sha256?.round === 0);
    expect(round?.data?.roundValues).toEqual(['5d6aebcd', '6a09e667', 'bb67ae85', '3c6ef372', 'fa2a4622', '510e527f', '9b05688c', '1f83d9ab']);
    expect(round?.data?.sha256).toMatchObject({ blockIndex: 0, blockCount: 1, round: 0, word: '61626380', constant: '428a2f98', temp1: '54da50e8', temp2: '08909ae5' });
  });

  it('caps traces by UTF-8 bytes, but does not cap digest calculation', () => {
    expect(MAX_SHA256_TRACE_BYTES).toBe(1024);
    expect(sha256WithSteps('a'.repeat(1024)).at(-1)?.data?.hash).toBe(reference('a'.repeat(1024)));
    expect(() => sha256WithSteps('a'.repeat(1025))).toThrow(RangeError);
    expect(() => sha256WithSteps('😀'.repeat(257))).toThrow(RangeError);
    expect(sha256('😀'.repeat(257))).toBe(reference('😀'.repeat(257)));
  });
});

describe('SHA-256 comparisons', () => {
  it('counts differences over all 256 bits', () => {
    const result = compareSHA256('abc', 'abd');
    const bitsChanged = bitDifference(reference('abc'), reference('abd'));
    expect(result).toEqual({ input1: 'abc', hash1: reference('abc'), input2: 'abd', hash2: reference('abd'), bitsChanged, similarity: Math.round((1 - bitsChanged / 256) * 100) });
    expect(compareSHA256('abc', 'abc').bitsChanged).toBe(0);
    expect(compareSHA256('abc', 'abc').similarity).toBe(100);
  });

  it.each(['', 'hello', 'HELLO', '123', '😀', 'a😀'])('uses unique Unicode-safe variants for %s', input => {
    const results = demonstrateSHA256Avalanche(input);
    expect(results[0]).toEqual({ input, hash: reference(input), bitsChanged: 0 });
    expect(results.length).toBeGreaterThan(1);
    expect(new Set(results.map(result => result.input)).size).toBe(results.length);
    for (const result of results) {
      expect(result.hash).toBe(reference(result.input));
      expect(result.bitsChanged).toBe(bitDifference(results[0].hash, result.hash));
      expect(Array.from(result.input).every(character => !/[\ud800-\udfff]/u.test(character))).toBe(true);
    }
    if (input === 'a😀') expect(results.map(result => result.input)).toContain('a');
  });
});
