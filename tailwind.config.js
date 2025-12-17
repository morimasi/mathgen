/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./modules/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--theme-color-primary-rgb) / <alpha-value>)',
        'primary-hover': 'rgb(var(--theme-color-primary-hover-rgb) / <alpha-value>)',
        'primary-focus': 'rgb(var(--theme-color-primary-focus-rgb) / <alpha-value>)',
        'accent-text': 'var(--theme-accent-text)',
        'accent-bg': 'var(--theme-accent-bg)',
      }
    },
  },
  plugins: [],
}