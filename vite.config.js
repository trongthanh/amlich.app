/* eslint-env node */
import path from 'path';
import minifyTaggedTemplate from 'rollup-plugin-minify-template-literals';
import { VitePWA } from 'vite-plugin-pwa';
import copy from 'rollup-plugin-copy';

/** @type {import('vite').UserConfig} */
export default {
	root: 'src/',
	publicDir: '../public/',
	build: {
		outDir: '../dist/',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				// relative to vite.config.js
				main: 'src/index.html',
				wallpaperMaker: 'src/wallpaper-maker/index.html',
			},
		},
	},
	plugins: [
		// Bundle styles into dist/bundle.css
		// css({
		// 	output: 'bundle.css',
		// }),
		// Copy Shoelace assets to public/assets/ once so they can be accessed
		// from both `vite` and `vite preview`
		copy({
			copyOnce: true,
			targets: [
				{
					src: path.resolve(__dirname, 'node_modules/@shoelace-style/shoelace/dist/assets/icons/'),
					dest: path.resolve(__dirname, 'public/assets/'),
				},
				{
					src: path.resolve(__dirname, 'node_modules/@shoelace-style/shoelace/dist/themes/light.css'),
					dest: path.resolve(__dirname, 'public/css/shoelace/'),
				},
				{
					src: path.resolve(__dirname, 'node_modules/@shoelace-style/shoelace/dist/themes/dark.css'),
					dest: path.resolve(__dirname, 'public/css/shoelace/'),
				},
			],
		}),
		minifyTaggedTemplate({ filter: (id) => !id.includes('node_modules') }), // minify html & css tagged templates
		// TODO: register for root index.html ONLY
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'app-icon.svg', 'app-icon.png', 'app-icon-maskable.png'],
			manifest: {
				name: 'Âm Lịch PWA',
				short_name: 'Âm Lịch',
				description:
					'Âm Lịch Việt Nam Progressive Web App, phát triển bởi Trần Trọng Thanh, dựa trên thuật toán tính âm lịch của Hồ Ngọc Đức.',
				theme_color: '#212121',
				background_color: '#3b82f6',
				icons: [
					{
						src: 'app-icon.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'app-icon-maskable.png',
						type: 'image/png',
						sizes: '512x512',
						purpose: 'maskable',
					},
				],
			},
		}),
	],

	server: {
		port: 8080,
	},

	test: {
		root: __dirname,
		include: ['src/**/*.test.{js,ts}', 'functions/**/*.test.{js,ts}'],
	},
};
