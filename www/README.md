# nitida.pt

The NÍTIDA DIGITAL studio website, built with Astro and SCSS.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Where things live

| What | Where |
|---|---|
| Design tokens (colours, fonts, radii) | `src/styles/_tokens.scss` |
| Shared styles (base, buttons, header, footer) | `src/styles/_*.scss` |
| Page styles | `src/styles/_home.scss`, `_services.scss`, `_works.scss`, `_about.scss`, `_contact.scss` |
| Services copy and contact "needs" list | `src/data/services.ts` |
| Portfolio entries | `src/content/works/*.md` (schema in `src/content/config.ts`) |
| Work screenshots | `public/media/` (900×517, plus optional `@2x` at 1800×1033) |
| Game of Life | `public/life.js` |
| Redesign spec | `docs/redesign-spec.md` |
| Design handoff | `../design_handoff_nitida_redesign/` |

## Adding a work

1. Add `src/content/works/<slug>.md` with `title`, `subtitle`, `description`, `technologies`, `services` (any of `wordpress`, `shopify`, `seo`, `brand`, `apps`), `order`, `image`, `backgroundPosition` and `link: [url, label]`.
2. Put a 900×517 screenshot in `public/media/`. For sharp high-DPI display, also add `<name>@2x.webp` at 1800×1033.

## Version history

| Date | Change |
|---|---|
| 2026-09-22 | Redesign phase 1: flat blue system, new Home, Services, Works (with filters), About and Contact pages, SCSS design system. CINCA added to works. |
