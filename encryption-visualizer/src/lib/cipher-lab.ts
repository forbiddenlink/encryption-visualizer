/**
 * cipher-lab.ts — self-contained, display-only illustrative transforms for the
 * homepage "Cipher Lab" animated flow.
 *
 * These are NOT the production algorithm implementations under src/lib/crypto/*
 * (those power the real per-algorithm pages and remain untouched). The three
 * transforms here are small, correct, byte-level ciphers chosen because they
 * animate cleanly character-by-character:
 *
 *   - caesar     : classic additive shift over ASCII letters (real Caesar cipher)
 *   - xor        : c = p XOR k, repeating-key stream (real XOR cipher)
 *   - substitute : per-byte substitution through the AES S-box (the actual AES
 *                  SubBytes lookup table — public constant, display-only here)
 *
 * The math is honest: each step shows the true input byte, the true output byte,
 * and the rule applied. Nothing here fakes cryptographic strength.
 */

export type CipherAlgo = 'caesar' | 'xor' | 'substitute';

export interface CipherAlgoMeta {
  id: CipherAlgo;
  label: string;
  /** short mono tag shown on the selector chip */
  tag: string;
  /** one-line plain-English rule, shown under the flow */
  rule: string;
  /** whether this algorithm consumes the key input */
  usesKey: boolean;
  keyLabel?: string;
  defaultKey?: string;
}

export const CIPHER_ALGOS: CipherAlgoMeta[] = [
  {
    id: 'caesar',
    label: 'Caesar Shift',
    tag: 'shift',
    rule: 'Each letter slides forward by a fixed amount, wrapping around the alphabet.',
    usesKey: true,
    keyLabel: 'Shift',
    defaultKey: '3',
  },
  {
    id: 'xor',
    label: 'XOR Stream',
    tag: 'p ⊕ k',
    rule: 'Every byte is XORed against a repeating key byte — the core of stream ciphers.',
    usesKey: true,
    keyLabel: 'Key',
    defaultKey: 'KEY',
  },
  {
    id: 'substitute',
    label: 'AES S-Box',
    tag: 'SubBytes',
    rule: 'Each byte is swapped for another via the AES substitution table — the SubBytes step.',
    usesKey: false,
  },
];

/**
 * A single character/byte transform frame. One frame == one animated step.
 */
export interface CipherFrame {
  index: number;
  inChar: string;
  inByte: number;
  /** the operand applied at this position (shift amount / key byte / — ) */
  operand: string;
  outByte: number;
  outChar: string;
  /** short human note for the current step */
  note: string;
}

export interface CipherResult {
  frames: CipherFrame[];
  inputHex: string;
  outputHex: string;
}

/** AES S-box (SubBytes lookup). Public constant — used display-only. */
// prettier-ignore
const AES_SBOX: number[] = [
  0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
  0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
  0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
  0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
  0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
  0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
  0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
  0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
  0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
  0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
  0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
  0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
  0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
  0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
  0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
  0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16,
];

const hex = (n: number): string => n.toString(16).toUpperCase().padStart(2, '0');

/** Printable rendering for a resulting byte (control/non-printables shown as ·). */
const printable = (n: number): string => {
  if (n >= 0x20 && n <= 0x7e) return String.fromCharCode(n);
  return '·';
};

function caesarShift(chars: string[], shift: number): CipherFrame[] {
  const s = ((shift % 26) + 26) % 26;
  return chars.map((ch, index) => {
    const code = ch.charCodeAt(0);
    let outByte = code;
    if (code >= 65 && code <= 90) outByte = ((code - 65 + s) % 26) + 65;
    else if (code >= 97 && code <= 122) outByte = ((code - 97 + s) % 26) + 97;
    return {
      index,
      inChar: ch,
      inByte: code,
      operand: `+${s}`,
      outByte,
      outChar: printable(outByte),
      note: /[a-z]/i.test(ch)
        ? `'${ch}' shifts ${s} → '${printable(outByte)}'`
        : `'${ch}' is not a letter — passes through`,
    };
  });
}

function xorStream(chars: string[], key: string): CipherFrame[] {
  const k = key.length ? key : 'K';
  return chars.map((ch, index) => {
    const code = ch.charCodeAt(0);
    const keyByte = k.charCodeAt(index % k.length);
    const outByte = code ^ keyByte;
    return {
      index,
      inChar: ch,
      inByte: code,
      operand: `⊕ ${hex(keyByte)}`,
      outByte,
      outChar: printable(outByte),
      note: `${hex(code)} ⊕ ${hex(keyByte)} = ${hex(outByte)}`,
    };
  });
}

function substitute(chars: string[]): CipherFrame[] {
  return chars.map((ch, index) => {
    const code = ch.charCodeAt(0) & 0xff;
    const outByte = AES_SBOX[code];
    return {
      index,
      inChar: ch,
      inByte: code,
      operand: 'S[·]',
      outByte,
      outChar: printable(outByte),
      note: `S-box[${hex(code)}] = ${hex(outByte)}`,
    };
  });
}

/**
 * Build the full frame list for the given algorithm.
 * Input is capped to keep the animation readable.
 */
export function runCipher(
  algo: CipherAlgo,
  plaintext: string,
  key: string,
  maxLen = 18,
): CipherResult {
  const chars = Array.from(plaintext.slice(0, maxLen));
  let frames: CipherFrame[];

  switch (algo) {
    case 'caesar': {
      const shift = Number.parseInt(key, 10);
      frames = caesarShift(chars, Number.isFinite(shift) ? shift : 3);
      break;
    }
    case 'xor':
      frames = xorStream(chars, key);
      break;
    case 'substitute':
      frames = substitute(chars);
      break;
    default:
      frames = [];
  }

  return {
    frames,
    inputHex: frames.map((f) => hex(f.inByte)).join(' '),
    outputHex: frames.map((f) => hex(f.outByte)).join(' '),
  };
}

export { hex as toHex };
