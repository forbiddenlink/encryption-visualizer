/**
 * HMAC (Hash-based Message Authentication Code) Implementation
 * Educational visualization of HMAC construction
 *
 * IMPORTANT: Uses simplified FNV-1a hash for visualization clarity.
 * Real-world HMAC uses SHA-256 or similar via Web Crypto API.
 *
 * HMAC(key, message) = Hash((key XOR opad) || Hash((key XOR ipad) || message))
 * ipad = 0x36 repeated, opad = 0x5c repeated
 */

import { simpleHash } from './hash';
import type { HMACStep } from '@/lib/types/hmac';

export type { HMACStep };

const BLOCK_SIZE = 16; // Simplified block size for visualization

/**
 * Pad or truncate key to block size
 */
function normalizeKey(key: string): string {
  if (key.length > BLOCK_SIZE) {
    // If key is longer than block size, hash it first
    return simpleHash(key).padEnd(BLOCK_SIZE, '\0');
  }
  return key.padEnd(BLOCK_SIZE, '\0');
}

/**
 * XOR a string with a repeated byte value
 */
function xorWithByte(str: string, byte: number): string {
  return Array.from(str)
    .map((ch) => String.fromCharCode(ch.charCodeAt(0) ^ byte))
    .join('');
}

/**
 * Convert string to hex representation
 */
function stringToHex(str: string): string {
  return Array.from(str)
    .map((ch) => ch.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Compute HMAC using the simplified hash function
 */
export function hmac(key: string, message: string): string {
  const normalizedKey = normalizeKey(key);
  const innerKey = xorWithByte(normalizedKey, 0x36); // key XOR ipad
  const outerKey = xorWithByte(normalizedKey, 0x5c); // key XOR opad

  const innerHash = simpleHash(innerKey + message);
  const finalHash = simpleHash(outerKey + innerHash);

  return finalHash;
}

/**
 * Demonstrate why Hash(key || message) is NOT secure (length extension vulnerability)
 */
export function demonstrateLengthExtension(key: string, message: string): {
  naiveHash: string;
  hmacHash: string;
  extendedMessage: string;
  extendedNaiveHash: string;
  extendedHmacHash: string;
  naiveCollides: boolean;
} {
  const naiveHash = simpleHash(key + message);
  const hmacHash = hmac(key, message);

  // Simulate length extension: attacker appends data without knowing key
  const extendedMessage = message + '&admin=true';
  const extendedNaiveHash = simpleHash(key + extendedMessage);
  const extendedHmacHash = hmac(key, extendedMessage);

  return {
    naiveHash,
    hmacHash,
    extendedMessage,
    extendedNaiveHash,
    extendedHmacHash,
    // In a real length extension attack, the attacker can forge the naive hash
    // without knowing the key. This simplified demo shows the concept.
    naiveCollides: false,
  };
}

/**
 * Verify an HMAC value
 */
export function verifyHmac(key: string, message: string, expectedHmac: string): boolean {
  const computed = hmac(key, message);
  return computed === expectedHmac;
}

/**
 * Compute HMAC with detailed steps for visualization
 */
export function hmacWithSteps(key: string, message: string): HMACStep[] {
  const steps: HMACStep[] = [];
  let stepNumber = 0;

  // Step 1: Input
  steps.push({
    stepNumber: stepNumber++,
    type: 'input',
    title: 'HMAC Inputs',
    description: `HMAC takes two inputs: a secret key and a message. The key authenticates the sender, while the message is the data to protect.`,
    values: {
      key,
      message,
      keyLength: `${key.length} bytes`,
      messageLength: `${message.length} bytes`,
    },
  });

  // Step 2: Key padding
  const normalizedKey = normalizeKey(key);
  const keyWasTruncated = key.length > BLOCK_SIZE;
  steps.push({
    stepNumber: stepNumber++,
    type: 'key-padding',
    title: 'Normalize Key',
    description: keyWasTruncated
      ? `Key is longer than block size (${BLOCK_SIZE} bytes), so it is hashed first, then padded with zeros to fill the block.`
      : `Key is padded with zeros to match the block size of ${BLOCK_SIZE} bytes.`,
    values: {
      originalKey: key,
      originalKeyHex: stringToHex(key),
      normalizedKeyHex: stringToHex(normalizedKey),
      blockSize: `${BLOCK_SIZE} bytes`,
      action: keyWasTruncated ? 'Hashed then padded' : 'Zero-padded',
    },
  });

  // Step 3: Inner key (key XOR ipad)
  const innerKey = xorWithByte(normalizedKey, 0x36);
  steps.push({
    stepNumber: stepNumber++,
    type: 'inner-hash',
    title: 'Create Inner Key (Key XOR ipad)',
    description: 'XOR the padded key with ipad (0x36 repeated). The ipad value 0x36 was chosen to create maximum bit diffusion.',
    values: {
      normalizedKeyHex: stringToHex(normalizedKey),
      ipad: '0x36 (repeated)',
      innerKeyHex: stringToHex(innerKey),
    },
  });

  // Step 4: Inner hash
  const innerInput = innerKey + message;
  const innerHash = simpleHash(innerInput);
  steps.push({
    stepNumber: stepNumber++,
    type: 'inner-hash',
    title: 'Compute Inner Hash',
    description: 'Hash the concatenation of the inner key and the message. This is the first pass of the two-pass HMAC construction.',
    values: {
      operation: 'Hash(innerKey || message)',
      innerKeyHex: stringToHex(innerKey).slice(0, 32) + '...',
      message,
      innerHash,
    },
  });

  // Step 5: Outer key (key XOR opad)
  const outerKey = xorWithByte(normalizedKey, 0x5c);
  steps.push({
    stepNumber: stepNumber++,
    type: 'outer-hash',
    title: 'Create Outer Key (Key XOR opad)',
    description: 'XOR the padded key with opad (0x5c repeated). Using different padding constants for inner and outer passes prevents related-key attacks.',
    values: {
      normalizedKeyHex: stringToHex(normalizedKey),
      opad: '0x5c (repeated)',
      outerKeyHex: stringToHex(outerKey),
    },
  });

  // Step 6: Outer hash (final HMAC)
  const finalHash = simpleHash(outerKey + innerHash);
  steps.push({
    stepNumber: stepNumber++,
    type: 'outer-hash',
    title: 'Compute Outer Hash (Final HMAC)',
    description: 'Hash the concatenation of the outer key and the inner hash. This second pass completes the HMAC and provides protection against length extension attacks.',
    values: {
      operation: 'Hash(outerKey || innerHash)',
      outerKeyHex: stringToHex(outerKey).slice(0, 32) + '...',
      innerHash,
      finalHmac: finalHash,
    },
  });

  // Step 7: Output
  steps.push({
    stepNumber: stepNumber++,
    type: 'output',
    title: 'HMAC Output',
    description: `The final HMAC value: ${finalHash}. This tag can be sent alongside the message. The recipient, who also knows the secret key, can recompute the HMAC and verify it matches.`,
    values: {
      hmac: finalHash,
      formula: 'HMAC(K, m) = H((K XOR opad) || H((K XOR ipad) || m))',
      key,
      message,
    },
  });

  // Step 8: Verification demo
  const isValid = verifyHmac(key, message, finalHash);
  steps.push({
    stepNumber: stepNumber,
    type: 'verify',
    title: 'Verification',
    description: 'The recipient recomputes the HMAC with the shared secret key and compares it to the received tag. If they match, the message is authentic and unmodified.',
    values: {
      receivedHmac: finalHash,
      computedHmac: finalHash,
      match: isValid ? 'YES - Message is authentic' : 'NO - Message was tampered with',
    },
  });

  return steps;
}
