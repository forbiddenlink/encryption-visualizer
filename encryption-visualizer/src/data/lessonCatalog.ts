export interface Lesson {
  slug: string;
  title: string;
  category: string;
}

export const lessons: Lesson[] = [
  { slug: 'hashing', title: 'Hash Functions', category: 'Hashing' },
  { slug: 'aes', title: 'AES Encryption', category: 'Symmetric' },
  { slug: 'block-modes', title: 'Block Cipher Modes', category: 'Symmetric' },
  { slug: 'rsa', title: 'RSA Encryption', category: 'Asymmetric' },
  { slug: 'diffie-hellman', title: 'Diffie–Hellman', category: 'Key exchange' },
  { slug: 'signatures', title: 'Digital Signatures', category: 'Authentication' },
  { slug: 'tls', title: 'TLS Handshake', category: 'Protocols' },
  { slug: 'cryptanalysis', title: 'Cryptanalysis', category: 'Security' },
  { slug: 'ecc', title: 'Elliptic Curve Cryptography', category: 'Asymmetric' },
  { slug: 'password-hashing', title: 'Password Hashing', category: 'Hashing' },
  { slug: 'hmac', title: 'HMAC', category: 'Authentication' },
  { slug: 'padding', title: 'Padding Schemes', category: 'Symmetric' },
];
