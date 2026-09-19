import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import Stage from './Stage';

export default {
  title: 'Components/Stage',
  tags: ['autodocs'],
  component: Stage,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof Stage>;

type Story = StoryObj<typeof Stage>;

export const Default: Story = {
  args: {},
};
