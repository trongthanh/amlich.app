import minifyTaggedTemplate from 'rollup-plugin-minify-html-literals';
import { VitePWA } from 'vite-plugin-pwa';

export default {
	plugins: [
		minifyTaggedTemplate(), // minify html & css tagged templates
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['app-icon.ico', 'app-icon.png', 'app-icon.svg'],
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
				],
			},
		}),
	],

	server: {
		port: 8080,
	},
};
