import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import LoginModal from './LoginModal';

export default {
  title: 'Components/LoginModal',
  tags: ['autodocs'],
  component: LoginModal,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof LoginModal>;

type Story = StoryObj<typeof LoginModal>;

export const Default: Story = {
  args: { isOpen: true, onClose: () => {} },
};
