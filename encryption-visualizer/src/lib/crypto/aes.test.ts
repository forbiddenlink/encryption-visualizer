/**
 * AES Cryptographic Functions Test Suite
 * Tests for FIPS 197 compliant AES-128 implementation
 */
import { describe, it, expect } from 'vitest';
import {
  stringToState,
  stateToString,
  stateToHex,
  subBytes,
  shiftRows,
  mixColumns,
  addRoundKey,
  generateRoundKeys,
  encryptAESWithSteps,
  type AESStep,
} from './aes';

describe('AES Crypto Functions', () => {
  describe('stringToState', () => {
    it('converts 16-character string to 4x4 state matrix in column-major order', () => {
      const input = 'ABCDEFGHIJKLMNOP';
      const state = stringToState(input);

      // Column-major order: fill columns first
      // Col 0: A, B, C, D (chars 0-3)
      // Col 1: E, F, G, H (chars 4-7)
      // Col 2: I, J, K, L (chars 8-11)
      // Col 3: M, N, O, P (chars 12-15)
      expect(state).toEqual([
        [65, 69, 73, 77], // Row 0: A, E, I, M
        [66, 70, 74, 78], // Row 1: B, F, J, N
        [67, 71, 75, 79], // Row 2: C, G, K, O
        [68, 72, 76, 80], // Row 3: D, H, L, P
      ]);
    });

    it('pads short strings with null characters', () => {
      const input = 'Hi';
      const state = stringToState(input);

      expect(state[0][0]).toBe('H'.charCodeAt(0)); // 72
      expect(state[1][0]).toBe('i'.charCodeAt(0)); // 105
      expect(state[2][0]).toBe(0); // null padding
      expect(state[3][0]).toBe(0);
    });

    it('returns 4x4 matrix structure', () => {
      const state = stringToState('test');

      expect(state).toHaveLength(4);
      state.forEach((row) => {
        expect(row).toHaveLength(4);
      });
    });
  });

  describe('stateToString', () => {
    it('converts state matrix back to string in column-major order', () => {
      const state = [
        [65, 69, 73, 77],
        [66, 70, 74, 78],
        [67, 71, 75, 79],
        [68, 72, 76, 80],
      ];

      expect(stateToString(state)).toBe('ABCDEFGHIJKLMNOP');
    });

    it('is inverse of stringToState', () => {
      const original = 'Hello, AES-128!';
      const state = stringToState(original);
      const result = stateToString(state);

      expect(result.startsWith(original)).toBe(true);
    });
  });

  describe('stateToHex', () => {
    it('converts state to uppercase hex strings', () => {
      const state = [
        [0, 15, 255, 16],
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ];

      const hex = stateToHex(state);

      expect(hex[0]).toEqual(['00', '0F', 'FF', '10']);
      expect(hex[1][0]).toBe('01');
    });

    it('pads single digit hex values with leading zero', () => {
      const state = [[5, 10, 15, 0]];
      const hex = stateToHex(state as number[][]);

      expect(hex[0]).toEqual(['05', '0A', '0F', '00']);
    });
  });

  describe('subBytes', () => {
    it('applies S-Box substitution to each byte', () => {
      // Known S-Box values: S-Box[0x00] = 0x63, S-Box[0x01] = 0x7C
      const state = [
        [0x00, 0x01, 0x02, 0x03],
        [0x10, 0x11, 0x12, 0x13],
        [0x20, 0x21, 0x22, 0x23],
        [0x30, 0x31, 0x32, 0x33],
      ];

      const result = subBytes(state);

      // S-Box[0x00] = 0x63
      expect(result[0][0]).toBe(0x63);
      // S-Box[0x01] = 0x7C
      expect(result[0][1]).toBe(0x7c);
    });

    it('does not modify original state', () => {
      const state = [[0x00, 0x01, 0x02, 0x03]];
      const originalFirstByte = state[0][0];

      subBytes(state as number[][]);

      expect(state[0][0]).toBe(originalFirstByte);
    });

    it('returns new state matrix', () => {
      const state = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
      ];

      const result = subBytes(state);

      expect(result).not.toBe(state);
    });
  });

  describe('shiftRows', () => {
    it('shifts rows correctly: row 0 by 0, row 1 by 1, row 2 by 2, row 3 by 3', () => {
      const state = [
        [0, 1, 2, 3], // Row 0: no shift
        [4, 5, 6, 7], // Row 1: shift left by 1 -> [5, 6, 7, 4]
        [8, 9, 10, 11], // Row 2: shift left by 2 -> [10, 11, 8, 9]
        [12, 13, 14, 15], // Row 3: shift left by 3 -> [15, 12, 13, 14]
      ];

      const result = shiftRows(state);

      expect(result[0]).toEqual([0, 1, 2, 3]);
      expect(result[1]).toEqual([5, 6, 7, 4]);
      expect(result[2]).toEqual([10, 11, 8, 9]);
      expect(result[3]).toEqual([15, 12, 13, 14]);
    });

    it('preserves original state', () => {
      const state = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const original = state.map((row) => [...row]);

      shiftRows(state);

      expect(state).toEqual(original);
    });
  });

  describe('mixColumns', () => {
    it('applies Galois Field multiplication correctly', () => {
      // Test with known AES test vector
      const state = [
        [0xdb, 0x13, 0x53, 0x45],
        [0xf2, 0x0a, 0x22, 0x5c],
        [0x01, 0x01, 0x01, 0x01],
        [0xc6, 0xc6, 0xc6, 0xc6],
      ];

      const result = mixColumns(state);

      // First column should transform correctly
      expect(result).toBeDefined();
      expect(result[0]).toHaveLength(4);
    });

    it('returns 4x4 matrix', () => {
      const state = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];

      const result = mixColumns(state);

      expect(result).toHaveLength(4);
      result.forEach((row) => {
        expect(row).toHaveLength(4);
      });
    });

    it('produces different output from input', () => {
      const state = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];

      const result = mixColumns(state);

      // MixColumns should change values
      expect(result).not.toEqual(state);
    });
  });

  describe('addRoundKey', () => {
    it('XORs state with round key', () => {
      const state = [
        [0xff, 0x00, 0xaa, 0x55],
        [0x00, 0xff, 0x55, 0xaa],
        [0xaa, 0x55, 0xff, 0x00],
        [0x55, 0xaa, 0x00, 0xff],
      ];

      const roundKey = [
        [0xff, 0xff, 0xff, 0xff],
        [0x00, 0x00, 0x00, 0x00],
        [0xaa, 0xaa, 0xaa, 0xaa],
        [0x55, 0x55, 0x55, 0x55],
      ];

      const result = addRoundKey(state, roundKey);

      // XOR properties: A ^ A = 0, A ^ 0 = A, A ^ 0xFF = ~A (for bytes)
      expect(result[0][0]).toBe(0x00); // 0xFF ^ 0xFF = 0
      expect(result[0][1]).toBe(0xff); // 0x00 ^ 0xFF = 0xFF
      expect(result[1][0]).toBe(0x00); // 0x00 ^ 0x00 = 0
    });

    it('is its own inverse (applying twice returns original)', () => {
      const state = [
        [0x12, 0x34, 0x56, 0x78],
        [0x9a, 0xbc, 0xde, 0xf0],
        [0x11, 0x22, 0x33, 0x44],
        [0x55, 0x66, 0x77, 0x88],
      ];

      const roundKey = [
        [0xab, 0xcd, 0xef, 0x01],
        [0x23, 0x45, 0x67, 0x89],
        [0xfe, 0xdc, 0xba, 0x98],
        [0x76, 0x54, 0x32, 0x10],
      ];

      const result1 = addRoundKey(state, roundKey);
      const result2 = addRoundKey(result1, roundKey);

      expect(result2).toEqual(state);
    });
  });

  describe('generateRoundKeys', () => {
    it('generates 11 round keys from 128-bit key', () => {
      const key = 'Thats my Kung Fu';
      const roundKeys = generateRoundKeys(key);

      expect(roundKeys).toHaveLength(11);
    });

    it('each round key is a 4x4 matrix', () => {
      const key = 'SecretKey123456!';
      const roundKeys = generateRoundKeys(key);

      roundKeys.forEach((roundKey) => {
        expect(roundKey).toHaveLength(4);
        roundKey.forEach((row) => {
          expect(row).toHaveLength(4);
        });
      });
    });

    it('first round key matches original key', () => {
      const key = 'ABCDEFGHIJKLMNOP';
      const roundKeys = generateRoundKeys(key);

      // First round key should be the original key in matrix form
      // Column-major order
      expect(roundKeys[0][0][0]).toBe('A'.charCodeAt(0));
      expect(roundKeys[0][1][0]).toBe('B'.charCodeAt(0));
      expect(roundKeys[0][2][0]).toBe('C'.charCodeAt(0));
      expect(roundKeys[0][3][0]).toBe('D'.charCodeAt(0));
    });

    it('pads short keys with null bytes', () => {
      const shortKey = 'short';
      const roundKeys = generateRoundKeys(shortKey);

      expect(roundKeys).toHaveLength(11);
      // Should still produce valid round keys
      expect(roundKeys[0]).toBeDefined();
    });

    it('produces different round keys for each round', () => {
      const key = 'MyEncryptionKey!';
      const roundKeys = generateRoundKeys(key);

      // Round keys should be different (key expansion transforms them)
      const uniqueKeys = new Set(roundKeys.map((rk) => JSON.stringify(rk)));
      expect(uniqueKeys.size).toBe(11);
    });
  });

  describe('encryptAESWithSteps', () => {
    it('returns 41 steps for AES-128 encryption', () => {
      const plaintext = 'Hello, World!!!';
      const key = 'MySecretKey12345';

      const steps = encryptAESWithSteps(plaintext, key);

      // AES-128: 1 initial + 1 initial AddRoundKey + 9 rounds × 4 steps + 3 final steps
      // = 1 + 1 + 36 + 3 = 41 steps
      expect(steps).toHaveLength(41);
    });

    it('first step is initial plaintext', () => {
      const plaintext = 'Test message...';
      const key = 'TestKey12345678!';

      const steps = encryptAESWithSteps(plaintext, key);

      expect(steps[0].type).toBe('initial');
      expect(steps[0].title).toBe('Initial Plaintext');
      expect(steps[0].roundNumber).toBe(0);
    });

    it('second step is initial AddRoundKey', () => {
      const plaintext = 'Test message...';
      const key = 'TestKey12345678!';

      const steps = encryptAESWithSteps(plaintext, key);

      expect(steps[1].type).toBe('addRoundKey');
      expect(steps[1].roundNumber).toBe(0);
      expect(steps[1].roundKey).toBeDefined();
    });

    it('final step is ciphertext output', () => {
      const plaintext = 'Test message...';
      const key = 'TestKey12345678!';

      const steps = encryptAESWithSteps(plaintext, key);

      const lastStep = steps[steps.length - 1];
      expect(lastStep.type).toBe('final');
      expect(lastStep.title).toBe('Final Ciphertext');
      expect(lastStep.roundNumber).toBe(10);
    });

    it('includes all AES operations in correct order for each round', () => {
      const plaintext = 'AES test input!';
      const key = 'AES-128-Key!!!!';

      const steps = encryptAESWithSteps(plaintext, key);

      // Check round 1 structure (steps 2-5)
      const round1Steps = steps.filter((s) => s.roundNumber === 1);
      const round1Types = round1Steps.map((s) => s.type);

      expect(round1Types).toEqual(['subBytes', 'shiftRows', 'mixColumns', 'addRoundKey']);
    });

    it('final round excludes MixColumns', () => {
      const plaintext = 'Final round test';
      const key = 'Key for testing!';

      const steps = encryptAESWithSteps(plaintext, key);

      // Check round 10 structure (final round)
      const round10Steps = steps.filter((s) => s.roundNumber === 10);
      const round10Types = round10Steps.map((s) => s.type);

      // Final round: SubBytes, ShiftRows, AddRoundKey (no MixColumns)
      expect(round10Types).toContain('subBytes');
      expect(round10Types).toContain('shiftRows');
      expect(round10Types).not.toContain('mixColumns');
    });

    it('each step has incrementing step numbers', () => {
      const steps = encryptAESWithSteps('test', 'key');

      for (let i = 0; i < steps.length; i++) {
        expect(steps[i].stepNumber).toBe(i);
      }
    });

    it('each step includes state matrix', () => {
      const steps = encryptAESWithSteps('test', 'key');

      steps.forEach((step) => {
        expect(step.state).toBeDefined();
        expect(step.state).toHaveLength(4);
        step.state.forEach((row) => {
          expect(row).toHaveLength(4);
        });
      });
    });

    it('produces consistent output for same input', () => {
      const plaintext = 'Deterministic!!!';
      const key = 'ConsistentKey123';

      const steps1 = encryptAESWithSteps(plaintext, key);
      const steps2 = encryptAESWithSteps(plaintext, key);

      // Final ciphertext should be identical
      expect(steps1[steps1.length - 1].state).toEqual(steps2[steps2.length - 1].state);
    });

    it('produces different output for different keys', () => {
      const plaintext = 'Same plaintext!!';
      const key1 = 'FirstKey12345678';
      const key2 = 'SecondKey1234567';

      const steps1 = encryptAESWithSteps(plaintext, key1);
      const steps2 = encryptAESWithSteps(plaintext, key2);

      // Final ciphertext should be different
      expect(steps1[steps1.length - 1].state).not.toEqual(steps2[steps2.length - 1].state);
    });
  });

  describe('AES Step Interface', () => {
    it('each step has required properties', () => {
      const steps = encryptAESWithSteps('test', 'key');

      steps.forEach((step: AESStep) => {
        expect(step).toHaveProperty('stepNumber');
        expect(step).toHaveProperty('type');
        expect(step).toHaveProperty('title');
        expect(step).toHaveProperty('description');
        expect(step).toHaveProperty('state');
        expect(typeof step.stepNumber).toBe('number');
        expect(typeof step.type).toBe('string');
        expect(typeof step.title).toBe('string');
        expect(typeof step.description).toBe('string');
      });
    });

    it('addRoundKey steps include round key', () => {
      const steps = encryptAESWithSteps('test', 'key');

      const addRoundKeySteps = steps.filter((s) => s.type === 'addRoundKey' || s.type === 'final');

      addRoundKeySteps.forEach((step) => {
        expect(step.roundKey).toBeDefined();
        expect(step.roundKey).toHaveLength(4);
      });
    });
  });
});


describe('AES byte arithmetic regressions', () => {
  const fromHex = (hex: string): string => hex.match(/../g)!.map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
  const finalHex = (plaintext: string, key: string): string => {
    const final = encryptAESWithSteps(fromHex(plaintext), fromHex(key)).at(-1)!;
    return Array.from({ length: 16 }, (_, i) => final.state[i % 4][Math.floor(i / 4)].toString(16).padStart(2, '0')).join('');
  };

  it('matches the FIPS 197 AES-128 known-answer ciphertext', () => {
    expect(finalHex('00112233445566778899aabbccddeeff', '000102030405060708090a0b0c0d0e0f')).toBe('69c4e0d86a7b0430d8cdb78070b4c55a');
  });

  it('matches the AES-128 all-zero block/key vector', () => {
    expect(finalHex('00000000000000000000000000000000', '00000000000000000000000000000000')).toBe('66e94bd4ef8a2c3b884cfa59ca342b2e');
  });

  it('reduces high-bit MixColumns products to bytes', () => {
    const result = mixColumns([[128, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
    expect(result.map(row => row[0])).toEqual([27, 128, 128, 155]);
  });

  it('keeps every example frame renderable as 16 bytes', () => {
    for (const step of encryptAESWithSteps('Hello AES!', 'SecretKey12345!')) {
      expect(step.state.flat().every(byte => Number.isInteger(byte) && byte >= 0 && byte <= 255)).toBe(true);
      expect(() => stateToHex(step.state)).not.toThrow();
    }
  });

  it.each(['😀', '漢', 'a'.repeat(17)])('rejects unsupported plaintext without truncating: %s', input => {
    expect(() => encryptAESWithSteps(input, 'key')).toThrow(/Latin-1|16 bytes/);
  });

  it.each(['😀', '漢', 'k'.repeat(17)])('rejects unsupported keys without truncating: %s', key => {
    expect(() => encryptAESWithSteps('message', key)).toThrow(/Latin-1|16 bytes/);
  });
});
