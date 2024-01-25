// TODO: remove plain-tag
// import css from 'plain-tag';
// import html from 'plain-tag';

import { convertSolar2Lunar, getLunarDayInfo, findEvents } from '../lib/amlich.js';

const styles = `
  :host {
    font-size: 16px;

    --calendar-bg-color: #262829;
    --calendar-font-color: #fff;
    --weekdays-border-bottom-color: #404040;
    --calendar-date-hover-color: #505050;
    --calendar-current-date-color: #1b1f21;
    --calendar-today-color: linear-gradient(to bottom, #03a9f4, #2196f3);
    --calendar-today-innerborder-color: transparent;
    --calendar-nextprev-bg-color: transparent;
    --calendar-prevnext-date-color: #484848;
    --calendar-arrow-color: #fff;
    --calendar-border-radius: 16px;
    --calendar-selected-border-color: #fff;
    --calendar-active-bg-color: #505050;
    --calendar-weekend-color: #fca5a5;
    --lunar-date-color: #facc15;
    --lunar-date-event-color: #dc2626;
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
    margin: 20px auto;
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
    line-height: 1.3;
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
    border: 1px solid var(--calendar-selected-border-color);
  }
  .date-number.lunar-event .lunar-date {
    color: var(--lunar-date-event-color);
    font-weight: 700;
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
    border-radius: 10px;
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

  .calendar-body .calendar-today {
    background: var(--calendar-today-color);
  }

  .calendar-body .calendar-today.selected {
    border: 1px solid transparent;
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
  }

  .calendar-controls button svg path {
    fill: var(--calendar-arrow-color);
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
      '. solar .'
      'left lunar right'
      'hours hours hours'
      'event event event';
    font-size: 14px;
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

  .calendar-details .lunar-event {
    grid-area: event;
    padding: 0px;
    color: var(--calendar-weekend-color);
    text-align: center;
  }
`;

class LunarSolarCalendar extends HTMLElement {
	//TODO: timezone attribute
	constructor() {
		super(); // always call super() first in the constructor.

		let wrapper = null;
		let selectedDate = (this.selectedDate = new Date());

		// private properties
		let localDate = new Date();
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
			let currentMonth = localDate.getMonth();
			let currentYear = localDate.getFullYear();
			selectedDate.setMonth(currentMonth);
			selectedDate.setYear(currentYear);
			selectedDate.setDate(localDate.getDate());
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
				navigateToNextMonth(nextBtn.dataset.num);
			}
			const prevBtn = e.target.closest('.prev-dates');
			if (prevBtn) {
				navigateToPreviousMonth(prevBtn.dataset.num);
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
		this.html = () => `<div class="calendar-inner">
	<div class="calendar-controls">
		<div class="calendar-prev"><button type="button"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.4z"/></svg></button></div>
		<div class="calendar-year-month">
			<span class="calendar-month-label"></span>
			<span>-</span>
			<span class="calendar-year-label"></span>
		</div>
		<div class="calendar-next"><button type="button"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z"/></svg></button></div>
	</div>
	<div class="calendar-details">
		<div class="solar">
			<div class="solar-date">22</div>
			<div class="solar-day">Thứ Hai</div>
		</div>
		<div class="info-left">
			<div class="lunar-year">Năm Quý Mão</div>
			<div class="lunar-tietkhi">Tiết Đại Hàn</div>
		</div>
		<div class="lunar">
			<div class="lunar-date">12</div>
			<div class="lunar-month">Tháng Chạp</div>
		</div>
		<div class="info-right">
			<div class="lunar-month-canchi">Tháng Ất Sửu</div>
			<div class="lunar-date-canchi">Ngày Ất Dậu</div>
			<div class="lunar-hour-canchi">Giờ Bính Tý</div>
		</div>
		<div class="lunar-hours">Giờ Hoàng Đạo:</div>
		<div class="lunar-event">
		</div>
	</div>
	<div class="calendar-body">
		<div class="calendar-weekdays"></div>
		<div class="calendar-dates"></div>
	</div>
	<button class="calendar-today-date">Hôm nay:
		${calWeekDaysFull[localDate.getDay()]},
		${localDate.getDate()}
		${calMonthName[localDate.getMonth()]}
		${localDate.getFullYear()}
	</button>
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
						prevMonthLastDate.getDate() + i - firstDayPos,
						prevMonthLastDate.getMonth() + 1,
						prevMonthLastDate.getFullYear(),
						7,
						'prev-dates'
					);
				} else if (i > firstDayPos && i <= prevAndCurrDaysCount) {
					// dates of current month
					html += dateCell(i - firstDayPos, calMonth, calYear, 7);
				} else {
					// dates of next month
					html += dateCell(i - prevAndCurrDaysCount, calMonth + 1, calYear, 7, 'next-dates');
				}
			}
			wrapper.querySelector('.calendar-dates').innerHTML = html;
			highlightToday();
		}
		function dateCell(sd, sm, sy, timeZone, className = 'date-number') {
			// am lich
			let [d, m] = convertSolar2Lunar(sd, sm, sy, timeZone);
			let isEvent = !!findEvents(d, m).length;
			let classes = className + (isEvent ? ' lunar-event' : '');
			const lunarDateStr =
				d === 1 || sd === 1
					? `<span class="lunar-date">${d}/${m}</span>`
					: `<span class="lunar-date">${d}</span>`;

			const html = `<a class="${classes}" data-num=${sd} href="#${sy}-${sm}-${sd}"><div class="solar-date">${sd}</div>${lunarDateStr}</a>`;
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
		function highlightToday() {
			let currentMonth = localDate.getMonth() + 1;
			let changedMonth = selectedDate.getMonth() + 1;
			let currentYear = localDate.getFullYear();
			let changedYear = selectedDate.getFullYear();
			if (currentYear === changedYear && currentMonth === changedMonth) {
				wrapper
					.querySelectorAll('.date-number')
				[localDate.getDate() - 1].classList.add('calendar-today');
				selectDate();
			}
		}
		function displayDateInfo() {
			const lunarDayInfo = getLunarDayInfo(selectedDate, 7);
			wrapper.querySelector('.calendar-details .solar-date').textContent = selectedDate.getDate();
			wrapper.querySelector('.calendar-details .solar-day').textContent =
				calWeekDaysFull[selectedDate.getDay()];
			wrapper.querySelector('.calendar-details .lunar-month').textContent = lunarDayInfo.monthName;

			wrapper.querySelector('.calendar-details .lunar-date').textContent = lunarDayInfo.date;
			wrapper.querySelector('.calendar-details .lunar-year').textContent =
				'Năm ' + lunarDayInfo.year;
			wrapper.querySelector('.calendar-details .lunar-month-canchi').textContent =
				'Tháng ' + lunarDayInfo.ccmonth;
			wrapper.querySelector('.calendar-details .lunar-date-canchi').textContent =
				'Ngày ' + lunarDayInfo.ccdate;
			wrapper.querySelector('.calendar-details .lunar-hour-canchi').textContent =
				'Giờ ' + lunarDayInfo.cchour;
			wrapper.querySelector('.calendar-details .lunar-tietkhi').textContent =
				'Tiết ' + lunarDayInfo.tietkhi;
			wrapper.querySelector('.calendar-details .lunar-hours').innerHTML =
				'Giờ hoàng đạo: ' + lunarDayInfo.hoangdao;
			wrapper.querySelector('.calendar-details .lunar-event').innerHTML = lunarDayInfo.lunarEvent;
		}

		this.init = function init(wrapperElem) {
			wrapper = this.wrapper = wrapperElem;
			plotDayNames();
			plotDates();
			attachEvents();
		};
	}

	connectedCallback() {
		// Create a shadow root
		const shadow = this.attachShadow({ mode: 'open' });

		// Create wrapper
		const wrapper = document.createElement('div');
		wrapper.setAttribute('class', 'calendar');
		wrapper.innerHTML = this.html();

		// Create inner styles
		// Create some CSS to apply to the shadow dom
		const style = document.createElement('style');
		console.log(style.isConnected);

		style.textContent = styles;

		// Attach the created elements to the shadow dom
		shadow.appendChild(style);
		console.log(style.isConnected);
		this.init(wrapper);
		shadow.appendChild(wrapper);
	}

	disconnectedCallback() {
		// TODO
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		// TODO
	}
}

window.customElements.define('lunar-cal', LunarSolarCalendar);
