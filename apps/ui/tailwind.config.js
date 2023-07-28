/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        accent: '#02b7e4',
        dark: '#212121',
        darkish: '#3E3E3E',
        'dialog-dark': '#454545',
        'dark-blue': '#14142B',
        'light-blue': '#F9F9FF',
        'readable-primary': '#111',
        'readable-secondary': 'rgba(73, 56, 81, 0.53)',
        'secondary-dark': '#404040',
        hint: '#A2A2A2',
        'light-darkish': '#525252',
        'process-green': '#49BE4C',
        'process-yellow': '#F7E300',
        'process-red': '#F14C4C'
      },
      screens: {
        md: '768px',
        lg: '1024px',
        xl: '1440px'
      },
      container: {
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ]
}
