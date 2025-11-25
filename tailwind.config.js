export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        hand: ['Patrick Hand', 'cursive'],
      },
      colors: {
        jirai: {
          dark: '#0F1115',
          panel: '#181B21',
          border: '#2D313A',
          accent: '#FF4F5E',
          secondary: '#4A9EFF',
          text: '#E0E0E0',
          muted: '#888888'
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 79, 94, 0.3)',
      }
    },
  },
  plugins: [],
}
