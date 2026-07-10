/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          foreground: '#FFFFFF'
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F3E5AB',
          dark: '#AA7C11'
        },
        luxury: {
          black: '#111111',
          gray: '#F8F8F8',
          border: '#EAEAEA',
          text: '#111111',
          studio: '#F4F4F2',
          pearl: '#F6F6F4',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      spacing: {
        'apple-sm': '8px',
        'apple-md': '16px',
        'apple-lg': '24px',
        'apple-xl': '32px',
        'apple-2xl': '48px',
        'apple-3xl': '64px',
      },
      animation: {
        'scan': 'scan-line 2.5s ease-in-out infinite',
      },
      keyframes: {
        'scan-line': {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.3' },
          '50%': { transform: 'translateY(350px)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
