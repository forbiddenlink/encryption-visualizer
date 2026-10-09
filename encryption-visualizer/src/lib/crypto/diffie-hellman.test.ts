import { describe, it, expect } from 'vitest';
import {
  findGenerator,
  generatePrivateKey,
  computePublicKey,
  computeSharedSecret,
  generateDHKeyExchangeWithSteps,
  verifyDHExchange,
} from './diffie-hellman';
import { isPrime, modPow, generatePrime } from './rsa';

describe('Diffie-Hellman Key Exchange', () => {
  describe('generatePrime (used for DH)', () => {
    it('should generate a prime number within the specified range', () => {
      for (let i = 0; i < 10; i++) {
        const prime = generatePrime(23, 97);
        expect(prime).toBeGreaterThanOrEqual(23);
        expect(prime).toBeLessThanOrEqual(97);
        expect(isPrime(prime)).toBe(true);
      }
    });

    it('should generate different primes for different size ranges', () => {
      const smallPrime = generatePrime(23, 50);
      const mediumPrime = generatePrime(101, 200);

      expect(smallPrime).toBeLessThanOrEqual(50);
      expect(mediumPrime).toBeGreaterThanOrEqual(101);
    });
  });

  describe('findGenerator', () => {
    it('should return a valid generator for a prime', () => {
      const p = 23;
      const g = findGenerator(p);

      // Generator should be less than p
      expect(g).toBeLessThan(p);
      expect(g).toBeGreaterThanOrEqual(2);
    });

    it('should return a small generator (2, 3, 5, or 7)', () => {
      const p = 47;
      const g = findGenerator(p);

      expect([2, 3, 5, 7]).toContain(g);
    });
  });

  describe('generatePrivateKey', () => {
    it('should generate a private key in valid range [2, p-2]', () => {
      const p = 47;

      for (let i = 0; i < 20; i++) {
        const privateKey = generatePrivateKey(p);
        expect(privateKey).toBeGreaterThanOrEqual(2);
        expect(privateKey).toBeLessThanOrEqual(p - 2);
      }
    });
  });

  describe('computePublicKey', () => {
    it('should correctly compute g^a mod p', () => {
      const g = 2;
      const a = 6;
      const p = 23;

      // 2^6 mod 23 = 64 mod 23 = 18
      const publicKey = computePublicKey(g, a, p);
      expect(publicKey).toBe(18);
    });

    it('should produce result less than p', () => {
      const g = 5;
      const a = 15;
      const p = 47;

      const publicKey = computePublicKey(g, a, p);
      expect(publicKey).toBeLessThan(p);
      expect(publicKey).toBeGreaterThanOrEqual(0);
    });
  });

  describe('computeSharedSecret', () => {
    it('should correctly compute shared secret', () => {
      const p = 23;
      const g = 5;

      // Alice's keys
      const alicePrivate = 6;
      const alicePublic = computePublicKey(g, alicePrivate, p); // 5^6 mod 23

      // Bob's keys
      const bobPrivate = 15;
      const bobPublic = computePublicKey(g, bobPrivate, p); // 5^15 mod 23

      // Both should compute the same shared secret
      const aliceShared = computeSharedSecret(bobPublic, alicePrivate, p);
      const bobShared = computeSharedSecret(alicePublic, bobPrivate, p);

      expect(aliceShared).toBe(bobShared);
    });

    it('should produce matching secrets for random keys', () => {
      const p = 47;
      const g = 5;

      const alicePrivate = generatePrivateKey(p);
      const alicePublic = computePublicKey(g, alicePrivate, p);

      const bobPrivate = generatePrivateKey(p);
      const bobPublic = computePublicKey(g, bobPrivate, p);

      const aliceShared = computeSharedSecret(bobPublic, alicePrivate, p);
      const bobShared = computeSharedSecret(alicePublic, bobPrivate, p);

      expect(aliceShared).toBe(bobShared);
    });
  });

  describe('generateDHKeyExchangeWithSteps', () => {
    it('should generate valid params and steps for small key size', () => {
      const { params } = generateDHKeyExchangeWithSteps('small');

      // Check params structure
      expect(params.p).toBeGreaterThanOrEqual(23);
      expect(params.p).toBeLessThanOrEqual(97);
      expect(isPrime(params.p)).toBe(true);
      expect(params.g).toBeGreaterThanOrEqual(2);
      expect(params.g).toBeLessThan(params.p);

      // Check private keys are in valid range
      expect(params.alicePrivate).toBeGreaterThanOrEqual(2);
      expect(params.alicePrivate).toBeLessThanOrEqual(params.p - 2);
      expect(params.bobPrivate).toBeGreaterThanOrEqual(2);
      expect(params.bobPrivate).toBeLessThanOrEqual(params.p - 2);

      // Check public keys
      expect(params.alicePublic).toBe(modPow(params.g, params.alicePrivate, params.p));
      expect(params.bobPublic).toBe(modPow(params.g, params.bobPrivate, params.p));

      // Check shared secret
      expect(params.sharedSecret).toBe(modPow(params.bobPublic, params.alicePrivate, params.p));
      expect(params.sharedSecret).toBe(modPow(params.alicePublic, params.bobPrivate, params.p));
    });

    it('should generate 8 steps in the correct order', () => {
      const { steps } = generateDHKeyExchangeWithSteps('small');

      expect(steps).toHaveLength(8);

      const expectedTypes = [
        'setup',
        'alice-private',
        'alice-public',
        'bob-private',
        'bob-public',
        'alice-shared',
        'bob-shared',
        'complete',
      ];

      steps.forEach((step, index) => {
        expect(step.type).toBe(expectedTypes[index]);
        expect(step.stepNumber).toBe(index);
      });
    });

    it('should assign correct actors to steps', () => {
      const { steps } = generateDHKeyExchangeWithSteps('small');

      expect(steps[0].actor).toBe('system'); // setup
      expect(steps[1].actor).toBe('alice');  // alice-private
      expect(steps[2].actor).toBe('alice');  // alice-public
      expect(steps[3].actor).toBe('bob');    // bob-private
      expect(steps[4].actor).toBe('bob');    // bob-public
      expect(steps[5].actor).toBe('alice');  // alice-shared
      expect(steps[6].actor).toBe('bob');    // bob-shared
      expect(steps[7].actor).toBe('system'); // complete
    });

    it('should include formulas and calculations where appropriate', () => {
      const { steps } = generateDHKeyExchangeWithSteps('small');

      // Alice public key step should have calculation
      const alicePublicStep = steps.find((s) => s.type === 'alice-public');
      expect(alicePublicStep?.formula).toBe('A = g^a mod p');
      expect(alicePublicStep?.calculation).toBeDefined();

      // Bob public key step should have calculation
      const bobPublicStep = steps.find((s) => s.type === 'bob-public');
      expect(bobPublicStep?.formula).toBe('B = g^b mod p');
      expect(bobPublicStep?.calculation).toBeDefined();
    });

    it('should work for medium key size', () => {
      const { params, steps } = generateDHKeyExchangeWithSteps('medium');

      expect(params.p).toBeGreaterThanOrEqual(101);
      expect(params.p).toBeLessThanOrEqual(499);
      expect(steps).toHaveLength(8);
    });

    it('should work for large key size', () => {
      const { params, steps } = generateDHKeyExchangeWithSteps('large');

      expect(params.p).toBeGreaterThanOrEqual(503);
      expect(params.p).toBeLessThanOrEqual(997);
      expect(steps).toHaveLength(8);
    });
  });

  describe('verifyDHExchange', () => {
    it('should return true for valid exchange', () => {
      const { params } = generateDHKeyExchangeWithSteps('small');
      expect(verifyDHExchange(params)).toBe(true);
    });

    it('should return true for manually constructed valid params', () => {
      const p = 23;
      const g = 5;
      const alicePrivate = 6;
      const bobPrivate = 15;

      const params = {
        p,
        g,
        alicePrivate,
        alicePublic: computePublicKey(g, alicePrivate, p),
        bobPrivate,
        bobPublic: computePublicKey(g, bobPrivate, p),
        sharedSecret: computeSharedSecret(
          computePublicKey(g, bobPrivate, p),
          alicePrivate,
          p
        ),
      };

      expect(verifyDHExchange(params)).toBe(true);
    });

    it('should return false for tampered shared secret', () => {
      const { params } = generateDHKeyExchangeWithSteps('small');
      const tamperedParams = { ...params, sharedSecret: params.sharedSecret + 1 };

      expect(verifyDHExchange(tamperedParams)).toBe(false);
    });
  });

  describe('Mathematical Properties', () => {
    it('should satisfy g^(ab) = g^(ba) mod p (commutativity)', () => {
      const p = 47;
      const g = 5;

      for (let i = 0; i < 10; i++) {
        const a = generatePrivateKey(p);
        const b = generatePrivateKey(p);

        // g^(ab) mod p
        const gab = modPow(g, a * b, p);

        // g^(ba) mod p
        const gba = modPow(g, b * a, p);

        expect(gab).toBe(gba);
      }
    });

    it('should satisfy (g^a)^b = (g^b)^a mod p', () => {
      const p = 47;
      const g = 5;

      for (let i = 0; i < 10; i++) {
        const a = generatePrivateKey(p);
        const b = generatePrivateKey(p);

        const A = modPow(g, a, p); // g^a mod p
        const B = modPow(g, b, p); // g^b mod p

        // (g^a)^b mod p = A^b mod p
        const sharedFromAlice = modPow(A, b, p);

        // (g^b)^a mod p = B^a mod p
        const sharedFromBob = modPow(B, a, p);

        expect(sharedFromAlice).toBe(sharedFromBob);
      }
    });
  });
});


describe('primitive generator regression', () => {
  it.each([23, 31, 41, 97, 101, 499, 997])('generates every nonzero residue for prime %i', p => {
    const generator = findGenerator(p);
    const residues = new Set(Array.from({ length: p - 1 }, (_, i) => computePublicKey(generator, i + 1, p)));
    expect(residues.size).toBe(p - 1);
  });
});
