
❯ Carefully review the website UI/UX, content, language, dummy notes and cleanups that needs to be addressed. Plan a proper fix and propose an implementaton plan to adddress this issues

---

# Plan: UI/UX, Content & Language Cleanup for Nkar Woo Land

## Context

The Nkar Woo Land heritage archive is a frontend-only Vite + React 18 SPA. While the content strategy (explicitly marking all data as sample/placeholder) is sound for a community archive awaiting verification, there are significant issues across three areas:

1. **Placeholder/dummy content** that needs real data or removal when backend arrives
2. **Content & language quality** issues: inconsistent capitalization, grammar, duplication, broken template literal, misleading stats
3. **UI/UX & accessibility** issues: focus trapping missing, contrast failures, layout inconsistencies, unresponsive components, dead auth code

This plan addresses all three categories with prioritized, actionable fixes.

---

## Priority 1 — Critical Bugs & Accessibility (Week 1)

### 1.1 Fix Broken Template Literal (Search.tsx)
**File:** `src/pages/Search.tsx:100`
- **Issue:** `"Nothing found for “{term.trim()}”."` uses double quotes instead of backticks
- **Fix:** Change to template literal: `` `Nothing found for “${term.trim()}”.` ``

### 1.2 Fix Contrast Failures (WCAG AA)
**Files:** `src/index.css` (CSS variables), `src/components/ContentNotice.tsx`, `src/components/SampleBadge.tsx`, `src/components/EventCard.tsx`
- **Issues:**
  - `--muted-foreground` (155 12% 32%) on `--muted` (41 40% 94%) = ~3.2:1 → **FAIL**
  - `text-gold-700` (#6B4F00) on `bg-gold-50` (#FBF6E7) = ~2.1:1 → **FAIL** (used in ContentNotice title, SampleBadge, EventCard tags)
- **Fixes:**
  - Update CSS variables in `index.css`: darken `--muted-foreground` to ~25% lightness, darken gold-700 to ~35% lightness
  - Or add new tokens: `--muted-foreground-strong`, `--gold-700-strong`
  - Apply stronger tokens in affected components

### 1.3 Add Focus Trapping
**Files:** `src/components/SiteHeader.tsx` (mobile menu), `src/components/Lightbox.tsx`
- **Issue:** Modals don't trap focus; Tab escapes to background
- **Fix:** Add `FocusTrap` utility using `useEffect` + `tabIndex` management, or install `focus-trap-react` (lightweight)

### 1.4 Remove Dead Auth Code
**Files:** `src/pages/Login.tsx`, `Register.tsx`, `ForgetPassword.tsx`, `ResetPassword.tsx`, `OAuthConsent.tsx`, `src/lib/AuthContext.tsx`, `src/lib/api/auth.api.ts`, `src/lib/api/axios-client.js`, `src/components/ProtectedRoute.tsx`
- **Issue:** ~4KB dead bundle; auth pages not routed
- **Fix:** Delete all auth pages and related API code. Keep only if backend integration is confirmed in next sprint.

---

## Priority 2 — Content & Language Fixes (Week 1-2)

### 2.1 Standardize Placeholder Terminology
**Files:** All `src/data/*.ts`, components using `SampleBadge`
- **Issue:** Inconsistent labels: `sample: true`, `draft: true`, "Sample", "Draft", "Placeholder", "To be verified", "Regional context", "Register entry"
- **Fix:** Pick **one** term ("Sample" recommended) and standardize:
  - All data flags → `sample: true` (already majority)
  - All `SampleBadge` labels → `"Sample"` (with title attribute for context)
  - All notice text → "Sample content — not verified"

### 2.2 Fix Capitalization & Grammar
**Files:**
- `src/data/site.ts:71` — "Grassfields highlands" → "Grassfields Highlands"
- `src/data/site.ts:115` — "History & origins" → "History & Origins"
- `src/data/culture.ts:87` — "Carving, beading & raffia" → "Carving, beading and raffia"
- `src/data/culture.ts:116` — Capitalize after colon
- `src/data/books.ts:3` — Add Oxford comma
- `src/data/books.ts:29` — Use en-dash (–) not hyphen
- `src/pages/About.tsx:68` — `&amp;` → `&` or "and"

### 2.3 Consolidate Duplicated Arrays
**Files:** `src/data/site.ts`, `src/components/ContactForm.tsx`, `src/components/SiteFooter.tsx`
- **Issues:**
  - `contactTopics` defined in `site.ts` AND hardcoded in `ContactForm.tsx` select options
  - `contributeWays` (6 items) in `site.ts` vs `takePart` (5 items) in `SiteFooter.tsx`
- **Fixes:**
  - Import `contactTopics` in `ContactForm.tsx` (already imported, just use it)
  - Import `contributeWays` in `SiteFooter.tsx` and replace `takePart`
  - Delete `takePart` array from `SiteFooter.tsx`

### 2.4 Fix Site Name Consistency
**Files:** `src/components/home/HeroSection.tsx:43`
- **Issue:** "About Nkar Woo" → "About Nkar Woo Land"
- **Fix:** Use `site.name` from imported config

### 2.5 Fix "Completed: 0" Stat
**Files:** `src/pages/Projects.tsx:30-44`, `src/data/projects.ts`
- **Issue:** Stat card shows "Completed: 0" misleadingly
- **Fix Options:**
  - A) Remove "Completed" stat card entirely
  - B) Add a completed project to data
  - C) Hide stat if count is 0
- **Recommendation:** Option A (remove) — cleaner until real completed projects exist

### 2.6 Update/Remove Placeholder Contact Details
**Files:** `src/data/site.ts:74-87`, `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`
- **Issue:** Email, phone, address, Facebook all marked placeholder
- **Fix:** Either:
  - Replace with real contact info (if available)
  - Or remove phone/Facebook entirely, keep only email with note "Contact form preferred"

### 2.7 Fix Future Dates in News/Events
**Files:** `src/data/news.ts:114-158`
- **Issue:** Events dated 2026-11-14 through 2027-01-09 (future relative to now)
- **Fix:** Either use past dates for samples, or add `isSample: true` with relative dates ("Next month", "In two months")

---

## Priority 3 — Layout & Responsive Fixes (Week 2)

### 3.1 Standardize Container & Section Padding
**Files:** All page components and section components
- **Issue:** Inconsistent vertical padding (80px vs 64px vs 112px), all use `max-w-6xl` except Gallery
- **Fix:** Define design tokens in `index.css` or Tailwind config:
  - `--space-section-sm`: 64px (py-16)
  - `--space-section-md`: 80px (py-20)
  - `--space-section-lg`: 112px (py-28)
  - Apply consistently: Hero sections = lg, Content sections = md, Footer = sm

### 3.2 Fix Breakpoint Mismatches
**Files:** `src/components/SiteHeader.tsx`, all components using `dt:` breakpoint
- **Issue:** Custom `dt: 880px` vs Tailwind defaults `md: 768px` / `lg: 1024px` causes 768-880px gap
- **Fix:** Either:
  - Remove `dt` breakpoint, use standard `md`/`lg` everywhere
  - Or add `dt` to all responsive utilities used
- **Recommendation:** Use standard Tailwind breakpoints; delete `dt` from `index.css` @theme

### 3.3 Remove Inline Styles (HeritageBorder)
**File:** `src/components/HeritageBorder.tsx:20-27`
- **Issue:** Full inline `style` object bypassing Tailwind
- **Fix:** Convert to CSS classes in `index.css` using `@layer utilities` or CSS variables

### 3.4 Fix HeroSection Fixed Height
**File:** `src/components/home/HeroSection.tsx:61`
- **Issue:** `h-[480px]` fixed height on desktop
- **Fix:** Use aspect ratio utility: `aspect-[3/4]` or `aspect-[4/5]` with `max-h-[60vh]`

### 3.5 Add Empty States
**Files:** `src/components/GalleryGrid.tsx`, `Timeline.tsx`, `TraditionsGrid.tsx`, `RolesGrid.tsx`, `CeremonialYear.tsx`
- **Issue:** Empty arrays render empty containers
- **Fix:** Add conditional rendering with friendly message:
  ```tsx
  {items.length === 0 ? (
    <p className="text-center py-12 text-muted-foreground">
      No {label.toLowerCase()} to display yet.
    </p>
  ) : (
    // existing grid/list
  )}
  ```

---

## Priority 4 — Polish & Enhancement (Week 2-3)

### 4.1 Improve ContactForm UX
**File:** `src/components/ContactForm.tsx`
- **Issues:** Button says "Check my message" but doesn't send; success message says "nothing has been sent"
- **Fixes:**
  - Change button text: "Validate message" (since it only validates)
  - Update success message to be clearer: "Your message is ready to send. Please use the contact details above to reach us directly."
  - Or: Add a real form backend (Formspree, Netlify Forms, etc.) if budget allows

### 4.2 Fix Image Alt Text
**Files:** `src/components/GalleryGrid.tsx:31`, `Lightbox.tsx:90`, `HeroSection.tsx:15`, `PageHero.tsx:35`
- **Issue:** `alt` includes verbose `photoNote` ("Illustrative image — not a photograph of Nkar...")
- **Fix:** `alt` should be concise: `{item.title}` or `{item.caption}`. Move `photoNote` to visible caption or remove.

### 4.3 Add Keyboard Navigation
**Files:** `src/components/FilterChips.tsx`, `src/components/GalleryGrid.tsx`
- **FilterChips:** Implement roving tabindex for arrow keys between chips
- **GalleryGrid:** Add arrow key navigation (Left/Right/Up/Down) between grid items

### 4.4 Clean Up Unused Prop Defaults
**Files:** `src/components/SectionHeading.tsx` (`as` prop), `src/components/ContentNotice.tsx` (`title` default)
- Remove unused defaults or make props required

### 4.5 Reveal Component Safety
**File:** `src/components/Reveal.tsx`
- **Issue:** If IntersectionObserver fails, content stays invisible
- **Fix:** Add fallback timeout: after 2s, reveal content regardless

---

## Files to Modify (Summary)

| Priority | Files | Count |
|----------|-------|-------|
| **P1 Critical** | `Search.tsx`, `index.css`, `ContentNotice.tsx`, `SampleBadge.tsx`, `EventCard.tsx`, `SiteHeader.tsx`, `Lightbox.tsx`, (delete 8 auth files) | 7 + 8 deletions |
| **P2 Content** | `site.ts`, `culture.ts`, `books.ts`, `news.ts`, `projects.ts`, `About.tsx`, `HeroSection.tsx`, `Projects.tsx`, `ContactForm.tsx`, `SiteFooter.tsx` | 10 |
| **P3 Layout** | `index.css`, `HeritageBorder.tsx`, `HeroSection.tsx`, `GalleryGrid.tsx`, `Timeline.tsx`, `TraditionsGrid.tsx`, `RolesGrid.tsx`, `CeremonialYear.tsx`, `SiteHeader.tsx` | 9 |
| **P4 Polish** | `ContactForm.tsx`, `GalleryGrid.tsx`, `Lightbox.tsx`, `HeroSection.tsx`, `PageHero.tsx`, `FilterChips.tsx`, `SectionHeading.tsx`, `ContentNotice.tsx`, `Reveal.tsx` | 9 |

**Total: ~35 files modified, 8 files deleted**

---

## Verification Checklist

### Automated Checks
```bash
npm run lint          # Must pass (ESLint 9)
npm run typecheck     # Must pass (TypeScript strict)
npm run build         # Must succeed
```

### Manual Accessibility Testing
- [ ] Tab through entire site — no focus traps
- [ ] Screen reader (NVDA/VoiceOver) — all images have appropriate alt, landmarks announced
- [ ] `prefers-reduced-motion` — animations disabled
- [ ] Color contrast audit (axe DevTools or Lighthouse) — all text ≥4.5:1

### Manual Responsive Testing
- [ ] Mobile (375px): No horizontal scroll, menus work, images scale
- [ ] Tablet (768px): Layouts adapt, no breakpoint gaps
- [ ] Desktop (1024px+): Full layout, hover states work
- [ ] Custom 880px breakpoint: Verify removed or consistent

### Content Review
- [ ] All "Sample" badges consistent
- [ ] No placeholder contact info in header/footer
- [ ] Search "no results" message renders correctly
- [ ] "Completed" stat removed or populated
- [ ] Site name consistent everywhere

### Dead Code Removal
- [ ] Auth pages deleted
- [ ] Auth API files deleted
- [ ] AuthContext simplified or removed
- [ ] No imports of deleted files remain

---

## Dependencies & Risks

| Risk | Mitigation |
|------|------------|
| Contrast fixes may change visual design | Test with design stakeholder; use design tokens for easy adjustment |
| Removing auth pages breaks future backend integration | Keep auth API spec in docs; backend team can re-add when ready |
| Breakpoint changes affect many components | Use global search for `dt:`, `md:`, `lg:` to audit all usages |
| Empty states need design approval | Provide mockups for review before implementing |

---

## Success Metrics

1. **Zero ESLint/TypeScript errors**
2. **Lighthouse Accessibility score ≥ 95**
3. **All contrast ratios ≥ 4.5:1 (WCAG AA)**
4. **No dead code in bundle** (verify with `npm run build -- --analyze`)
5. **All placeholder terminology consistent** ("Sample" only)
6. **Search "no results" works correctly**
7. **No horizontal scroll at 375px viewport**

---

## Implementation Order

1. **Day 1:** P1.1, P1.2 (Search bug + contrast)
2. **Day 2:** P1.3, P1.4 (Focus trap + delete auth)
3. **Day 3:** P2.1-P2.7 (Content standardization)
4. **Day 4:** P3.1-P3.5 (Layout & responsive)
5. **Day 5:** P4.1-P4.5 (Polish)
6. **Day 6:** Full regression test + verification checklist

---

## Notes

- The `SampleBadge` pattern and explicit `sample: true` flags are **good practices** — keep them; just standardize the label.
- The heritage-inspired design tokens (colors, fonts, patterns) are strong — preserve them.
- All fixes should maintain the respectful, dignified tone appropriate for a cultural heritage site.
- Consider creating a `CONTRIBUTING.md` or content guide for future editors on how to replace sample content with verified records.