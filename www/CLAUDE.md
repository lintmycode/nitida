# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The NÍTIDA DIGITAL studio website, built with Astro (static output). The homepage runs Conway's Game of Life as quiet background texture behind the hero.

The current design comes from the 2026 redesign:
- Design handoff: `../design_handoff_nitida_redesign/` (README with tokens and type scale, plus the HTML mockups).
- Implementation spec: `docs/redesign-spec.md`. Where the spec and the handoff README differ, the spec wins.

Phase 1 (Home, Services, Works, About, Contact) is built. Phase 2 (case study pages at `works/[slug]`, an SVG logo, a care plans page) is not.

## Architecture

- **src/components/Layout.astro**: shell for every page, taking these props:
  - `title`
  - `description`: meta description.
  - `active`: current nav item.
  - `cta`: `project`, which shows "START A PROJECT", or `contact`, which shows "CONTACT".
  - `stageHeader`: set on Home only. The page then renders `<Header>` itself, inside the life stage.
  - Layout also imports `src/styles/global.scss` and renders the footer on every page.
- **src/components/Header.astro / Footer.astro**: shared header (with a mobile menu at 640px and below) and footer.
- **src/pages/**:
  - `index.astro`: Home, the life stage.
  - `services.astro`
  - `works.astro`: card grid, no filters (removed 2026-09-25); each card has `id={slug}` for `/works#slug` links.
  - `about.astro`
  - `contact.astro`: EmailJS form (name, email, needs chips, project text; timeline/budget removed 2026-09-25).
  - `hosting.astro`: Cloudways affiliate page, kept live but not in the nav.
  - `qrn.astro`: WhatsApp redirect.
- **src/content/works/*.md**: portfolio entries. The schema is in `src/content/config.ts`: `title`, `subtitle`, `description`, `technologies`, `services` (the filter keys wordpress/shopify/seo/brand/apps), `order`, `image`, `backgroundPosition`, `link`. Entries sort by `order` ascending, and negative numbers are allowed.
- **src/data/services.ts**: the seven services and the contact form's "needs" list (ends with "Other"). Each card shows its own `kind` tag (CREATE, SELL, RUN…; no numbers). `title` may contain `<br>` to balance titles on two lines (rendered with `set:html`). `proof` links to a Works card by slug, or is `null`, which hides the proof row.
- **src/lib/media.ts**: `twoXSrc()` finds `<name>@2x.<ext>` next to a `/media` image to build a 2x srcset.
- **src/styles/**: SCSS compiled by Astro through `sass`.
  - `global.scss` pulls in `_tokens`, `_base`, `_buttons`, `_header`, `_footer`, plus one partial per page (`_home`, `_services`, `_works`, `_about`, `_contact`).
  - Page styles belong in their own partial, not in global.scss.
- **public/life.js**: the Game of Life engine and control tray.
  - Two `Uint8Array` buffers, 10px cells, B3/S23 with wraparound edges, 13% random seed, 240ms per generation.
  - It reseeds only when the width changes, because mobile URL-bar height changes would otherwise flash the grid.
  - It starts paused under reduced motion and pauses while the tab is hidden.
  - Tray: an MS speed input and SPAWN GLIDER (no pause button) (10–1000, default 240; applied live on `input`).
  - Spawned gliders are lime and stay lime (Immigration colouring: survivors keep their colour, a newborn takes its parents' majority colour). They spawn in the top 10–45% of the stage, clear of the hero.
  - Loaded as `/life.js?v=<build time>` from `index.astro`, because `public/` files aren't hashed and a stale cached copy breaks the page.
- **public/app.js**: stub loaded only by the pre-2026 homepage; if a browser still has that page cached, it refreshes it once. Delete a few months after the 2026-09-25 launch.
- **public/media/**: work screenshots at 900×517, with optional `@2x` versions at 1800×1033.

## Design rules

- The page ground is flat `--blue` everywhere; there is no gradient.
- Text on blue is always `--ink`. Never put white text directly on the blue.
- Game of Life cells (`--cell`) are always lighter than the ground.
- Lime (`--lime`) is used only for actions and for accents on dark panels.
- Fonts: Instrument Sans for prose and headings; Fira Code, uppercase and tracked, for nav, labels, buttons and meta.
- Every CTA goes to `/contact`. Labels are `START A PROJECT` or `CONTACT`, except the Services MORE card, which uses `ASK ABOUT IT` (an invitation to talk, not a project start). No tickets and no call booking.
- `--paper` and `--radius-6` are reserved for the phase 2 case studies.
- `_tokens.scss` also keeps a legacy variable block because `hosting.astro`'s scoped styles still use it. Don't remove it while that page exists.

## Copy

- The brand name is always uppercase: NÍTIDA.
- Prefer subject-less phrasing over "we do…"; plain, with a little wit. Avoid slogan-y lines and "X, not Y" constructions.
- No reply-time promises on Contact.

## Development Commands

```bash
npm run dev        # dev server (http://localhost:4321)
npm run build      # production build to dist/
npm run preview    # preview the build
```

## Technical Notes

- The contact form keeps the existing EmailJS service and template IDs, and sends through `emailjs.send()`:
  - `subject`: "Project enquiry", followed by the ticked needs.
  - `message`: the project text followed by the needs, timeline and budget.
  - Don't submit it during testing: every submit sends a real email to info@nitida.pt.
- The Astro dev server's content cache can go stale after bulk edits to `src/content/`, and pages then show 0 works or return 500. Restarting the dev server fixes it.
- Work images use `?v=<build time>` for cache-busting and `loading="lazy"`. Full-page headless screenshots will show blank cards below the fold unless the page is scrolled first.
