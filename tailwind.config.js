/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.12 0 0)',
        foreground: 'oklch(0.98 0 0)',
        card: 'oklch(0.16 0 0)',
        'card-foreground': 'oklch(0.98 0 0)',
        primary: 'oklch(0.65 0.25 300)',
        'primary-foreground': 'oklch(0.98 0 0)',
        secondary: 'oklch(0.24 0 0)',
        'secondary-foreground': 'oklch(0.98 0 0)',
        muted: 'oklch(0.24 0 0)',
        'muted-foreground': 'oklch(0.6 0 0)',
        accent: 'oklch(0.65 0.25 300)',
        'accent-foreground': 'oklch(0.98 0 0)',
        border: 'oklch(0.24 0 0)',
        input: 'oklch(0.24 0 0)',
        ring: 'oklch(0.65 0.25 300)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
