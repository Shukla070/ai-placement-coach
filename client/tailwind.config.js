/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'leetcode-bg': '#1a1a1a',
        'leetcode-panel': '#262626',
        'leetcode-border': '#404040',
        'leetcode-text': '#e5e5e5',
        'leetcode-accent': '#0ea5e9',
      },
    },
  },
  plugins: [],
}
