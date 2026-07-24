/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Single restrained brand hue — deep forest green. Used sparingly
        // (one accent per screen), not as a rainbow of gradients.
        primary: {
          50: '#f1f7f3',
          100: '#dfeee3',
          200: '#c0ddc8',
          300: '#94c3a3',
          400: '#63a179',
          500: '#3f8259',
          600: '#2f6846',
          700: '#28543a',
          800: '#224431',
          900: '#1c3829',
          950: '#0e2018',
        },
        // Neutral scale used for nearly everything: text, borders, surfaces.
        ink: {
          50: '#f7f7f6',
          100: '#eeeeec',
          200: '#dcdcd8',
          300: '#bfbfb9',
          400: '#9a9a92',
          500: '#7a7a71',
          600: '#5f5f58',
          700: '#4c4c46',
          800: '#33332f',
          900: '#232320',
          950: '#171715',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          50: '#f1f7f3',
          500: '#3f8259',
          600: '#2f6846',
        },
        warning: {
          50: '#fdf8ec',
          500: '#b3801a',
          600: '#8f6714',
        },
        error: {
          50: '#fbf1f0',
          500: '#b3492f',
          600: '#943a25',
        },
        info: {
          50: '#f1f5f7',
          500: '#4a6b7a',
          600: '#3a5561',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'smooth-pulse': 'smoothPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-float': 'subtleFloat 3s ease-in-out infinite',
        'micro-bounce': 'microBounce 0.6s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'optimized-spin': 'optimizedSpin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 20px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        smoothPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -5px, 0)' },
        },
        microBounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '40%': { transform: 'translate3d(0, -2px, 0)' },
          '60%': { transform: 'translate3d(0, -1px, 0)' },
        },
        shimmer: {
          '0%': { transform: 'translate3d(-100%, 0, 0)' },
          '100%': { transform: 'translate3d(100%, 0, 0)' },
        },
        optimizedSpin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      screens: {
        'xs': '475px',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
      willChange: {
        'transform': 'transform',
        'opacity': 'opacity',
        'contents': 'contents',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities }) {
      const newUtilities = {
        '.gpu-accelerated': {
          'will-change': 'transform, opacity',
          'transform': 'translate3d(0, 0, 0)',
        },
        '.smooth-transition': {
          'transition-property': 'transform, opacity',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.hover-lift:hover': {
          'transform': 'translate3d(0, -2px, 0)',
          'transition': 'transform 0.2s ease-out',
        },
        '.hover-scale:hover': {
          'transform': 'scale(1.02)',
          'transition': 'transform 0.2s ease-out',
        },
        '.backdrop-blur-optimized': {
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
        },
      }
      addUtilities(newUtilities, ['hover', 'focus'])
    }
  ],
}