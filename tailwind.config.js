/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--polypuls3-primary, #8247e5)',
          foreground: 'var(--polypuls3-primary-foreground, #ffffff)',
        },
        secondary: {
          DEFAULT: 'var(--polypuls3-secondary, #64748b)',
          foreground: 'var(--polypuls3-secondary-foreground, #ffffff)',
        },
        success: {
          DEFAULT: 'var(--polypuls3-success, #22c55e)',
          foreground: 'var(--polypuls3-success-foreground, #ffffff)',
        },
        error: {
          DEFAULT: 'var(--polypuls3-error, #ef4444)',
          foreground: 'var(--polypuls3-error-foreground, #ffffff)',
        },
        background: 'var(--polypuls3-background, #ffffff)',
        foreground: 'var(--polypuls3-foreground, #0f172a)',
        border: 'var(--polypuls3-border, #e2e8f0)',
        muted: {
          DEFAULT: 'var(--polypuls3-muted, #f1f5f9)',
          foreground: 'var(--polypuls3-muted-foreground, #64748b)',
        },
      },
      borderRadius: {
        polypuls3: 'var(--polypuls3-radius, 0.5rem)',
      },
    },
  },
  plugins: [],
  prefix: 'pp-',
}
