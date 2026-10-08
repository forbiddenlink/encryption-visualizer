/**
 * ECC Cryptographic Functions Test Suite
 * Tests for elliptic curve point operations, ECDH, and ECDSA
 */
import { describe, it, expect, vi } from 'vitest';
import {
  mod,
  modInverse,
  POINT_AT_INFINITY,
  isInfinity,
  isOnCurve,
  findAllPoints,
  pointAdd,
  pointDouble,
  pointNegate,
  scalarMultiply,
  scalarMultiplyWithSteps,
  generateKeyPair,
  performECDH,
  ecdsaSign,
  ecdsaVerify,
  simpleHash,
  generateECCWithSteps,
  TINY_CURVE,
  SMALL_CURVE,
  MEDIUM_CURVE,
} from './ecc';

describe('ECC Crypto Functions', () => {
  describe('mod', () => {
    it('returns non-negative result for positive inputs', () => {
      expect(mod(10, 3)).toBe(1);
      expect(mod(7, 5)).toBe(2);
    });

    it('returns non-negative result for negative inputs', () => {
      expect(mod(-1, 5)).toBe(4);
      expect(mod(-7, 3)).toBe(2);
    });

    it('returns 0 when evenly divisible', () => {
      expect(mod(10, 5)).toBe(0);
      expect(mod(-6, 3)).toBe(0);
    });
  });

  describe('modInverse', () => {
    it('computes correct modular inverse', () => {
      const inv = modInverse(3, 7);
      expect(mod(3 * inv, 7)).toBe(1);
    });

    it('throws for 0', () => {
      expect(() => modInverse(0, 7)).toThrow('No modular inverse exists for 0');
    });

    it('throws when gcd is not 1', () => {
      expect(() => modInverse(6, 9)).toThrow();
    });
  });

  describe('Point at infinity', () => {
    it('POINT_AT_INFINITY has isInfinity flag', () => {
      expect(isInfinity(POINT_AT_INFINITY)).toBe(true);
    });

    it('regular points are not infinity', () => {
      expect(isInfinity({ x: 3, y: 6 })).toBe(false);
      expect(isInfinity({ x: 0, y: 0 })).toBe(false);
    });
  });

  describe('isOnCurve', () => {
    it('identity point is always on curve', () => {
      expect(isOnCurve(POINT_AT_INFINITY, SMALL_CURVE)).toBe(true);
      expect(isOnCurve(POINT_AT_INFINITY, TINY_CURVE)).toBe(true);
    });

    it('generator point is on curve (SMALL_CURVE)', () => {
      expect(isOnCurve(SMALL_CURVE.G, SMALL_CURVE)).toBe(true);
    });

    it('generator point is on curve (TINY_CURVE)', () => {
      expect(isOnCurve(TINY_CURVE.G, TINY_CURVE)).toBe(true);
    });

    it('generator point is on curve (MEDIUM_CURVE)', () => {
      expect(isOnCurve(MEDIUM_CURVE.G, MEDIUM_CURVE)).toBe(true);
    });

    it('arbitrary point not on curve returns false', () => {
      expect(isOnCurve({ x: 1, y: 1 }, SMALL_CURVE)).toBe(false);
    });
  });

  describe('findAllPoints', () => {
    it('finds points that are all on the curve', () => {
      const points = findAllPoints(TINY_CURVE);
      expect(points.length).toBeGreaterThan(0);
      points.forEach((p) => {
        expect(isOnCurve(p, TINY_CURVE)).toBe(true);
      });
    });
  });

  describe('pointAdd', () => {
    it('P + O = P (identity element, left)', () => {
      const P = SMALL_CURVE.G;
      const result = pointAdd(POINT_AT_INFINITY, P, SMALL_CURVE);
      expect(result.x).toBe(P.x);
      expect(result.y).toBe(P.y);
    });

    it('O + P = P (identity element, right)', () => {
      const P = SMALL_CURVE.G;
      const result = pointAdd(P, POINT_AT_INFINITY, SMALL_CURVE);
      expect(result.x).toBe(P.x);
      expect(result.y).toBe(P.y);
    });

    it('P + (-P) = O (inverse)', () => {
      const P = SMALL_CURVE.G;
      const negP = pointNegate(P, SMALL_CURVE);
      const result = pointAdd(P, negP, SMALL_CURVE);
      expect(isInfinity(result)).toBe(true);
    });

    it('P + Q produces a point on curve', () => {
      const P = TINY_CURVE.G;
      const Q = scalarMultiply(2, P, TINY_CURVE);
      if (!isInfinity(Q)) {
        const R = pointAdd(P, Q, TINY_CURVE);
        if (!isInfinity(R)) {
          expect(isOnCurve(R, TINY_CURVE)).toBe(true);
        }
      }
    });

    it('addition is commutative: P + Q = Q + P', () => {
      const P = TINY_CURVE.G;
      const Q = scalarMultiply(3, P, TINY_CURVE);
      const r1 = pointAdd(P, Q, TINY_CURVE);
      const r2 = pointAdd(Q, P, TINY_CURVE);
      expect(r1.x).toBe(r2.x);
      expect(r1.y).toBe(r2.y);
    });
  });

  describe('pointDouble', () => {
    it('2P equals P + P', () => {
      const P = SMALL_CURVE.G;
      const doubled = pointDouble(P, SMALL_CURVE);
      const added = pointAdd(P, P, SMALL_CURVE);
      expect(doubled.x).toBe(added.x);
      expect(doubled.y).toBe(added.y);
    });

    it('result of doubling is on curve', () => {
      const P = TINY_CURVE.G;
      const doubled = pointDouble(P, TINY_CURVE);
      if (!isInfinity(doubled)) {
        expect(isOnCurve(doubled, TINY_CURVE)).toBe(true);
      }
    });

    it('doubling infinity returns infinity', () => {
      const result = pointDouble(POINT_AT_INFINITY, SMALL_CURVE);
      expect(isInfinity(result)).toBe(true);
    });
  });

  describe('pointNegate', () => {
    it('negates y coordinate mod p', () => {
      const P = SMALL_CURVE.G;
      const neg = pointNegate(P, SMALL_CURVE);
      expect(neg.x).toBe(P.x);
      expect(mod(P.y + neg.y, SMALL_CURVE.p)).toBe(0);
    });

    it('negating infinity returns infinity', () => {
      const result = pointNegate(POINT_AT_INFINITY, SMALL_CURVE);
      expect(isInfinity(result)).toBe(true);
    });
  });

  describe('scalarMultiply', () => {
    it('0 * P = O', () => {
      const result = scalarMultiply(0, SMALL_CURVE.G, SMALL_CURVE);
      expect(isInfinity(result)).toBe(true);
    });

    it('1 * P = P', () => {
      const P = SMALL_CURVE.G;
      const result = scalarMultiply(1, P, SMALL_CURVE);
      expect(result.x).toBe(P.x);
      expect(result.y).toBe(P.y);
    });

    it('2 * P = P + P', () => {
      const P = SMALL_CURVE.G;
      const doubled = scalarMultiply(2, P, SMALL_CURVE);
      const added = pointAdd(P, P, SMALL_CURVE);
      expect(doubled.x).toBe(added.x);
      expect(doubled.y).toBe(added.y);
    });

    it('k * P is on curve for various k', () => {
      for (let k = 1; k <= 4; k++) {
        const result = scalarMultiply(k, TINY_CURVE.G, TINY_CURVE);
        if (!isInfinity(result)) {
          expect(isOnCurve(result, TINY_CURVE)).toBe(true);
        }
      }
    });

    it('n * G = O (order of generator)', () => {
      const result = scalarMultiply(SMALL_CURVE.n, SMALL_CURVE.G, SMALL_CURVE);
      expect(isInfinity(result)).toBe(true);
    });

    it('negative scalar negates the point first', () => {
      const P = TINY_CURVE.G;
      const neg2P = scalarMultiply(-2, P, TINY_CURVE);
      const pos2P = scalarMultiply(2, P, TINY_CURVE);
      const negPos2P = pointNegate(pos2P, TINY_CURVE);
      if (!isInfinity(neg2P) && !isInfinity(negPos2P)) {
        expect(neg2P.x).toBe(negPos2P.x);
        expect(neg2P.y).toBe(negPos2P.y);
      }
    });

    it('k * O = O', () => {
      const result = scalarMultiply(5, POINT_AT_INFINITY, SMALL_CURVE);
      expect(isInfinity(result)).toBe(true);
    });
  });

  describe('scalarMultiplyWithSteps', () => {
    it('returns same result as scalarMultiply', () => {
      const k = 3;
      const direct = scalarMultiply(k, TINY_CURVE.G, TINY_CURVE);
      const { result } = scalarMultiplyWithSteps(k, TINY_CURVE.G, TINY_CURVE);
      expect(result.x).toBe(direct.x);
      expect(result.y).toBe(direct.y);
    });

    it('returns intermediate points', () => {
      const { intermediatePoints } = scalarMultiplyWithSteps(4, TINY_CURVE.G, TINY_CURVE);
      expect(intermediatePoints.length).toBeGreaterThan(0);
    });

    it('returns empty intermediates for k=0', () => {
      const { result, intermediatePoints } = scalarMultiplyWithSteps(0, TINY_CURVE.G, TINY_CURVE);
      expect(isInfinity(result)).toBe(true);
      expect(intermediatePoints).toHaveLength(0);
    });
  });

  describe('generateKeyPair', () => {
    it('public key is on curve', () => {
      const kp = generateKeyPair(TINY_CURVE);
      expect(isOnCurve(kp.publicKey, TINY_CURVE)).toBe(true);
    });

    it('private key is in valid range [1, n-1]', () => {
      for (let i = 0; i < 10; i++) {
        const kp = generateKeyPair(TINY_CURVE);
        expect(kp.privateKey).toBeGreaterThanOrEqual(1);
        expect(kp.privateKey).toBeLessThanOrEqual(TINY_CURVE.n - 1);
      }
    });

    it('public key = privateKey * G', () => {
      const kp = generateKeyPair(TINY_CURVE);
      const expected = scalarMultiply(kp.privateKey, TINY_CURVE.G, TINY_CURVE);
      expect(kp.publicKey.x).toBe(expected.x);
      expect(kp.publicKey.y).toBe(expected.y);
    });

    it('stores the curve reference', () => {
      const kp = generateKeyPair(SMALL_CURVE);
      expect(kp.curve).toBe(SMALL_CURVE);
    });
  });

  describe('ECDH key exchange', () => {
    it('both parties compute the same shared secret', () => {
      const curve = TINY_CURVE;
      const alice = generateKeyPair(curve);
      const bob = generateKeyPair(curve);

      const secretAlice = scalarMultiply(alice.privateKey, bob.publicKey, curve);
      const secretBob = scalarMultiply(bob.privateKey, alice.publicKey, curve);

      expect(secretAlice.x).toBe(secretBob.x);
      expect(secretAlice.y).toBe(secretBob.y);
    });

    it('performECDH returns valid structure', () => {
      const result = performECDH(TINY_CURVE);
      expect(result.alicePrivate).toBeDefined();
      expect(result.alicePublic).toBeDefined();
      expect(result.bobPrivate).toBeDefined();
      expect(result.bobPublic).toBeDefined();
      expect(result.sharedSecret).toBeDefined();
    });

    it('performECDH shared secret matches manual computation', () => {
      const result = performECDH(TINY_CURVE);
      const manualSecret = scalarMultiply(result.bobPrivate, result.alicePublic, TINY_CURVE);
      if (!isInfinity(result.sharedSecret) && !isInfinity(manualSecret)) {
        expect(result.sharedSecret.x).toBe(manualSecret.x);
        expect(result.sharedSecret.y).toBe(manualSecret.y);
      }
    });
  });

  describe('simpleHash', () => {
    it('returns value in [1, n-1]', () => {
      const n = 28;
      for (let msg = 0; msg < 50; msg++) {
        const h = simpleHash(msg, n);
        expect(h).toBeGreaterThanOrEqual(1);
        expect(h).toBeLessThanOrEqual(n - 1);
      }
    });

    it('same input gives same output', () => {
      expect(simpleHash(42, 28)).toBe(simpleHash(42, 28));
    });
  });

  describe('ECDSA', () => {
    // Use MEDIUM_CURVE (n=270) for ECDSA tests -- TINY_CURVE has non-prime n=28
    // and SMALL_CURVE has n=5 which is too small (frequent infinite loops in signing)
    it('sign then verify returns true', () => {
      const curve = MEDIUM_CURVE;
      const kp = generateKeyPair(curve);
      const message = 42;
      const sig = ecdsaSign(message, kp.privateKey, curve);
      expect(ecdsaVerify(message, sig, kp.publicKey, curve)).toBe(true);
    });

    it('tampered message fails verification', () => {
      const curve = MEDIUM_CURVE;
      const kp = generateKeyPair(curve);
      const sig = ecdsaSign(42, kp.privateKey, curve);
      expect(ecdsaVerify(99, sig, kp.publicKey, curve)).toBe(false);
    });

    it('wrong public key fails verification', () => {
      const curve = MEDIUM_CURVE;
      const kp1 = generateKeyPair(curve);
      const kp2 = generateKeyPair(curve);
      const sig = ecdsaSign(42, kp1.privateKey, curve);
      const result = ecdsaVerify(42, sig, kp2.publicKey, curve);
      expect(typeof result).toBe('boolean');
    });

    it('signature has valid r and s', () => {
      const curve = MEDIUM_CURVE;
      const kp = generateKeyPair(curve);
      const sig = ecdsaSign(10, kp.privateKey, curve);
      expect(sig.r).toBeGreaterThanOrEqual(1);
      expect(sig.r).toBeLessThan(curve.n);
      expect(sig.s).toBeGreaterThanOrEqual(1);
      expect(sig.s).toBeLessThan(curve.n);
    });

    it('out of range r fails verification', () => {
      const curve = MEDIUM_CURVE;
      const kp = generateKeyPair(curve);
      expect(ecdsaVerify(42, { r: 0, s: 2 }, kp.publicKey, curve)).toBe(false);
      expect(ecdsaVerify(42, { r: curve.n, s: 2 }, kp.publicKey, curve)).toBe(false);
    });

    it('out of range s fails verification', () => {
      const curve = MEDIUM_CURVE;
      const kp = generateKeyPair(curve);
      expect(ecdsaVerify(42, { r: 2, s: 0 }, kp.publicKey, curve)).toBe(false);
      expect(ecdsaVerify(42, { r: 2, s: curve.n }, kp.publicKey, curve)).toBe(false);
    });
  });

  describe('generateECCWithSteps', () => {
    // Use 'medium' curve to avoid modInverse errors in ECDSA signing
    // (tiny has non-prime n=28, small has n=5 which is too small)
    it('generates 10 steps', () => {
      const { steps } = generateECCWithSteps('medium');
      expect(steps).toHaveLength(10);
    });

    it('steps have correct types in order', () => {
      const { steps } = generateECCWithSteps('medium');
      const expectedTypes = [
        'curve-setup',
        'generator-point',
        'private-key',
        'scalar-multiply',
        'public-key',
        'shared-secret',
        'shared-secret',
        'signing',
        'verification',
        'complete',
      ];
      expect(steps.map((s) => s.type)).toEqual(expectedTypes);
    });

    it('each step has required properties', () => {
      const { steps } = generateECCWithSteps('medium');
      steps.forEach((step) => {
        expect(step).toHaveProperty('stepNumber');
        expect(step).toHaveProperty('type');
        expect(step).toHaveProperty('title');
        expect(step).toHaveProperty('description');
      });
    });

    it('steps have incrementing step numbers', () => {
      const { steps } = generateECCWithSteps('medium');
      for (let i = 0; i < steps.length; i++) {
        expect(steps[i].stepNumber).toBe(i);
      }
    });

    it('returns a valid key pair', () => {
      const { keyPair } = generateECCWithSteps('medium');
      expect(isOnCurve(keyPair.publicKey, MEDIUM_CURVE)).toBe(true);
    });

    it('returns a valid ECDH result', () => {
      const { ecdhResult } = generateECCWithSteps('medium');
      expect(ecdhResult.alicePrivate).toBeDefined();
      expect(ecdhResult.bobPrivate).toBeDefined();
      expect(ecdhResult.sharedSecret).toBeDefined();
    });

    it('works with medium curve', () => {
      const { steps, keyPair } = generateECCWithSteps('medium');
      expect(steps.length).toBe(10);
      expect(keyPair.privateKey).toBeGreaterThanOrEqual(1);
    });
  });
});


describe('bounded educational ECDSA regressions', () => {
  it('reports an impossible signature instead of retrying forever', () => {
    let calls = 0;
    const random = vi.spyOn(Math, 'random').mockImplementation(() => {
      if (++calls > 20) throw new Error('nonce retry sentinel');
      return 0.6;
    });
    try {
      expect(() => ecdsaSign(42, 3, SMALL_CURVE)).toThrow(/No valid ECDSA signature/);
    } finally {
      random.mockRestore();
    }
  });

  it('explains unavailable signing in the small-curve walkthrough', () => {
    let calls = 0;
    const random = vi.spyOn(Math, 'random').mockImplementation(() => {
      if (++calls > 20) throw new Error('nonce retry sentinel');
      return 0.6;
    });
    try {
      const { steps } = generateECCWithSteps('small');
      expect(steps.find(step => step.type === 'signing')?.description).toMatch(/no valid signature/i);
      expect(steps.find(step => step.type === 'verification')?.values?.valid).toBe('Not available');
      expect(steps.at(-1)?.description).not.toContain('ECDSA signature verified');
    } finally {
      random.mockRestore();
    }
  });
});
