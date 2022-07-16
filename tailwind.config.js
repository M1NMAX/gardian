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
        //Primary: green
        //primary: { 100: '#4ade80', 200: '#22c55e', 300: '#16a34a', 400: '#15803d' },
        //Secodary: gray
        //secondary: { 100: '#4ade80', 200: '#22c55e', 300: '#16a34a', 400: '#15803d' },

        'primary-bright': '#4ade80',
        'primary': '#22c55e',
        'primary-dark': '#16a34a',
        'secondary-bright': '#fde047',
        'secondary': '#facc15',
        'secondary-dark': '#eab308',
      },
    },
  },
  plugins:
    [
      require('tailwind-scrollbar'), require('@tailwindcss/forms')
    ]
}
