/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors - flattened
        'bg-primary': '#1a1a1a',
        'bg-secondary': '#262626',
        'bg-tertiary': '#2d2d2d',
        'bg-hover': '#353535',
        // Border colors - flattened
        'border-default': '#404040',
        'border-hover': '#505050',
        'border-light': '#606060',
        // Text colors - flattened
        'text-primary': '#e5e5e5',
        'text-secondary': '#9ca3af',
        'text-tertiary': '#6b7280',
        'text-muted': '#4b5563',
        // Accent colors - flattened
        'accent-blue': '#0ea5e9',
        'accent-blue-dark': '#0284c7',
        'accent-blue-light': '#38bdf8',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
