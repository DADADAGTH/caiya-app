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
          DEFAULT: '#FBE703', // Lemon Yellow (Young & Energetic)
          foreground: '#000000', // Black text on yellow for high contrast
        },
        secondary: {
          DEFAULT: '#000000', // Black for bold contrast
          foreground: '#FFFFFF',
        },
        brand: {
            green: '#22C55E', // Fresh Sprout Green
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
          DEFAULT: '#FEFCE8', // Yellow 50
          foreground: '#854D0E', // Yellow 800
        },
      },
    },
  },
  plugins: [],
}
