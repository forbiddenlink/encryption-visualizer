/**
 * Simplified Hash Function for Educational Visualization
 *
 * IMPORTANT: This uses FNV-1a (32-bit) for simplicity, NOT SHA-256.
 * Real-world applications should use Web Crypto API's SHA-256.
 * This implementation prioritizes visualization clarity over cryptographic security.
 */

import type { HashStep } from '@/lib/types';
export type { HashStep };

export function simpleHash(input: string): string {
  let hash = 0x811c9dc5; // FNV offset basis
  
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash *= 0x01000193; // FNV prime
    hash = hash >>> 0; // Convert to 32-bit unsigned
  }
  
  return hash.toString(16).padStart(8, '0');
}

export function stringToBinary(str: string): string {
  return Array.from(str)
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

export function demonstrateAvalancheEffect(input: string): Array<{
  input: string;
  hash: string;
  bitsChanged: number;
}> {
  const results = [];
  const originalHash = simpleHash(input);
  
  results.push({
    input: input,
    hash: originalHash,
    bitsChanged: 0,
  });
  
  const variations = [
    input + ' ', // Add space
    input.slice(0, -1), // Remove last character
    input.charAt(0).toUpperCase() + input.slice(1), // Capitalize first
    input.toLowerCase(), // All lowercase
    input.toUpperCase(), // All uppercase
  ];
  
  variations.forEach(variant => {
    if (variant !== input) {
      const variantHash = simpleHash(variant);
      const bitsChanged = countBitDifference(originalHash, variantHash);
      results.push({
        input: variant,
        hash: variantHash,
        bitsChanged,
      });
    }
  });
  
  return results;
}

function countBitDifference(hash1: string, hash2: string): number {
  let count = 0;
  const maxLength = Math.max(hash1.length, hash2.length);
  
  for (let i = 0; i < maxLength; i++) {
    const byte1 = parseInt(hash1[i] || '0', 16);
    const byte2 = parseInt(hash2[i] || '0', 16);
    const xor = byte1 ^ byte2;
    
    // Count set bits in XOR result
    let bits = xor;
    while (bits) {
      count += bits & 1;
      bits >>= 1;
    }
  }
  
  return count;
}

export function hashWithSteps(input: string): HashStep[] {
  const steps: HashStep[] = [];
  let stepNumber = 0;
  
  steps.push({
    stepNumber: stepNumber++,
    type: 'input',
    title: 'Input Message',
    description: `Original input: "${input}". This is the message we want to hash.`,
    data: {
      input,
    },
  });
  
  const binary = stringToBinary(input.slice(0, 16)); // Limit for display
  steps.push({
    stepNumber: stepNumber++,
    type: 'preprocessing',
    title: 'Convert to Binary',
    description: 'The message is converted to binary (8 bits per character) for processing.',
    data: {
      input,
      binary,
    },
  });
  
  steps.push({
    stepNumber: stepNumber++,
    type: 'initialization',
    title: 'Initialize Hash Value',
    description: 'Start with an initial hash value (based on FNV-1a algorithm for this demo).',
    data: {
      input,
      hash: '811c9dc5',
    },
  });
  
  const chunks = input.match(/.{1,4}/g) || [input];
  steps.push({
    stepNumber: stepNumber++,
    type: 'compression',
    title: 'Process Message',
    description: 'The message is processed in chunks, mixing bits through XOR and multiplication operations.',
    data: {
      input,
      chunks,
    },
  });
  
  const finalHash = simpleHash(input);
  steps.push({
    stepNumber: stepNumber,
    type: 'output',
    title: 'Final Hash Output',
    description: `The final 32-bit hash (8 hexadecimal characters): ${finalHash}. Note: This is a simplified FNV-1a hash for educational purposes. Production systems use SHA-256 (256-bit) or similar.`,
    data: {
      input,
      hash: finalHash,
    },
  });
  
  return steps;
}

export function compareHashes(input1: string, input2: string): {
  input1: string;
  hash1: string;
  input2: string;
  hash2: string;
  similarity: number;
  bitsChanged: number;
} {
  const hash1 = simpleHash(input1);
  const hash2 = simpleHash(input2);
  const bitsChanged = countBitDifference(hash1, hash2);
  const totalBits = hash1.length * 4; // 4 bits per hex character
  const similarity = Math.round((1 - bitsChanged / totalBits) * 100);
  
  return {
    input1,
    hash1,
    input2,
    hash2,
    similarity,
    bitsChanged,
  };
}
