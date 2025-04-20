import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import CancelButton from './CancelButton';

export default {
  title: 'Components/CancelButton',
  tags: ['autodocs'],
  component: CancelButton,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof CancelButton>;

type Story = StoryObj<typeof CancelButton>;

export const Default: Story = {
  args: {},
};
