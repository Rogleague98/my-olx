/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Nunito', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
        secondary: {
          50: '#f0f7ff',
          100: '#c2e0ff',
          200: '#99ccf3',
          300: '#66b2ff',
          400: '#3399ff',
          500: '#007fff',
          600: '#0059b2',
          700: '#004494',
          800: '#003366',
          900: '#001a33',
        },
        accent: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffc107',
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
        },
        blush: {
          50: '#fff0f3',
          100: '#ffd6e0',
          200: '#ffb3c6',
          300: '#ff8fab',
          400: '#ff5f7e',
          500: '#ff3c5a',
          600: '#e01e3a',
          700: '#b3122a',
          800: '#7a091a',
          900: '#4a020d',
        },
        neutral: {
          50: '#f8f7f4',
          100: '#ece9e1',
          200: '#e0dbd1',
          300: '#cfc2a7',
          400: '#bfa98a',
          500: '#a68c6d',
          600: '#8a6e4e',
          700: '#6a5236',
          800: '#4a3621',
          900: '#2e1e0f',
        },
        success: '#2196f3',
        warning: '#ffc107',
        error: '#ff6f00',
        info: '#42a5f5',
        glass: 'rgba(33,150,243,0.10)',
        darkGlass: 'rgba(33,150,243,0.7)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(33,150,243,0.10)',
        glassStrong: '0 12px 48px 0 rgba(33,150,243,0.18)',
        'glass-xl': '0 20px 60px 0 rgba(33,150,243,0.22)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255,193,7,0.12)',
        'outer-glow': '0 0 20px rgba(255,193,7,0.18)',
      },
      backgroundImage: {
        'animated-gradient': 'linear-gradient(120deg, #64b5f6 0%, #ffc107 100%)',
        'glass-gradient': 'linear-gradient(120deg, rgba(33,150,243,0.10) 0%, rgba(255,193,7,0.10) 100%)',
        'hero-gradient': 'linear-gradient(135deg, rgba(33,150,243,0.08) 0%, rgba(255,193,7,0.08) 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(33,150,243,0.05) 100%)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
      },
      keyframes: {
        'gradient-move': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(154,160,166,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(154,160,166,0.6)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'gradient-move': 'gradient-move 15s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-in': 'slide-in 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0,0,0,0.1)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 4px 8px rgba(0,0,0,0.15)',
        },
        '.text-shadow-none': {
          'text-shadow': 'none',
        },
        '.backdrop-blur-xs': {
          'backdrop-filter': 'blur(2px)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

