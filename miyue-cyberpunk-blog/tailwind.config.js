/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#050505',
        'cyber-gray': '#0a0a0a',
        'neon-cyan': '#00f3ff',
        'neon-purple': '#bc13fe',
        'matrix-green': '#00ff41',
        'alert-red': '#ff003c',
      },
      fontFamily: {
        'mono': ['"JetBrains Mono"', 'monospace'],
        'display': ['"Orbitron"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.neon-cyan"), 0 0 20px theme("colors.neon-cyan")',
        'neon-purple': '0 0 5px theme("colors.neon-purple"), 0 0 20px theme("colors.neon-purple")',
      }
    },
  },
  plugins: [],
}
