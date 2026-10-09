# CryptoViz upgrade plan

2026-10-08. Autonomous decisions under the user's explicit seven-phase brief. Preserve all routes, content, educational tools, quizzes and local progress. No services, API keys, CMS or database changes.

## One direction: the cryptography field guide

An editorial learning resource with an immediately usable experiment, numbered topic entries and clear operational controls. The main image is the algorithm running, not decorative stock art. A visitor should understand where to start, see what the tool does and enter a lesson within one screen on desktop.

References actually loaded: Yale Architecture's hierarchy/asymmetry, SuperHi's clear learner actions, VoidZero's fine boundaries/technical object, Pierre's mono metadata, Simons/Biotic's scientific imagery and Grafik's single accent. Cerebrium contributes compact technical controls; its heavy entrance motion is deliberately unsuitable for learning pages. Godly's legacy redirect supplies no usable live reference. Land-book discovery was partially browser-blocked, documented in references.md.

Alternatives considered internally: retain the existing neon dashboard (too much interchangeable panel styling); full playful educational illustration (requires a new image system and risks obscuring the actual experiments). The field guide uses existing working visualizations, establishes a recognisable type hierarchy and has fewer visual distractions.

### Type

- Display / page titles: Georgia editorial serif, regular, tight tracking, 1.04 line height; no font download required. Home fluid 3–5.25rem; lesson headings 2–3rem.
- Body/control: existing Inter with native system fallback, normal reading line height 1.65; body 1rem, technical helper text 0.875rem, compact metadata 0.75rem.
- Byte values/lesson numbers: existing JetBrains Mono with native monospace fallback; tabular numbers.
- Limit body line lengths to 65ch; controls keep familiar sans serif. Do not apply serif to matrix cells or charts.

### Color / surfaces

Dark remains the current default. Deep ink canvas #0c1517, raised ink surfaces #152124, soft white #eef3ec, secondary slate adjusted toward neutral. One lime accent #c7ea93 for highlights; dark olive #41652f for solid controls with white text. Light theme is warm paper #f5f4ed with white surfaces and dark green accent #41652f. Borders are visible 1px, card radii 12px and button radii 8px. Chart/algorithm semantic colors remain intact. No color-only meaning.

### Space / layout

4px base scale: 4/8/12/16/24/32/48/64/96px. Max content 1280px, 24px desktop and 16px mobile gutters. Header in document flow/sticky so headings cannot be covered. Home split introduction/demo, editorial rule and metadata, catalog, learning CTA and retained feature summary. Lessons retain lab + education structure, with clear heading/lesson identity and next step. Use simple ruled sections and cards only for functional groupings.

### Imagery / motion

Actual byte matrices, curves, flow diagrams and results are the image system. No downloaded/AI-generated imagery, no paid fonts. Keep user-controlled visualization animation and playback. UI hover/focus 150ms; route transitions 200ms. Avoid continual background movement and long entrance delays. Respect reduced motion; no automatic cryptographic playback on load.

## Features ranked by impact

| Priority | Work | Why / verification | Approval |
|---|---|---|---|
| 1 | Consistent surfaces, keyboard-operable Explore menu, scrollable mobile navigation and correct header offset | Fix barriers on all routes; keyboard, dark/light/mobile checks | Safe |
| 2 | Split home demo and beginner learning action; retain AES and glossary actions | Help new learners start and demonstrate value; two screenshot/score/fix rounds | Safe |
| 3 | Searchable/filterable 12-topic catalog | Find topics by category/name/outcome; result count, zero result and reset | Safe |
| 4 | Reliable curriculum destinations and quiz-driven completion | Existing curricula currently link to placeholder pages; passed quizzes advance local modules; tests for progression without data deletion | Safe; existing public routes unchanged |
| 5 | Contextual lesson identity/next steps and local resume summary | Continue learning without another full catalog visit; retain all tools/content | Safe |
| 6 | Actionable related glossary terms, labelled search/filter states | Follow unfamiliar vocabulary; empty state and keyboard checks | Safe |
| 7 | Shared footer, clear loading feedback, per-route titles | Orientation/accessibility; browser titles, slow load and landmarks | Safe |
| Deferred | Accounts, cloud progress, classrooms, leaderboards, paid tutor | Needs schema/services/privacy/cost decisions | needs-approval.md |

## Every route / template

| Route | Design / feature changes | States to exercise in Phase 5 |
|---|---|---|
| / | Editorial introduction + working demo; guide CTA, retained AES/glossary links; numbered searchable category catalog; completion badges and retained feature content | Demo empty/play/pause/replay; search match/empty/reset; theme, mobile nav, progress |
| /aes | Lesson identity, readable lab/sidebar, meaningful Learn More action, next topic | Empty matrix, example/input errors, run/playback/result, educational accordion, quiz |
| /rsa | Same heading/lesson system; clear key-size/input/encrypt/decrypt groups; next lesson | No keys, generate, encrypt/decrypt valid/invalid, result, quiz |
| /ecc | Legible mathematical diagram area; clear finite-field educational scope; next lesson | All curve sizes, point addition/multiplication, result, quiz |
| /block-modes | Clear mode selector and diagrams, consistent comparison grouping; next lesson | Mode switches, patterns, inputs/error/run/result, quiz |
| /diffie-hellman | Party/secret/public hierarchy, consistent playground/result; next lesson | Input validation, exchange/playback, matching secret, quiz |
| /hashing | Consistent playground/output/avalanche hierarchy; next lesson | Empty/message/run/result, bit change, hash options, quiz |
| /hmac | Clearly distinguish key/message/inner/outer states; next lesson | Empty/valid input, hash result, educational expansion, quiz |
| /signatures | Sign/verify group hierarchy, tamper result readability; next lesson | No key/generate/sign/verify/tamper, invalid input, quiz |
| /padding | Clear scheme selector and meaningful byte visualization; next lesson | Scheme/block size/empty/full block, pad/unpad, quiz |
| /password-hashing | Educational simulation scope, cost controls/results hierarchy; next lesson | Cost/input/run/result and scope labels, quiz |
| /tls | Strong client/server flow distinction, controls with clear selected state; next lesson | Initial, handshake/play/pause/step/result, quiz |
| /cryptanalysis | Attack modes, chart/controls hierarchy; next lesson | Mode switches, frequency/brute-force inputs/run/result, quiz |
| /compare | Page identity, consistent chart/selector surfaces and legends | Select/swap/multiple comparison, empty/available results |
| /learn | Editorial curriculum cards, metadata/progress clarity, proper module destinations, quiz integration | Catalog/detail/start/continue, partial/complete, achievement status, persistence |
| /glossary | Editorial header, accessible search, counts and filter semantics, related-term buttons | Search/filter/no-results/reset/related term |
| /about | Editorial reading width, preserve mission/content/purpose/source links | Mobile reading, source/issue links, theme contrast |

## Verification and completion gate

- Phase 4: two desktop/mobile screenshot-score-fix rounds; record honest eight-dimension 1–5 scores. Anything below 4 requires rework. Scores are editorial judgments, not Lighthouse scores.
- Phase 5: each route receives changes, desktop/mobile captures, all relevant states and score/fix. Never mark a merely initial-loaded route done.
- Phase 6: runtime verification; build, project typecheck, lint, all unit tests and relevant e2e; Lighthouse production key pages and regression checks. Browser journeys start → experiment → quiz → curriculum continuation, glossary, compare, theme/mobile navigation.
- Phase 7: report.md with per-template before/after links, feature changes, scores, blockers and full needs-approval list. Stop without merge/deploy.

## Implementation sequence

4. Tokens/global card/input/button styles → shared header/footer/layout → homepage/search. Preserve homepage educational content by reorganizing it. Verify and commit.
5. Lesson shell/identity/next steps → each distinct lab route → learning progression → glossary/about/compare. Verify individually, then commit phase.
6. Complete functional and performance verification, fix regressions and commit.
7. Final evidence report, commit, stop.
