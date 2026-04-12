/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['src/**/*.html', 'src/**/*.js'],
	theme: {
		fontFamily: {
			sans: [
				'Inter',
				'system-ui',
				'-apple-system',
				'Segoe UI',
				'Roboto',
				'Helvetica Neue',
				'Noto Sans',
				'Liberation Sans',
				'Arial',
				'sans-serif',
			],
		},
		extend: {},
	},
	plugins: [],
};
