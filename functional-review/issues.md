# Functional issues

Severity reflects local educational-app impact. Reproductions use public example text and toy keys. Repairs have behavioral red/green evidence; full verification and external limits are recorded in coverage.md.

| ID / severity | Reproduction and expected vs actual | Root cause / repair | Evidence |
|---|---|---|---|
| F01 P1 | Encrypt AES default, advance to round 2: byte values must render; undefined cells crash. Standard vector 001122…eeff / 000102…0f must produce 69c4…c55a, previously wrong. | GF multiplication escaped 8 bits; mask intermediate results, known-answer tests and byte input validation. | math-crypto-red.log; math-green.log |
| F02 P1 | ECC small subgroup, private 3/message42: must finish or explain impossible signature; loops forever. | Every nonce fails r/s constraints; enumerate finite subgroup once, return honest unavailable lesson. | math-crypto-red.log; math-green.log |
| F03 P2 | Generate DH p23: claimed generator must have order22; g2 order11 accepted. | Half-order predicate; require full multiplicative order. | math-crypto-red.log |
| F04 P2 | DH playground high key then smaller prime; enter2.5: integral bounded key expected, old95/max21 or fractional state actual. | Clamp both keys with new prime and normalize numeric inputs. | math-input-red.log; math-green.log |
| F05 P2 | Hash hello: published FNV-1a expected4f9f2cab, previouslya82fb4a1. | Floating multiplication loses32bit precision; Math.imul + UTF-8 bytes. | text-baseline-red.log; text-green.log |
| F06 P2 | Emoji text/key in hash/HMAC/padding: distinct UTF-8 bytes and reversible decoded text expected; surrogate data lost/emoji keys collapse. | Character codes confused with bytes; encode consistently, byte-aware displays. | text-baseline-red.log; text-green.log |
| F07 P2 | Aligned zero padding says8 extra bytes though none; newline roundtrip says failure; ANSI filler [65,99,2] accepted. | Derive actual count, compare raw recovered message and validate fill. | text-baseline-red.log |
| F08 P2 | GCM toy mode with changed ciphertext suffix retains tag; partial stream blocks padded. | Tag only prefix; include all bytes/nonce/length, preserve stream length, disclose nonproduction simulation. | text-baseline-red.log |
| F09 P2 | Signature verify '123garbage' or signature+n: malformed/out-of-range must fail, parseInt/normalization accepts. | Whole decimal/range checks in UI/core. | text-baseline-red.log |
| F10 P2 | Frequency analysis empty/numeric/short: uncertain candidate expected, successful identification claimed. Password salt repeats but called random. | False explanatory claims; explicit candidates and deterministic toy salt scope. | text-baseline-red.log |
| F11 P2 | Linked comparison then change dropdown; expected new selection, resets from query. Reverse URL rsa/aes rejected. | Effect depends on selections and checks stale opposing sides; initialize distinct pair atomically per URL. | compare-red.log; state-green.log; state-browser-green.json |
| F12 P2 | Failed full quiz then perfect missed review: original assessment must remain; review overwrites full score and grants completion. | Persist only full assessments; review-specific feedback, truthful achievements. | state-red-isolated.log; state-green.log; state-browser-green.json |
| F13 P2 | Space on quiz/button/select while AES controls mounted: native action expected; playback shortcut cancels it. | Ignore interactive targets/modifier/default-handled events. | keyboard-red.log |
| F14 P2 | Retry malformed AES state: should recover via offered UI; previous test secretly cleared store first. | Clear transient frames in boundary retry, remove hidden repair from test. | integration-red-unit.log; integration-green-unit.log |
| F15 P2 | Lazy page download fails: navigation/reload recovery expected; default router error replaces usable shell. | Route error boundary inside layout with reload/home action. | integration-red-lazy.log; integration-green-browser.log |
| F16 P2 | Dismiss native install prompt then click visible Install: no action. | Dismissed deferred event must hide install action. | integration-red-unit.log |
| F17 P2 | /#topics links, same-route mobile links, theme arrows: expected catalog landing/menu closure/radio keyboard operation; incorrect scroll/open menu/all tab stops actual. | Hash-aware scroll, close link actions, roving radio keyboard; reduced motion honored. | integration-red-unit.log |
| F18 P2 | Complete AES at4x: shared achievement rule expected; AES duplicate timer omits award. | Reuse common advancement hook. | state-red-isolated.log; state-green.log |
| F19 P2 | Very long block-mode input: finite bounded educational output expected; quadratic copies can exhaust UI memory. | Visible1024UTF-8-byte bound and error without losing input. | text-baseline-red.log; final-unit.json |

Operational finding (not changed): outer CI does not run full nested checks; deployment install uses npm while the project relies on pnpm overrides/patches. Changing production configuration requires separate approval. No remote systems were touched.

Additional repair discovered during regression integration: the comparison's built-in AES plaintext and key were both17characters and previously silently truncated. They are now explicit16-byte samples for all comparisons. `state-red-isolated.log` captured this integration rejection; `compare-red.log` then isolated the independent query-state failure.

AES expected output is independently specified in [NIST FIPS197 historical example vectors, AppendixC.1](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf). This source was loaded during this audit; the2023 update states that it made no technical algorithm changes. The test also includes the independent all-zero AES vector.

F20 P2 — Comparison metadata labels signatures and Diffie-Hellman “Reversible: Yes”, conflating signatures/key exchange with reversible encryption. Reproduced in `comparison-metadata-red.log`; restrict reversible labels to AES/RSA encryption and block modes. No new capability or algorithm replacement.

F21 P2 — Comparison explanation close button has no accessible name. Keyboard/screen-reader visitors need a discoverable close action and selected-state feedback. `matrix-red.log` reproduces the accessible-role failure; added named explanation region, named close action and `aria-pressed` on matrix cells. No feature removed.

All21issue groups are repaired in source, including the19initial groups, comparison metadata and matrix accessibility. Passing full and focused tests verify the repaired local behavior; external/OS-only limits remain explicitly excluded or partial in coverage. No production operation was attempted.
