# amlich.app

Code for <a href="https://amlich.app">amlich.app</a> (Lunisolar calendar)

## Developing

### Web Calendar (`src/index.html`)

```bash
pnpm dev          # Start dev server on port 8080
pnpm build        # Build for production → dist/
pnpm preview      # Preview the built site locally
```

### Curl/CLI Feature (`functions/[[path]].js`)

Test the calendar output locally:

```bash
# Run the rendering tests
pnpm test

# Or simulate curl output directly:
node --input-type=module <<'EOF'
import { renderCalendar } from './src/lib/cli-calendar.js';

// Render current month with today highlighted
const now = new Date();
const calendar = renderCalendar(now, false);  // false = plain text (no ANSI)
console.log(calendar);

// Specific date
const date = new Date(2026, 3, 8);  // April 8, 2026
const calAnsi = renderCalendar(date, true);  // true = ANSI colors
console.log(calAnsi);
EOF
```

**Deploy to production:**
```bash
git push origin main  # Cloudflare Pages auto-deploys; curl amlich.app works immediately
```

**Test live:**
```bash
curl amlich.app                   # Current month + today
curl amlich.app/2026-04-08        # Specific date
```

## `<lunar-cal>` Custom Element

Example:

```html
<lunar-cal timezone="07:00" initial-date="2024-09-02" details-visible>
	<h1>Âm Lịch Việt Nam</h1>
	<datalist slot="public-holidays">
		<!-- additional public holidays which are not fixed and dependant on the govement's decision -->
		<option value="LUNAR--12-29">🌸 29 Tháng Chạp 🌸</option>
		<option value="LUNAR--01-04">🌸 Mùng 4 Tết Nguyên Đán 🌸</option>
		<option value="LUNAR--01-05">🌸 Mùng 5 Tết Nguyên Đán 🌸</option>
		<option value="SOLAR--09-03">🇻🇳 Lễ Quốc Khánh 🇻🇳</option>
		<option value="SOLAR--12-25">🎄 Lễ Giáng Sinh 🎄</option>
	</datalist>
</lunar-cal>
```

### Customizable Attributes

These attributes are optional

- `details-visible`: (Boolean attribute) If set, the today's details will be visible.
- `initial-date`: Initial date and month for the calendar. A Date() parsable string. (Eg: `2024-01-01`, `2025-12-25`)
- `timezone`: Timezone to calculate the lunar date. (Eg: `7`, `+08:00`, `-05:00`)

## Features and Road map

- [x] Monthly view Lunisolar calendar
- [x] Details view of today and selected date
- [x] `<lunar-cal>` custom element (Web component)
- [x] Installable PWA
- [x] `prefer-color-scheme` for dark and light mode
- [x] `curl amlich.app` — ANSI/plain-text calendar in terminal (like wttr.in)
- [ ] Customization demo
- [ ] npm package
- [ ] JS API documentation
- [x] Unit tests (vitest)

## Thanks

- Hồ Ngọc Đức for the original [Lunisolar calendar algorithm](https://www.informatik.uni-leipzig.de/~duc/amlich/)
- Álvaro for the initial [grid-based calendar](https://codepen.io/alvarotrigo/pen/bGLpROa)
- Kev Quirk for [Simple CSS](https://github.com/kevquirk/simple.css)

---
© 2024 Trần Trọng Thanh (int3ractive.com). Apache 2.0 license.
