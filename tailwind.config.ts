import type { Config } from 'tailwindcss'
import defaultConfig from 'tailwindcss/defaultTheme'
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['selector', '[data-mode="dark"]'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultConfig.fontFamily.sans],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        muted: {
          background: 'var(--muted-background)',
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: 'var(--border)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config
