/**
 * Padding Schemes Implementation
 * Educational visualization of PKCS#7, Zero Padding, and ANSI X.923
 *
 * Padding ensures plaintext is a multiple of the block size,
 * which is required for block cipher modes like ECB and CBC.
 */

import type { PaddingScheme, PaddingStep } from '@/lib/types/padding';

export type { PaddingScheme, PaddingStep };

/**
 * Convert string to byte array
 */
function stringToBytes(str: string): number[] {
  return Array.from(str).map((ch) => ch.charCodeAt(0));
}

/**
 * Convert byte array to hex string
 */
function bytesToHex(bytes: number[]): string {
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join(' ');
}

/**
 * Convert byte array to displayable string (showing control chars as dots)
 */
function bytesToDisplay(bytes: number[]): string {
  return bytes.map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')).join('');
}

/**
 * Apply PKCS#7 padding
 * Each padding byte equals the number of padding bytes added
 * e.g., if 3 bytes of padding needed: [03, 03, 03]
 * If input is already block-aligned, add a full block of padding
 */
export function pkcs7Pad(data: number[], blockSize: number): number[] {
  const paddingNeeded = blockSize - (data.length % blockSize);
  const padding = new Array(paddingNeeded).fill(paddingNeeded);
  return [...data, ...padding];
}

/**
 * Remove PKCS#7 padding
 */
export function pkcs7Unpad(data: number[]): number[] {
  if (data.length === 0) return data;
  const lastByte = data[data.length - 1];
  if (lastByte < 1 || lastByte > data.length) {
    throw new Error('Invalid PKCS#7 padding');
  }
  // Verify all padding bytes are correct
  for (let i = data.length - lastByte; i < data.length; i++) {
    if (data[i] !== lastByte) {
      throw new Error('Invalid PKCS#7 padding');
    }
  }
  return data.slice(0, data.length - lastByte);
}

/**
 * Apply zero padding
 * Fill remaining bytes with 0x00
 * Note: ambiguous if original data ends with zeros
 */
export function zeroPad(data: number[], blockSize: number): number[] {
  const paddingNeeded = blockSize - (data.length % blockSize);
  if (paddingNeeded === blockSize && data.length > 0) return [...data];
  const padding = new Array(paddingNeeded === blockSize ? blockSize : paddingNeeded).fill(0);
  return [...data, ...padding];
}

/**
 * Remove zero padding (removes trailing zeros)
 */
export function zeroUnpad(data: number[]): number[] {
  let end = data.length;
  while (end > 0 && data[end - 1] === 0) {
    end--;
  }
  return data.slice(0, end);
}

/**
 * Apply ANSI X.923 padding
 * All padding bytes are 0x00 except the last, which is the count of padding bytes
 * e.g., if 3 bytes needed: [00, 00, 03]
 */
export function ansiX923Pad(data: number[], blockSize: number): number[] {
  const paddingNeeded = blockSize - (data.length % blockSize);
  const padding = new Array(paddingNeeded).fill(0);
  padding[padding.length - 1] = paddingNeeded;
  return [...data, ...padding];
}

/**
 * Remove ANSI X.923 padding
 */
export function ansiX923Unpad(data: number[]): number[] {
  if (data.length === 0) return data;
  const lastByte = data[data.length - 1];
  if (lastByte < 1 || lastByte > data.length) {
    throw new Error('Invalid ANSI X.923 padding');
  }
  return data.slice(0, data.length - lastByte);
}

/**
 * Apply padding with a given scheme
 */
export function pad(data: number[], blockSize: number, scheme: PaddingScheme): number[] {
  switch (scheme) {
    case 'pkcs7':
      return pkcs7Pad(data, blockSize);
    case 'zero':
      return zeroPad(data, blockSize);
    case 'ansi-x923':
      return ansiX923Pad(data, blockSize);
  }
}

/**
 * Remove padding with a given scheme
 */
export function unpad(data: number[], scheme: PaddingScheme): number[] {
  switch (scheme) {
    case 'pkcs7':
      return pkcs7Unpad(data);
    case 'zero':
      return zeroUnpad(data);
    case 'ansi-x923':
      return ansiX923Unpad(data);
  }
}

/**
 * Split byte array into blocks for display
 */
function splitIntoBlocks(data: number[], blockSize: number): number[][] {
  const blocks: number[][] = [];
  for (let i = 0; i < data.length; i += blockSize) {
    blocks.push(data.slice(i, i + blockSize));
  }
  return blocks;
}

/**
 * Get human-readable scheme name
 */
function schemeName(scheme: PaddingScheme): string {
  switch (scheme) {
    case 'pkcs7':
      return 'PKCS#7';
    case 'zero':
      return 'Zero Padding';
    case 'ansi-x923':
      return 'ANSI X.923';
  }
}

/**
 * Pad with detailed steps for visualization
 */
export function padWithSteps(
  input: string,
  blockSize: number,
  scheme: PaddingScheme
): PaddingStep[] {
  const steps: PaddingStep[] = [];
  let stepNumber = 0;
  const inputBytes = stringToBytes(input);

  // Step 1: Input
  steps.push({
    stepNumber: stepNumber++,
    type: 'input',
    title: 'Input Data',
    description: `The plaintext "${input}" needs to be padded so its length is a multiple of the block size before encryption.`,
    scheme,
    values: {
      plaintext: input,
      plaintextHex: bytesToHex(inputBytes),
      length: inputBytes.length,
      blockSize,
      scheme: schemeName(scheme),
    },
  });

  // Step 2: Measure
  const remainder = inputBytes.length % blockSize;
  const paddingNeeded =
    remainder === 0 && scheme === 'pkcs7'
      ? blockSize
      : remainder === 0 && inputBytes.length > 0
        ? 0
        : blockSize - remainder;

  steps.push({
    stepNumber: stepNumber++,
    type: 'measure',
    title: 'Measure Block Alignment',
    description:
      remainder === 0 && scheme !== 'pkcs7' && inputBytes.length > 0
        ? `Input is already aligned to the ${blockSize}-byte block size. ${scheme === 'zero' ? 'Zero padding adds nothing.' : 'ANSI X.923 adds a full block.'}`
        : `Input is ${inputBytes.length} bytes. With a ${blockSize}-byte block size, ${paddingNeeded} bytes of padding are needed.`,
    scheme,
    values: {
      inputLength: inputBytes.length,
      blockSize,
      remainder,
      paddingNeeded: paddingNeeded === 0 ? blockSize : paddingNeeded,
    },
  });

  // Step 3: Calculate padding bytes
  const actualPaddingNeeded = paddingNeeded === 0 ? blockSize : paddingNeeded;
  let paddingBytes: number[];

  switch (scheme) {
    case 'pkcs7':
      paddingBytes = new Array(actualPaddingNeeded).fill(actualPaddingNeeded);
      steps.push({
        stepNumber: stepNumber++,
        type: 'calculate-padding',
        title: 'Calculate PKCS#7 Padding',
        description: `Each padding byte is set to the number of padding bytes added (${actualPaddingNeeded}). This makes unpadding unambiguous -- the last byte always tells you how many to remove.`,
        scheme,
        values: {
          paddingValue: actualPaddingNeeded,
          paddingHex: bytesToHex(paddingBytes),
          rule: `All bytes = 0x${actualPaddingNeeded.toString(16).padStart(2, '0')}`,
        },
        paddingBytes,
      });
      break;

    case 'zero':
      paddingBytes = new Array(actualPaddingNeeded).fill(0);
      steps.push({
        stepNumber: stepNumber++,
        type: 'calculate-padding',
        title: 'Calculate Zero Padding',
        description: `Fill remaining bytes with 0x00. Warning: this scheme is ambiguous if the original data ends with zero bytes.`,
        scheme,
        values: {
          paddingHex: bytesToHex(paddingBytes),
          rule: 'All bytes = 0x00',
          warning: 'Cannot distinguish data zeros from padding zeros',
        },
        paddingBytes,
      });
      break;

    case 'ansi-x923': {
      paddingBytes = new Array(actualPaddingNeeded).fill(0);
      paddingBytes[paddingBytes.length - 1] = actualPaddingNeeded;
      steps.push({
        stepNumber: stepNumber++,
        type: 'calculate-padding',
        title: 'Calculate ANSI X.923 Padding',
        description: `All padding bytes are 0x00 except the last byte, which stores the padding count (${actualPaddingNeeded}). This is unambiguous like PKCS#7 but uses zeros for intermediate bytes.`,
        scheme,
        values: {
          paddingHex: bytesToHex(paddingBytes),
          lastByte: actualPaddingNeeded,
          rule: 'Zeros + count byte at end',
        },
        paddingBytes,
      });
      break;
    }
  }

  // Step 4: Apply padding
  const padded = pad(inputBytes, blockSize, scheme);
  steps.push({
    stepNumber: stepNumber++,
    type: 'apply-padding',
    title: 'Apply Padding',
    description: `Append the ${schemeName(scheme)} padding bytes to the original data. The result is now ${padded.length} bytes, a multiple of the ${blockSize}-byte block size.`,
    scheme,
    values: {
      originalHex: bytesToHex(inputBytes),
      paddedHex: bytesToHex(padded),
      paddedDisplay: bytesToDisplay(padded),
      totalLength: padded.length,
    },
    paddingBytes: paddingBytes!,
  });

  // Step 5: Show blocks
  const blocks = splitIntoBlocks(padded, blockSize);
  steps.push({
    stepNumber: stepNumber++,
    type: 'show-blocks',
    title: 'Block View',
    description: `The padded data splits evenly into ${blocks.length} block(s) of ${blockSize} bytes each. Each block can now be processed by a block cipher independently.`,
    scheme,
    values: {
      blockCount: blocks.length,
      blockSize,
    },
    blocks: blocks.map((b) => bytesToHex(b)),
    paddingBytes: paddingBytes!,
  });

  // Step 6: Verify (unpad)
  const unpadded = unpad(padded, scheme);
  steps.push({
    stepNumber: stepNumber,
    type: 'verify',
    title: 'Verify: Remove Padding',
    description: `After decryption, the padding is removed to recover the original data. The ${schemeName(scheme)} scheme ${scheme === 'zero' ? 'removes trailing zeros (ambiguous)' : 'reads the last byte to determine padding length (unambiguous)'}.`,
    scheme,
    values: {
      paddedHex: bytesToHex(padded),
      unpaddedHex: bytesToHex(unpadded),
      recoveredText: bytesToDisplay(unpadded),
      originalText: input,
      match: bytesToDisplay(unpadded) === input ? 'YES' : 'NO',
    },
  });

  return steps;
}

/**
 * Compare all three padding schemes side by side
 */
export function compareSchemes(
  input: string,
  blockSize: number
): Record<PaddingScheme, { padded: number[]; hex: string; blocks: string[] }> {
  const inputBytes = stringToBytes(input);
  const schemes: PaddingScheme[] = ['pkcs7', 'zero', 'ansi-x923'];

  const result = {} as Record<PaddingScheme, { padded: number[]; hex: string; blocks: string[] }>;

  for (const scheme of schemes) {
    const padded = pad(inputBytes, blockSize, scheme);
    const blocks = splitIntoBlocks(padded, blockSize);
    result[scheme] = {
      padded,
      hex: bytesToHex(padded),
      blocks: blocks.map((b) => bytesToHex(b)),
    };
  }

  return result;
}
