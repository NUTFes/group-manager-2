import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import Header from './Header';

export default {
  title: 'Components/Header',
  tags: ['autodocs'],
  component: Header,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof Header>;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    onClick: () => alert('押されたよ'),
  },
};
