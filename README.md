# Total Uptime — Edgenexus reskin prototype

Static HTML pages applying the audit recommendations (palette, type,
mobile-menu fix). Built on a proper compiled Tailwind CSS v3 setup so it
slots straight into the dev team's `totaluptime-next` WordPress theme.

**Live preview:** https://nish-parmar.github.io/totaluptime/

## What to look at first

| Page | What it is |
|---|---|
| [`/`](https://nish-parmar.github.io/totaluptime/) | Reskinned homepage |
| [`/cloud-dns-service.html`](https://nish-parmar.github.io/totaluptime/cloud-dns-service.html) | Reskinned DNS product page (mobile-menu fix) |
| [`/brand.html`](https://nish-parmar.github.io/totaluptime/brand.html) | Brand system — palette, type, components, WCAG audit |
| [`/audit.html`](https://nish-parmar.github.io/totaluptime/audit.html) | 8-page audit doc — print → PDF or import to Figma |
| [`/homepage-old-annotated.html`](https://nish-parmar.github.io/totaluptime/homepage-old-annotated.html) | Live TU homepage with 15 audit pins |
| [`/homepage-annotated.html`](https://nish-parmar.github.io/totaluptime/homepage-annotated.html) | Reskin homepage with 15 audit pins |
| [`/mobile-preview.html`](https://nish-parmar.github.io/totaluptime/mobile-preview.html) | Both pages in 375 px phone frames |
| [`/menu-states.html`](https://nish-parmar.github.io/totaluptime/menu-states.html) | Every nav state for html.to.design import |

## Files

```
totaluptime/
├── package.json                package + npm scripts
├── tailwind.config.js          brand tokens (colors, type, max-width)
├── src/
│   └── input.css               @tailwind directives + brand components (@layer)
├── dist/
│   └── tailwind.css            compiled output (committed so Pages can serve it)
├── assets/
│   └── site.js                 Alpine.js components (mega-nav, drawer, "On this page")
├── index.html                  homepage
├── cloud-dns-service.html      DNS product page (incl. mobile-menu fix)
├── menu-states.html            every nav state rendered statically (for html.to.design import)
├── figma-tokens.json           Tokens Studio import (Figma)
└── canvases/                   reference: audit doc + visual comps
```

## Setup

```bash
npm install              # installs tailwindcss (one dev dep)
```

## Workflow

```bash
npm run build            # one-off compile → dist/tailwind.css (minified)
npm run dev              # watch mode: rebuilds on any HTML/JS change
npm run serve            # serves the project at http://localhost:8000
npm start                # runs dev + serve together
```

When iterating on styles, leave `npm run dev` running in one terminal and
`npm run serve` in another — every save rebuilds `dist/tailwind.css` in
~150 ms and a browser refresh picks it up.

## Where things live in code

| Concern | File |
|---|---|
| Brand colours (cyan / blue / mint / coral / sky / ink) | `tailwind.config.js` |
| Type stack (Montserrat fallback chain) | `tailwind.config.js` |
| Component classes (`.btn-primary`, `.tile`, `.otp-fab`, `.cmp` …) | `src/input.css` → `@layer components` |
| Page-level base resets (`html`, `body`, `[x-cloak]`) | `src/input.css` → `@layer base` |
| Mega-nav, mobile drawer, "On this page" sheet behavior | `assets/site.js` |
| Page markup | `*.html` (Tailwind utility classes throughout) |

## Pages

- **`index.html`** — homepage with the new brand applied (hero, features, code-feel card, stats band, CTA).
- **`cloud-dns-service.html`** — DNS product page with the mobile-menu fix: replaces the broken double-sticky / horizontal-scroll subnav with a floating bottom-right `On this page ▴` pill that opens a full sheet.
- **`menu-states.html`** — every nav state pre-rendered as static frames. Use this URL for `html.to.design` imports — the plugin can capture states it can't see on the live pages (mega menu, expanded drawer, opened sheet).

## What this prototype intentionally differs from the live site

| Area | Live site today | This prototype |
|------|-----------------|----------------|
| Primary brand colour | `#0057B8` royal blue | `#01ADEF` electric cyan |
| Display heading colour | navy gradient text | flat `#144586` deep blue |
| Body type | Inter Variable | Montserrat |
| Acquisition CTA | royal-blue fill | coral `#ff5a6e` fill |
| DNS subnav (mobile) | sticky 10-item horizontal-scroll bar | floating "On this page" pill → full sheet |
| Mobile drawer | flat list of every link | sectioned + pinned CTA at bottom |
| DNS section count | 10 | 6 (merged per audit R6) |

## Dropping into the existing `totaluptime-next` theme

The token names in `tailwind.config.js` are intentionally generic. To
adopt into the production theme:

1. Merge the `brand: { ... }` palette under `theme.extend.colors` into the
   existing `tailwind.config.js` (or replace, if the team is fine doing
   the full reskin in one PR).
2. Add `Montserrat` to the `fontFamily.sans` array and self-host the
   webfont (don't ship Google Fonts in production).
3. Copy `src/input.css`'s `@layer components` block into whichever file
   the theme uses for its component layer.
4. Move `assets/site.js`'s Alpine components into the theme's JS bundle —
   they're already Alpine-compatible.

## Reference

- Brand & menu audit: `canvases/totaluptime-reskin-audit.canvas.tsx`
- Visual comps: `canvases/totaluptime-reskin-visual.canvas.tsx`
- Figma tokens (import via Tokens Studio plugin): `figma-tokens.json`

## Production checklist

Before shipping into the live site:

- [ ] Self-host Montserrat (or licence via the Edgenexus brand kit) — don't pull from Google Fonts.
- [ ] Get the official Edgenexus brand kit and confirm the hex values; mine are extracted from edgenexus.io's live CSS.
- [ ] Run accessibility audit (axe, Lighthouse) — pay attention to colour contrast on the cyan hero.
- [ ] Add real product copy (current placeholder is the existing site's wording with light edits).
- [ ] Wire `Start free trial` and `Sign in` to the real auth/signup flows.
