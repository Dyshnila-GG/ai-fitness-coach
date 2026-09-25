/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0F',
        surface: '#16161D',
        border: '#2A2A35',
        foreground: '#F5F5F7',
        muted: '#9A9AA8',
        primary: '#4ADE80',
        danger: '#F87171',
      },
    },
  },
  plugins: [],
};
