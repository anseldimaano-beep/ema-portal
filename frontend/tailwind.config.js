module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Matches the EMA EMITS College seal: deep red shield, gold band.
        primary: {
          50: '#fef2f2',
          100: '#fde3e3',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#5c1414'
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f5b301'
        }
      }
    }
  },
  plugins: []
};
