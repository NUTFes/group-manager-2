import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import RegisterCarousel from './RegisterCarousel';

export default {
  title: 'Components/RegisterCarousel',
  tags: ['autodocs'],
  component: RegisterCarousel,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof RegisterCarousel>;

type Story = StoryObj<typeof RegisterCarousel>;

export const Default: Story = {
  args: { isOpen: true, onClose: () => alert('送信されるよ') },
};
