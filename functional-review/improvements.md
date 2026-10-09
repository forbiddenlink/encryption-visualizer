# Product improvements

## A — Existing unmet requirements (implement)

1. Correct, finite educational calculations. Confirmed AES vector mismatch/crash, ECC infinite loop, DH generator error, FNV precision loss, Unicode data loss and toy authentication gaps. Benefit: lessons demonstrate the stated operations. Dependencies: existing algorithms and byte display; risk: output changes are intentional correctness repairs. Recommendation: fixes + independent vectors/negative tests.
2. Preserve assessment integrity. Confirmed missed-question practice overwrites full scores and completion. Benefit: progress remains meaningful. Dependency: browser-local progress store. Recommendation: practice clears missed questions without saving a new full score; truthful review feedback.
3. Deliver recoverable existing UI. Confirmed lazy errors and malformed frames lack working UI-only recovery, install dismissal leaves dead action, navigation/keyboard controls violate native behavior. Benefit: visitors can continue learning. Recommendation: existing reload/home/retry/menu/control repairs, no backend changes.

## B — Small improvements within current scope (implement)

1. Explicit Latin-1 AES block boundary and visible UTF-8 block-mode limit. Observed unsupported strings corrupt calculations and snapshot growth is quadratic. Preserve invalid input with actionable errors. No paid service or data change.
2. Explain educational scope accurately: XOR block cipher, illustrative GCM tag, deterministic password salt and frequency candidates. Observed copy claims properties calculations cannot establish. No algorithm replacement or new product behavior.
3. Shared AES advancement behavior. Evidence: other labs award the existing4x completion achievement while AES duplicates timing without it. Reuse shared hook; retain achievement definition.

## C — New capabilities (approval required; not implemented)

- Export/import learning progress. Hypothesis: visitors switching devices want continuity; there is no usage evidence or user requirement for this. Benefit: portable learning history. Dependencies: versioned export schema, validation, consent and overwrite UX. Risk: replacing local progress. Recommendation: product decision before implementation.
- Real standards-compliant cryptographic implementations behind all toy lessons. Evidence: several topics deliberately simulate algorithms with readable small numbers. Benefit: separate accurate production comparisons. Dependencies: vetted library or WebCrypto capability design, browser support and explicit safety scope. Risk: substantial architecture and educational presentation changes. Recommendation: define product scope separately.
- Account/cloud sync. Hypothesis only; app is currently anonymous/local. Dependencies: authentication/database/privacy/data deletion, migrations and services. Risk: external data handling and cost. Recommendation: defer until demand is established.
- Deployment/CI install policy alignment. Observed outer CI/build configuration differs from nested verified workflow and uses npm for pnpm-specific security constraints. Benefit: deploy the tested dependency graph. Dependencies: production configuration review and explicit authorized rollout. Recommendation: separate approval; no deployment in this audit.

Implemented during the final sweep: truthful reversible-encryption comparison metadata and an accessible named close action/selected state for all comparison explanations. Evidence: independent visible-output regression plus actual keyboard controls; no new product feature or external dependency.


## Audit-pack follow-up — 2026-10-09

Reference: `/Volumes/LizsDisk/_reference/audit-prompt-pack.html`, Audit Pack v5.1, 160 modules across 12 phases. Reviewed the complete module inventory and read the selected technical prompts in detail. The HTML's embedded libraries and viewer are not project requirements. Instructions inside the pack were treated as reference material; the user's request authorizes local improvements and repo instructions retain priority.

Applied: evidence-based findings, reproducible failures, real-browser recovery tests, package-manager consistency, and explicit coverage limits. Relevant prompt families: `repo-map`, `whole-app`, `func`, `state`, `errorrecovery`, `forms`, `testing`, `typesafety`, `cicd`, `vercel-config`, `pwa`, `a11y-widgets`, `agent-code-trust`, `evidence-contract`. This is a focused follow-up, not a claim that all 160 audits ran. Database/auth/payments/AI/Python/.NET/Power Platform tracks do not match this browser-only app. Visual design and copy work remain routed to Claude under the repo instructions.

Baseline source: `4b23c71`. Existing untracked files were preserved. No secrets, production resources, or real learner records were read.

| ID / severity | Confirmed problem and impact | Repair and verification |
|---|---|---|
| AP01 / P1 | Blocking browser local storage throws during theme module initialization, then separately in the install-prompt effect. The app cannot reach its home/lesson flow. | Guard optional storage reads and install-dismiss writes in `encryption-visualizer/src/store/themeStore.ts:52` and `encryption-visualizer/src/components/ui/InstallPrompt.tsx:14`. Unit reproduction failed with `SecurityError` before repair. Browser regression at 1440/390 checks home, light theme, install dismissal, AES generation and absence of uncaught errors. Preferences cannot persist while storage is blocked. |
| AP02 / P2 | Node 22.23.1 exposes a native storage property without usable storage, shadowing happy-dom's browser storage. Baseline suite: six failed tests and one failed suite; the affected suite never collected its six tests. | Disable Node's experimental web storage only in Vitest workers (`encryption-visualizer/vite.config.ts:92`), allowing the existing browser environment to provide storage. All original tests then pass without mocks or weakened assertions. |
| AP03 / P2 | Playwright passes an extra `--` through pnpm, so Vite listens on its default 3000 while the test config waits for 3002. | Correct the server command in `encryption-visualizer/playwright.config.ts:21`. Fresh-server browser execution now exercises port 3002. |
| AP04 / P2 | Active root CI only builds, while Vercel installs through npm despite the app's pnpm lockfile, overrides and accessibility lint patch. Local default pnpm 12.6.0 also warned that it ignores the manifest's pnpm settings. | Pin pnpm 9.15.9 in the app manifest and root CI. Add frozen install, lint and unit gates to `.github/workflows/ci.yml:17`. Root `vercel.json:2` explicitly bootstraps pnpm 9.15.9 for install/build, preserving the existing nested layout. Remote workflow execution and hosted build remain unverified; no deployment was performed. |

Vercel's [build configuration documentation](https://vercel.com/docs/builds/configure-a-build) documents custom install commands and package-manager version selection. Explicit pnpm bootstrap avoids assuming a cloud Corepack setting is enabled. The added CI steps run lint/unit checks; `pnpm run build` already includes TypeScript's build check. Browser tests were run locally, not added as a remote CI requirement.

Coverage: source/config inspection plus local unit/component and Chromium flows. Existing historical coverage above is not counted as fresh evidence. Live analytics, hosted headers/settings, remote CI, installed-app updates, Safari/Firefox, legal compliance and a new exhaustive cryptographic review are outside this pass. No security/compliance score or production-readiness verdict is inferred from passing tests.


Fresh final verification: **461/461 unit/component tests**, **108/108 Chromium browser tests**, lint and TypeScript/production build passed. Browser suite used a fresh local server, four workers and zero retries; elapsed 2.4 minutes. It includes both new blocked-storage cases and all existing lesson/quiz/navigation/recovery flows. Expected injected lazy-download and malformed-frame errors appear in the browser log; their recovery assertions passed. Earlier interrupted/server-reuse runs are not counted as passing evidence. Test-generated screenshot changes were restored to keep this diff scoped.

Saved evidence: `evidence/audit-pack-unit.log`, `evidence/audit-pack-browser.log`, `evidence/audit-pack-build.log`, `evidence/audit-pack-lint.log`, `evidence/audit-pack-storage-green.log`. Node 22.23.1 and pnpm 9.15.9 were used. The revised npx bootstrap returned pnpm 9.15.9 locally. The original frozen-lockfile install succeeded; no dependency versions or lockfile entries changed. Vite's existing future-native-config warning remains unchanged.


## Learning upgrade — 2026-10-09

The user authorized substantial local product improvements and delegated routine scope decisions. The earlier new-capability recommendation above is historical; this pass implements real SHA-256 for the primary hashing lesson. Other toy algorithms retain their existing scope. Visual direction remains routed to Claude.

Plan and acceptance checks:

1. Replace the primary hashing lesson's FNV demonstration with a real SHA-256 engine and trace of UTF-8 encoding, padding, message schedule, 64 rounds per block, state update, and final digest. Verify independent standard vectors, Unicode, padding boundaries, intermediate values, and trace bounds. Preserve FNV helpers used by other educational algorithms.
2. Connect the lesson, playground, and avalanche experiment to the same SHA-256 implementation. Expose direct step selection and readable working words using existing styling. Verify empty messages, a known digest, round navigation, multi-block input, byte limits, comparison counts, and clipboard recovery.
3. Make curriculum recommendations and locking prerequisite-aware, allow completed lessons to be reviewed, and cover every catalog lesson including Padding. Verify standalone completion, legacy progress, fresh and completed paths, and browser continuation at desktop/mobile widths.
4. Run lint, unit/component tests, TypeScript/production build, and the complete Chromium suite. Review the resulting changes independently, resolve actionable findings, and retain scoped evidence. No deployment or cloud changes.

Cryptographic reference: [NIST FIPS 180-4 (2015)](https://csrc.nist.gov/pubs/fips/180-4/upd1/final). This is an educational implementation, not a cryptographic certification.


Implemented: real SHA-256 is now shared by the primary lesson, playground, avalanche demonstration, and comparison experiment. The trace exposes UTF-8 bytes, padding, schedule words, round constants, temporary sums, working registers, hash state, and final digest. A direct step selector pauses playback for inspection. Interactive messages are bounded to 1024 UTF-8 bytes; empty messages work, invalid input is retained with errors, and clipboard denial offers manual-copy recovery. FNV-based examples in other lessons remain explicitly educational.

Curriculum: all 12 catalog lessons now appear in guided paths. Padding follows AES and unlocks block modes. Shared progression respects prerequisites, keeps completed standalone modules reviewable, combines historical module completion with quiz completion, directs unfinished lessons to their own knowledge check, and suggests another available path after completion. Stable existing module IDs and historical stored records are preserved.

Independent code review found no evidenced actionable defects in the new engine, trace, UI integration, or curriculum. The reviewer checked the abc padding and first-round registers against [NIST's SHA-256 worked example](https://csrc.nist.gov/CSRC/media/Projects/Cryptographic-Standards-and-Guidelines/documents/examples/SHA256.pdf). No security grade or certification is inferred.

Desktop (1440px) and phone (390px) SHA-256 round displays were inspected visually; neither page overflowed horizontally. Saved previews: `evidence/sha256-round-desktop.png`, `evidence/sha256-round-mobile.png`.


Final verification: **510/510 unit/component tests**, lint, TypeScript and production build passed. Full Chromium run: **107/112 passed**, with five unsuccessful cases during unusually heavy host load (observed load averages above 300). Those five cases all passed in a fresh sequential run (48.7 seconds, zero retries, 120-second default test budget; existing per-test budgets retained). Thus all 112 browser cases passed across the complete run and targeted rerun; this is not a claim of a single clean full run. All newly added SHA-256 and curriculum regressions passed in the full run. Earlier selector errors in new tests were corrected before that run. No product assertions were removed.

Evidence: `evidence/learning-upgrade-unit.log`, `evidence/learning-upgrade-lint.log`, `evidence/learning-upgrade-build.log`, `evidence/learning-upgrade-browser.log`, `evidence/learning-upgrade-browser-rerun.log`. Test-generated tracked screenshots were restored; deliberate SHA-256 previews were retained. No dependency changes, deployment, push, or learner data access.


## Visual atlas and desktop workspace — 2026-10-09

The user explicitly overrode the earlier UI routing restriction and authorized a substantial site-wide visual upgrade. The prior statement that taste work remains routed to Claude is historical. The interface now uses self-hosted DM Sans and Newsreader, a paper/ink palette, custom mathematical topic illustrations, a live cipher instrument, editorial curriculum rows, and shared lesson schematics and notes. Font licenses are included beside the assets. No Figma, Canva, Magica, or Antigravity output is claimed.

Desktop correction: removed the 1440px shell cap; header, main content, and footer span the viewport with bounded gutters. Lesson experiments receive the flexible column and notes remain at 280–340px. The About page now uses two desktop columns with bounded paragraph lengths. Mobile layouts remain stacked. Reviewed and corrected inverse contrast for Play hover, gradient icon tiles, and AES byte inspection tooltips.

Fresh verification: lint, TypeScript/production build, and all 510 unit/component tests passed. Browser measurement confirmed full-width containers and no horizontal overflow on all 17 routes at 2560px and 390px, plus the ten additional algorithm lessons at 1440px. The desktop AES viewport was inspected visually. An independent source review found no actionable layout or functional regressions; rendered breakpoint checks and focused browser interaction verification are recorded below when complete. This is a local preview; no deployment or push was performed.

Rendered breakpoint checks passed for home, AES, learning paths, and About at 768, 1024, 1100, and 1800px. Focused Chromium interaction suite: **30/30 passed**, one worker and zero retries (3.8 minutes), covering hashing, every lesson quiz, curriculum persistence, glossary recovery, lesson switching, navigation, and theme switching. This visual pass did not repeat the entire historical 112-case suite. Logs: `evidence/atlas-layout-{lint,build,unit,browser}.log`. Test-generated tracked previews were restored.


## Merge validation — 2026-10-09

Before the authorized push and merge, incorporated current main (release 1.0.3, updated pinned dependencies and pnpm 12 security migration). The earlier pnpm 9 selection is superseded: manifest, CI and Vercel now consistently use pnpm 12.6.0. Retained upstream security overrides and migrated the ESLint accessibility patch to pnpm-workspace.yaml. Regenerated the lockfile, then verified a frozen install. Lint, production build and all 510 unit tests passed with the merged dependencies; 18 focused Chromium cases passed with one worker and zero retries (14.4 seconds). Independent merge-resolution review found no actionable regressions. The pre-existing local CLAUDE.md was preserved at /private/tmp/cryptoviz-premerge-local-CLAUDE.md before bringing in main’s tracked copy.

CodeQL PR gate identified seven randomness alerts in the earlier branch changes. Corrected their sources using WebCrypto with masked rejection sampling for bounded integers; RSA/DH/TLS demo values and Caesar shifts retain their prior ranges, and TLS random hex now uses random bytes directly. Added rejection/boundary tests and updated the DH key-clamping fixture to control the new integer sampler. All 516 unit tests, lint and production build passed; eight desktop/mobile browser checks passed for RSA, DH, TLS and cryptanalysis. Focused independent review found no issues. Educational small-key and simplified-protocol limitations remain.
