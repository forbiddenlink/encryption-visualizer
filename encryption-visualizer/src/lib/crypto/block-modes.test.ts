import { describe, it, expect } from 'vitest';
import {
  encryptECBWithSteps,
  encryptCBCWithSteps,
  encryptGCMWithSteps,
  demonstrateECBPatternProblem,
  BLOCK_SIZE,
} from './block-modes';

describe('Block Modes', () => {
  const testPlaintext = 'Hello World!';
  const testKey = 'mysecretkey12345';

  describe('ECB Mode', () => {
    it('generates steps for ECB encryption', () => {
      const steps = encryptECBWithSteps(testPlaintext, testKey);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('input');
      expect(steps[0].mode).toBe('ecb');
      expect(steps[steps.length - 1].type).toBe('output');
    });

    it('includes split-blocks step', () => {
      const steps = encryptECBWithSteps(testPlaintext, testKey);
      const splitStep = steps.find(s => s.type === 'split-blocks');

      expect(splitStep).toBeDefined();
      expect(splitStep?.blocks).toBeDefined();
      expect(splitStep?.blocks?.length).toBeGreaterThan(0);
    });

    it('includes encrypt-block steps for each block', () => {
      const steps = encryptECBWithSteps(testPlaintext, testKey);
      const encryptSteps = steps.filter(s => s.type === 'encrypt-block');
      const splitStep = steps.find(s => s.type === 'split-blocks');

      expect(encryptSteps.length).toBe(splitStep?.blocks?.length);
    });

    it('reveals patterns in identical blocks', () => {
      const repeatedText = 'AAAAAAAAAAAAAAAA'.repeat(3); // 3 identical blocks
      const steps = encryptECBWithSteps(repeatedText, testKey);
      const outputStep = steps.find(s => s.type === 'output');

      // In ECB, identical plaintext blocks produce identical ciphertext
      const blocks = outputStep?.blocks || [];
      const uniqueBlocks = new Set(blocks);
      expect(uniqueBlocks.size).toBeLessThan(blocks.length);
    });
  });

  describe('CBC Mode', () => {
    it('generates steps for CBC encryption', () => {
      const steps = encryptCBCWithSteps(testPlaintext, testKey);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('input');
      expect(steps[0].mode).toBe('cbc');
      expect(steps[steps.length - 1].type).toBe('output');
    });

    it('includes IV in steps', () => {
      const steps = encryptCBCWithSteps(testPlaintext, testKey);
      const inputStep = steps[0];

      expect(inputStep.iv).toBeDefined();
      expect(inputStep.iv?.length).toBeGreaterThan(0);
    });

    it('includes XOR operations', () => {
      const steps = encryptCBCWithSteps(testPlaintext, testKey);
      const xorSteps = steps.filter(s => s.type === 'xor-operation');

      expect(xorSteps.length).toBeGreaterThan(0);
    });

    it('chains blocks with previous ciphertext', () => {
      const steps = encryptCBCWithSteps(testPlaintext, testKey);
      const encryptSteps = steps.filter(s => s.type === 'encrypt-block');

      // After first block, subsequent blocks should reference previousCiphertext
      if (encryptSteps.length > 1) {
        expect(encryptSteps[1].previousCiphertext).toBeDefined();
      }
    });

    it('hides patterns in identical blocks', () => {
      const repeatedText = 'AAAAAAAAAAAAAAAA'.repeat(3); // 3 identical blocks + padding
      const steps = encryptCBCWithSteps(repeatedText, testKey);
      const outputStep = steps.find(s => s.type === 'output');

      // In CBC, identical plaintext blocks should produce DIFFERENT ciphertext
      // due to IV chaining - expect more variety than ECB (which would have only 1 unique for data)
      const blocks = outputStep?.blocks || [];
      const uniqueBlocks = new Set(blocks);
      // CBC should produce more unique blocks than ECB would (which is 1 for repeated data)
      expect(uniqueBlocks.size).toBeGreaterThan(1);
    });
  });

  describe('GCM Mode', () => {
    it('generates steps for GCM encryption', () => {
      const steps = encryptGCMWithSteps(testPlaintext, testKey);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('input');
      expect(steps[0].mode).toBe('gcm');
      expect(steps[steps.length - 1].type).toBe('output');
    });

    it('includes counter values', () => {
      const steps = encryptGCMWithSteps(testPlaintext, testKey);
      const counterSteps = steps.filter(s => s.counter !== undefined);

      expect(counterSteps.length).toBeGreaterThan(0);
    });

    it('generates authentication tag', () => {
      const steps = encryptGCMWithSteps(testPlaintext, testKey);
      const outputStep = steps.find(s => s.type === 'output');

      expect(outputStep?.authTag).toBeDefined();
      expect(outputStep?.authTag?.length).toBeGreaterThan(0);
    });

    it('increments counter for each block', () => {
      // Counter mode preserves three data blocks without padding.
      const longerText = 'A'.repeat(BLOCK_SIZE * 3);
      const steps = encryptGCMWithSteps(longerText, testKey);
      const encryptSteps = steps.filter(s => s.type === 'encrypt-block');

      const counters = encryptSteps.map(s => s.counter);
      expect(counters).toEqual([1, 2, 3]); // Counter mode does not pad
    });
  });

  describe('ECB Pattern Problem Demo', () => {
    it('demonstrates pattern visibility in ECB', () => {
      // Note: 16 chars * 3 reps = 48 chars, which is exactly 3 blocks
      // But PKCS7 padding adds a full block when input is aligned, making it 4 blocks
      const result = demonstrateECBPatternProblem('AAAAAAAAAAAAAAAA', 3, testKey);

      expect(result.patternVisible).toBe(true);
      expect(result.ecbCiphertext.length).toBe(4); // 3 data blocks + 1 padding block

      // First 3 ECB blocks should be identical for identical plaintext (last is padding)
      const dataBlocks = result.ecbCiphertext.slice(0, 3);
      const uniqueECB = new Set(dataBlocks);
      expect(uniqueECB.size).toBe(1);

      // CBC blocks should be more varied than ECB due to IV chaining
      const uniqueCBC = new Set(result.cbcCiphertext);
      // CBC hides patterns - expect more unique values than ECB's 1 (for data blocks)
      expect(uniqueCBC.size).toBeGreaterThan(1);
    });
  });

  describe('Block Size', () => {
    it('uses 16-byte blocks', () => {
      expect(BLOCK_SIZE).toBe(16);
    });

    it('pads plaintext to block size', () => {
      const shortText = 'Hi';
      const steps = encryptECBWithSteps(shortText, testKey);
      const splitStep = steps.find(s => s.type === 'split-blocks');

      // Should have exactly 1 block after padding
      expect(splitStep?.blocks?.length).toBe(1);
      // Block should be 32 hex chars (16 bytes)
      expect(splitStep?.blocks?.[0].length).toBe(32);
    });
  });
});


describe('Block mode byte regressions', () => {
  it.each([encryptECBWithSteps, encryptCBCWithSteps, encryptGCMWithSteps])('uses UTF-8 bytes in every block', (encrypt) => {
    const steps = encrypt('😀é', 'clé');
    expect(steps[0].values?.plaintextHex).toBe('f09f9880c3a9');
    expect(steps.at(-1)?.blocks?.every((block) => /^[0-9a-f]+$/.test(block) && block.length <= 32)).toBe(true);
  });
  it.each(['', 'a', 'é😀', 'A'.repeat(16), 'A'.repeat(17)])('does not pad GCM ciphertext for %s', (input) => {
    const output = encryptGCMWithSteps(input, 'key').at(-1);
    expect(String(output?.values?.ciphertext).length).toBe(new TextEncoder().encode(input).length * 2);
  });
  it('includes ciphertext suffixes in the toy tag', () => {
    const first = encryptGCMWithSteps('same prefix text but A', 'key').at(-1)?.authTag;
    const second = encryptGCMWithSteps('same prefix text but B', 'key').at(-1)?.authTag;
    expect(first).not.toBe(second);
  });
  it.each([encryptECBWithSteps, encryptCBCWithSteps, encryptGCMWithSteps])('rejects oversized visualizations and keys', (encrypt) => {
    expect(() => encrypt('a'.repeat(1025), 'key')).toThrow();
    expect(() => encrypt('text', '😀'.repeat(5))).toThrow();
  });
});
