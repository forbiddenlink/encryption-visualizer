/**
 * Diffie-Hellman Key Exchange Implementation for Educational Visualization
 *
 * IMPORTANT SECURITY NOTICE:
 * This is an EDUCATIONAL implementation only. DO NOT use in production.
 * - Uses Math.random() which is NOT cryptographically secure
 * - Uses small prime numbers for visualization clarity
 * - Production systems must use crypto.getRandomValues() and 2048+ bit primes
 *
 * Implements Diffie-Hellman key exchange with visualization steps.
 */

import type { DHStep, DHParams } from '../types/index.js';
import { modPow, generatePrime } from './rsa.js';

/**
 * Find a primitive root (generator) for a given prime p
 * For simplicity in educational context, we use small generators
 */
export function findGenerator(p: number): number {
  const commonGenerators = [2, 3, 5, 7];

  for (const g of commonGenerators) {
    if (g < p - 1) {
      // Simplified check: g should generate a large subgroup
      // For small primes in educational context, this is sufficient
      const order = p - 1;
      let current = g;
      let count = 1;

      while (current !== 1 && count < order) {
        current = (current * g) % p;
        count++;
      }

      // If the generator produces a cycle of length p-1, it's primitive
      if (count === order - 1 || count >= Math.floor(order / 2)) {
        return g;
      }
    }
  }

  // Fallback to 2 if no better generator found
  return 2;
}

/**
 * Generate a random private key in range [2, p-2]
 */
export function generatePrivateKey(p: number): number {
  const min = 2;
  const max = p - 2;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Compute public key: publicKey = g^privateKey mod p
 */
export function computePublicKey(g: number, privateKey: number, p: number): number {
  return modPow(g, privateKey, p);
}

/**
 * Compute shared secret: sharedSecret = otherPublicKey^myPrivateKey mod p
 */
export function computeSharedSecret(otherPublicKey: number, myPrivateKey: number, p: number): number {
  return modPow(otherPublicKey, myPrivateKey, p);
}

/**
 * Generate Diffie-Hellman key exchange with visualization steps
 */
export function generateDHKeyExchangeWithSteps(keySize: 'small' | 'medium' | 'large' = 'small'): {
  params: DHParams;
  steps: DHStep[];
} {
  const steps: DHStep[] = [];
  let stepNumber = 0;

  // Define prime ranges based on key size
  const ranges = {
    small: { min: 23, max: 97 },      // Small primes for easy visualization
    medium: { min: 101, max: 499 },   // Medium primes
    large: { min: 503, max: 997 },    // Larger primes (still educational)
  };

  const range = ranges[keySize];

  // Step 1: Setup - Choose prime p and generator g
  const p = generatePrime(range.min, range.max);
  const g = findGenerator(p);

  steps.push({
    stepNumber: stepNumber++,
    type: 'setup',
    title: 'Public Parameters Setup',
    description: `Alice and Bob publicly agree on a prime number p = ${p} and a generator g = ${g}. These values are shared openly and form the foundation of the key exchange.`,
    values: { p, g },
    formula: 'Public: p (prime), g (generator)',
    actor: 'system',
  });

  // Step 2: Alice picks private key a
  const alicePrivate = generatePrivateKey(p);

  steps.push({
    stepNumber: stepNumber++,
    type: 'alice-private',
    title: 'Alice Chooses Private Key',
    description: `Alice secretly picks a random private key a = ${alicePrivate}. This value is never shared with anyone, not even Bob.`,
    values: { p, g, a: alicePrivate },
    formula: 'a = random secret (2 < a < p-1)',
    actor: 'alice',
  });

  // Step 3: Alice computes public key A = g^a mod p
  const alicePublic = computePublicKey(g, alicePrivate, p);

  steps.push({
    stepNumber: stepNumber++,
    type: 'alice-public',
    title: 'Alice Computes Public Value',
    description: `Alice computes her public value A using the formula A = g^a mod p. She sends A = ${alicePublic} to Bob over the public channel.`,
    values: { p, g, a: alicePrivate, A: alicePublic },
    formula: 'A = g^a mod p',
    calculation: `${g}^${alicePrivate} mod ${p} = ${alicePublic}`,
    actor: 'alice',
  });

  // Step 4: Bob picks private key b
  const bobPrivate = generatePrivateKey(p);

  steps.push({
    stepNumber: stepNumber++,
    type: 'bob-private',
    title: 'Bob Chooses Private Key',
    description: `Bob secretly picks a random private key b = ${bobPrivate}. Like Alice, he keeps this value completely private.`,
    values: { p, g, A: alicePublic, b: bobPrivate },
    formula: 'b = random secret (2 < b < p-1)',
    actor: 'bob',
  });

  // Step 5: Bob computes public key B = g^b mod p
  const bobPublic = computePublicKey(g, bobPrivate, p);

  steps.push({
    stepNumber: stepNumber++,
    type: 'bob-public',
    title: 'Bob Computes Public Value',
    description: `Bob computes his public value B using the formula B = g^b mod p. He sends B = ${bobPublic} to Alice over the public channel.`,
    values: { p, g, A: alicePublic, b: bobPrivate, B: bobPublic },
    formula: 'B = g^b mod p',
    calculation: `${g}^${bobPrivate} mod ${p} = ${bobPublic}`,
    actor: 'bob',
  });

  // Step 6: Alice computes shared secret s = B^a mod p
  const aliceSharedSecret = computeSharedSecret(bobPublic, alicePrivate, p);

  steps.push({
    stepNumber: stepNumber++,
    type: 'alice-shared',
    title: 'Alice Computes Shared Secret',
    description: `Alice receives Bob's public value B = ${bobPublic} and computes the shared secret using her private key: s = B^a mod p = ${aliceSharedSecret}`,
    values: { p, B: bobPublic, a: alicePrivate, 's (Alice)': aliceSharedSecret },
    formula: 's = B^a mod p',
    calculation: `${bobPublic}^${alicePrivate} mod ${p} = ${aliceSharedSecret}`,
    actor: 'alice',
  });

  // Step 7: Bob computes shared secret s = A^b mod p
  const bobSharedSecret = computeSharedSecret(alicePublic, bobPrivate, p);

  steps.push({
    stepNumber: stepNumber++,
    type: 'bob-shared',
    title: 'Bob Computes Shared Secret',
    description: `Bob receives Alice's public value A = ${alicePublic} and computes the shared secret using his private key: s = A^b mod p = ${bobSharedSecret}`,
    values: { p, A: alicePublic, b: bobPrivate, 's (Bob)': bobSharedSecret },
    formula: 's = A^b mod p',
    calculation: `${alicePublic}^${bobPrivate} mod ${p} = ${bobSharedSecret}`,
    actor: 'bob',
  });

  // Step 8: Verify both get same shared secret
  const secretsMatch = aliceSharedSecret === bobSharedSecret;

  steps.push({
    stepNumber: stepNumber,
    type: 'complete',
    title: 'Key Exchange Complete!',
    description: secretsMatch
      ? `Both Alice and Bob have computed the same shared secret: ${aliceSharedSecret}. This works because g^(ab) mod p = g^(ba) mod p. An eavesdropper who only sees p, g, A, and B cannot easily compute the shared secret without knowing a or b.`
      : `Error: Secrets do not match! Alice: ${aliceSharedSecret}, Bob: ${bobSharedSecret}`,
    values: {
      'Public p': p,
      'Public g': g,
      'Public A': alicePublic,
      'Public B': bobPublic,
      'Shared Secret': aliceSharedSecret,
    },
    formula: 'B^a mod p = A^b mod p = g^(ab) mod p',
    actor: 'system',
  });

  const params: DHParams = {
    p,
    g,
    alicePrivate,
    alicePublic,
    bobPrivate,
    bobPublic,
    sharedSecret: aliceSharedSecret,
  };

  return { params, steps };
}

/**
 * Verify that Diffie-Hellman key exchange produces matching secrets
 */
export function verifyDHExchange(params: DHParams): boolean {
  const aliceSecret = computeSharedSecret(params.bobPublic, params.alicePrivate, params.p);
  const bobSecret = computeSharedSecret(params.alicePublic, params.bobPrivate, params.p);
  return aliceSecret === bobSecret && aliceSecret === params.sharedSecret;
}
