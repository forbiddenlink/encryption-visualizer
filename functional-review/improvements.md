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
