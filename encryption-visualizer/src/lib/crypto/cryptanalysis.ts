import type { CryptanalysisStep } from '@/lib/types/cryptanalysis';

// --- English letter frequencies (percentage) ---
const ENGLISH_FREQUENCIES: Record<string, number> = {
  A: 8.167, B: 1.492, C: 2.782, D: 4.253, E: 12.702,
  F: 2.228, G: 2.015, H: 6.094, I: 6.966, J: 0.153,
  K: 0.772, L: 4.025, M: 2.406, N: 6.749, O: 7.507,
  P: 1.929, Q: 0.095, R: 5.987, S: 6.327, T: 9.056,
  U: 2.758, V: 0.978, W: 2.360, X: 0.150, Y: 1.974,
  Z: 0.074,
};

// --- Caesar Cipher ---

export function caesarEncrypt(plaintext: string, shift: number): string {
  return plaintext
    .split('')
    .map((ch) => {
      if (/[a-zA-Z]/.test(ch)) {
        const base = ch === ch.toUpperCase() ? 65 : 97;
        return String.fromCharCode(((ch.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
      }
      return ch;
    })
    .join('');
}

export function caesarDecrypt(ciphertext: string, shift: number): string {
  return caesarEncrypt(ciphertext, 26 - (shift % 26));
}

export function caesarWithSteps(plaintext: string, shift: number): CryptanalysisStep[] {
  const steps: CryptanalysisStep[] = [];
  const ciphertext = caesarEncrypt(plaintext, shift);

  steps.push({
    stepNumber: 0,
    type: 'setup',
    attackType: 'frequency-analysis',
    title: 'Caesar Cipher Setup',
    description: `Encrypting plaintext with a shift of ${shift}. Each letter is moved ${shift} positions forward in the alphabet, wrapping around from Z back to A.`,
    values: {
      plaintext: plaintext.slice(0, 60),
      shift,
      algorithm: 'Caesar Cipher (shift cipher)',
    },
  });

  // Show a few letter transformations
  const sampleChars = plaintext
    .toUpperCase()
    .split('')
    .filter((ch) => /[A-Z]/.test(ch))
    .slice(0, 6);

  const transformations = sampleChars.map((ch) => {
    const encrypted = caesarEncrypt(ch, shift);
    return `${ch} -> ${encrypted}`;
  });

  steps.push({
    stepNumber: 1,
    type: 'analyze',
    attackType: 'frequency-analysis',
    title: 'Letter Transformation',
    description: `Each letter shifts by ${shift}: ${transformations.join(', ')}. Non-alphabetic characters remain unchanged.`,
    values: {
      'shift amount': shift,
      'alphabet size': 26,
      'effective shift': ((shift % 26) + 26) % 26,
    },
  });

  steps.push({
    stepNumber: 2,
    type: 'result',
    attackType: 'frequency-analysis',
    title: 'Encryption Complete',
    description: 'The plaintext has been encrypted using the Caesar cipher.',
    values: {
      plaintext: plaintext.slice(0, 60),
      ciphertext: ciphertext.slice(0, 60),
      shift,
    },
  });

  return steps;
}

// --- Frequency Analysis Attack ---

export function countLetterFrequencies(text: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (let i = 65; i <= 90; i++) {
    counts[String.fromCharCode(i)] = 0;
  }
  for (const ch of text.toUpperCase()) {
    if (/[A-Z]/.test(ch)) {
      counts[ch]++;
    }
  }
  return counts;
}

export function getLetterCount(text: string): number {
  return text.split('').filter((ch) => /[a-zA-Z]/.test(ch)).length;
}

export function suggestShifts(ciphertext: string): { shift: number; score: number }[] {
  const counts = countLetterFrequencies(ciphertext);
  const totalLetters = getLetterCount(ciphertext);
  if (totalLetters === 0) return [];

  const results: { shift: number; score: number }[] = [];

  for (let shift = 0; shift < 26; shift++) {
    let score = 0;
    for (let i = 0; i < 26; i++) {
      const cipherLetter = String.fromCharCode(65 + i);
      const plainLetter = String.fromCharCode(65 + ((i - shift + 26) % 26));
      const observedFreq = (counts[cipherLetter] / totalLetters) * 100;
      const expectedFreq = ENGLISH_FREQUENCIES[plainLetter];
      // Chi-squared-like score (lower is better match)
      score += ((observedFreq - expectedFreq) ** 2) / expectedFreq;
    }
    results.push({ shift, score });
  }

  return results.sort((a, b) => a.score - b.score);
}

export function frequencyAnalysisAttack(ciphertext: string): CryptanalysisStep[] {
  const steps: CryptanalysisStep[] = [];
  const counts = countLetterFrequencies(ciphertext);
  const totalLetters = getLetterCount(ciphertext);

  // Step 0: Setup
  steps.push({
    stepNumber: 0,
    type: 'setup',
    attackType: 'frequency-analysis',
    title: 'Frequency Analysis: Setup',
    description: 'We have intercepted a ciphertext encrypted with a simple substitution cipher (Caesar). Our goal is to determine the shift key by analyzing letter frequencies.',
    values: {
      ciphertext: ciphertext.slice(0, 80),
      'total letters': totalLetters,
      'unique letters': Object.values(counts).filter((c) => c > 0).length,
    },
  });

  if (totalLetters === 0) {
    steps.push({
      stepNumber: 1,
      type: 'result',
      attackType: 'frequency-analysis',
      title: 'No Letter Frequencies to Analyze',
      description: 'Enter text containing English letters A-Z. Without letters, frequency analysis cannot suggest a Caesar shift.',
      values: { 'total letters': 0 },
    });
    return steps;
  }

  // Step 1: Count frequencies
  const freqData = Object.entries(counts)
    .map(([letter, count]) => ({
      letter,
      count,
      expected: Math.round((ENGLISH_FREQUENCIES[letter] / 100) * totalLetters * 100) / 100,
    }))
    .sort((a, b) => b.count - a.count);

  steps.push({
    stepNumber: 1,
    type: 'analyze',
    attackType: 'frequency-analysis',
    title: 'Count Letter Frequencies',
    description: 'Counting how often each letter appears in the ciphertext. In English, E (~12.7%), T (~9.1%), and A (~8.2%) are the most common letters. If a different letter dominates, it likely maps to E.',
    frequencyData: freqData,
    progress: 25,
  });

  // Step 2: Compare with English
  const topCipher = freqData[0]?.letter || 'E';
  const suggestedShift = ((topCipher.charCodeAt(0) - 69 + 26) % 26); // 69 = 'E'

  steps.push({
    stepNumber: 2,
    type: 'analyze',
    attackType: 'frequency-analysis',
    title: 'Compare with English Frequencies',
    description: `The most frequent letter in the ciphertext is "${topCipher}". In English, the most frequent letter is "E". If ${topCipher} maps to E, the shift would be ${suggestedShift}. Let's verify with a statistical comparison.`,
    frequencyData: freqData,
    values: {
      'most frequent in ciphertext': topCipher,
      'expected most frequent': 'E',
      'suggested shift': suggestedShift,
    },
    progress: 50,
  });

  // Step 3: Rank all possible shifts
  const rankedShifts = suggestShifts(ciphertext);
  const topShifts = rankedShifts.slice(0, 5);

  steps.push({
    stepNumber: 3,
    type: 'analyze',
    attackType: 'frequency-analysis',
    title: 'Rank Candidate Shifts',
    description: 'Using chi-squared analysis to rank all 26 possible shifts. Lower score means the decrypted frequency distribution is closer to English.',
    values: {
      'best shift': topShifts[0]?.shift ?? 0,
      'best score': Math.round((topShifts[0]?.score ?? 0) * 100) / 100,
      '2nd best shift': topShifts[1]?.shift ?? 0,
      '3rd best shift': topShifts[2]?.shift ?? 0,
    },
    progress: 75,
  });

  // Step 4: Try decryption with best shift
  const bestShift = topShifts[0]?.shift ?? 0;
  const decrypted = caesarDecrypt(ciphertext, bestShift);

  steps.push({
    stepNumber: 4,
    type: 'breakthrough',
    attackType: 'frequency-analysis',
    title: 'Decryption Attempt',
    description: `Decrypting with the most likely shift of ${bestShift}. If the result is readable English, we have successfully broken the cipher!`,
    values: {
      'shift used': bestShift,
      decrypted: decrypted.slice(0, 80),
    },
    progress: 90,
  });

  // Step 5: Result
  steps.push({
    stepNumber: 5,
    type: 'result',
    attackType: 'frequency-analysis',
    title: 'Attack Complete',
    description: `The best candidate shift is ${bestShift}, based on resemblance to English letter frequencies. This is a statistical guess, not confirmed recovery; short or non-English messages may rank the wrong key. Inspect the candidate plaintext to evaluate it.`,
    values: {
      'candidate key': bestShift,
      'decrypted text': decrypted.slice(0, 100),
      'attack complexity': '26 comparisons (trivial)',
    },
    frequencyData: freqData,
    progress: 100,
  });

  return steps;
}

// --- Brute Force Attack Demo ---

export function bruteForceAttack(ciphertext: string, expectedPlaintext?: string): CryptanalysisStep[] {
  const steps: CryptanalysisStep[] = [];

  // Step 0: Setup
  steps.push({
    stepNumber: 0,
    type: 'setup',
    attackType: 'brute-force',
    title: 'Brute Force Attack: Setup',
    description: 'A brute force attack tries every possible key until the correct one is found. For Caesar cipher with 26 possible shifts, this is trivial. For modern ciphers, the key space is astronomically large.',
    values: {
      'key space (Caesar)': 26,
      'key space (DES)': '2^56 = 72 quadrillion',
      'key space (AES-128)': '2^128 = 3.4 x 10^38',
      'key space (AES-256)': '2^256 = 1.2 x 10^77',
    },
  });

  // Steps 1-3: Try shifts
  const allAttempts: { key: string | number; result: string; isCorrect: boolean }[] = [];
  let foundShift = -1;

  for (let shift = 0; shift < 26; shift++) {
    const decrypted = caesarDecrypt(ciphertext, shift);
    const isCorrect = expectedPlaintext
      ? decrypted === expectedPlaintext
      : false;
    allAttempts.push({
      key: shift,
      result: decrypted.slice(0, 40),
      isCorrect,
    });
    if (isCorrect && foundShift === -1) {
      foundShift = shift;
    }
  }

  // Show first batch of attempts
  steps.push({
    stepNumber: 1,
    type: 'attempt',
    attackType: 'brute-force',
    title: 'Trying Keys 0-8',
    description: 'Systematically trying each possible shift value. For Caesar cipher this takes microseconds. Each attempt decrypts the full message and checks if it makes sense.',
    attempts: allAttempts.slice(0, 9),
    progress: 35,
  });

  steps.push({
    stepNumber: 2,
    type: 'attempt',
    attackType: 'brute-force',
    title: 'Trying Keys 9-17',
    description: 'Continuing through the key space. In a real brute force attack on AES-256, even checking one trillion keys per second would take longer than the age of the universe.',
    attempts: allAttempts.slice(9, 18),
    progress: 69,
  });

  steps.push({
    stepNumber: 3,
    type: 'attempt',
    attackType: 'brute-force',
    title: 'Trying Keys 18-25',
    description: 'Final batch of keys. One of these 26 shifts must be the correct one.',
    attempts: allAttempts.slice(18, 26),
    progress: 100,
  });

  // Step 4: Key space comparison
  steps.push({
    stepNumber: 4,
    type: 'analyze',
    attackType: 'brute-force',
    title: 'Key Space Comparison',
    description: 'Why brute force works for Caesar but not for modern ciphers. The time to brute force grows exponentially with key size.',
    values: {
      'Caesar (5 bits)': '< 1 microsecond',
      'DES (56 bits)': '~1 day (dedicated hardware)',
      'AES-128': '~10^18 years (all computers on Earth)',
      'AES-256': '~10^50 years (heat death of universe: 10^100 years)',
    },
  });

  // Step 5: Result
  const bestGuess = foundShift >= 0
    ? foundShift
    : suggestShifts(ciphertext)[0]?.shift ?? 0;
  const bestDecrypted = caesarDecrypt(ciphertext, bestGuess);

  steps.push({
    stepNumber: 5,
    type: 'result',
    attackType: 'brute-force',
    title: 'Brute Force Complete',
    description: foundShift >= 0
      ? `Found the correct key: shift = ${foundShift}. All 26 keys were tested in negligible time. This demonstrates why short key lengths are fundamentally insecure.`
      : `All 26 keys tested. The most likely key is shift = ${bestGuess}. Modern encryption uses key sizes of 128-256 bits, making brute force computationally infeasible.`,
    values: {
      'best key': bestGuess,
      'decrypted text': bestDecrypted.slice(0, 100),
      'total attempts': 26,
      'time required': '< 1 millisecond',
    },
    attempts: allAttempts.filter((a) => a.isCorrect).length > 0
      ? allAttempts.filter((a) => a.isCorrect)
      : [allAttempts[bestGuess]],
    progress: 100,
  });

  return steps;
}

// --- Padding Oracle Attack (Simplified Educational Demo) ---

export function paddingOracleAttack(): CryptanalysisStep[] {
  const steps: CryptanalysisStep[] = [];

  steps.push({
    stepNumber: 0,
    type: 'setup',
    attackType: 'padding-oracle',
    title: 'Padding Oracle Attack: Setup',
    description: 'CBC mode uses PKCS#7 padding to fill the last block. A "padding oracle" is a server that tells us whether the padding is valid when we send it modified ciphertext. This tiny information leak lets us recover the entire plaintext without knowing the key.',
    values: {
      'target mode': 'CBC (without MAC)',
      'block size': '16 bytes (128 bits)',
      'padding scheme': 'PKCS#7',
      'vulnerability': 'Server reveals valid/invalid padding',
    },
  });

  steps.push({
    stepNumber: 1,
    type: 'analyze',
    attackType: 'padding-oracle',
    title: 'Understanding PKCS#7 Padding',
    description: 'PKCS#7 adds N bytes of value N to fill the last block. For example: if 3 bytes are needed, append 03 03 03. The server decrypts and checks if padding is valid. If we modify the ciphertext, the padding check may fail -- and the server tells us!',
    values: {
      '1 byte padding': '01',
      '2 byte padding': '02 02',
      '3 byte padding': '03 03 03',
      'full block padding': '16 bytes of 0x10',
    },
  });

  steps.push({
    stepNumber: 2,
    type: 'analyze',
    attackType: 'padding-oracle',
    title: 'The CBC Decryption Weakness',
    description: 'In CBC decryption: Plaintext[i] = Decrypt(Ciphertext[i]) XOR Ciphertext[i-1]. If we modify a byte in Ciphertext[i-1], it changes the corresponding plaintext byte after decryption. By carefully choosing modifications, we can force valid padding.',
    values: {
      formula: 'P[i] = D(C[i]) XOR C[i-1]',
      'attack vector': 'Modify C[i-1] to control P[i]',
      'oracle response': 'Valid padding = 200 OK, Invalid = 500 Error',
    },
  });

  steps.push({
    stepNumber: 3,
    type: 'attempt',
    attackType: 'padding-oracle',
    title: 'Recovering the Last Byte',
    description: 'To find the last byte of plaintext: try all 256 values for the last byte of C[i-1]. When the server accepts the padding, we know the decrypted last byte XORed with our modified byte equals 0x01 (valid 1-byte padding). From this we recover the original plaintext byte.',
    attempts: [
      { key: '0x00', result: 'Invalid padding (500)', isCorrect: false },
      { key: '0x01', result: 'Invalid padding (500)', isCorrect: false },
      { key: '...', result: '(trying all 256 values)', isCorrect: false },
      { key: '0xA7', result: 'Valid padding! (200)', isCorrect: true },
    ],
    values: {
      'max attempts per byte': 256,
      'bytes per block': 16,
      'total for one block': '256 x 16 = 4,096 requests',
    },
    progress: 50,
  });

  steps.push({
    stepNumber: 4,
    type: 'breakthrough',
    attackType: 'padding-oracle',
    title: 'Recovering Full Plaintext',
    description: 'Repeat for each byte position, working backwards through the block. Then move to the next block. The entire plaintext can be recovered with at most 256 x 16 = 4,096 requests per block. No key is ever needed!',
    values: {
      'byte 16 recovered': 'H (0x48)',
      'byte 15 recovered': 'e (0x65)',
      'byte 14 recovered': 'l (0x6C)',
      'bytes remaining': '13 more per block',
    },
    progress: 75,
  });

  steps.push({
    stepNumber: 5,
    type: 'result',
    attackType: 'padding-oracle',
    title: 'Attack Complete',
    description: 'The padding oracle attack demonstrates why CBC mode MUST be used with a MAC (Message Authentication Code). Without authentication, an attacker can recover the full plaintext using only ~4,096 requests per 16-byte block. Real-world attacks like POODLE and BEAST exploited variants of this vulnerability.',
    values: {
      'defense': 'Always use authenticated encryption (GCM) or encrypt-then-MAC',
      'real attacks': 'POODLE (SSL 3.0), BEAST (TLS 1.0), Lucky13',
      'requests needed': '~4,096 per block (very practical)',
      'key required': 'No! Only oracle access needed',
    },
    progress: 100,
  });

  return steps;
}

// --- Timing Attack (Conceptual Demo) ---

export function timingAttack(): CryptanalysisStep[] {
  const steps: CryptanalysisStep[] = [];

  steps.push({
    stepNumber: 0,
    type: 'setup',
    attackType: 'timing-attack',
    title: 'Timing Attack: Setup',
    description: 'A timing attack exploits the fact that naive string comparison (like checking a password or MAC) stops at the first mismatched byte. By measuring how long the comparison takes, an attacker can determine how many leading bytes are correct.',
    values: {
      'attack type': 'Side-channel (timing)',
      'target': 'Byte-by-byte string comparison',
      'measurement': 'Response time in nanoseconds',
    },
  });

  steps.push({
    stepNumber: 1,
    type: 'analyze',
    attackType: 'timing-attack',
    title: 'Vulnerable Comparison',
    description: 'A naive comparison function checks each byte sequentially and returns false immediately on mismatch. If the first byte is wrong, it returns in ~1ns. If the first 5 bytes match, it takes ~5ns. This timing difference leaks information!',
    values: {
      'code': 'if (input[i] !== secret[i]) return false',
      'first byte wrong': '~100ns (1 comparison)',
      'first 5 bytes correct': '~500ns (5 comparisons)',
      'all bytes correct': '~3200ns (32 comparisons)',
    },
  });

  steps.push({
    stepNumber: 2,
    type: 'attempt',
    attackType: 'timing-attack',
    title: 'Exploiting the Timing Leak',
    description: 'The attacker tries all 256 values for the first byte, measuring response time. The value that takes the longest has matched the first byte. Then repeat for byte 2, 3, etc.',
    attempts: [
      { key: 'AA...', result: '102ns (no match)', isCorrect: false },
      { key: 'AB...', result: '98ns (no match)', isCorrect: false },
      { key: 'AC...', result: '205ns (LONGER!)', isCorrect: true },
      { key: 'AD...', result: '101ns (no match)', isCorrect: false },
    ],
    values: {
      'byte 1': 'Found: 0xAC (longest response)',
      'attempts per byte': 256,
      'total for 32-byte key': '256 x 32 = 8,192 attempts',
    },
    progress: 40,
  });

  steps.push({
    stepNumber: 3,
    type: 'analyze',
    attackType: 'timing-attack',
    title: 'Constant-Time Comparison',
    description: 'The defense is to always compare ALL bytes regardless of mismatches. XOR each byte pair and OR the results together. The function always takes the same time, leaking no information.',
    values: {
      'safe code': 'result |= input[i] ^ secret[i]',
      'time (all wrong)': '~3200ns (always checks all)',
      'time (all correct)': '~3200ns (same!)',
      'timing difference': '0ns (no leak)',
    },
  });

  steps.push({
    stepNumber: 4,
    type: 'breakthrough',
    attackType: 'timing-attack',
    title: 'Comparison: Vulnerable vs Safe',
    description: 'Vulnerable code: an attacker needs only ~8,192 attempts to recover a 32-byte secret. With constant-time comparison, brute force would require 2^256 attempts -- computationally impossible.',
    values: {
      'vulnerable: attempts needed': '~8,192 (linear in key length)',
      'safe: attempts needed': '2^256 (exponential in key length)',
      'speedup for attacker': '~10^74 times easier if vulnerable!',
    },
    progress: 80,
  });

  steps.push({
    stepNumber: 5,
    type: 'result',
    attackType: 'timing-attack',
    title: 'Timing Attack: Lessons',
    description: 'Timing attacks show that security is not just about algorithms -- implementation matters. Always use constant-time operations for security-critical comparisons. Most crypto libraries provide safe comparison functions (e.g., crypto.timingSafeEqual in Node.js).',
    values: {
      'defense': 'Use constant-time comparison functions',
      'real attacks': 'Kocher 1996 (RSA), remote timing on TLS',
      'other side channels': 'Power analysis, electromagnetic, cache timing',
      'key principle': 'Execution time must not depend on secret values',
    },
    progress: 100,
  });

  return steps;
}
