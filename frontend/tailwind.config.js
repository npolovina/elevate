/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // You can add custom colors here
          'elevate-blue': {
            50: '#e6f1ff',
            100: '#b3d7ff',
            500: '#0066cc',
            600: '#0052a3'
          },
          'elevate-green': {
            50: '#e6f5f0',
            100: '#b3e6d1',
            500: '#00cc99',
            600: '#00a37a'
          }
        },
        animation: {
          'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }
      },
    },
    plugins: [
        // Add any Tailwind plugins here
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
      ],
    };