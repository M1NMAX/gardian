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
