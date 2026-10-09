export type Algorithm = 'AES' | 'RSA' | 'SHA-256';

export interface VisualizationState {
  algorithm: Algorithm;
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number; // 0.5x to 4x
}

export interface AESStep {
  stepNumber: number;
  type: 'initial' | 'subBytes' | 'shiftRows' | 'mixColumns' | 'addRoundKey' | 'final';
  title: string;
  description: string;
  state: number[][];
  roundKey?: number[][];
  highlightCells?: { row: number; col: number }[];
  roundNumber?: number;
}

export interface RSAStep {
  stepNumber: number;
  type: 'prime-selection' | 'modulus-calculation' | 'phi-calculation' | 'e-selection' | 'd-calculation' | 'encryption' | 'decryption' | 'complete';
  title: string;
  description: string;
  values?: {
    p?: number;
    q?: number;
    n?: number;
    phi?: number;
    e?: number;
    d?: number;
    message?: number;
    encrypted?: number;
    decrypted?: number;
  };
  formula?: string;
  calculation?: string;
}

export interface RSAKeyPair {
  publicKey: {
    n: number;
    e: number;
  };
  privateKey: {
    n: number;
    d: number;
  };
  p: number;
  q: number;
  phi: number;
}

export interface HashStep {
  stepNumber: number;
  type: 'input' | 'preprocessing' | 'initialization' | 'compression' | 'output';
  title: string;
  description: string;
  data?: {
    input?: string;
    binary?: string;
    padded?: string;
    chunks?: string[];
    hash?: string;
    roundValues?: string[];
    algorithm?: 'SHA-256' | 'FNV-1a';
    sha256?: {
      blockIndex: number;
      blockCount: number;
      round?: number;
      word?: string;
      constant?: string;
      temp1?: string;
      temp2?: string;
    };
  };
}

export interface SignatureStep {
  stepNumber: number;
  type: 'message-input' | 'hash-generation' | 'sign-hash' | 'signature-complete'
      | 'verify-input' | 'verify-hash' | 'decrypt-signature' | 'compare-hashes' | 'verify-result';
  title: string;
  description: string;
  values?: {
    message?: string;
    messageHash?: string;
    signature?: number;
    decryptedHash?: string;
    isValid?: boolean;
    n?: number;
    e?: number;
    d?: number;
  };
  formula?: string;
  calculation?: string;
}

export interface BlockModeStep {
  type: 'input' | 'split-blocks' | 'encrypt-block' | 'xor-operation' | 'output';
  mode: 'ecb' | 'cbc' | 'gcm';
  stepNumber: number;
  title: string;
  description: string;
  blocks?: string[];
  currentBlock?: number;
  iv?: string;
  previousCiphertext?: string;
  counter?: number;
  authTag?: string;
  values?: Record<string, string | number>;
}

export interface DHStep {
  type: 'setup' | 'alice-private' | 'alice-public' | 'bob-private' | 'bob-public' | 'alice-shared' | 'bob-shared' | 'complete';
  stepNumber: number;
  title: string;
  description: string;
  values?: Record<string, string | number>;
  formula?: string;
  calculation?: string;
  actor?: 'system' | 'alice' | 'bob';
}

export interface DHParams {
  p: number;
  g: number;
  alicePrivate: number;
  alicePublic: number;
  bobPrivate: number;
  bobPublic: number;
  sharedSecret: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number; // Index of correct option (0-3)
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
