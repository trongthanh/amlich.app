import { describe, it, expect } from 'vitest';
import { convertLunar2Solar } from './amlich.js';

describe('Lunar date conversion', () => {
	it('converts lunar date (1/1/2026 = Tết) to solar date', () => {
		// Lunar 1/1/2026 should be solar 2026-02-17
		const [day, month, year] = convertLunar2Solar(1, 1, 2026, 0, 7);
		expect(year).toBe(2026);
		expect(month).toBe(2);
		expect(day).toBe(17);
	});

	it('converts lunar date (10/3/2026) to solar date', () => {
		// Lunar 10/3/2026 = solar 2026-04-26
		const [day, month, year] = convertLunar2Solar(10, 3, 2026, 0, 7);
		expect(year).toBe(2026);
		expect(month).toBe(4);
		expect(day).toBe(26);
	});

	it('converts lunar date (15/8/2026 = Mid-Autumn) to solar date', () => {
		// Lunar 15/8/2026 = solar 2026-09-25
		const [day, month, year] = convertLunar2Solar(15, 8, 2026, 0, 7);
		expect(year).toBe(2026);
		expect(month).toBe(9);
		expect(day).toBe(25);
	});

	it('handles non-leap months correctly', () => {
		// Non-leap month parameter (0) should work as expected
		const [day, month, year] = convertLunar2Solar(15, 4, 2026, 0, 7);
		expect(year).toBe(2026);
		// Just verify it returns valid values
		expect(day).toBeGreaterThan(0);
		expect(day).toBeLessThanOrEqual(31);
		expect(month).toBeGreaterThan(0);
		expect(month).toBeLessThanOrEqual(12);
	});

	it('converts lunar date 23/12 (Tết Táo Quân) to solar date', () => {
		// Lunar 23/12/2025 (Tết Táo Quân) = solar 2026-02-10
		const [day, month, year] = convertLunar2Solar(23, 12, 2025, 0, 7);
		expect(year).toBe(2026);
		expect(month).toBe(2);
		expect(day).toBe(10);
	});

	it('converts lunar date from previous year (23/12/2024)', () => {
		// Lunar 23/12/2024 = solar 2025-01-22
		const [day, month, year] = convertLunar2Solar(23, 12, 2024, 0, 7);
		expect(year).toBe(2025);
		expect(month).toBe(1);
		expect(day).toBe(22);
	});
});

describe('URL path parsing for lunar dates', () => {
	it('parses lunar date pattern /l2026-01-01', () => {
		const match = /^[lL](\d{4})-(\d{2})-(\d{2})$/.exec('l2026-01-01');
		expect(match).not.toBeNull();
		expect(match[1]).toBe('2026');
		expect(match[2]).toBe('01');
		expect(match[3]).toBe('01');
	});

	it('parses uppercase lunar date pattern /L2026-01-01', () => {
		const match = /^[lL](\d{4})-(\d{2})-(\d{2})$/.exec('L2026-01-01');
		expect(match).not.toBeNull();
		expect(match[1]).toBe('2026');
		expect(match[2]).toBe('01');
		expect(match[3]).toBe('01');
	});

	it('does not match solar date pattern', () => {
		const match = /^[lL](\d{4})-(\d{2})-(\d{2})$/.exec('2026-01-01');
		expect(match).toBeNull();
	});

	it('does not match invalid patterns', () => {
		const match = /^[lL](\d{4})-(\d{2})-(\d{2})$/.exec('lunar2026-01-01');
		expect(match).toBeNull();
	});
});

describe('Integration: URL path to solar date conversion', () => {
	it('converts lunar URL /l2026-10-03 to solar 2026-11-11', () => {
		const pathStr = 'l2026-10-03';
		const match = /^[lL](\d{4})-(\d{2})-(\d{2})$/.exec(pathStr);
		expect(match).not.toBeNull();

		const [lunarYear, lunarMonth, lunarDay] = [match[1], match[2], match[3]];
		const [solarDay, solarMonth, solarYear] = convertLunar2Solar(
			parseInt(lunarDay),
			parseInt(lunarMonth),
			parseInt(lunarYear),
			0,
			7
		);

		expect(solarYear).toBe(2026);
		expect(solarMonth).toBe(11);
		expect(solarDay).toBe(11);
	});

	it('converts lunar URL /L2026-01-01 to solar 2026-02-17', () => {
		const pathStr = 'L2026-01-01';
		const match = /^[lL](\d{4})-(\d{2})-(\d{2})$/.exec(pathStr);
		expect(match).not.toBeNull();

		const [lunarYear, lunarMonth, lunarDay] = [match[1], match[2], match[3]];
		const [solarDay, solarMonth, solarYear] = convertLunar2Solar(
			parseInt(lunarDay),
			parseInt(lunarMonth),
			parseInt(lunarYear),
			0,
			7
		);

		expect(solarYear).toBe(2026);
		expect(solarMonth).toBe(2);
		expect(solarDay).toBe(17);
	});
});
