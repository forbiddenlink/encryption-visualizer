/**
 * AES (Advanced Encryption Standard) Implementation
 * Implementation of AES-128 encryption for educational visualization
 * Based on FIPS 197 specification
 */

// S-Box lookup table (Rijndael S-box)
const S_BOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
];

// Round Constants for AES key expansion
const RCON = [
  0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36,
];

import type { AESStep } from '@/lib/types';
export type { AESStep };

/**
 * Convert a string to a 4x4 state matrix (COLUMN-MAJOR ORDER)
 * AES state is filled column by column
 */
export function stringToState(input: string): number[][] {
  const state: number[][] = [[], [], [], []];
  const paddedInput = input.padEnd(16, '\0');
  
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      state[row][col] = paddedInput.charCodeAt(col * 4 + row);
    }
  }
  
  return state;
}

export function stateToString(state: number[][]): string {
  let result = '';
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      result += String.fromCharCode(state[row][col]);
    }
  }
  return result;
}

export function stateToHex(state: number[][]): string[][] {
  return state.map(row => row.map(byte => byte.toString(16).padStart(2, '0').toUpperCase()));
}

export function subBytes(state: number[][]): number[][] {
  return state.map(row => row.map(byte => S_BOX[byte]));
}

/**
 * ShiftRows transformation
 * Row 0: no shift
 * Row 1: shift left by 1
 * Row 2: shift left by 2
 * Row 3: shift left by 3
 */
export function shiftRows(state: number[][]): number[][] {
  const newState: number[][] = [[], [], [], []];
  
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      newState[row][col] = state[row][(col + row) % 4];
    }
  }
  
  return newState;
}

/**
 * Galois Field (2^8) multiplication
 */
function gmul(a: number, b: number): number {
  let p = 0;
  let hiBitSet;
  
  for (let i = 0; i < 8; i++) {
    if (b & 1) {
      p ^= a;
    }
    hiBitSet = a & 0x80;
    a <<= 1;
    if (hiBitSet) {
      a ^= 0x1b; // AES irreducible polynomial x^8 + x^4 + x^3 + x + 1
    }
    b >>= 1;
  }
  
  return p;
}

/**
 * MixColumns transformation
 * Multiplies each column by the fixed MixColumns matrix
 */
export function mixColumns(state: number[][]): number[][] {
  const newState: number[][] = [[], [], [], []];
  
  for (let col = 0; col < 4; col++) {
    const s0 = state[0][col];
    const s1 = state[1][col];
    const s2 = state[2][col];
    const s3 = state[3][col];
    
    newState[0][col] = gmul(s0, 2) ^ gmul(s1, 3) ^ s2 ^ s3;
    newState[1][col] = s0 ^ gmul(s1, 2) ^ gmul(s2, 3) ^ s3;
    newState[2][col] = s0 ^ s1 ^ gmul(s2, 2) ^ gmul(s3, 3);
    newState[3][col] = gmul(s0, 3) ^ s1 ^ s2 ^ gmul(s3, 2);
  }
  
  return newState;
}

export function addRoundKey(state: number[][], roundKey: number[][]): number[][] {
  return state.map((row, i) => row.map((byte, j) => byte ^ roundKey[i][j]));
}

/**
 * AES-128 Key Expansion (Key Schedule)
 * Generates 11 round keys (44 words) from the initial 128-bit key
 */
export function generateRoundKeys(key: string): number[][][] {
  const paddedKey = key.padEnd(16, '\0');
  
  const w: number[][] = [];

  for (let i = 0; i < 4; i++) {
    w[i] = [
      paddedKey.charCodeAt(4 * i),
      paddedKey.charCodeAt(4 * i + 1),
      paddedKey.charCodeAt(4 * i + 2),
      paddedKey.charCodeAt(4 * i + 3),
    ];
  }
  
  // Generate remaining 40 words (total 44 words = 11 round keys)
  for (let i = 4; i < 44; i++) {
    let temp = [...w[i - 1]];
    
    if (i % 4 === 0) {
      // RotWord: Rotate left by 1 byte
      temp = [temp[1], temp[2], temp[3], temp[0]];
      
      // SubWord: Apply S-box to each byte
      temp = temp.map(byte => S_BOX[byte]);
      
      // XOR with round constant
      temp[0] ^= RCON[(i / 4) - 1];
    }
    
    // XOR with word 4 positions back
    w[i] = w[i - 4].map((byte, j) => byte ^ temp[j]);
  }
  
  const roundKeys: number[][][] = [];
  for (let round = 0; round < 11; round++) {
    const roundKey: number[][] = [[], [], [], []];
    for (let col = 0; col < 4; col++) {
      const word = w[round * 4 + col];
      for (let row = 0; row < 4; row++) {
        roundKey[row][col] = word[row];
      }
    }
    roundKeys.push(roundKey);
  }
  
  return roundKeys;
}

/**
 * Perform AES-128 encryption and return all steps for visualization
 */
export function encryptAESWithSteps(plaintext: string, key: string): AESStep[] {
  const steps: AESStep[] = [];
  let state = stringToState(plaintext);
  const roundKeys = generateRoundKeys(key);
  
  let stepNumber = 0;
  
  // Initial state
  steps.push({
    stepNumber: stepNumber++,
    type: 'initial',
    title: 'Initial Plaintext',
    description: 'The original plaintext converted to a 4×4 state matrix (column-major order). Each column represents 4 bytes of the input.',
    state: state.map(row => [...row]),
    roundNumber: 0,
  });
  
  // Initial AddRoundKey (Round 0)
  state = addRoundKey(state, roundKeys[0]);
  steps.push({
    stepNumber: stepNumber++,
    type: 'addRoundKey',
    title: 'Initial AddRoundKey (Round 0)',
    description: 'XOR each byte of the state with the corresponding byte of the initial round key. This is the only operation in Round 0.',
    state: state.map(row => [...row]),
    roundKey: roundKeys[0].map(row => [...row]),
    roundNumber: 0,
  });
  
  // Main rounds (1-9 for AES-128)
  for (let round = 1; round <= 9; round++) {
    // SubBytes
    state = subBytes(state);
    steps.push({
      stepNumber: stepNumber++,
      type: 'subBytes',
      title: `Round ${round}: SubBytes`,
      description: 'Non-linear substitution step. Each byte is replaced with another byte using the Rijndael S-box lookup table.',
      state: state.map(row => [...row]),
      roundNumber: round,
    });
    
    // ShiftRows
    state = shiftRows(state);
    steps.push({
      stepNumber: stepNumber++,
      type: 'shiftRows',
      title: `Round ${round}: ShiftRows`,
      description: 'Transposition step. Rows are cyclically shifted left: Row 0 by 0, Row 1 by 1, Row 2 by 2, Row 3 by 3 bytes.',
      state: state.map(row => [...row]),
      roundNumber: round,
    });
    
    // MixColumns
    state = mixColumns(state);
    steps.push({
      stepNumber: stepNumber++,
      type: 'mixColumns',
      title: `Round ${round}: MixColumns`,
      description: 'Mixing operation using Galois Field (GF(2⁸)) multiplication. Each column is multiplied by a fixed matrix.',
      state: state.map(row => [...row]),
      roundNumber: round,
    });
    
    // AddRoundKey
    state = addRoundKey(state, roundKeys[round]);
    steps.push({
      stepNumber: stepNumber++,
      type: 'addRoundKey',
      title: `Round ${round}: AddRoundKey`,
      description: `XOR the state with round key ${round} derived from the key schedule.`,
      state: state.map(row => [...row]),
      roundKey: roundKeys[round].map(row => [...row]),
      roundNumber: round,
    });
  }
  
  // Final round (Round 10) - NO MixColumns
  state = subBytes(state);
  steps.push({
    stepNumber: stepNumber++,
    type: 'subBytes',
    title: 'Round 10: SubBytes (Final Round)',
    description: 'Final SubBytes transformation. The last round omits MixColumns.',
    state: state.map(row => [...row]),
    roundNumber: 10,
  });
  
  state = shiftRows(state);
  steps.push({
    stepNumber: stepNumber++,
    type: 'shiftRows',
    title: 'Round 10: ShiftRows (Final Round)',
    description: 'Final ShiftRows transformation.',
    state: state.map(row => [...row]),
    roundNumber: 10,
  });
  
  state = addRoundKey(state, roundKeys[10]);
  steps.push({
    stepNumber: stepNumber,
    type: 'final',
    title: 'Final Ciphertext',
    description: 'XOR with the final round key (Round 10) to produce the encrypted ciphertext. Encryption complete!',
    state: state.map(row => [...row]),
    roundKey: roundKeys[10].map(row => [...row]),
    roundNumber: 10,
  });
  
  return steps;
}
