// Note: this tagged template does nothing, it's just for editor syntax highlighting and minification
import css from 'plain-tag';
import html from 'plain-tag';

import { convertSolar2Lunar, getLunarDayInfo } from '../lib/amlich.js';

const styles = css`
	:host {
		font-size: 16px;
		--calendar-bg-color: #f3f4f6;
		--calendar-font-color: #1f2937;
		--weekdays-border-bottom-color: #cbd5e1;
		--calendar-date-hover-color: #9ca3af;
		--calendar-current-date-color: #d1d5db;
		--calendar-today-color: #dc2626;
		--calendar-nextprev-bg-color: transparent;
		--calendar-prevnext-date-color: #9ca3af;
		--calendar-arrow-color: #1f2937;
		--calendar-border-radius: 16px;
		--calendar-selected-bg-color: linear-gradient(to bottom, #93c5fd, #60a5fa);
		--calendar-active-bg-color: #e5e7eb;
		--calendar-weekend-color: #15803d;
		--lunar-date-color: #d97706;
		--lunar-date-event-color: #dc2626;
		--today-event-color: #991b1b;
		--public-holiday-color: #dc2626;
	}

	@media (prefers-color-scheme: dark) {
		:host {
			--calendar-bg-color: #262829;
			--calendar-font-color: #fff;
			--weekdays-border-bottom-color: #404040;
			--calendar-date-hover-color: #505050;
			--calendar-current-date-color: #1b1f21;
			--calendar-today-color: #f87171;
			--calendar-nextprev-bg-color: transparent;
			--calendar-prevnext-date-color: #484848;
			--calendar-arrow-color: #fff;
			--calendar-border-radius: 16px;
			--calendar-selected-bg-color: linear-gradient(to bottom, #03a9f4, #2196f3);
			--calendar-active-bg-color: #505050;
			--calendar-weekend-color: #22c55e;
			--lunar-date-color: #facc15;
			--lunar-date-event-color: #dc2626;
			--today-event-color: #fca5a5;
			--public-holiday-color: #dc2626;
		}
		.date-number.lunar-event .lunar-date {
			font-weight: 700;
		}

		.date-number.public-holiday .solar-date {
			font-weight: 700;
		}
	}

	* {
		padding: 0;
		margin: 0;
	}

	.calendar {
		position: relative;
		max-width: 400px;
		/*change as per your design need */
		min-width: 320px;
		background: var(--calendar-bg-color);
		color: var(--calendar-font-color);
		margin: 10px auto;
		box-sizing: border-box;
		overflow: hidden;
		font-weight: normal;
		border-radius: var(--calendar-border-radius);
	}

	.calendar-inner {
		padding: 10px 10px;
	}

	.calendar-weekdays,
	.calendar-dates {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		text-align: center;
		line-height: 1.4;
	}

	.calendar-weekdays > div {
		padding: 8px 0;
		border-bottom: 1px solid var(--weekdays-border-bottom-color);
	}

	.calendar-weekdays > div:nth-child(7n),
	.calendar-weekdays > div:nth-child(7n - 1),
	.calendar-dates > .date-number:nth-child(7n),
	.calendar-dates > .date-number:nth-child(7n -1) {
		color: var(--calendar-weekend-color);
	}

	.date-number,
	.next-dates,
	.prev-dates {
		border: 1px solid transparent;
		border-radius: 4px;
		padding: 4px 0;
		color: var(--calendar-font-color);
		text-decoration: none;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 2px;
	}

	.date-number:hover {
		border: 1px solid var(--calendar-date-hover-color);
	}

	.date-number:active {
		border: 1px solid var(--calendar-date-hover-color);
		background: var(--calendar-active-bg-color);
	}
	.date-number.selected {
		background: var(--calendar-selected-bg-color);
	}
	.date-number.lunar-event .lunar-date {
		color: var(--lunar-date-event-color);
	}

	.date-number.public-holiday .solar-date {
		color: var(--public-holiday-color);
	}

	.empty-dates:hover {
		border: 1px solid transparent;
	}

	.calendar-controls {
		display: grid;
		grid-template-columns: 25% auto 25%;
	}

	.calendar-today-date {
		display: grid;
		text-align: center;
		cursor: pointer;
		margin: 3px 0px;
		background: var(--calendar-current-date-color);
		padding: 8px 0px;
		border-radius: 4px;
		border: 1px solid var(--calendar-current-date-color);
		color: var(--calendar-font-color);
		width: 80%;
		margin: 8px auto;
	}

	.calendar-today-date:hover {
		border: 1px solid var(--calendar-date-hover-color);
	}

	.calendar-today-date:active {
		background: var(--calendar-active-bg-color);
	}

	.calendar-controls .calendar-year-month {
		display: flex;
		min-width: 100px;
		justify-content: space-evenly;
		align-items: center;
	}

	.calendar-controls .calendar-next {
		text-align: right;
	}

	.calendar-controls .calendar-year-month .calendar-year-label,
	.calendar-controls .calendar-year-month .calendar-month-label {
		font-weight: 600;
		font-size: 20px;
	}

	.calendar-today .solar-date {
		position: relative;
		z-index: 0;
		color: var(--calendar-bg-color);
	}
	/* draw a red circle around today's date */
	.calendar-today .solar-date::before {
		aspect-ratio: 1 / 1;
		display: block;
		content: '';
		background: var(--calendar-today-color);
		position: absolute;
		height: 100%;
		margin: 0 50%;
		border-radius: 16px;
		z-index: -1;
		transform: translate(-50%, 0);
	}

	/* next & previous buttons */
	.calendar-controls button {
		color: var(--calendar-font-color);
		font-family: arial, consolas, sans-serif;
		font-size: 26px;
		text-decoration: none;
		padding: 8px 12px;
		display: inline-block;
		background: var(--calendar-nextprev-bg-color);
		border: 1px solid transparent;
		border-radius: 4px;
		cursor: pointer;
	}
	.calendar-controls button:hover {
		border: 1px solid var(--calendar-date-hover-color);
	}
	.calendar-controls button:active {
		border: 1px solid var(--calendar-date-hover-color);
		background: var(--calendar-active-bg-color);
	}
	.calendar-controls button svg {
		height: 20px;
		width: 20px;
		color: var(--calendar-arrow-color);
	}

	.calendar-body .prev-dates,
	.calendar-body .next-dates {
		color: var(--calendar-prevnext-date-color);
		text-decoration: none;
	}

	.calendar-body .prev-dates:hover,
	.calendar-body .next-dates:hover {
		border: 1px solid transparent;
	}

	.calendar-body .lunar-date {
		font-size: 12px;
		color: var(--lunar-date-color);
	}

	.calendar-body .prev-dates .lunar-date,
	.calendar-body .next-dates .lunar-date {
		color: var(--calendar-prevnext-date-color);
	}

	.calendar-details {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: auto;
		gap: 0px 0px;
		grid-template-areas:
			'today solar .'
			'left lunar right'
			'hours hours hours'
			'event event event';
		font-size: 14px;
	}

	.calendar-details .today-badge {
		grid-area: today;
		display: none;
	}

	.calendar-details .today-badge.visible {
		display: block;
	}
	.calendar-details .today-badge span {
		margin-top: 4px;
		padding: 2px 4px;
		display: inline-block;
		border-radius: 16px;
		color: var(--calendar-bg-color);
		background: var(--calendar-today-color);
	}

	.calendar-details .solar {
		grid-area: solar;
		text-align: center;
		padding: 0px;
	}

	.calendar-details .solar-date {
		font-size: 56px;
		line-height: 1;
		padding: 4px 0 12px 0;
	}

	.calendar-details .solar-day {
		font-size: 18px;
	}

	.calendar-details .public-holiday {
		color: var(--public-holiday-color);
	}

	.calendar-details .lunar {
		grid-area: lunar;
		text-align: center;
	}
	.calendar-details .lunar-year {
		font-size: 14px;
	}
	.calendar-details .lunar-month {
		color: var(--lunar-date-color);
	}

	.calendar-details .lunar-date {
		font-size: 32px;
		color: var(--lunar-date-color);
		padding: 8px 0px;
	}

	.calendar-details .info-left {
		grid-area: left;
		font-size: 12px;
	}
	.calendar-details .info-right {
		grid-area: right;
		font-size: 12px;
		text-align: right;
	}

	.calendar-details .lunar-hours {
		grid-area: hours;
		padding: 10px 0px;
		font-size: 12px;
	}

	.calendar-details .today-event {
		grid-area: event;
		padding: 0px;
		color: var(--today-event-color);
		text-align: center;
	}
`;
/**
 * @typedef {{type: 'SOLAR'|'LUNAR'|number, month: number, day: number, name: string, publicHoliday: boolean }} YearlyEvent
 */

/**
 * @param {string} eventDateStr event date string in format SOLAR--MM-DD or LUNAR--MM-DD or YYYY-MM-DD
 * @param {string} name event name
 * @param {boolean} publicHoliday whether it's public holiday (red color on solar date)
 * @returns {YearlyEvent} event object
 */
function createEvent(eventDateStr, name, publicHoliday = false) {
	const dateReg = /(SOLAR|LUNAR|\d{4})-?-(\d{1,2})-(\d{1,2})/;
	const [, type, month, day] = dateReg.exec(eventDateStr) || [];
	return { type, month: parseInt(month, 10), day: parseInt(day, 10), name, publicHoliday };
}

/**
 * @param {YearlyEvent[]} yearlyEvents
 * @returns {(sy: number, sy: number, sd:number, lm:number, ld:number) => ({isLunarEvent: boolean, isPublicHoliday: boolean, isSolarEvent: boolean, eventNames: string[]})}
 */
function createFindEvents(yearlyEvents) {
	return function findEvents(sy, sm, sd, lm, ld) {
		const events = [];
		yearlyEvents.forEach((event) => {
			if (event.type === 'SOLAR' && event.month === sm && event.day === sd) {
				events.push(event);
			}
			if (event.type === 'LUNAR' && event.month === lm && event.day === ld) {
				events.push(event);
			}
			if (event.type == sy && event.month === sm && event.day === sd) {
				events.push(event);
			}
		});
		return {
			isLunarEvent: events.some((e) => e.type === 'LUNAR'),
			isPublicHoliday: events.some((e) => e.publicHoliday),
			isSolarEvent: events.some((e) => e.type === 'SOLAR'),
			eventNames: events.map((e) => e.name),
		};
	};
}

const DEFAULT_EVENTS = [
	createEvent('SOLAR--1-1', '🎆 Tết Dương lịch 🎆', true),
	createEvent('SOLAR--04-30', '🇻🇳 Ngày Chiến thắng 🇻🇳', true),
	createEvent('SOLAR--05-01', '🇻🇳 Quốc Tế Lao Động 🇻🇳', true),
	createEvent('SOLAR--09-02', '🇻🇳 Lễ Quốc Khánh 🇻🇳', true),

	createEvent('LUNAR--01-01', '🌸 Mùng 1 Tết Nguyên Đán 🌸', true),
	createEvent('LUNAR--01-02', '🌸 Mùng 2 Tết Nguyên Đán 🌸', true),
	createEvent('LUNAR--01-03', '🌸 Mùng 3 Tết Nguyên Đán 🌸', true),
	createEvent('LUNAR--01-15', '🌕 Rằm tháng Giêng 🌕', false),
	createEvent('LUNAR--03-10', '🙏 Giỗ Tổ Hùng Vương (10/3 ÂL) 🙏', true),
	createEvent('LUNAR--04-15', '🪷 Phật Đản (15/4 ÂL) 🪷', false),
	createEvent('LUNAR--05-05', '🌾 Tết Đoan Ngọ (5/5 ÂL) 🌾', false),
	createEvent('LUNAR--07-15', '🕯️ Vu Lan (15/7 ÂL) 🕯️', false),
	createEvent('LUNAR--08-15', '🥮 Tết Trung Thu (Rằm tháng 8) 🥮', false),
	createEvent('LUNAR--12-23', '🍚 Ông Táo chầu trời (23/12 ÂL) 🍚', false),
	createEvent('LUNAR--12-30', '🌸 30 Tháng Chạp 🌸', true),
];

/**
 * Return timezone in hours
 * @param {string} timeStr time string in format (+|-)HH:MM
 */
function getTimezone(timeStr) {
	const [, sign, hourStr, minuteStr] = /([+-])?(\d{1,2}):?(\d{1,2})?/.exec(timeStr) || [];
	if (!hourStr) return 0 - new Date().getTimezoneOffset() / 60; // return local timezone if not defined
	const hour = parseInt(hourStr, 10);
	const minute = parseInt(minuteStr, 10) || 0;
	return (sign === '-' ? -1 : 1) * (hour + minute / 60);
}

class LunisolarCalendar extends HTMLElement {
	static observedAttributes = ['initial-date', 'timezone', 'details-visible'];

	constructor() {
		super(); // always call super() first in the constructor.
		// Create a shadow root
		this.attachShadow({ mode: 'open' });
		// the wrapper element
		let wrapper = null;
		// store public holidays
		// eslint-disable-next-line wc/no-constructor-attributes
		const pubDataset = this.querySelectorAll('[slot="public-holidays"] > option');
		// TODO: the slot is not actually used in template, we only use it to define public holidays data
		const publicHolidays = [];
		if (pubDataset.length) {
			Array.from(pubDataset).forEach((elem) => {
				publicHolidays.push(createEvent(elem.value, elem.textContent, true));
			});
		}
		const yearlyEvents = DEFAULT_EVENTS.concat(publicHolidays);
		const findEvents = createFindEvents(yearlyEvents);

		let initialDateFromAttr =
			// eslint-disable-next-line wc/no-constructor-attributes
			this.hasAttribute('initial-date') && new Date(this.getAttribute('initial-date'));
		let selectedDate =
			!initialDateFromAttr || isNaN(initialDateFromAttr) ? new Date() : initialDateFromAttr; // display today if initial-date not defined
		// console.log(selectedDate);
		// eslint-disable-next-line wc/no-constructor-attributes
		let timezone = getTimezone(this.getAttribute('timezone'));
		// console.log(timezone);
		// eslint-disable-next-line wc/no-constructor-attributes
		let detailsVisible = this.hasAttribute('details-visible');

		// private properties
		// NOTE: I'm avoiding using private fields (#) for better compatibility
		let today = new Date();
		let calWeekDays = ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'];
		// prettier-ignore
		let calWeekDaysFull = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
		// prettier-ignore
		let calMonthName = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']

		function daysInMonth(month, year) {
			return new Date(year, month, 0).getDate();
		}
		function firstDay() {
			return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
		}
		// function lastDay() {
		// 	return new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
		// }
		function firstDayColumnIndex() {
			// shift sunday to last column, monday is first day of week
			const day = (firstDay().getDay() + 7 - 1) % 7;
			return day;
		}
		// function lastDayColumn() {
		// 	// shift sunday to last column
		// 	const day = (lastDay().getDay() + 7 - 1) % 7;
		// 	return day + 1;
		// }
		/**
		 * @return {Date}
		 */
		function getPreviousMonthLastDate() {
			return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0);
		}
		function navigateToPreviousMonth(dateNum) {
			const startMonth = selectedDate.getMonth();
			selectedDate.setMonth(selectedDate.getMonth() - 1);
			if (dateNum) selectedDate.setDate(dateNum);
			if (selectedDate.getMonth() == startMonth) {
				// if month not changed, it means startMonth date exceed previous month total days
				selectedDate.setDate(0); // set to last day of previous month
			}
			plotDates();
			selectDate();
		}
		function navigateToNextMonth(dateNum) {
			const startMonth = selectedDate.getMonth();
			selectedDate.setMonth(selectedDate.getMonth() + 1);
			if (dateNum) selectedDate.setDate(dateNum);
			if (selectedDate.getMonth() > startMonth + 1) {
				// if it jump 2 months forward (due to last day exceed next month total days)
				selectedDate.setDate(0); // set to last day of previous month
			}
			plotDates();
			selectDate();
		}
		function navigateToCurrentMonth() {
			let currentMonth = today.getMonth();
			let currentYear = today.getFullYear();
			selectedDate.setMonth(currentMonth);
			selectedDate.setYear(currentYear);
			selectedDate.setDate(today.getDate());
			plotDates();
		}
		function displayYear() {
			let yearLabel = wrapper.querySelector('.calendar-year-label');
			yearLabel.innerHTML = selectedDate.getFullYear();
		}
		function displayMonth() {
			let monthLabel = wrapper.querySelector('.calendar-month-label');
			monthLabel.innerHTML = calMonthName[selectedDate.getMonth()];
		}
		function handleDateClick(e) {
			e.preventDefault();
			const elem = e.target.closest('.date-number');
			if (elem) {
				// click on current month date
				const dateNum = elem.dataset.num;
				if (!dateNum) return;
				selectDate(dateNum);
			}
			const nextBtn = e.target.closest('.next-dates');
			if (nextBtn) {
				const targetDate = new Date(
					selectedDate.getFullYear(),
					selectedDate.getMonth() + 1,
					nextBtn.dataset.num
				);
				setSelectedDate(targetDate);
			}
			const prevBtn = e.target.closest('.prev-dates');
			if (prevBtn) {
				const targetDate = new Date(
					selectedDate.getFullYear(),
					selectedDate.getMonth() - 1,
					prevBtn.dataset.num
				);
				setSelectedDate(targetDate);
			}
		}

		function selectDate(dateNum) {
			if (dateNum) selectedDate.setDate(dateNum);
			else dateNum = selectedDate.getDate();
			Array.from(wrapper.querySelectorAll('.date-number')).forEach((elem) => {
				if (elem.dataset.num == dateNum) {
					elem.classList.add('selected');
					return;
				}
				elem.classList.remove('selected');
			});
			displayDateInfo();
		}
		// prettier-ignore
		const detailsHtml = () => html`
	<div class="calendar-details">
		<div class="solar">
			<div class="solar-date">${today.getDate()}</div>
			<div class="solar-day">${calWeekDaysFull[today.getDay()]}</div>
		</div>
		<div class="today-badge"><span>Hôm Nay</span></div>
		<div class="info-left">
			<div class="lunar-year">Năm</div>
			<div class="lunar-tietkhi">Tiết</div>
		</div>
		<div class="lunar">
			<div class="lunar-date"></div>
			<div class="lunar-month">Tháng</div>
		</div>
		<div class="info-right">
			<div class="lunar-month-canchi">Tháng</div>
			<div class="lunar-date-canchi">Ngày</div>
			<div class="lunar-hour-canchi">Giờ</div>
		</div>
		<div class="lunar-hours">Giờ Hoàng Đạo:</div>
		<div class="today-event"></div>
	</div>
		`
		// prettier-ignore
		this.html = () => html`<div class="calendar-inner">
	<div class="calendar-controls">
		<div class="calendar-prev"><button type="button" aria-label="Previous Month"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="currentColor" d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.4z"/></svg></button></div>
		<div class="calendar-year-month">
			<span class="calendar-month-label"></span>
			<span>-</span>
			<span class="calendar-year-label"></span>
		</div>
		<div class="calendar-next"><button type="button" aria-label="Next Month"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="currentColor" d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z"/></svg></button></div>
	</div>
	${detailsVisible ? detailsHtml() : ''}
	<div class="calendar-body">
		<div class="calendar-weekdays"></div>
		<div class="calendar-dates"></div>
	</div>
	<button class="calendar-today-date">Hôm nay:
		${calWeekDaysFull[today.getDay()]},
		${today.getDate()}
		${calMonthName[today.getMonth()]}
		${today.getFullYear()}
	</button>
	<slot name="public-holidays"></slot>
</div>`;

		function plotDayNames() {
			var html = '';
			for (let i = 0; i < 7; i++) {
				// shift sunday to last column
				html += `<div>${calWeekDays[(i + 1 + 7) % 7]}</div>`;
			}
			wrapper.querySelector('.calendar-weekdays').innerHTML = html;
		}

		function plotDates() {
			displayMonth();
			displayYear();

			const prevMonthLastDate = getPreviousMonthLastDate();

			const calMonth = selectedDate.getMonth() + 1;
			const calYear = selectedDate.getFullYear();
			let calendarDays = daysInMonth(calMonth, calYear);
			const firstDayPos = firstDayColumnIndex();
			const prevAndCurrDaysCount = calendarDays + firstDayPos;
			const remainingDaysCount =
				prevAndCurrDaysCount > 35 ? 42 - prevAndCurrDaysCount : 35 - prevAndCurrDaysCount;
			let html = '';
			for (let i = 1; i <= prevAndCurrDaysCount + remainingDaysCount; i++) {
				if (i <= firstDayPos) {
					// dates of previous month
					html += dateCell(
						prevMonthLastDate.getFullYear(),
						prevMonthLastDate.getMonth() + 1,
						prevMonthLastDate.getDate() + i - firstDayPos,
						timezone,
						'prev-dates'
					);
				} else if (i > firstDayPos && i <= prevAndCurrDaysCount) {
					// dates of current month
					html += dateCell(calYear, calMonth, i - firstDayPos, timezone);
				} else {
					// dates of next month
					html += dateCell(
						calYear,
						calMonth + 1,
						i - prevAndCurrDaysCount,
						timezone,
						'next-dates'
					);
				}
			}
			wrapper.querySelector('.calendar-dates').innerHTML = html;
			highlightToday();
		}
		function dateCell(sy, sm, sd, tz, className = 'date-number') {
			// am lich
			let [d, m] = convertSolar2Lunar(sd, sm, sy, tz);
			let event = findEvents(sy, sm, sd, m, d);
			let classes =
				className +
				(event.isLunarEvent ? ' lunar-event' : '') +
				(event.isSolarEvent || event.isPublicHoliday ? ' public-holiday' : '');
			const lunarDateStr =
				d === 1 || sd === 1 ? `${d}/${m}` : d === 15 ? `${d} <small>🌕</small>` : `${d}`;

			const html = `<a class="${classes}" data-num=${sd} href="#${sy}-${sm}-${sd}"><div class="solar-date">${sd}</div><span class="lunar-date">${lunarDateStr}</span></a>`;
			return html;
		}

		function attachEvents() {
			let prevBtn = wrapper.querySelector('.calendar-prev button');
			let nextBtn = wrapper.querySelector('.calendar-next button');
			let todayDate = wrapper.querySelector('.calendar-today-date');
			let dateNumberParent = wrapper.querySelector('.calendar-dates');
			prevBtn.addEventListener('click', () => navigateToPreviousMonth());
			nextBtn.addEventListener('click', () => navigateToNextMonth());
			todayDate.addEventListener('click', navigateToCurrentMonth);
			dateNumberParent.addEventListener('click', handleDateClick);
		}
		function removeEvents() {
			let prevBtn = wrapper.querySelector('.calendar-prev button');
			let nextBtn = wrapper.querySelector('.calendar-next button');
			let todayDate = wrapper.querySelector('.calendar-today-date');
			let dateNumberParent = wrapper.querySelector('.calendar-dates');
			prevBtn.removeEventListener('click', () => navigateToPreviousMonth());
			nextBtn.removeEventListener('click', () => navigateToNextMonth());
			todayDate.removeEventListener('click', navigateToCurrentMonth);
			dateNumberParent.removeEventListener('click', handleDateClick);
		}
		function highlightToday() {
			let currentMonth = today.getMonth() + 1;
			let changedMonth = selectedDate.getMonth() + 1;
			let currentYear = today.getFullYear();
			let changedYear = selectedDate.getFullYear();
			if (currentYear === changedYear && currentMonth === changedMonth) {
				wrapper
					.querySelectorAll('.date-number')
					[today.getDate() - 1].classList.add('calendar-today');
				selectDate();
			}
		}
		function displayDateInfo() {
			const dateDetails = wrapper.querySelector('.calendar-details');
			if (!detailsVisible || !dateDetails) {
				return;
			}
			const isToday = selectedDate.toDateString() === today.toDateString();
			const lunarDayInfo = getLunarDayInfo(selectedDate, timezone);
			const thisDate = findEvents(
				selectedDate.getFullYear(),
				selectedDate.getMonth() + 1,
				selectedDate.getDate(),
				lunarDayInfo.month,
				lunarDayInfo.date
			);
			// console.log(thisDate);
			dateDetails.querySelector('.solar-date').textContent = selectedDate.getDate();
			dateDetails.querySelector('.solar-day').textContent =
				calWeekDaysFull[selectedDate.getDay()];
			dateDetails.querySelector('.lunar-month').textContent = lunarDayInfo.monthName;

			dateDetails.querySelector('.lunar-date').textContent = lunarDayInfo.date;
			dateDetails.querySelector('.lunar-year').textContent = 'Năm ' + lunarDayInfo.year;
			dateDetails.querySelector('.lunar-month-canchi').textContent =
				'Tháng ' + lunarDayInfo.ccmonth;
			dateDetails.querySelector('.lunar-date-canchi').textContent =
				'Ngày ' + lunarDayInfo.ccdate;
			dateDetails.querySelector('.lunar-hour-canchi').textContent =
				'Giờ ' + lunarDayInfo.cchour;
			dateDetails.querySelector('.lunar-tietkhi').textContent =
				'Tiết ' + lunarDayInfo.tietkhi;
			dateDetails.querySelector('.lunar-hours').innerHTML =
				'Giờ hoàng đạo: ' + lunarDayInfo.hoangdao;
			if (thisDate.isPublicHoliday) {
				dateDetails.querySelector('.solar-date').classList.add('public-holiday');
				dateDetails.querySelector('.solar-day').classList.add('public-holiday');
			} else {
				dateDetails.querySelector('.solar-date').classList.remove('public-holiday');
				dateDetails.querySelector('.solar-day').classList.remove('public-holiday');
			}
			if (thisDate.eventNames.length) {
				dateDetails.querySelector('.today-event').innerHTML =
					thisDate.eventNames.join('. ');
			} else {
				dateDetails.querySelector('.today-event').innerHTML = '';
			}
			if (isToday) {
				dateDetails.querySelector('.today-badge').classList.add('visible');
			} else {
				dateDetails.querySelector('.today-badge').classList.remove('visible');
			}
		}

		/**
		 * @param {Date} date Target date
		 */
		function setSelectedDate(date) {
			if (date instanceof Date && !isNaN(date)) {
				selectedDate = date;
				plotDates();
				selectDate();
				return;
			}
			throw new RangeError('Invalid initial-date');
		}

		/**
		 * @param {string} timezoneStr timezone string in format (+|-)HH:MM
		 */
		function setTimezone(timezoneStr) {
			timezone = getTimezone(timezoneStr);
			plotDates();
			selectDate();
		}

		function setDetailsVisible(visible) {
			detailsVisible = visible;
			const details = wrapper.querySelector('.calendar-details');
			console.log(visible, details);
			if (!visible && details) {
				details.parentElement.removeChild(details);
			}

			if (visible && !details) {
				wrapper.innerHTML = this.html();
				this.init(wrapper);
			}
		}

		function updateToday() {
			console.log('Updating Today:', today.toDateString());
			plotDates();
			selectDate();
			wrapper.querySelector('.calendar-today-date').textContent = `Hôm nay: ${
				calWeekDaysFull[today.getDay()]
			}, ${today.getDate()} ${calMonthName[today.getMonth()]} ${today.getFullYear()}`;
		}

		function init(wrapperElem) {
			wrapper = this.wrapper = wrapperElem;
			plotDayNames();
			plotDates();
			selectDate();
			attachEvents();

			setInterval(() => {
				const newToday = new Date();
				if (newToday.toDateString() !== today.toDateString()) {
					today = newToday;
					updateToday();
				}
			}, 2000); // don't need to be second accurate
		}

		// public methods:
		this.init = init.bind(this);
		this.setTimezone = setTimezone.bind(this);
		this.setSelectedDate = setSelectedDate.bind(this);
		this.removeEvents = removeEvents.bind(this);
		this.setDetailsVisible = setDetailsVisible.bind(this);
	}

	connectedCallback() {
		const shadow = this.shadowRoot;

		// Create wrapper
		const wrapper = document.createElement('div');
		wrapper.setAttribute('class', 'calendar');
		wrapper.innerHTML = this.html();

		// Create inner styles
		// Create some CSS to apply to the shadow dom
		const style = document.createElement('style');
		style.textContent = styles;

		// Attach the created elements to the shadow dom
		shadow.appendChild(style);
		this.init(wrapper);
		shadow.appendChild(wrapper);
	}

	disconnectedCallback() {
		this.removeEvents();
	}

	// TODO: implement property getter/setter equivalent to these attributes
	attributeChangedCallback(name, oldVal, newVal) {
		// console.log(name, typeof oldVal, typeof newVal);
		if (!this.wrapper) {
			// initial render, wrapper is not init
			return;
		}
		if (name === 'timezone' && newVal !== oldVal) {
			this.setTimezone(newVal);
		}
		if (name === 'initial-date' && newVal !== oldVal) {
			this.setSelectedDate(new Date(newVal));
		}
		if (name === 'details-visible' && newVal !== oldVal) {
			if (typeof newVal === 'string') {
				this.setDetailsVisible(true);
			} else {
				this.setDetailsVisible(false);
			}
		}
	}
}

window.customElements.define('lunar-cal', LunisolarCalendar);

export { LunisolarCalendar, DEFAULT_EVENTS };
