/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './assets/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan:  '#01ADEF', // primary brand (Edgenexus electric cyan)
          cyan2: '#0192C7',
          blue:  '#144586', // display headings + deep accents
          blue9: '#0E2F5C', // darkest brand surface (footer, modal backdrops)
          mint:  '#5CC4A8', // supporting / success
          coral: '#ff5a6e', // warm accent — primary acquisition CTA
          coral2:'#e63f55',
          sky:   '#DFEAF2', // section background tint
          sky2:  '#F2F7FB', // subtle hover / utility row
          ink:   '#202020', // body text
          ink2:  '#4A5562', // muted text
          line:  '#E4ECF3', // hairline borders
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        // 90rem = 1440 px — matches the standard Figma desktop artboard
        // width so html.to.design imports land cleanly on the 1440 grid.
        '7xl': '90rem',
      },
    },
  },
  plugins: [],
};
