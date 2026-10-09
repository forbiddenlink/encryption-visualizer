/**
 * Digital Signatures Implementation for Educational Visualization
 *
 * IMPORTANT SECURITY NOTICE:
 * This is an EDUCATIONAL implementation only. DO NOT use in production.
 * - Uses simplified hash function (FNV-1a) for visualization
 * - Uses small key sizes for demonstration clarity
 * - Production systems must use cryptographic libraries with SHA-256+ and 2048+ bit keys
 *
 * Implements digital signature creation and verification with visualization steps.
 */

import type { SignatureStep, RSAKeyPair } from '../types/index.js';
import { modPow } from './rsa.js';
import { simpleHash } from './hash.js';

export function parseSignature(input: string, modulus: number): number | null {
  const text = input.trim();
  if (!/^\d+$/.test(text)) return null;
  const signature = Number(text);
  return Number.isSafeInteger(signature) && signature >= 0 && signature < modulus ? signature : null;
}

function validSignature(signature: number, publicKey: { n: number; e: number }): boolean {
  return Number.isSafeInteger(signature) && signature >= 0 && signature < publicKey.n;
}

/**
 * Convert a hex hash string to a number for signing
 * Uses only part of the hash to keep numbers manageable for visualization
 */
function hashToNumber(hash: string, maxValue: number): number {
  // Take first 4 hex characters and convert to number
  const truncatedHash = hash.slice(0, 4);
  const num = parseInt(truncatedHash, 16);
  // Ensure the number is less than n (modulus)
  return num % maxValue;
}

/**
 * Sign a message with visualization steps
 *
 * Digital signatures work by:
 * 1. Hashing the message to create a fixed-size digest
 * 2. Encrypting the hash with the PRIVATE key (this is the signature)
 *
 * Anyone can verify by:
 * 1. Decrypting the signature with the PUBLIC key to get the hash
 * 2. Hashing the original message
 * 3. Comparing the two hashes
 */
export function signMessageWithSteps(
  message: string,
  keyPair: RSAKeyPair
): { signature: number; steps: SignatureStep[] } {
  const steps: SignatureStep[] = [];
  let stepNumber = 0;

  // Step 1: Message input
  steps.push({
    stepNumber: stepNumber++,
    type: 'message-input',
    title: 'Input Message',
    description: `The message to sign: "${message.length > 50 ? message.slice(0, 50) + '...' : message}"`,
    values: {
      message,
    },
  });

  // Step 2: Hash the message
  const messageHash = simpleHash(message);
  steps.push({
    stepNumber: stepNumber++,
    type: 'hash-generation',
    title: 'Generate Message Hash',
    description: `Hash the UTF-8 message using the simplified FNV-1a function. This creates a fixed-size "fingerprint" of the message. Hash = ${messageHash}`,
    values: {
      message,
      messageHash,
    },
    formula: 'H = hash(message)',
  });

  // Step 3: Convert hash to number and sign with private key
  const hashNum = hashToNumber(messageHash, keyPair.publicKey.n);
  const signature = modPow(hashNum, keyPair.privateKey.d, keyPair.privateKey.n);

  steps.push({
    stepNumber: stepNumber++,
    type: 'sign-hash',
    title: 'Sign the Hash',
    description: `Encrypt the hash using your PRIVATE key. This is the opposite of normal RSA encryption! Only the private key holder can create this signature.`,
    values: {
      messageHash,
      signature,
      d: keyPair.privateKey.d,
      n: keyPair.privateKey.n,
    },
    formula: 'S = H^d mod n',
    calculation: `${hashNum}^${keyPair.privateKey.d} mod ${keyPair.privateKey.n} = ${signature}`,
  });

  // Step 4: Signature complete
  steps.push({
    stepNumber: stepNumber,
    type: 'signature-complete',
    title: 'Signature Created!',
    description: `Your digital signature is: ${signature}. Send this along with your message. The public key checks this toy signature; collisions can make different messages verify.`,
    values: {
      message,
      messageHash,
      signature,
    },
  });

  return { signature, steps };
}

/**
 * Verify a signature with visualization steps
 */
export function verifySignatureWithSteps(
  message: string,
  signature: number,
  publicKey: { n: number; e: number }
): { isValid: boolean; steps: SignatureStep[] } {
  if (!validSignature(signature, publicKey)) {
    return {
      isValid: false,
      steps: [{
        stepNumber: 0,
        type: 'verify-result',
        title: 'Invalid Signature Input',
        description: `The signature must be a whole number from 0 to ${publicKey.n - 1}.`,
        values: { isValid: false },
      }],
    };
  }
  const steps: SignatureStep[] = [];
  let stepNumber = 0;

  // Step 1: Verify inputs
  steps.push({
    stepNumber: stepNumber++,
    type: 'verify-input',
    title: 'Verification Inputs',
    description: `Received message: "${message.length > 50 ? message.slice(0, 50) + '...' : message}" with signature: ${signature}. Let's verify it came from the claimed sender.`,
    values: {
      message,
      signature,
      e: publicKey.e,
      n: publicKey.n,
    },
  });

  // Step 2: Hash the received message
  const messageHash = simpleHash(message);
  const expectedHashNum = hashToNumber(messageHash, publicKey.n);

  steps.push({
    stepNumber: stepNumber++,
    type: 'verify-hash',
    title: 'Hash the Message',
    description: `Hash the received message using the same hash function. This gives us the expected hash value: ${messageHash}`,
    values: {
      message,
      messageHash,
    },
    formula: 'H_expected = hash(message)',
  });

  // Step 3: Decrypt the signature with public key
  const decryptedHashNum = modPow(signature, publicKey.e, publicKey.n);

  steps.push({
    stepNumber: stepNumber++,
    type: 'decrypt-signature',
    title: 'Decrypt Signature',
    description: `Use the sender's PUBLIC key to decrypt the signature. This reveals the hash that was originally signed.`,
    values: {
      signature,
      decryptedHash: decryptedHashNum.toString(16),
      e: publicKey.e,
      n: publicKey.n,
    },
    formula: 'H_decrypted = S^e mod n',
    calculation: `${signature}^${publicKey.e} mod ${publicKey.n} = ${decryptedHashNum}`,
  });

  // Step 4: Compare hashes
  const isValid = decryptedHashNum === expectedHashNum;

  steps.push({
    stepNumber: stepNumber++,
    type: 'compare-hashes',
    title: 'Compare Hashes',
    description: `Compare the decrypted hash (${decryptedHashNum}) with the calculated hash (${expectedHashNum}).`,
    values: {
      messageHash,
      decryptedHash: decryptedHashNum.toString(16),
      isValid,
    },
    formula: 'H_decrypted == H_expected ?',
    calculation: `${decryptedHashNum} ${isValid ? '==' : '!='} ${expectedHashNum}`,
  });

  // Step 5: Final result
  steps.push({
    stepNumber: stepNumber,
    type: 'verify-result',
    title: isValid ? 'Signature Valid!' : 'Signature Invalid!',
    description: isValid
      ? 'The truncated toy hashes match. This illustrates verification, but small RSA keys and FNV-1a collisions prevent it from proving authenticity or integrity.'
      : 'The hashes do NOT match! Either the message was altered, or it was not signed by the claimed sender.',
    values: {
      isValid,
    },
  });

  return { isValid, steps };
}

/**
 * Simple sign function without steps (for quick operations)
 */
export function signMessage(message: string, privateKey: { n: number; d: number }): number {
  const messageHash = simpleHash(message);
  const hashNum = hashToNumber(messageHash, privateKey.n);
  return modPow(hashNum, privateKey.d, privateKey.n);
}

/**
 * Simple verify function without steps (for quick operations)
 */
export function verifySignature(
  message: string,
  signature: number,
  publicKey: { n: number; e: number }
): boolean {
  if (!validSignature(signature, publicKey)) return false;
  const messageHash = simpleHash(message);
  const expectedHashNum = hashToNumber(messageHash, publicKey.n);
  const decryptedHashNum = modPow(signature, publicKey.e, publicKey.n);
  return decryptedHashNum === expectedHashNum;
}
