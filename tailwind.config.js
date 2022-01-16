const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      'blue': {
        50: '#b0b8fc',
        100: '#9da6fb',
        200: '#7582fa',
        300: '#4e5ff9',
        400: '#182ef7',
        500: '#091fec',
        600: '#071ac5',
        700: '#06159d',
        800: '#041076',
        900: '#030a4f',
      },
      'purple': {
        50: '#fed7ea',
        100: '#fec3df',
        200: '#fd9bca',
        300: '#fc73b5',
        400: '#fb4da0',
        500: '#fb238b',
        600: '#f00576',
        700: '#c80463',
        800: '#a0034f',
        900: '#78023b',
      },
      'orange': {
        50: '#fdc269',
        100: '#fcb850',
        200: '#fcae37',
        300: '#fba41e',
        400: '#fb9a05',
        500: '#e28b05',
        600: '#b06c04',
        700: '#975c03',
        800: '#7e4d03',
        900: '#643e02',
      }
    },
    extend: {},
  },
  plugins: [],
}
