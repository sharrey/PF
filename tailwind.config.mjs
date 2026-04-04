/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Pixelify Sans"', 'monospace'],
				mono: ['"Pixelify Sans"', 'monospace'],
			},
			animation: {
				'bounce-slow': 'bounce 2s infinite',
			},
		},
	},

	plugins: [],
	
}

  
