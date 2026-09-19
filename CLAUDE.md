# CLAUDE.md

Guidance for Claude Code (and other AI agents via the AGENTS.md symlink) working in this repo.

## What this is

CryptoViz (repo name `encryption-visualizer`, GitHub forbiddenlink/EncryptionVisualizer) -
an interactive educational web app that visualizes cryptographic algorithms step by step:
AES-128 (FIPS 197), RSA key generation, ECC, Diffie-Hellman, hash functions, HMAC, digital
signatures, padding schemes, password hashing, TLS, and cryptanalysis, plus a glossary,
quizzes, and guided learning paths.

**The real application lives in the nested `encryption-visualizer/` subdirectory**, not at
this repo root. Run all commands below from inside that subdirectory. The outer root holds
deploy config
(`vercel.json`, `release-please-config.json`) and a large set of legacy planning/status
markdown files (`ARCHITECTURE_DIAGRAM.md`, `PROJECT_PLAN.md`, `TECH_SPEC.md`, `GAP_ANALYSIS.md`,
`START_HERE.md`, etc.) that are stale snapshots, not current documentation - the nested
`encryption-visualizer/docs/` directory duplicates several of the same filenames and is
similarly a point-in-time record, not living docs. Treat the code in
`encryption-visualizer/src/` as the source of truth over any of these `.md` files.

## Stack (in `encryption-visualizer/`)

- pnpm (`pnpm-lock.yaml`), React 19, TypeScript ~6.0, Vite 8
- Tailwind CSS 4, Zustand for state, `react-router-dom` v7 (lazy-loaded routes), Framer
  Motion for animation
- PostHog (`posthog-js`) for analytics
- `vite-plugin-pwa` (PWA support)
- ESLint (flat config, `eslint.config.js`: `@eslint/js`, `typescript-eslint`,
  `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react-refresh`) +
  Prettier (`.prettierrc`)
- Vitest for unit tests, Playwright for e2e (`e2e/`)

## Commands

Run from the nested `encryption-visualizer/` directory:

```bash
pnpm install
pnpm run dev          # Vite dev server
pnpm run build        # tsc -b && vite build
pnpm run lint         # ESLint
pnpm run preview      # preview a production build
pnpm test             # vitest (watch)
pnpm run test:run     # vitest run (single run)
pnpm run test:ui      # vitest UI
pnpm run test:e2e     # playwright test
pnpm run test:e2e:ui  # playwright test --ui
```

## Layout (inside the nested `encryption-visualizer/` dir)

- `src/lib/crypto/` - the actual algorithm implementations, one file (+ co-located
  `.test.ts`) per topic: `aes.ts`, `rsa.ts`, `ecc.ts`, `diffie-hellman.ts`, `hash.ts`,
  `hmac.ts`, `signatures.ts`, `padding.ts`, `password-hashing.ts`, `block-modes.ts`,
  `cryptanalysis.ts`, `tls.ts`
- `src/pages/` - one page per algorithm/topic (`AESPage.tsx`, `RSAPage.tsx`, `ECCPage.tsx`,
  etc.), plus `HomePage.tsx`, `ComparePage.tsx`, `LearningPathsPage.tsx`, `GlossaryPage.tsx`,
  `AboutPage.tsx`
- `src/router/` - `routes.ts` (route path constants) and `index.tsx` (the router, lazy-loads
  every page except `HomePage`)
- `src/store/` - Zustand stores: `themeStore`, `progressStore`, `visualizationStore`,
  `compareStore`, `accessibilityStore`, `toastStore`
- `src/components/{compare,controls,educational,glossary,layout,learning,seo,ui,
  visualizations}/` - shared UI, organized by concern
- `src/data/quizzes/` - quiz content
- `src/hooks/`, `src/lib/types/`, `src/lib/utils/`, `src/styles/`
- `src/test/` - test setup/utilities
- `e2e/` - Playwright specs (one per algorithm area: `aes.spec.ts`, `rsa.spec.ts`,
  `hashing.spec.ts`, `signatures.spec.ts`, `quiz.spec.ts`, `navigation.spec.ts`)
- `vercel.json` (nested) - security headers only (CSP, X-Frame-Options, etc); the outer
  root's `vercel.json` carries the actual `buildCommand`/`outputDirectory`

## Env vars

`VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST` (both read via `import.meta.env` in the nested app).

## CI

`.github/workflows/ci.yml` (inside the nested dir): pnpm install, lint, `tsc --noEmit`,
`pnpm run test:run`, `pnpm run build`, uploads `dist/` as a build artifact. Node 20, pnpm 9.

## Gotchas

- The outer root's `vercel.json` builds with
  `cd encryption-visualizer && npm install --legacy-peer-deps && npm run build` - it uses
  `npm`, not `pnpm`, even though the nested app's lockfile is `pnpm-lock.yaml`. Verify which
  package manager Vercel's build actually resolves before assuming pnpm is used in
  production.
- Root-level `.env.local` and the nested `encryption-visualizer/.env.local` are separate
  files; the app only reads the nested one at build/runtime.
