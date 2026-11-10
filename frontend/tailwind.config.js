/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#7050DC', // Primary color
          600: '#5F3EC9',
          700: '#5033AE',
          800: '#432B90',
          900: '#382476',
          surface: '#FAF8FF',
          lavender: '#F4F0FE',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F5A623', // Secondary accent (Amber/Orange)
          600: '#D97706',
          700: '#B45309',
        },
        charcoal: {
          DEFAULT: '#1E1B2E',
          soft: '#2D3142',
          muted: '#6B7280',
          light: '#9CA3AF',
        },
        surface: {
          bg: '#F8F9FC',
          card: '#FFFFFF',
          subtle: '#FAF8FF',
          hover: '#F3F0FF',
          border: '#E8E5F3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        card: '0 4px 20px -2px rgba(112, 80, 220, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -4px rgba(112, 80, 220, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        modal: '0 20px 40px -8px rgba(30, 27, 46, 0.18)',
      },
      borderRadius: {
        card: '14px',
        subtle: '10px',
      },
    },
  },
  plugins: [],
};

