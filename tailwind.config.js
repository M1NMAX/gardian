module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins:
    [
      require('tailwind-scrollbar'),
    ],
  variants: {
    scrollbar: ['rounded']
  }
}
