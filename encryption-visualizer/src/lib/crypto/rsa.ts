import { randomInteger } from './random';
/**
 * RSA Cryptography Implementation for Educational Visualization
 *
 * IMPORTANT SECURITY NOTICE:
 * This is an EDUCATIONAL implementation only. DO NOT use in production.
 * - Uses small prime numbers for visualization clarity
 * - Production systems must use established cryptographic libraries and 2048+ bit keys
 *
 * Implements RSA key generation, encryption, and decryption with visualization steps.
 */

import type { RSAKeyPair, RSAStep } from '../types/index.js';

export function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  
  return true;
}

export function generatePrime(min: number, max: number): number {
  let prime = randomInteger(min, max);
  
  while (!isPrime(prime)) {
    prime = randomInteger(min, max);
  }
  
  return prime;
}

// Euclidean algorithm
export function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// Extended Euclidean Algorithm
export function modInverse(e: number, phi: number): number {
  let [old_r, r] = [phi, e];
  let [old_s, s] = [0, 1];
  
  while (r !== 0) {
    const quotient = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
  }
  
  if (old_s < 0) {
    old_s += phi;
  }
  
  return old_s;
}

export function modPow(base: number, exp: number, mod: number): number {
  if (mod === 1) return 0;
  
  let result = 1;
  base = base % mod;
  
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  
  return result;
}

/**
 * Generate RSA key pair with visualization steps
 */
export function generateRSAKeyPairWithSteps(bitSize: 'small' | 'medium' | 'large' = 'small'): {
  keyPair: RSAKeyPair;
  steps: RSAStep[];
} {
  const steps: RSAStep[] = [];
  let stepNumber = 0;
  
  // Define prime ranges based on bit size
  const ranges = {
    small: { min: 10, max: 50 },
    medium: { min: 50, max: 200 },
    large: { min: 200, max: 500 },
  };
  
  const range = ranges[bitSize];
  
  // Step 1: Select prime p
  const p = generatePrime(range.min, range.max);
  steps.push({
    stepNumber: stepNumber++,
    type: 'prime-selection',
    title: 'Select First Prime (p)',
    description: `Choose a random prime number p. We selected p = ${p}. Prime numbers are the foundation of RSA security.`,
    values: { p },
    formula: 'p = prime number',
  });
  
  // Step 2: Select prime q (different from p)
  let q = generatePrime(range.min, range.max);
  while (q === p) {
    q = generatePrime(range.min, range.max);
  }
  steps.push({
    stepNumber: stepNumber++,
    type: 'prime-selection',
    title: 'Select Second Prime (q)',
    description: `Choose another random prime number q, different from p. We selected q = ${q}. Using two different primes ensures strong encryption.`,
    values: { p, q },
    formula: 'q = prime number (q ≠ p)',
  });
  
  // Step 3: Calculate modulus n
  const n = p * q;
  steps.push({
    stepNumber: stepNumber++,
    type: 'modulus-calculation',
    title: 'Calculate Modulus (n)',
    description: `Multiply the two primes: n = p × q = ${p} × ${q} = ${n}. This becomes the modulus for both public and private keys.`,
    values: { p, q, n },
    formula: 'n = p × q',
    calculation: `${p} × ${q} = ${n}`,
  });
  
  // Step 4: Calculate Euler's totient φ(n)
  const phi = (p - 1) * (q - 1);
  steps.push({
    stepNumber: stepNumber++,
    type: 'phi-calculation',
    title: "Calculate Euler's Totient φ(n)",
    description: `Calculate φ(n) = (p-1) × (q-1) = ${p-1} × ${q-1} = ${phi}. This represents the count of numbers less than n that are coprime to n.`,
    values: { p, q, n, phi },
    formula: 'φ(n) = (p-1) × (q-1)',
    calculation: `(${p}-1) × (${q}-1) = ${p-1} × ${q-1} = ${phi}`,
  });
  
  // Step 5: Choose public exponent e
  // Common choice: 65537 (2^16 + 1), but we'll use a smaller value for visualization
  let e = 65537;
  if (phi < 65537) {
    e = 3;
    while (e < phi && gcd(e, phi) !== 1) {
      e += 2;
    }
  }
  
  steps.push({
    stepNumber: stepNumber++,
    type: 'e-selection',
    title: 'Choose Public Exponent (e)',
    description: `Select e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1. We chose e = ${e}. This ensures e and φ(n) are coprime.`,
    values: { p, q, n, phi, e },
    formula: '1 < e < φ(n), gcd(e, φ(n)) = 1',
    calculation: `gcd(${e}, ${phi}) = ${gcd(e, phi)}`,
  });
  
  // Step 6: Calculate private exponent d
  const d = modInverse(e, phi);
  steps.push({
    stepNumber: stepNumber++,
    type: 'd-calculation',
    title: 'Calculate Private Exponent (d)',
    description: `Find d such that (d × e) mod φ(n) = 1. We calculated d = ${d}. This is the modular multiplicative inverse of e.`,
    values: { p, q, n, phi, e, d },
    formula: '(d × e) mod φ(n) = 1',
    calculation: `(${d} × ${e}) mod ${phi} = ${(d * e) % phi}`,
  });
  
  // Final step: Key pair generated
  steps.push({
    stepNumber: stepNumber,
    type: 'complete',
    title: 'RSA Key Pair Generated!',
    description: `Public Key: (e=${e}, n=${n}) - Share this openly. Private Key: (d=${d}, n=${n}) - Keep this secret!`,
    values: { p, q, n, phi, e, d },
  });
  
  const keyPair: RSAKeyPair = {
    publicKey: { n, e },
    privateKey: { n, d },
    p,
    q,
    phi,
  };
  
  return { keyPair, steps };
}

/**
 * Encrypt a message with RSA
 */
export function encryptRSA(message: number, publicKey: { n: number; e: number }): number {
  return modPow(message, publicKey.e, publicKey.n);
}

/**
 * Decrypt a message with RSA
 */
export function decryptRSA(ciphertext: number, privateKey: { n: number; d: number }): number {
  return modPow(ciphertext, privateKey.d, privateKey.n);
}

/**
 * Encrypt with visualization steps
 */
export function encryptRSAWithSteps(
  message: number,
  publicKey: { n: number; e: number }
): RSAStep[] {
  const steps: RSAStep[] = [];
  let stepNumber = 0;
  
  steps.push({
    stepNumber: stepNumber++,
    type: 'encryption',
    title: 'Encryption: Apply Public Key',
    description: `Encrypt the message using the formula: ciphertext = (message^e) mod n`,
    values: { message, e: publicKey.e, n: publicKey.n },
    formula: 'C = M^e mod n',
  });
  
  const encrypted = encryptRSA(message, publicKey);
  
  steps.push({
    stepNumber: stepNumber,
    type: 'encryption',
    title: 'Encryption Complete',
    description: `Ciphertext = (${message}^${publicKey.e}) mod ${publicKey.n} = ${encrypted}`,
    values: { message, encrypted, e: publicKey.e, n: publicKey.n },
    calculation: `${message}^${publicKey.e} mod ${publicKey.n} = ${encrypted}`,
  });
  
  return steps;
}

/**
 * Decrypt with visualization steps
 */
export function decryptRSAWithSteps(
  ciphertext: number,
  privateKey: { n: number; d: number }
): RSAStep[] {
  const steps: RSAStep[] = [];
  let stepNumber = 0;
  
  steps.push({
    stepNumber: stepNumber++,
    type: 'decryption',
    title: 'Decryption: Apply Private Key',
    description: `Decrypt the ciphertext using the formula: message = (ciphertext^d) mod n`,
    values: { encrypted: ciphertext, d: privateKey.d, n: privateKey.n },
    formula: 'M = C^d mod n',
  });
  
  const decrypted = decryptRSA(ciphertext, privateKey);
  
  steps.push({
    stepNumber: stepNumber,
    type: 'decryption',
    title: 'Decryption Complete',
    description: `Original message = (${ciphertext}^${privateKey.d}) mod ${privateKey.n} = ${decrypted}`,
    values: { encrypted: ciphertext, decrypted, d: privateKey.d, n: privateKey.n },
    calculation: `${ciphertext}^${privateKey.d} mod ${privateKey.n} = ${decrypted}`,
  });
  
  return steps;
}
