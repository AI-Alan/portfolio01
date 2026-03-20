import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#07070f',
          bg2: '#0d0d1a',
          card: '#0f0f1e',
          border: '#1a1a2e',
          cyan: '#00fff0',
          magenta: '#ff00ff',
          yellow: '#ffff00',
          green: '#00ff88',
          dim: '#4a4a6a',
          text: '#c8c8e8',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
        body: ['"Exo 2"', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'flicker': 'flicker 3s linear infinite',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 1s linear infinite',
        'typing': 'typing 3.5s steps(40, end), blink .75s step-end infinite',
        'border-flow': 'borderFlow 3s linear infinite',
        'matrix-rain': 'matrixRain 20s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px #00fff0, 0 0 10px #00fff0' },
          '50%': { boxShadow: '0 0 20px #00fff0, 0 0 40px #00fff0, 0 0 60px #00fff0' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.4' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)', clipPath: 'inset(0 0 0 0)' },
          '20%': { transform: 'translate(-2px, 2px)', clipPath: 'inset(30% 0 50% 0)' },
          '40%': { transform: 'translate(2px, -2px)', clipPath: 'inset(70% 0 10% 0)' },
          '60%': { transform: 'translate(-2px, 2px)', clipPath: 'inset(10% 0 80% 0)' },
          '80%': { transform: 'translate(2px, -2px)', clipPath: 'inset(50% 0 30% 0)' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        matrixRain: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(rgba(0,255,240,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,240,0.03) 1px, transparent 1px)",
        'glow-cyan': 'radial-gradient(ellipse at center, rgba(0,255,240,0.15) 0%, transparent 70%)',
        'glow-magenta': 'radial-gradient(ellipse at center, rgba(255,0,255,0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}

export default config
