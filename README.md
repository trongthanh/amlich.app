# amlich.app

Code for <a href="https://amlich.app">applich.app</a> (Lunisolar calendar)

## `<lunar-cal>` Custom Element

Example:

```html
<lunar-cal timezone="07:00" initial-date="2024-09-02" details-visible>
	<h1>Âm Lịch Việt Nam</h1>
	<datalist slot="public-holidays">
		<!-- additional public holidays which are not fixed and dependant on the govement's decision -->
		<option value="LUNAR--12-29">🌸 29 Tháng Chạp 🌸</option>
		<option value="LUNAR--01-04">🌸 Mùng 4 Tết Nguyên Đán 🌸</option>
		<option value="LUNAR--01-05">🌸 Mùng 5 Tết Nguyên Đán 🌸</option>
		<option value="SOLAR--09-03">🇻🇳 Lễ Quốc Khánh 🇻🇳</option>
		<option value="SOLAR--12-25">🎄 Lễ Giáng Sinh 🎄</option>
	</datalist>
</lunar-cal>
```

### Customizable Attributes

These attributes are optional

- `details-visible`: (Boolean attribute) If set, the today's details will be visible.
- `initial-date`: Initial date and month for the calendar. A Date() parsable string. (Eg: `2024-01-01`, `2025-12-25`)
- `timezone`: Timezone to calculate the lunar date. (Eg: `7`, `+08:00`, `-05:00`)

## Features and Road map

- [x] Monthly view Lunisolar calendar
- [x] Details view of today and selected date
- [x] `<lunar-cal>` custom element (Web component)
- [x] Installable PWA
- [x] `prefer-color-scheme` for dark and light mode
- [ ] Customization demo
- [ ] npm package
- [ ] JS API documentation
- [ ] Unit tests
- [ ] Clean code

## Thanks

- Hồ Ngọc Đức for the original [Lunisolar calendar algorithm](https://www.informatik.uni-leipzig.de/~duc/amlich/)
- Álvaro for the initial [grid-based calendar](https://codepen.io/alvarotrigo/pen/bGLpROa)

---
© 2024 Trần Trọng Thanh (int3ractive.com). Apache 2.0 license.
