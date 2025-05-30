import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import Group from './Group';

export default {
  title: 'Components/Group',
  tags: ['autodocs'],
  component: Group,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof Group>;

type Story = StoryObj<typeof Group>;

export const Default: Story = {
  args: {
    isDeadline: false,
  },
};
