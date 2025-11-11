import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef6ee',
          100: '#fdebd6',
          200: '#fad4ac',
          300: '#f7b677',
          400: '#f38d40',
          500: '#f06f1a',
          600: '#e15410',
          700: '#ba3e0f',
          800: '#943215',
          900: '#782b14',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config

