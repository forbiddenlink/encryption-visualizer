# Phase 6 verification

Branch: design/upgrade. Local production preview only; no deployment or merge.

## Checks already passed

- Node 22.23.1; no project runtime pin found during profiling. Project-local tools run through mise. Avoid global pnpm 12; dependency installation/patch generation used pnpm 9.15.9.
- Full TypeScript project build and Vite/PWA production build pass.
- Full ESLint: zero errors and zero warnings, with JSX accessibility rules enabled. A two-call compatibility patch adapts jsx-a11y's callable minimatch use to the modern named export; existing security overrides remain. Lockfile retains platform/libc metadata and dependency versions.
- 13 unit suites, 371 tests pass. The signature suite uses a fixed RSA fixture because random tiny moduli can produce collisions in the existing truncated educational hash. A visible scope explanation was added; algorithms were not replaced.
- Complete Chromium browser suite: 94 tests pass. A fresh 22-test startup/signature/loading/offline/error-recovery pass also passes after the final startup and heading changes. Evidence: phase6-browser-final.json and phase6-final-startup-browser.json.
- Shared loading and fault/retry states are deliberately exercised at desktop/mobile. Input emptiness, inline RSA validation, quiz feedback, valid/tampered signatures, all comparison selections and both synchronized/independent playback are covered. Each of the 12 quizzes saves a real result and updates its existing curriculum.

## Measured repairs

The first upgraded production audit exposed large layout shift, an oversized header bitmap, render-blocking remote font CSS and a large initial script. Initial script fell from 548KB to 288KB (178KB to 93KB gzipped); optional analytics now loads after the interface, and local previews do not emit analytics. Existing production pageview/pageleave initialization remains. Header artwork has a 64px/5KB rendition instead of displaying the 640px/411KB original; the original asset remains.

Existing Inter and JetBrains Mono fonts are self-hosted with their SIL Open Font License files. The offline cache includes them. Service-worker registration follows page load so the full precache does not compete with first paint. Offline installation/navigation was tested in an actual controlled production browser.

First-load content appears immediately; client-side route transitions retain motion. A viewport-height loading region holds lesson continuation below the fold, fixing the measured AES loading shift. Semantic experiment headings and corrected curriculum/glossary heading levels support screen-reader navigation. Helper text, diagram/result labels and state badges have measured light/dark contrast corrections.

## Final production evidence — passed

- 68 initial page/theme/viewport audits: zero detected WCAG A/AA violations (`accessibility-final.json`).
- All 17 loaded routes: zero heading-order violations (`heading-order-final.json`).
- 24 completed-lab states in both themes at mobile width: zero detected WCAG A/AA violations or overflow (`production-journeys-final.json`). Offline TLS navigation/playback works under service-worker control; no page exceptions. Separate `offline-fonts-final.json` confirms Inter and JetBrains Mono load offline.
- 68 desktop/mobile, light/dark final initial captures: no page exceptions or horizontal overflow (`verified-dark-browser.json`, `verified-light-browser.json`). The last preparation-state change only reserves transient loading height; final loaded-page appearances remain identical. Fresh eight-test recovery verification passes after it (`phase6-final-recovery-browser.json`).
- Lighthouse 13.4.1 with installed Chrome, local production build. Default mobile throttling except the desktop row. All measured layout shifts are zero after repair. Scores are single lab runs, not field measurements.

| Page/device | Performance | Accessibility | Best practices | SEO | CLS |
|---|---|---|---|---|---|
| home | 81 | 100 | 100 | 100 | 0 |
| aes | 79 | 100 | 100 | 100 | 0 |
| learn | 78 | 100 | 100 | 100 | 0 |
| compare | 78 | 100 | 100 | 100 | 0 |
| glossary | 80 | 100 | 100 | 100 | 0 |
| home-desktop | 99 | 100 | 100 | 100 | 0 |

The comparable full CLI homepage report improved from 53 performance / 96 accessibility / 96 best practices to 81 / 100 / 100. A separate initial MCP run scored 49 performance; scores vary with runtime conditions. The initial upgraded build, rather than the untouched old design, was measured. Mobile cold-load LCP remains about 4.7–5.1s under Lighthouse throttling; this is a remaining performance limitation, not an excellent/90+ mobile result. Total blocking time is zero. Desktop homepage performance is 99.

Earlier reports and failed asset-replacement/selector runs remain historical evidence, superseded by the named final files. Optional public analytics identifiers in initial reports are redacted. No research run's failed or partial screenshot sweep is used as final proof.

Automated checks cover representative states and do not constitute WCAG certification. Production-host telemetry, real-device touch/screen-reader testing and external authenticated workflows are not verified. Build retains an existing warning about future Vite native-config compatibility (__dirname); the present build passes. Educational algorithms retain their stated limitations. No live production configuration was changed.
