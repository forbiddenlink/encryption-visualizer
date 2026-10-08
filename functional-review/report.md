# Functional audit handoff

CryptoViz was audited independently from baseline821dd58 on `design/upgrade`. The app's initial371unit tests all passed, yet independently derived calculations and real interaction checks exposed21issue groups. The two highest-impact failures were incorrect AES arithmetic that also crashed later visualization rounds, and an ECC signing loop that could never terminate for valid tiny-curve inputs.

Repairs cover byte-safe/accurate educational calculations, finite signing, DH generators and input bounds, strict signature verification input, honest simulation explanations, bounded block-mode snapshots, comparison query/history behavior, assessment-preserving missed-question review, native keyboard controls, valid playback bounds, AES4x achievement, and working navigation/install/error recovery. The comparison's built-in samples now explicitly fit16-byte AES input. Signatures and key exchange are no longer labeled reversible encryption. Every matrix explanation has a named close action and selected-state feedback.

Verification is documented in [coverage.md](coverage.md), with severity/reproduction/root cause/fix/evidence in [issues.md](issues.md). New product scope and production configuration follow-ups remain separate in [improvements.md](improvements.md) and [needs-approval.md](../design-research/needs-approval.md). No accounts, services, keys, migrations, route changes, merge, deployment or OS installation were performed.

## Evidence

- **460/460unit/component tests passed**, including89added regressions. Typecheck and production build passed; lint checked182files with0errors/0warnings. Source repairs committed as`76c6595`.
- **266additional real-browser keyboard/control checks passed**: all91lesson-note cards at desktop/mobile (182checks), plus all42comparison explanations at each width (84checks).

- Full fresh Chrome suite:105/106passed, no skips/flakes; one14-answer mobile workflow exceeded its original30-second budget at reload. Focused rerun retains all assertions with60seconds and passes6/6. Thus all106distinct journey cases have passing evidence across those runs; this is not an all-green single full-suite claim.
- Before/final screenshots: `evidence/baseline-<route>-1440.png`, `baseline-<route>-390.png`, `after-<route>-1440.png`, `after-<route>-390.png`; “home” represents `/`. All17normal routes plus missing-page state were loaded. JSON inventories include every initial visible control, script source, runtime error and overflow checks.
- Generated, loading, empty, success and error screenshots from actual Chrome journeys: `evidence/design-research/screenshots/states/` (path deliberately keeps existing test destinations inside the new evidence folder).
- Actual production service worker, theme reload, offline AES generation/final step and reload: `production-smoke.json` and `production-offline-aes-mobile.png`. Offline transient experiments restart empty while persistent theme remains.
- Independent red/green proofs and final machine-readable test/lint results remain beside these artifacts. The retry test now uses only the offered UI after malformed data injection; its previous hidden store repair was removed.

## Limits

Live PostHog ingestion, OS install/update lifecycle, Safari/Firefox, long-running cache eviction and stress/device compatibility remain excluded or partial. Educational toy cryptography remains explicitly educational; this audit does not certify it for protecting real data. Outer CI/production install policy differs from the verified nested app configuration and was not changed.

User-owned untracked CLAUDE.md and prior scratch research remain untouched. Nothing was merged or deployed.

## Before and final route screenshots

| Route | Before | Final |
|---|---|---|
| `/` | [desktop](evidence/baseline-home-1440.png) / [mobile](evidence/baseline-home-390.png) | [desktop](evidence/after-home-1440.png) / [mobile](evidence/after-home-390.png) |
| `/aes` | [desktop](evidence/baseline-aes-1440.png) / [mobile](evidence/baseline-aes-390.png) | [desktop](evidence/after-aes-1440.png) / [mobile](evidence/after-aes-390.png) |
| `/rsa` | [desktop](evidence/baseline-rsa-1440.png) / [mobile](evidence/baseline-rsa-390.png) | [desktop](evidence/after-rsa-1440.png) / [mobile](evidence/after-rsa-390.png) |
| `/ecc` | [desktop](evidence/baseline-ecc-1440.png) / [mobile](evidence/baseline-ecc-390.png) | [desktop](evidence/after-ecc-1440.png) / [mobile](evidence/after-ecc-390.png) |
| `/block-modes` | [desktop](evidence/baseline-block-modes-1440.png) / [mobile](evidence/baseline-block-modes-390.png) | [desktop](evidence/after-block-modes-1440.png) / [mobile](evidence/after-block-modes-390.png) |
| `/diffie-hellman` | [desktop](evidence/baseline-diffie-hellman-1440.png) / [mobile](evidence/baseline-diffie-hellman-390.png) | [desktop](evidence/after-diffie-hellman-1440.png) / [mobile](evidence/after-diffie-hellman-390.png) |
| `/hashing` | [desktop](evidence/baseline-hashing-1440.png) / [mobile](evidence/baseline-hashing-390.png) | [desktop](evidence/after-hashing-1440.png) / [mobile](evidence/after-hashing-390.png) |
| `/hmac` | [desktop](evidence/baseline-hmac-1440.png) / [mobile](evidence/baseline-hmac-390.png) | [desktop](evidence/after-hmac-1440.png) / [mobile](evidence/after-hmac-390.png) |
| `/signatures` | [desktop](evidence/baseline-signatures-1440.png) / [mobile](evidence/baseline-signatures-390.png) | [desktop](evidence/after-signatures-1440.png) / [mobile](evidence/after-signatures-390.png) |
| `/padding` | [desktop](evidence/baseline-padding-1440.png) / [mobile](evidence/baseline-padding-390.png) | [desktop](evidence/after-padding-1440.png) / [mobile](evidence/after-padding-390.png) |
| `/password-hashing` | [desktop](evidence/baseline-password-hashing-1440.png) / [mobile](evidence/baseline-password-hashing-390.png) | [desktop](evidence/after-password-hashing-1440.png) / [mobile](evidence/after-password-hashing-390.png) |
| `/tls` | [desktop](evidence/baseline-tls-1440.png) / [mobile](evidence/baseline-tls-390.png) | [desktop](evidence/after-tls-1440.png) / [mobile](evidence/after-tls-390.png) |
| `/cryptanalysis` | [desktop](evidence/baseline-cryptanalysis-1440.png) / [mobile](evidence/baseline-cryptanalysis-390.png) | [desktop](evidence/after-cryptanalysis-1440.png) / [mobile](evidence/after-cryptanalysis-390.png) |
| `/compare` | [desktop](evidence/baseline-compare-1440.png) / [mobile](evidence/baseline-compare-390.png) | [desktop](evidence/after-compare-1440.png) / [mobile](evidence/after-compare-390.png) |
| `/learn` | [desktop](evidence/baseline-learn-1440.png) / [mobile](evidence/baseline-learn-390.png) | [desktop](evidence/after-learn-1440.png) / [mobile](evidence/after-learn-390.png) |
| `/glossary` | [desktop](evidence/baseline-glossary-1440.png) / [mobile](evidence/baseline-glossary-390.png) | [desktop](evidence/after-glossary-1440.png) / [mobile](evidence/after-glossary-390.png) |
| `/about` | [desktop](evidence/baseline-about-1440.png) / [mobile](evidence/baseline-about-390.png) | [desktop](evidence/after-about-1440.png) / [mobile](evidence/after-about-390.png) |
| `/not-a-real-route` | [desktop](evidence/baseline-not-a-real-route-1440.png) / [mobile](evidence/baseline-not-a-real-route-390.png) | [desktop](evidence/after-not-a-real-route-1440.png) / [mobile](evidence/after-not-a-real-route-390.png) |
