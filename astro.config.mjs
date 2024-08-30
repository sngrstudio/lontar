import { defineConfig } from 'astro/config';
import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
    integrations: [],
    security: {
		checkOrigin: true
	},
    output: 'server',
    adapter: node({ mode: 'standalone' })
});
