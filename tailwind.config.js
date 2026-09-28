/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      colors: {
        bg: '#08090c',
        panel: '#0f1218',
        'panel-light': '#161b24',
        line: '#1e2430',
        'line-light': '#2c3546',
        accent: {
          DEFAULT: '#06b6d4', // Cyan 500
          hover: '#22d3ee',   // Cyan 400
          glow: 'rgba(6, 182, 212, 0.25)',
        },
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#60a5fa',
        },
        muted: '#8b97a8',
        // SOC Severity Colors (Consistent across app)
        sev: {
          critical: '#ef4444',
          high: '#f97316',
          medium: '#06b6d4',
          low: '#94a3b8',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.25)',
        'panel': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ticker': 'ticker 35s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
