# Homepage review rounds

Scores below are editorial assessments of the actual Chromium screenshots, not automated performance scores. Dimensions scored from 1 (poor) to 5 (excellent). The rollout remains pending until the whole app is exercised in Phase 5; shared styles alone do not make a lesson done.

| Dimension | Round 1 | Round 2 | Reason / action |
|---|---|---|---|
| Point of view | 4 | 4 | Editorial field-guide title and numbered topics give an identifiable learning system. |
| Typography | 4 | 4 | Serif display, readable sans explanations, mono byte/topic metadata. |
| Layout and rhythm | 4 | 4 | Intro and real demo share the opening screen; ruled metadata, catalog, guided CTA and retained teaching summary. |
| Color and imagery | 4 | 4 | Restrained ink/paper + lime; algorithm transformations provide relevant imagery. |
| Motion | 4 | 4 | User controls playback; reduced motion supported; no decorative auto-animation in home hero. |
| Audience fit | 4 | 4 | Beginner learning path plus direct AES/glossary entry; explanations and working experiments. |
| Memorability | 4 | 4 | Editorial cryptography vocabulary and actual byte display; no invented testimonials/usage numbers. |
| Craft | 3 | 3 → rework | Round 1 exposed weak pending-byte/operand contrast. Round 2 improved contrast but speed/theme controls still lacked 44px touch targets; search should precede filters on mobile. Fixed before final confirmation capture. Full Lighthouse measurement and all-app accessibility review remain Phase 6. |

## Round 1 — screenshot, score, fix

- [Dark desktop](screenshots/after/home-round1-dark-1440.png), [dark mobile](screenshots/after/home-round1-dark-390.png), [light desktop](screenshots/after/home-round1-light-1440.png), [light mobile](screenshots/after/home-round1-light-390.png).
- Four initial-load checks: no page exception or horizontal overflow (`home-round1.json`).
- Fix: increase contrast of pending cipher bytes and mono labels; use light accent for operation text in dark theme; explicit HTML search label association.

## Round 2 — screenshot, score, fix

- [Dark desktop](screenshots/after/home-round2-dark-1440.png), [dark mobile](screenshots/after/home-round2-dark-390.png), [light desktop](screenshots/after/home-round2-light-1440.png), [light mobile](screenshots/after/home-round2-light-390.png).
- Four initial-load checks: no page exception or horizontal overflow (`home-round2.json`).
- Fix: 44px minimum cipher-speed/theme targets; search above category filters on mobile; slightly shorter mobile topic cards; native selected-button semantics for cipher choices instead of incomplete tab semantics. Narrow-width brand adjustment keeps all controls available.

## Final confirmation — complete

- [Dark desktop](screenshots/after/home-confirmed-dark-1440.png), [dark mobile](screenshots/after/home-confirmed-dark-390.png), [light desktop](screenshots/after/home-confirmed-light-1440.png), [light mobile](screenshots/after/home-confirmed-light-390.png) inspected in Chromium. No page errors or horizontal overflow in either theme. Additional 320/768/1024px checks pass.
- Final craft score: **4**. All eight dimensions now score 4. These are screenshot and interaction assessments; Lighthouse remains pending in Phase 6.
- Empty search has a clear reset action. Empty lab input disables playback and stepping; forward/back, playback/reset and cipher changes are exercised. Browser tests caught an incorrect empty-input Replay label; fixed before the final passing run.
- Fresh TypeScript and production build pass. 367 unit tests pass. Ten homepage/navigation browser tests pass. Targeted lint of discovery/layout and changed navigation tests passes.
- Full lint remains blocked: the existing global minimatch override makes jsx-a11y's nested-label rule crash (`_minimatch.default is not a function`). CipherLab cannot complete lint under that dependency combination. Carry this compatibility issue into Phase 6; no accessibility rule has been disabled.
- State evidence: [empty lab](screenshots/foundation/lab-empty.png), [one transformed byte](screenshots/foundation/lab-step.png), [empty search](screenshots/foundation/catalog-empty.png), [320px menu](screenshots/foundation/mobile-menu-320.png).
