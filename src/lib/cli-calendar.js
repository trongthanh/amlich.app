import { convertSolar2Lunar, getLunarDayInfo } from './amlich.js';

const TZ = 7; // Vietnam UTC+7

const WEEK_DAYS_FULL = [
	'Chủ Nhật',
	'Thứ Hai',
	'Thứ Ba',
	'Thứ Tư',
	'Thứ Năm',
	'Thứ Sáu',
	'Thứ Bảy',
];

// ANSI escape sequences
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const REVERSE = '\x1b[7m';

const COL_W = 5;
const INNER_W = COL_W * 7 + 6; // width of the calendar data area
const PREFIX_W = 4; // "DL: " / "AL: " / "    " prefix width
const GRID_W = INNER_W + PREFIX_W; // total line width

function stripHtml(str) {
	return str
		.replace(/&nbsp;/g, ' ')
		.replace(/&[a-z]+;/g, '')
		.replace(/<[^>]+>/g, '');
}

function daysInMonth(m, y) {
	return new Date(y, m, 0).getDate();
}

/** Get current Vietnam time (UTC+7) as a Date object */
export function getVietnamNow() {
	return new Date(Date.now() + TZ * 3600 * 1000);
}

/**
 * Render the lunisolar calendar for the given target date.
 *
 * @param {Date} targetDate - The date whose month is shown and details are displayed
 * @param {boolean} useAnsi - Whether to emit ANSI escape codes for color
 * @param {Date} [today] - Override "today" (defaults to Vietnam now); useful for testing
 * @returns {string} Plain-text (or ANSI) calendar output
 */
export function renderCalendar(targetDate, useAnsi, today = getVietnamNow()) {
	const todayY = today.getFullYear();
	const todayM = today.getMonth() + 1;
	const todayD = today.getDate();
	const todayDow = today.getDay();

	const year = targetDate.getFullYear();
	const month = targetDate.getMonth() + 1;
	const day = targetDate.getDate();
	const isTargetToday =
		year === todayY && month === todayM && day === todayD;
	const isCurrentMonth = year === todayY && month === todayM;

	const lunarInfo = getLunarDayInfo(targetDate, TZ);
	const hoangDao = stripHtml(lunarInfo.hoangdao);
	const dayName = WEEK_DAYS_FULL[targetDate.getDay()];

	// ANSI helper: wraps text in escape sequence if ANSI enabled, else returns plain text
	const a = useAnsi
		? (code, text) => `${code}${text}${RESET}`
		: (_code, text) => text;

	const lines = [];

	// ── Header ──────────────────────────────────────────────────────────────
	const title = `Tháng ${month} - ${year}`;
	const titleCentered = title
		.padStart(Math.floor((GRID_W + title.length) / 2))
		.padEnd(GRID_W);
	lines.push(a(BOLD + CYAN, titleCentered));
	lines.push('');

	// ── Date details ─────────────────────────────────────────────────────────
	const todayLabel = isTargetToday
		? a(REVERSE + RED, ' Hôm Nay ')
		: '         ';
	lines.push(`${todayLabel}  ${a(BOLD, String(day))} ${dayName}`);
	lines.push(`             ${a(YELLOW, `${lunarInfo.date} ${lunarInfo.monthName}`)}`);
	lines.push('');
	lines.push(`Năm ${a(BOLD, lunarInfo.year)} · Tiết ${lunarInfo.tietkhi}`);
	lines.push(
		`Tháng ${lunarInfo.ccmonth} · Ngày ${lunarInfo.ccdate} · Giờ ${lunarInfo.cchour}`
	);
	lines.push(`Giờ hoàng đạo: ${hoangDao}`);
	lines.push('');

	// ── Weekday header ────────────────────────────────────────────────────────
	const WEEK_COLS = ['Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'CN'];
	lines.push(
		'    ' +
			WEEK_COLS.map((d, i) => {
				const text = d.padStart(COL_W);
				return i >= 5 ? a(GREEN, text) : text;
			}).join(' ')
	);
	lines.push('    ' + '─'.repeat(INNER_W));

	// ── Build calendar cells ──────────────────────────────────────────────────
	const firstDow = new Date(year, month - 1, 1).getDay();
	const firstDayPos = (firstDow + 6) % 7; // Mon=0, Sun=6
	const totalDays = daysInMonth(month, year);
	const gridSize = Math.ceil((firstDayPos + totalDays) / 7) * 7;

	// Previous month info
	const prevD = new Date(year, month - 1, 0);
	const prevY = prevD.getFullYear();
	const prevM = prevD.getMonth() + 1;
	const prevLast = prevD.getDate();

	// Next month info
	const nextD = new Date(year, month, 1);
	const nextY = nextD.getFullYear();
	const nextM = nextD.getMonth() + 1;

	const cells = [];
	for (let i = 0; i < gridSize; i++) {
		const col = i % 7;
		const isWeekend = col >= 5; // col 5=Bảy(Sat), col 6=CN(Sun)
		let sd, sm, sy, isCurM;

		if (i < firstDayPos) {
			sd = prevLast - firstDayPos + i + 1;
			sm = prevM;
			sy = prevY;
			isCurM = false;
		} else if (i < firstDayPos + totalDays) {
			sd = i - firstDayPos + 1;
			sm = month;
			sy = year;
			isCurM = true;
		} else {
			sd = i - firstDayPos - totalDays + 1;
			sm = nextM;
			sy = nextY;
			isCurM = false;
		}

		const [ld, lm] = convertSolar2Lunar(sd, sm, sy, TZ);
		const isToday = isCurM && isCurrentMonth && sd === todayD;
		cells.push({ sd, sm, sy, ld, lm, col, isCurM, isToday, isWeekend });
	}

	// ── Render grid rows (2 lines each: solar + lunar, labelled DL/AL) ─────────
	const numRows = cells.length / 7;
	const prefixDl = 'DL: ';
	const prefixAl = useAnsi ? a(YELLOW, 'AL:') + ' ' : 'AL: ';

	for (let r = 0; r < numRows; r++) {
		const row = cells.slice(r * 7, r * 7 + 7);

		// Solar date line
		lines.push(
			prefixDl +
				row
					.map((cell) => {
						const num = String(cell.sd).padStart(COL_W);
						if (!cell.isCurM) return a(DIM, num);
						if (cell.isToday) {
							if (useAnsi) return a(REVERSE + RED, num);
							// Plain text: bracket today's date, stay within COL_W
							return `[${cell.sd}]`.padStart(COL_W);
						}
						if (cell.isWeekend) return a(GREEN, num);
						return num;
					})
					.join(' ')
		);

		// Lunar date line (show month when ld=1 or first solar day of month)
		lines.push(
			prefixAl +
				row
					.map((cell) => {
						const s =
							cell.ld === 1 || cell.sd === 1
								? `${cell.ld}/${cell.lm}`
								: String(cell.ld);
						const text = s.padStart(COL_W);
						if (!cell.isCurM) return a(DIM, text);
						return a(YELLOW, text);
					})
					.join(' ')
		);

		lines.push(''); // blank line between rows
	}

	// ── Footer ────────────────────────────────────────────────────────────────
	const footerStr = `Hôm nay: ${WEEK_DAYS_FULL[todayDow]}, ${todayD} Tháng ${todayM} ${todayY}`;
	lines.push(a(DIM, footerStr));
	lines.push('');

	return lines.join('\n');
}
