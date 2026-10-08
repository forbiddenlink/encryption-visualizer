# Phase 5 — every-template rollout review

2026-10-08. Branch `design/upgrade`. All screenshots below were taken in installed Chrome through Playwright. Desktop 1440px; mobile 390px. Full-page and viewport captures are available in `screenshots/rollout-final/` (dark) and `screenshots/rollout-light/` (light). Both themes were loaded on all 17 routes: no page exceptions or horizontal overflow in the final initial-state sweep. The state tests independently exercise the working tools; an initial capture alone does not count as functional verification.

## Review rounds and decisions

Round 1 applied the field-guide shell to the distinct labs and utility pages. Point of view/type/layout initially scored 4; craft scored 3 where missing controls, disconnected learning progress and mobile form rows prevented the intended journey. Round 2 fixed those defects, then a final browser pass caught the cryptanalysis timeline overflow and an overly broad solid-button selector that made inactive glossary filters look selected. Those issues were corrected and recaptured. No final dimension scores below 4 remain in this editorial review. Scores are judgments about the inspected UI, not measured Lighthouse results; production performance and the comprehensive accessibility gate remain Phase 6.

- Every lesson has a numbered introduction, working notes/quiz anchors, consistent action controls and an explicit continuation. Desktop retains the experiment/notes split; mobile stacks with readable line lengths and 44px controls.
- AES now exposes playback/speed/step/reset controls; repeated encryption starts at the initial frame. Hashing now exposes speed alongside its existing playback.
- Client-side navigation clears the previous algorithm's ephemeral frames before mounting another lesson. Saved quizzes, achievements and curriculum data are preserved.
- Three scope labels distinguish the actual FNV-1a, simplified HMAC and iterated-password demonstrations from the cryptographic algorithms discussed in their notes.
- Quiz passes complete the appropriate existing curriculum modules. Five placeholder destinations now point to their existing topic routes. Completion covers all 12 lessons; rehydration derives module progress without deleting legacy IDs. Curriculum percentages count only current modules, so retained legacy IDs cannot inflate completion. Local resume and achievements use the same progress.
- Comparison has actual paired experiments for all six available algorithms, with synchronized or independent stepping/playback. Existing feature tables and charts remain.
- RSA rejects invalid numeric messages inline and recovers on valid encryption/decryption. Signature verification distinguishes valid and tampered messages.
- Glossary filters show the selected state, count results, recover from empty searches and navigate related terms already present in the dictionary.
- About uses ruled reading sections and the repository's canonical source/issue links. Its existing mission and educational-purpose content are retained.

## Final rubric and per-template evidence

P = point of view; T = typography; L = layout/rhythm; C = color/imagery; M = motion; A = audience fit; R = memorability; F = craft. Each is 1–5. The scientific visualizations provide the imagery; no decorative image service was added. All 17 routes are individually represented, including the 12 different algorithm labs.

| Template | P | T | L | C | M | A | R | F | Desktop / mobile | State evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| Home | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/home-1440.png) / [M](screenshots/rollout-final/home-390.png) | Phase 4 demo/search/menu tests; Phase 5 resume |
| AES | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/aes-1440.png) / [M](screenshots/rollout-final/aes-390.png) | Empty/input/run/play/step/result/reset/quiz; injected render fault/retry |
| RSA | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/rsa-1440.png) / [M](screenshots/rollout-final/rsa-390.png) | Initial/all key sizes/playback/result; invalid number and encrypt/decrypt round trip; quiz |
| ECC | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/ecc-1440.png) / [M](screenshots/rollout-final/ecc-390.png) | Initial/all three curves/point and key walkthrough through final frame; quiz |
| Block modes | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/block-modes-1440.png) / [M](screenshots/rollout-final/block-modes-390.png) | Initial/ECB/CBC/GCM/pattern demo/input/run/playback/result; quiz |
| Diffie–Hellman | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/diffie-hellman-1440.png) / [M](screenshots/rollout-final/diffie-hellman-390.png) | Exchange/playback/result; live private-key controls/new prime/shared-secret match; quiz |
| Hashing | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/hashing-1440.png) / [M](screenshots/rollout-final/hashing-390.png) | Empty/input/run/playback/result; avalanche, comparison, hex/binary/blocks; quiz |
| HMAC | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/hmac-1440.png) / [M](screenshots/rollout-final/hmac-390.png) | Empty key/message disabled, valid computation/playback/result; scope; quiz |
| Signatures | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/signatures-1440.png) / [M](screenshots/rollout-final/signatures-390.png) | Empty/sign/playback/result; valid verification/tamper failure; quiz |
| Padding | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/padding-1440.png) / [M](screenshots/rollout-final/padding-390.png) | Empty disabled; PKCS7/zero/ANSI-X923, both block sizes/full block/run/result; quiz |
| Password hashing | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/password-hashing-1440.png) / [M](screenshots/rollout-final/password-hashing-390.png) | Empty/input/cost/run/playback/result/benchmark; simulation scope; quiz |
| TLS | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/tls-1440.png) / [M](screenshots/rollout-final/tls-390.png) | Initial/handshake/play/pause/step/complete/reset; quiz |
| Cryptanalysis | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/cryptanalysis-1440.png) / [M](screenshots/rollout-final/cryptanalysis-390.png) | Input/all four attack modes/run/playback/result; mobile timeline repaired; quiz |
| Compare | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/compare-1440.png) / [M](screenshots/rollout-final/compare-390.png) | All six selections; sync steps, independent steps/play/pause/reset and available sample frames |
| Learning paths | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/learn-1440.png) / [M](screenshots/rollout-final/learn-390.png) | Catalog/detail/locked/start/partial/continue/complete/review; progress/achievement derivation and persistence |
| Glossary | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/glossary-1440.png) / [M](screenshots/rollout-final/glossary-390.png) | Search/category/count/empty/clear/related-term navigation |
| About | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | [D](screenshots/rollout-final/about-1440.png) / [M](screenshots/rollout-final/about-390.png) | Desktop/mobile reading and both theme captures; source/issue href checks |

Each corresponding light-theme capture uses the same filename in `screenshots/rollout-light/`. Before captures use the same filenames in `screenshots/before/`. Final reporting will place before/after pairs together in Phase 7.

## Functional evidence and limits

- `lab-states-results.json`: 24 passed, one per lesson at each viewport, with initial/empty/step/result screenshots in `screenshots/states/`.
- `learning-results.json`: 14 passed, including every quiz with correct/incorrect feedback, saved 9/10 result, completion and reload; curriculum and glossary journeys. Client-side active-lab switching is recorded in the focused `session-retest.json` run.
- `secondary-results.json`: 10 passed, including algorithm variants, valid/tampered signatures, invalid/valid RSA messages, demonstrations and comparison controls.
- `utility-results.json`: 8 passed, desktop/mobile partial/complete curricula, related/empty glossary, DH playground, HMAC validation, deliberately delayed lazy loading, browser offline/online recovery and injected visualization fault/retry. The completed curriculum is an explicit test fixture; quiz completion itself is separately exercised for every real quiz.
- `session-retest.json`: eight focused route/progress/loading/recovery/active-lab checks passed in the latest retest after replacing the cascading React state update with an atomic external-store session reset.
- Fresh production build/typecheck pass; 13 unit suites / 371 tests pass. Targeted lint passes for new components, stores and new browser tests. Comprehensive lint still has the existing minimatch/JSX accessibility dependency incompatibility; fix in Phase 6 without disabling rules.

Loading/error states are shared client-side components, so the common delayed-load and fault/retry template was exercised at both widths. These tools have no server submit, account or fetched-content empty state. Applicable input emptiness, disabled actions, numeric validation, quiz feedback and tamper failures were exercised. Offline banner behavior was tested; a production service-worker offline navigation audit remains Phase 6. External GitHub destinations were checked as links, not authenticated remote workflows. Lighthouse, the complete pre-existing e2e suite, all-page automated accessibility and production runtime performance remain unverified and are not claimed complete here.

## Approval boundary

No routes/pages/content/features were removed, no database/CMS changes occurred, no credentials or paid services were added, and nothing was merged or deployed. `needs-approval.md` remains the approval backlog. Existing user-owned root `CLAUDE.md` stays untouched and untracked.
