# Visual Assets Coverage Ledger

Date: 2026-10-09
Project: CryptoViz (Interactive Encryption Visualizer)
Aesthetic: Illustrated scientific atlas (warm paper, deep ink, vermilion accents, Newsreader display headings, DM Sans body text, scientific plate schematics).

## Asset Inventory and Optimization Results

| Asset / Area | Path | Previous Status | Final Status | Previous Size | Optimized Size | Reduction | Notes |
|---|---|---|---|---|---|---|---|
| Vector Favicon | `public/favicon.svg` | Outdated generic blue padlock | Adaptive SVG mark | 561 B | 884 B | Clean SVG | Supports `prefers-color-scheme` dark and light themes with vermilion vault mark. |
| Standard Favicon | `public/favicon.png` | Outdated 640x640 blue padlock | 32x32 pixel-fitted PNG | 411.6 KB | 1.2 KB | -99.7% | Eliminates 410 KB download per visitor. |
| Fallback Favicon | `public/favicon.ico` | None | Multi-resolution 16/32 ICO | None | 2.0 KB | New asset | Multi-resolution legacy crawler and browser fallback. |
| Small Favicon | `public/favicon-16x16.png` | None | 16x16 pixel-fitted PNG | None | 534 B | New asset | Precise small icon for legacy/standard tab bars. |
| Medium Favicon | `public/favicon-32x32.png` | None | 32x32 pixel-fitted PNG | None | 1.2 KB | New asset | High-DPI tab icon. |
| Apple Touch Icon | `public/apple-touch-icon.png` | Outdated 640x640 blue padlock | 180x180 squircle icon | 411.6 KB | 16 KB | -96.1% | Proper iOS home screen icon with dark field and coordinate rings. |
| PWA 192 Icon | `public/icons/icon-192x192.svg` | Outdated blue padlock | 192x192 SVG brand mark | 607 B | 1.0 KB | Clean SVG | Crisp PWA app launcher icon. |
| PWA 512 Icon | `public/icons/icon-512x512.svg` | Outdated blue padlock | 512x512 SVG brand mark | 633 B | 1.4 KB | Clean SVG | Maskable/standalone PWA splash and launcher icon. |
| Canonical Logo | `public/logo.png` | Outdated 640x640 blue padlock | 512x512 high-res brand mark | 411.6 KB | 60 KB | -85.4% | Official raster brand mark. |
| Small Logo | `public/logo-small.png` | Blurry 64x64 blue padlock | 64x64 crisp brand mark | 5.3 KB | 4.0 KB | -24.5% | Small raster rendition for compact embeddings. |
| Social Preview Card | `public/og-image.png` | 640x640 square generic cyan stock art | 1200x630 1.91:1 scientific atlas card | 701.4 KB | 295 KB | -57.9% | Proper 1.91:1 ratio for Open Graph and Twitter summary_large_image; includes atlas typography, brand vault mark, and scientific plates. |
| About Hero Insignia | `src/pages/AboutPage.tsx` | Legacy cyber-blue box with Lucide shield | AtlasInsignia component | N/A | Vector SVG | Medallion featuring vault mark with concentric coordinate rings. |
| About Taxonomy Plate | `src/pages/AboutPage.tsx` | Plain 3-item bullet list with colored dots | CryptographicPillarsSchematic | N/A | Vector SVG plate | Three-pillar taxonomy plate illustrating Symmetric, Asymmetric, and Hashing disciplines. |
| Curriculum Route Glyphs | `src/pages/LearningPathsPage.tsx` | Plain numbered rows | PathRouteGlyph component | N/A | Vector SVG route | Topological milestone roadmap connecting module sequence for each guided path. |

**Total Static Asset Weight Savings**:
- Before: ~1.94 MB
- After: ~380 KB (including full 1200x630 high-res social card and all multi-size icons)
- Net static download savings: **~1.56 MB (80.4% reduction)**

## Verification Ledger

All 17 application routes and page families verified locally against production build across desktop (1440px), tablet (834px), and mobile (390px) viewports in both dark and light modes.

| Page Family | Route | Desktop (1440px) | Tablet (834px) | Mobile (390px) | Themes Checked | Status |
|---|---|---|---|---|---|---|
| Home | `/` | Verified | Verified | Verified | Dark, Light | Improved and verified |
| AES Visualizer | `/aes` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |
| RSA Key & Math | `/rsa` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |
| Elliptic Curves | `/ecc` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |
| Hash Functions | `/hashing` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |
| Compare Lab | `/compare` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |
| Learning Paths | `/learn` | Verified | Verified | Verified | Dark, Light | Improved and verified |
| About Page | `/about` | Verified | Verified | Verified | Dark, Light | Improved and verified |
| Glossary | `/glossary` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |
| Block Modes | `/block-modes` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |
| Diffie-Hellman | `/diffie-hellman` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |
| HMAC | `/hmac` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |
| Digital Signatures | `/signatures` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |
| Padding Schemes | `/padding` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |
| Password Hashing | `/password-hashing` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |
| TLS Handshake | `/tls` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |
| Cryptanalysis | `/cryptanalysis` | Verified | Verified | Verified | Dark, Light | Reviewed unchanged |

## Verification Checks

- Playwright headless Chromium screenshots captured for all viewports and themes.
- Zero horizontal overflow across all tested viewports.
- Vitest unit tests: 27 test files, 516 tests passed.
- Production build: `tsc -b && vite build` succeeded with zero errors.
- ESLint: flat config passed with zero errors and zero warnings.
- Dashes rule check: Zero em dashes or en dashes across all committed output, comments, and SVGs.
