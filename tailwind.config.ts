import type { Config } from 'tailwindcss'
import defaultConfig from 'tailwindcss/defaultTheme'

export default {
  darkMode: ['selector', '[data-mode="dark"]'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultConfig.fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config
