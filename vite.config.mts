import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';
import { defineConfig, loadEnv } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from 'vite-plugin-imagemin';
// import { terminalPlugin } from './terminalPlugin';

const __dirname = resolve();

// https://vitejs.dev/config/
export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	const allowedHosts = [];

	if (process.env.VITE_ENV === 'test') {
		/*allowedHosts.push('w-hdc.trism.co.kr', 'localhost');*/
		allowedHosts.push('manna-crawling', 'localhost');
	}

	const buildPath = './dist';

	return defineConfig({
		plugins: [
			vue({
				script: {
					defineModel: true,
				},
				template: {
					compilerOptions: {
						//isCustomElement: (tag) => tag.includes('ion-icon')
					},
				},
			}),
			vueJsx(),
			visualizer({ open: true }),
			viteImagemin({
				gifsicle: { optimizationLevel: 7 },
				optipng: { optimizationLevel: 7 },
				mozjpeg: { quality: 75 },
				pngquant: { quality: [0.7, 0.9] },
			}),
			// terminalPlugin(),
		],
		optimizeDeps: {
			include: [
				'@ckeditor/ckeditor5-vue',
				'@ckeditor/ckeditor5-build-classic', // 사용 중이면 포함
			],
		},
		// css: {
		// 	preprocessorOptions: {
		// 		scss: {
		// 			additionalData: `
		// 				@import "@packages/assets/scss/index.scss";
		// 				`,
		// 		},
		// 	},
		// },
		// envDir: resolve(__dirname, '../../'),
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				'@packages': fileURLToPath(new URL('../../packages', import.meta.url)),
			},
		},
		build: {
			assetsDir: 'assets', // ✅ 정적 리소스를 /assets/ 밑으로 모음
			manifest: true,
			rollupOptions: {
				output: {
					entryFileNames: 'assets/[name].[hash].js',
					chunkFileNames: 'assets/[name].[hash].js',
					assetFileNames: 'assets/[name].[hash].[ext]',
					dir: resolve(__dirname, buildPath),
					manualChunks: {
						vue: ['vue', 'vue-router'],
						vendor: ['axios', 'lodash', 'moment'],
					},
				},
			},
		},
		esbuild: {
			drop: process.env.VITE_ENV === 'development' ? [] : ['console', 'debugger'],
		},
		server: {
			port: 9001,
			host: true,
			allowedHosts: allowedHosts,
			hmr: {
				host: 'localhost',
				protocol: 'ws',
			},
			proxy: {
				'/v1': {
					target: process.env.VITE_APP_API_URL,
					changeOrigin: true,
					secure: false,
					cookiePathRewrite: '/',
					cookieDomainRewrite: process.env.VITE_ENV === 'development' ? 'localhost' : '',
				},
				'/broad/v1': {
					target: process.env.VITE_JIG_BAE_APP_API_URL,
					changeOrigin: true,
					secure: false,
					cookiePathRewrite: '/',
					cookieDomainRewrite: process.env.VITE_ENV === 'development' ? 'localhost' : '',
				},
			},
		},
	});
};
