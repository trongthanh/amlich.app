import { convertSolar2Lunar, getLunarDayInfo } from './amlich.js';

const TZ = 7; // Vietnam UTC+7

const WEEK_DAYS_FULL = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

// ANSI escape sequences
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const REVERSE = '\x1b[7m';

const COL_W = 6;
const GRID_W = COL_W * 7; // 42

const TIETKHI_EMOJI = {
	'Lập xuân': '🌱',
	'Vũ Thủy': '💧',
	'Kinh trập': '🐛',
	'Xuân phân': '🌸',
	'Thanh minh': '🌿',
	'Cốc vũ': '🌧️',
	'Lập hạ': '☀️',
	'Tiểu mãn': '🌾',
	'Mang chủng': '🌻',
	'Hạ chí': '🌞',
	'Tiểu thử': '🌡️',
	'Đại thử': '🔥',
	'Lập thu': '🍂',
	'Xử thử': '🌤️',
	'Bạch lộ': '🌫️',
	'Thu phân': '🍁',
	'Hàn lộ': '💦',
	'Sương giáng': '🌨️',
	'Lập đông': '❄️',
	'Tiểu tuyết': '🌨️',
	'Đại tuyết': '⛄',
	'Đông chí': '🌙',
	'Tiểu hàn': '🥶',
	'Đại hàn': '🧊',
};

// Key format: "day/month" (no leading zeros, matching lunarInfo.date / lunarInfo.month)
const LUNAR_EVENTS = {
	'1/1': '🎊 Tết Nguyên Đán',
	'2/1': '🎊 Mùng 2 Tết',
	'3/1': '🎊 Mùng 3 Tết',
	'15/1': '🏮 Rằm Tháng Giêng',
	'3/3': '🥚 Tết Hàn Thực',
	'10/3': '🏯 Giỗ Tổ Hùng Vương',
	'15/4': '☸️ Phật Đản',
	'5/5': '🪙 Tết Đoan Ngọ',
	'15/7': '🪷 Lễ Vu Lan',
	'15/8': '🥮 Tết Trung Thu',
	'23/12': '🔥 Tết Táo Quân',
};

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
 * @param {boolean} [showFooter] - Whether to append a "Hôm nay" footer with today's lunar date
 * @returns {string} Plain-text (or ANSI) calendar output
 */
export function renderCalendar(targetDate, useAnsi, today = getVietnamNow(), showFooter = false) {
	const todayY = today.getFullYear();
	const todayM = today.getMonth() + 1;
	const todayD = today.getDate();
	const todayDow = today.getDay();

	const year = targetDate.getFullYear();
	const month = targetDate.getMonth() + 1;
	const day = targetDate.getDate();
	const isTargetToday = year === todayY && month === todayM && day === todayD;
	const isCurrentMonth = year === todayY && month === todayM;

	const lunarInfo = getLunarDayInfo(targetDate, TZ);
	const hoangDao = stripHtml(lunarInfo.hoangdao);
	const dayName = WEEK_DAYS_FULL[targetDate.getDay()];
	const tietkhiEmoji = TIETKHI_EMOJI[lunarInfo.tietkhi] || '';
	const tietkhiLine = tietkhiEmoji ? `${tietkhiEmoji} Tiết ${lunarInfo.tietkhi}` : `Tiết ${lunarInfo.tietkhi}`;

	// ANSI helper: wraps text in escape sequence if ANSI enabled, else returns plain text
	const a = useAnsi ? (code, text) => `${code}${text}${RESET}` : (_code, text) => text;

	const lines = [];

	// ── Date details ─────────────────────────────────────────────────────────
	const todayTag = isTargetToday ? ` ${a(REVERSE + RED, '(Hôm Nay)')}` : '';
	lines.push(`📅 ${a(BOLD, `${dayName}, ${day} Tháng ${month} ${year}`)}${todayTag}`);
	lines.push(`Âm Lịch: ${a(YELLOW, `${lunarInfo.date} ${lunarInfo.monthName}, Năm ${lunarInfo.year}`)}`);
	const lunarEvent = LUNAR_EVENTS[`${lunarInfo.date}/${lunarInfo.month}`];
	lines.push(lunarEvent ? a(RED, lunarEvent) : '');
	lines.push(tietkhiLine);
	lines.push(`Tháng ${lunarInfo.ccmonth} · Ngày ${lunarInfo.ccdate} · Giờ ${lunarInfo.cchour}`);
	lines.push(`Giờ hoàng đạo: ${hoangDao}`);
	lines.push('');

	// ── Month header ──────────────────────────────────────────────────────────
	const title = `Tháng ${month} ${year}`;
	const titleCentered = title.padStart(Math.floor((GRID_W + title.length) / 2)).padEnd(GRID_W);
	lines.push(a(BOLD + CYAN, titleCentered));
	lines.push('');

	// ── Weekday header ────────────────────────────────────────────────────────
	const WEEK_COLS = ['Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'CN'];
	lines.push(
		WEEK_COLS.map((d, i) => {
			const text = d.padStart(COL_W);
			return i >= 5 ? a(GREEN, text) : text;
		}).join('')
	);
	lines.push('─'.repeat(GRID_W));

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
		const isTarget = isCurM && sd === day;
		const isTodayCell = isCurM && isCurrentMonth && sd === todayD;
		cells.push({ sd, sm, sy, ld, lm, col, isCurM, isTarget, isTodayCell, isWeekend });
	}

	// ── Render grid rows ──────────────────────────────────────────────────────
	const numRows = cells.length / 7;
	const lastCellIdx = cells.length - 1;

	for (let r = 0; r < numRows; r++) {
		const row = cells.slice(r * 7, r * 7 + 7);

		// Solar date line
		lines.push(
			row
				.map((cell) => {
					const num = String(cell.sd).padStart(COL_W);
					if (!cell.isCurM) return a(DIM, num);
					if (cell.isTarget && cell.isTodayCell) {
						// target = today: red highlight
						if (useAnsi) return a(REVERSE + RED, num);
						return `[${cell.sd}]`.padStart(COL_W);
					}
					if (cell.isTarget) {
						// custom selected date: blue highlight
						if (useAnsi) return a(REVERSE + BLUE, num);
						return `[${cell.sd}]`.padStart(COL_W);
					}
					if (cell.isTodayCell) {
						// today while viewing a different date: red highlight
						if (useAnsi) return a(REVERSE + RED, num);
						return `(${cell.sd})`.padStart(COL_W);
					}
					if (cell.isWeekend) return a(GREEN, num);
					return num;
				})
				.join('')
		);

		// Lunar date line: show /month for first cell, last cell, and ld=1
		lines.push(
			row
				.map((cell, j) => {
					const cellIdx = r * 7 + j;
					const showMonth = cell.ld === 1 || cellIdx === 0 || cellIdx === lastCellIdx;
					const base = showMonth ? `${cell.ld}/${cell.lm}` : String(cell.ld);
					const text = (cell.ld === 15 ? `🌕${base}` : base).padStart(COL_W);
					if (!cell.isCurM) return a(DIM, text);
					return a(YELLOW, text);
				})
				.join('')
		);

		lines.push(''); // blank line between rows
	}

	// ── Footer ────────────────────────────────────────────────────────────────
	if (showFooter) {
		const todayDate = new Date(todayY, todayM - 1, todayD);
		const todayLunar = getLunarDayInfo(todayDate, TZ);
		const solarPart = a(DIM, `Hôm nay: ${WEEK_DAYS_FULL[todayDow]}, ${todayD} Tháng ${todayM} ${todayY} (`);
		const lunarPart = a(YELLOW, `${todayLunar.date} ${todayLunar.monthName}, Năm ${todayLunar.year}`);
		const closePart = a(DIM, ')');
		lines.push(`${solarPart}${lunarPart}${closePart}`);
		lines.push('');
	}

	lines.push(`<${a(BOLD, 'amlich.app')} bởi ${a(BOLD, 'Thanh Trần')}>`);

	return lines.join('\n') + '\n';
}

/**
 * Render the lunisolar calendar as Markdown for the given target date.
 *
 * @param {Date} targetDate - The date whose month is shown and details are displayed
 * @param {Date} [today] - Override "today" (defaults to Vietnam now); useful for testing
 * @param {boolean} [showFooter] - Whether to append a "Hôm nay" footer with today's lunar date
 * @returns {string} Markdown-formatted calendar output
 */
export function renderCalendarMarkdown(targetDate, today = getVietnamNow(), showFooter = false) {
	const todayY = today.getFullYear();
	const todayM = today.getMonth() + 1;
	const todayD = today.getDate();
	const todayDow = today.getDay();

	const year = targetDate.getFullYear();
	const month = targetDate.getMonth() + 1;
	const day = targetDate.getDate();
	const isTargetToday = year === todayY && month === todayM && day === todayD;
	const isCurrentMonth = year === todayY && month === todayM;

	const lunarInfo = getLunarDayInfo(targetDate, 7);
	const hoangDao = stripHtml(lunarInfo.hoangdao);
	const dayName = WEEK_DAYS_FULL[targetDate.getDay()];
	const tietkhiEmoji = TIETKHI_EMOJI[lunarInfo.tietkhi] || '';
	const tietkhiLine = tietkhiEmoji ? `${tietkhiEmoji} Tiết ${lunarInfo.tietkhi}` : `Tiết ${lunarInfo.tietkhi}`;

	const lines = [];

	// ── Date details (markdown) ───────────────────────────────────────────────
	const todayLabel = isTargetToday ? ' (Hôm Nay)' : '';
	lines.push(`# 📅 ${dayName}, ${day} Tháng ${month} ${year} ${todayLabel}`);
	lines.push(`**Âm Lịch:** ${lunarInfo.date} ${lunarInfo.monthName}, Năm ${lunarInfo.year}`);
	const lunarEvent = LUNAR_EVENTS[`${lunarInfo.date}/${lunarInfo.month}`];
	lines.push(lunarEvent ? `**${lunarEvent}**` : '');
	lines.push(tietkhiLine);
	lines.push(`Tháng ${lunarInfo.ccmonth} · Ngày ${lunarInfo.ccdate} · Giờ ${lunarInfo.cchour}`);
	lines.push(`**Giờ hoàng đạo:** ${hoangDao}`);
	lines.push('');

	// ── Month title right above grid ─────────────────────────────────────────
	lines.push(`## Tháng ${month} ${year}`);
	lines.push('');

	// ── Calendar as aligned markdown table (padStart columns for code-editor) ─
	// Each cell value is padStart(COL_W) so columns line up in raw/monospace text.
	const WEEK_COLS = ['Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'CN'];
	const row2md = (cells) => `| ${cells.join(' | ')} |`;

	lines.push(row2md(WEEK_COLS.map((d) => d.padStart(COL_W))));
	lines.push(row2md(Array(7).fill('------')));

	// Build calendar cells
	const firstDow = new Date(year, month - 1, 1).getDay();
	const firstDayPos = (firstDow + 6) % 7;
	const totalDays = daysInMonth(month, year);
	const gridSize = Math.ceil((firstDayPos + totalDays) / 7) * 7;

	const prevD = new Date(year, month - 1, 0);
	const prevY = prevD.getFullYear();
	const prevM = prevD.getMonth() + 1;
	const prevLast = prevD.getDate();

	const nextD = new Date(year, month, 1);
	const nextY = nextD.getFullYear();
	const nextM = nextD.getMonth() + 1;

	const cells = [];
	for (let i = 0; i < gridSize; i++) {
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

		const [ld, lm] = convertSolar2Lunar(sd, sm, sy, 7);
		const isTarget = isCurM && sd === day;
		const isTodayCell = isCurM && isCurrentMonth && sd === todayD;
		cells.push({ sd, ld, lm, isCurM, isTarget, isTodayCell });
	}

	const numRows = cells.length / 7;
	const lastCellIdx = cells.length - 1;

	for (let r = 0; r < numRows; r++) {
		const row = cells.slice(r * 7, r * 7 + 7);

		// Solar row: target=[day], today=(day), others plain number — all padStart(COL_W)
		lines.push(
			row2md(
				row.map((cell) => {
					if (cell.isTarget) return `[${cell.sd}]`.padStart(COL_W);
					if (cell.isTodayCell) return `(${cell.sd})`.padStart(COL_W);
					return String(cell.sd).padStart(COL_W);
				})
			)
		);

		// Lunar row
		lines.push(
			row2md(
				row.map((cell, j) => {
					const cellIdx = r * 7 + j;
					const showMonth = cell.ld === 1 || cellIdx === 0 || cellIdx === lastCellIdx;
					const base = showMonth ? `${cell.ld}/${cell.lm}` : String(cell.ld);
					return (cell.ld === 15 ? `🌕${base}` : base).padStart(COL_W);
				})
			)
		);
		lines.push('');
	}

	// Footer below the table
	if (showFooter) {
		const todayDate = new Date(todayY, todayM - 1, todayD);
		const todayLunar = getLunarDayInfo(todayDate, 7);
		lines.push('');
		lines.push(
			`_Hôm nay: ${WEEK_DAYS_FULL[todayDow]}, ${todayD} Tháng ${todayM} ${todayY} (${todayLunar.date} ${todayLunar.monthName}, Năm ${todayLunar.year})_`
		);
	}

	lines.push('');
	lines.push('<**amlich.app** bởi **Thanh Trần**>');

	return lines.join('\n') + '\n';
}
