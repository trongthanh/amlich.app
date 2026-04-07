# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**amlich.app** — A Vietnamese Lunisolar Calendar Progressive Web App hosted at https://amlich.app. Built with vanilla JS custom elements and Lit web components.

## Commands

- **Dev server:** `pnpm dev` (runs on port 8080)
- **Build:** `pnpm build` (outputs to `dist/`)
- **Preview build:** `pnpm preview`
- **Package manager:** pnpm (v8.15.8)

No test runner or linter scripts are configured. ESLint is installed but has no run script.

## Architecture

### Entry Points (Vite multi-page app)

- `src/index.html` — Main calendar page (uses `<lunar-cal>` custom element)
- `src/wallpaper-maker/index.html` — Calendar wallpaper maker tool (uses Lit components + Shoelace UI)

Vite root is `src/`, static assets in `public/`.

### Custom Elements

- **`<lunar-cal>`** (`src/ce/lunar-cal.js`) — Main calendar component. Vanilla JS custom element using `plain-tag` for tagged template syntax highlighting. Self-contained with shadow DOM styles. Accepts attributes: `details-visible`, `initial-date`, `timezone`. Public holidays passed via `<datalist slot="public-holidays">`.
- **`<cal-display>`** (`src/ce/cal-display.js`) — Lit-based calendar display for wallpaper maker. Attributes: `month`, `year`, `start-week-on`.
- **`<wallpaper-display>`** (`src/ce/wallpaper-display.js`) — Lit-based wallpaper canvas with image upload via `@github/file-attachment-element`.

### Core Library

- `src/lib/amlich.js` — Lunisolar calendar algorithm (by Ho Ngoc Duc). Handles solar-to-lunar date conversion using Julian day calculations. Exports `convertSolar2Lunar` and `getLunarDayInfo`.

### Styling

- **Main page:** Plain CSS (`src/css/base.css`, `src/css/index.css`) + Tailwind CSS (for layout utilities)
- **Wallpaper maker:** Tailwind CSS + Shoelace component themes (`light.css`/`dark.css` copied to `public/css/shoelace/`)
- **Custom elements:** Scoped styles within shadow DOM (CSS-in-JS via tagged templates)
- PostCSS with Tailwind and Autoprefixer

### Key Patterns

- Shoelace icon assets are copied from `node_modules` to `public/assets/` via rollup-plugin-copy at build time
- PWA support via vite-plugin-pwa with auto-update registration
- The app supports `prefers-color-scheme` for dark/light mode via CSS custom properties
- `plain-tag` is used in `lunar-cal.js` as a no-op tagged template for editor syntax highlighting (html`` and css`` tags); Lit components use Lit's own tagged templates
