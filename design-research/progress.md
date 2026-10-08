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

## Phase 4 — in progress

Build global/shared foundations and homepage; two required screenshot/score/fix rounds before moving on.

## Remaining

3. Write a single direction and ranked implementation plan.
4. Build foundation/home; two browser score/fix rounds.
5. Roll out every route with desktop/mobile states and scoring.
6. Build/typecheck/lint/tests, Lighthouse and browser journeys.
7. Final report with before/after evidence, scores and approval list.

## Reproduction

From nested app: `mise exec node@22.23.1 -- ./node_modules/.bin/vite --host 127.0.0.1 --port 3002`.
From root: `mise exec node@22.23.1 -- node design-research/capture.cjs before` (browser launch needs unsandboxed execution on this macOS host).
