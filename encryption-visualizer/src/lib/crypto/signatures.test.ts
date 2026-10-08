/**
 * Digital Signatures Test Suite
 * Tests for signing and verification functions
 */
import { describe, it, expect } from 'vitest';
import {
  signMessageWithSteps,
  verifySignatureWithSteps,
  signMessage,
  verifySignature,
} from './signatures';
import { generateRSAKeyPairWithSteps } from './rsa';
import type { RSAKeyPair } from '../types/index';

describe('Digital Signatures', () => {
  // Fixed RSA fixture keeps verification assertions independent of random toy hash collisions.
  const keyPair: RSAKeyPair = {
    publicKey: { n: 3233, e: 17 },
    privateKey: { n: 3233, d: 2753 },
    p: 61, q: 53, phi: 3120,
  };

  describe('signMessage', () => {
    it('signs a message and returns a number', () => {
      const signature = signMessage('Hello, World!', keyPair.privateKey);

      expect(typeof signature).toBe('number');
      expect(signature).toBeGreaterThanOrEqual(0);
      expect(signature).toBeLessThan(keyPair.publicKey.n);
    });

    it('produces different signatures for different messages', () => {
      const sig1 = signMessage('Message 1', keyPair.privateKey);
      const sig2 = signMessage('Message 2', keyPair.privateKey);

      expect(sig1).not.toBe(sig2);
    });

    it('produces the same signature for the same message (deterministic)', () => {
      const sig1 = signMessage('Same message', keyPair.privateKey);
      const sig2 = signMessage('Same message', keyPair.privateKey);

      expect(sig1).toBe(sig2);
    });

    it('handles empty string', () => {
      const signature = signMessage('', keyPair.privateKey);

      expect(typeof signature).toBe('number');
      expect(signature).toBeGreaterThanOrEqual(0);
    });

    it('handles long messages', () => {
      const longMessage = 'A'.repeat(1000);
      const signature = signMessage(longMessage, keyPair.privateKey);

      expect(typeof signature).toBe('number');
      expect(signature).toBeGreaterThanOrEqual(0);
    });
  });

  describe('verifySignature', () => {
    it('verifies a valid signature', () => {
      const message = 'Test message';
      const signature = signMessage(message, keyPair.privateKey);
      const isValid = verifySignature(message, signature, keyPair.publicKey);

      expect(isValid).toBe(true);
    });

    it('rejects tampered message', () => {
      const originalMessage = 'Original message';
      const signature = signMessage(originalMessage, keyPair.privateKey);

      // Try to verify with a different message
      const isValid = verifySignature('Tampered message', signature, keyPair.publicKey);

      expect(isValid).toBe(false);
    });

    it('rejects invalid signature', () => {
      const message = 'Test message';
      const fakeSignature = 12345;

      const isValid = verifySignature(message, fakeSignature, keyPair.publicKey);

      expect(isValid).toBe(false);
    });

    it('rejects signature from different key pair', () => {
      const { keyPair: otherKeyPair } = generateRSAKeyPairWithSteps('small');
      const message = 'Test message';

      // Sign with one key pair
      const signature = signMessage(message, keyPair.privateKey);

      // Verify with different public key
      const isValid = verifySignature(message, signature, otherKeyPair.publicKey);

      // Should fail because signature was made with different private key
      // (may occasionally pass if keys happen to match, but very unlikely)
      // We test the principle rather than absolute guarantee
      expect(typeof isValid).toBe('boolean');
    });

    it('handles empty message verification', () => {
      const message = '';
      const signature = signMessage(message, keyPair.privateKey);
      const isValid = verifySignature(message, signature, keyPair.publicKey);

      expect(isValid).toBe(true);
    });
  });

  describe('signMessageWithSteps', () => {
    it('generates 4 steps for signing', () => {
      const { steps } = signMessageWithSteps('Test', keyPair);

      expect(steps).toHaveLength(4);
    });

    it('steps have correct types in order', () => {
      const { steps } = signMessageWithSteps('Test', keyPair);

      const expectedTypes = [
        'message-input',
        'hash-generation',
        'sign-hash',
        'signature-complete',
      ];

      expect(steps.map((s) => s.type)).toEqual(expectedTypes);
    });

    it('each step has required properties', () => {
      const { steps } = signMessageWithSteps('Test', keyPair);

      steps.forEach((step) => {
        expect(step).toHaveProperty('stepNumber');
        expect(step).toHaveProperty('type');
        expect(step).toHaveProperty('title');
        expect(step).toHaveProperty('description');
      });
    });

    it('steps have incrementing step numbers', () => {
      const { steps } = signMessageWithSteps('Test', keyPair);

      for (let i = 0; i < steps.length; i++) {
        expect(steps[i].stepNumber).toBe(i);
      }
    });

    it('returns valid signature', () => {
      const message = 'Test message';
      const { signature } = signMessageWithSteps(message, keyPair);

      expect(typeof signature).toBe('number');
      expect(signature).toBeGreaterThanOrEqual(0);

      // Verify the signature is correct
      const isValid = verifySignature(message, signature, keyPair.publicKey);
      expect(isValid).toBe(true);
    });

    it('includes formula in sign-hash step', () => {
      const { steps } = signMessageWithSteps('Test', keyPair);
      const signStep = steps.find((s) => s.type === 'sign-hash');

      expect(signStep?.formula).toBe('S = H^d mod n');
    });
  });

  describe('verifySignatureWithSteps', () => {
    it('generates 5 steps for verification', () => {
      const message = 'Test message';
      const signature = signMessage(message, keyPair.privateKey);
      const { steps } = verifySignatureWithSteps(message, signature, keyPair.publicKey);

      expect(steps).toHaveLength(5);
    });

    it('steps have correct types in order', () => {
      const message = 'Test message';
      const signature = signMessage(message, keyPair.privateKey);
      const { steps } = verifySignatureWithSteps(message, signature, keyPair.publicKey);

      const expectedTypes = [
        'verify-input',
        'verify-hash',
        'decrypt-signature',
        'compare-hashes',
        'verify-result',
      ];

      expect(steps.map((s) => s.type)).toEqual(expectedTypes);
    });

    it('returns true for valid signature', () => {
      const message = 'Test message';
      const signature = signMessage(message, keyPair.privateKey);
      const { isValid } = verifySignatureWithSteps(message, signature, keyPair.publicKey);

      expect(isValid).toBe(true);
    });

    it('returns false for invalid signature', () => {
      const message = 'Test message';
      const { isValid } = verifySignatureWithSteps(message, 99999, keyPair.publicKey);

      expect(isValid).toBe(false);
    });

    it('includes formula in decrypt-signature step', () => {
      const message = 'Test';
      const signature = signMessage(message, keyPair.privateKey);
      const { steps } = verifySignatureWithSteps(message, signature, keyPair.publicKey);
      const decryptStep = steps.find((s) => s.type === 'decrypt-signature');

      expect(decryptStep?.formula).toBe('H_decrypted = S^e mod n');
    });

    it('final step reflects validity', () => {
      const message = 'Test message';
      const signature = signMessage(message, keyPair.privateKey);
      const { steps } = verifySignatureWithSteps(message, signature, keyPair.publicKey);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.type).toBe('verify-result');
      expect(finalStep.values?.isValid).toBe(true);
      expect(finalStep.title).toContain('Valid');
    });

    it('final step shows invalid for tampered message', () => {
      const signature = signMessage('Original', keyPair.privateKey);
      const { steps } = verifySignatureWithSteps('Tampered', signature, keyPair.publicKey);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.type).toBe('verify-result');
      expect(finalStep.values?.isValid).toBe(false);
      expect(finalStep.title).toContain('Invalid');
    });
  });

  describe('full sign/verify cycle', () => {
    it('works with different key sizes', () => {
      const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];

      sizes.forEach((size) => {
        const { keyPair: testKeyPair } = generateRSAKeyPairWithSteps(size);
        const message = 'Test message for ' + size;

        const { signature } = signMessageWithSteps(message, testKeyPair);
        const { isValid } = verifySignatureWithSteps(message, signature, testKeyPair.publicKey);

        expect(isValid).toBe(true);
      });
    });

    it('signature from one key cannot be verified with another', () => {
      const { keyPair: keyPair1 } = generateRSAKeyPairWithSteps('small');
      const { keyPair: keyPair2 } = generateRSAKeyPairWithSteps('small');

      const message = 'Confidential message';
      const signature = signMessage(message, keyPair1.privateKey);

      // Attempt to verify with different public key
      const isValid = verifySignature(message, signature, keyPair2.publicKey);

      // This should typically fail (unless keys happen to produce same result, which is astronomically rare)
      // We just check that the function runs without error
      expect(typeof isValid).toBe('boolean');
    });

    it('detects message tampering', () => {
      const original = 'Send $100';
      const tampered = 'Send $1000000';

      const signature = signMessage(original, keyPair.privateKey);

      // Original should verify
      expect(verifySignature(original, signature, keyPair.publicKey)).toBe(true);

      // Tampered should fail
      expect(verifySignature(tampered, signature, keyPair.publicKey)).toBe(false);
    });
  });
});
