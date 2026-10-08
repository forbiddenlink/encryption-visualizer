/**
 * Password Hashing Implementation
 * Educational visualization of iterated hashing with salt
 *
 * IMPORTANT: This is a simplified bcrypt-like function for visualization.
 * Real-world password hashing should use bcrypt, scrypt, or Argon2id
 * via established libraries, never a custom implementation.
 */

import { simpleHash } from './hash';
import type { PasswordHashStep } from '@/lib/types/password-hashing';

export type { PasswordHashStep };

/**
 * Generate a deterministic "random" salt for visualization reproducibility
 * In production, use crypto.getRandomValues()
 */
export function generateSalt(seed?: string): string {
  if (seed) {
    return simpleHash(seed + 'salt-seed').slice(0, 16);
  }
  // Pseudo-random for demo purposes
  const chars = 'abcdef0123456789';
  let salt = '';
  const now = Date.now();
  for (let i = 0; i < 16; i++) {
    salt += chars[(now * (i + 7) * 31) % chars.length];
  }
  return salt;
}

/**
 * Simple iterated hash (bcrypt-like concept)
 * Repeatedly hashes the input to increase computation time
 */
export function iteratedHash(
  password: string,
  salt: string,
  iterations: number
): { hash: string; intermediates: string[] } {
  const intermediates: string[] = [];
  let current = password + salt;

  for (let i = 0; i < iterations; i++) {
    current = simpleHash(current + salt + i.toString());
    if (i < 10 || i === iterations - 1 || i % Math.max(1, Math.floor(iterations / 5)) === 0) {
      intermediates.push(current);
    }
  }

  return { hash: current, intermediates };
}

/**
 * Fast hash (simulating MD5/SHA-256 speed for comparison)
 * Just a single pass, no iteration
 */
export function fastHash(password: string, salt: string): string {
  return simpleHash(password + salt);
}

/**
 * Demonstrate salt purpose: same password with different salts
 */
export function demonstrateSaltPurpose(password: string): {
  noSalt: string;
  salt1: string;
  hash1: string;
  salt2: string;
  hash2: string;
  salt3: string;
  hash3: string;
} {
  const salt1 = generateSalt('user-alice');
  const salt2 = generateSalt('user-bob');
  const salt3 = generateSalt('user-charlie');

  return {
    noSalt: simpleHash(password),
    salt1,
    hash1: iteratedHash(password, salt1, 10).hash,
    salt2,
    hash2: iteratedHash(password, salt2, 10).hash,
    salt3,
    hash3: iteratedHash(password, salt3, 10).hash,
  };
}

/**
 * Demonstrate work factor effect
 * Shows how increasing iterations increases computation time
 */
export function demonstrateWorkFactor(
  password: string,
  salt: string,
  costFactors: number[]
): Array<{ cost: number; iterations: number; hash: string; timeMs: number }> {
  return costFactors.map((cost) => {
    const iterations = Math.pow(2, cost);
    const start = performance.now();
    const { hash } = iteratedHash(password, salt, iterations);
    const timeMs = performance.now() - start;

    return { cost, iterations, hash, timeMs };
  });
}

/**
 * Verify a password against a stored hash
 */
export function verifyPassword(
  password: string,
  salt: string,
  storedHash: string,
  iterations: number
): boolean {
  const { hash } = iteratedHash(password, salt, iterations);
  return hash === storedHash;
}

/**
 * Password hash with detailed steps for visualization
 */
export function passwordHashWithSteps(
  password: string,
  costFactor: number
): PasswordHashStep[] {
  const steps: PasswordHashStep[] = [];
  let stepNumber = 0;
  const iterations = Math.pow(2, costFactor);

  // Step 1: Input
  steps.push({
    stepNumber: stepNumber++,
    type: 'input',
    title: 'Password Input',
    description: `The password "${password}" needs to be hashed for secure storage. Unlike regular hashing, password hashing must be intentionally slow to resist brute-force attacks.`,
    values: {
      password,
      passwordLength: password.length,
      costFactor,
      iterations,
    },
  });

  // Step 2: Generate salt
  const salt = generateSalt(password + costFactor.toString());
  steps.push({
    stepNumber: stepNumber++,
    type: 'generate-salt',
    title: 'Generate Random Salt',
    description: `A unique salt is generated for this password. The salt ensures that even identical passwords produce different hashes, defeating rainbow table attacks.`,
    values: {
      salt,
      saltLength: `${salt.length} characters`,
      purpose: 'Prevents rainbow table attacks and ensures unique hashes',
    },
  });

  // Step 3: Combine
  const combined = password + salt;
  steps.push({
    stepNumber: stepNumber++,
    type: 'combine',
    title: 'Combine Password + Salt',
    description: 'The password and salt are combined before hashing. The salt is stored alongside the hash (it is not secret).',
    values: {
      password,
      salt,
      combined: combined.slice(0, 40) + (combined.length > 40 ? '...' : ''),
    },
  });

  // Step 4: Fast hash comparison
  const fastResult = fastHash(password, salt);
  steps.push({
    stepNumber: stepNumber++,
    type: 'iterate',
    title: 'Why Not a Fast Hash?',
    description: `A single SHA-256 hash takes ~0.000001 seconds. An attacker with a GPU can try billions per second. With cost factor ${costFactor}, we iterate ${iterations.toLocaleString()} times to make each attempt ~${iterations.toLocaleString()}x slower.`,
    values: {
      fastHash: fastResult,
      fastSpeed: '~1 nanosecond per hash',
      attackerSpeed: '~10 billion hashes/sec on GPU',
      slowedBy: `${iterations.toLocaleString()}x with ${iterations.toLocaleString()} iterations`,
    },
    iteration: 1,
    totalIterations: iterations,
  });

  // Step 5: Show iteration process (sample iterations)
  const sampleIterations = Math.min(iterations, 8);
  let current = password + salt;
  for (let i = 0; i < sampleIterations; i++) {
    current = simpleHash(current + salt + i.toString());
    steps.push({
      stepNumber: stepNumber++,
      type: 'stretch',
      title: `Iteration ${i + 1}${i === sampleIterations - 1 && iterations > sampleIterations ? ` (of ${iterations.toLocaleString()})` : ''}`,
      description:
        i === 0
          ? 'First iteration: hash the combined password+salt. Each subsequent iteration feeds the previous hash back in.'
          : i === sampleIterations - 1 && iterations > sampleIterations
            ? `Showing iteration ${i + 1}. The remaining ${(iterations - sampleIterations).toLocaleString()} iterations continue the same process...`
            : `Iteration ${i + 1}: the previous hash is combined with the salt and re-hashed. This key stretching makes brute-force exponentially harder.`,
      values: {
        intermediateHash: current,
        iteration: i + 1,
        progress: `${Math.round(((i + 1) / iterations) * 100)}%`,
      },
      iteration: i + 1,
      totalIterations: iterations,
    });
  }

  // Step 6: Final output
  const { hash: finalHash } = iteratedHash(password, salt, iterations);
  steps.push({
    stepNumber: stepNumber++,
    type: 'output',
    title: 'Final Password Hash',
    description: `After ${iterations.toLocaleString()} iterations, the final hash is produced. This hash, along with the salt and cost factor, is stored in the database. The password itself is never stored.`,
    values: {
      hash: finalHash,
      salt,
      costFactor,
      iterations,
      stored: `$${costFactor}$${salt}$${finalHash}`,
    },
  });

  // Step 7: Verification
  const isValid = verifyPassword(password, salt, finalHash, iterations);
  steps.push({
    stepNumber: stepNumber,
    type: 'verify',
    title: 'Password Verification',
    description: 'To verify a login, the system re-hashes the entered password with the stored salt and cost factor. If the result matches the stored hash, the password is correct.',
    values: {
      enteredPassword: password,
      storedSalt: salt,
      storedHash: finalHash,
      computedHash: finalHash,
      match: isValid ? 'YES - Login successful' : 'NO - Wrong password',
    },
  });

  return steps;
}
