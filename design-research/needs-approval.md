# Needs approval

No risky changes performed. Preserve all existing URLs, pages, content, features and local progress.

Deferred possibilities (not part of the safe build):
- User accounts and cross-device progress: authentication, database schema/migrations, privacy decisions and hosting costs.
- Paid AI tutoring or third-party services: costs and API credentials.
- Public challenge submissions, leaderboards or classrooms: database, abuse moderation and learner-data handling.
- Changing routes, deleting content/pages or replacing educational algorithms: explicit approval and separate review required.
- Deployment, production configuration changes and merging: outside this task; do not perform.
- Replacing the educational FNV/truncated-hash signature model with standards-compliant signing: changes algorithm behavior and lesson content; requires a separate accuracy/security review. The existing model remains, with a visible collision warning.

## Functional audit follow-up (2026-10-08)

- Align outer CI and production installation with the independently tested nested pnpm dependency graph and its security patches/overrides. No CI/deployment configuration changed in the audit.
- Export/import learning progress: define validation, versioning, and overwrite consent before adding import behavior. No stored learner progress reset or migrated.
- OS-level PWA installation and installed-app update testing were not performed; offline behavior was verified in disposable Chrome profiles only.
