# CryptoViz - Encryption Visualizer

An interactive educational web application for visualizing cryptographic algorithms. Watch AES, RSA, and hash functions work step-by-step.

[![CI](https://github.com/forbiddenlink/EncryptionVisualizer/actions/workflows/ci.yml/badge.svg)](https://github.com/forbiddenlink/EncryptionVisualizer/actions/workflows/ci.yml)

## Features

- **AES-128 Visualization** - FIPS 197 compliant implementation with round-by-round state matrix display
- **RSA Key Generation** - Interactive prime selection, modular arithmetic, and encryption/decryption
- **Hash Functions** - Avalanche effect demonstration with bit-level visualization
- **Educational Content** - Glossary, quizzes, and explanations for each algorithm
- **Keyboard Shortcuts** - Space (play/pause), arrows (step), 1-4 (speed)
- **Dark/Light Mode** - System preference detection with manual toggle

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests
pnpm test:run

# Build for production
pnpm build
```

## Tech Stack

- **React 19** + TypeScript
- **Vite** - Build tooling
- **Zustand** - State management
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Vitest** - Testing

## Project Structure

```
src/
├── components/
│   ├── visualizations/   # AES, RSA, Hash visualizers
│   ├── educational/      # Quiz system, cards
│   ├── controls/         # Playback controls
│   └── ui/               # Theme toggle, error boundary
├── lib/crypto/           # Algorithm implementations
├── pages/                # AES, RSA, Hashing, Glossary, About
├── store/                # Zustand stores
└── data/                 # Educational content, quizzes
```

## Security Notice

These implementations are for **educational purposes only**. They prioritize visualization clarity over cryptographic security:

- AES-128: FIPS 197 compliant
- RSA: Uses small primes and Math.random() (not secure)
- Hash: Simplified FNV-1a (not SHA-256)

Do not use for production cryptography.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server on port 3000 |
| `pnpm build` | Type check and build |
| `pnpm test:run` | Run all tests |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview production build |

## License

MIT
