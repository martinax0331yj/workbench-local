/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F7F5F2',
        warm: {
          brown: '#C98762',
          light: '#F5EFEB',
        },
        mist: {
          purple: '#8D7AC5',
          blue: '#7FA5C8',
          light: '#F3F0F8',
        },
        nude: {
          pink: '#D9A3AD',
          light: '#FBF5F6',
        },
        sage: {
          green: '#83B7AA',
          light: '#F2F7F5',
        },
        apricot: {
          DEFAULT: '#E6B88A',
          light: '#FDF6EF',
        },
        text: {
          primary: '#25242A',
          secondary: '#74727D',
          muted: '#A09EA8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      fontSize: {
        'page-title': ['32px', { lineHeight: '1.25', fontWeight: '600' }],
        'section-title': ['20px', { lineHeight: '1.35', fontWeight: '600' }],
        'card-title': ['16px', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['14px', { lineHeight: '1.6' }],
        'caption': ['12px', { lineHeight: '1.5' }],
      },
      borderRadius: {
        'card': '20px',
        'btn': '12px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 2px 6px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)',
        'modal': '0 4px 24px rgba(0,0,0,0.12)',
      },
      spacing: {
        'sidebar': '240px',
        'topbar': '64px',
      },
      transitionDuration: {
        '200': '200ms',
      },
    },
  },
  plugins: [],
}
