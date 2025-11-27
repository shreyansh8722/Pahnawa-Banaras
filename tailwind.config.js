const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#B08D55',   // Antique Gold (from your logo)
          primaryDark: '#8C6A48', // Darker Gold for hover
          dark: '#2C2C2C',      // Soft Charcoal Black
          paper: '#FFFCF7',     // Warm Off-White
          gray: '#F9F9F9',      // Light Gray
        }
      },
      fontFamily: {
        // Elegant Serif for Headings
        serif: ['"Cormorant Garamond"', ...defaultTheme.fontFamily.serif],
        // Clean Sans for Body
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'xxs': '0.65rem',
      }
    },
  },
  plugins: [],
};