# Upgrade progress

Branch: `design/upgrade`. Started 2026-10-08. Goal: complete the seven requested phases without merging or deploying.

## Phase 1 — complete

- Mapped all 17 routes and existing shared components/content/stores.
- 34 real Chromium desktop/mobile screenshots saved in `screenshots/before/`.
- `profile.md` records features, journeys, unknowns and observed defects.
- `before-browser.json` records initial-load evidence; no application errors. Initial states only, not functional journey verification.
- Dependencies installed frozen using Node 22.23.1 and pnpm 9.15.9; global pnpm 12.6 was incompatible with current override placement. No dependency/config changes.
- Existing untracked root `CLAUDE.md` is user-owned and excluded from commits.

## Phase 2 — in progress

Load design galleries and live sites, capture screenshots, inventory competitor features with explicit evidence and blocked status.

## Remaining

3. Write a single direction and ranked implementation plan.
4. Build foundation/home; two browser score/fix rounds.
5. Roll out every route with desktop/mobile states and scoring.
6. Build/typecheck/lint/tests, Lighthouse and browser journeys.
7. Final report with before/after evidence, scores and approval list.

## Reproduction

From nested app: `mise exec node@22.23.1 -- ./node_modules/.bin/vite --host 127.0.0.1 --port 3002`.
From root: `mise exec node@22.23.1 -- node design-research/capture.cjs before` (browser launch needs unsandboxed execution on this macOS host).
