# Functional audit progress

2026-10-08, branch design/upgrade; never merge/deploy. Baseline821dd58.

- Independent route/control inventory: complete,36 desktop/mobile views,18 URLs (17 normal+unmatched), no initial page errors/overflow. Baseline unit371/371 passed despite confirmed uncovered bugs.
- Diagnosis:19 issue groups, meaningful public-source proofs; two P1 calculation defects. Three independent fixes + read-only review completed.
- Fixes: math/byte processing, bounded ECC, DH range/generator, signature validation, toy-scope truth, blocked-download/visualization recovery, install/menu/theme/hash controls; root quiz assessment integrity, comparison/query state, native keyboard, bounded playback/AES4x award implemented.
- Targeted verification: math134/134, independent text49/49; integration unit6/6 and Chrome6/6; root state/control7/7. Genuine red proofs in evidence. Root reversed-query red reproduced after fixing previously truncated comparison sample.
- Removed out-of-band store repair from existing retry browser test; offered UI must now repair it.
- Final verification complete:460/460unit/component tests, typecheck, build, lint182files/0errors/0warnings.106distinct Chrome cases have passing evidence across full105/106run and corrected-budget6/6focused rerun; no skips/flakes.266additional keyboard/control checks passed.36final production views:0exceptions/overflow. Genuine offline/service-worker/theme smoke passed.
- Dependencies restored using explicit cached pnpm9.15.4 with frozen lockfile, Node22.23.1. No package/lockfile changes. Audit browser config uses direct Node/Vite, because globalpnpm12 automatically removes/reinstalls links and ignores project overrides. No globalpnpm allowed.
- User-owned untracked CLAUDE.md and design-research/lint-plugin-patch scratch must remain unstaged.

Source phase committed as76c6595. Evidence/report phase is being committed; no required implementation remains. Final coverage.md/issues.md/improvements.md/report.md preserve evidence, limits and deferred scope. Never merge/deploy.
