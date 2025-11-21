import forms from '@tailwindcss/forms';
import scrollbarHide from 'tailwind-scrollbar-hide';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/icons/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        sidebar: '260px',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        main: 'var(--main-color)',
        secondary: 'var(--secondary-color)',
        thirdly: 'var(--thirdly-color)',
        font: 'var(--font-color)',
        alert: 'var(--alert-color)',
        sub: 'var(--sub-color)',
        // Note: Using 'baseColor' instead of 'base' to avoid conflict with Tailwind's built-in 'text-base' class
        baseColor: 'var(--base-color)',
      },
    },
  },
  plugins: [forms, scrollbarHide],
} satisfies Config;
