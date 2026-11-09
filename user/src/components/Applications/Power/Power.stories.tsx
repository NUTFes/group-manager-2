import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import Power from './Power';

export default {
  title: 'Components/Power',
  tags: ['autodocs'],
  component: Power,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof Power>;

type Story = StoryObj<typeof Power>;

export const Default: Story = {
  args: {},
};
