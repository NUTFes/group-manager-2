// .storybook/preview.tsx
import React from 'react';
import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';

const preview: Preview = {
  decorators: [
    (Story) => (
      <SessionProvider session={null}>
        <Story />
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
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
