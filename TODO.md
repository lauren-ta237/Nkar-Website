## TOODO

- [x] Convert project to typescript
- [x] Convert project from tailwindcss v3 to v4 setup

### NKAR WOO LÀN Updates (2026-11-09)

- [x] **Authentic Hero & Intro Imagery**:
  - Home Hero Background: `WhatsApp Image 2026-11-01 at 1.16.56 PM.jpeg`
  - About Page Hero: `WhatsApp Image 2026-11-01 at 1.16.56 PM.jpeg`
  - Leadership Page Hero: `fon sit.jpeg`
  - "Welcome to Nkar" Section: `WhatsApp Image 2026-11-01 at 1.16.56 PM.jpeg`
- [x] **Featured Gallery Photographs**:
  - `fon sit.jpeg` (The Royal Throne of the Fon)
  - `WhatsApp Image 2026-11-01 at 2.12.47 PM.jpeg` (Royal audience with Pope Francis at the Vatican)
  - `fon pope.jpeg` (Palace homage & papal blessing)
- [x] **Orthography & Branding**:
  - Standardized spelling to **NKAR WOO LÀN** (with grave accent "asang" on A).
  - Eliminated all residual occurrences of `"Land"` / `"LAND"`.
  - Switched logo imports to `logo.jpeg` and deleted `logo.jpg`.
- [x] **Official Contact Channels**:
  - Phone: `+237 679 632 780` & `+237 678 496 051` (clickable `tel:` links).
  - Email: `info@nkarwoolan.org` (clickable `mailto:` link).
- [x] **SEO, Open Graph & Social Sharing**:
  - Configured complete Open Graph metadata (`og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`, `og:type`, `og:locale`).
  - Configured Twitter Card metadata (`summary_large_image`).
  - Set OG image to `public/banner.png` (`https://nkarwoolan.org/banner.png` at 960x941).
  - Configured multi-resolution favicons (`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`) and `site.webmanifest`.
- [x] **Hero Logo Presentation**:
  - Removed frosted glass blur backdrop (`backdrop-blur-xs`, `border_border-gold-500/30_bg-forest-950/60`, container box).
  - Made the circular emblem significantly larger (`max-w-[420px]`, up from 280px) with authentic gold border (`border-gold-300/80`), deep shadow, and subtle interactive hover scaling.
- [x] **Copy Polish & Natural Phrasing Across the App**:
  - Eliminated AI-style em-dashes (`—`) across all data files (`culture.ts`, `books.ts`, `gallery.ts`, `news.ts`, `projects.ts`, `site.ts`) and pages.
  - Replaced contradictory photo placeholder notice in `Gallery.tsx` with accurate acknowledgement of authentic photography of the Fon, Vatican audience, and Nkar landscape.
  - Updated `ContactForm.tsx` submission feedback to an authentic community confirmation message with direct WhatsApp/phone and email channels.
  - Restructured draft notices in `NewsEvents.tsx` and `About.tsx` to read with dignified, natural community cadence.
  - Replaced repetitive "Nkar author — name to be confirmed" placeholders with dignified community attribution.
- [x] **Verification**:
  - Removed obsolete `photoNote` from `images.ts` and clean up unused imagery notes.
  - `npm run typecheck`: Passed with 0 errors.
  - `npm run build`: Bundled all authentic media assets and compiled cleanly.
