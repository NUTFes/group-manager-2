import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import TextBox from './TextBox';

export default {
  title: 'Components/TextBox',
  tags: ['autodocs'],
  component: TextBox,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof TextBox>;

type Story = StoryObj<typeof TextBox>;

export const Default: Story = {
  args: {},
};
