/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Playful, vibrant palette
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd4ff',
          300: '#8db8ff',
          400: '#5790ff',
          500: '#3068f5',
          600: '#1f4ee0',
          700: '#1a3db6',
          800: '#1b3690',
          900: '#1c3372',
        },
        grape: '#7c3aed',
        sunny: '#fbbf24',
        coral: '#fb7185',
        mint: '#34d399',
        sky: '#38bdf8',
      },
      fontFamily: {
        sans: ['"Baloo 2"', 'Nunito', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        token: '0 4px 0 0 rgba(0,0,0,0.12)',
        pop: '0 8px 24px -6px rgba(48,104,245,0.45)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(251,113,133,0.6)' },
          '100%': { boxShadow: '0 0 0 12px rgba(251,113,133,0)' },
        },
      },
      animation: {
        pop: 'pop 0.3s ease-out',
        pulseRing: 'pulseRing 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
