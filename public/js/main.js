const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;200;300;400;500;600;700&display=swap');

  :root {
    --calendar-bg-color: #262829;
    --calendar-font-color: #fff;
    --weekdays-border-bottom-color: #404040;
    --calendar-date-hover-color: #505050;
    --calendar-current-date-color: #1b1f21;
    --calendar-today-color: linear-gradient(to bottom, #03a9f4, #2196f3);
    --calendar-today-innerborder-color: transparent;
    --calendar-nextprev-bg-color: transparent;
    --next-prev-arrow-color: #fff;
    --calendar-border-radius: 16px;
    --calendar-prevnext-date-color: #484848;
  }

  * {
    padding: 0;
    margin: 0;
  }

  body {
    background: #000;
  }

  .calendar {
    font-family: 'IBM Plex Sans', sans-serif;
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

  .calendar .calendar-inner .calendar-body .calendar-weekdays,
  .calendar .calendar-inner .calendar-body .calendar-dates {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
  }

  .calendar .calendar-inner .calendar-body .calendar-weekdays > div,
  .calendar .calendar-inner .calendar-body .calendar-dates > div {
    padding: 4px;
    min-height: 30px;
    /* line-height: 30px; */
    border: 1px solid transparent;
    margin: 10px 2px 0px;
  }

  .calendar .calendar-inner .calendar-body .calendar-weekdays div {
    border: 1px solid transparent;
    border-bottom: 1px solid var(--weekdays-border-bottom-color);
  }

  .calendar .calendar-inner .calendar-body .number-item > a {
    color: var(--calendar-font-color);
    text-decoration: none;
    display: flex;
    justify-content: center;
  }

  .calendar .calendar-inner .calendar-body .number-item:hover {
    border: 1px solid var(--calendar-date-hover-color);
    border-radius: 4px;
  }

  .calendar .calendar-inner .calendar-body div.empty-dates:hover {
    border: 1px solid transparent;
  }

  .calendar .calendar-inner .calendar-controls {
    display: grid;
    grid-template-columns: 25% auto 25%;
  }

  .calendar .calendar-inner .calendar-today-date {
    display: grid;
    text-align: center;
    cursor: pointer;
    margin: 3px 0px;
    background: var(--calendar-current-date-color);
    padding: 8px 0px;
    border-radius: 10px;
    width: 80%;
    margin: auto;
  }

  .calendar .calendar-inner .calendar-controls .calendar-year-month {
    display: flex;
    min-width: 100px;
    justify-content: space-evenly;
    align-items: center;
  }

  .calendar .calendar-inner .calendar-controls .calendar-next {
    text-align: right;
  }

  .calendar .calendar-inner .calendar-controls .calendar-year-month .calendar-year-label,
  .calendar .calendar-inner .calendar-controls .calendar-year-month .calendar-month-label {
    font-weight: 500;
    font-size: 20px;
  }

  .calendar .calendar-inner .calendar-body .calendar-today {
    background: var(--calendar-today-color);
    border-radius: 4px;
  }

  .calendar .calendar-inner .calendar-body .calendar-today:hover {
    border: 1px solid transparent;
  }

  .calendar .calendar-inner .calendar-body .calendar-today a {
    outline: 2px solid var(--calendar-today-innerborder-color);
  }

  .calendar .calendar-inner .calendar-controls .calendar-next a,
  .calendar .calendar-inner .calendar-controls .calendar-prev a {
    color: var(--calendar-font-color);
    font-family: arial, consolas, sans-serif;
    font-size: 26px;
    text-decoration: none;
    padding: 4px 12px;
    display: inline-block;
    background: var(--calendar-nextprev-bg-color);
    margin: 10px 0 10px 0;
  }

  .calendar .calendar-inner .calendar-controls .calendar-next a svg,
  .calendar .calendar-inner .calendar-controls .calendar-prev a svg {
    height: 20px;
    width: 20px;
  }

  .calendar .calendar-inner .calendar-controls .calendar-next a svg path,
  .calendar .calendar-inner .calendar-controls .calendar-prev a svg path {
    fill: var(--next-prev-arrow-color);
  }

  .calendar .calendar-inner .calendar-body .prev-dates,
  .calendar .calendar-inner .calendar-body .next-dates {
    color: var(--calendar-prevnext-date-color);
  }

  .calendar .calendar-inner .calendar-body .prev-dates:hover,
  .calendar .calendar-inner .calendar-body .next-dates:hover {
    border: 1px solid transparent;
    pointer-events: none;
  }

  .calendar-body .lunar-date {
    font-size: 12px;
    color: #facc15;
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
      'date . names'
      'hours hours hours';
    font-size: 14px;
  }

  .calendar-details .solar-current {
    grid-area: solar;
    text-align: center;
    padding: 10px 0px;
  }

  .calendar-details .lunar-current {
    grid-area: date;
    text-align: center;
  }

  .calendar-details .lunar-names {
    grid-area: names;
  }

  .calendar-details .lunar-hours {
    grid-area: hours;
    padding: 10px 0px;
  }
`;

class LunarSolarCalendar extends HTMLElement {
	constructor() {
		super(); // always call super() first in the constructor.

		let wrapper = null;
		let selectedDate = (this.selectedDate = new Date());

		// private properties
		let localDate = new Date();
		let prevMonthLastDate = null;
		let calWeekDays = ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'];
		// prettier-ignore
		let calWeekDaysFull = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy',
		];
		// prettier-ignore
		let calMonthName = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
		// prettier-ignore
		let lunarMonthName = ["Giêng", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Một", "Chạp"]

		function daysInMonth(month, year) {
			return new Date(year, month, 0).getDate();
		}
		function firstDay() {
			return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
		}
		function lastDay() {
			return new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
		}
		function firstDayColumn() {
			// shift sunday to last column, monday is first day of week
			const day = (firstDay().getDay() + 7 - 1) % 7;
			return day + 1;
		}
		function lastDayColumn() {
			// shift sunday to last column
			const day = (lastDay().getDay() + 7 - 1) % 7;
			return day + 1;
		}
		function getPreviousMonthLastDate() {
			let lastDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0).getDate();
			return lastDate;
		}
		function navigateToPreviousMonth() {
			selectedDate.setMonth(selectedDate.getMonth() - 1);
			attachEventsOnNextPrev();
		}
		function navigateToNextMonth() {
			selectedDate.setMonth(selectedDate.getMonth() + 1);
			attachEventsOnNextPrev();
		}
		function navigateToCurrentMonth() {
			let currentMonth = localDate.getMonth();
			let currentYear = localDate.getFullYear();
			selectedDate.setMonth(currentMonth);
			selectedDate.setYear(currentYear);
			attachEventsOnNextPrev();
		}
		function displayYear() {
			let yearLabel = wrapper.querySelector('.calendar-year-label');
			yearLabel.innerHTML = selectedDate.getFullYear();
		}
		function displayMonth() {
			let monthLabel = wrapper.querySelector('.calendar-month-label');
			monthLabel.innerHTML = calMonthName[selectedDate.getMonth()];
		}
		function selectDate(e) {
			console.log(
				`${e.target.textContent} ${calMonthName[selectedDate.getMonth()]
				} ${selectedDate.getFullYear()}`
			);
		}
		this.template = function() {
			return `<div class="calendar-inner">
	<div class="calendar-controls">
		<div class="calendar-prev"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.4z"/></svg></a></div>
		<div class="calendar-year-month">
			<span class="calendar-month-label"></span>
			<span>-</span>
			<span class="calendar-year-label"></span>
		</div>
		<div class="calendar-next"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z"/></svg></a></div>
	</div>
	<div class="calendar-details">
		<div class="solar-current">
			<div class="solar-date">22</div>
			<div class="solar-day">Thứ Hai</div>
		</div>
		<div class="lunar-current">
			<div class="lunar-month">Tháng Chạp</div>
			<div class="lunar-date">12</div>
			<div class="lunar-year">Năm Quý Mão</div>
		</div>
		<div class="lunar-names">
			<div class="lunar-month-canchi">Tháng Ất Sửu</div>
			<div class="lunar-date-canchi">Ngày Ất Dậu</div>
			<div class="lunar-hour-canchi">Giờ Bính Tý</div>
			<div class="lunar-tietkhi">Tiết Đại Hàn</div>
		</div>
		<div class="lunar-hours">
			Giờ Hoàng Đạo: <span>Tý (23-1), Dần (3-5), Mão (5-7), Ngọ (11-13), Mùi (13-15), Dậu (17-19)</span>
		</div>
	</div>
	<div class="calendar-body">
		<div class="calendar-weekdays"></div>
		<div class="calendar-dates"></div>
	</div>
	<div class="calendar-today-date">Hôm nay:
		${calWeekDaysFull[localDate.getDay()]},
		${localDate.getDate()}
		${calMonthName[localDate.getMonth()]}
		${localDate.getFullYear()}
	</div>
</div>`;
		};
		function plotDayNames() {
			var html = '';
			for (let i = 0; i < 7; i++) {
				// shift sunday to last column
				html += `<div>${calWeekDays[(i + 1 + 7) % 7]}</div>`;
			}
			wrapper.querySelector('.calendar-weekdays').innerHTML = html;
		}
		function plotDates() {
			wrapper.querySelector('.calendar-dates').innerHTML = '';
			plotDayNames();
			displayMonth();
			displayYear();
			let count = 1;
			let prevDateCount = 0;

			prevMonthLastDate = getPreviousMonthLastDate();
			let prevMonthDatesArray = [];
			let calendarDays = daysInMonth(selectedDate.getMonth() + 1, selectedDate.getFullYear());
			let html = '';
			// dates of current month
			for (let i = 1; i < calendarDays; i++) {
				if (i < firstDayColumn()) {
					prevDateCount += 1;
					html += `<div class="prev-dates"></div>`;
					prevMonthDatesArray.push(prevMonthLastDate--);
				} else {
					const lunarDateStr = lunarDateCell(
						count,
						selectedDate.getMonth() + 1,
						selectedDate.getFullYear(),
						7
					);
					html += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a>
	${lunarDateStr}</div>`;
				}
			}
			//remaining dates after month dates
			for (let j = 0; j < prevDateCount + 1; j++) {
				const lunarDateStr = lunarDateCell(
					count,
					selectedDate.getMonth() + 1,
					selectedDate.getFullYear(),
					7
				);
				html += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a>${lunarDateStr}</div>`;
			}
			wrapper.querySelector('.calendar-dates').innerHTML += html;
			highlightToday();
			plotPrevMonthDates(prevMonthDatesArray);
			plotNextMonthDates();
		}
		function lunarDateCell(d, m, y, timeZone) {
			// am lich
			let lunarDate = convertSolar2Lunar(d, m, y, timeZone);
			const lunarDateStr =
				lunarDate[0] === 1
					? `<span class="lunar-date">${lunarDate[0]}/${lunarDate[1]}</span>`
					: `<span class="lunar-date">${lunarDate[0]}</span>`;
			return lunarDateStr;
		}
		function attachEvents() {
			let prevBtn = wrapper.querySelector('.calendar-prev a');
			let nextBtn = wrapper.querySelector('.calendar-next a');
			let todayDate = wrapper.querySelector('.calendar-today-date');
			let dateNumber = wrapper.querySelectorAll('.calendar .dateNumber');
			prevBtn.addEventListener('click', navigateToPreviousMonth);
			nextBtn.addEventListener('click', navigateToNextMonth);
			todayDate.addEventListener('click', navigateToCurrentMonth);
			for (var i = 0; i < dateNumber.length; i++) {
				dateNumber[i].addEventListener('click', selectDate, false);
			}
		}
		function highlightToday() {
			let currentMonth = localDate.getMonth() + 1;
			let changedMonth = selectedDate.getMonth() + 1;
			let currentYear = localDate.getFullYear();
			let changedYear = selectedDate.getFullYear();
			if (
				currentYear === changedYear &&
				currentMonth === changedMonth &&
				wrapper.querySelectorAll('.number-item')
			) {
				wrapper
					.querySelectorAll('.number-item')
				[selectedDate.getDate() - 1].classList.add('calendar-today');
			}
		}
		function plotPrevMonthDates(dates) {
			dates.reverse();
			let prevMonthDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
			for (let i = 0; i < dates.length; i++) {
				if (wrapper.querySelectorAll('.prev-dates')) {
					let lunarDateStr = lunarDateCell(
						dates[i],
						prevMonthDate.getMonth() + 1,
						prevMonthDate.getFullYear(),
						7
					);
					wrapper.querySelectorAll('.prev-this')[i].innerHTML =
						`<div>${this[i]}</div>${lunarDateStr}`;
				}
			}
		}
		function plotNextMonthDates() {
			let childElemCount = wrapper.querySelector('.calendar-dates').childElementCount;
			//7 lines
			if (childElemCount > 35) {
				loopThroughNextDays(42 - childElemCount);
			}

			//6 lines
			if (childElemCount > 28 && childElemCount <= 35) {
				loopThroughNextDays(35 - childElemCount);
			}
		}
		function loopThroughNextDays(count) {
			if (count > 0) {
				let html = '';
				let nextMonthDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
				for (let i = 1; i <= count; i++) {
					let lunarDateStr = lunarDateCell(
						i,
						nextMonthDate.getMonth() + 1,
						nextMonthDate.getFullYear(),
						7
					);
					html += `<div class="next-dates"><div>${i}</div>${lunarDateStr}</div>`;
				}
				wrapper.querySelector('.calendar-dates').innerHTML += html;
			}
		}
		function attachEventsOnNextPrev() {
			plotDates();
			attachEvents();
		}
		this.init = function init(wrapperElem) {
			wrapper = this.wrapper = wrapperElem;
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
		wrapper.innerHTML = this.template();

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

window.customElements.define('cal-lunar', LunarSolarCalendar);
