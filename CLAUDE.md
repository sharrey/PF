# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install        # Install dependencies
npm run dev        # Start dev server at localhost:4321
npm run build      # Build production site to ./dist/
npm run preview    # Preview production build locally
```

No linting or test scripts are configured.

## Architecture

This is an **Astro** personal portfolio site for a DevOps engineer, using **Tailwind CSS** for styling.

**Layout system:**
- `src/Layout/MainHead.astro` — `<head>` with SEO tags, Google Fonts (Pixelify Sans), and CDN script imports (AOS, typed.js, xterm.js)
- `src/Layout/Mainlayout.astro` — root shell: wraps content with `Nav`, `Footer`, and a `<slot />`
- Pages pass `title`, `seoTitle`, `seoDesc` props into the layout

**Pages:** `src/pages/index.astro` (main landing), `src/pages/about.astro` (stub)

**Components:** `src/components/Nav.astro` (uses `astro-navbar`), `src/components/Footer.astro`

**Client-side scripts** live in `public/scripts/` and are loaded via `<script defer>` tags in `MainHead.astro`:
- `hero-typed.js` — typed.js animation for the hero text
- `terminal.js` — xterm.js terminal widget rendered into `#terminal`
- `confetti.js` — confetti effect on the "LET'S SHIP IT" button (loaded as ES module)

**Static assets:** images in `public/images/` and `public/rizz/`; audio in `public/assets/`

**Key dependencies:** `astro-navbar`, `astro-seo`, `aos` (scroll animations), `typed.js`, `@xterm/xterm`
