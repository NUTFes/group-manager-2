import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import LogoutButton from './LogoutButton';

export default {
  title: 'Components/LogoutButton/Primary', // 重複を避けるために修正
  tags: ['autodocs'],
  component: LogoutButton,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof LogoutButton>;

type Story = StoryObj<typeof LogoutButton>;

export const Default: Story = {
  args: {},
};
