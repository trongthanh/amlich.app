import { describe, it, expect } from 'vitest';
import { renderCalendar, renderCalendarMarkdown } from './cli-calendar.js';

// Fixed reference dates for deterministic tests
const APRIL_8_2026 = new Date(2026, 3, 8); // Wednesday, April 8 2026
const APRIL_10_2026 = new Date(2026, 3, 10); // different "today" in same month
const MARCH_15_2026 = new Date(2026, 2, 15); // different month than target
const FEB_17_2026 = new Date(2026, 1, 17); // Tết Nguyên Đán (1/1 lunar, Bính Ngọ)

describe('renderCalendar – plain text (no ANSI)', () => {
	it('contains the correct month/year header', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('Tháng 4 2026');
	});

	it('shows the correct solar date and day name', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('Thứ Tư, 8 Tháng 4');
	});

	it('shows the correct lunar date', () => {
		// April 8, 2026 = 21st day of 2nd lunar month (Tháng Hai)
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('21 Tháng Hai');
	});

	it('shows "Hôm Nay" badge when target is today', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('(Hôm Nay)');
	});

	it('does not show "Hôm Nay" badge when target is not today', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_10_2026);
		expect(out).not.toContain('Hôm Nay');
	});

	it('highlights today with [day] in grid (target=today, red)', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('[8]');
	});

	it('highlights target [day] in blue when target is not today', () => {
		// target = April 8, today = April 10 → [8] for target, (10) for today
		const out = renderCalendar(APRIL_8_2026, false, APRIL_10_2026);
		expect(out).toContain('[8]');
		expect(out).toContain('(10)');
	});

	it('always highlights target date in the grid regardless of what today is', () => {
		// today = March 15 (different month), target = April 8 → [8] still highlighted
		const out = renderCalendar(APRIL_8_2026, false, MARCH_15_2026);
		expect(out).toContain('[8]');
	});

	it('shows lunar month indicator (ld/lm) for first table cell (March 30 = 12/2)', () => {
		// April 2026 grid starts with March 30 → lunar 12/2
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('12/2');
	});

	it('shows lunar month indicator (ld/lm) for last table cell (May 3 = 17/3)', () => {
		// April 2026 grid ends with May 3 → lunar 17/3
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('17/3');
	});

	it('shows lunar month indicator when a new lunar month starts in the grid (ld=1)', () => {
		// In April 2026, April 18 = 1/3 (1st day of 3rd lunar month)
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('1/3');
	});

	it('shows full moon emoji 🌕 for lunar day 15 (April 4 = 15/2)', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('🌕');
	});

	it('contains the lunar can-chi year info', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('Bính Ngọ');
	});

	it('prepends tiết khí emoji when defined', () => {
		// April 8, 2026 = Thanh minh → 🌿
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('🌿 Tiết Thanh minh');
	});

	it('contains giờ hoàng đạo section', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('Giờ hoàng đạo:');
	});

	it('footer is not shown by default', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).not.toContain('Hôm nay:');
	});

	it('footer is shown when showFooter=true', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026, true);
		expect(out).toContain('Hôm nay: Thứ Tư, 8 Tháng 4 2026');
	});

	it('footer includes lunar date when showFooter=true', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026, true);
		expect(out).toContain('(21 Tháng Hai, Năm Bính Ngọ)');
	});

	it('shows correct weekday headers starting with Hai (Mon)', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		// Hai should appear before CN in the weekday header row
		const haiIdx = out.indexOf('Hai');
		const cnIdx = out.lastIndexOf('CN');
		expect(haiIdx).toBeLessThan(cnIdx);
	});

	it('always includes attribution footer', () => {
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).toContain('<amlich.app bởi Thanh Trần>');
	});

	it('shows lunar event name on a matching lunar date (Tết Nguyên Đán)', () => {
		const out = renderCalendar(FEB_17_2026, false, FEB_17_2026);
		expect(out).toContain('🎊 Tết Nguyên Đán');
	});

	it('does not show a lunar event on a non-event date', () => {
		// April 8, 2026 = 21/2 lunar — no event
		const out = renderCalendar(APRIL_8_2026, false, APRIL_8_2026);
		expect(out).not.toContain('Tết Nguyên Đán');
		expect(out).not.toContain('Tết Trung Thu');
	});
});

describe('renderCalendar – ANSI mode', () => {
	it('contains ANSI reset sequences', () => {
		const out = renderCalendar(APRIL_8_2026, true, APRIL_8_2026);
		expect(out).toContain('\x1b[0m');
	});

	it('still contains the correct month/year text', () => {
		const out = renderCalendar(APRIL_8_2026, true, APRIL_8_2026);
		expect(out).toContain('Tháng 4 2026');
	});

	it('contains ANSI color for today (reverse+red) when target is today', () => {
		const out = renderCalendar(APRIL_8_2026, true, APRIL_8_2026);
		// REVERSE + RED = '\x1b[7m\x1b[31m'
		expect(out).toContain('\x1b[7m\x1b[31m');
	});

	it('uses blue highlight for target when target is not today', () => {
		// today = April 10, target = April 8 → target gets REVERSE+BLUE
		const out = renderCalendar(APRIL_8_2026, true, APRIL_10_2026);
		expect(out).toContain('\x1b[7m\x1b[34m');
	});

	it('lunar date row uses yellow ANSI color', () => {
		const out = renderCalendar(APRIL_8_2026, true, APRIL_8_2026);
		expect(out).toContain('\x1b[33m');
	});

	it('lunar event uses RED ANSI color', () => {
		// today = March 15 (different month) so no today-badge RED; only the event RED
		const out = renderCalendar(FEB_17_2026, true, MARCH_15_2026);
		expect(out).toContain('\x1b[31m');
		expect(out).toContain('Tết Nguyên Đán');
	});

	it('attribution footer is present in ANSI mode', () => {
		const out = renderCalendar(APRIL_8_2026, true, APRIL_8_2026);
		expect(out).toContain('amlich.app');
		expect(out).toContain('Thanh Trần');
	});
});

describe('renderCalendarMarkdown', () => {
	it('contains markdown h1 header right above the grid', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('# Tháng 4 2026');
	});

	it('shows (Hôm Nay) label when target is today', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026, APRIL_8_2026);
		expect(out).toContain('(Hôm Nay)');
	});

	it('shows solar date with day name in h1 heading', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('# 📅 Thứ Tư, 8 Tháng 4 2026');
	});

	it('shows lunar date with Âm Lịch label', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('**Âm Lịch:** 21 Tháng Hai');
	});

	it('includes lunar year can-chi', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('Bính Ngọ');
	});

	it('includes solar term (tiết khi) with emoji', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('🌿 Tiết Thanh minh');
	});

	it('includes lunar month can-chi', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('Tân Mão');
	});

	it('includes lunar day can-chi', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('Nhâm Tý');
	});

	it('includes hour can-chi', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('Canh Tý');
	});

	it('includes giờ hoàng đạo (auspicious hours)', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('Giờ hoàng đạo:');
		expect(out).toContain('Tý (23-1)');
	});

	it('grid is rendered as a markdown table (no code fence)', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).not.toContain('```');
		expect(out).toContain('| ------');
	});

	it('highlights target date as [day] in the code block', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026, APRIL_8_2026);
		expect(out).toContain('[8]');
	});

	it('highlights today as (day) when viewing a different date', () => {
		// target=April 8, today=April 10 → (10) in the code block
		const out = renderCalendarMarkdown(APRIL_8_2026, APRIL_10_2026);
		expect(out).toContain('[8]');
		expect(out).toContain('(10)');
	});

	it('shows lunar month indicator for first table cell (March 30 = 12/2)', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('12/2');
	});

	it('shows lunar month indicator for last table cell (May 3 = 17/3)', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('17/3');
	});

	it('shows lunar month indicator when new lunar month starts (ld=1)', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('1/3');
	});

	it('shows full moon emoji 🌕 for lunar day 15', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('🌕');
	});

	it('footer is not shown by default', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026, APRIL_8_2026);
		expect(out).not.toContain('Hôm nay:');
	});

	it('footer is shown below the table when showFooter=true', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026, APRIL_8_2026, true);
		expect(out).toContain('Hôm nay: Thứ Tư, 8 Tháng 4 2026');
	});

	it('does NOT contain ANSI escape codes', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).not.toMatch(/\x1b\[/);
	});

	it('does NOT contain DL:/AL: labels', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).not.toContain('DL:');
		expect(out).not.toContain('AL:');
	});

	it('always includes attribution footer', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).toContain('<**amlich.app** bởi **Thanh Trần**>');
	});

	it('shows lunar event in bold on a matching lunar date (Tết Nguyên Đán)', () => {
		const out = renderCalendarMarkdown(FEB_17_2026);
		expect(out).toContain('**🎊 Tết Nguyên Đán**');
	});

	it('does not show a lunar event on a non-event date', () => {
		// April 8, 2026 = 21/2 lunar — no event
		const out = renderCalendarMarkdown(APRIL_8_2026);
		expect(out).not.toContain('Tết Nguyên Đán');
	});

	it('week rows are separated by blank lines in the table output', () => {
		const out = renderCalendarMarkdown(APRIL_8_2026);
		// lunar row ends with |, blank line, next solar row starts with |
		expect(out).toMatch(/\|\n\n\|/);
	});
});
