import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import NewsList from './NewsList';

export default {
  title: 'Components/NewsList',
  tags: ['autodocs'],
  component: NewsList,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof NewsList>;

type Story = StoryObj<typeof NewsList>;

export const Default: Story = {
  args: { isLoginPage: true },
};
