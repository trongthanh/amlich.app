import { describe, it, expect } from 'vitest';
import { renderCalendar } from './cli-calendar.js';

// Fixed reference dates for deterministic tests
const APRIL_8_2026 = new Date(2026, 3, 8); // Wednesday, April 8 2026
const APRIL_10_2026 = new Date(2026, 3, 10); // different "today" in same month
const MARCH_15_2026 = new Date(2026, 2, 15); // different month than target

describe('renderCalendar – plain text (no ANSI)', () => {
	it('contains the correct month/year header', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('Tháng 4 - 2026');
	});

	it('shows the correct solar date and day name', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('8 Thứ Tư');
	});

	it('shows the correct lunar date', () => {
		// April 8, 2026 = 21st day of 2nd lunar month (Tháng Hai)
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('21 Tháng Hai');
	});

	it('shows "Hôm Nay" badge when target is today', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('Hôm Nay');
	});

	it('does not show "Hôm Nay" badge when target is not today', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_10_2026);
		expect(out).not.toContain('Hôm Nay');
	});

	it('highlights today with [day] in the grid when target month is current month', () => {
		// today = April 10, target month = April 2026 → [10] should appear
		const out = renderCalendar(APRIL_8_2026, false, APRIL_10_2026);
		expect(out).toContain('[10]');
	});

	it('highlights target day when target is today', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('[8]');
	});

	it('does not bracket any day when today is in a different month', () => {
		const out = renderCalendar(APRIL_8_2026, false, MARCH_15_2026);
		expect(out).not.toMatch(/\[\d+\]/);
	});

	it('has DL: and AL: row labels in the calendar grid', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('DL: ');
		expect(out).toContain('AL: ');
	});

	it('shows lunar month indicator (ld/lm) for first solar day of month (sd=1)', () => {
		// April 1 (sd=1) = 14th day of 2nd lunar month → shows "14/2"
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('14/2');
	});

	it('shows lunar month indicator when a new lunar month starts in the grid (ld=1)', () => {
		// In April 2026, April 17 = 1/3 (1st day of 3rd lunar month)
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('1/3');
	});

	it('contains the lunar can-chi year info', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('Bính Ngọ');
	});

	it('contains the solar term (tiết khí)', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('Tiết');
	});

	it('contains giờ hoàng đạo section', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('Giờ hoàng đạo:');
	});

	it('contains the footer with today date', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('Hôm nay: Thứ Tư, 8 Tháng 4 2026');
	});

	it('shows correct weekday headers starting with Hai (Mon)', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		// Hai should appear before CN in the weekday header row
		const haiIdx = out.indexOf('Hai');
		const cnIdx = out.lastIndexOf('CN');
		expect(haiIdx).toBeLessThan(cnIdx);
	});
});

describe('renderCalendar – ANSI mode', () => {
	it('contains ANSI reset sequences', () => {
		const out = renderCalendar(APRIL_8_2026, true, APRIL_8_2026);
		expect(out).toContain('\x1b[0m');
	});

	it('still contains the correct month/year text', () => {
		const out = renderCalendar(APRIL_8_2026, true, APRIL_8_2026);
		expect(out).toContain('Tháng 4 - 2026');
	});

	it('contains ANSI color for today (reverse+red)', () => {
		const out = renderCalendar(APRIL_8_2026, true, APRIL_8_2026);
		// REVERSE + RED = '\x1b[7m\x1b[31m'
		expect(out).toContain('\x1b[7m\x1b[31m');
	});

	it('contains AL: label with yellow ANSI code', () => {
		const out = renderCalendar(APRIL_8_2026, true, APRIL_8_2026);
		// AL: label is wrapped in YELLOW (\x1b[33m)
		expect(out).toContain('\x1b[33m' + 'AL:');
	});
});
