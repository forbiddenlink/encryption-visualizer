import { lessons } from '@/data/lessonCatalog';
import { ROUTES } from '@/router/routes';

export const SITE_URL = 'https://encryption-visualizer-zeta.vercel.app';
export const SITE_NAME = 'CryptoViz';

export interface RouteSeo {
  title: string;
  description: string;
  canonical?: string;
}

const LESSON_DESCRIPTIONS: Record<string, string> = {
  hashing: 'See how SHA-256 and other hash functions turn any input into a fixed fingerprint, step by step, with live avalanche effect demos.',
  aes: 'Watch AES encrypt a block through SubBytes, ShiftRows, MixColumns and AddRoundKey, with every round state visualized.',
  'block-modes': 'Compare ECB, CBC, CTR and GCM block cipher modes and see why ECB leaks patterns while the others do not.',
  rsa: 'Generate RSA keys, encrypt and decrypt with modular arithmetic, and see why factoring large primes keeps messages safe.',
  'diffie-hellman': 'Walk through a Diffie-Hellman key exchange with small numbers and see two parties agree on a secret in public.',
  signatures: 'Sign and verify messages with digital signatures and see how tampering with a single bit breaks verification.',
  tls: 'Follow a TLS handshake message by message: hello, key exchange, certificates and the switch to encrypted traffic.',
  cryptanalysis: 'Break classical ciphers with frequency analysis and other attacks to see why weak encryption fails.',
  ecc: 'Explore elliptic curve cryptography with point addition and scalar multiplication on an interactive curve.',
  'password-hashing': 'Compare bcrypt, scrypt and Argon2 password hashing and see how cost factors slow down attackers.',
  hmac: 'Build an HMAC from a hash function and a secret key, and see how it authenticates a message.',
  padding: 'See how PKCS#7 and other padding schemes fill the last block, and how padding errors can leak data.',
};

const PAGE_SEO: Record<string, { title: string; description: string }> = {
  [ROUTES.HOME]: {
    title: 'Interactive Encryption Visualizer',
    description: 'Master AES, RSA, and SHA-256 through interactive, realtime visualizations. The most intuitive way to learn cryptography.',
  },
  [ROUTES.COMPARE]: {
    title: 'Algorithm Comparison',
    description: 'Compare encryption, hashing and signature algorithms side by side: key sizes, speed, security margins and typical uses.',
  },
  [ROUTES.LEARNING_PATHS]: {
    title: 'Learning Paths',
    description: 'Follow guided learning paths through cryptography, from hashing and symmetric encryption to key exchange and TLS.',
  },
  [ROUTES.GLOSSARY]: {
    title: 'Crypto Glossary',
    description: 'Plain-language definitions of cryptography terms, from block cipher and nonce to elliptic curve and zero-knowledge.',
  },
  [ROUTES.ABOUT]: {
    title: 'About CryptoViz',
    description: 'About CryptoViz: an open source, interactive cryptography field guide built to make encryption concepts visible.',
  },
};

export function getRouteSeo(pathname: string): RouteSeo {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const lesson = lessons.find((item) => `/${item.slug}` === path);
  const page = lesson
    ? { title: lesson.title, description: LESSON_DESCRIPTIONS[lesson.slug] }
    : PAGE_SEO[path];
  if (!page) {
    return { title: 'Page not found', description: 'This page does not exist. Head back to the CryptoViz home page.' };
  }
  return {
    title: page.title,
    description: page.description,
    canonical: `${SITE_URL}${path}`,
  };
}

export function formatTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}
