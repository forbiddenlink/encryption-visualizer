# CryptoViz - Encryption Visualizer

An interactive educational web app that animates cryptographic algorithms step by step. It is for students and developers who want to see how AES, RSA, hashing and related schemes work. It is a learning tool: the implementations favor clarity over security.

Live: <https://encryption-visualizer-zeta.vercel.app>

[![CI](https://github.com/forbiddenlink/encryption-visualizer/actions/workflows/ci.yml/badge.svg)](https://github.com/forbiddenlink/encryption-visualizer/actions/workflows/ci.yml)

## Features

Each topic has its own page with playback controls, step-by-step state, and explanations:

- AES-128 (FIPS 197) with round-by-round state matrices
- Block cipher modes
- RSA key generation and encryption
- Elliptic curve cryptography (ECC)
- Diffie-Hellman key exchange
- Hash functions, including SHA-256 (FIPS 180-4) and an avalanche demo
- HMAC
- Digital signatures
- Padding schemes
- Password hashing and key derivation
- TLS handshake
- Cryptanalysis

Around the visualizers:

- A compare page, a glossary and an about page
- Quizzes and guided learning paths with saved progress and achievements
- Keyboard shortcuts: Space (play or pause), left and right arrows (step), R (reset), Home and End (first and last step), 1 to 4 (speed), + and - (faster or slower)
- Light and dark themes
- Installable PWA (`vite-plugin-pwa`)

## Getting started

Prerequisites: Node and pnpm (the version is pinned in `package.json` under `packageManager`). No environment variables are needed.

```bash
pnpm install
pnpm dev          # dev server at http://localhost:3000
pnpm test:run     # unit tests
pnpm build        # type check and production build
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Vite dev server on port 3000 |
| `pnpm build` | `tsc -b` then `vite build` |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest in watch mode |
| `pnpm test:run` | Vitest single run |
| `pnpm test:ui` | Vitest UI |
| `pnpm test:e2e` | Playwright end-to-end tests (`e2e/`) |
| `pnpm test:e2e:ui` | Playwright UI mode |

## Tech stack

React 19, TypeScript, Vite 8, Tailwind CSS 4, Zustand, React Router 7, Framer Motion, Vitest and Playwright. PostHog is used for analytics.

## Project structure

```
src/
  components/   visualizations, educational (quizzes), controls, compare, learning, layout, ui
  lib/crypto/   algorithm implementations, one file and test per topic
  pages/        one page per topic, plus home, compare, learn, glossary, about
  router/       route constants and the lazy-loaded router
  store/        Zustand stores (visualization, progress, theme, compare, accessibility)
  data/         educational content, glossary, learning paths, achievements
e2e/            Playwright specs
```

## Security notice

These implementations are for education only. They prioritize visualization clarity over security and must not be used for real cryptography. In particular, the toy RSA and ECC demos use small parameters, and `src/lib/crypto/ecc.ts` generates keys with `Math.random()`. The simple hash in `src/lib/crypto/hash.ts` is FNV-1a, not SHA-256 (a real SHA-256 trace lives in `sha256.ts`).

## License

MIT. See the repository [LICENSE](../LICENSE).
