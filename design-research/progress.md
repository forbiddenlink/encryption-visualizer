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

## Phase 5 — not started

| Template / route | Status | Remaining |
|---|---|---|
| Homepage `/` | done (Phase 4) | Final Lighthouse/journey checks in Phase 6 |
| AES `/aes` | pending | Individual redesign, states, desktop/mobile rubric |
| RSA `/rsa` | pending | Individual redesign, states, desktop/mobile rubric |
| ECC `/ecc` | pending | Individual redesign, states, desktop/mobile rubric |
| Block modes `/block-modes` | pending | Individual redesign, states, desktop/mobile rubric |
| Diffie–Hellman `/diffie-hellman` | pending | Individual redesign, states, desktop/mobile rubric |
| Hashing `/hashing` | pending | Individual redesign, states, desktop/mobile rubric |
| HMAC `/hmac` | pending | Individual redesign, states, desktop/mobile rubric |
| Signatures `/signatures` | pending | Individual redesign, states, desktop/mobile rubric |
| Padding `/padding` | pending | Individual redesign, states, desktop/mobile rubric |
| Password hashing `/password-hashing` | pending | Individual redesign, states, desktop/mobile rubric |
| TLS `/tls` | pending | Individual redesign, states, desktop/mobile rubric |
| Cryptanalysis `/cryptanalysis` | pending | Individual redesign, states, desktop/mobile rubric |
| Comparison `/compare` | pending | Individual redesign, states, desktop/mobile rubric |
| Learning paths `/learn` | pending | Individual redesign, verify module links/progress/achievements |
| Glossary `/glossary` | pending | Individual redesign, search/filter/related/empty states |
| About `/about` | pending | Individual redesign and verified content/links |

## Remaining

5. Roll out every route with desktop/mobile states and scoring.
6. Build/typecheck/lint/tests, Lighthouse and browser journeys.
7. Final report with before/after evidence, scores and approval list.

## Resume checkpoint

Context grew long; stopped at the completed Phase 4 boundary as requested. Continue Phase 5 using `plan.md`, `profile.md` and `features.md`. Do not repeat research or mark foundation-only captures as completed page reviews. Commit each subsequent phase on `design/upgrade`; do not merge/deploy. Existing root `CLAUDE.md` remains untracked and untouched. No risky work listed in `needs-approval.md` has been performed. The final Phase 7 report has not been written because rollout and verification remain unfinished.

## Reproduction

From nested app: `mise exec node@22.23.1 -- ./node_modules/.bin/vite --host 127.0.0.1 --port 3002`.
From root: `mise exec node@22.23.1 -- node design-research/capture.cjs before` (browser launch needs unsandboxed execution on this macOS host).
