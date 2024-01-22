function CalendarControl() {
	const calendar = new Date();
	const calendarControl = {
		localDate: new Date(),
		prevMonthLastDate: null,
		calWeekDays: ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'],
		calWeekDaysFull: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
		calMonthName: [
			'Tháng 1',
			'Tháng 2',
			'Tháng 3',
			'Tháng 4',
			'Tháng 5',
			'Tháng 6',
			'Tháng 7',
			'Tháng 8',
			'Tháng 9',
			'Tháng 10',
			'Tháng 11',
			'Tháng 12',
		],
		daysInMonth(month, year) {
			return new Date(year, month, 0).getDate();
		},
		firstDay() {
			return new Date(calendar.getFullYear(), calendar.getMonth(), 1);
		},
		lastDay() {
			return new Date(calendar.getFullYear(), calendar.getMonth() + 1, 0);
		},
		firstDayColumn() {
			// shift sunday to last column, monday is first day of week
			const day = (calendarControl.firstDay().getDay() + 7 - 1) % 7;
			return day + 1;
		},
		lastDayColumn() {
			// shift sunday to last column
			const day = (calendarControl.lastDay().getDay() + 7 - 1) % 7;
			return day + 1;
		},
		getPreviousMonthLastDate() {
			let lastDate = new Date(calendar.getFullYear(), calendar.getMonth(), 0).getDate();
			return lastDate;
		},
		navigateToPreviousMonth() {
			calendar.setMonth(calendar.getMonth() - 1);
			calendarControl.attachEventsOnNextPrev();
		},
		navigateToNextMonth() {
			calendar.setMonth(calendar.getMonth() + 1);
			calendarControl.attachEventsOnNextPrev();
		},
		navigateToCurrentMonth() {
			let currentMonth = calendarControl.localDate.getMonth();
			let currentYear = calendarControl.localDate.getFullYear();
			calendar.setMonth(currentMonth);
			calendar.setYear(currentYear);
			calendarControl.attachEventsOnNextPrev();
		},
		displayYear() {
			let yearLabel = document.querySelector('.calendar .calendar-year-label');
			yearLabel.innerHTML = calendar.getFullYear();
		},
		displayMonth() {
			let monthLabel = document.querySelector('.calendar .calendar-month-label');
			monthLabel.innerHTML = calendarControl.calMonthName[calendar.getMonth()];
		},
		selectDate(e) {
			console.log(
				`${e.target.textContent} ${calendarControl.calMonthName[calendar.getMonth()]
				} ${calendar.getFullYear()}`
			);
		},
		plotSelectors() {
			document.querySelector('.calendar').innerHTML =
				`<div class="calendar-inner"><div class="calendar-controls">
          <div class="calendar-prev"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.4z"/></svg></a></div>
          <div class="calendar-year-month">
          <div class="calendar-month-label"></div>
          <div>-</div>
          <div class="calendar-year-label"></div>
          </div>
          <div class="calendar-next"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z"/></svg></a></div>
          </div>
          <div class="calendar-today-date">Hôm nay: 
            ${calendarControl.calWeekDaysFull[calendarControl.localDate.getDay()]}, 
            ${calendarControl.localDate.getDate()} 
            ${calendarControl.calMonthName[calendarControl.localDate.getMonth()]} 
            ${calendarControl.localDate.getFullYear()}
          </div>
          
					<div class="calendar-body">
						<div class="calendar-weekdays"></div>
						<div class="calendar-dates"></div>
					</div></div>`;
		},
		plotDayNames() {
			var html = '';
			for (let i = 0; i < 7; i++) {
				// shift sunday to last column
				html += `<div>${calendarControl.calWeekDays[(i + 1 + 7) % 7]}</div>`;
			}
			document.querySelector('.calendar .calendar-weekdays').innerHTML = html;
		},
		plotDates() {
			document.querySelector('.calendar .calendar-dates').innerHTML = '';
			calendarControl.plotDayNames();
			calendarControl.displayMonth();
			calendarControl.displayYear();
			let count = 1;
			let prevDateCount = 0;

			calendarControl.prevMonthLastDate = calendarControl.getPreviousMonthLastDate();
			let prevMonthDatesArray = [];
			let calendarDays = calendarControl.daysInMonth(
				calendar.getMonth() + 1,
				calendar.getFullYear()
			);
			let html = '';
			// dates of current month
			for (let i = 1; i < calendarDays; i++) {
				if (i < calendarControl.firstDayColumn()) {
					prevDateCount += 1;
					html += `<div class="prev-dates"></div>`;
					prevMonthDatesArray.push(calendarControl.prevMonthLastDate--);
				} else {
					const lunarDateStr = calendarControl.lunarDateCell(
						count,
						calendar.getMonth() + 1,
						calendar.getFullYear(),
						7
					);
					html += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a>
	${lunarDateStr}</div>`;
				}
			}
			//remaining dates after month dates
			for (let j = 0; j < prevDateCount + 1; j++) {
				const lunarDateStr = calendarControl.lunarDateCell(
					count,
					calendar.getMonth() + 1,
					calendar.getFullYear(),
					7
				);
				html += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a>${lunarDateStr}</div>`;
			}
			document.querySelector('.calendar .calendar-dates').innerHTML += html;
			calendarControl.highlightToday();
			calendarControl.plotPrevMonthDates(prevMonthDatesArray);
			calendarControl.plotNextMonthDates();
		},
		lunarDateCell(d, m, y, timeZone) {
			// am lich
			let lunarDate = convertSolar2Lunar(d, m, y, timeZone);
			const lunarDateStr =
				lunarDate[0] === 1
					? `<span class="lunar-date">${lunarDate[0]}/${lunarDate[1]}</span>`
					: `<span class="lunar-date">${lunarDate[0]}</span>`;
			return lunarDateStr;
		},
		attachEvents() {
			let prevBtn = document.querySelector('.calendar .calendar-prev a');
			let nextBtn = document.querySelector('.calendar .calendar-next a');
			let todayDate = document.querySelector('.calendar .calendar-today-date');
			let dateNumber = document.querySelectorAll('.calendar .dateNumber');
			prevBtn.addEventListener('click', calendarControl.navigateToPreviousMonth);
			nextBtn.addEventListener('click', calendarControl.navigateToNextMonth);
			todayDate.addEventListener('click', calendarControl.navigateToCurrentMonth);
			for (var i = 0; i < dateNumber.length; i++) {
				dateNumber[i].addEventListener('click', calendarControl.selectDate, false);
			}
		},
		highlightToday() {
			let currentMonth = calendarControl.localDate.getMonth() + 1;
			let changedMonth = calendar.getMonth() + 1;
			let currentYear = calendarControl.localDate.getFullYear();
			let changedYear = calendar.getFullYear();
			if (
				currentYear === changedYear &&
				currentMonth === changedMonth &&
				document.querySelectorAll('.number-item')
			) {
				document
					.querySelectorAll('.number-item')
				[calendar.getDate() - 1].classList.add('calendar-today');
			}
		},
		plotPrevMonthDates(dates) {
			dates.reverse();
			let prevMonthDate = new Date(calendar.getFullYear(), calendar.getMonth() - 1, 1);
			for (let i = 0; i < dates.length; i++) {
				if (document.querySelectorAll('.prev-dates')) {
					let lunarDateStr = calendarControl.lunarDateCell(
						dates[i],
						prevMonthDate.getMonth() + 1,
						prevMonthDate.getFullYear(),
						7
					);
					document.querySelectorAll('.prev-dates')[i].innerHTML =
						`<div>${dates[i]}</div>${lunarDateStr}`;
				}
			}
		},
		plotNextMonthDates() {
			let childElemCount = document.querySelector('.calendar-dates').childElementCount;
			//7 lines
			if (childElemCount > 35) {
				calendarControl.loopThroughNextDays(42 - childElemCount);
			}

			//6 lines
			if (childElemCount > 28 && childElemCount <= 35) {
				calendarControl.loopThroughNextDays(35 - childElemCount);
			}
		},
		loopThroughNextDays(count) {
			if (count > 0) {
				let html = '';
				let nextMonthDate = new Date(calendar.getFullYear(), calendar.getMonth() + 1, 1);
				for (let i = 1; i <= count; i++) {
					let lunarDateStr = calendarControl.lunarDateCell(
						i,
						nextMonthDate.getMonth() + 1,
						nextMonthDate.getFullYear(),
						7
					);
					html += `<div class="next-dates"><div>${i}</div>${lunarDateStr}</div>`;
				}
				document.querySelector('.calendar-dates').innerHTML += html;
			}
		},
		attachEventsOnNextPrev() {
			calendarControl.plotDates();
			calendarControl.attachEvents();
		},
		init() {
			calendarControl.plotSelectors();
			calendarControl.plotDates();
			calendarControl.attachEvents();
		},
	};
	calendarControl.init();
}

const calendarControl = new CalendarControl();
