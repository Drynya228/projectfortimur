/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Montserrat"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          DEFAULT: '#1c64f2',
          dark: '#0f3f91',
          light: '#60a5fa',
        },
      },
      boxShadow: {
        panel: '0 20px 45px -20px rgba(30,64,175,0.45)',
      },
    },
  },
  plugins: [],
};
