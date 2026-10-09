/** SHA-256 compression and padding as specified in FIPS 180-4, sections 5 and 6.2. */
import type { HashStep } from '@/lib/types';

export const MAX_SHA256_TRACE_BYTES = 1024;

const INITIAL_HASH = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
];
const ROUND_CONSTANTS = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

function hex(word: number): string {
  return (word >>> 0).toString(16).padStart(8, '0');
}

function rotateRight(word: number, amount: number): number {
  return (word >>> amount) | (word << (32 - amount));
}

function binary(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(2).padStart(8, '0')).join(' ');
}

type AddStep = (type: HashStep['type'], title: string, description: string, data: NonNullable<HashStep['data']>) => void;

function digest(bytes: Uint8Array, addStep?: AddStep): string {
  const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  // A 64-bit big-endian bit count; split it to avoid 32-bit truncation.
  const bitLength = BigInt(bytes.length) * 8n;
  view.setBigUint64(padded.length - 8, bitLength, false);
  const blockCount = padded.length / 64;
  const state = [...INITIAL_HASH];
  const schedule = new Uint32Array(64);

  if (addStep) {
    const words = Array.from({ length: padded.length / 4 }, (_, index) => hex(view.getUint32(index * 4, false)));
    addStep('preprocessing', 'Pad the Message', `Append a 1 bit, zero bits, and the original ${bitLength} bit length as a 64-bit big-endian integer. The padded message has ${blockCount} block${blockCount === 1 ? '' : 's'} of 512 bits.`, { padded: binary(padded), chunks: words });
    addStep('initialization', 'Initialize SHA-256 State', 'Initialize eight 32-bit hash words using the fixed SHA-256 initial values. All additions in compression are modulo 2³².', { hash: state.map(hex).join(''), roundValues: state.map(hex) });
  }

  for (let blockIndex = 0; blockIndex < blockCount; blockIndex++) {
    const offset = blockIndex * 64;
    for (let index = 0; index < 16; index++) schedule[index] = view.getUint32(offset + index * 4, false);
    for (let index = 16; index < 64; index++) {
      const x = schedule[index - 15];
      const y = schedule[index - 2];
      const sigma0 = rotateRight(x, 7) ^ rotateRight(x, 18) ^ (x >>> 3);
      const sigma1 = rotateRight(y, 17) ^ rotateRight(y, 19) ^ (y >>> 10);
      schedule[index] = (schedule[index - 16] + sigma0 + schedule[index - 7] + sigma1) >>> 0;
    }
    addStep?.('compression', `Block ${blockIndex + 1}: Message Schedule`, 'Read the block as 16 big-endian 32-bit words, then expand to 64 words: W[t] = σ₁(W[t−2]) + W[t−7] + σ₀(W[t−15]) + W[t−16] modulo 2³². σ₀ uses rotations 7 and 18 and shift 3; σ₁ uses rotations 17 and 19 and shift 10.', { chunks: Array.from(schedule, hex), roundValues: state.map(hex), sha256: { blockIndex, blockCount } });

    let [a, b, c, d, e, f, g, h] = state;
    for (let round = 0; round < 64; round++) {
      const sum1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choose = (e & f) ^ (~e & g);
      const temp1 = (h + sum1 + choose + ROUND_CONSTANTS[round] + schedule[round]) >>> 0;
      const sum0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (sum0 + majority) >>> 0;
      [a, b, c, d, e, f, g, h] = [(temp1 + temp2) >>> 0, a, b, c, (d + temp1) >>> 0, e, f, g];
      addStep?.('compression', `Block ${blockIndex + 1}: Round ${round + 1}`, 'T₁ = h + Σ₁(e) + Ch(e,f,g) + K[t] + W[t]; T₂ = Σ₀(a) + Maj(a,b,c). Σ₁ rotates by 6, 11, 25; Σ₀ rotates by 2, 13, 22. Ch selects bits from f or g using e; Maj selects the majority bit. Set a = T₁ + T₂ and e = d + T₁, and shift the other working words. Values show a–h after this round; sums are modulo 2³².', { roundValues: [a, b, c, d, e, f, g, h].map(hex), sha256: { blockIndex, blockCount, round, word: hex(schedule[round]), constant: hex(ROUND_CONSTANTS[round]), temp1: hex(temp1), temp2: hex(temp2) } });
    }
    const working = [a, b, c, d, e, f, g, h];
    for (let index = 0; index < state.length; index++) state[index] = (state[index] + working[index]) >>> 0;
    addStep?.('compression', `Block ${blockIndex + 1}: Update Hash State`, 'Add each final working word a–h to its corresponding incoming hash word modulo 2³². The resulting eight words become the state for the next block.', { hash: state.map(hex).join(''), roundValues: state.map(hex), sha256: { blockIndex, blockCount } });
  }
  return state.map(hex).join('');
}

export function sha256(input: string): string {
  return digest(new TextEncoder().encode(input));
}

export function sha256WithSteps(input: string): HashStep[] {
  const bytes = new TextEncoder().encode(input);
  if (bytes.length > MAX_SHA256_TRACE_BYTES) {
    throw new RangeError(`SHA-256 visualization supports at most ${MAX_SHA256_TRACE_BYTES} UTF-8 bytes.`);
  }
  const steps: HashStep[] = [];
  const addStep: AddStep = (type, title, description, data) => {
    steps.push({ stepNumber: steps.length, type, title, description, data: { algorithm: 'SHA-256', ...data } });
  };
  addStep('input', 'Input Message', 'Hash the input text using SHA-256. Text is encoded as UTF-8; no Unicode normalization is applied.', { input });
  addStep('preprocessing', 'Encode as UTF-8', `Encode the message as ${bytes.length} UTF-8 byte${bytes.length === 1 ? '' : 's'}. Each displayed group contains 8 bits. Unpaired UTF-16 surrogates are replaced with U+FFFD by TextEncoder.`, { input, binary: binary(bytes) });
  const hash = digest(bytes, addStep);
  addStep('output', 'SHA-256 Digest', 'Concatenate the eight final hash words in big-endian order to produce the 256-bit digest (64 hexadecimal characters).', { input, hash });
  return steps;
}

function countBitDifference(left: string, right: string): number {
  let count = 0;
  for (let index = 0; index < left.length; index++) {
    let bits = parseInt(left[index], 16) ^ parseInt(right[index], 16);
    while (bits) {
      count += bits & 1;
      bits >>>= 1;
    }
  }
  return count;
}

export function compareSHA256(input1: string, input2: string): {
  input1: string;
  hash1: string;
  input2: string;
  hash2: string;
  similarity: number;
  bitsChanged: number;
} {
  const hash1 = sha256(input1);
  const hash2 = sha256(input2);
  const bitsChanged = countBitDifference(hash1, hash2);
  return { input1, hash1, input2, hash2, bitsChanged, similarity: Math.round((1 - bitsChanged / 256) * 100) };
}

export function demonstrateSHA256Avalanche(input: string): Array<{
  input: string;
  hash: string;
  bitsChanged: number;
}> {
  const characters = Array.from(input);
  const variations = new Set([
    input,
    input + ' ',
    characters.slice(0, -1).join(''),
    (characters[0]?.toUpperCase() ?? '') + characters.slice(1).join(''),
    input.toLowerCase(),
    input.toUpperCase(),
  ]);
  const originalHash = sha256(input);
  return Array.from(variations, variant => {
    const hash = variant === input ? originalHash : sha256(variant);
    return { input: variant, hash, bitsChanged: countBitDifference(originalHash, hash) };
  });
}
