import { LitElement, css, html } from 'lit';

export const ELEMENT_NAME = 'cal-display';

export class CalendarDisplay extends LitElement {
	static weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
	static properties = {
		month: { type: Number },
		year: { type: Number },
		startWeekOn: {
			type: String,
			attribute: 'start-week-on',
			converter: {
				fromAttribute: (value = '') => {
					const shortName = value.substring(0, 3).toLowerCase();
					if (CalendarDisplay.weekDays.includes(shortName)) {
						return shortName;
					}

					return 'sun';
				},
			},
		},
	};
	// Define scoped styles right with your component, in plain CSS
	static styles = css`
		:host {
			position: relative;
			display: block;
			overflow: hidden;
			width: 100%;
			min-height: 100%;
		}
		.wrapper {
		}

		.days-grid {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
			grid-template-rows: 1fr;
			gap: 0px 0px;
			grid-template-areas: 'w1d0 w1d1 w1d2 w1d3 w1d4 w1d5 w1d6';
			text-align: center;
		}

		.dates-grid {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
			grid-template-rows: 1fr;
			gap: 0px 0px;
			/* grid-template-areas:
				'w1d0 w1d1 w1d2 w1d3 w1d4 w1d5 w1d6'
				'w2d0 w2d1 w2d2 w2d3 w2d4 w2d5 w2d6'
				'w3d0 w3d1 w3d2 w3d3 w3d4 w3d5 w3d6'
				'w4d0 w4d1 w4d2 w4d3 w4d4 w4d5 w4d6'
				'w5d0 w5d1 w5d2 w5d3 w5d4 w5d5 w5d6'
				'w6d0 w6d1 w6d2 w6d3 w6d4 w6d5 w6d6'; */
			text-align: center;
		}
		.dates-grid::before {
			content: '';
			display: block;
		}
		.start-0::before {
			grid-column: 1/1; /* it still occupie 1 column */
			display: none;
		}
		.start-1::before {
			grid-column: 1/2;
		}
		.start-2::before {
			grid-column: 1/3;
		}
		.start-3::before {
			grid-column: 1/4;
		}
		.start-4::before {
			grid-column: 1/5;
		}
		.start-5::before {
			grid-column: 1/6;
		}
		.start-6::before {
			grid-column: 1/7;
		}
	`;

	constructor() {
		super();
		const now = new Date();
		// Declare reactive properties with default values
		/** Month start from 1 */
		this.month = now.getMonth() + 1;
		/** 4-digit Year */
		this.year = now.getFullYear();
		/** First day of week, either
		 * 'monday' 'mon' | 'tuesday' 'tue' | 'wednesday' 'wed' | 'thursday' 'thu' | 'friday' 'fri' | 'saturday' 'sat' | 'sunday' 'sun'
		 */
		this.startWeekOn = 'sun';
	}

	_firstDate() {
		return new Date(this.year, this.month - 1, 1);
	}

	/**
	 * @param {number} len total number of days in month
	 * @param {number} dayOfWeek Sun 0 - Sat 6
	 */
	_renderDates(len, dayOfWeek) {
		let tmpl = [];
		for (let d = 1; d <= len; d++) {
			tmpl.push(html`<div class=${`day${(dayOfWeek + d - 1) % 7}`}>${d}</div>`);
		}
		return tmpl;
	}

	_renderWeekDays() {
		let tmpl = [];
		// if start week on Monday (index 1), then column is calculated as (i + 1) % 7
		const startWeekOn = CalendarDisplay.weekDays.indexOf(this.startWeekOn);
		for (let i = 0; i < 7; i++) {
			const col = (i + startWeekOn) % 7;
			const day = CalendarDisplay.weekDays[col];
			tmpl.push(html`<div>${day}</div>`);
		}

		return tmpl;
	}

	// Render the UI as a function of component state
	render() {
		const firstDay = this._firstDate();

		return html`<div class="wrapper">
			<div>${this.month} - ${this.year}</div>
			<div class="days-grid">${this._renderWeekDays()}</div>
			<div class="dates-grid start-6">${this._renderDates(31, 3)}</div>
		</div>`;
	}
}
customElements.define(ELEMENT_NAME, CalendarDisplay);
