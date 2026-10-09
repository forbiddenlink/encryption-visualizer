# CryptoViz — existing site profile

Captured 2026-10-08 on branch `design/upgrade`, before application changes.

CryptoViz is an open-source educational web app that makes cryptographic algorithms understandable through interactive visualizations, explanations, and quizzes.

Audience: students, developers learning security fundamentals, and curious learners (explicitly described by the About page). Primary visitor action: choose a topic, run an experiment, inspect its transformations, and test understanding. A guided learning path is the better entry point for a beginner; AES remains an existing direct entry point.

## Source of truth and runtime

The application is `encryption-visualizer/src/`, built with React 19.2.8, TypeScript 6.0.3, Vite 8.2.2, Tailwind 4.3.3, React Router 7.18.3, Zustand 5.0.15 and Framer Motion 13.1.0 (locked package metadata). No runtime pin exists in the repository. Installed Node 22.23.1 used for this work; CI documentation specifies Node 20. Global pnpm 12.6 ignores package.json overrides, so dependencies were installed frozen with pnpm 9.15.9. No lockfile changes.

## Route and template inventory

Each row has an actual full-page Chromium capture at 1440×1000 and 390×844. Paths are relative to this document. Every route loaded with an h1 and without a page exception. See `before-browser.json` for rendered headings, actions and overflow checks.

| Route | Template / distinctive content | Desktop | Mobile |
|---|---|---|---|
| / | Homepage: hero, cipher lab, 12 topic cards, learning CTA, feature summary | [Before](screenshots/before/home-1440.png) | [Before](screenshots/before/home-390.png) |
| /aes | AES input, state matrix, playback, educational sidebar, quiz | [Before](screenshots/before/aes-1440.png) | [Before](screenshots/before/aes-390.png) |
| /rsa | Prime-size selection, key generation, encrypt/decrypt, quiz | [Before](screenshots/before/rsa-1440.png) | [Before](screenshots/before/rsa-390.png) |
| /ecc | Curve-size selection, finite-field graph, point operations, quiz | [Before](screenshots/before/ecc-1440.png) | [Before](screenshots/before/ecc-390.png) |
| /block-modes | Mode selection, ECB/CBC diagrams, pattern demonstration, quiz | [Before](screenshots/before/block-modes-1440.png) | [Before](screenshots/before/block-modes-390.png) |
| /diffie-hellman | Parameters, exchange visualization, playground, quiz | [Before](screenshots/before/diffie-hellman-1440.png) | [Before](screenshots/before/diffie-hellman-390.png) |
| /hashing | Hash input, avalanche demo, playground, quiz | [Before](screenshots/before/hashing-1440.png) | [Before](screenshots/before/hashing-390.png) |
| /hmac | Key/message inputs, keyed-hash steps, educational content, quiz | [Before](screenshots/before/hmac-1440.png) | [Before](screenshots/before/hmac-390.png) |
| /signatures | Key generation, sign/verify, tampering demo, quiz | [Before](screenshots/before/signatures-1440.png) | [Before](screenshots/before/signatures-390.png) |
| /padding | Scheme/block-size selection, byte blocks, removal, quiz | [Before](screenshots/before/padding-1440.png) | [Before](screenshots/before/padding-390.png) |
| /password-hashing | Password/cost controls, stretching simulation, quiz | [Before](screenshots/before/password-hashing-1440.png) | [Before](screenshots/before/password-hashing-390.png) |
| /tls | Protocol explanations, message-flow playback, quiz | [Before](screenshots/before/tls-1440.png) | [Before](screenshots/before/tls-390.png) |
| /cryptanalysis | Attack selection, frequency chart, brute force, quiz | [Before](screenshots/before/cryptanalysis-1440.png) | [Before](screenshots/before/cryptanalysis-390.png) |
| /compare | Algorithm comparison panels, controls, security/performance/use-case charts | [Before](screenshots/before/compare-1440.png) | [Before](screenshots/before/compare-390.png) |
| /learn | Three path cards, path-detail module list, progress and achievement badges | [Before](screenshots/before/learn-1440.png) | [Before](screenshots/before/learn-390.png) |
| /glossary | Search, six category filters, term grid, related terms, no-results state | [Before](screenshots/before/glossary-1440.png) | [Before](screenshots/before/glossary-390.png) |
| /about | Mission, topic overview, educational-purpose notice, GitHub links | [Before](screenshots/before/about-1440.png) | [Before](screenshots/before/about-390.png) |

## Shared design and components

- `Layout`: fixed header, skip link, constrained main (max 1280px), route transitions, toast container; no footer.
- `Header`: five grouped algorithm menus, four utility destinations, theme controls; mobile menu with all destinations. Desktop dropdowns rely on hover, not button state. Header is overcrowded at desktop breakpoint; mobile menu has no viewport-height limit.
- Tokens: `tailwind.config.js` cyber cyan #06b6d4, blue #3b82f6, purple #8b5cf6, dark #020617, surface #0f172a, white/5 borders, 12px cards. Slate utilities are used extensively outside tokens.
- Fonts: CSS requests Inter (300–900) and JetBrains Mono (400–700) from Google Fonts. Request order follows Tailwind import; actual rendered font requires verification. Native sans and monospace fallbacks exist.
- Shared `glass-card`, `glass-card-hover`, `btn-primary`, `btn-secondary`, inputs, matrix cells and tooltip styles live in `index.css`.
- Shared behavior: playback controls, expandable EducationalCard, QuizSystem/Question/Results, error boundary, skeletons, input feedback, progress indicators, toasts, theme selector, PWA install/offline indicators and JSON-LD.
- No CMS, database, user authentication, server API or paid services in the inspected application. Content is local TypeScript: 12 educational-content datasets, 12 quiz datasets, glossary, learning paths, achievements and schema metadata. Crypto algorithms have co-located unit tests.

## Current user journeys and gaps

1. Home → topic → enter/load example → run → inspect/play/pause/rewind → expand explanations → quiz → results/review missed answers. Includes AES, RSA, hashes, signatures and newer topic labs.
2. Home → learning paths → choose curriculum → start/continue → module. Module-completion and achievement store methods have no calling integration; several module destinations are stale placeholders. Progress is local browser storage, not synced across devices.
3. Header → compare → select algorithms → compare security/performance/use cases.
4. Header → glossary → query/category → read term. Related terms are text spans, so cannot be followed directly.
5. Theme selection → persisted light/dark/system; install PWA and offline indicator.

Observed defects relevant to upgrade: dark-mode homepage cards use white surfaces with white headings (`glass-card-hover` lacks its own dark resting style); fixed header overlaps the top of the mobile AES page; mobile home takes a long scroll to reach topics; no footer; all initial browser titles are identical; no global topic search; learning path progress/achievements are not wired to real learning actions. Exact input/error/success behavior has not yet been exercised in this phase; initial states only were captured.

## Unknowns

No reliable analytics, audience conversion data, live production configuration, learner interviews, brand guidelines or intended learning outcomes were supplied. No claims about adoption, completion rates or educational certification will be invented. Simulated/educational algorithms must remain distinguished from production-ready cryptography. Root and nested legacy planning documents are not treated as current facts.
