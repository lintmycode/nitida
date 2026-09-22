# Handoff: nitida.pt redesign

## Overview
A redesign of nitida.pt (Astro site, local repo `www/`). The palette gets more restrained, the type gets a real hierarchy, and a proper **Services** page is added. The site also gets new **Case study**, **About** and a reworked **Contact** page. The Game of Life homepage stays, but the life grid becomes quiet background texture.

## About the design files
`Nitida Site Mockups.dc.html` is a **design reference built in HTML**. It is not production code to copy. Recreate it in the existing Astro codebase using its patterns: `src/components/*.astro`, `src/content/works/*.md`, `public/styles.css`, `public/life.js`. Open the file in a browser (keep `support.js` and `assets/` next to it). It is a pan-and-zoom canvas with one artboard per screen.

Exact copy for services, works, steps and principles lives in the file's logic class, in `renderVals()`, if you need it verbatim.

## Fidelity
**High-fidelity.** Colours, type, spacing and copy are final. The artboards are desktop only (1180px, and 900px for About and Contact). Responsive behaviour is described below.

## Design tokens

### Colour
| Token | Hex | Use |
|---|---|---|
| `--blue` | `#2EACFF` | Page ground on every page (flat, no gradient) |
| `--cell` | `#4AB7FF` | Game of Life cells, a half-step lighter than the ground |
| `--ink` | `#0F1A17` | All text on blue; the darkest panels; the control tray |
| `--panel` | `#14262B` | Cards (services, works, contact form) |
| `--panel-hover` | `#1B333B` | Card hover |
| `--lime` | `#C8EE3A` | Actions only: primary buttons, the CONTROL toggle, accents on dark panels, the logo dot |
| `--lime-hover` | `#D4F55A` | Primary button hover |
| `--paper` | `#F2F1EA` | Case-study body section |
| white alphas | `rgba(255,255,255,.62–.85)` | Secondary text on dark panels |

Contrast (verified):
- Ink on `--blue`: 7.28:1 (AAA).
- Ink on `--cell`: 8.2:1.
- Ink on `--lime`: at least 12:1.

Two rules keep these passing:
- Never put white text on the blue.
- Never make the cells darker than the ground.

**Remove** the 45° blue→lime animated body gradient from `styles.css`.

### Typography
- **Fira Code** (400/500/700): nav, eyebrows, labels, buttons, meta, numbers. Always uppercase with tracking.
- **Instrument Sans** (400/500/600, Google Fonts): all prose and headings. This is new; today everything is set in mono.

| Role | Font | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| Hero H1 (home) | Instrument Sans | 56 / 1.06 | 600 | -0.028em |
| Page H1 | Instrument Sans | 44–50 / 1.06 | 600 | -0.028em |
| Page H1, narrow pages | Instrument Sans | 38–40 / 1.07 | 600 | -0.028em |
| H2 | Instrument Sans | 22 / 1.2 | 600 | -0.02em |
| Card H3 | Instrument Sans | 19–20 / 1.2 | 600 | -0.015em |
| Lead paragraph | Instrument Sans | 17 / 1.62 | 400 | — |
| Body | Instrument Sans | 15–16.5 / 1.6–1.68 | 400 | — |
| Card body | Instrument Sans | 13.5 / 1.55 | 400 | — |
| Eyebrow | Fira Code | 11, uppercase | 700 | 0.18em |
| Nav link | Fira Code | 12, uppercase | 500 | 0.06em |
| Button | Fira Code | 12, uppercase | 600 | 0.08em |
| Small label / meta | Fira Code | 10–10.5, uppercase | 500–700 | 0.1–0.14em |

Apply `text-wrap: pretty` to headings and paragraphs.

### Radius and spacing
- **Radius:**
  - 4px: nav CTA, small buttons, inputs.
  - 5px: primary and secondary buttons, the control tray.
  - 8px: cards.
  - 20px: filter chips.
  - 6px: case-study image frames.
- **Page gutter:** 30–34px on desktop.
- **Section tops:** 44–56px.
- **Card padding:** 20–26px.
- **Grid gaps:** 16–20px.
- **Shadows:** none, so the site stays flat.

### Logo
`assets/logo-lime.png`, shown at a height of 62px. It is the original wordmark with three changes: the stray blue guide line removed, cropped tight, and the i-dot recoloured to `--lime`. The original blue dot disappears on the blue ground. For production, redraw it as an SVG with the dot as its own `fill` so it can be recoloured per background.

## Global components

**Header.** Transparent over the page ground: no band, no border.
- Logo on the left.
- Nav on the right: `SERVICES · WORKS · ABOUT` and a lime `START A PROJECT` button (on About and Contact it reads `CONTACT`).
- Nav links are ink. On hover and when active they get a 1.5px ink underline, with a 3px gap below the text.
- **Hosting is removed from the nav.** `hosting.astro` is a Cloudways affiliate page. Keep its URL live, but don't list it.

**Buttons.**
- **Primary:** lime background, ink text, padding 15×24, radius 5. Hover is `--lime-hover`.
- **Secondary:** transparent, 1.5px border `rgba(15,26,23,.35–.4)`, ink text. Hover turns the border solid ink.
- **On dark bands:** primary stays lime; secondary is white text with a `rgba(255,255,255,.5)` border.

**Footer** (shown on 1h, used on every page). Ink band.
- Logo, inverted to white.
- Tagline: "Sharp digital work, built to keep working."
- Pages column: Home, Services, Works.
- Connect column: email, LinkedIn.
- Legal line: © year · NIF · Livro de Reclamações.

## Screens

### 2a Home (`src/pages/index.astro`)
- **Stage:** full-bleed, 660px tall on desktop (use `min-height: 100svh` in production). The life canvas fills it.
- **Hero** (bottom left, max-width 660):
  - Eyebrow: "DIGITAL STUDIO · PORTUGAL → WORLDWIDE".
  - H1: "Sharp builds for companies that can't afford a vague one."
  - Lead paragraph, max-width 520.
  - Buttons: `SEE THE WORK →` (primary) and `WHAT WE DO` (secondary).
- **Status bar** (transparent, bottom):
  - Left: a dot, "CONWAY'S GAME OF LIFE", a live `GEN n` counter, "B3/S23".
  - Right: `INFO` (secondary button) and `CONTROL +` (lime).

### 1c Services (`src/pages/services.astro`, new)
- **Intro:** a two-column grid (1fr and 380px, aligned to the bottom).
  - Eyebrow: "SERVICES · 07".
  - H1: "Seven things we do properly, instead of forty we'd do badly."
  - An intro paragraph beside it.
- **Grid:** 4 columns, gap 16. The seven service cards plus an eighth "Not sure which one you need?" card with a CTA.
- **Service card:** `--panel`, radius 8, padding 22/20, min-height 290. Top to bottom:
  - Number (lime) and category tag (`BUILD`, `GROWTH`, `CARE`, `RESCUE`).
  - H3 title.
  - One-line description.
  - Three deliverables, each with a 5px lime square bullet.
  - A proof link to a real project, above a top rule.
  - Hover background: `--panel-hover`.
- **The seven services:**
  1. Custom WordPress
  2. Shopify & e-commerce
  3. Apps & integrations
  4. SEO, local & performance (includes Google Business Profile)
  5. AI in the workflow (Cinca search by image, Everbean recommendations, CMS LLM processing)
  6. Cleanup & rescue (AI/vibe-coded codebase audits). **Needs a proof case.**
  7. Hosting & care
- **Closing band** (ink): care upsell line and a CTA.

### 1e Works (`src/pages/works.astro`)
- **Intro:**
  - Eyebrow: "SELECTED WORK · 09".
  - H1: "Built, launched, and still in production."
  - Filter chips on the right. They're pills (radius 20) with an ink border. Hover and active are an ink fill with white text.
  - Filters: ALL, WORDPRESS, SHOPIFY, SEO, BRAND, APPS. Add a `services: []` field to the works collection schema to drive them.
- **Grid:** 2 columns, gap 20. All nine works, in the md `order`.
- **Work card:** `--panel`, radius 8.
  - Screenshot at 16:10, `object-fit: cover`, anchored to the top (the `/media/*.webp` files).
  - Name (H3), the md subtitle on the right, description.
  - Stack in lime mono and `CASE →`, above a top rule.

### 1f Case study (`src/pages/works/[slug].astro`, new, from the content collection)
- **Hero (blue):**
  - `← ALL WORKS` link (underline on hover).
  - Eyebrow "CASE STUDY · {sector}", then the title H1 at 50px.
  - The md description.
  - Right column (340px, left rule): a spec list with CLIENT, SERVICES and LIVE.
- **Images (paper section):** a 2fr/1fr grid. A large desktop screenshot on the left; a mobile screenshot slot and a lime "ROLE" card on the right.
- **Body:** a 1.2fr/1fr grid.
  - Left: "The problem" and "What we built". Borealis copy comes from `borealis.md`.
  - Right: three outcome rows (label on the left, big mono value on the right), then a client quote card (`--panel`).
- **CTA band (ink):** a line of copy, `START A PROJECT` (lime), and `NEXT CASE →` (white outline).
- **Optional schema fields:** `problem`, `outcomes[{label,value}]`, `quote`, `quoteAuthor`, `mobileImage`. Hide each block when its field is empty. The mockup's bracketed placeholders show where real content goes.

### 1g About (`src/pages/about.astro`, new; replaces the Info modal copy)
- **Intro:**
  - H1: "A small studio in Portugal that builds for clients anywhere."
  - A 16.5px lead paragraph.
- **Principles:** three ink cards (Small on purpose / Custom, not clever / Still here after launch).
- **"Why the grid" explainer box:** a 1.5px ink-alpha border, a 200px grid-pattern square, and copy.

### 1h Contact (`src/pages/contact.astro`)
- **Intro:**
  - H1: "Tell us what's broken, or what you want to exist."
  - A line on reply time.
- **Layout:** a two-column grid, 1fr and 250px.
- **Form card** (`--panel`, padding 26). Inputs are `#0F1A17` with a 1px `rgba(255,255,255,.18)` border, radius 4, padding 12×13. Focus is a lime border. Labels are lime mono at 10px.
  - Name and Email side by side.
  - "What do you need?": multi-select chips, one per service.
  - Timeline select and Budget select (optional), side by side.
  - Project textarea, min-height 110.
  - Submit button: `SEND ENQUIRY →` (lime).
  - Small print: "NO NEWSLETTER. NO CRM SEQUENCE."
- **Side column:**
  - Direct (email, LinkedIn).
  - Based (Portugal, timezone).
  - A lime card, "Already a client?", with an `OPEN A TICKET →` link.
- **Validation:** name, email and project are required; email must be a valid format. Wire the form to the existing contact handler.

## Interactions and behaviour

### Game of Life (`public/life.js`)
- **Grid:** 10px cells, drawn at `cell - 1` so there's a 1px gap. Size the grid from the canvas's client size, and scale for devicePixelRatio (max 2).
- **Rules:** B3/S23, toroidal wrap. Random seed at 13% density.
- **Timing:** 240ms per generation.
- **Colours:** ground `#2EACFF`, cells `#4AB7FF`.
- **Controls:**
  - `CONTROL +` toggles a tray, which is **closed by default**. The tray is an ink panel with padding 7 and radius 5. It holds three buttons, each with lime text and a 1px lime-alpha border: `PAUSE`/`START`, `SPAWN GLIDER`, `RESTART`.
  - When the tray is open, the toggle label becomes `CLOSE ✕`.
  - `SPAWN GLIDER` drops a 5-cell glider at a random position.
  - `RESTART` reseeds the grid and resets GEN to 0.
- **GEN counter:** update it with `textContent` so the page doesn't re-render every generation.
- **Reduced motion:** add `prefers-reduced-motion: reduce`. When it's set, start paused and show one static seeded frame.
- `INFO` links to /about (or opens the existing modal).

### Hover states
- **Nav:** underline.
- **Cards:** background moves to `--panel-hover`.
- **Primary button:** `--lime-hover`.
- **Secondary button:** border goes solid.
- **Transitions:** 150ms ease on background, border-color and color.

### Responsive (not mocked; suggested)
- **Up to 1024px:**
  - Services grid becomes 2 columns; Works grid becomes 1 column.
  - Case-study and contact grids stack.
  - The home hero H1 uses `clamp(36px, 5vw, 56px)`.
- **Up to 640px:**
  - Everything is 1 column.
  - Nav collapses to logo, a menu button, and the lime CTA.
  - Gutters drop to 20px.
  - The status bar hides the Game of Life label and keeps GEN and the controls.
  - Touch targets are at least 44px.

## Content issues to resolve
- `prisminfinito.md`: the front-matter says optics/eyewear, but the body and screenshot show a construction/pools company. Fix the front-matter.
- Cleanup & rescue needs a publicly nameable proof project.
- Case studies need, for each project: the before-state paragraph, outcome numbers, a client quote, and a mobile screenshot.
- Footer NIF and legal links are placeholders.

## Files in this bundle
- `Nitida Site Mockups.dc.html`: all screens (open it in a browser).
- `support.js`: the runtime for the HTML reference (not needed in production).
- `assets/logo-lime.png`: the logo with the lime dot.
- `assets/works/*.webp`: copies of `www/public/media/*`.
