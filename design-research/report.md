# CryptoViz upgrade report

2026-10-08. All seven phases completed on **design/upgrade**. No merge or deployment. All 17 existing routes, topic content, tools and saved learning data are retained. No paid services, keys, databases or CMS changes were added.

## What changed and why

One direction: a cryptography field guide. Georgia display headings, Inter explanations, JetBrains Mono values, ink/paper surfaces and an olive/lime accent establish hierarchy without competing with the diagrams. Experiments supply the imagery. Numbered lessons, readable notes and explicit next actions support beginners and returning learners. UI motion stays short and respects reduced motion; experiment playback remains under user control.

The design draws from actually loaded references: Yale/Una Europa's editorial hierarchy, SuperHi's learner actions, VoidZero/Pierre's technical structure, Simons/Biotic's scientific imagery and Grafik's restrained accent. [Profile](profile.md), [15 live reference candidates](references.md), [10 peer feature inventories](features.md) and [the single design/feature plan](plan.md) record research and unknowns. No invented business metrics, testimonials or claims of adoption were introduced.

Features delivered:

- Searchable 12-topic catalog with combined category filters, result counts, empty recovery, completed-topic status and local resume.
- Keyboard/mobile navigation, shared footer, per-route titles and consistent lesson identity/notes/quiz/continuation actions.
- Passed quizzes advance the matching curriculum modules; saved progress, missed-question review and achievements remain. Current-module completion counts preserve legacy saved IDs without inflated percentages. Placeholder destinations now use existing public topic routes.
- Actual paired comparison experiments for six existing choices, with synchronized or independent playback/stepping/reset.
- Visible AES playback/speed/reset controls and hashing speed controls. Route transitions clear incompatible temporary frames while preserving learning data.
- Glossary related-term navigation, accessible search/filter states, result counts and empty recovery.
- Inline RSA validation and clear valid/tampered signature results; labels, touch targets, helper contrast, result badges and mobile diagram/timeline layout repaired.
- Explicit educational scope for FNV hashing, simplified HMAC, password-hashing simulation and truncated toy signatures. Algorithms and educational content remain.
- Self-hosted licensed fonts, a small header-logo rendition, deferred optional analytics/offline precache, stable loading geometry and immediate first-load content. The original logo asset remains; PWA/offline navigation and fonts work.

## Every template: before, after and rubric

All captures are from actual installed Chrome through Playwright. D = desktop 1440px; M = mobile 390px. Before captures show the original initial state. After captures show the finished loaded state in dark/light themes. Full-page links below; matching `-viewport.png` captures accompany final files. [Homepage's two score/fix rounds](home-review.md) and [per-template rollout decisions/state coverage](rollout-review.md) preserve the review history.

Scores are editorial judgments, not Lighthouse scores. Order: **point of view / typography / layout and rhythm / color and imagery / motion / audience fit / memorability / craft**. 1–5. All final dimensions score 4; no 5s are asserted. Craft includes tested interaction, mobile fit, contrast and loading repairs; throttled mobile loading remains a limitation below.

| Template / preserved route | Status | Before D/M | After dark D/M | After light D/M | Eight scores |
|---|---|---|---|---|---|
| Home `/` | done | [D](screenshots/before/home-1440.png) / [M](screenshots/before/home-390.png) | [D](screenshots/verified-dark/home-1440.png) / [M](screenshots/verified-dark/home-390.png) | [D](screenshots/verified-light/home-1440.png) / [M](screenshots/verified-light/home-390.png) | 4/4/4/4/4/4/4/4 |
| AES `/aes` | done | [D](screenshots/before/aes-1440.png) / [M](screenshots/before/aes-390.png) | [D](screenshots/verified-dark/aes-1440.png) / [M](screenshots/verified-dark/aes-390.png) | [D](screenshots/verified-light/aes-1440.png) / [M](screenshots/verified-light/aes-390.png) | 4/4/4/4/4/4/4/4 |
| RSA `/rsa` | done | [D](screenshots/before/rsa-1440.png) / [M](screenshots/before/rsa-390.png) | [D](screenshots/verified-dark/rsa-1440.png) / [M](screenshots/verified-dark/rsa-390.png) | [D](screenshots/verified-light/rsa-1440.png) / [M](screenshots/verified-light/rsa-390.png) | 4/4/4/4/4/4/4/4 |
| ECC `/ecc` | done | [D](screenshots/before/ecc-1440.png) / [M](screenshots/before/ecc-390.png) | [D](screenshots/verified-dark/ecc-1440.png) / [M](screenshots/verified-dark/ecc-390.png) | [D](screenshots/verified-light/ecc-1440.png) / [M](screenshots/verified-light/ecc-390.png) | 4/4/4/4/4/4/4/4 |
| Block modes `/block-modes` | done | [D](screenshots/before/block-modes-1440.png) / [M](screenshots/before/block-modes-390.png) | [D](screenshots/verified-dark/block-modes-1440.png) / [M](screenshots/verified-dark/block-modes-390.png) | [D](screenshots/verified-light/block-modes-1440.png) / [M](screenshots/verified-light/block-modes-390.png) | 4/4/4/4/4/4/4/4 |
| Diffie–Hellman `/diffie-hellman` | done | [D](screenshots/before/diffie-hellman-1440.png) / [M](screenshots/before/diffie-hellman-390.png) | [D](screenshots/verified-dark/diffie-hellman-1440.png) / [M](screenshots/verified-dark/diffie-hellman-390.png) | [D](screenshots/verified-light/diffie-hellman-1440.png) / [M](screenshots/verified-light/diffie-hellman-390.png) | 4/4/4/4/4/4/4/4 |
| Hashing `/hashing` | done | [D](screenshots/before/hashing-1440.png) / [M](screenshots/before/hashing-390.png) | [D](screenshots/verified-dark/hashing-1440.png) / [M](screenshots/verified-dark/hashing-390.png) | [D](screenshots/verified-light/hashing-1440.png) / [M](screenshots/verified-light/hashing-390.png) | 4/4/4/4/4/4/4/4 |
| HMAC `/hmac` | done | [D](screenshots/before/hmac-1440.png) / [M](screenshots/before/hmac-390.png) | [D](screenshots/verified-dark/hmac-1440.png) / [M](screenshots/verified-dark/hmac-390.png) | [D](screenshots/verified-light/hmac-1440.png) / [M](screenshots/verified-light/hmac-390.png) | 4/4/4/4/4/4/4/4 |
| Signatures `/signatures` | done | [D](screenshots/before/signatures-1440.png) / [M](screenshots/before/signatures-390.png) | [D](screenshots/verified-dark/signatures-1440.png) / [M](screenshots/verified-dark/signatures-390.png) | [D](screenshots/verified-light/signatures-1440.png) / [M](screenshots/verified-light/signatures-390.png) | 4/4/4/4/4/4/4/4 |
| Padding `/padding` | done | [D](screenshots/before/padding-1440.png) / [M](screenshots/before/padding-390.png) | [D](screenshots/verified-dark/padding-1440.png) / [M](screenshots/verified-dark/padding-390.png) | [D](screenshots/verified-light/padding-1440.png) / [M](screenshots/verified-light/padding-390.png) | 4/4/4/4/4/4/4/4 |
| Password hashing `/password-hashing` | done | [D](screenshots/before/password-hashing-1440.png) / [M](screenshots/before/password-hashing-390.png) | [D](screenshots/verified-dark/password-hashing-1440.png) / [M](screenshots/verified-dark/password-hashing-390.png) | [D](screenshots/verified-light/password-hashing-1440.png) / [M](screenshots/verified-light/password-hashing-390.png) | 4/4/4/4/4/4/4/4 |
| TLS `/tls` | done | [D](screenshots/before/tls-1440.png) / [M](screenshots/before/tls-390.png) | [D](screenshots/verified-dark/tls-1440.png) / [M](screenshots/verified-dark/tls-390.png) | [D](screenshots/verified-light/tls-1440.png) / [M](screenshots/verified-light/tls-390.png) | 4/4/4/4/4/4/4/4 |
| Cryptanalysis `/cryptanalysis` | done | [D](screenshots/before/cryptanalysis-1440.png) / [M](screenshots/before/cryptanalysis-390.png) | [D](screenshots/verified-dark/cryptanalysis-1440.png) / [M](screenshots/verified-dark/cryptanalysis-390.png) | [D](screenshots/verified-light/cryptanalysis-1440.png) / [M](screenshots/verified-light/cryptanalysis-390.png) | 4/4/4/4/4/4/4/4 |
| Compare `/compare` | done | [D](screenshots/before/compare-1440.png) / [M](screenshots/before/compare-390.png) | [D](screenshots/verified-dark/compare-1440.png) / [M](screenshots/verified-dark/compare-390.png) | [D](screenshots/verified-light/compare-1440.png) / [M](screenshots/verified-light/compare-390.png) | 4/4/4/4/4/4/4/4 |
| Learning paths `/learn` | done | [D](screenshots/before/learn-1440.png) / [M](screenshots/before/learn-390.png) | [D](screenshots/verified-dark/learn-1440.png) / [M](screenshots/verified-dark/learn-390.png) | [D](screenshots/verified-light/learn-1440.png) / [M](screenshots/verified-light/learn-390.png) | 4/4/4/4/4/4/4/4 |
| Glossary `/glossary` | done | [D](screenshots/before/glossary-1440.png) / [M](screenshots/before/glossary-390.png) | [D](screenshots/verified-dark/glossary-1440.png) / [M](screenshots/verified-dark/glossary-390.png) | [D](screenshots/verified-light/glossary-1440.png) / [M](screenshots/verified-light/glossary-390.png) | 4/4/4/4/4/4/4/4 |
| About `/about` | done | [D](screenshots/before/about-1440.png) / [M](screenshots/before/about-390.png) | [D](screenshots/verified-dark/about-1440.png) / [M](screenshots/verified-dark/about-390.png) | [D](screenshots/verified-light/about-1440.png) / [M](screenshots/verified-light/about-390.png) | 4/4/4/4/4/4/4/4 |

Each template has functional/reading verification, not only an initial screenshot. The 12 labs cover generation/playback/stepping/completion and applicable empty/validation/variant states. All 12 quizzes cover correct/incorrect feedback, saved results and curriculum updates. Utility journeys cover search/empty/related terms, partial/complete curricula, resume, comparisons and mobile/theme navigation. Shared loading, offline and fault/retry templates were exercised at both widths. Static informational pages have no submit-success or fetched-content empty state; those are inapplicable. Screens for exercised states are in [screenshots/states](screenshots/states/).

## Verification

[Full verification evidence and reproduction](verification.md):

- Build, project typecheck and full lint pass; lint has zero errors/warnings and JSX accessibility rules remain active.
- 371 unit tests pass. All 94 browser tests pass; fresh 22 startup/signature/recovery tests and eight final loading/recovery tests also pass.
- All 68 initial page/theme/width states and 24 completed mobile lab states have zero detected WCAG A/AA violations. All 17 loaded routes pass heading-order checks. This is automated evidence, not a claim of WCAG certification.
- 68 final desktop/mobile captures: no page exceptions or horizontal overflow. Actual controlled offline TLS navigation/playback and both local fonts pass.

Lighthouse 13.4.1, local production preview in Chrome. Default mobile throttling; desktop separately indicated. All measured CLS values are zero.

| Page/device | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| [Home mobile](lighthouse-home-final.json) | 81 | 100 | 100 | 100 |
| [AES mobile](lighthouse-aes-final.json) | 79 | 100 | 100 | 100 |
| [Learning paths mobile](lighthouse-learn-final.json) | 78 | 100 | 100 | 100 |
| [Compare mobile](lighthouse-compare-final.json) | 78 | 100 | 100 | 100 |
| [Glossary mobile](lighthouse-glossary-final.json) | 80 | 100 | 100 | 100 |
| [Home desktop](lighthouse-home-desktop-final.json) | 99 | 100 | 100 | 100 |

Mobile cold-load LCP remains approximately 4.7–5.1s under Lighthouse throttling; the 78–81 performance results are not excellent/90+ mobile scores. Initial JavaScript is about half its earlier size, total blocking time is zero, and layout shift is fixed. Desktop home performance is 99. These are single lab runs, not production field measurements. The comparable initial upgraded-home CLI audit scored 53 performance and 96 accessibility/best practices; the untouched original design was not Lighthouse-measured.

## Blocked, limited and untested

- Godly's legacy discovery links redirected to Recent; old gallery provenance was unavailable. Land-book browser entries hit Cloudflare verification; web-reader provenance and independent live captures were used where available. These blockers are documented, not treated as successful gallery inspection.
- Education Week had an advertising overlay. Aevion's live introduction/navigation loaded, but its WebGL object was not visible in the headless capture. These are limited references, not proof of the obscured/absent experiences. A failed Awwwards slug was excluded.
- Peer research inventories visible/offered features; authenticated, paid and all-subpage capabilities were not independently exercised. No competitor's hidden behavior is claimed verified.
- Real-device touch, assistive-technology testing and production-host telemetry are untested. All work was checked locally; production was deliberately untouched. Existing future Vite native-config warning remains; the present build passes.
- Educational small-key/hash simulations keep their limitations, including possible toy signature collisions. A deterministic test fixture removes random test failures; the visible scope note explains the actual limitation. No production-security claim is made for these demos.
- No page template is blocked or marked done without browser verification. Approval-dependent features below are deferred. Superseded failed/partial research and test runs remain as history; named final evidence is authoritative. Initial public analytics identifiers are redacted.
- User-owned root CLAUDE.md remains untouched/untracked. The temporary third-party lint patch working copy remains untracked in design-research/lint-plugin-patch; only the minimal persistent patch is committed. No files were deleted to clean it up.

## Full needs-approval list

Deferred possibilities (not part of the safe build):
- User accounts and cross-device progress: authentication, database schema/migrations, privacy decisions and hosting costs.
- Paid AI tutoring or third-party services: costs and API credentials.
- Public challenge submissions, leaderboards or classrooms: database, abuse moderation and learner-data handling.
- Changing routes, deleting content/pages or replacing educational algorithms: explicit approval and separate review required.
- Deployment, production configuration changes and merging: outside this task; do not perform.
- Replacing the educational FNV/truncated-hash signature model with standards-compliant signing: changes algorithm behavior and lesson content; requires a separate accuracy/security review. The existing model remains, with a visible collision warning.


## Stop point

Implementation and evidence are committed phase by phase on design/upgrade. The branch is ready for review; main and production remain untouched. No merge, deployment, paid-service setup or approval-backlog work was performed. Stop here.
