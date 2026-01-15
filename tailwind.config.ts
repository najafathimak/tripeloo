import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#E51A4B',
          50: '#FFE5EC',
          100: '#FFC9D6',
          200: '#FF9FB7',
          300: '#FF7395',
          400: '#FF4A75',
          500: '#E51A4B',
          600: '#C51341',
          700: '#A40D36',
          800: '#83082B',
          900: '#620520'
        }
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          md: '1.5rem',
          lg: '2rem'
        }
      }
    },
  },
  plugins: [],
};

export default config;

