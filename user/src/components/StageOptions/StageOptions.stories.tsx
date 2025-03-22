import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import StageOptions from './StageOptions';

export default {
  title: 'Components/StageOptions',
  tags: ['autodocs'],
  component: StageOptions,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof StageOptions>;

type Story = StoryObj<typeof StageOptions>;

export const Default: Story = {
  args: {},
};
