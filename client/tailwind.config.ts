import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      container: {
        padding: '2rem',
        center: true
      }
    }
  },
  plugins: []
} satisfies Config
