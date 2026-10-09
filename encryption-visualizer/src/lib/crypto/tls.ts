import { randomInteger } from './random';
/**
 * TLS 1.3 Handshake Simulation for Educational Visualization
 *
 * IMPORTANT SECURITY NOTICE:
 * This is an EDUCATIONAL implementation only. DO NOT use in production.
 * - Uses simplified key derivation for visualization clarity
 * - Real TLS uses proper HKDF, X25519/P-256, and full certificate chains
 *
 * Demonstrates how TLS 1.3 orchestrates multiple cryptographic primitives:
 * - Diffie-Hellman for key exchange
 * - AES-GCM for symmetric encryption
 * - Digital signatures for certificate verification
 * - HKDF for key derivation
 */

import type { TLSStep, TLSSession } from '../types/tls';

function randomHex(bytes: number): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}

function simplifiedHKDF(secret: string, label: string): string {
  // Educational simplification of HKDF-Expand
  // Real HKDF uses HMAC-SHA256 with proper extract-then-expand
  let hash = 0;
  const input = secret + label;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

function generateDHKeyPair(): { privateKey: number; publicKey: number; p: number; g: number } {
  // Small primes for educational visualization
  const p = 23;
  const g = 5;
  const privateKey = randomInteger(2, p - 2);

  let publicKey = 1;
  for (let i = 0; i < privateKey; i++) {
    publicKey = (publicKey * g) % p;
  }

  return { privateKey, publicKey, p, g };
}

function computeSharedSecret(otherPublic: number, privateKey: number, p: number): number {
  let secret = 1;
  for (let i = 0; i < privateKey; i++) {
    secret = (secret * otherPublic) % p;
  }
  return secret;
}

export function simulateTLSHandshake(): TLSSession {
  const clientRandom = randomHex(32);
  const serverRandom = randomHex(32);
  const cipherSuite = 'TLS_AES_128_GCM_SHA256';

  // DH key exchange
  const clientDH = generateDHKeyPair();
  const serverDH = {
    privateKey: randomInteger(2, clientDH.p - 2),
    publicKey: 0,
    p: clientDH.p,
    g: clientDH.g,
  };
  let pub = 1;
  for (let i = 0; i < serverDH.privateKey; i++) {
    pub = (pub * serverDH.g) % serverDH.p;
  }
  serverDH.publicKey = pub;

  const sharedSecret = computeSharedSecret(serverDH.publicKey, clientDH.privateKey, clientDH.p);

  // Derive keys
  const handshakeSecret = simplifiedHKDF(sharedSecret.toString(), 'handshake');
  const clientHandshakeKey = simplifiedHKDF(handshakeSecret, 'c_hs_traffic');
  const serverHandshakeKey = simplifiedHKDF(handshakeSecret, 's_hs_traffic');
  const masterSecret = simplifiedHKDF(handshakeSecret, 'derived_master');
  const clientAppKey = simplifiedHKDF(masterSecret, 'c_ap_traffic');
  const serverAppKey = simplifiedHKDF(masterSecret, 's_ap_traffic');

  // Simulated certificate signature
  const certSignature = randomHex(16);
  const certFingerprint = randomHex(20);

  const steps: TLSStep[] = [
    {
      stepNumber: 0,
      type: 'client-hello',
      title: 'ClientHello',
      description: 'The client initiates the handshake by sending supported cipher suites, a random nonce, and its ephemeral Diffie-Hellman key share. In TLS 1.3, the key share is sent in the first message (unlike TLS 1.2), saving a full round trip.',
      actor: 'client',
      protocol: 'TLS 1.3',
      cipherSuite: 'TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256',
      values: {
        'Client Random': clientRandom.substring(0, 16) + '...',
        'Key Share (g^a mod p)': clientDH.publicKey,
        'Supported Versions': 'TLS 1.3',
        'DH Prime (p)': clientDH.p,
        'DH Generator (g)': clientDH.g,
      },
      dataExchanged: {
        direction: 'client-to-server',
        encrypted: false,
        content: 'Cipher suites, random, key share, extensions',
      },
    },
    {
      stepNumber: 1,
      type: 'server-hello',
      title: 'ServerHello',
      description: 'The server responds with its chosen cipher suite, its own random nonce, and its ephemeral DH key share. After this message, both sides have enough information to compute the shared secret.',
      actor: 'server',
      protocol: 'TLS 1.3',
      cipherSuite,
      values: {
        'Server Random': serverRandom.substring(0, 16) + '...',
        'Key Share (g^b mod p)': serverDH.publicKey,
        'Chosen Cipher Suite': cipherSuite,
        'Selected Version': 'TLS 1.3',
      },
      dataExchanged: {
        direction: 'server-to-client',
        encrypted: false,
        content: 'Chosen cipher suite, random, key share',
      },
    },
    {
      stepNumber: 2,
      type: 'key-share',
      title: 'Shared Secret Computation',
      description: 'Both client and server independently compute the same shared secret using Diffie-Hellman. The client computes (server_public)^client_private mod p, and the server computes (client_public)^server_private mod p. Both arrive at the same value.',
      actor: 'both',
      values: {
        'Client computes': `${serverDH.publicKey}^${clientDH.privateKey} mod ${clientDH.p}`,
        'Server computes': `${clientDH.publicKey}^${serverDH.privateKey} mod ${clientDH.p}`,
        'Shared Secret': sharedSecret,
        'Algorithm': 'Diffie-Hellman (ECDHE in production)',
      },
    },
    {
      stepNumber: 3,
      type: 'derive-keys',
      title: 'Key Derivation (HKDF)',
      description: 'The shared secret is fed into HKDF (HMAC-based Key Derivation Function) to produce separate encryption keys for each direction. This ensures the client and server use different keys, and handshake keys are separate from application data keys.',
      actor: 'both',
      values: {
        'Handshake Secret': handshakeSecret,
        'Client Handshake Key': clientHandshakeKey,
        'Server Handshake Key': serverHandshakeKey,
        'Master Secret': masterSecret,
        'Algorithm': 'HKDF-SHA256',
      },
    },
    {
      stepNumber: 4,
      type: 'certificate',
      title: 'Server Certificate',
      description: 'The server sends its certificate (now encrypted with the handshake key). The certificate contains the server\'s identity and public key, signed by a trusted Certificate Authority (CA). The client verifies the certificate chain up to a trusted root CA.',
      actor: 'server',
      cipherSuite,
      values: {
        'Subject': 'example.com',
        'Issuer': "Let's Encrypt Authority X3",
        'Fingerprint': certFingerprint.substring(0, 16) + '...',
        'Valid Until': '2027-01-15',
        'Key Type': 'ECDSA P-256',
      },
      dataExchanged: {
        direction: 'server-to-client',
        encrypted: true,
        content: 'X.509 certificate chain',
      },
    },
    {
      stepNumber: 5,
      type: 'verify',
      title: 'Certificate Verify',
      description: 'The server proves it owns the private key corresponding to the certificate by signing a hash of the entire handshake transcript. This prevents an attacker from replaying a stolen certificate. The client verifies this signature using the certificate\'s public key.',
      actor: 'server',
      values: {
        'Signature Algorithm': 'ECDSA-SHA256',
        'Transcript Hash': randomHex(12) + '...',
        'Signature': certSignature + '...',
        'Verification': 'RSA/ECDSA signature check',
      },
      dataExchanged: {
        direction: 'server-to-client',
        encrypted: true,
        content: 'Digital signature of handshake transcript',
      },
    },
    {
      stepNumber: 6,
      type: 'finished',
      title: 'Finished Messages',
      description: 'Both sides send a Finished message containing a MAC (Message Authentication Code) of the entire handshake transcript. This proves neither side\'s messages were tampered with during the handshake. The server sends its Finished first, then the client responds.',
      actor: 'both',
      values: {
        'Server Finished MAC': simplifiedHKDF(serverHandshakeKey, 'finished'),
        'Client Finished MAC': simplifiedHKDF(clientHandshakeKey, 'finished'),
        'Transcript verified': 'Yes',
        'Algorithm': 'HMAC-SHA256',
      },
    },
    {
      stepNumber: 7,
      type: 'application-data',
      title: 'Encrypted Application Data',
      description: 'The handshake is complete. All application data (HTTP requests, responses, etc.) is now encrypted with AES-128-GCM using the derived application traffic keys. Each side uses a different key, and each record has a unique nonce to prevent replay attacks.',
      actor: 'both',
      cipherSuite,
      values: {
        'Client App Key': clientAppKey,
        'Server App Key': serverAppKey,
        'Encryption': 'AES-128-GCM',
        'Record Nonce': randomHex(12),
        'Forward Secrecy': 'Yes (ephemeral DH keys)',
      },
      dataExchanged: {
        direction: 'client-to-server',
        encrypted: true,
        content: 'GET / HTTP/1.1 (encrypted)',
      },
    },
  ];

  return {
    clientRandom,
    serverRandom,
    cipherSuite,
    sharedSecret,
    masterSecret,
    steps,
  };
}
