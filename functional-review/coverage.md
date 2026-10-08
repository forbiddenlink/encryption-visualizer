# Functional coverage — CryptoViz

Audit started 2026-10-08 on branch `design/upgrade`, baseline 821dd58. Source of truth: nested React/Vite application; old completion documents are not verification. Public, educational browser application. All visitors share the same capabilities; no authenticated roles, remote account, database, payments or server API exist in source. Main journey: choose a topic, generate an experiment, inspect/play steps, answer a quiz, resume a learning path.

Evidence: `evidence/baseline-inventory.json` records headings, every visible link/button/input/select/summary, runtime module source, browser exceptions and horizontal overflow for all routes at 1440 and 390 pixels. Corresponding full-page Chrome screenshots are `baseline-<route>-<width>.png`. Loaded local runtime was http://127.0.0.1:3002, including `/src/main.tsx`; this is local development, not deployment. Initial automated unit report: `evidence/baseline-unit.json`. Existing tests were independently inspected for missing behavioral assertions and hidden repair steps.

## Route and feature inventory

The rows below inventory the intended bounded workflows; final outcome/status and evidence are recorded in the verification matrix below. Prerequisite for experiments: browser JavaScript, valid bounded educational inputs. Quiz/progress prerequisite: local storage; it is browser-local, not an account. Source is `encryption-visualizer/src/`.

| Route / source | Expected behavior and controls | Audit findings / planned proof |
|---|---|---|
| `/` pages/HomePage | Topic search/filter/reset, catalog links, suggested/start/resume lesson, compare/path navigation | Desktop/mobile loaded; verify hash catalog landing and empty search |
| `/aes` pages/AESPage | Example/input validation, encrypt, 42 finite-byte frames, playback, rounds, avalanche, quiz | P1 incorrect AES arithmetic and runtime crash; known-answer + complete browser playback |
| `/rsa` pages/RSAPage | Three key sizes, generate keys, encrypt/decrypt bounded numeric input, steps, quiz | Independently check round trip/boundaries and regenerate |
| `/ecc` pages/ECCPage | Curve sizes, regenerate, point/signature lesson, steps, quiz | P1 impossible tiny-curve signatures loop forever; bounded result |
| `/diffie-hellman` pages/DiffieHellmanPage | Sizes, generation, shared-secret steps, playground prime/private keys, quiz | Wrong primitive generator, fractional keys and stale prime-dependent bounds |
| `/block-modes` pages/BlockModesPage | ECB/CBC/GCM, input/key, compare repeated blocks, regenerate, steps, quiz | UTF-8 errors, stream padding, incomplete tag coverage, unbounded quadratic snapshots; toy cipher disclosure |
| `/hashing` pages/HashingPage | Text hash, avalanche comparison, step playback, quiz | FNV arithmetic precision and Unicode errors |
| `/hmac` pages/HMACPage | Message/key, generate, byte XOR/inner/outer steps, quiz | Different emoji keys collapse; byte encoding regression |
| `/signatures` pages/SignaturesPage | Message/key sizes, sign, verify original/tampered text, steps, quiz | Decimal garbage and out-of-range signatures accepted |
| `/padding` pages/PaddingPage | Text/block size/scheme, generate/unpad, byte display, quiz | Unicode roundtrip, zero-pad count, ANSI invalid filler, newline false failure |
| `/password-hashing` pages/PasswordHashingPage | Algorithms/cost/password, bounded simulations, playback, quiz | Deterministic simulated salts incorrectly called random |
| `/tls` pages/TLSPage | Version/key-exchange lesson generation, phases, steps, quiz | Educational handshake only; inspect all configured choices |
| `/cryptanalysis` pages/CryptanalysisPage | Attack modes, ciphertext/shift, brute-force/frequency results, steps, quiz | Frequency candidate always claims successful identification |
| `/compare` pages/ComparePage, components/compare | Six left/right algorithms, swap, sync/independent play/back/next/reset, tables/charts | URL re-applies and overrides selection; reversed query pair rejected |
| `/learn` pages/LearningPathsPage | Expand curricula, prerequisites, start/resume, completion and achievements | Missed-question review overwrites assessment and grants completion |
| `/glossary` pages/GlossaryPage | Search, category/filter/reset, empty state and cross-topic links | Test combined filters and recovery |
| `/about` pages/AboutPage | Scope/limitations and topic/catalog links | Loaded desktop/mobile; all links need click proof |
| unmatched URL / router/index | Helpful route error with home/retry | Missing route and lazy module errors must retain recovery |

## Shared behavior and state

- Layout/Header/Footer, theme radio controls, reduced motion, responsive menus, focus/skip links and scroll/hash navigation.
- PlaybackControls/useKeyboardShortcuts/useAutoAdvance and visualizationStore: play/pause/next/back/start/end/reset/speed/keyboard; transient experiment state must stay in bounds and recover via UI.
- QuizSystem/QuizResults/progressStore: answer once, explanation, next/results/retry/review; only full assessments grant completion, never practice review. Missed IDs, recorded scores, visits and achievements persist locally.
- CompareStore: temporary pair/sync; query initialization must honor valid distinct pairs once per URL, permit later user edits, and behave on back/forward.
- Theme/accessibility persisted browser preferences; toast dismiss/timing and screen-reader announcements.
- ErrorBoundary/router lazy loaders: loading/rejected import/malformed experiment, retry/reload/home. No test may repair production state behind the user's back.
- PWA/InstallPrompt: browser event driven; accepted/dismissed/no-event states. Full OS installation/offline service-worker update remains separately scoped.
- Optional PostHog integration: source inspection and absent-key local behavior only; live vendor ingestion excluded to avoid external impact. No credentials read.

## Verification status

Every route was freshly loaded at desktop/mobile. Loading alone was not counted as interaction verification. Negative-input, state, keyboard, recovery and cross-route regressions execute actual controls; independent crypto checks assert results, not just output shape. See the matrix and limitations below.

## Completed verification evidence

- `baseline-unit.json`:371/371 passing before repairs, confirming baseline tests missed the reproduced defects.
- `math-crypto-red.log`, `math-input-red.log` → `math-green.log`:134 tests covering two AES ciphertext vectors, all generated bytes, bounded ECC no-signature cases, DH generators/inputs.
- `text-baseline-red.log` → `text-green.log`: independent source execution37 failures →49/49 passes; final Vitest includes these behavioral contracts.
- `keyboard-red.log`, `state-red-isolated.log`, `compare-red.log` → `state-green.log`: native keyboard scope, assessment preservation, bounded playback, AES achievement and atomic/editable comparison pair.
- `integration-red-unit.log`, `integration-red-lazy.log` → `integration-green-unit.log`6/6 and `integration-green-browser.log`6/6: actual catalog geometry, theme arrows/focus, install dismissal, menu closure, rejected download reload/home, UI-only visualization retry.
- `final-browser.json`:105/106 passed in full fresh Chrome run, no skips/flakes; one fourteen-answer mobile review test hit30-second whole-test budget at reload. The targeted six-state-journey rerun (`state-browser-green.json`) uses60seconds for that workflow, retains every assertion, and passes6/6 with no skips or flakes. All106distinct cases therefore have passing evidence across the full run and focused rerun.
- `after-inventory.json`: all36 production-build desktop/mobile views loaded without exceptions or horizontal overflow; scripts are built assets, not Vite source modules.
- `production-smoke.json`: actual `/sw.js` controlled the disposable production preview, light theme persisted after reload, offline navigation to AES/generated/final step/reload succeeded without exceptions. Fresh offline reload correctly starts with empty transient experiment state.
- Typecheck succeeded; lint181files/0errors/0warnings; production build generated59PWA precache entries. Vite reports a future native-config compatibility warning about`__dirname`; no build failure or source change justified by this audit.

## Limits / excluded surfaces

- Live analytics ingestion **excluded**: localhost disables PostHog initialization; no production keys or vendor configuration inspected. Its enabled live behavior is not verified.
- Actual OS installation, installed-app update prompt and long-term offline cache eviction **partial**: mocked browser install events and genuine service-worker offline operation verified; no application was installed into the user's OS.
- Safari/Firefox/browser versions beyond installed Chrome, extremely constrained devices and prolonged load/stress **untested**; this is a bounded functional audit, not a compatibility/performance certification.
- Algorithms described as educational simulations retain toy keys/hash/XOR and are not suitable production cryptography. Real encryption-library replacement remains new product scope.
- External GitHub source navigation checked as a link target only; no writes or remote actions. Auth/roles/database/billing/jobs/admin **excluded as absent** from source, not presumed working.
- Real learner data/account sync or destructive reset/migration **excluded**. Browser tests use disposable profiles and synthetic quiz results only.

## Final verification matrix

“Verified” means the named bounded behavior passed, not every possible input or platform. Route/control snapshots are the exact complete initial visible-control inventory, with additional generated-state controls exercised by the journey specs.

| Area | Status | Actual behavioral evidence |
|---|---|---|
| Home discovery and introductory lab | verified | home-discovery: combined search/category/no results/clear; keyboard topic menu/Escape/focus; mobile final-topic navigation; empty input/play/step/reset/cipher variants |
| AES | fixed + verified | independent AES vectors/all-byte frames/invalid supported-byte input; default generation to final frame at both widths; repeated route switching, keyboard button activation,4x achievement |
| RSA | verified | key generation core tests; browser encryption/decryption roundtrip and invalid/out-of-range input at both widths; full quiz |
| ECC | fixed + verified | three curve choices/browser walkthrough; finite nonce exhaustion and point/signature core tests; full quiz |
| Diffie-Hellman | fixed + verified | primitive-order checks, integral/bounded key controls and prime change; browser generation/shared-secret playground; full quiz |
| Block modes | fixed + verified | all three mode controls, repeated-block demonstration, negative/Unicode/length/tag tests and final-step browser output; full quiz |
| Hashing/HMAC | fixed + verified | independent byte/FNV/HMAC vectors; browser input validation/hash playground/avalanche/display variations and default generations; full quizzes |
| Signatures | fixed + verified | malformed/range checks and regenerated-key state reset; actual sign/verify/tamper browser interactions; full quiz |
| Padding | fixed + verified | all three schemes and block sizes; decoded roundtrip/zero/ANSI negative tests, browser variants/default final states; full quiz |
| Password hashing | fixed + verified | bounded illustrative cost/algorithm core tests; browser benchmark/cost flow, honest deterministic-salt scope; full quiz |
| TLS | verified | generated handshake lesson/step progression and TLS core tests, both widths; full quiz. Real TLS negotiation is absent |
| Cryptanalysis | fixed + verified | all four attack controls, generated/final output; empty/no-letter frequency uncertainty and frequency/brute-force core checks; full quiz |
| Comparison | fixed + verified | every algorithm selection, synchronized/independent play/back/reset; reversed deep link, subsequent edit/reload/back/forward; reversible metadata regression; matrix control sweep below |
| Learning paths/progress | fixed + verified | real12topic quizzes save completion; locked prerequisites/start/resume and synthetic partial/completed path UI states; persistent reload and failed6/10assessment survives perfect missed review |
| Glossary/About | verified | combined filters/search/related terms/empty recovery; About internal link journeys at both widths; all initial internal link paths match known routes |
| Header/theme/menus | fixed + verified | real sticky-header hash landing, same-route menu closure, theme arrows/one tab stop, responsive links; production light-theme reload |
| Recovery/loading | fixed + verified | delayed/rejected lazy resource and actual reload recovery; malformed temporary data injection then offered Try Again with no hidden state repair; unmatched route screenshots |
| Offline/install | fixed + partially verified | real production service-worker offline navigation/generatedAES/reload passes; controlled install event dismissal passes. OS installation/update lifecycle excluded |
| Educational accordions/matrix explanations | fixed + verified | control-sweep.json:182keyboard-expand/collapse checks across all91lesson cards at both widths;84matrix checks cover all42explanations, selected state and keyboard close at both widths |
| Live analytics | excluded | optional production-only ingestion not exercised or configured |

Requirements with external services, production configuration or new product scope remain in `improvements.md` sectionC and `../design-research/needs-approval.md`.

Final source commit: `76c6595`. Full final unit/component suite: **460/460 passed** (89additional regressions compared with baseline). Final lint: **182files,0errors,0warnings**. Final build and typecheck passed after the matrix/accessibility repair. The exact final production asset `/assets/index-C1Fs32_w.js` was loaded in all36final inventory views with0exceptions/overflow. `matrix-green.log` passes all3focused comparison/matrix checks.
