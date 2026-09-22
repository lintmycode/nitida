# Spec: nitida.pt redesign, phase 1

**Status:** phase 1 built (2026-09-22) · **Branch:** `feature/redesign` · **Design source:** `design_handoff_nitida_redesign/` (README + `Nitida Site Mockups.dc.html`)

The handoff README is the source for tokens, type scale, spacing and copy. This spec covers how that design maps onto this codebase, and the decisions the handoff leaves open. Where this spec and the README disagree, this spec wins.

## Scope

**In:** Home, Services (new), Works, About (new), Contact, plus the shared header, footer and design tokens.

**Out (phase 2):**
- **Case study pages** (`works/[slug].astro`, mockup 1f), and the schema fields that exist only for them: `problem`, `outcomes`, `quote`, `quoteAuthor`, `mobileImage`, `role`.
- The SVG redraw of the logo. Phase 1 uses `logo-lime.png`.
- The care plans page. The Services closing band links to Contact for now.

**Unchanged:** `hosting.astro` keeps its URL and content, but comes out of the nav. `qrn.astro` is untouched.

## Changes that follow from dropping case studies

- Work cards link to the live site (`link[0]`, new tab) with the label from `link[1]` plus `↗` (e.g. `VISIT ↗`, `GITHUB ↗`), not `CASE →`. The whole card stays clickable.
- Service proof links point to the work card on `/works#<slug>`. Each work card gets `id={slug}`.
- When a service has no proof project, the proof row is hidden. This applies to Cleanup & rescue until there's a nameable case. Never render the `[add a rescue case]` placeholder.

## Stack decisions

- **SCSS.** Add `sass` as a devDependency. The new global stylesheet is `src/styles/global.scss`, imported in `Layout.astro` frontmatter, so Astro compiles it. No build script is needed. Partials go under `src/styles/`: `_tokens`, `_base`, `_buttons`, `_header`, `_footer`, and one per page.
- **No Pico CSS.** The design is fully custom and flat, so Pico's defaults would have to be overridden everywhere.
- **Retire `public/styles.css`.** Keep a small legacy block with the old `--spacing-*`, `--font-size-*`, `--radius-sm` and `--accent-color` variables, because `hosting.astro`'s scoped `<style>` still uses them. Check `/hosting` visually after the switch.
- **Fonts.** One Google Fonts link: Fira Code 400/500/600/700 and Instrument Sans 400/500/600.
- **Delete** `public/app.js`, `public/letters.js`, `BackButton.astro` and `Navigation.astro`. The "NÍTIDA DIGITAL" letter seeding goes away: the handoff seeds randomly and the logo moves into the header.
- **Keep** the GA tag in `Layout.astro`.

## Shared components

**CTA rule:** every call to action on the site is either `START A PROJECT` or `CONTACT`, and both go to the `/contact` form. No tickets, no call booking, and no other CTA labels.


### `Layout.astro`
- Props: `title`, `description` (new, becomes `<meta name="description">`), `active` (`services|works|about|contact|null`), `cta` (`project|contact`, default `project`), `stageHeader` (boolean, home only).
- Renders `<Header>` and `<Footer>` on every page, home included. The footer is now on home too.
- With `stageHeader`, the page renders the header itself inside the life stage, and Layout skips it.
- `body` background is `--blue`. The animated 45° gradient is removed.

### `Header.astro`
- Logo `/logo-lime.png`, 62px tall, linking to `/`.
- Links: SERVICES, WORKS, ABOUT. The `active` link gets `aria-current="page"` and the persistent underline.
- CTA: `START A PROJECT` → `/contact`. On About and Contact it reads `CONTACT` (`cta="contact"`).
- **At 640px and below:** logo, a `MENU` button and the CTA. The button toggles a panel with the three links. It uses `aria-expanded` and closes on Escape.

### `Footer.astro`
- Content as README §Footer. The logo is `/logo.png` with `filter: invert(1) brightness(2)`.
- Pages column: Home, Services, Works. Also add About and Contact, since the mockup predates them as pages.
- Legal line: `© {year} NÍTIDA DIGITAL · Livro de Reclamações`, which links to https://www.livroreclamacoes.pt. No NIF: it's dropped from the design.

## Data

### `src/data/services.ts` (new)
- Exports `services` and `needs`, copied verbatim from `renderVals()` in the mockup.
- Change `proof` to `proof: { label: string; slug: string } | null`. The label keeps the mockup text; the slug is the first project named:

| Service | Proof label | Slug |
|---|---|---|
| 01 Custom WordPress | Borealis, INERCIA | `borealis` |
| 02 Shopify & e-commerce | Everbean Kids | `everbean` |
| 03 Apps & integrations | OneForma, Borealis engine | `oneforma` |
| 04 SEO, local & performance | Júlia Neves, Prisminfinito | `jna` |
| 05 AI in the workflow | Cinca, Everbean Kids | `cinca` |
| 06 Cleanup & rescue | none, so the row is hidden | — |
| 07 Hosting & care | Assistência Prisminfinito | `assistencia-prisminfinito` |

- The mockup's `steps` array (process strip) isn't in any artboard. Leave it out.

### Works collection (`src/content/config.ts`)
- Add `subtitle: z.string()` (the mockup's `sub`).
- Add `services: z.array(z.enum(['wordpress','shopify','seo','brand','apps']))`.
- Change `title` to the short name (e.g. "Borealis On Trekking"). The " - Subtitle" part moves to `subtitle`.
- Change `description` to the mockup's `line` copy. The copy is final, and this fixes Prisminfinito's optics/eyewear error.
- Leave the md body alone. Nothing renders it in phase 1; phase 2 case studies will.

| File | title | subtitle | services |
|---|---|---|---|
| oneforma | OneForma | Expert Marketplace Platform | wordpress, apps |
| borealis | Borealis On Trekking | Adventure Travel Platform | wordpress, apps |
| everbean | Everbean Kids | Children's E-Commerce | shopify, apps |
| casino | Casino Afifense | Cultural Events Hub | wordpress |
| prisminfinito | Prisminfinito | Brand Site | wordpress, seo |
| inercia | INERCIA | Climate Solutions Platform | wordpress, brand |
| assistencia-prisminfinito | Assistência Prisminfinito | Support Portal | wordpress |
| jna | Júlia Neves Advogada | Law Practice Landing Page | seo |
| console-invaders | Console Invaders | Retro Browser Game | apps |
| cinca | CINCA | Ceramic Tile Catalogue | wordpress, apps |

CINCA isn't in the mockup, so it keeps its current `description`.

## Pages

### Home (`index.astro`) — mockup 2a
- `.stage` is `min-height: 100svh` and contains the canvas (absolute, full-bleed), the `<Header>`, the hero (bottom-left, max-width 660) and the status bar. The footer follows the stage.
- Copy as mockup: eyebrow, H1 (`clamp(36px, 5vw, 56px)`), lead, `SEE THE WORK →` → `/works`, `WHAT WE DO` → `/services`.
- Status bar:
  - Left: dot, `CONWAY'S GAME OF LIFE`, `GEN <b id="gen">`, `B3/S23`.
  - Right: `INFO` (an `<a>` to `/about`) and `CONTROL +`.
- Control tray: `PAUSE`/`START`, `SPAWN GLIDER`, `RESTART`. It's closed by default, and the toggle label swaps to `CLOSE ✕` when open.
- The info modal and dev controls are removed. The modal copy is superseded by About.

### `public/life.js` (rewrite)
One ES module, loaded with `<script type="module" src="/life.js">`. It follows README §Game of Life:
- 10px cells drawn at `cell - 1`, DPR capped at 2, B3/S23 with toroidal wrap, 13% seed, 240ms per generation.
- Colours: ground `#2EACFF`, cells `#4AB7FF`.
- Store the grid in `Uint8Array`s (two buffers, swapped) rather than nested arrays. A full-bleed 100svh stage at 10px cells is around 14k cells per tick.
- GEN is updated via `textContent`.
- `SPAWN GLIDER` places the 5-cell glider `[[1,0],[2,1],[0,2],[1,2],[2,2]]` at a random position.
- `RESTART` reseeds and sets GEN to 0.
- **Resize:** reseed only when the canvas *width* changes. On mobile, the URL bar changes the height on scroll, and reseeding on that would flash the grid.
- **Reduced motion:** `prefers-reduced-motion: reduce` starts paused on one seeded frame. The button reads `START`.
- **Hidden tab:** pause the interval while `document.hidden`.

### Services (`services.astro`, new) — mockup 1c
- Intro grid `1fr 380px`, bottom-aligned.
  - Eyebrow `SERVICES · 07` (from `services.length`, zero-padded).
  - H1 at 48px.
  - Intro paragraph.
- 4-column card grid with gap 16: seven service cards, then the 08 card "Not sure which one you need?" with `START A PROJECT →` → `/contact`. This replaces the mockup's "BOOK A 20-MIN CALL →" (see the CTA rule).
- Each card shows: number (lime), kind tag, H3, line, three items with 5px lime square bullets, and the proof row (top rule, label, `→`), per the Data section.
- Closing ink band: the care copy, plus a `CONTACT →` CTA to `/contact?need=care`. It replaces the mockup's "CARE PLANS — TO BE DESIGNED" placeholder.

### Works (`works.astro`) — mockup 1e
- Eyebrow `SELECTED WORK · {count}` (10 now, not the mockup's 09). H1 at 44px.
- **Filter chips:** ALL, WORDPRESS, SHOPIFY, SEO, BRAND, APPS. They're `<button aria-pressed>`, with ALL active by default.
  - Filtering is client-side: toggle `hidden` on cards whose `data-services` lacks the key.
  - Sync the choice to `?filter=` so it can be linked and survives a reload.
  - Without JS, all cards show and the chips are hidden (`.js` class on `<html>`).
- 2-column grid with gap 20, in md `order`. Each card:
  - 16:10 image with `object-fit: cover`, using the md `backgroundPosition` as `object-position`. Keep the existing `twoXSrc()` srcset and `?v=buildVersion` cache-busting, moved to `src/lib/media.ts`.
  - H3 `title` with `subtitle` on the right, then `description`.
  - Footer row: `technologies` joined with ` · ` in uppercase lime mono, and the link label on the right (see "Changes that follow").

### About (`about.astro`, new) — mockup 1g
- Content width 900px, per the artboard.
- Eyebrow `ABOUT NÍTIDA`, H1 at 40px, lead at 16.5px.
- Three ink principle cards, with copy from `renderVals().principles`.
- "Why the grid on the homepage" box: 1.5px ink-alpha border, a 200px square drawn with the mockup's repeating-gradient grid, and the copy.
- In the lead, change "Fifteen years of web work" to **"Ten years of web work"**.

### Contact (`contact.astro`) — mockup 1h
- Content width 900px. Grid `1fr 250px`, stacked at 1024px and below.
- Form fields:

| Field | `name` | Required | Notes |
|---|---|---|---|
| Name | `name` | yes | |
| Email | `email` | yes | `type=email` |
| What do you need? | `needs` | no | Chip checkboxes (visually hidden `<input type=checkbox>` + label), one per `needs[]` entry. `?need=care` pre-checks Hosting & care. |
| Timeline | `timeline` | no | Options below |
| Budget range | `budget` | no | Options below |
| The project | `project` | yes | textarea, min-height 110 |

  - Timeline options: As soon as possible / Within a month / 1–3 months / Just exploring.
  - Budget options: Under €5k / €5k–15k / €15k–40k / €40k+ / Not sure yet.
- **Handler:** keep EmailJS with the same public key, service and template IDs. Switch from `sendForm` to `emailjs.send()` so the existing template's `name` / `email` / `subject` / `message` variables keep working:
  - `subject` = `Project enquiry: <needs joined>`, or `Project enquiry` when no needs are ticked.
  - `message` = the project text, then a blank line, then `Needs: … / Timeline: … / Budget: …`.
- **Validation:** native `required` plus `type=email`. On failure, show an inline error under each field, not the browser bubble (`novalidate` + `checkValidity()` per field). Success and error messages go in an `aria-live="polite"` region. The submit button is disabled while sending.
- Side column: DIRECT (info@nitida.pt, LinkedIn `https://linkedin.com/in/nunomp` ↗) and BASED. **Drop the lime "Already a client? / OPEN A TICKET" card.** There are no tickets.

## Responsive
As in the README's suggested breakpoints (1024 and 640). Also:
- Page gutter: 34px on desktop, 20px at 640px and below.
- The two 900px pages (About, Contact) center in the viewport, while the 1180px pages go full-width up to a 1180px max.
- Touch targets must be at least 44px at 640px and below. That covers chips, control-tray buttons and the menu button.

## Docs to update at build time
- `www/CLAUDE.md`: architecture (new pages, `src/styles/`, `src/data/services.ts`, schema fields), removal of the letter seeding, SCSS.
- `www/README.md`: short section on the design tokens and where copy lives.

## Acceptance checks
1. `npm run build` passes with no content-schema errors.
2. At 1440, 1024, 768 and 390px:
   - All five pages match the mockups in layout and copy.
   - There's no horizontal scroll.
   - Nav collapses at 640px and below.
3. Home:
   - GEN counts up.
   - The tray opens and closes, and pause, glider and restart work.
   - With OS reduced motion on, the page loads paused.
   - Scrolling on mobile doesn't reseed.
4. Works:
   - Each filter shows the expected cards (see the table).
   - `?filter=shopify` loads filtered.
   - Every card opens the live site.
5. Services: every proof link lands on the right work card anchor, and Cleanup & rescue shows no proof row.
6. Contact:
   - Required-field errors show inline.
   - A real submit arrives in info@nitida.pt with needs, timeline and budget in the body.
7. `/hosting` still renders legibly, and no nav item points at it.
8. No white text sits directly on `--blue`, and no cell is darker than the ground (README contrast rules).
