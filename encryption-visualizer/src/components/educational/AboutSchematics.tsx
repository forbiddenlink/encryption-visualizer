import type { ReactNode } from 'react';

/**
 * Archival insignia medallion for the field guide about page.
 * Uses the canonical isometric crystalline vault brand mark with scientific coordinate rings.
 */
export const AtlasInsignia = (): ReactNode => {
  return (
    <div className="relative inline-flex items-center justify-center mb-6">
      <svg
        viewBox="0 0 96 96"
        width="96"
        height="96"
        fill="none"
        className="text-[var(--accent)]"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="48" cy="48" r="46" stroke="var(--line)" strokeWidth="1" />
        <circle cx="48" cy="48" r="40" stroke="var(--line)" strokeWidth="0.75" strokeDasharray="3 3" />
        <circle cx="48" cy="48" r="46" fill="var(--surface)" fillOpacity="0.6" />

        {/* Cardinal tick marks */}
        <line x1="48" y1="2" x2="48" y2="8" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="48" y1="88" x2="48" y2="94" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="2" y1="48" x2="8" y2="48" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="88" y1="48" x2="94" y2="48" stroke="var(--accent)" strokeWidth="1.5" />

        {/* Vault mark geometry */}
        <g transform="translate(48, 48) scale(1.6) translate(-18, -18)">
          <path
            d="M18 2 32 10v16l-14 8L4 26V10L18 2Z"
            stroke="var(--accent)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="m4 10 14 8 14-8M18 18v16"
            stroke="var(--accent)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M11 6v16l14 8M25 6v16l-14 8"
            stroke="var(--ink)"
            strokeOpacity="0.4"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="18" r="3" fill="var(--ink)" />
          <circle cx="18" cy="18" r="1.5" fill="var(--accent)" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Three pillars of modern cryptography scientific plate schematic.
 * Illustrates Symmetric Ciphers, Asymmetric Exchange, and One-Way Verification.
 */
export const CryptographicPillarsSchematic = (): ReactNode => {
  return (
    <figure className="my-8 rounded-card border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4 mb-6">
        <div>
          <span className="eyebrow block">PLATE II: TAXONOMY OF TRUST</span>
          <h3 className="text-lg font-medium text-[var(--ink)] mt-1">
            Three Foundations of Modern Cryptography
          </h3>
        </div>
        <span className="font-mono text-xs text-[var(--muted)]">
          FIPS 197 / RFC 7748 / FIPS 180-4
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Symmetric */}
        <div className="flex flex-col rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-5">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] mb-3">
            <span>01: SYMMETRIC</span>
            <span className="text-[var(--accent)]">SHARED KEY</span>
          </div>
          <div className="h-32 flex items-center justify-center my-2">
            <svg viewBox="0 0 160 100" className="w-full h-full max-w-[180px]" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              {/* 4x4 matrix */}
              <g transform="translate(15, 15)">
                <rect x="0" y="0" width="48" height="48" stroke="var(--line)" />
                <line x1="12" y1="0" x2="12" y2="48" stroke="var(--line)" />
                <line x1="24" y1="0" x2="24" y2="48" stroke="var(--line)" />
                <line x1="36" y1="0" x2="36" y2="48" stroke="var(--line)" />
                <line x1="0" y1="12" x2="48" y2="12" stroke="var(--line)" />
                <line x1="0" y1="24" x2="48" y2="24" stroke="var(--line)" />
                <line x1="0" y1="36" x2="48" y2="36" stroke="var(--line)" />
                <rect x="13" y="13" width="10" height="10" fill="var(--accent)" stroke="var(--accent)" />
              </g>
              {/* Transformation arrow */}
              <path d="M72 39H88" stroke="var(--accent)" strokeWidth="1.5" />
              <path d="M84 35L88 39L84 43" stroke="var(--accent)" strokeWidth="1.5" />
              <text x="80" y="32" textAnchor="middle" fontSize="8" fill="var(--accent)" stroke="none" fontFamily="var(--font-mono)">Round</text>
              {/* Output block */}
              <g transform="translate(97, 15)">
                <rect x="0" y="0" width="48" height="48" stroke="var(--line)" />
                <line x1="12" y1="0" x2="12" y2="48" stroke="var(--line)" />
                <line x1="24" y1="0" x2="24" y2="48" stroke="var(--line)" />
                <line x1="36" y1="0" x2="36" y2="48" stroke="var(--line)" />
                <line x1="0" y1="12" x2="48" y2="12" stroke="var(--line)" />
                <line x1="0" y1="24" x2="48" y2="24" stroke="var(--line)" />
                <line x1="0" y1="36" x2="48" y2="36" stroke="var(--line)" />
                <rect x="25" y="25" width="10" height="10" fill="var(--accent)" stroke="var(--accent)" />
              </g>
              <text x="80" y="84" textAnchor="middle" fontSize="9" fill="var(--muted)" stroke="none" fontFamily="var(--font-mono)">AES: SubBytes, Shift, Mix</text>
            </svg>
          </div>
          <h4 className="font-medium text-[var(--ink)] text-sm mb-1">State Permutations</h4>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Fast bulk encryption using a single shared key. Data is organized into blocks and scrambled through rounds of substitution, permutation, and linear mixing.
          </p>
        </div>

        {/* Pillar 2: Asymmetric */}
        <div className="flex flex-col rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-5">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] mb-3">
            <span>02: ASYMMETRIC</span>
            <span className="text-[var(--accent)]">KEY PAIR</span>
          </div>
          <div className="h-32 flex items-center justify-center my-2">
            <svg viewBox="0 0 160 100" className="w-full h-full max-w-[180px]" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              {/* Coordinate axis */}
              <line x1="15" y1="52" x2="145" y2="52" stroke="var(--line)" />
              <line x1="45" y1="15" x2="45" y2="88" stroke="var(--line)" />
              {/* Elliptic curve */}
              <path d="M40 52 C40 32, 60 30, 80 34 C105 38, 125 45, 145 22" stroke="var(--accent)" strokeWidth="1.6" />
              <path d="M40 52 C40 72, 60 74, 80 70 C105 66, 125 59, 145 82" stroke="var(--accent)" strokeWidth="1.6" />
              {/* Secant line */}
              <line x1="56" y1="71" x2="135" y2="28" stroke="var(--ink)" strokeOpacity="0.4" strokeDasharray="3 2" />
              <circle cx="74" cy="61" r="3" fill="var(--accent)" />
              <circle cx="118" cy="37" r="3" fill="var(--accent)" />
              <text x="74" y="75" textAnchor="middle" fontSize="8" fill="var(--ink)" stroke="none" fontFamily="var(--font-mono)">P</text>
              <text x="118" y="30" textAnchor="middle" fontSize="8" fill="var(--ink)" stroke="none" fontFamily="var(--font-mono)">Q</text>
              <text x="80" y="96" textAnchor="middle" fontSize="9" fill="var(--muted)" stroke="none" fontFamily="var(--font-mono)">RSA / ECC / Diffie-Hellman</text>
            </svg>
          </div>
          <h4 className="font-medium text-[var(--ink)] text-sm mb-1">Trapdoor Mathematics</h4>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Public key encryption and key exchange. Built upon mathematical problems that are easy to compute in one direction but intractable to reverse without a private trapdoor.
          </p>
        </div>

        {/* Pillar 3: Hashing */}
        <div className="flex flex-col rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-5">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] mb-3">
            <span>03: HASHING</span>
            <span className="text-[var(--accent)]">ONE-WAY</span>
          </div>
          <div className="h-32 flex items-center justify-center my-2">
            <svg viewBox="0 0 160 100" className="w-full h-full max-w-[180px]" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              {/* Multi-line message input */}
              <rect x="15" y="24" width="36" height="36" stroke="var(--line)" />
              <line x1="20" y1="32" x2="45" y2="32" stroke="var(--line)" />
              <line x1="20" y1="42" x2="45" y2="42" stroke="var(--line)" />
              <line x1="20" y1="52" x2="38" y2="52" stroke="var(--line)" />
              {/* Compression funnel */}
              <path d="M51 42H70L86 32V52L70 42" stroke="var(--accent)" strokeWidth="1.4" />
              {/* Output digest blocks */}
              <g transform="translate(96, 32)">
                <rect x="0" y="0" width="48" height="20" stroke="var(--accent)" fill="var(--accent)" fillOpacity="0.1" />
                <line x1="12" y1="0" x2="12" y2="20" stroke="var(--accent)" />
                <line x1="24" y1="0" x2="24" y2="20" stroke="var(--accent)" />
                <line x1="36" y1="0" x2="36" y2="20" stroke="var(--accent)" />
                <circle cx="6" cy="10" r="1.5" fill="var(--accent)" />
                <circle cx="18" cy="10" r="1.5" fill="var(--accent)" />
                <circle cx="30" cy="10" r="1.5" fill="var(--accent)" />
                <circle cx="42" cy="10" r="1.5" fill="var(--accent)" />
              </g>
              <text x="33" y="70" textAnchor="middle" fontSize="8" fill="var(--muted)" stroke="none" fontFamily="var(--font-mono)">Input bytes</text>
              <text x="120" y="62" textAnchor="middle" fontSize="8" fill="var(--accent)" stroke="none" fontFamily="var(--font-mono)">256-bit Digest</text>
              <text x="80" y="96" textAnchor="middle" fontSize="9" fill="var(--muted)" stroke="none" fontFamily="var(--font-mono)">SHA-256 / HMAC / Signatures</text>
            </svg>
          </div>
          <h4 className="font-medium text-[var(--ink)] text-sm mb-1">Fixed Compression</h4>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Deterministic cryptographic digests. Transforms arbitrary input bytes into a fixed-length fingerprint where even a single bit flip changes the resulting digest completely.
          </p>
        </div>
      </div>

      <figcaption className="mt-4 pt-4 border-t border-[var(--line)] text-xs text-[var(--muted)] font-mono">
        Fig. 04: The cryptographic trifecta powering modern transport security (TLS 1.3).
      </figcaption>
    </figure>
  );
};
