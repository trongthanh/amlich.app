# amlich.app

Code for applich.app (Lunasolar calendar)

## `<lunar-cal>` Custom Element

Example:

```html
<lunar-cal timezone="7" initial-date="2024-09-03" info-hidden>
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

- `initial-date`: Initial date and month for the calendar. A Date() parsable string.

## Thanks

- Hồ Ngọc Đức for the original [Lunisolar calendar algorithm](https://www.informatik.uni-leipzig.de/~duc/amlich/)
- Álvaro for the initial [grid-based calendar](https://codepen.io/alvarotrigo/pen/bGLpROa)

---
© Copyright 2024 Tran Trong Thanh (int3ractive.com)
