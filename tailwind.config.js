module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        //Primary: green 400-700
        primary: { 100: '#4ade80', 200: '#22c55e', 300: '#16a34a', 400: '#15803d' },
        //Danger: red 400-700
        danger: { 100: '#f87171', 200: '#ef4444', 300: '#dc2626', 400: '#b91c1c' },
        //Warnign: yellow 400-500
        warning: { 100: '#facc15', 200: '#eab308' },
      },
    },
  },
  plugins:
    [
      require('tailwind-scrollbar'), require('@tailwindcss/forms')
    ]
}
