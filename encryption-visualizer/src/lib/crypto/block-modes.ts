/**
 * Block Cipher Modes Implementation
 * Educational visualization of ECB, CBC, and GCM modes
 * Uses simplified XOR-based "encryption" for visualization clarity
 */

import type { BlockModeStep } from '@/lib/types';
import { hmac } from './hmac';

// Block size in bytes (simulating 128-bit blocks like AES)
const BLOCK_SIZE = 16;
export const MAX_VISUALIZATION_BYTES = 1024;

function byteString(text: string): string {
  return Array.from(new TextEncoder().encode(text), (byte) => String.fromCharCode(byte)).join('');
}

export function validateBlockModeInput(plaintext: string, key: string): void {
  if (new TextEncoder().encode(plaintext).length > MAX_VISUALIZATION_BYTES) {
    throw new Error(`Message must be at most ${MAX_VISUALIZATION_BYTES} UTF-8 bytes for this visualization`);
  }
  const keyLength = new TextEncoder().encode(key).length;
  if (keyLength < 1 || keyLength > BLOCK_SIZE) {
    throw new Error('Key must contain 1 to 16 UTF-8 bytes; shorter keys are zero-padded');
  }
}

/**
 * Simple XOR-based block encryption for visualization
 * NOT cryptographically secure - for educational purposes only
 */
function simpleBlockEncrypt(block: string, key: string): string {
  const keyBytes = byteString(key).padEnd(BLOCK_SIZE, '\0');
  let result = '';
  for (let i = 0; i < block.length; i++) {
    const encrypted = block.charCodeAt(i) ^ keyBytes.charCodeAt(i % keyBytes.length);
    result += encrypted.toString(16).padStart(2, '0');
  }
  return result;
}

/**
 * XOR two hex strings
 */
function xorHexStrings(a: string, b: string): string {
  const aBytes = hexToBytes(a);
  const bBytes = hexToBytes(b);
  let result = '';
  for (let i = 0; i < aBytes.length; i++) {
    const xored = (aBytes[i] || 0) ^ (bBytes[i] || 0);
    result += xored.toString(16).padStart(2, '0');
  }
  return result;
}

/**
 * Convert hex string to byte array
 */
function hexToBytes(hex: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16) || 0);
  }
  return bytes;
}

/**
 * Convert string to hex
 */
function stringToHex(str: string): string {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Pad plaintext to block size (PKCS7 padding)
 */
function padToBlockSize(plaintext: string): string {
  const padding = BLOCK_SIZE - (plaintext.length % BLOCK_SIZE);
  return plaintext + String.fromCharCode(padding).repeat(padding);
}

/**
 * Split plaintext into blocks
 */
function splitIntoBlocks(plaintext: string, needsPadding = true): string[] {
  const bytes = byteString(plaintext);
  const padded = needsPadding ? padToBlockSize(bytes) : bytes;
  const blocks: string[] = [];
  for (let i = 0; i < padded.length; i += BLOCK_SIZE) {
    blocks.push(padded.slice(i, i + BLOCK_SIZE));
  }
  return blocks;
}

/**
 * Generate a random IV (for visualization, uses predictable values)
 */
function generateIV(): string {
  // Use a fixed IV for reproducible visualization
  return 'a1b2c3d4e5f67890a1b2c3d4e5f67890';
}

/**
 * ECB Mode Encryption with Steps
 * Each block encrypted independently (parallel, reveals patterns)
 */
export function encryptECBWithSteps(plaintext: string, key: string): BlockModeStep[] {
  validateBlockModeInput(plaintext, key);
  const steps: BlockModeStep[] = [];
  let stepNumber = 0;

  // Input step
  steps.push({
    type: 'input',
    mode: 'ecb',
    stepNumber: stepNumber++,
    title: 'Input Plaintext',
    description: 'The original message to encrypt. ECB mode will encrypt each 16-byte block independently.',
    values: {
      plaintext: plaintext,
      plaintextHex: stringToHex(byteString(plaintext)),
    },
  });

  // Split into blocks
  const blocks = splitIntoBlocks(plaintext);
  steps.push({
    type: 'split-blocks',
    mode: 'ecb',
    stepNumber: stepNumber++,
    title: 'Split into Blocks',
    description: `Divide plaintext into ${blocks.length} blocks of ${BLOCK_SIZE} bytes each. PKCS7 padding added if needed.`,
    blocks: blocks.map(b => stringToHex(b)),
    values: {
      blockCount: blocks.length,
      blockSize: BLOCK_SIZE,
    },
  });

  // Encrypt each block independently
  const encryptedBlocks: string[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const encrypted = simpleBlockEncrypt(blocks[i], key);
    encryptedBlocks.push(encrypted);

    steps.push({
      type: 'encrypt-block',
      mode: 'ecb',
      stepNumber: stepNumber++,
      title: `Encrypt Block ${i + 1}`,
      description: `Block ${i + 1} is encrypted directly with the key. No dependency on other blocks - can be parallelized.`,
      blocks: [...encryptedBlocks, ...blocks.slice(i + 1).map(b => stringToHex(b))],
      currentBlock: i,
      values: {
        inputBlock: stringToHex(blocks[i]),
        outputBlock: encrypted,
      },
    });
  }

  // Final output
  const ciphertext = encryptedBlocks.join('');
  steps.push({
    type: 'output',
    mode: 'ecb',
    stepNumber: stepNumber,
    title: 'ECB Ciphertext',
    description: 'Final encrypted output. WARNING: Identical plaintext blocks produce identical ciphertext blocks, revealing patterns!',
    blocks: encryptedBlocks,
    values: {
      ciphertext: ciphertext,
      blockCount: encryptedBlocks.length,
    },
  });

  return steps;
}

/**
 * CBC Mode Encryption with Steps
 * Each block XORed with previous ciphertext before encryption
 */
export function encryptCBCWithSteps(plaintext: string, key: string): BlockModeStep[] {
  validateBlockModeInput(plaintext, key);
  const steps: BlockModeStep[] = [];
  let stepNumber = 0;
  const iv = generateIV();

  // Input step
  steps.push({
    type: 'input',
    mode: 'cbc',
    stepNumber: stepNumber++,
    title: 'Input Plaintext',
    description: 'The original message to encrypt. CBC mode chains blocks together using XOR.',
    iv: iv,
    values: {
      plaintext: plaintext,
      plaintextHex: stringToHex(byteString(plaintext)),
    },
  });

  // Split into blocks
  const blocks = splitIntoBlocks(plaintext);
  steps.push({
    type: 'split-blocks',
    mode: 'cbc',
    stepNumber: stepNumber++,
    title: 'Split into Blocks + IV',
    description: `Divide plaintext into ${blocks.length} blocks. Use the fixed demonstration IV for first block XOR.`,
    blocks: blocks.map(b => stringToHex(b)),
    iv: iv,
    values: {
      blockCount: blocks.length,
      iv: iv,
    },
  });

  // Encrypt each block with chaining
  const encryptedBlocks: string[] = [];
  let previousCiphertext = iv;

  for (let i = 0; i < blocks.length; i++) {
    const blockHex = stringToHex(blocks[i]);

    // XOR with previous ciphertext (or IV for first block)
    const xored = xorHexStrings(blockHex, previousCiphertext);
    steps.push({
      type: 'xor-operation',
      mode: 'cbc',
      stepNumber: stepNumber++,
      title: `XOR Block ${i + 1}`,
      description: i === 0
        ? 'XOR first plaintext block with the IV (Initialization Vector).'
        : `XOR plaintext block ${i + 1} with the previous ciphertext block. This creates the "chain".`,
      blocks: encryptedBlocks,
      currentBlock: i,
      iv: iv,
      previousCiphertext: previousCiphertext,
      values: {
        plainBlock: blockHex,
        xorWith: previousCiphertext,
        result: xored,
      },
    });

    // Encrypt the XORed result
    // For CBC visualization, we simulate encrypting the XORed value
    const encrypted = simpleBlockEncrypt(
      String.fromCharCode(...hexToBytes(xored)),
      key
    );
    encryptedBlocks.push(encrypted);
    previousCiphertext = encrypted;

    steps.push({
      type: 'encrypt-block',
      mode: 'cbc',
      stepNumber: stepNumber++,
      title: `Encrypt Block ${i + 1}`,
      description: `Encrypt the XORed result. Output becomes the "previous ciphertext" for the next block.`,
      blocks: [...encryptedBlocks, ...blocks.slice(i + 1).map(b => stringToHex(b))],
      currentBlock: i,
      iv: iv,
      previousCiphertext: encrypted,
      values: {
        inputBlock: xored,
        outputBlock: encrypted,
      },
    });
  }

  // Final output
  const ciphertext = encryptedBlocks.join('');
  steps.push({
    type: 'output',
    mode: 'cbc',
    stepNumber: stepNumber,
    title: 'CBC Ciphertext',
    description: 'Final encrypted output. IV must be stored/transmitted with ciphertext. This XOR-only simulation can repeat ciphertext blocks; real CBC requires a secure block cipher and an unpredictable IV.',
    blocks: encryptedBlocks,
    iv: iv,
    values: {
      ciphertext: ciphertext,
      iv: iv,
      blockCount: encryptedBlocks.length,
    },
  });

  return steps;
}

/**
 * GCM Mode Encryption with Steps
 * Counter mode with authentication tag
 */
export function encryptGCMWithSteps(plaintext: string, key: string): BlockModeStep[] {
  validateBlockModeInput(plaintext, key);
  const steps: BlockModeStep[] = [];
  let stepNumber = 0;
  const iv = generateIV().slice(0, 24); // GCM typically uses 96-bit (12-byte) IV
  let counter = 1;

  // Input step
  steps.push({
    type: 'input',
    mode: 'gcm',
    stepNumber: stepNumber++,
    title: 'Input Plaintext',
    description: 'This toy counter-mode simulation illustrates GCM structure using XOR encryption and a keyed FNV-1a tag, not AES-GCM.',
    iv: iv,
    values: {
      plaintext: plaintext,
      plaintextHex: stringToHex(byteString(plaintext)),
    },
  });

  // Split into blocks
  const blocks = splitIntoBlocks(plaintext, false);
  steps.push({
    type: 'split-blocks',
    mode: 'gcm',
    stepNumber: stepNumber++,
    title: 'Split + Initialize Counter',
    description: `Divide plaintext into ${blocks.length} blocks. Initialize counter (nonce + counter value) for CTR mode.`,
    blocks: blocks.map(b => stringToHex(b)),
    iv: iv,
    counter: counter,
    values: {
      blockCount: blocks.length,
      iv: iv,
      initialCounter: counter,
    },
  });

  // Encrypt each block with counter mode
  const encryptedBlocks: string[] = [];
  let ghashInput = '';

  for (let i = 0; i < blocks.length; i++) {
    const blockHex = stringToHex(blocks[i]);

    // Generate keystream from counter
    const counterHex = iv + counter.toString(16).padStart(8, '0');
    const keystream = simpleBlockEncrypt(
      String.fromCharCode(...hexToBytes(counterHex.padEnd(32, '0'))),
      key
    );

    steps.push({
      type: 'encrypt-block',
      mode: 'gcm',
      stepNumber: stepNumber++,
      title: `Encrypt Counter ${counter}`,
      description: `Encrypt the counter block (IV + counter ${counter}) to generate keystream.`,
      blocks: encryptedBlocks,
      currentBlock: i,
      iv: iv,
      counter: counter,
      values: {
        counterBlock: counterHex,
        keystream: keystream,
      },
    });

    // XOR plaintext with keystream
    const encrypted = xorHexStrings(blockHex, keystream);
    encryptedBlocks.push(encrypted);
    ghashInput += encrypted;

    steps.push({
      type: 'xor-operation',
      mode: 'gcm',
      stepNumber: stepNumber++,
      title: `XOR Block ${i + 1}`,
      description: 'XOR plaintext block with keystream to produce ciphertext. Counter mode allows parallel encryption!',
      blocks: [...encryptedBlocks, ...blocks.slice(i + 1).map(b => stringToHex(b))],
      currentBlock: i,
      counter: counter,
      values: {
        plainBlock: blockHex,
        keystream: keystream,
        cipherBlock: encrypted,
      },
    });

    counter++;
  }

  // Generate authentication tag (simplified GHASH simulation)
  const authTag = hmac(key, `${iv}:${ghashInput}:${new TextEncoder().encode(plaintext).length}`);

  // Final output with auth tag
  const ciphertext = encryptedBlocks.join('');
  steps.push({
    type: 'output',
    mode: 'gcm',
    stepNumber: stepNumber,
    title: 'GCM Ciphertext + Auth Tag',
    description: 'Final output includes ciphertext AND authentication tag. The toy tag includes the full ciphertext, nonce, and length; collisions remain possible and it does not provide cryptographic integrity.',
    blocks: encryptedBlocks,
    iv: iv,
    authTag: authTag,
    values: {
      ciphertext: ciphertext,
      iv: iv,
      authTag: authTag,
      blockCount: encryptedBlocks.length,
    },
  });

  return steps;
}

/**
 * Demonstrate ECB pattern problem (penguin problem)
 * Returns visual data showing how patterns are preserved
 */
export function demonstrateECBPatternProblem(pattern: string, repetitions: number, key: string): {
  plaintext: string;
  ecbCiphertext: string[];
  cbcCiphertext: string[];
  patternVisible: boolean;
} {
  if (!Number.isInteger(repetitions) || repetitions < 0 || new TextEncoder().encode(pattern).length * repetitions > MAX_VISUALIZATION_BYTES) {
    throw new Error(`Repeated pattern must fit within ${MAX_VISUALIZATION_BYTES} UTF-8 bytes`);
  }
  // Create repeated pattern
  const plaintext = pattern.repeat(repetitions);
  validateBlockModeInput(plaintext, key);
  const blocks = splitIntoBlocks(plaintext);

  // ECB encryption (patterns preserved)
  const ecbCiphertext = blocks.map(block => simpleBlockEncrypt(block, key));

  // CBC encryption (patterns hidden)
  let previousCiphertext = generateIV();
  const cbcCiphertext = blocks.map(block => {
    const blockHex = stringToHex(block);
    const xored = xorHexStrings(blockHex, previousCiphertext);
    const encrypted = simpleBlockEncrypt(
      String.fromCharCode(...hexToBytes(xored)),
      key
    );
    previousCiphertext = encrypted;
    return encrypted;
  });

  // Check if ECB shows patterns (identical blocks = identical ciphertext)
  const uniqueECB = new Set(ecbCiphertext).size;
  const patternVisible = uniqueECB < ecbCiphertext.length;

  return {
    plaintext,
    ecbCiphertext,
    cbcCiphertext,
    patternVisible,
  };
}

export { BLOCK_SIZE };
