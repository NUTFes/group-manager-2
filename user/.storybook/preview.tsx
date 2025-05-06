// .storybook/preview.tsx
import React from 'react';
import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import { SessionProvider } from 'next-auth/react';

const preview: Preview = {
  decorators: [
    (Story) => (
      <SessionProvider session={null}>
        <Story />
      </SessionProvider>
    ),
  ],
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.light,
    },
  },
};

export default preview;
