/**
 * Elliptic Curve Cryptography (ECC) Implementation for Educational Visualization
 *
 * IMPORTANT SECURITY NOTICE:
 * This is an EDUCATIONAL implementation only. DO NOT use in production.
 * - Uses Math.random() which is NOT cryptographically secure
 * - Uses tiny curves with small primes for visualization clarity
 * - Real-world ECC uses curves like secp256k1, P-256, or Curve25519 with 256+ bit keys
 * - Production systems must use well-audited libraries (e.g., OpenSSL, libsodium)
 *
 * Implements ECC point operations, ECDH key exchange, and ECDSA signing with visualization steps.
 */

import type { ECCPoint, ECCCurve, ECCStep, ECCKeyPair, ECDHResult, ECDSASignature } from '../types/ecc';

// ─── Predefined small curves for educational use ───────────────────────────────

/**
 * Tiny curve: y² = x³ + x + 6 (mod 11)
 * Generator point G = (2, 7), order n = 13 (prime, verified)
 */
export const TINY_CURVE: ECCCurve = {
  a: 1,
  b: 6,
  p: 11,
  G: { x: 2, y: 7 },
  n: 13,
};

/**
 * Small curve: y² = x³ + 2x + 3 (mod 97)
 * Generator point G = (3, 6), order n = 5 (prime, verified)
 */
export const SMALL_CURVE: ECCCurve = {
  a: 2,
  b: 3,
  p: 97,
  G: { x: 3, y: 6 },
  n: 5,
};

/**
 * Medium curve: y² = x³ + 2 (mod 61)
 * Generator point G = (1, 8), order n = 61 (prime, verified)
 */
export const MEDIUM_CURVE: ECCCurve = {
  a: 0,
  b: 2,
  p: 61,
  G: { x: 1, y: 8 },
  n: 61,
};

// ─── Modular arithmetic helpers ────────────────────────────────────────────────

/**
 * Modular arithmetic: always returns a non-negative result
 */
export function mod(a: number, m: number): number {
  return ((a % m) + m) % m;
}

/**
 * Extended Euclidean Algorithm to find modular inverse
 * Returns x such that (a * x) mod m = 1
 */
export function modInverse(a: number, m: number): number {
  a = mod(a, m);
  if (a === 0) throw new Error('No modular inverse exists for 0');

  let [old_r, r] = [m, a];
  let [old_s, s] = [0, 1];

  while (r !== 0) {
    const quotient = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
  }

  if (old_r !== 1) throw new Error(`No modular inverse: gcd(${a}, ${m}) = ${old_r}`);

  return mod(old_s, m);
}

// ─── Point at infinity (identity element) ──────────────────────────────────────

export const POINT_AT_INFINITY: ECCPoint = { x: 0, y: 0, isInfinity: true };

export function isInfinity(point: ECCPoint): boolean {
  return point.isInfinity === true;
}

// ─── Curve validation ──────────────────────────────────────────────────────────

/**
 * Check if a point lies on the curve y² = x³ + ax + b (mod p)
 */
export function isOnCurve(point: ECCPoint, curve: ECCCurve): boolean {
  if (isInfinity(point)) return true;
  const { x, y } = point;
  const { a, b, p } = curve;
  const lhs = mod(y * y, p);
  const rhs = mod(x * x * x + a * x + b, p);
  return lhs === rhs;
}

/**
 * Find all points on the curve (for small primes only)
 */
export function findAllPoints(curve: ECCCurve): ECCPoint[] {
  const points: ECCPoint[] = [];
  const { a, b, p } = curve;

  for (let x = 0; x < p; x++) {
    const rhs = mod(x * x * x + a * x + b, p);
    for (let y = 0; y < p; y++) {
      if (mod(y * y, p) === rhs) {
        points.push({ x, y });
      }
    }
  }

  return points;
}

// ─── Point operations ──────────────────────────────────────────────────────────

/**
 * Add two points on an elliptic curve
 *
 * Rules:
 * 1. P + O = P (identity element)
 * 2. P + (-P) = O (inverse)
 * 3. P + Q uses the secant line slope
 * 4. P + P uses the tangent line slope (point doubling)
 */
export function pointAdd(P: ECCPoint, Q: ECCPoint, curve: ECCCurve): ECCPoint {
  const { a, p } = curve;

  // Rule 1: Identity element
  if (isInfinity(P)) return Q;
  if (isInfinity(Q)) return P;

  // Rule 2: Inverse (P + (-P) = O)
  if (P.x === Q.x && mod(P.y + Q.y, p) === 0) {
    return POINT_AT_INFINITY;
  }

  let slope: number;

  if (P.x === Q.x && P.y === Q.y) {
    // Rule 4: Point doubling - tangent line
    // slope = (3x² + a) / (2y) mod p
    const numerator = mod(3 * P.x * P.x + a, p);
    const denominator = mod(2 * P.y, p);
    slope = mod(numerator * modInverse(denominator, p), p);
  } else {
    // Rule 3: Point addition - secant line
    // slope = (y2 - y1) / (x2 - x1) mod p
    const numerator = mod(Q.y - P.y, p);
    const denominator = mod(Q.x - P.x, p);
    slope = mod(numerator * modInverse(denominator, p), p);
  }

  // x3 = slope² - x1 - x2 mod p
  const x3 = mod(slope * slope - P.x - Q.x, p);
  // y3 = slope(x1 - x3) - y1 mod p
  const y3 = mod(slope * (P.x - x3) - P.y, p);

  return { x: x3, y: y3 };
}

/**
 * Double a point (P + P)
 * This is a convenience wrapper; pointAdd handles this case internally.
 */
export function pointDouble(P: ECCPoint, curve: ECCCurve): ECCPoint {
  return pointAdd(P, P, curve);
}

/**
 * Negate a point: -P = (x, -y mod p)
 */
export function pointNegate(P: ECCPoint, curve: ECCCurve): ECCPoint {
  if (isInfinity(P)) return POINT_AT_INFINITY;
  return { x: P.x, y: mod(-P.y, curve.p) };
}

/**
 * Scalar multiplication using double-and-add algorithm
 * Computes k * P on the curve
 */
export function scalarMultiply(k: number, P: ECCPoint, curve: ECCCurve): ECCPoint {
  if (k === 0 || isInfinity(P)) return POINT_AT_INFINITY;

  if (k < 0) {
    k = -k;
    P = pointNegate(P, curve);
  }

  let result: ECCPoint = POINT_AT_INFINITY;
  let current: ECCPoint = P;

  while (k > 0) {
    if (k & 1) {
      result = pointAdd(result, current, curve);
    }
    current = pointDouble(current, curve);
    k >>= 1;
  }

  return result;
}

/**
 * Scalar multiplication with intermediate steps for visualization
 */
export function scalarMultiplyWithSteps(
  k: number,
  P: ECCPoint,
  curve: ECCCurve
): { result: ECCPoint; intermediatePoints: ECCPoint[] } {
  const intermediatePoints: ECCPoint[] = [];

  if (k === 0 || isInfinity(P)) {
    return { result: POINT_AT_INFINITY, intermediatePoints };
  }

  let result: ECCPoint = POINT_AT_INFINITY;
  let current: ECCPoint = P;
  let remaining = k;

  while (remaining > 0) {
    if (remaining & 1) {
      result = pointAdd(result, current, curve);
      if (!isInfinity(result)) {
        intermediatePoints.push({ ...result });
      }
    }
    current = pointDouble(current, curve);
    remaining >>= 1;
  }

  return { result, intermediatePoints };
}

// ─── Key generation ────────────────────────────────────────────────────────────

/**
 * Generate an ECC key pair
 * Private key: random integer in [1, n-1]
 * Public key: private key * G
 */
export function generateKeyPair(curve: ECCCurve): ECCKeyPair {
  const privateKey = Math.floor(Math.random() * (curve.n - 1)) + 1;
  const publicKey = scalarMultiply(privateKey, curve.G, curve);

  return { privateKey, publicKey, curve };
}

// ─── ECDH Key Exchange ─────────────────────────────────────────────────────────

/**
 * Perform ECDH key exchange between Alice and Bob
 * Alice: private=a, public=aG
 * Bob: private=b, public=bG
 * Shared secret: a(bG) = b(aG) = abG
 */
export function performECDH(curve: ECCCurve): ECDHResult {
  const alice = generateKeyPair(curve);
  const bob = generateKeyPair(curve);

  // Alice computes shared secret using Bob's public key
  const sharedSecret = scalarMultiply(alice.privateKey, bob.publicKey, curve);

  return {
    alicePrivate: alice.privateKey,
    alicePublic: alice.publicKey,
    bobPrivate: bob.privateKey,
    bobPublic: bob.publicKey,
    sharedSecret,
  };
}

// ─── ECDSA Signing and Verification ────────────────────────────────────────────

/**
 * Simple hash function for educational purposes
 * Maps a message (number) to a value in [1, n-1]
 */
export function simpleHash(message: number, n: number): number {
  // A simplistic hash for demonstration; NOT cryptographically secure
  let hash = message;
  hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
  hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
  hash = (hash >> 16) ^ hash;
  return mod(Math.abs(hash), n - 1) + 1;
}

/**
 * ECDSA Sign
 * Returns signature (r, s)
 */
export function ecdsaSign(
  message: number,
  privateKey: number,
  curve: ECCCurve
): ECDSASignature {
  const { n, G } = curve;
  const z = simpleHash(message, n);

  let r = 0;
  let s = 0;

  // Keep trying until we get valid r and s
  while (r === 0 || s === 0) {
    const k = Math.floor(Math.random() * (n - 1)) + 1;
    const kG = scalarMultiply(k, G, curve);

    if (isInfinity(kG)) continue;

    r = mod(kG.x, n);
    if (r === 0) continue;

    const kInv = modInverse(k, n);
    s = mod(kInv * (z + r * privateKey), n);
  }

  return { r, s };
}

/**
 * ECDSA Verify
 * Returns true if signature is valid
 */
export function ecdsaVerify(
  message: number,
  signature: ECDSASignature,
  publicKey: ECCPoint,
  curve: ECCCurve
): boolean {
  const { n, G } = curve;
  const { r, s } = signature;

  // Check ranges
  if (r < 1 || r >= n || s < 1 || s >= n) return false;

  const z = simpleHash(message, n);
  const sInv = modInverse(s, n);

  const u1 = mod(z * sInv, n);
  const u2 = mod(r * sInv, n);

  const point = pointAdd(
    scalarMultiply(u1, G, curve),
    scalarMultiply(u2, publicKey, curve),
    curve
  );

  if (isInfinity(point)) return false;

  return mod(point.x, n) === r;
}

// ─── Visualization step generators ─────────────────────────────────────────────

/**
 * Generate ECC key pair with visualization steps
 */
export function generateECCWithSteps(curveChoice: 'tiny' | 'small' | 'medium' = 'tiny'): {
  keyPair: ECCKeyPair;
  ecdhResult: ECDHResult;
  steps: ECCStep[];
} {
  const curves = { tiny: TINY_CURVE, small: SMALL_CURVE, medium: MEDIUM_CURVE };
  const curve = curves[curveChoice];

  const steps: ECCStep[] = [];
  let stepNumber = 0;

  // Step 1: Curve setup
  steps.push({
    stepNumber: stepNumber++,
    type: 'curve-setup',
    title: 'Define the Elliptic Curve',
    description: `We define the curve y² = x³ + ${curve.a}x + ${curve.b} (mod ${curve.p}). All operations happen in the finite field F_${curve.p}. This equation creates a set of discrete points that form a mathematical group.`,
    values: { a: curve.a, b: curve.b, p: curve.p },
    formula: `y² = x³ + ${curve.a}x + ${curve.b} (mod ${curve.p})`,
    curve,
  });

  // Step 2: Generator point
  steps.push({
    stepNumber: stepNumber++,
    type: 'generator-point',
    title: 'Select Generator Point (G)',
    description: `Choose the generator point G = (${curve.G.x}, ${curve.G.y}) on the curve. This point, when repeatedly added to itself, generates a cyclic subgroup of order n = ${curve.n}. The generator is publicly known.`,
    values: { Gx: curve.G.x, Gy: curve.G.y, n: curve.n },
    formula: `G = (${curve.G.x}, ${curve.G.y}), order n = ${curve.n}`,
    point: curve.G,
    curve,
  });

  // Step 3: Alice's private key
  const alice = generateKeyPair(curve);
  steps.push({
    stepNumber: stepNumber++,
    type: 'private-key',
    title: "Alice's Private Key",
    description: `Alice picks a random secret integer d_A = ${alice.privateKey} in the range [1, ${curve.n - 1}]. This number must remain absolutely secret -- it's the trapdoor that makes ECC secure.`,
    values: { dA: alice.privateKey, min: 1, max: curve.n - 1 },
    formula: `d_A = ${alice.privateKey} (random, 1 <= d_A <= ${curve.n - 1})`,
    curve,
  });

  // Step 4: Scalar multiplication to get public key
  const { intermediatePoints } = scalarMultiplyWithSteps(alice.privateKey, curve.G, curve);
  steps.push({
    stepNumber: stepNumber++,
    type: 'scalar-multiply',
    title: 'Scalar Multiplication (Double-and-Add)',
    description: `Compute Q_A = d_A * G = ${alice.privateKey} * (${curve.G.x}, ${curve.G.y}) using the double-and-add algorithm. This repeatedly doubles G and adds intermediate results based on the binary representation of d_A. Finding d_A from Q_A is the Elliptic Curve Discrete Logarithm Problem (ECDLP) -- believed to be computationally infeasible for large curves.`,
    values: {
      dA: alice.privateKey,
      Gx: curve.G.x,
      Gy: curve.G.y,
      steps: intermediatePoints.length,
    },
    formula: `Q_A = d_A × G = ${alice.privateKey} × (${curve.G.x}, ${curve.G.y})`,
    calculation: `Double-and-add: ${alice.privateKey} in binary = ${alice.privateKey.toString(2)}`,
    curve,
  });

  // Step 5: Public key result
  steps.push({
    stepNumber: stepNumber++,
    type: 'public-key',
    title: "Alice's Public Key",
    description: `Alice's public key is Q_A = (${alice.publicKey.x}, ${alice.publicKey.y}). She shares this openly. Anyone can verify it lies on the curve: ${alice.publicKey.y}² mod ${curve.p} = (${alice.publicKey.x}³ + ${curve.a}*${alice.publicKey.x} + ${curve.b}) mod ${curve.p}.`,
    values: { QAx: alice.publicKey.x, QAy: alice.publicKey.y },
    formula: `Q_A = (${alice.publicKey.x}, ${alice.publicKey.y})`,
    calculation: `Verify: ${alice.publicKey.y}² mod ${curve.p} = ${mod(alice.publicKey.y * alice.publicKey.y, curve.p)}, ${alice.publicKey.x}³ + ${curve.a}·${alice.publicKey.x} + ${curve.b} mod ${curve.p} = ${mod(alice.publicKey.x * alice.publicKey.x * alice.publicKey.x + curve.a * alice.publicKey.x + curve.b, curve.p)}`,
    point: alice.publicKey,
    curve,
  });

  // Step 6: Bob's keys for ECDH
  const bob = generateKeyPair(curve);
  steps.push({
    stepNumber: stepNumber++,
    type: 'shared-secret',
    title: 'ECDH: Bob Generates His Key Pair',
    description: `Bob picks d_B = ${bob.privateKey} and computes Q_B = d_B * G = (${bob.publicKey.x}, ${bob.publicKey.y}). Alice and Bob exchange public keys Q_A and Q_B over an insecure channel.`,
    values: { dB: bob.privateKey, QBx: bob.publicKey.x, QBy: bob.publicKey.y },
    formula: `Q_B = d_B × G = ${bob.privateKey} × (${curve.G.x}, ${curve.G.y})`,
    point: bob.publicKey,
    curve,
  });

  // Step 7: Shared secret computation
  const sharedSecret = scalarMultiply(alice.privateKey, bob.publicKey, curve);
  steps.push({
    stepNumber: stepNumber++,
    type: 'shared-secret',
    title: 'ECDH: Compute Shared Secret',
    description: `Alice computes S = d_A * Q_B = ${alice.privateKey} * (${bob.publicKey.x}, ${bob.publicKey.y}) = (${sharedSecret.x}, ${sharedSecret.y}). Bob computes S = d_B * Q_A = ${bob.privateKey} * (${alice.publicKey.x}, ${alice.publicKey.y}) and gets the same point! An eavesdropper who knows Q_A and Q_B cannot compute S without solving the ECDLP.`,
    values: {
      Sx: isInfinity(sharedSecret) ? 'Infinity' : sharedSecret.x,
      Sy: isInfinity(sharedSecret) ? 'Infinity' : sharedSecret.y,
    },
    formula: `S = d_A × Q_B = d_B × Q_A`,
    calculation: `Alice: ${alice.privateKey} × (${bob.publicKey.x}, ${bob.publicKey.y}) = (${isInfinity(sharedSecret) ? 'O' : `${sharedSecret.x}, ${sharedSecret.y}`})`,
    point: isInfinity(sharedSecret) ? undefined : sharedSecret,
    curve,
  });

  // Step 8: ECDSA signing
  const testMessage = 42;
  const signature = ecdsaSign(testMessage, alice.privateKey, curve);
  steps.push({
    stepNumber: stepNumber++,
    type: 'signing',
    title: 'ECDSA: Sign a Message',
    description: `Alice signs message m = ${testMessage}. She picks a random k, computes kG, and derives signature (r, s) = (${signature.r}, ${signature.s}). The signature proves Alice authored the message without revealing her private key.`,
    values: { message: testMessage, r: signature.r, s: signature.s },
    formula: 'r = (kG).x mod n, s = k⁻¹(z + r·d_A) mod n',
    calculation: `Sign(${testMessage}) = (r=${signature.r}, s=${signature.s})`,
    curve,
  });

  // Step 9: ECDSA verification
  const isValid = ecdsaVerify(testMessage, signature, alice.publicKey, curve);
  steps.push({
    stepNumber: stepNumber++,
    type: 'verification',
    title: 'ECDSA: Verify Signature',
    description: `Bob verifies the signature using Alice's public key Q_A. He computes u1*G + u2*Q_A and checks if the x-coordinate equals r. Result: ${isValid ? 'VALID -- the signature is authentic!' : 'INVALID -- something went wrong.'}`,
    values: {
      message: testMessage,
      r: signature.r,
      s: signature.s,
      valid: isValid ? 'YES' : 'NO',
    },
    formula: 'u1 = z·s⁻¹ mod n, u2 = r·s⁻¹ mod n, verify (u1·G + u2·Q_A).x = r',
    calculation: `Verify(${testMessage}, (${signature.r}, ${signature.s})) = ${isValid}`,
    curve,
  });

  // Step 10: Complete
  steps.push({
    stepNumber: stepNumber,
    type: 'complete',
    title: 'ECC Operations Complete!',
    description: `Key pair generated, ECDH shared secret established, and ECDSA signature verified. ECC achieves the same security as RSA with much smaller keys: a 256-bit ECC key provides comparable security to a 3072-bit RSA key.`,
    values: {
      curve: `y² = x³ + ${curve.a}x + ${curve.b} (mod ${curve.p})`,
      privateKey: alice.privateKey,
      publicKeyX: alice.publicKey.x,
      publicKeyY: alice.publicKey.y,
    },
    curve,
  });

  const ecdhResult: ECDHResult = {
    alicePrivate: alice.privateKey,
    alicePublic: alice.publicKey,
    bobPrivate: bob.privateKey,
    bobPublic: bob.publicKey,
    sharedSecret,
  };

  return { keyPair: alice, ecdhResult, steps };
}
