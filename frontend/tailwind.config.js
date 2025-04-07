/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html",
    ],
    theme: {
      extend: {
        colors: {
          indigo: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
          },
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        spacing: {
          '72': '18rem',
          '84': '21rem',
          '96': '24rem',
        },
        boxShadow: {
          subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  }