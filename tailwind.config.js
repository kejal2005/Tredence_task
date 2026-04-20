/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        node: {
          start:     '#22c55e',
          task:      '#3b82f6',
          approval:  '#f59e0b',
          automated: '#8b5cf6',
          end:       '#ef4444',
        },
      },
      boxShadow: {
        node: '0 2px 8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
        'node-selected': '0 0 0 2px #3b82f6, 0 4px 16px rgba(59,130,246,0.3)',
        panel: '0 4px 24px rgba(0,0,0,0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

