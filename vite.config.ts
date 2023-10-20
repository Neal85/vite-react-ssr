import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


const root = process.cwd();

// https://vitejs.dev/config/
export default defineConfig({
	
	plugins: [react()],

	build: {
		manifest: true,
		cssCodeSplit: true,
		assetsInlineLimit: 4096,

		rollupOptions: {
			input: {
				home: resolve(root, 'home/home.html'),
				account: resolve(root, 'home/account.html'),
				admin: resolve(root, 'admin/admin.html'),
			},

			output: {
				assetFileNames: ({ name }) => {
					if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
						return 'images/[name]-[hash][extname]';
					}

					if (/\.css$/.test(name ?? '')) {
						return 'css/[name]-[hash][extname]';
					}

					// default value
					// ref: https://rollupjs.org/guide/en/#outputassetfilenames
					return 'js/[name]-[hash][extname]';
				},
			}
		}
	}
})
