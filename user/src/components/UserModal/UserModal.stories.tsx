import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import UserModal from './UserModal';

export default {
  title: 'Components/UserModal',
  tags: ['autodocs'],
  component: UserModal,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof UserModal>;

type Story = StoryObj<typeof UserModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {
      console.log('Modal closed');
    },
  },
};
