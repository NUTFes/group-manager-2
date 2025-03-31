import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import NotifyList from './NotifyList';

export default {
  title: 'Components/NotifyList',
  tags: ['autodocs'],
  component: NotifyList,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof NotifyList>;

type Story = StoryObj<typeof NotifyList>;

export const Default: Story = {
  args: { isLoginPage: true },
};
