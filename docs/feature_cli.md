# Feature curl amlich.app

Implement a similar `curl wttr.in`, but intead of returning the weather forecast, return the month's lunisolar calendar table.

Use the @docs/research/wttr_in_research.md as research reference.

## The feature specs

This feature will only respond for curl, programatically fetch, AI agent fetch only. For regular browser visit, use the current index.html and static web component

### `curl amlich.app`

- Return the current lunisolar date details with current month's table.
- Notes:
  - Only add /month to the lunar date at the first table cell, last table cell and first date of the month
  - Prepend 15 lunar with a fullmoon emoji
  - ANSI: lunar date string (date + month name + year) rendered in yellow in the header and footer
  - Markdown: blank rows between week pairs for visual separation (same as ANSI)
- Example render below:

```
📅 Thứ Tư, 8 Tháng 4 2026 (Hôm Nay)
Âm Lịch: 21 Tháng Hai, Năm Bính Ngọ

Tiết Thanh minh
Tháng Tân Mão · Ngày Nhâm Tý · Giờ Canh Tý
Giờ hoàng đạo: Tý (23-1), Sửu (1-3), Mão (5-7),
  Ngọ (11-13), Thân (15-17), Dậu (17-19)

              Tháng 4 2026

   Hai    Ba    Tư   Năm   Sáu   Bảy    CN
  ─────────────────────────────────────────
    30    31     1     2     3     4     5
  12/2    13    14  🌕15    16    17    18

     6     7     8     9    10    11    12
    19    20    21    22    23    24    25

    13    14    15    16    17    18    19
    26    27    28    29   1/3     2     3

    20    21    22    23    24    25    26
     4     5     6     7     8     9    10

    27    28    29    30     1     2     3
    11    12    13    14  🌕15    16  17/3

```


### `curl amlich.app/2026-04-08`

- Return the lunisolar date details with month's table for the specific date.
- Append today's lunar date for user quick reference:

```
Hôm nay: Thứ Tư, 8 Tháng 4 2026 (21 Tháng Hai, Năm Bính Ngọ)
```

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
  - [x] Footer line with today's lunar date (custom date route only)
  - [x] Tiết khí emoji in date details
  - [x] Lunar date string (date + month + year) in yellow (ANSI)
  - [x] Blank rows between week pairs for visual separation
  - [x] Lunar yearly events shown in red (ANSI) between Âm Lịch and Tiết khí lines
  - [x] Attribution footer `<amlich.app bởi Thanh Trần>` (always shown)
- [x] Implement Markdown calendar renderer (`renderCalendarMarkdown`)
  - [x] Markdown table for month grid (solar + lunar rows per week)
  - [x] Blank rows between week pairs
  - [x] Footer in italic for custom date route
  - [x] Lunar yearly events shown in bold between Âm Lịch and Tiết khí lines
  - [x] Attribution footer `<**amlich.app** bởi **Thanh Trần**>` (always shown)
  - [x] Served when client sends `Accept: text/markdown`
- [x] Vietnam timezone handling (UTC+7) for "today"
- [x] Extract rendering logic to `src/lib/cli-calendar.js` (testable module)
- [x] Unit tests in `src/lib/cli-calendar.test.js` (54 tests, `pnpm test`)

## Tiết Khí Emoji

| Tiết khí     | Emoji | Nghĩa                  |
|--------------|-------|------------------------|
| Lập xuân     | 🌱    | Start of Spring        |
| Vũ Thủy      | 💧    | Rain Water             |
| Kinh trập    | 🐛    | Awakening of Insects   |
| Xuân phân    | 🌸    | Spring Equinox         |
| Thanh minh   | 🌿    | Clear and Bright       |
| Cốc vũ       | 🌧️   | Grain Rain             |
| Lập hạ       | ☀️    | Start of Summer        |
| Tiểu mãn     | 🌾    | Grain Buds             |
| Mang chủng   | 🌻    | Grain in Ear           |
| Hạ chí       | 🌞    | Summer Solstice        |
| Tiểu thử     | 🌡️   | Minor Heat             |
| Đại thử      | 🔥    | Major Heat             |
| Lập thu      | 🍂    | Start of Autumn        |
| Xử thử       | 🌤️   | End of Heat            |
| Bạch lộ      | 🌫️   | White Dew              |
| Thu phân     | 🍁    | Autumn Equinox         |
| Hàn lộ       | 💦    | Cold Dew               |
| Sương giáng  | 🌨️   | Frost's Descent        |
| Lập đông     | ❄️    | Start of Winter        |
| Tiểu tuyết   | 🌨️   | Minor Snow             |
| Đại tuyết    | ⛄    | Major Snow             |
| Đông chí     | 🌙    | Winter Solstice        |
| Tiểu hàn     | 🥶    | Minor Cold             |
| Đại hàn      | 🧊    | Major Cold             |
