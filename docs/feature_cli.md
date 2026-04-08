# Feature curl amlich.app

Implement a similar `curl wttr.in`, but intead of returning the weather forecast, return the month's lunisolar calendar table.

Use the screenshot at @docs/web_screen_shot.png for the render reference.

Use the @docs/research/wttr_in_research.md as research reference.

## The feature specs

This feature will only respond for curl, programatically fetch, AI agent fetch only. For regular browser visit, use the current index.html and static web component

### `curl amlich.app`

- Return the current lunisolar date details with current month's table.
- Has today's badge

### `curl amlich.app/2026-04-08`

- Return the lunisolar date details with month's table for the specific date

## Implementation Checklist

- [x] Create `functions/[[path]].js` (Cloudflare Pages Function)
  - [x] Detect curl / programmatic vs browser requests
  - [x] Pass browser requests to static assets via `env.ASSETS`
  - [x] Parse optional `YYYY-MM-DD` date from URL path
- [x] Implement ANSI/plain-text calendar renderer
  - [x] Month header centered
  - [x] Date details panel (solar date, day name, lunar date, can-chi, tiết-khí, hoàng-đạo)
  - [x] Today badge in details panel
  - [x] Calendar grid with solar + lunar dates (7 columns Mon–Sun)
  - [x] Today highlighted in grid (`[day]` plain / ANSI reverse+red)
  - [x] Weekends colored green (ANSI)
  - [x] Prev/next month dates dimmed
  - [x] Footer line with today's date
- [x] Vietnam timezone handling (UTC+7) for "today"
- [x] Extract rendering logic to `src/lib/cli-calendar.js` (testable module)
- [x] Unit tests in `src/lib/cli-calendar.test.js` (20 tests, `pnpm test`)
