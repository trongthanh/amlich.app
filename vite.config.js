import minifyTaggedTemplate from 'rollup-plugin-minify-html-literals';
import { VitePWA } from 'vite-plugin-pwa';

export default {
	plugins: [
		minifyTaggedTemplate(), // minify html & css tagged templates
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'app-icon.svg', 'app-icon.png', 'app-icon-256.png'],
			manifest: {
				name: 'Âm Lịch PWA',
				short_name: 'Âm Lịch',
				description:
					'Âm Lịch Việt Nam Progressive Web App, phát triển bởi Trần Trọng Thanh, dựa trên thuật toán tính âm lịch của Hồ Ngọc Đức.',
				theme_color: '#212121',
				icons: [
					{
						src: 'app-icon.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'app-icon-256.png',
						sizes: '256x256',
						type: 'image/png',
					},
				],
			},
		}),
	],

	server: {
		port: 8080,
	},
};
