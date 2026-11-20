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
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        main: 'var(--main-color)',
        secondary: 'var(--secondary-color)',
        thirdly: 'var(--thirdly-color)',
        font: 'var(--font-color)',
        alert: 'var(--alert-color)',
        sub: 'var(--sub-color)',
        re: 'var(--re-color)',
        // fix: text-baseが元々あるから渋々変更
        baseColor: 'var(--base-color)',
      },
    },
  },
  plugins: [forms, scrollbarHide],
} satisfies Config;
