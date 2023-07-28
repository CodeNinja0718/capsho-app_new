module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: '2rem'
    },
    extend: {
      colors: {
        primaryDark: '#6267DA',
        secondaryDark: '#FBCD85',
        secondaryLight: '#FFF3C8',
        primaryLight: '#EAE8FF',
        backgroundGradient: '#F5F4FF',
        offWhite: '#FCFCFC',
        yellowBackgroundStart: '#FFE7C2',
        yellowBackgroundEnd: '#FFDDA7',
        formLabel: '#A0A3BD',
        socialBG: '#14142B'
      },
      fontFamily: {
        heading: ['"Source Serif Pro"'],
        body: ['"Open Sans"'],
        number: ['"Inter"'],
        navbar: ['"DM Sans"'],
        bodyLexend: ['"Lexend Deca"'],
        formText: ['"Poppins"'],
        themes: ['"Barlow"']
      },
      width: {
        iphoneWidth: '304px',
        ig: '100px',
      },
      height: {
        iphoneHeight: '660px',
        ig: '100px'
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      text: ['disabled'],
      fontWeight: ['hover', 'focus']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tw-elements/dist/plugin')
  ],
  content: ['./src/**/*.{html,js}', './node_modules/tw-elements/dist/js/**/*.js'],
}
