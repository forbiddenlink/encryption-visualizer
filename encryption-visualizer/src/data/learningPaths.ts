import { ROUTES } from '@/router/routes';

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  modules: LearningModule[];
}

export interface LearningModule {
  id: string;
  title: string;
  algorithmPage: string;
  prerequisites: string[];
  description: string;
}

export const learningPaths: LearningPath[] = [
  {
    id: 'fundamentals',
    title: 'Cryptography Fundamentals',
    description:
      'Build a solid foundation by understanding hashing, symmetric encryption, block cipher modes, and asymmetric encryption.',
    icon: 'BookOpen',
    difficulty: 'beginner',
    estimatedTime: '2 hours',
    modules: [
      {
        id: 'fund-hashing',
        title: 'Hash Functions',
        algorithmPage: ROUTES.HASHING,
        prerequisites: [],
        description:
          'Learn how one-way functions produce fixed-size digests and why the avalanche effect matters.',
      },
      {
        id: 'fund-aes',
        title: 'AES Symmetric Encryption',
        algorithmPage: ROUTES.AES,
        prerequisites: ['fund-hashing'],
        description:
          'Explore the worldwide standard for symmetric encryption and its substitution-permutation network.',
      },
      {
        id: 'fund-padding',
        title: 'Padding Schemes',
        algorithmPage: ROUTES.PADDING,
        prerequisites: ['fund-aes'],
        description:
          'Explore how padding fills incomplete blocks and why invalid padding must be handled carefully.',
      },
      {
        id: 'fund-block-modes',
        title: 'Block Cipher Modes',
        algorithmPage: ROUTES.BLOCK_MODES,
        prerequisites: ['fund-padding'],
        description:
          'Understand how ECB, CBC, and GCM handle multi-block encryption and why mode choice matters.',
      },
      {
        id: 'fund-rsa',
        title: 'RSA Asymmetric Encryption',
        algorithmPage: ROUTES.RSA,
        prerequisites: ['fund-aes'],
        description:
          'See how prime numbers create public/private key pairs for secure communication.',
      },
    ],
  },
  {
    id: 'key-exchange',
    title: 'Key Exchange & Authentication',
    description:
      'Learn how parties establish shared secrets and prove identity through Diffie-Hellman, digital signatures, and TLS.',
    icon: 'KeyRound',
    difficulty: 'intermediate',
    estimatedTime: '1.5 hours',
    modules: [
      {
        id: 'kx-dh',
        title: 'Diffie-Hellman Key Exchange',
        algorithmPage: ROUTES.DIFFIE_HELLMAN,
        prerequisites: [],
        description:
          'Discover how two parties can agree on a shared secret over an insecure channel.',
      },
      {
        id: 'kx-signatures',
        title: 'Digital Signatures',
        algorithmPage: ROUTES.SIGNATURES,
        prerequisites: ['kx-dh'],
        description:
          'Learn how cryptographic signatures prove authenticity and detect tampering.',
      },
      {
        id: 'kx-tls',
        title: 'TLS Handshake Overview',
        algorithmPage: ROUTES.TLS,
        prerequisites: ['kx-dh', 'kx-signatures'],
        description:
          'See how DH key exchange and signatures combine in the TLS handshake to secure the web.',
      },
    ],
  },
  {
    id: 'advanced-security',
    title: 'Advanced Security',
    description:
      'Dive deeper into cryptanalysis concepts, elliptic curve cryptography, password hashing, and message authentication.',
    icon: 'ShieldCheck',
    difficulty: 'advanced',
    estimatedTime: '2.5 hours',
    modules: [
      {
        id: 'adv-cryptanalysis',
        title: 'Cryptanalysis Concepts',
        algorithmPage: ROUTES.CRYPTANALYSIS,
        prerequisites: [],
        description:
          'Understand attack models, brute-force complexity, and why key size matters.',
      },
      {
        id: 'adv-ecc',
        title: 'Elliptic Curve Cryptography',
        algorithmPage: ROUTES.ECC,
        prerequisites: ['adv-cryptanalysis'],
        description:
          'Compare ECC to RSA and understand why shorter keys can provide equivalent security.',
      },
      {
        id: 'adv-password-hashing',
        title: 'Password Hashing',
        algorithmPage: ROUTES.PASSWORD_HASHING,
        prerequisites: ['adv-cryptanalysis'],
        description:
          'Learn why general-purpose hashes are unsuitable for passwords and how bcrypt/scrypt differ.',
      },
      {
        id: 'adv-hmac',
        title: 'HMAC & Message Authentication',
        algorithmPage: ROUTES.HMAC,
        prerequisites: ['adv-password-hashing'],
        description:
          'Explore keyed hashing for message authentication and integrity verification.',
      },
    ],
  },
];
