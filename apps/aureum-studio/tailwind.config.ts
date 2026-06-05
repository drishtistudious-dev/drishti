import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-fixed': 'var(--color-primary-fixed)',
        'primary-container': 'var(--color-primary-container)',
        'on-primary': 'var(--color-on-primary)',
        'on-primary-container': 'var(--color-on-primary-container)',
        surface: 'var(--color-surface)',
        'surface-container-lowest': 'var(--color-surface-container-lowest)',
        'surface-container-low': 'var(--color-surface-container-low)',
        'surface-container': 'var(--color-surface-container)',
        'surface-container-high': 'var(--color-surface-container-high)',
        'surface-container-highest': 'var(--color-surface-container-highest)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        'outline-variant': 'var(--color-outline-variant)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        sans: 'var(--font-sans)',
      },
      spacing: {
        'margin-desktop': 'var(--spacing-margin-desktop)',
        'margin-mobile': 'var(--spacing-margin-mobile)',
        gutter: 'var(--spacing-gutter)',
        'section-gap-desktop': 'var(--spacing-section-gap-desktop)',
        'section-gap-mobile': 'var(--spacing-section-gap-mobile)',
      },
      maxWidth: {
        container: 'var(--max-width-container)',
      },
      fontSize: {
        'label-md': ['12px', '16px'],
        'body-md': ['16px', '24px'],
        'body-lg': ['18px', '28px'],
      }
    },
  },
  plugins: [],
};
export default config;
