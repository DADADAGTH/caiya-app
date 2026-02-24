/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // Emerald 500
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F59E0B', // Amber 500
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#EF4444', // Red 500
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F3F4F6', // Gray 100
          foreground: '#6B7280', // Gray 500
        },
        accent: {
          DEFAULT: '#ECFDF5', // Emerald 50
          foreground: '#047857', // Emerald 700
        },
      },
    },
  },
  plugins: [],
}
