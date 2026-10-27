# Plan: Dummy Content Migration & Community Archive Ingestion for NKAR WOO LAN

## Context & Purpose

The **NKAR WOO LAN** web platform is currently functioning as an interactive digital archive prototype with static sample data. To maintain UI stability and visual completeness, all existing mock entries (`sample: true`, placeholder notes, illustrative imagery) have been preserved.

This document establishes the official roadmap, protocols, and technical specifications for transitioning each category of placeholder content into authentic, verified community records.

---

## 1. Contact & Communications Channels

**File:** `apps/web/src/data/site.ts`

### Current Placeholders
- Phone: `+237 000 000 000` (`placeholder number`)
- Email: `hello@nkarwooland.org` (`placeholder address`)
- Address: `Nkar Clan, Northwest Region, Cameroon` (`Detailed address (palace and market square) to be confirmed.`)

### Action Items
1. **Liaison Phone/WhatsApp**: Obtain and verify the official community liaison or palace secretariat phone number (including Cameroon country code `+237`).
2. **Official Mailbox**: Configure and connect an active domain email (e.g., `contact@nkarwoolan.org` or `custodians@nkarwoolan.org`).
3. **Physical Landmark**: Pinpoint exact location details (Nkar Palace, Nkar Market Square, Bui Division, Northwest Region, Cameroon).

---

## 2. Authentic Photography & Media Drive

**Files:** `apps/web/src/data/images.ts`, `apps/web/src/data/gallery.ts`

### Current Placeholders
- 15 AI-generated Base44 stock images (`https://media.base44.com/...generated_...png`).
- 7 gallery items marked `sample: true` with `photoNote` disclaimers.

### Action Items
1. **Community Photo Ingestion**:
   - High-resolution photographs of the Nkar Clan landscape and highland hills.
   - Authentic images of traditional ceremonies, Tohgu cloth, and drumming.
   - Palace architecture, carved pillars, and royal regalia.
   - Community development projects (water points, civic halls).
2. **Asset Pipeline**:
   - Optimize authentic images into modern WebP/AVIF formats (max 1600px width for heroes, 800px for cards).
   - Store locally in `src/assets/images/` or a dedicated high-speed CDN.
   - Remove `photoNote` and `SampleBadge` markers from confirmed items.

---

## 3. Traditional Leadership & Royal Lineage Registers

**File:** `apps/web/src/data/culture.ts` (`leadershipRecords`)

### Current Placeholders
- 5 mock reign slots (`record-1` to `record-5`) all labeled `"To be verified"`.
- Generic titles ("Earliest recorded reign", "Second recorded reign", "The present reign").

### Action Items
1. **Palace Verification**:
   - Coordinate directly with the Fon of Nkar and the Traditional Council of Elders.
   - Document the verified succession line of Nkar Fons with customary titles and reign eras.
2. **Biographical Entries**:
   - Record significant accomplishments, maternal lineages, and historical milestones for each Fon.
   - Secure authorized portraits or historical sketches where available.
   - Update `leadershipRecords` with verified data.

---

## 4. Historical Timeline & Origins

**File:** `apps/web/src/data/culture.ts` (`timeline`)

### Current Placeholders
- 4 of 5 historical periods labeled `"To be verified"`:
  - The founding of Nkar
  - The growth of the quarters
  - The fondom established
  - Palace, market and communal institutions

### Action Items
1. **Oral Tradition Recording**:
   - Transcribe oral histories from recognized community elders.
   - Record the founding ancestors, ancestral migration path, and establishment of the quarters.
2. **Timeline Refinement**:
   - Replace generic "To be verified" tags with consensus historical periods or eras.

---

## 5. Publications & Literature Shelf

**File:** `apps/web/src/data/books.ts` (`books`)

### Current Placeholders
- 6 books with placeholder authors (`'Nkar author — name to be confirmed'`), unconfirmed years, and sample tags.

### Action Items
1. **Literature Inventory**:
   - Catalog published books, research papers, monographs, and memoirs by Nkar sons, daughters, and historians.
2. **Metadata Completion**:
   - Record verified author names, book covers, publisher details, publication years, and acquisition links (or PDF archive copies where permitted).

---

## 6. Community Development Projects

**File:** `apps/web/src/data/projects.ts` (`projects`)

### Current Placeholders
- 4 projects with simulated progress percentages (62%, 40%, 55%, 15%) and placeholder updates.

### Action Items
1. **Development Committee Auditing**:
   - Interface with the Nkar Development Committee to obtain real status reports on:
     - Community water supply phases
     - Palace heritage conservation works
     - Education and school support funds
     - Road rehabilitation projects
2. **Metrics & Progress**:
   - Replace arbitrary percentage meters with verifiable milestones and audited community reports.

---

## 7. News, Events & Community Calendar

**File:** `apps/web/src/data/news.ts` (`news`, `eventsUpcoming`, `eventsPast`)

### Current Placeholders
- Fictional events and meetings with arbitrary calendar dates.

### Action Items
1. **Evergreen Noticeboard**:
   - Establish verified notices for regular community assemblies, cultural festival planning, and diaspora chapter meetings.
2. **Event Registration**:
   - Wire event participation links directly to the official Facebook community page or WhatsApp coordinators.

---

## 8. Backend & CMS Integration (Technical Phase)

**Files:** `apps/web/src/hooks/useContent.ts`, `apps/web/src/lib/api/`

### Current State
- `useContent.ts` runs on a simulated 240ms delay returning local TypeScript data objects.
- Dead auth API routes return 404s.

### Action Items
1. **CMS Selection**: Connect a lightweight headless CMS (e.g., Strapi, Supabase, or Sanity) or continue with Git-based JSON/Markdown files.
2. **Data Hydration**: Remove artificial timeout delays in `useContent.ts` once real endpoints are connected.
3. **Auth Strategy**: Remove dead auth endpoints unless user login/member portals are formally scheduled.
