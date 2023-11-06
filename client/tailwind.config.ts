import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      container: {
        padding: "2rem",
        center: true,
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
} satisfies Config

