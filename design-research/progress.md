# Upgrade progress

Branch: `design/upgrade`. Started 2026-10-08. Goal: complete the seven requested phases without merging or deploying.

## Phase 1 — complete

- Mapped all 17 routes and existing shared components/content/stores.
- 34 real Chromium desktop/mobile screenshots saved in `screenshots/before/`.
- `profile.md` records features, journeys, unknowns and observed defects.
- `before-browser.json` records initial-load evidence; no application errors. Initial states only, not functional journey verification.
- Dependencies installed frozen using Node 22.23.1 and pnpm 9.15.9; global pnpm 12.6 was incompatible with current override placement. No dependency/config changes.
- Existing untracked root `CLAUDE.md` is user-owned and excluded from commits.

## Phase 2 — complete

- 15 live reference candidates captured; all four requested galleries attempted with explicit blocked/redirect evidence. Animation-heavy references recaptured after 15 seconds; final inspection recorded in references.md.
- Ten peer key pages loaded and screenshotted; visible/offered feature inventory in `features.md`. Authenticated capabilities were not independently tested.
- `references.md` links gallery provenance and actual live screenshots; blockers and limited captures are explicit.

## Phase 3 — complete

`plan.md` sets the field-guide direction, precise tokens/type/layout/motion, ranked safe features, every-route work and verification gates.

## Phase 4 — complete

- Implemented semantic ink/paper/olive tokens, serif display hierarchy, shared surfaces/forms/buttons, sticky navigation with keyboard/mobile menus, footer, and homepage topic catalog with combined search/category filters.
- Retained all routes, topic content and features. Introductory cipher demo now handles empty input, uses selected-button semantics and improves contrast/touch targets.
- Two screenshot/score/fix rounds plus final confirmation in both themes. Final homepage rubric: 4/5 in all eight dimensions; see `home-review.md` for specific changes and evidence.
- Fresh typecheck and production build pass. 12 unit suites / 367 tests pass. Ten homepage/navigation Chromium tests pass. Changed discovery/layout/tests pass targeted lint.
- Full lint is blocked by pre-existing minimatch override / jsx-a11y compatibility (`_minimatch.default is not a function`); resolve in Phase 6 without disabling the rule. Build warns about the existing large initial chunk and future Vite native-config compatibility; performance measurements are pending.
- All 17 routes have initial desktop/mobile foundation captures with no page exceptions or overflow (`foundation-browser.json`). **These are smoke checks, not completed page upgrades or complete state testing.**

## Phase 5 — complete

- Applied the field-guide design to every template, with desktop/mobile captures in both themes and individual eight-dimension scores in `rollout-review.md`. Two review/fix rounds plus final corrections; all final editorial dimensions score 4/5.
- Added lesson identity/anchors/continuation, local resume, functioning quiz-to-curriculum progress and achievement derivation, correct existing module destinations, actual comparison playback, AES controls, hashing speed, glossary related navigation and clear educational simulation scope.
- Fixed inline RSA validation, form labels/mobile rows, mobile cryptanalysis timeline overflow and selected-filter appearance. Route transitions atomically clear incompatible lab frames without altering persistent learning data.
- Browser results: 24 lab-state checks, 14 quiz/curriculum/glossary checks, 10 secondary-feature checks, 8 utility/recovery checks, plus a separate active-lab transition check. Focused session-reset retests are recorded separately. All passed at the respective latest runs; see JSON evidence and `rollout-review.md` for limits.
- Fresh build/typecheck and 371 unit tests pass. New components/stores/tests pass targeted lint. Comprehensive lint/Lighthouse/all-page accessibility and the complete pre-existing e2e suite remain Phase 6.
- Global pnpm 12 attempted an automatic incompatible reinstall during a build; stopped it, restored frozen dependencies with pnpm 9.15.9, and reran build/unit checks. Package manifest/lockfile are unchanged. Use direct local tool binaries or explicitly pnpm 9.15.9; do not use the global pnpm for checks.

| Template / route | Status | Verification |
|---|---|---|
| Homepage `/` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| AES `/aes` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| RSA `/rsa` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| ECC `/ecc` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| Block modes `/block-modes` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| Diffie–Hellman `/diffie-hellman` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| Hashing `/hashing` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| HMAC `/hmac` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| Signatures `/signatures` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| Padding `/padding` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| Password hashing `/password-hashing` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| TLS `/tls` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| Cryptanalysis `/cryptanalysis` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| Comparison `/compare` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| Learning paths `/learn` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| Glossary `/glossary` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |
| About `/about` | done | Desktop/mobile review and applicable states; evidence in rollout-review.md |

## Remaining

6. Complete full build/typecheck/lint/tests, Lighthouse and production/browser journey verification; fix measured regressions and commit.
7. Write final report with every before/after pair, features, scores, blockers and complete approval backlog; commit and stop without merge/deploy.

## Resume checkpoint

Context grew long; stopped at the completed Phase 5 boundary as requested. Resume Phase 6 from this checkpoint. Do not repeat research or initial template rollout. Read `rollout-review.md` for evidence and outstanding limits. Fix the existing minimatch override / jsx-a11y crash without disabling accessibility rules, run the complete original plus added browser suites (some original selectors may need updating for the upgraded navigation), audit production Lighthouse/accessibility, and test offline navigation against the production service worker. Existing large initial bundle warning and future Vite native-config warning remain to assess. Production deployments/main must remain untouched. No risky backlog work has been performed. Phase 7 report has not been written because full verification remains unfinished.

## Reproduction

From nested app: `mise exec node@22.23.1 -- ./node_modules/.bin/vite --host 127.0.0.1 --port 3002`.
From root: `mise exec node@22.23.1 -- node design-research/capture.cjs rollout-final` (browser launch needs unsandboxed execution on this macOS host).

Browser tests from nested app: `PLAYWRIGHT_JSON_OUTPUT_NAME=../design-research/verification-results.json mise exec node@22.23.1 -- ./node_modules/.bin/playwright test --config ../design-research/playwright.config.ts --workers=1 --reporter=line,json`. This config uses installed Chrome, so cached Playwright Chromium revisions are unnecessary. Browser/server launch requires unsandboxed execution on this host. The dev server is on 127.0.0.1:3002; do not start duplicate servers if it is already running. Prefer direct local `tsc -b`, `vite build`, `vitest run` and `eslint` through mise for checks, or explicitly use `npx --yes pnpm@9.15.9`.
